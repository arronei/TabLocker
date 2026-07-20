// Copyright (C) Arron Eicholz. Licensed under the MIT License.

// Example e2e test (see issue #3/#13): loads the built extension unpacked
// and opens the popup page directly at its chrome-extension:// origin, since
// Playwright can't click the toolbar action button itself.
import { expect, test } from "./fixtures.ts";

test("popup page loads", async ({ context, extensionId }) => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup/index.html`);

  await expect(page).toHaveTitle("TabLocker");
  await expect(page.locator("#app")).toBeAttached();
});
