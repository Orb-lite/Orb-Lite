import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, ".output");
const outputPublicDir = path.join(outputDir, "public");
const outputServerDir = path.join(outputDir, "server");
const distDir = path.join(rootDir, "dist");

console.log("[prepare-dist] Creating dist directory...");
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy all static/public files from .output/public to dist
if (fs.existsSync(outputPublicDir)) {
  console.log("[prepare-dist] Copying .output/public to dist...");
  fs.cpSync(outputPublicDir, distDir, { recursive: true });
}

// 2. Also copy public/ directory if files were missed
const publicDir = path.join(rootDir, "public");
if (fs.existsSync(publicDir)) {
  console.log("[prepare-dist] Ensuring public/ assets are in dist...");
  fs.cpSync(publicDir, distDir, { recursive: true });
}

// 3. Copy server files to dist/server and dist/.output so full-stack / SSR works
if (fs.existsSync(outputServerDir)) {
  console.log("[prepare-dist] Copying .output/server to dist/server...");
  fs.mkdirSync(path.join(distDir, "server"), { recursive: true });
  fs.cpSync(outputServerDir, path.join(distDir, "server"), { recursive: true });
}
if (fs.existsSync(outputDir)) {
  console.log("[prepare-dist] Copying .output to dist/.output...");
  fs.mkdirSync(path.join(distDir, ".output"), { recursive: true });
  fs.cpSync(outputDir, path.join(distDir, ".output"), { recursive: true });
}

// 4. Generate a valid, robust dist/index.html
const rootIndexHtml = path.join(rootDir, "index.html");
const distIndexHtml = path.join(distDir, "index.html");

let htmlContent = "";
if (fs.existsSync(rootIndexHtml)) {
  htmlContent = fs.readFileSync(rootIndexHtml, "utf8");
} else {
  htmlContent = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ORB-LITE | Rastreo GPS Satelital</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
}

// Find built CSS and JS assets in dist/assets
const assetsDir = path.join(distDir, "assets");
let cssLinks = "";
let jsScripts = "";

if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);

  const cssFiles = assetFiles.filter((f) => f.endsWith(".css"));
  for (const css of cssFiles) {
    cssLinks += `\n    <link rel="stylesheet" href="/assets/${css}" />`;
  }

  // Find index-*.js or main bundle
  const indexJs = assetFiles.find((f) => f.startsWith("index-") && f.endsWith(".js"));
  if (indexJs) {
    jsScripts += `\n    <script type="module" src="/assets/${indexJs}"></script>`;
  }
}

// Replace original dev script in index.html with the built bundles
htmlContent = htmlContent.replace(/<script[^>]*src="\/src\/main\.[jt]sx?"[^>]*><\/script>/gi, "");

if (cssLinks && !htmlContent.includes("rel=\"stylesheet\"")) {
  htmlContent = htmlContent.replace("</head>", `${cssLinks}\n  </head>`);
}

if (jsScripts) {
  htmlContent = htmlContent.replace("</body>", `${jsScripts}\n  </body>`);
}

fs.writeFileSync(distIndexHtml, htmlContent, "utf8");
console.log("[prepare-dist] dist/index.html generated successfully.");

// 5. Create a standalone start entry in dist/server.js
const serverJsContent = `// Standalone entry for AI Studio and Cloud Run
import "./server/index.mjs";
`;
fs.writeFileSync(path.join(distDir, "server.js"), serverJsContent, "utf8");

console.log("[prepare-dist] Build artifacts successfully prepared in dist/!");
