# Contributing to TabLocker

Thanks for your interest in contributing. This is a small project, so the process is intentionally lightweight.

## Prerequisites

- Node.js 22 or later
- Yarn Classic (v1). If you have [Corepack](https://nodejs.org/api/corepack.html) available, run `corepack enable` and Yarn will be provisioned automatically. Otherwise install Yarn 1.x per the [Yarn Classic install docs](https://classic.yarnpkg.com/en/docs/install).

## Setup

```sh
yarn install
```

This installs dependencies using the committed `yarn.lock` (CI runs `yarn install --frozen-lockfile`, so keep the lockfile in sync with `package.json`).

## Common commands

| Command                   | What it does                                                         |
| ------------------------- | -------------------------------------------------------------------- |
| `yarn lint`               | ESLint over the repo plus Stylelint over `src/**/*.css`              |
| `yarn typecheck`          | `tsc --noEmit`                                                       |
| `yarn test:unit`          | Runs unit tests (`src/**/*.test.ts`) via Node's built-in test runner |
| `yarn test:unit:coverage` | Same as above, with c8 coverage (lcov + text)                        |
| `yarn build`              | Builds the extension (`build.js`)                                    |
| `yarn test:e2e`           | Builds the extension then runs Playwright e2e tests                  |
| `yarn format`             | Formats the repo with Prettier                                       |
| `yarn format:check`       | Checks formatting without writing changes                            |

Run `yarn format` and `yarn lint` before committing — formatting and lint issues are the most common reason a PR fails CI.

## Copyright header on new source files

Any new file under `src/**/*.ts` (or `build.js`) must start with:

```ts
// Copyright (C) Arron Eicholz. Licensed under the MIT License.
```

This is enforced by `eslint-plugin-headers` (see `eslint.config.js`); `yarn lint` will fail without it.

## PR titles and Conventional Commits

Because this repo squash-merges every PR (see below), **the PR title becomes the commit message on `main`**. PR titles are checked automatically by a required status check (`amannn/action-semantic-pull-request`) and must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(optional-scope): description
```

Examples:

- `feat: add per-tab lock indicator`
- `fix(popup): correct history ordering`
- `docs: add CONTRIBUTING.md`

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

This isn't just style — `release-please` reads the commit history on `main` to decide version bumps and generate the changelog, so an inaccurate or malformed PR title will produce an inaccurate release. Take a moment to get it right; the check will block merging otherwise.

## Squash-merge-only workflow

`main` is protected: PRs can only be merged via squash-merge, and the squash commit message is the PR title alone. Practically, this means:

- You don't need to clean up or rebase your branch's commit history — only the final PR title matters.
- Each merged PR becomes exactly one commit on `main`.
- Branches are auto-deleted after merge.
- `main` requires a linear history (no merge commits) and disallows force-push/deletion.
- PRs need conversations resolved and passing required status checks (`ci` and `check`) before merge.

## Before opening a PR

CI runs `yarn lint`, `yarn typecheck`, `yarn test:unit:coverage`, `yarn build`, and `yarn test:e2e` on every PR. Run these locally first so you catch failures before pushing:

```sh
yarn lint
yarn typecheck
yarn test:unit:coverage
yarn build
yarn test:e2e
```
