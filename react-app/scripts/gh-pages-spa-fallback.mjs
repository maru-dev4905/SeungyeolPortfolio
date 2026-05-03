import { copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, "..", "dist");
const indexHtml = join(dist, "index.html");
const notFoundHtml = join(dist, "404.html");

if (!existsSync(indexHtml)) {
  console.warn("[gh-pages-spa-fallback] dist/index.html 없음 — 건너뜀");
  process.exit(0);
}

copyFileSync(indexHtml, notFoundHtml);
console.log("[gh-pages-spa-fallback] dist/404.html ← index.html (GitHub Pages SPA)");
