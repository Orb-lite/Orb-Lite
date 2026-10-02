import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";
const DIST_DIR = path.join(__dirname, "dist");
const PUBLIC_DIR = path.join(__dirname, ".output", "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

// Cargar el handler de Nitro para SSR y Server Functions
let nitroHandler = null;
try {
  const nitroModule = await import("./.output/server/index.mjs");
  if (nitroModule?.default?.fetch) {
    nitroHandler = nitroModule.default;
  }
} catch (err) {
  console.warn("[server] Nitro handler not loaded, falling back to static files:", err.message);
}

function tryServeStatic(urlPath, res) {
  let cleanPath = urlPath.split("?")[0].replace(/^\/+/, "");
  if (!cleanPath) cleanPath = "index.html";

  for (const baseDir of [DIST_DIR, PUBLIC_DIR]) {
    if (!fs.existsSync(baseDir)) continue;
    const filePath = path.join(baseDir, cleanPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
      });
      fs.createReadStream(filePath).pipe(res);
      return true;
    }
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  // 1. Archivos estáticos directos (/assets/*, /images/*, favicon.png, etc.)
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/images/") ||
    (path.extname(url.pathname) && !url.pathname.startsWith("/api/"))
  ) {
    if (tryServeStatic(url.pathname, res)) return;
  }

  // 2. Si Nitro está disponible, procesar con SSR / Server Functions
  if (nitroHandler) {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = ["GET", "HEAD"].includes(req.method || "") ? undefined : Buffer.concat(chunks);

      const headers = new Headers();
      for (const [key, val] of Object.entries(req.headers)) {
        if (val) {
          if (Array.isArray(val)) {
            val.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, val);
          }
        }
      }

      const webReq = new Request(url.href, {
        method: req.method || "GET",
        headers,
        body,
      });

      const ctx = {
        waitUntil: () => {},
        context: {
          waitUntil: () => {},
          cf: {},
        },
      };

      const webRes = await nitroHandler.fetch(webReq, process.env, ctx);

      // Copiar headers
      const resHeaders = {};
      webRes.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });

      res.writeHead(webRes.status, resHeaders);
      if (webRes.body) {
        const reader = webRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      }
      res.end();
      return;
    } catch (err) {
      console.error("[server] Error in nitro handler:", err);
    }
  }

  // 3. Fallback: servir dist/index.html para rutas cliente
  const indexPath = path.join(DIST_DIR, "index.html");
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(PORT, HOST, () => {
  console.log(`[server] ORB-LITE production server running at http://${HOST}:${PORT}`);
});
