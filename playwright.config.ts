// Copyright (C) Arron Eicholz. Licensed under the MIT License.

import { defineConfig } from "@playwright/test";

// e2e tests load the unpacked dist/chrome extension (see e2e/fixtures.ts), so
// `yarn build` runs first via the "pretest:e2e" package.json script.
export default defineConfig({
  reporter: "list",
  testDir: "./e2e",
  workers: 1,
});
