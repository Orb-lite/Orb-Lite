let nitroHandler = null;

async function getNitroHandler() {
  if (nitroHandler) return nitroHandler;
  try {
    const mod = await import("../.output/server/index.mjs");
    if (mod?.default?.fetch) {
      nitroHandler = mod.default;
      return nitroHandler;
    }
  } catch (err) {
    console.warn("[api/index] Nitro server handler not loaded:", err?.message);
  }
  return null;
}

export default async function handler(req, res) {
  const server = await getNitroHandler();
  if (server) {
    try {
      const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
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
