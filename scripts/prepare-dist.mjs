import fs from "node:fs";
import path from "node:path";

export function prepareDist() {
  const rootDir = process.cwd();
  const outputDir = path.join(rootDir, ".output");
  const outputPublicDir = path.join(outputDir, "public");
  const outputServerDir = path.join(outputDir, "server");
  const distDir = path.join(rootDir, "dist");
  const vercelOutputDir = path.join(rootDir, ".vercel", "output");
  const vercelStaticDir = path.join(vercelOutputDir, "static");
  const vercelServerFuncDir = path.join(vercelOutputDir, "functions", "__server.func");

  console.log("[prepare-dist] Preparing build outputs for AI Studio and Vercel...");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 1. Copy all static/public files from .output/public or .vercel/output/static to dist
  if (fs.existsSync(outputPublicDir)) {
    console.log("[prepare-dist] Copying .output/public to dist...");
    fs.cpSync(outputPublicDir, distDir, { recursive: true });
  } else if (fs.existsSync(vercelStaticDir)) {
    console.log("[prepare-dist] Copying .vercel/output/static to dist...");
    fs.cpSync(vercelStaticDir, distDir, { recursive: true });
  }

  // 2. Also copy public/ directory if files were missed
  const publicDir = path.join(rootDir, "public");
  if (fs.existsSync(publicDir)) {
    console.log("[prepare-dist] Ensuring public/ assets are in dist...");
    fs.cpSync(publicDir, distDir, { recursive: true });
    if (fs.existsSync(vercelStaticDir)) {
      fs.cpSync(publicDir, vercelStaticDir, { recursive: true });
    }
  }

  // 3. Copy server files to dist/server, dist/.output, and api/server so Vercel Serverless Function & Full-Stack work
  const serverSourceDir = fs.existsSync(outputServerDir)
    ? outputServerDir
    : fs.existsSync(vercelServerFuncDir)
    ? vercelServerFuncDir
    : null;

  if (serverSourceDir) {
    console.log(`[prepare-dist] Copying server from ${serverSourceDir}...`);
    fs.mkdirSync(path.join(distDir, "server"), { recursive: true });
    fs.cpSync(serverSourceDir, path.join(distDir, "server"), { recursive: true });

    const apiServerDir = path.join(rootDir, "api", "server");
    fs.mkdirSync(apiServerDir, { recursive: true });
    fs.cpSync(serverSourceDir, apiServerDir, { recursive: true });

    const distApiServerDir = path.join(distDir, "api", "server");
    fs.mkdirSync(distApiServerDir, { recursive: true });
    fs.cpSync(serverSourceDir, distApiServerDir, { recursive: true });
  }

  if (fs.existsSync(outputDir)) {
    console.log("[prepare-dist] Copying .output to dist/.output...");
    fs.mkdirSync(path.join(distDir, ".output"), { recursive: true });
    fs.cpSync(outputDir, path.join(distDir, ".output"), { recursive: true });
  }

  // 4. Generate a valid, robust index.html
  const rootIndexHtml = path.join(rootDir, "index.html");
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

  // Find built CSS and JS assets across dist/assets, .vercel/output/static/assets, or .output/public/assets
  const possibleAssetDirs = [
    path.join(distDir, "assets"),
    path.join(vercelStaticDir, "assets"),
    path.join(outputPublicDir, "assets"),
  ];

  let cssLinks = "";
  let jsScripts = "";

  for (const assetDir of possibleAssetDirs) {
    if (fs.existsSync(assetDir)) {
      const assetFiles = fs.readdirSync(assetDir);

      const cssFiles = assetFiles.filter((f) => f.endsWith(".css"));
      for (const css of cssFiles) {
        if (!cssLinks.includes(css)) {
          cssLinks += `\n    <link rel="stylesheet" href="/assets/${css}" />`;
        }
      }

      // Find index-*.js or main bundle
      const indexJs = assetFiles.find((f) => f.startsWith("index-") && f.endsWith(".js"));
      if (indexJs && !jsScripts) {
        jsScripts += `\n    <script type="module" src="/assets/${indexJs}"></script>`;
      }
    }
  }

  // Replace original dev script in index.html with the built bundles
  htmlContent = htmlContent.replace(/<script[^>]*src="\/src\/main\.[jt]sx?"[^>]*><\/script>/gi, "");

  if (cssLinks && !htmlContent.includes('rel="stylesheet"')) {
    htmlContent = htmlContent.replace("</head>", `${cssLinks}\n  </head>`);
  }

  const tsrBootstrap = `<script>
    window.$_TSR = window.$_TSR || {
      h: function () { this.hydrated = true; if (this.c) this.c(); },
      e: function () { this.streamEnded = true; if (this.c) this.c(); },
      c: function () { if (this.hydrated && this.streamEnded) { delete window.$_TSR; if (window.$R) delete window.$R.tsr; } },
      p: function (fn) { if (this.initialized) fn(); else this.buffer.push(fn); },
      buffer: [],
      t: new Map(),
      initialized: true,
      router: {
        manifest: {},
        matches: []
      }
    };
    window.$R = window.$R || {};
  </script>`;

  if (jsScripts) {
    if (!htmlContent.includes("window.$_TSR")) {
      htmlContent = htmlContent.replace("</body>", `${tsrBootstrap}
    ${jsScripts}
  </body>`);
    } else {
      htmlContent = htmlContent.replace("</body>", `${jsScripts}
  </body>`);
    }
  }

  // Write compiled HTML to dist/index.html AND .vercel/output/static/index.html
  const distIndexHtml = path.join(distDir, "index.html");
  fs.writeFileSync(distIndexHtml, htmlContent, "utf8");
  console.log("[prepare-dist] dist/index.html generated successfully.");

  if (fs.existsSync(vercelStaticDir)) {
    const vercelIndexHtml = path.join(vercelStaticDir, "index.html");
    fs.writeFileSync(vercelIndexHtml, htmlContent, "utf8");
    console.log("[prepare-dist] .vercel/output/static/index.html generated successfully.");
  }

  // Also sync assets to .vercel/output/static/assets if needed
  if (fs.existsSync(path.join(distDir, "assets")) && fs.existsSync(vercelStaticDir)) {
    fs.cpSync(path.join(distDir, "assets"), path.join(vercelStaticDir, "assets"), { recursive: true });
  }

  // 5. Patch Nitro and Vercel renderer-template.mjs so SSR responses never send /src/main.js or /src/main.tsx
  const templateLocations = [
    path.join(vercelServerFuncDir, "_chunks", "renderer-template.mjs"),
    path.join(outputServerDir, "_chunks", "renderer-template.mjs"),
    path.join(distDir, "server", "_chunks", "renderer-template.mjs"),
    path.join(distDir, ".output", "server", "_chunks", "renderer-template.mjs"),
  ];

  for (const tmplPath of templateLocations) {
    if (fs.existsSync(tmplPath)) {
      try {
        const code = fs.readFileSync(tmplPath, "utf8");
        const updatedCode = code.replace(
          /var rendererTemplate = \(\) => new HTTPResponse\("[\s\S]*?", \{ headers: \{ "content-type": "text\/html; charset=utf-8" \} \}\);/,
          `var rendererTemplate = () => new HTTPResponse(${JSON.stringify(htmlContent)}, { headers: { "content-type": "text/html; charset=utf-8" } });`,
        );
        fs.writeFileSync(tmplPath, updatedCode, "utf8");
        console.log(`[prepare-dist] Patched renderer template at ${tmplPath}`);
      } catch (err) {
        console.warn(`[prepare-dist] Could not patch renderer template at ${tmplPath}:`, err);
      }
    }
  }

  // 6. Fix any (void 0)( broken calls in Vercel serverless function SSR files
  const vercelSsrDir = path.join(vercelServerFuncDir, "_ssr");
  if (fs.existsSync(vercelSsrDir)) {
    try {
      const ssrFiles = fs.readdirSync(vercelSsrDir).filter((f) => f.endsWith(".mjs"));
      let patchedCount = 0;
      for (const file of ssrFiles) {
        const filePath = path.join(vercelSsrDir, file);
        let code = fs.readFileSync(filePath, "utf8");
        if (code.includes("(void 0)(")) {
          code = code.replaceAll("(void 0)(", "import_jsx_dev_runtime.jsxDEV(");
          fs.writeFileSync(filePath, code, "utf8");
          patchedCount++;
        }
      }
      if (patchedCount > 0) {
        console.log(`[prepare-dist] Patched (void 0)( in ${patchedCount} Vercel SSR files.`);
      }
    } catch (e) {
      console.warn("[prepare-dist] Error patching Vercel SSR files:", e);
    }
  }

  // 7. Create a standalone start entry in dist/server.js
  const serverJsContent = `// Standalone entry for AI Studio and Cloud Run
import "./server/index.mjs";
`;
  fs.writeFileSync(path.join(distDir, "server.js"), serverJsContent, "utf8");

  console.log("[prepare-dist] Build artifacts successfully prepared for both AI Studio and Vercel!");
}

prepareDist();

