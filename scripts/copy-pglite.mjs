// Copies the PGlite browser build into public/vendor/pglite so it is served
// same-origin. CRA's webpack cannot bundle PGlite (it contains a dynamic
// `import("node:module")`), so the app loads it with a webpackIgnore'd import.
// Only the in-memory core is copied: no extension archives, fs backends or maps.
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "@electric-sql", "pglite", "dist");
const dest = join(root, "public", "vendor", "pglite");

const isCoreFile = (name) =>
  name === "index.js" ||
  /^chunk-[A-Z0-9]+\.js$/.test(name) ||
  name === "pglite.wasm" ||
  name === "pglite.data" ||
  name === "initdb.wasm";

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter(isCoreFile);
for (const name of files) copyFileSync(join(src, name), join(dest, name));

// Uncompressed sizes of the binaries the client downloads itself, for the
// progress display (Content-Length is unreliable once the host gzips them).
const binaries = ["pglite.wasm", "initdb.wasm", "pglite.data"];
const sizes = Object.fromEntries(binaries.map((name) => [name, statSync(join(dest, name)).size]));
writeFileSync(join(dest, "manifest.json"), JSON.stringify({ sizes }, null, 2) + "\n");

console.log(`copy-pglite: ${files.length} files + manifest.json -> public/vendor/pglite`);
