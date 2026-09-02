import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { ensureFreshSession } from '@/lib/crm-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Acceso CRM · ORB-LITE' },
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content: 'Acceso privado al CRM de solicitudes de ORB-LITE Rastreo GPS Satelital.',
      },
    ],
  }),
  component: AuthPage,
})

function AuthPage() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    // Cada carga de página arranca sin sesión: siempre hay que iniciar sesión.
    void ensureFreshSession()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    navigate({ to: '/crm', replace: true })
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
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => navigate({ to: '/acceso-crm', search: { olvide: false } })}
        >
          Crear contraseña
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => navigate({ to: '/acceso-crm', search: { olvide: true } })}
        >
          Olvidé mi contraseña
        </Button>

        <p className="text-xs text-muted-foreground">
          ¿Primera vez o olvidaste tu contraseña? Pide un código de un solo uso y llegará a
          ventas@orb-lite.com para crear una nueva.
        </p>
      </form>
    </main>
  )
}
