import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/acceso-crm")({
  validateSearch: (search: Record<string, unknown>) => ({
    olvide: search["olvide"] === "1" || search["olvide"] === true,
  }),
  head: () => ({
    meta: [
      { title: "Crear contraseña del CRM · ORB-LITE" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Página privada de ORB-LITE para crear la contraseña del CRM con un código de verificación.",
      },
    ],
  }),
  component: AccesoCrmPage,
});

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function random6Digit() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0]! % 900000));
}

function AccesoCrmPage() {
  const navigate = useNavigate();
  const { olvide } = Route.useSearch();

  const [code, setCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null);

  async function generateCode() {
    setGenerating(true);
    try {
      const newCode = random6Digit();
      const codeHash = await sha256(newCode);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hora de validez

      const { error: insErr } = await supabase.from("crm_access_codes").insert({
        email: "ventas@orb-lite.com",
        code_hash: codeHash,
        expires_at: expiresAt,
      });

      if (insErr) {
        throw new Error(insErr.message);
      }

      setGeneratedCode(newCode);
      setCode(newCode);
      toast.success(`Código generado: ${newCode}`);
    } catch (e: any) {
      console.error("Error al generar código:", e);
      toast.error(`No se pudo generar el código: ${e?.message || "Error desconocido"}`);
    } finally {
      setGenerating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      toast.error("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    setSaving(true);
    const cleanCode = code.trim();

    try {
      // 1. Intentar confirmación y cambio directo en la base de datos vía RPC
      const { data: rpcData, error: rpcError } = await supabase.rpc("confirm_and_set_crm_password", {
        p_code: cleanCode,
        p_password: password,
      });

      if (!rpcError && rpcData) {
        const res = typeof rpcData === "string" ? JSON.parse(rpcData) : rpcData;
        if (!res.success) {
          throw new Error(res.error || "Código inválido");
        }

        // Si la RPC confirmó el usuario y cambió la clave, iniciar sesión de inmediato
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: "ventas@orb-lite.com",
          password,
        });

        if (!signInErr) {
          toast.success("¡Usuario confirmado y contraseña guardada! Entrando al CRM…");
          navigate({ to: "/crm", replace: true });
          return;
        }
      }

      // 2. Respaldo estándar si la RPC no estuviera ejecutada aún en SQL
      const hash = await sha256(cleanCode);
      const { data: rows, error: readError } = await supabase
        .from("crm_access_codes")
        .select("id, expires_at, used_at")
        .eq("email", "ventas@orb-lite.com")
        .eq("code_hash", hash)
        .is("used_at", null)
        .order("created_at", { ascending: false })
        .limit(1);

      if (readError) {
        throw new Error(`Error validando código: ${readError.message}`);
      }

      const activeRow = rows?.[0];
      if (!activeRow || new Date(activeRow.expires_at).getTime() < Date.now()) {
        throw new Error("Código incorrecto, vencido o ya utilizado.");
      }

      await supabase
        .from("crm_access_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("id", activeRow.id);

      // Iniciar sesión
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: "ventas@orb-lite.com",
        password,
      });

      if (!signInErr) {
        toast.success("¡Sesión iniciada con éxito! Entrando al CRM…");
        navigate({ to: "/crm", replace: true });
        return;
      }

      // Si aún no existe o no tiene clave, intentar sign up
      await supabase.auth.signUp({
        email: "ventas@orb-lite.com",
        password,
      });

      const { error: retrySignIn } = await supabase.auth.signInWithPassword({
        email: "ventas@orb-lite.com",
        password,
      });

      if (!retrySignIn) {
        toast.success("¡Sesión iniciada! Entrando al CRM…");
        navigate({ to: "/crm", replace: true });
        return;
      }

      toast.success("Código validado. Inicia sesión con tu nueva contraseña.");
      navigate({ to: "/auth" });
    } catch (err: any) {
      toast.error(err?.message || "No se pudo validar el código.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-7 shadow-xl"
      >
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary">ORB-LITE</p>
          <h1 className="font-display text-2xl text-foreground">
            {olvide ? "Restablecer contraseña" : "Crear contraseña del CRM"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Acceso administrativo para <span className="font-medium text-foreground">ventas@orb-lite.com</span>.
          </p>
        </div>

        {/* Alerta con el código generado para el usuario */}
        {generatedCode ? (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Tu código de verificación es:</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-widest text-primary">
              {generatedCode}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ya se ha completado automáticamente en el formulario.
            </p>
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className="w-full border-primary/40 text-primary hover:bg-primary/10"
          onClick={generateCode}
          disabled={generating}
        >
          {generating ? "Generando código seguro…" : "Generar código de acceso"}
        </Button>

        <div className="space-y-2">
          <Label htmlFor="code">Código de 6 dígitos</Label>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 741852"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmar contraseña</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repite la contraseña"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving
            ? "Validando y confirmando…"
            : olvide
              ? "Restablecer contraseña y entrar"
              : "Crear contraseña y entrar"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate({ to: "/auth" })}
        >
          Volver a iniciar sesión
        </Button>
      </form>
    </main>
  );
}
