// Copyright (C) Arron Eicholz. Licensed under the MIT License.

import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "dist";
const BROWSERS = ["chrome", "firefox"];

const ENTRY_POINTS = {
  "background/index": "src/background/index.ts",
  "history/index": "src/history/index.ts",
  "popup/index": "src/popup/index.ts",
};

const STATIC_FILES = [
  ["src/popup/index.html", "popup/index.html"],
  ["src/popup/style.css", "popup/style.css"],
  ["src/history/index.html", "history/index.html"],
  ["src/history/style.css", "history/style.css"],
];

const loadManifest = async (browser) => {
  const base = JSON.parse(await readFile("manifest.json", "utf8"));
  try {
    const overlay = JSON.parse(await readFile(`manifest.${browser}.json`, "utf8"));
    return { ...base, ...overlay };
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    return base;
  }
};

const buildBrowser = async (browser) => {
  const outDir = path.join(OUT_DIR, browser);
  await rm(outDir, { force: true, recursive: true });
  await mkdir(outDir, { recursive: true });

  await build({
    bundle: true,
    entryPoints: ENTRY_POINTS,
    format: "esm",
    outdir: outDir,
    sourcemap: true,
    target: "es2022",
  });

  await Promise.all(
    STATIC_FILES.map(async ([from, to]) => {
      const dest = path.join(outDir, to);
      await mkdir(path.dirname(dest), { recursive: true });
      await cp(from, dest);
    }),
  );

  await cp("public/icons", path.join(outDir, "icons"), {
    filter: (src) => !src.endsWith(".gitkeep"),
    recursive: true,
  });

  const manifest = await loadManifest(browser);
  await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
};

await Promise.all(
  BROWSERS.map(async (browser) => {
    await buildBrowser(browser);
    console.log(`built ${OUT_DIR}/${browser}`);
  }),
);
