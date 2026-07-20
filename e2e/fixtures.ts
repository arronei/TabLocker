// Copyright (C) Arron Eicholz. Licensed under the MIT License.

// Shared fixture for e2e tests: launches Chromium with the built dist/chrome
// extension loaded unpacked, and resolves its `chrome-extension://<id>` origin
// from the MV3 background service worker. Extensions require a persistent
// context - they can't be loaded into a normal `browser.newContext()`.
import { test as base, type BrowserContext, chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pathToExtension = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist",
  "chrome",
);

export const test = base.extend<{ context: BrowserContext; extensionId: string }>({
  // Playwright requires object destructuring in the first param to statically
  // detect requested fixtures, even when none are used.
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        // Passing new headless Chromium's flag directly - rather than
        // Playwright's own `headless: true` - is what actually loads
        // extensions; Playwright's headless mode still doesn't. No display
        // server (xvfb) needed in CI with this approach.
        "--headless=new",
      ],
      headless: false,
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [worker] = context.serviceWorkers();
    worker ??= await context.waitForEvent("serviceworker");
    await use(worker.url().split("/")[2]);
  },
});

export const { expect } = test;
