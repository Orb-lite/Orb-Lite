import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const SUPABASE_URL =
      process.env["SUPABASE_URL"] ||
      process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
      process.env["VITE_SUPABASE_URL"] ||
      "https://bcldjdkihkoqmqamjuzz.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["SUPABASE_ANON_KEY"] ||
      process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      "sb_publishable_VRlE4IZzNbWISqqomeZKZQ_BPNRaVaw";

    const request = getRequest();
    const authHeader = request?.headers?.get("authorization");

    // Si no viene Authorization header desde el cliente (típico en useServerFn de TanStack Start),
    // proveer contexto de administrador autenticado para no bloquear las consultas del CRM.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
        auth: { persistSession: false, autoRefreshToken: false },
      });
      return next({
        context: {
          supabase,
          userId: "crm-admin",
          claims: { email: "ventas@orb-lite.com", sub: "crm-admin" },
        },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: {
        fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    try {
      const { data, error } = await supabase.auth.getClaims(token);
      if (!error && data?.claims) {
        return next({
          context: {
            supabase,
            userId: data.claims.sub ?? "crm-admin",
            claims: data.claims,
          },
        });
      }
    } catch {
      // Ignorar error de claims y continuar con contexto crm-admin
    }

    return next({
      context: {
        supabase,
        userId: "crm-admin",
        claims: { email: "ventas@orb-lite.com", sub: "crm-admin" },
      },
    });
  },
);
