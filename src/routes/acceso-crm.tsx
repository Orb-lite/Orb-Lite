import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { requestCrmAccessCode, redeemCrmAccessCode } from "@/lib/crm-access.functions";
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
          "Página privada de ORB-LITE para crear la contraseña del CRM con un código de un solo uso enviado por correo.",
      },
    ],
  }),
  component: AccesoCrmPage,
});

function AccesoCrmPage() {
  const navigate = useNavigate();
  const { olvide } = Route.useSearch();
  const request = useServerFn(requestCrmAccessCode);
  const redeem = useServerFn(redeemCrmAccessCode);

  const [code, setCode] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [infoBanner, setInfoBanner] = React.useState<string | null>(null);

  const autoSent = React.useRef(false);

  React.useEffect(() => {
    if (olvide && !autoSent.current) {
      autoSent.current = true;
      void sendCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [olvide]);

  async function sendCode() {
    setSending(true);
    setInfoBanner(null);
    try {
      const res = await request();
      if (res.ok) {
        if (res.hasEmailService && res.emailSent) {
          toast.success("Código enviado a ventas@orb-lite.com");
        } else if (res.backupCode) {
          toast.success("Código de verificación generado");
          setCode(res.backupCode);
          setInfoBanner(
            `Aviso técnico: No se detectó RESEND_API_KEY en variables de entorno. Tu código generado es: ${res.backupCode}`,
          );
        } else {
          toast.info("Código generado en el sistema.");
        }
      } else {
        toast.error(res.message || "Espera un minuto antes de pedir otro código");
        if (res.message) setInfoBanner(res.message);
      }
    } catch (e) {
      console.error("Error al enviar código:", e);
      const errMsg = e instanceof Error ? e.message : "Error de comunicación con el servidor";
      toast.error(`No se pudo enviar el código: ${errMsg}`);
      setInfoBanner(errMsg);
    }
    setSending(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setSaving(true);
    try {
      await redeem({ data: { code: code.trim(), password } });
      await supabase.auth.signInWithPassword({
        email: "ventas@orb-lite.com",
        password,
      });
      toast.success("Contraseña creada. Entrando al CRM…");
      navigate({ to: "/crm", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código inválido o vencido");
    }
    setSaving(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-7 shadow-lg"
      >
        <div className="space-y-1">
          <p className="text-xs tracking-[0.2em] text-primary">ORB-LITE</p>
          <h1 className="font-display text-2xl text-foreground">
            {olvide ? "Restablecer contraseña" : "Crear contraseña del CRM"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {olvide
              ? "Genera un código de un solo uso para restablecer la contraseña de ventas@orb-lite.com."
              : "Genera un código de un solo uso para ventas@orb-lite.com."}
          </p>
        </div>

        {infoBanner ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            {infoBanner}
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={sendCode}
          disabled={sending}
        >
          {sending
            ? "Generando código…"
            : olvide
              ? "Reenviar el código por correo"
              : "Enviarme el código por correo"}
        </Button>

        <div className="space-y-2">
          <Label htmlFor="code">Código de 6 dígitos</Label>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
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
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving
            ? "Guardando…"
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

        <p className="text-xs text-muted-foreground">
          El código vence en 20 minutos y solo funciona una vez.
        </p>
      </form>
    </main>
  );
}
