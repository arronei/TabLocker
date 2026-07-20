// Hand-rolled build: bundles each entry point with esbuild and assembles a per-browser dist/<browser>
// folder (manifest + static HTML/CSS/icons). No bundler plugin ecosystem - see issue #2 for why.
import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = "dist";
const BROWSERS = ["chrome", "firefox"];

const ENTRY_POINTS = {
  "background/index": "src/background/index.ts",
  "popup/index": "src/popup/index.ts",
  "history/index": "src/history/index.ts",
};

const STATIC_FILES = [
  ["src/popup/index.html", "popup/index.html"],
  ["src/popup/style.css", "popup/style.css"],
  ["src/history/index.html", "history/index.html"],
  ["src/history/style.css", "history/style.css"],
];

async function loadManifest(browser) {
  const base = JSON.parse(await readFile("manifest.json", "utf8"));
  try {
    const overlay = JSON.parse(await readFile(`manifest.${browser}.json`, "utf8"));
    return { ...base, ...overlay };
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return base;
  }
}

async function buildBrowser(browser) {
  const outDir = path.join(OUT_DIR, browser);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  await build({
    entryPoints: ENTRY_POINTS,
    outdir: outDir,
    bundle: true,
    format: "esm",
    target: "es2022",
    sourcemap: true,
  });

  for (const [from, to] of STATIC_FILES) {
    const dest = path.join(outDir, to);
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(from, dest);
  }

  await cp("public/icons", path.join(outDir, "icons"), {
    recursive: true,
    filter: (src) => !src.endsWith(".gitkeep"),
  });

  const manifest = await loadManifest(browser);
  await writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
}

for (const browser of BROWSERS) {
  await buildBrowser(browser);
  console.log(`built ${OUT_DIR}/${browser}`);
}
