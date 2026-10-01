import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, ".vercel", "output");
const staticDir = path.join(outputDir, "static");
const assetsDir = path.join(staticDir, "assets");

if (!fs.existsSync(assetsDir)) {
  console.log("[finalize-vercel-build] No assets directory found, skipping patch.");
  process.exit(0);
}

const assetFiles = fs.readdirSync(assetsDir);
const cssFile = assetFiles.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
const jsFile = assetFiles.find((f) => f.startsWith("index-") && f.endsWith(".js"));

console.log("[finalize-vercel-build] Detected CSS:", cssFile);
console.log("[finalize-vercel-build] Detected JS:", jsFile);

if (!jsFile) {
  console.error("[finalize-vercel-build] Could not find client index-*.js bundle!");
  process.exit(1);
}

const baseHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ORB-LITE | Rastreo GPS Satelital</title>
    <meta name="description" content="Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial." />
    <meta property="og:title" content="ORB-LITE | Rastreo GPS Satelital" />
    <meta property="og:description" content="Sistema de rastreo satelital GPS en tiempo real para vehículos, flotas y empresas. Monitoreo en vivo, apagado de motor, reportes, gestión de rutas y catálogo oficial." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsFile}"></script>
  </body>
</html>`;

// 1. Write .vercel/output/static/index.html so Vercel CDN serves it directly
const staticIndexHtml = path.join(staticDir, "index.html");
fs.writeFileSync(staticIndexHtml, baseHtml, "utf8");
console.log("[finalize-vercel-build] Successfully created", staticIndexHtml);

// 2. Also patch .vercel/output/functions/__server.func/_chunks/renderer-template.mjs if present
const rendererChunkPath = path.join(
  outputDir,
  "functions",
  "__server.func",
  "_chunks",
  "renderer-template.mjs",
);

if (fs.existsSync(rendererChunkPath)) {
  let content = fs.readFileSync(rendererChunkPath, "utf8");
  const escapedHtml = JSON.stringify(baseHtml);
  content = content.replace(
    /new HTTPResponse\([\s\S]*?,\s*\{\s*headers:\s*\{\s*"content-type":\s*"text\/html; charset=utf-8"\s*\}\s*\}\)/,
    `new HTTPResponse(${escapedHtml}, { headers: { "content-type": "text/html; charset=utf-8" } })`,
  );
  fs.writeFileSync(rendererChunkPath, content, "utf8");
  console.log("[finalize-vercel-build] Successfully patched", rendererChunkPath);
}
