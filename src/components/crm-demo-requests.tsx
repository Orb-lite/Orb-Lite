import * as React from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  crmDeleteDemoRequest,
  crmListDemoRequests,
  crmSendDemoRequest,
} from '@/lib/crm.functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const PLATFORM_LABEL: Record<string, string> = {
  wialon_lite: 'ORB-LITE (Wialon Lite)',
  wialon_full: 'ORB-FULL (Wialon Full)',
}

function fecha(v: string | null) {
  if (!v) return '—'
  return new Date(v).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
}

export function SolicitudesDemoSection() {
  const queryClient = useQueryClient()
  const list = useServerFn(crmListDemoRequests)
  const send = useServerFn(crmSendDemoRequest)
  const remove = useServerFn(crmDeleteDemoRequest)

  const [filter, setFilter] = React.useState<'pendiente' | 'enviado' | 'todas'>('pendiente')
  const [customerNumbers, setCustomerNumbers] = React.useState<Record<string, string>>({})

  const query = useQuery({
    queryKey: ['crm-demo-requests'],
    queryFn: () => list(),
    refetchInterval: 30_000,
  })

  const sending = useMutation({
    mutationFn: (vars: { id: string; customerNumber: number | null; platform: string }) =>
      send({
        data: {
          id: vars.id,
          customerNumber: vars.customerNumber,
          platform: vars.platform as 'wialon_lite' | 'wialon_full',
        },
      }),
    onSuccess: (res: any) => {
      if (res?.emailSent) toast.success(`Datos enviados · usuario ${res.username}`)
      else toast.warning(`Usuario ${res?.username} creado, correo no enviado: ${res?.emailReason}`)
      queryClient.invalidateQueries({ queryKey: ['crm-demo-requests'] })
      queryClient.invalidateQueries({ queryKey: ['crm-demo-users'] })
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudieron enviar los datos'),
  })

  const deletion = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success('Solicitud de demo borrada')
      queryClient.invalidateQueries({ queryKey: ['crm-demo-requests'] })
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'No se pudo borrar'),
  })

  const rows = query.data?.rows ?? []
  const pendientes = rows.filter((r: any) => r.status === 'pendiente').length
  const visible = filter === 'todas' ? rows : rows.filter((r: any) => r.status === filter)

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-xl text-foreground">Solicitudes de demo</h2>
        <p className="text-sm text-muted-foreground">
          Llegan desde la página. El correo con usuario y contraseña se envía solo cuando presionas
          “Enviar datos”. Pendientes: <strong className="text-foreground">{pendientes}</strong>
        </p>
      </div>

      <div className="flex gap-2">
        {(['pendiente', 'enviado', 'todas'] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f === 'pendiente' ? 'Pendientes' : f === 'enviado' ? 'Enviadas' : 'Todas'}
          </Button>
        ))}
      </div>

      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay solicitudes en este filtro.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((row: any) => (
            <article key={row.id} className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">
                    {row.first_name} {row.last_name}
                    {row.company ? ` · ${row.company}` : ''}
                  </p>
                  <p className="text-muted-foreground">
                    {row.phone} · {row.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {PLATFORM_LABEL[row.platform] ?? row.platform}
                    {row.units ? ` · ${row.units} unidades` : ''} · {fecha(row.created_at)}
                  </p>
                  {row.message ? (
                    <p className="text-xs text-muted-foreground">“{row.message}”</p>
                  ) : null}
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-wide ${
                    row.status === 'enviado'
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {row.status === 'enviado' ? 'Datos enviados' : 'Pendiente'}
                </span>
              </div>

              {row.status === 'enviado' ? (
                <p className="text-sm text-muted-foreground">
                  Usuario <span className="font-mono text-foreground">{row.demo_username}</span> ·
                  contraseña <span className="font-mono text-foreground">Abc2026+</span> · enviado{' '}
                  {fecha(row.sent_at)}
                </p>
              ) : (
                <div className="flex flex-wrap items-end gap-3">
                  <label className="text-xs text-muted-foreground">
                    Número de cliente (opcional)
                    <Input
                      className="mt-1 w-40"
                      inputMode="numeric"
                      value={customerNumbers[row.id] ?? ''}
                      onChange={(e) =>
                        setCustomerNumbers((prev) => ({
                          ...prev,
                          [row.id]: e.target.value.replace(/[^0-9]/g, ''),
                        }))
                      }
                      placeholder="500"
                    />
                  </label>
                  <Button
                    size="sm"
                    disabled={sending.isPending}
                    onClick={() =>
                      sending.mutate({
                        id: row.id,
                        customerNumber: customerNumbers[row.id]
                          ? Number(customerNumbers[row.id])
                          : null,
                        platform: row.platform,
                      })
                    }
                  >
                    {sending.isPending ? 'Enviando…' : 'Enviar datos'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deletion.isPending}
                    onClick={() => {
                      if (confirm('¿Borrar esta solicitud de demo?')) deletion.mutate(row.id)
                    }}
                  >
                    Borrar
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
