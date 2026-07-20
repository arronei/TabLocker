// Copyright (C) Arron Eicholz. Licensed under the MIT License.

// Example unit test for the Node built-in test runner (see issue #3/#13):
// run with `yarn test:unit`. Verbose comments are intentional here - test
// files double as behavior documentation per the wayfinder map.
import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeUrl } from "./url.ts";

test("normalizeUrl strips the fragment", () => {
  assert.equal(normalizeUrl("https://example.com/path#section"), "https://example.com/path");
});

test("normalizeUrl strips a trailing slash from the path", () => {
  assert.equal(normalizeUrl("https://example.com/path/"), "https://example.com/path");
});

test("normalizeUrl leaves the root path's single slash alone", () => {
  assert.equal(normalizeUrl("https://example.com/"), "https://example.com/");
});
