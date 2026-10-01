import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(rootDir, ".vercel", "output");
const staticDir = path.join(outputDir, "static");
const assetsDir = path.join(staticDir, "assets");
const serverFuncDir = path.join(outputDir, "functions", "__server.func");

console.log("[finalize-vercel-build] Project root:", rootDir);

// 1. Detect CSS and JS client bundles for fallback
let cssFile = "";
let jsFile = "";
if (fs.existsSync(assetsDir)) {
  const files = fs.readdirSync(assetsDir);
  cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css")) || "";
  jsFile = files.find((f) => f.startsWith("index-") && f.endsWith(".js")) || "";
  console.log("[finalize-vercel-build] Detected client assets:", { cssFile, jsFile });
}

const fallbackHtml = `<!doctype html>
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
    <script>
      (self.$R = self.$R || {})["tsr"] = [];
      self.$_TSR = {
        h() { this.hydrated = !0; this.c(); },
        e() { this.streamEnded = !0; this.c(); },
        c() { this.hydrated && this.streamEnded && (delete self.$_TSR, delete self.$R.tsr); },
        p(e) { this.initialized ? e() : this.buffer.push(e); },
        buffer: [],
        router: { matches: [], manifest: { routes: {} } }
      };
      self.$_TSR.e();
    </script>
    ${jsFile ? `<script type="module" src="/assets/${jsFile}"></script>` : ""}
  </body>
</html>`;

// 2. Remove static index.html so Vercel forwards root page requests to SSR
const staticIndexHtml = path.join(staticDir, "index.html");
if (fs.existsSync(staticIndexHtml)) {
  fs.unlinkSync(staticIndexHtml);
  console.log("[finalize-vercel-build] Removed static index.html to allow SSR execution.");
}

// 3. Inline self-contained tslib helpers so zero external node_modules are needed
const tslibCode = `export var __assign = Object.assign || function (target) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i];
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) target[p] = s[p];
  }
  return target;
};

export function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}

export function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

export function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
`;

const libsDir = path.join(serverFuncDir, "_libs");
if (fs.existsSync(libsDir)) {
  fs.writeFileSync(path.join(libsDir, "tslib.mjs"), tslibCode, "utf8");
  const radixDir = path.join(libsDir, "@radix-ui");
  if (fs.existsSync(radixDir)) {
    fs.writeFileSync(path.join(radixDir, "tslib.mjs"), tslibCode, "utf8");
  }

  // Patch any files importing "tslib"
  const tslibConsumers = [
    path.join(radixDir, "react-dialog+[...].mjs"),
    path.join(libsDir, "supabase__auth-js.mjs"),
    path.join(libsDir, "supabase__functions-js.mjs")
  ];
  for (const cPath of tslibConsumers) {
    if (fs.existsSync(cPath)) {
      let code = fs.readFileSync(cPath, "utf8");
      if (code.includes('from "tslib"') || code.includes("from 'tslib'")) {
        code = code.replace(/from\s+["']tslib["']/g, 'from "./tslib.mjs"');
        fs.writeFileSync(cPath, code, "utf8");
      }
    }
  }
  console.log("[finalize-vercel-build] Inlined tslib helpers in _libs.");
}

// 4. Patch react.mjs in __server.func/_libs to support jsxDEV in production SSR
const reactLibsPath = path.join(serverFuncDir, "_libs", "react.mjs");
if (fs.existsSync(reactLibsPath)) {
  const content = `import { t as __commonJSMin } from "../_runtime.mjs";
import { u as require_react } from "./@floating-ui/react-dom+[...].mjs";

const React = typeof require_react === "function" ? require_react() : null;

var require_react_jsx_dev_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.Fragment = Symbol.for("react.fragment");
	exports.jsxDEV = (type, props, key) => {
		if (React && typeof React.createElement === "function") {
			return React.createElement(type, key !== void 0 ? { ...props, key } : props);
		}
		return { type, props, key };
	};
}));
var require_jsx_dev_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_dev_runtime_production();
}));
export { require_jsx_dev_runtime as t };
`;
  fs.writeFileSync(reactLibsPath, content, "utf8");
  console.log("[finalize-vercel-build] Patched jsxDEV fallback with bundled React in", reactLibsPath);
}

// 5. Replace any broken (void 0)( calls in _ssr/*.mjs files
const ssrDir = path.join(serverFuncDir, "_ssr");
if (fs.existsSync(ssrDir)) {
  const ssrFiles = fs.readdirSync(ssrDir).filter((f) => f.endsWith(".mjs"));
  let patchedCount = 0;
  for (const file of ssrFiles) {
    const filePath = path.join(ssrDir, file);
    let code = fs.readFileSync(filePath, "utf8");
    if (code.includes("(void 0)(")) {
      code = code.replaceAll("(void 0)(", "import_jsx_dev_runtime.jsxDEV(");
      fs.writeFileSync(filePath, code, "utf8");
      patchedCount++;
    }
  }
  console.log(`[finalize-vercel-build] Patched (void 0)( in ${patchedCount} SSR files.`);
}

// 6. Wire SSR in renderer-template.mjs with robust fallback shell (NO MORE BLANK PAGE)
const rendererChunkPath = path.join(serverFuncDir, "_chunks", "renderer-template.mjs");
if (fs.existsSync(rendererChunkPath)) {
  const escapedFallbackHtml = JSON.stringify(fallbackHtml);

  const newRendererCode = `import { i as HTTPResponse } from "../_libs/h3+rou3+srvx.mjs";

var rendererTemplate = () => new HTTPResponse(${escapedFallbackHtml}, { headers: { "content-type": "text/html; charset=utf-8" } });

async function renderIndexHTML(event) {
	const ssr = globalThis.__nitro_vite_envs__?.["ssr"];
	if (ssr) {
		try {
			const res = await ssr.fetch(event.req);
			if (res && res.status < 400) return res;
		} catch (err) {
			console.error("[SSR error in renderIndexHTML]:", err);
		}
	}
	return rendererTemplate(event.req);
}

export { renderIndexHTML as default };
`;
  fs.writeFileSync(rendererChunkPath, newRendererCode, "utf8");
  console.log("[finalize-vercel-build] Successfully wired SSR fetch with client fallback in", rendererChunkPath);
}

console.log("[finalize-vercel-build] All patches applied successfully.");
