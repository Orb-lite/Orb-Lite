import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { crmListCustomers, crmListSolicitudes, crmUpdateSolicitud } from '@/lib/crm.functions'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import {
  NuevaVentaSection,
  RegistrarClienteSection,
  EditarClienteDialog,
} from '@/components/crm-manual-forms'

import {
  SolicitudCard,
  SolicitudDetailDialog,
  STATUS_LABEL,
  BillingRows,
  mxn,
  type SolicitudStatus,
} from '@/components/solicitud-card'

export const Route = createFileRoute('/_authenticated/crm')({
  head: () => ({
    meta: [
      { title: 'CRM de solicitudes · ORB-LITE' },
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content: 'CRM interno de ORB-LITE: solicitudes pendientes, vendidas y no vendidas.',
      },
      { property: 'og:title', content: 'CRM de solicitudes · ORB-LITE' },
      {
        property: 'og:description',
        content: 'CRM interno de ORB-LITE para ventas, solicitudes y clientes.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: CrmPage,
})

type Filter = 'todas' | SolicitudStatus

function CrmPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const list = useServerFn(crmListSolicitudes)
  const update = useServerFn(crmUpdateSolicitud)
  const [filter, setFilter] = React.useState<Filter>('pendiente')
  const [page, setPage] = React.useState(1)
  const [selectedRow, setSelectedRow] = React.useState<any>(null)
  const [tab, setTab] = React.useState<
    'solicitudes' | 'clientes' | 'nueva-venta' | 'registrar-cliente'
  >('solicitudes')
  const PAGE_SIZE = 10

  React.useEffect(() => {
    setPage(1)
  }, [filter])

  const query = useQuery({
    queryKey: ['crm-solicitudes'],
    queryFn: () => list({ data: { status: 'todas' as const } }),
    refetchInterval: 15_000,
  })

  const mutation = useMutation({
    mutationFn: (vars: { id: string; status: SolicitudStatus; notes: string }) =>
      update({ data: vars }),
    onSuccess: () => {
      toast.success('Solicitud actualizada')
      queryClient.invalidateQueries({ queryKey: ['crm-solicitudes'] })
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : 'Error al actualizar'),
  })

  const rows = query.data?.rows ?? []
  const stats = React.useMemo(() => {
    const base = {
      pendiente: { count: 0, total: 0 },
      vendido: { count: 0, total: 0 },
      no_vendido: { count: 0, total: 0 },
    } as Record<SolicitudStatus, { count: number; total: number }>
    for (const r of rows) {
      const key = (r.status as SolicitudStatus) ?? 'pendiente'
      if (!base[key]) continue
      base[key].count += 1
      base[key].total += Number(r.total ?? 0)
    }
    return base
  }, [rows])

  const totalCount = rows.length
  const totalValue = rows.reduce((s, r) => s + Number(r.total ?? 0), 0)
  const visible = filter === 'todas' ? rows : rows.filter((r) => r.status === filter)
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  async function signOut() {
    await queryClient.cancelQueries()
    queryClient.clear()
    await supabase.auth.signOut()
    navigate({ to: '/auth', replace: true })
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-7">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs tracking-[0.2em] text-primary">CRM ORB-LITE</p>
            <h1 className="font-display text-2xl text-foreground">Solicitudes</h1>
            <p className="text-sm text-muted-foreground">
              Resumen y control de estado de todos los pedidos solicitados.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to="/clientes">Panel de clientes</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={signOut}>
              Salir
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          <Button
            size="sm"
            variant={tab === 'solicitudes' ? 'default' : 'ghost'}
            onClick={() => setTab('solicitudes')}
          >
            Solicitudes
          </Button>
          <Button
            size="sm"
            variant={tab === 'clientes' ? 'default' : 'ghost'}
            onClick={() => setTab('clientes')}
          >
            Clientes
          </Button>
          <Button
            size="sm"
            variant={tab === 'nueva-venta' ? 'default' : 'ghost'}
            onClick={() => setTab('nueva-venta')}
          >
            Nueva venta
          </Button>
          <Button
            size="sm"
            variant={tab === 'registrar-cliente' ? 'default' : 'ghost'}
            onClick={() => setTab('registrar-cliente')}
          >
            Registrar cliente
          </Button>
        </div>

        {tab === 'solicitudes' ? (
          <>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pendientes" count={stats.pendiente.count} total={stats.pendiente.total} highlight />
          <StatCard label="Vendidos" count={stats.vendido.count} total={stats.vendido.total} />
          <StatCard label="No vendidos" count={stats.no_vendido.count} total={stats.no_vendido.total} />
          <StatCard label="Total de pedidos" count={totalCount} total={totalValue} />
        </section>

        <div className="flex flex-wrap gap-2">
          {(['pendiente', 'vendido', 'no_vendido', 'todas'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? 'default' : 'outline'}
              onClick={() => setFilter(s)}
            >
              {s === 'todas' ? `Todas (${totalCount})` : `${STATUS_LABEL[s]} (${stats[s].count})`}
            </Button>
          ))}
        </div>

        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : query.isError ? (
          <p className="text-sm text-destructive">
            No se pudieron cargar las solicitudes. Verifica que iniciaste sesión con
            ventas@orb-lite.com.
          </p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay solicitudes en este filtro.</p>
        ) : (
          <div className="space-y-4">
            {paginated.map((row) => (
              <SolicitudCard
                key={row.id}
                row={row}
                pending={mutation.isPending}
                onSave={(status, notes) => mutation.mutate({ id: row.id, status, notes })}
                onExpand={() => setSelectedRow(row)}
              />
            ))}
            <SolicitudDetailDialog
              row={selectedRow}
              open={!!selectedRow}
              onOpenChange={(open) => {
                if (!open) setSelectedRow(null)
              }}
            />
            {visible.length > PAGE_SIZE && (
              <nav className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-muted-foreground">
                  Mostrando {paginated.length} de {visible.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="px-2 text-sm text-muted-foreground">
                    Página {safePage} de {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </nav>
            )}
          </div>
        )}
          </>
        ) : tab === 'clientes' ? (
          <CustomersSection />
        ) : tab === 'nueva-venta' ? (
          <NuevaVentaSection />
        ) : (
          <RegistrarClienteSection />
        )}
      </div>
    </main>
  )
}

function StatCard({
  label,
  count,
  total,
  highlight,
}: {
  label: string
  count: number
  total: number
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? 'border-primary/60 bg-primary/5' : 'border-border bg-card'
      }`}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-2xl text-foreground">{count}</p>
      <p className="text-sm text-muted-foreground">{mxn(total)}</p>
    </div>
  )
}

function CustomersSection() {
  const listCustomers = useServerFn(crmListCustomers)
  const [q, setQ] = React.useState('')
  const query = useQuery({
    queryKey: ['crm-customers'],
    queryFn: () => listCustomers({ data: undefined as any }),
  })

  const rows = query.data?.rows ?? []
  const term = q.trim().toLowerCase()
  const filtered = term
    ? rows.filter((c: any) =>
        [c.full_name, c.phone, c.email, String(c.customer_number), (c.billing as any)?.rfc]
          .filter(Boolean)
          .some((v: any) => String(v).toLowerCase().includes(term)),
      )
    : rows

  const totalSpent = rows.reduce((s: number, c: any) => s + Number(c.total_spent ?? 0), 0)

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Clientes registrados" count={rows.length} total={totalSpent} />
        <StatCard
          label="Con datos de facturación"
          count={rows.filter((c: any) => c.billing && Object.keys(c.billing).length > 0).length}
          total={0}
        />
      </section>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nombre, número de cliente, teléfono, correo o RFC"
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
      />

      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando clientes…</p>
      ) : query.isError ? (
        <p className="text-sm text-destructive">No se pudieron cargar los clientes.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin clientes para esta búsqueda.</p>
      ) : (
        filtered.map((c: any) => <CustomerCard key={c.id} customer={c} />)
      )}
    </div>
  )
}

function CustomerCard({ customer }: { customer: any }) {
  const billing = (customer.billing && typeof customer.billing === 'object' ? customer.billing : {}) as Record<string, any>
  const contact = (customer.contact && typeof customer.contact === 'object' ? customer.contact : {}) as Record<string, any>

  return (
    <article className="space-y-3 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm text-primary">Cliente #{customer.customer_number}</p>
          <p className="text-base text-foreground">{customer.full_name || 'Sin nombre'}</p>
          <p className="text-sm text-muted-foreground">
            {customer.phone || 'Sin teléfono'}
            {customer.email ? ` · ${customer.email}` : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-foreground">{mxn(Number(customer.total_spent ?? 0))}</p>
          <p className="text-xs text-muted-foreground">{customer.orders_count ?? 0} pedido(s)</p>
        </div>
      </div>

      {Object.keys(contact).length > 0 ? (
        <div className="space-y-1 text-sm">
          <p className="text-xs uppercase tracking-wide text-primary">Datos de contacto</p>
          <div className="grid gap-1">
            {Object.entries(contact).map(([k, v]) => (
              <p key={k} className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                <span className="capitalize">{k.replace(/_/g, ' ')}</span>
                <span className="text-foreground text-right">{String(v ?? '') || '—'}</span>
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-2 text-sm">
        <p className="text-xs uppercase tracking-wide text-primary">Datos de facturación</p>
        <div className="grid gap-2">
          <BillingRows billing={billing} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Alta: {new Date(customer.created_at).toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' })}
        {customer.last_order_id ? ` · Último pedido #${customer.last_order_id}` : ''}
      </p>
    </article>
  )
}
