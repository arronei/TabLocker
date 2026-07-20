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

- Write all code, identifiers, comments, and docs in US English.
- Code comments are terse and only explain non-obvious WHY, not WHAT. Test files get more
  explanatory comments than production code, since they double as behavior documentation - see
  `src/background/url.test.ts` for the expected tone.
- Lean-tooling bias: prefer stdlib/native/already-decided tooling over adding a new dependency.
  Node's built-in test runner and c8 were chosen over Vitest/Jest for exactly this reason - don't
  reintroduce a test framework or bundler without a strong reason.
- `build.js` and every file under `src/**/*.ts` must start with the copyright header enforced by
  `eslint-plugin-headers`: `// Copyright (C) Arron Eicholz. Licensed under the MIT License.`
  followed by a blank line.
- Keep changes scoped to the single package layout; don't introduce a monorepo/workspaces
  structure.
