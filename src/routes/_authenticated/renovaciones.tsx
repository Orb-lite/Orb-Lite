import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  crmDeleteRenovacion,
  crmListRenovaciones,
  crmSaveRenovacion,
} from '@/lib/crm.functions'
import { PRODUCTS } from '@/data/catalog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mxn } from '@/components/solicitud-card'

export const Route = createFileRoute('/_authenticated/renovaciones')({
  head: () => ({
    meta: [
      { title: 'Panel de renovaciones · ORB-LITE' },
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content:
          'Panel interno de renovaciones ORB-LITE y ORB-FULL: plataforma, IMEI, ICCID, teléfono y fecha de renovación.',
      },
      { property: 'og:title', content: 'Panel de renovaciones · ORB-LITE' },
      {
        property: 'og:description',
        content: 'Control de renovaciones mensuales y anuales de plataforma y chip.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: RenovacionesPage,
})

type Platform = 'ORB-LITE' | 'ORB-FULL'
type Period = 'monthly' | 'annual'
type Kind = 'platform' | 'sim' | 'both'

const STATUSES = ['activa', 'por_vencer', 'adeudo', 'cancelada'] as const
const STATUS_LABEL: Record<(typeof STATUSES)[number], string> = {
  activa: 'Activa',
  por_vencer: 'Por vencer',
  adeudo: 'Con adeudo',
  cancelada: 'Cancelada',
}

const PERIOD_LABEL: Record<Period, string> = { monthly: 'Mensual', annual: 'Anual' }

/** Mensual: día 1 del mes siguiente. Anual: día 1 del mismo mes del año siguiente. */
function nextRenewalDate(period: Period, from: Date = new Date()): string {
  const y = from.getUTCFullYear()
  const m = from.getUTCMonth()
  const next = period === 'monthly' ? new Date(Date.UTC(y, m + 1, 1)) : new Date(Date.UTC(y + 1, m, 1))
  return next.toISOString().slice(0, 10)
}

const RENOVATION_VARIANTS =
  PRODUCTS.find((p) => p.category === 'RENOVATION')?.variants ?? []

interface FormState {
  id: string | null
  customerNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  variantId: string
  platform: Platform
  renewalKind: Kind
  renewalPeriod: Period
  unitName: string
  imei: string
  iccid: string
  simPhone: string
  amount: string
  renewalDate: string
  status: (typeof STATUSES)[number]
}

function emptyForm(platform: Platform): FormState {
  const first = RENOVATION_VARIANTS.find((v) => (v.platform ?? 'ORB-LITE') === platform)
  return {
    id: null,
    customerNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    variantId: first?.id ?? RENOVATION_VARIANTS[0]?.id ?? '',
    platform,
    renewalKind: (first?.renewal_kind as Kind) ?? 'platform',
    renewalPeriod: (first?.renewal_period as Period) ?? 'annual',
    unitName: '',
    imei: '',
    iccid: '',
    simPhone: '',
    amount: String(first?.price ?? 0),
    // Mensual: día 1 del mes siguiente. Anual: día 1 del mismo mes del año siguiente.
    renewalDate: nextRenewalDate((first?.renewal_period as Period) ?? 'annual'),
    status: 'activa',
  }
}

function RenovacionesPage() {
  const queryClient = useQueryClient()
  const list = useServerFn(crmListRenovaciones)
  const save = useServerFn(crmSaveRenovacion)
  const remove = useServerFn(crmDeleteRenovacion)

  const [platform, setPlatform] = React.useState<Platform>('ORB-LITE')
  const [q, setQ] = React.useState('')
  const [form, setForm] = React.useState<FormState>(() => emptyForm('ORB-LITE'))
  const [showForm, setShowForm] = React.useState(false)

  const query = useQuery({
    queryKey: ['crm-renovaciones'],
    queryFn: () => list({ data: undefined as any }),
    refetchInterval: 30_000,
  })

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          id: form.id,
          customerNumber: form.customerNumber ? Number(form.customerNumber) : null,
          customerName: form.customerName || null,
          customerEmail: form.customerEmail || null,
          customerPhone: form.customerPhone || null,
          variantId: form.variantId,
          variantName:
            RENOVATION_VARIANTS.find((v) => v.id === form.variantId)?.name ?? form.variantId,
          platform: form.platform,
          renewalKind: form.renewalKind,
          renewalPeriod: form.renewalPeriod,
          unitName: form.unitName || null,
          imei: form.imei || null,
          iccid: form.iccid || null,
          simPhone: form.simPhone || null,
          amount: Number(form.amount || 0),
          renewalDate: form.renewalDate,
          status: form.status,
        },
      }),
    onSuccess: (res: any) => {
      toast.success(res?.created ? 'Renovación registrada' : 'Renovación actualizada')
      setShowForm(false)
      setForm(emptyForm(platform))
      queryClient.invalidateQueries({ queryKey: ['crm-renovaciones'] })
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo guardar la renovación'),
  })

  const removal = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success('Renovación eliminada')
      queryClient.invalidateQueries({ queryKey: ['crm-renovaciones'] })
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo eliminar'),
  })

  const rows: any[] = query.data?.rows ?? []
  const term = q.trim().toLowerCase()

  const forPlatform = rows.filter((r) => {
    const p = (r.platform ?? 'ORB-LITE') as string
    return p === platform || (platform === 'ORB-LITE' && !r.platform)
  })
  const visible = term
    ? forPlatform.filter((r) =>
        [r.customer_name, r.imei, r.iccid, r.sim_phone, r.unit_name, String(r.customer_number)]
          .filter(Boolean)
          .some((v: any) => String(v).toLowerCase().includes(term)),
      )
    : forPlatform

  const monthly = visible.filter((r) => r.renewal_period === 'monthly')
  const annual = visible.filter((r) => r.renewal_period !== 'monthly')
  const totalMonto = visible.reduce((s, r) => s + Number(r.amount ?? 0), 0)

  function startEdit(row: any) {
    setForm({
      id: row.id,
      customerNumber: row.customer_number ? String(row.customer_number) : '',
      customerName: row.customer_name ?? '',
      customerEmail: row.customer_email ?? '',
      customerPhone: row.customer_phone ?? '',
      variantId: row.variant_id,
      platform: ((row.platform ?? 'ORB-LITE') as Platform),
      renewalKind: (row.renewal_kind ?? 'platform') as Kind,
      renewalPeriod: (row.renewal_period ?? 'annual') as Period,
      unitName: row.unit_name ?? '',
      imei: row.imei ?? '',
      iccid: row.iccid ?? '',
      simPhone: row.sim_phone ?? '',
      amount: String(row.amount ?? 0),
      renewalDate: String(row.renewal_date ?? '').slice(0, 10),
      status: (STATUSES as readonly string[]).includes(row.status) ? row.status : 'activa',
    })
    setShowForm(true)
  }

  function pickVariant(id: string) {
    const v = RENOVATION_VARIANTS.find((x) => x.id === id)
    setForm((f) => {
      const period = (v?.renewal_period as Period) ?? f.renewalPeriod
      return {
        ...f,
        variantId: id,
        platform: ((v?.platform ?? f.platform) as Platform),
        renewalKind: (v?.renewal_kind as Kind) ?? f.renewalKind,
        renewalPeriod: period,
        amount: String(v?.price ?? f.amount),
        renewalDate: f.id ? f.renewalDate : nextRenewalDate(period),
      }
    })
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-7">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs tracking-[0.2em] text-primary">CRM ORB-LITE</p>
            <h1 className="font-display text-2xl text-foreground">Panel de renovaciones</h1>
            <p className="text-sm text-muted-foreground">
              Control de plataforma ORB-LITE y ORB-FULL: IMEI, ICCID, teléfono y fecha de
              renovación.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to="/crm">Solicitudes</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/clientes">Clientes</Link>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setForm(emptyForm(platform))
                setShowForm((s) => !s)
              }}
            >
              {showForm ? 'Cerrar formulario' : 'Nueva renovación'}
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          {(['ORB-LITE', 'ORB-FULL'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={platform === p ? 'default' : 'ghost'}
              onClick={() => setPlatform(p)}
            >
              Plataforma {p}
            </Button>
          ))}
        </div>

        <section className="grid gap-3 sm:grid-cols-3">
          <Stat label="Renovaciones" value={String(visible.length)} note={`Plataforma ${platform}`} />
          <Stat label="Mensuales" value={String(monthly.length)} note="Corte cada mes" />
          <Stat label="Importe registrado" value={mxn(totalMonto)} note="Suma de renovaciones" />
        </section>

        {showForm ? (
          <section className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="text-base text-foreground">
              {form.id ? 'Editar renovación' : 'Registrar renovación'}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tipo de renovación">
                <select
                  value={form.variantId}
                  onChange={(e) => pickVariant(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {RENOVATION_VARIANTS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Periodo">
                <select
                  value={form.renewalPeriod}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, renewalPeriod: e.target.value as Period }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="monthly">Mensual</option>
                  <option value="annual">Anual</option>
                </select>
              </Field>

              <Field label="Plataforma">
                <select
                  value={form.platform}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, platform: e.target.value as Platform }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="ORB-LITE">ORB-LITE</option>
                  <option value="ORB-FULL">ORB-FULL</option>
                </select>
              </Field>

              <Field label="Mes de renovación (siempre corre el día 1)">
                <Input
                  type="month"
                  value={form.renewalDate.slice(0, 7)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      renewalDate: e.target.value ? `${e.target.value}-01` : '',
                    }))
                  }
                />
              </Field>

              <Field label="Nombre del equipo en plataforma">
                <Input
                  value={form.unitName}
                  onChange={(e) => setForm((f) => ({ ...f, unitName: e.target.value }))}
                  placeholder="Ej. Camioneta Nissan"
                />
              </Field>

              <Field label="IMEI">
                <Input
                  value={form.imei}
                  onChange={(e) => setForm((f) => ({ ...f, imei: e.target.value }))}
                  placeholder="15 dígitos"
                />
              </Field>

              <Field label="ICCID del chip">
                <Input
                  value={form.iccid}
                  onChange={(e) => setForm((f) => ({ ...f, iccid: e.target.value }))}
                  placeholder="ICCID de la SIM"
                />
              </Field>

              <Field label="Teléfono del chip (opcional)">
                <Input
                  value={form.simPhone}
                  onChange={(e) => setForm((f) => ({ ...f, simPhone: e.target.value }))}
                  placeholder="Opcional"
                />
              </Field>

              <Field label="Número de cliente (opcional)">
                <Input
                  value={form.customerNumber}
                  onChange={(e) => setForm((f) => ({ ...f, customerNumber: e.target.value }))}
                  placeholder="Ej. 512"
                />
              </Field>

              <Field label="Nombre del cliente">
                <Input
                  value={form.customerName}
                  onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                />
              </Field>

              <Field label="Correo del cliente">
                <Input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                />
              </Field>

              <Field label="Teléfono del cliente (opcional)">
                <Input
                  value={form.customerPhone}
                  onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                />
              </Field>

              <Field label="Importe">
                <Input
                  type="number"
                  min={0}
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </Field>

              <Field label="Estado">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as FormState['status'] }))
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending || !form.renewalDate}
              >
                {mutation.isPending ? 'Guardando…' : form.id ? 'Guardar cambios' : 'Registrar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setForm(emptyForm(platform))
                }}
              >
                Cancelar
              </Button>
            </div>
          </section>
        ) : null}

        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por cliente, IMEI, ICCID, teléfono o equipo"
        />

        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando renovaciones…</p>
        ) : query.isError ? (
          <p className="text-sm text-destructive">
            No se pudieron cargar las renovaciones. Verifica que iniciaste sesión con
            ventas@orb-lite.com.
          </p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sin renovaciones registradas para la plataforma {platform}.
          </p>
        ) : (
          <div className="space-y-6">
            <Group
              title={`Mensuales · ${platform}`}
              rows={monthly}
              onEdit={startEdit}
              onDelete={(id) => removal.mutate(id)}
              pending={removal.isPending}
            />
            <Group
              title={`Anuales · ${platform}`}
              rows={annual}
              onEdit={startEdit}
              onDelete={(id) => removal.mutate(id)}
              pending={removal.isPending}
            />
          </div>
        )}
      </div>
    </main>
  )
}

function Group({
  title,
  rows,
  onEdit,
  onDelete,
  pending,
}: {
  title: string
  rows: any[]
  onEdit: (row: any) => void
  onDelete: (id: string) => void
  pending: boolean
}) {
  if (rows.length === 0) return null
  return (
    <section className="space-y-3">
      <h2 className="text-sm uppercase tracking-wide text-primary">
        {title} ({rows.length})
      </h2>
      {rows.map((row) => (
        <article key={row.id} className="space-y-2 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-primary">
                {row.platform ?? 'ORB-LITE'} · {PERIOD_LABEL[(row.renewal_period ?? 'annual') as Period]}
              </p>
              <p className="text-base text-foreground">{row.variant_name}</p>
              <p className="text-sm text-muted-foreground">
                {row.customer_name || 'Sin cliente'}
                {row.customer_number ? ` · Cliente #${row.customer_number}` : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-foreground">
                {mxn(Number(row.amount ?? 0))}
              </p>
              <p className="text-xs text-muted-foreground">
                Renueva:{' '}
                {new Date(`${String(row.renewal_date).slice(0, 10)}T12:00:00Z`).toLocaleDateString(
                  'es-MX',
                  { timeZone: 'America/Mexico_City' },
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {STATUS_LABEL[(row.status ?? 'activa') as keyof typeof STATUS_LABEL] ?? row.status}
              </p>
            </div>
          </div>

          <div className="grid gap-1 text-sm sm:grid-cols-2">
            <Row label="Equipo en plataforma" value={row.unit_name} />
            <Row label="IMEI" value={row.imei} />
            <Row label="ICCID" value={row.iccid} />
            <Row label="Teléfono del chip" value={row.sim_phone} />
            <Row label="Correo" value={row.customer_email} />
            <Row label="Teléfono del cliente" value={row.customer_phone} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
              Editar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => onDelete(row.id)}
            >
              Borrar
            </Button>
          </div>
        </article>
      ))}
    </section>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <p className="flex flex-wrap justify-between gap-2 text-muted-foreground">
      <span>{label}</span>
      <span className="text-right text-foreground">{value || '—'}</span>
    </p>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-2xl text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{note}</p>
    </div>
  )
}
