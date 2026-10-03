// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.

import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
// @ts-ignore - build-time ESM script without root declaration
import { prepareDist } from "./scripts/prepare-dist.mjs";

// Server routes need non-VITE_ env vars; load them into
// process.env for server-side code only. Never expose these via envDefine.
const serverEnv = loadEnv(process.env["NODE_ENV"] ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "./src/server.ts" },
  },
  vite: {
    plugins: [
      {
        name: "orb-prepare-dist-plugin",
        closeBundle() {
          try {
            prepareDist();
          } catch (e) {
            console.warn("[orb-prepare-dist-plugin] Error during closeBundle:", e);
          }
        },
      },
    ],
    resolve: {
      alias: {
        // React Email requires entities v4.5.0; bypass nested newer copies.
        "entities/lib/decode.js": path.resolve(
          process.cwd(),
          "node_modules/entities/lib/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          process.cwd(),
          "node_modules/entities/lib/encode.js",
        ),
        entities: path.resolve(process.cwd(), "node_modules/entities"),
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        process.env["VITE_SUPABASE_URL"] ||
          process.env["SUPABASE_URL"] ||
          process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
          "https://bcldjdkihkoqmqamjuzz.supabase.co",
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["SUPABASE_ANON_KEY"] ||
          process.env["SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
          "sb_publishable_VRlE4IZzNbWISqqomeZKZQ_BPNRaVaw",
      ),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(
        process.env["VITE_SUPABASE_PROJECT_ID"] ||
          process.env["SUPABASE_PROJECT_ID"] ||
          "bcldjdkihkoqmqamjuzz",
      ),
    },
  },
});

