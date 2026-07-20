# TabLocker

Cross-browser extension that locks a tab to a home page and tracks that tab's browsing history from that point.

[![CI](https://github.com/arronei/TabLocker/actions/workflows/ci.yml/badge.svg)](https://github.com/arronei/TabLocker/actions/workflows/ci.yml) [![Codecov](https://codecov.io/gh/arronei/TabLocker/branch/main/graph/badge.svg)](https://codecov.io/gh/arronei/TabLocker) [![Docs](https://img.shields.io/badge/docs-.%2Fdocs-blue)](./docs) [![Release Notes](https://img.shields.io/badge/release%20notes-GitHub%20Releases-blue)](https://github.com/arronei/TabLocker/releases) [![Dashboards](https://img.shields.io/badge/dashboards-live-blue)](https://arronei.github.io/TabLocker/)

## Overview

TabLocker is a Manifest V3 browser extension. When you lock a tab to a home page, TabLocker
records that tab's browsing history from that point forward, so you can review where a locked
tab has been without losing track of its intended starting point.

Supported browsers:

- Chrome / Edge (Chromium, Manifest V3)
- Firefox (Manifest V3, via `manifest.firefox.json` overlay)

The build produces separate output bundles per browser: `dist/chrome` and `dist/firefox`.

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, build, lint, and test instructions.

## License

Released under the [MIT License](./LICENSE).
