# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## Project overview

TabLocker is a cross-browser Manifest V3 browser extension (Chrome, Edge, Firefox) that locks a
tab to a home page and tracks that tab's browsing history from the point it was locked. Single
package, no monorepo. Firefox is a real build target; Safari is out of scope for code.

## Tech stack

- TypeScript, built with esbuild via a hand-rolled `build.js` (no Vite, no webpack).
- Node's built-in test runner (`node --test`) for unit tests, with c8 for coverage.
- Playwright for e2e tests, driving the unpacked built extension in Chromium.
- ESLint (`typescript-eslint` + `eslint-plugin-perfectionist` for import/key sorting) and
  Prettier for JS/TS/JSON/Markdown; Stylelint for CSS; `web-ext lint` for extension-specific
  checks.
- `webextension-polyfill` is the one runtime dependency, for cross-browser `browser.*` APIs.
- Node 22 pinned (`engines.node >=22`), Yarn Classic (v1).
- GitHub Actions CI (lint, typecheck, unit+coverage, build, e2e), Codecov, and a GitHub Pages
  `dashboards/` landing page built from `pages/index.html` plus the c8 HTML report.
- Releases are driven by release-please off Conventional Commit PR titles; PR titles are enforced
  by `amannn/action-semantic-pull-request`. main is squash-merge only, squash commit message is
  the PR title, branches auto-delete, history is linear.

## Directory layout

- `src/background/` - MV3 service worker (`index.ts`) and its helpers (e.g. `url.ts`,
  URL normalization for home-page/history comparisons).
- `src/history/` - the tab's history view (`index.html`, `index.ts`, `style.css`).
- `src/popup/` - the extension popup (`index.html`, `index.ts`, `style.css`).
- `src/popup/views/` - popup sub-views: `home.ts`, `edit-homepage.ts`, `history.ts`, `about.ts`.
- `*.test.ts` files live next to the source they test (e.g. `src/background/url.test.ts`), not in
  a separate test tree.
- `e2e/` - Playwright specs and shared fixtures (`fixtures.ts` launches the built
  `dist/chrome` extension unpacked via a persistent browser context).
- `public/icons/` - extension icons, copied into each browser's build output.
- `manifest.json` - base MV3 manifest; `manifest.firefox.json` is a partial overlay merged on
  top of it for the Firefox build (currently just `browser_specific_settings.gecko`).
- `pages/index.html` - the GitHub Pages dashboards landing page, deployed alongside the coverage
  report by CI.
- `build.js` - the build script; bundles each entry point with esbuild, copies static HTML/CSS
  and icons, merges the per-browser manifest, and writes everything to `dist/<browser>/`.

## Dev commands

- `yarn build` - build all browser targets into `dist/chrome/` and `dist/firefox/`.
- `yarn typecheck` - `tsc --noEmit`.
- `yarn lint` - ESLint over the repo plus Stylelint over `src/**/*.css`.
- `yarn lint:ext` - `web-ext lint` against `dist/firefox`.
- `yarn test:unit` - run `*.test.ts` files under `src/` with Node's built-in test runner.
- `yarn test:unit:coverage` - the above under c8, emitting lcov + text coverage.
- `yarn test:e2e` - Playwright e2e tests; the `pretest:e2e` hook runs `yarn build` first so
  `dist/chrome` is fresh.
- `yarn format` / `yarn format:check` - Prettier write/check across the repo.

## Behavioral guidelines

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```pseudocode
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

## Dos and Don'ts

### Do

- Write code, identifiers, comments, and docs in American English everywhere - code, comments,
  JSDoc, UI copy, commit messages (`color`, `behavior`, `center`, `canceled`, not `colour`,
  `behaviour`, `centre`, `cancelled`).
- Keep code comments terse, explaining only the WHY, not the WHAT - and only when the reason
  isn't obvious from the code itself. Test files can carry more explanatory comments, since they
  double as behavior documentation.
- Prefer stdlib/native/already-decided tooling over adding a new dependency. Node's built-in test
  runner and c8 were chosen over Vitest/Jest for exactly this reason - don't reintroduce a test
  framework or bundler without a strong reason.
- Start `build.js` and every file under `src/**/*.ts` with the copyright header enforced by
  `eslint-plugin-headers`: `// Copyright (C) Arron Eicholz. Licensed under the MIT License.`
  followed by a blank line.
- Style elements with CSS classes, in the stylesheet colocated with the view (e.g.
  `src/popup/style.css`, `src/history/style.css`).
- Give every function in a `.ts` file a JSDoc block, with a `@param` line per argument and a
  `@returns`, so VSCode surfaces parameter help on hover and at the call site. A component's props
  are documented by its `Props` interface, so the component's own JSDoc needs only a summary, not
  a `@param` per prop.

### Don't

- Don't introduce a monorepo/workspaces structure - keep changes scoped to the single package
  layout.
- Don't add comments to CSS files.
- Don't use inline styles.
- Don't add inline code comments unless the logic is genuinely complex or unusual.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
