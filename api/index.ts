import type { IncomingMessage, ServerResponse } from "node:http";

let nitroHandler: any = null;
try {
  const nitroModule = await import("../.output/server/index.mjs");
  if (nitroModule?.default?.fetch) {
    nitroHandler = nitroModule.default;
  }
} catch {
  // Ignorar si se compila como SPA estático
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (nitroHandler) {
    try {
      const url = new URL(req.url || "/", `https://${req.headers.host || "localhost"}`);
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
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
        context: { waitUntil: () => {}, cf: {} },
      };

      const webRes = await nitroHandler.fetch(webReq, process.env, ctx);
      const resHeaders: Record<string, string> = {};
      webRes.headers.forEach((val: string, key: string) => {
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
    } catch (err: any) {
      console.error("[vercel-api] Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message || "Internal Server Error" }));
      return;
    }
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", service: "ORB-LITE Vercel Serverless" }));
}
