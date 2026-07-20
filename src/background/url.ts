// Copyright (C) Arron Eicholz. Licensed under the MIT License.

// Normalizes a URL for home-page/history comparisons: drops the fragment and
// any trailing slash on the path, so "https://x.com/#a" and "https://x.com/"
// are treated as the same page.
export const normalizeUrl = (url: string): string => {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.pathname = parsed.pathname.replace(/\/$/, "");
  return parsed.toString();
};
