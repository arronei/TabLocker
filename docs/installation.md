# Installation (development)

TabLocker isn't published to any extension store yet. To try it, build it locally and load it as
an unpacked/temporary extension.

## Build

```sh
yarn install
yarn build
```

This runs `node build.js`, which produces browser-specific output directories:

- `dist/chrome` — for Chrome and Edge
- `dist/firefox` — for Firefox

## Chrome / Edge

1. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `dist/chrome` directory.

## Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select any file inside `dist/firefox` (e.g. `dist/firefox/manifest.json`).

Note: Firefox temporary add-ons are removed when Firefox restarts, so you'll need to reload the
add-on each session.
