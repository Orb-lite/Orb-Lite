import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { crmListCustomers } from '@/lib/crm.functions'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { BillingRows, mxn } from '@/components/solicitud-card'

export const Route = createFileRoute('/_authenticated/clientes')({
  head: () => ({
    meta: [
      { title: 'Panel de clientes · ORB-LITE' },
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content:
          'Panel interno de clientes ORB-LITE: número de cliente, primera compra, total histórico y solicitudes pendientes.',
      },
    ],
  }),
  component: ClientesPage,
})

type SortKey = 'numero' | 'total' | 'pendientes' | 'primera'

function ClientesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const listCustomers = useServerFn(crmListCustomers)
  const [q, setQ] = React.useState('')
  const [sort, setSort] = React.useState<SortKey>('numero')
  const [expanded, setExpanded] = React.useState<string | null>(null)

  const query = useQuery({
    queryKey: ['crm-customers'],
    queryFn: () => listCustomers({ data: undefined as any }),
    refetchInterval: 30_000,
  })

  const rows: any[] = query.data?.rows ?? []
  const term = q.trim().toLowerCase()

  const filtered = React.useMemo(() => {
    const base = term
      ? rows.filter((c) =>
          [c.full_name, c.phone, c.email, String(c.customer_number), c.billing?.rfc]
            .filter(Boolean)
            .some((v: any) => String(v).toLowerCase().includes(term)),
        )
      : rows
    const sorted = [...base]
    sorted.sort((a, b) => {
      if (sort === 'total') return Number(b.total_spent ?? 0) - Number(a.total_spent ?? 0)
      if (sort === 'pendientes') return (b.pending_count ?? 0) - (a.pending_count ?? 0)
      if (sort === 'primera')
        return new Date(a.first_order_at).getTime() - new Date(b.first_order_at).getTime()
      return Number(a.customer_number) - Number(b.customer_number)
    })
    return sorted
  }, [rows, term, sort])

  const totalHistorico = rows.reduce((s, c) => s + Number(c.total_spent ?? 0), 0)
  const totalPendientes = rows.reduce((s, c) => s + Number(c.pending_count ?? 0), 0)
  const valorPendiente = rows.reduce((s, c) => s + Number(c.pending_total ?? 0), 0)

  async function signOut() {
    await queryClient.cancelQueries()
    queryClient.clear()
    await supabase.auth.signOut()
    navigate({ to: '/auth', replace: true })
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-7">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs tracking-[0.2em] text-primary">CRM ORB-LITE</p>
            <h1 className="font-display text-2xl text-foreground">Panel de clientes</h1>
            <p className="text-sm text-muted-foreground">
              Número de cliente, primera compra, total histórico y solicitudes pendientes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to="/crm">Ir a solicitudes</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={signOut}>
              Salir
            </Button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <Stat label="Clientes registrados" value={String(rows.length)} />
          <Stat label="Total histórico" value={mxn(totalHistorico)} />
          <Stat
            label="Solicitudes pendientes"
            value={`${totalPendientes} · ${mxn(valorPendiente)}`}
            highlight
          />
        </section>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por número, nombre, teléfono, correo o RFC"
            className="min-w-[240px] flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
          />
          {(
            [
              ['numero', 'Número'],
              ['total', 'Total histórico'],
              ['pendientes', 'Pendientes'],
              ['primera', 'Primera compra'],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              size="sm"
              variant={sort === key ? 'default' : 'outline'}
              onClick={() => setSort(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando clientes…</p>
        ) : query.isError ? (
          <p className="text-sm text-destructive">
            No se pudieron cargar los clientes. Inicia sesión con ventas@orb-lite.com.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin clientes para esta búsqueda.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Primera compra</th>
                  <th className="px-4 py-3">Total histórico</th>
                  <th className="px-4 py-3">Pendientes</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="border-t border-border align-top">
                      <td className="px-4 py-3">
                        <p className="text-primary">#{c.customer_number}</p>
                        <p className="text-foreground">{c.full_name || 'Sin nombre'}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <p>{c.phone || '—'}</p>
                        <p>{c.email || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(c.first_order_at ?? c.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-foreground">{mxn(Number(c.total_spent ?? 0))}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.orders_count ?? 0} compra(s)
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {c.pending_count > 0 ? (
                          <span className="rounded-full bg-primary/15 px-2 py-1 text-xs text-primary">
                            {c.pending_count} · {mxn(Number(c.pending_total ?? 0))}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin pendientes</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                        >
                          {expanded === c.id ? 'Ocultar' : 'Ver datos'}
                        </Button>
                      </td>
                    </tr>
                    {expanded === c.id ? (
                      <tr className="border-t border-border bg-muted/20">
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-wide text-primary">
                                Datos de contacto guardados
                              </p>
                              <div className="grid gap-1 text-sm">
                                {Object.entries(
                                  (c.contact && typeof c.contact === 'object' ? c.contact : {}) as Record<
                                    string,
                                    any
                                  >,
                                ).map(([k, v]) => (
                                  <p key={k} className="flex justify-between gap-3">
                                    <span className="capitalize text-muted-foreground">
                                      {k.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-foreground text-right">
                                      {String(v ?? '') || '—'}
                                    </span>
                                  </p>
                                ))}
                                {!c.contact || Object.keys(c.contact).length === 0 ? (
                                  <p className="text-muted-foreground">Sin datos de contacto.</p>
                                ) : null}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs uppercase tracking-wide text-primary">
                                Datos de facturación guardados
                              </p>
                              <div className="grid gap-2 text-sm">
                                <BillingRows
                                  billing={
                                    (c.billing && typeof c.billing === 'object' ? c.billing : {}) as Record<
                                      string,
                                      any
                                    >
                                  }
                                  emptyText="Este cliente aún no ha solicitado factura."
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? 'border-primary/60 bg-primary/5' : 'border-border bg-card'
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-xl text-foreground">{value}</p>
    </div>
  )
}

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
