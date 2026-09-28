import { createFileRoute } from "@tanstack/react-router";
import { getLogs } from "@/lib/error-capture";

async function handle() {
  const logs = getLogs();
  return new Response(JSON.stringify(logs), {
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/logs")({
  server: {
    handlers: {
      GET: () => handle(),
    },
  },
});
