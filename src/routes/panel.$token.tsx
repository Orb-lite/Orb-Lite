import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listSolicitudes, updateSolicitudStatus } from '@/lib/panel.functions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

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

const STATUS_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  vendido: 'Vendido',
  no_vendido: 'No vendido',
}

const mxn = (n: number) =>
  `$${(n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function summarizeItems(items: unknown): string {
  if (!Array.isArray(items)) return ''
  return items
    .map((raw) => {
      const it = raw as Record<string, any>
      const qty = Number(it['quantity'] ?? 1)
      const name = String(it['title'] ?? it['variantName'] ?? 'Producto')
      return `${qty} × ${name}`
    })
    .join(' · ')
}

function PanelPage() {
  const { token } = Route.useParams()
  const [filter, setFilter] = React.useState<'todas' | 'pendiente' | 'vendido' | 'no_vendido'>(
    'pendiente',
  )
  const list = useServerFn(listSolicitudes)
  const update = useServerFn(updateSolicitudStatus)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['panel-solicitudes', token, filter],
    queryFn: () => list({ data: { token, status: filter } }),
    refetchInterval: 15_000,
  })

  const mutation = useMutation({
    mutationFn: (vars: { id: string; status: 'pendiente' | 'vendido' | 'no_vendido'; notes: string }) =>
      update({ data: { token, id: vars.id, status: vars.status, notes: vars.notes } }),
    onSuccess: () => {
      toast.success('Solicitud actualizada')
      queryClient.invalidateQueries({ queryKey: ['panel-solicitudes'] })
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Error al actualizar'),
  })

  if (query.isError) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-muted-foreground">
          Enlace no válido o panel no disponible.
        </p>
      </main>
    )
  }

  const rows = query.data?.rows ?? []

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
        )}
      </div>
    </main>
  )
}

function SolicitudCard({
  row,
  pending,
  onSave,
}: {
  row: any
  pending: boolean
  onSave: (status: 'pendiente' | 'vendido' | 'no_vendido', notes: string) => void
}) {
  const [status, setStatus] = React.useState<'pendiente' | 'vendido' | 'no_vendido'>(row.status)
  const [notes, setNotes] = React.useState<string>(row.notes ?? '')

  React.useEffect(() => {
    setStatus(row.status)
    setNotes(row.notes ?? '')
  }, [row.status, row.notes])

  const dirty = status !== row.status || notes !== (row.notes ?? '')

  return (
    <article className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm text-primary">
            Pedido #{row.order_id}
            {row.customer_number ? ` · Cliente #${row.customer_number}` : ''}
          </p>
          <p className="text-base text-foreground">
            {row.full_name || 'Sin nombre'} · {row.phone || 'Sin teléfono'}
          </p>
          {row.email ? (
            <p className="text-sm text-muted-foreground">{row.email}</p>
          ) : null}
        </div>
        <p className="text-base font-semibold text-foreground">{mxn(Number(row.total ?? 0))}</p>
      </div>

      <p className="text-sm text-muted-foreground">{summarizeItems(row.items)}</p>
      <p className="text-sm text-muted-foreground">
        Entrega: {row.shipping_label || 'Entrega local'} · Factura: {row.wants_invoice ? 'Sí' : 'No'}{' '}
        · Recibido:{' '}
        {new Date(row.created_at).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
      </p>

      <div className="flex flex-wrap gap-2">
        {(['pendiente', 'vendido', 'no_vendido'] as const).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={status === s ? 'default' : 'outline'}
            onClick={() => setStatus(s)}
          >
            {STATUS_LABEL[s]}
          </Button>
        ))}
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notas internas (opcional)"
        rows={2}
      />

      <div className="flex items-center gap-3">
        <Button size="sm" disabled={!dirty || pending} onClick={() => onSave(status, notes)}>
          Guardar cambios
        </Button>
        {!dirty ? (
          <span className="text-xs text-muted-foreground">
            Estado actual: {STATUS_LABEL[row.status] ?? row.status}
          </span>
        ) : null}
      </div>
    </article>
  )
}
