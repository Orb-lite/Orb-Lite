import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso CRM · ORB-LITE" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Acceso privado al CRM de solicitudes de ORB-LITE Rastreo GPS Satelital.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("ventas@orb-lite.com");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Si ya existe sesión activa con el usuario del CRM, entrar directamente
    supabase.auth.getUser().then(({ data }: any) => {
      if (data?.user && (data.user.email ?? "").toLowerCase() === "ventas@orb-lite.com") {
        navigate({ to: "/crm", replace: true });
      }
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      if (signInError.message.includes("Email not confirmed")) {
        setError(
          "El usuario aún no está confirmado. Ve a 'Crear contraseña' para validarlo con un código de un solo uso.",
        );
      } else if (signInError.message.includes("Invalid login credentials")) {
        setError("Contraseña o correo incorrectos. Puedes crear o restablecer tu contraseña abajo.");
      } else {
        setError(signInError.message);
      }
      return;
    }

    navigate({ to: "/crm", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <form
        onSubmit={onSubmit}
        autoComplete="off"
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-card p-7"
      >
        <div className="space-y-1">
          <p className="text-xs tracking-[0.2em] text-primary">ORB-LITE</p>
          <h1 className="font-display text-2xl text-foreground">Acceso al CRM</h1>
          <p className="text-sm text-muted-foreground">Panel interno de solicitudes.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            name="crm-usuario"
            type="email"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="ventas@orb-lite.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="crm-clave"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => navigate({ to: "/acceso-crm", search: { olvide: false } })}
        >
          Crear contraseña
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate({ to: "/acceso-crm", search: { olvide: true } })}
        >
          Olvidé mi contraseña
        </Button>
      </form>
    </main>
  );
}
