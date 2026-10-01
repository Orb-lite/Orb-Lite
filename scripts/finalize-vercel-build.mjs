import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, ".vercel", "output");
const staticDir = path.join(outputDir, "static");
const staticIndexHtml = path.join(staticDir, "index.html");

// 1. Remove static index.html so Vercel forwards page requests to __server.func (SSR)
if (fs.existsSync(staticIndexHtml)) {
  fs.unlinkSync(staticIndexHtml);
  console.log("[finalize-vercel-build] Removed static index.html to allow SSR execution.");
}

// 2. Patch react.mjs in __server.func/_libs to support jsxDEV in production SSR
const reactLibsPath = path.join(
  outputDir,
  "functions",
  "__server.func",
  "_libs",
  "react.mjs",
);

if (fs.existsSync(reactLibsPath)) {
  let content = fs.readFileSync(reactLibsPath, "utf8");
  if (!content.includes('import React from "react"')) {
    content = `import { t as __commonJSMin } from "../_runtime.mjs";\nimport React from "react";\nvar require_react_jsx_dev_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {\n\texports.Fragment = Symbol.for("react.fragment");\n\texports.jsxDEV = (type, props, key) => React.createElement(type, key !== void 0 ? { ...props, key } : props);\n}));\nvar require_jsx_dev_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {\n\tmodule.exports = require_react_jsx_dev_runtime_production();\n}));\nexport { require_jsx_dev_runtime as t };\n`;
    fs.writeFileSync(reactLibsPath, content, "utf8");
    console.log("[finalize-vercel-build] Patched jsxDEV fallback in", reactLibsPath);
  }
}

// 3. Wire SSR in renderer-template.mjs
const rendererChunkPath = path.join(
  outputDir,
  "functions",
  "__server.func",
  "_chunks",
  "renderer-template.mjs",
);

if (fs.existsSync(rendererChunkPath)) {
  let content = fs.readFileSync(rendererChunkPath, "utf8");
  const replacementFn = `async function renderIndexHTML(event) {
\tconst ssr = globalThis.__nitro_vite_envs__?.["ssr"];
\tif (ssr) {
\t\ttry {
\t\t\tconst res = await ssr.fetch(event.req);
\t\t\tif (res && res.status < 400) return res;
\t\t} catch (err) {
\t\t\tconsole.error("[SSR error in renderIndexHTML]:", err);
\t\t}
\t}
\treturn rendererTemplate(event.req);
}`;

  content = content.replace(/(?:async\s+)*function renderIndexHTML\(event\)[\s\S]*?return rendererTemplate\(event\.req\);[\s\S]*?\}/, replacementFn);
  fs.writeFileSync(rendererChunkPath, content, "utf8");
  console.log("[finalize-vercel-build] Successfully wired SSR fetch in", rendererChunkPath);
}

console.log("[finalize-vercel-build] All patches applied successfully.");
