let nitroHandler = null;

async function getNitroHandler() {
  if (nitroHandler) return nitroHandler;

  const candidates = [
    "./server/index.mjs",
    "../.vercel/output/functions/__server.func/index.mjs",
    "../../.vercel/output/functions/__server.func/index.mjs",
    "../api/server/index.mjs",
    "../.output/server/index.mjs",
    "../dist/server/index.mjs",
    "../dist/.output/server/index.mjs",
    "../../.output/server/index.mjs",
  ];

  for (const candidate of candidates) {
    try {
      const mod = await import(candidate);
      if (mod?.default?.fetch) {
        nitroHandler = mod.default;
        return nitroHandler;
      }
      if (typeof mod?.fetch === "function") {
        nitroHandler = mod;
        return nitroHandler;
      }
      if (typeof mod?.default === "function") {
        nitroHandler = { fetch: mod.default };
        return nitroHandler;
      }
    } catch {}
  }

  console.warn("[api/index] Nitro server handler not loaded from any candidate path");
  return null;
}

export default async function handler(req, res) {
  const server = await getNitroHandler();
  if (server) {
    try {
      // Reconstruir la ruta original solicitada antes del rewrite de Vercel
      let rawPath = req.headers["x-matched-path"] || req.headers["x-forwarded-url"];
      if (!rawPath || rawPath.includes("/api/index.js") || rawPath === "/api" || rawPath === "/api/") {
        const parsed = new URL(req.url || "/", "http://localhost");
        if (parsed.searchParams.has("_url")) {
          rawPath = parsed.searchParams.get("_url");
        } else {
          rawPath = req.url || "/";
        }
      }

      const hostHeader = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
      const protoHeader = req.headers["x-forwarded-proto"] || "https";
      const url = new URL(rawPath, `${protoHeader}://${hostHeader}`);

      const chunks = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }

      const isReadMethod = ["GET", "HEAD"].includes((req.method || "").toUpperCase());
      const hasBody = !isReadMethod && chunks.length > 0;
      const body = hasBody ? Buffer.concat(chunks) : undefined;

      const headers = new Headers();
      for (const [key, val] of Object.entries(req.headers)) {
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            val.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, val);
          }
        }
      }

      const requestInit = {
        method: req.method || "GET",
        headers,
      };
      if (body !== undefined) {
        requestInit.body = body;
      }

      const webReq = new Request(url.href, requestInit);
      const ctx = {
        waitUntil: () => {},
        context: { waitUntil: () => {}, cf: {} },
      };

      const webRes = await server.fetch(webReq, process.env, ctx);
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
      console.error("[api/index] Error dispatching request to Nitro server:", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Internal Server Error" }));
      return;
    }
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Server handler not available" }));
}
