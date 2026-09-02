import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { listSolicitudes, setCrmPassword, updateSolicitudStatus } from '@/lib/panel.functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  SolicitudCard,
  STATUS_LABEL,
  mxn,
  type SolicitudStatus,
} from '@/components/solicitud-card'

export const Route = createFileRoute('/panel/$token')({
  head: () => ({
    meta: [
      { title: 'Panel interno de solicitudes · ORB-LITE' },
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content: 'Panel privado para actualizar el estado de las solicitudes de ORB-LITE.',
      },
    ],
  }),
  component: PanelPage,
})

function PanelPage() {
  const { token } = Route.useParams()
  const [filter, setFilter] = React.useState<'todas' | SolicitudStatus>('pendiente')
  const list = useServerFn(listSolicitudes)
  const update = useServerFn(updateSolicitudStatus)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['panel-solicitudes', token, filter],
    queryFn: () => list({ data: { token, status: filter } }),
    refetchInterval: 15_000,
  })

  const mutation = useMutation({
    mutationFn: (vars: { id: string; status: SolicitudStatus; notes: string }) =>
      update({ data: { token, ...vars } }),
    onSuccess: () => {
      toast.success('Solicitud actualizada')
      queryClient.invalidateQueries({ queryKey: ['panel-solicitudes'] })
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Error al actualizar'),
  })

  if (query.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-muted-foreground">Enlace no válido o panel no disponible.</p>
      </main>
    )
  }

  const rows = query.data?.rows ?? []
  const totalValue = rows.reduce((s, r) => s + Number(r.total ?? 0), 0)

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs tracking-[0.2em] text-primary">PANEL PRIVADO</p>
          <h1 className="font-display text-2xl text-foreground">Solicitudes</h1>
          <p className="text-sm text-muted-foreground">
            Cambia el estado de cada solicitud; los resúmenes diarios solo incluyen las pendientes.
          </p>
        </header>

        <CrmPasswordCard token={token} />

        <div className="flex flex-wrap gap-2">
          {(['pendiente', 'vendido', 'no_vendido', 'todas'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? 'default' : 'outline'}
              onClick={() => setFilter(s)}
            >
              {s === 'todas' ? 'Todas' : STATUS_LABEL[s]}
            </Button>
          ))}
        </div>

        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay solicitudes en este filtro.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {rows.length} solicitud(es) · {mxn(totalValue)}
            </p>
            <div className="space-y-4">
              {rows.map((row) => (
                <SolicitudCard
                  key={row.id}
                  row={row}
                  pending={mutation.isPending}
                  onSave={(status, notes) => mutation.mutate({ id: row.id, status, notes })}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

function CrmPasswordCard({ token }: { token: string }) {
  const setPassword = useServerFn(setCrmPassword)
  const [password, setPwd] = React.useState('')
  const [done, setDone] = React.useState(false)

  const mutation = useMutation({
    mutationFn: () => setPassword({ data: { token, password } }),
    onSuccess: () => {
      setDone(true)
      setPwd('')
      toast.success('Contraseña guardada para ventas@orb-lite.com')
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo guardar la contraseña'),
  })

  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="text-base text-foreground">Acceso al CRM</h2>
        <p className="text-sm text-muted-foreground">
          Define aquí la contraseña de <strong>ventas@orb-lite.com</strong> y luego entra al CRM con
          tu correo y contraseña.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="crm-pwd">Nueva contraseña (mín. 8 caracteres)</Label>
          <Input
            id="crm-pwd"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPwd(e.target.value)}
            className="w-64"
          />
        </div>
        <Button
          disabled={password.length < 8 || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          Guardar contraseña
        </Button>
        <Button asChild variant="outline">
          <Link to="/auth">Ir al CRM</Link>
        </Button>
      </div>
      {done ? (
        <p className="text-sm text-primary">
          Listo, ya puedes entrar al CRM con ventas@orb-lite.com.
        </p>
      ) : null}
    </section>
  )
}
