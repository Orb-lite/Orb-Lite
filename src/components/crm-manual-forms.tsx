import * as React from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  crmCreateSale,
  crmLookupCustomer,
  crmSaveCustomer,
  crmUpdateCustomer,
} from '@/lib/crm.functions'
import { IVA_RATE, PRODUCTS, SHIPPING_OPTIONS, formatMxn, findVariant } from '@/data/catalog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'


const CHANNELS = ['WhatsApp', 'Teléfono', 'Mostrador', 'Visita', 'Referido', 'Otro'] as const

type Line = { variantId: string; customName: string; quantity: number; unitPrice: number }

const CUSTOM_ID = '__custom__'

const DEFAULT_VARIANT = PRODUCTS[0]?.variants[0]

interface ClienteFields {
  customerNumber: string
  fullName: string
  phone: string
  email: string
  city: string
  state: string
  zip: string
}

const EMPTY_CLIENTE: ClienteFields = {
  customerNumber: '',
  fullName: '',
  phone: '',
  email: '',
  city: '',
  state: '',
  zip: '',
}

interface BillingFields {
  legalName: string
  rfc: string
  taxRegime: string
  cfdiUse: string
  fiscalZip: string
  email: string
  phone: string
  fiscalAddress: string
}

const EMPTY_BILLING: BillingFields = {
  legalName: '',
  rfc: '',
  taxRegime: '',
  cfdiUse: '',
  fiscalZip: '',
  email: '',
  phone: '',
  fiscalAddress: '',
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function ClienteFieldsGrid({
  prefix,
  value,
  onChange,
}: {
  prefix: string
  value: ClienteFields
  onChange: (next: ClienteFields) => void
}) {
  const set = (k: keyof ClienteFields) => (v: string) => onChange({ ...value, [k]: v })
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field id={`${prefix}-name`} label="Nombre completo" value={value.fullName} onChange={set('fullName')} />
      <Field id={`${prefix}-phone`} label="Teléfono" value={value.phone} onChange={set('phone')} />
      <Field id={`${prefix}-email`} label="Correo (opcional)" type="email" value={value.email} onChange={set('email')} />
      <Field id={`${prefix}-city`} label="Ciudad (opcional)" value={value.city} onChange={set('city')} />
      <Field id={`${prefix}-state`} label="Estado (opcional)" value={value.state} onChange={set('state')} />
      <Field id={`${prefix}-zip`} label="Código postal (opcional)" value={value.zip} onChange={set('zip')} />
    </div>
  )
}

function BillingFieldsGrid({
  prefix,
  value,
  onChange,
}: {
  prefix: string
  value: BillingFields
  onChange: (next: BillingFields) => void
}) {
  const set = (k: keyof BillingFields) => (v: string) => onChange({ ...value, [k]: v })
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field id={`${prefix}-legal`} label="Razón social" value={value.legalName} onChange={set('legalName')} />
      <Field id={`${prefix}-rfc`} label="RFC" value={value.rfc} onChange={set('rfc')} />
      <Field id={`${prefix}-regime`} label="Régimen fiscal" value={value.taxRegime} onChange={set('taxRegime')} />
      <Field id={`${prefix}-cfdi`} label="Uso de CFDI" value={value.cfdiUse} onChange={set('cfdiUse')} />
      <Field id={`${prefix}-zip`} label="CP fiscal" value={value.fiscalZip} onChange={set('fiscalZip')} />
      <Field id={`${prefix}-bemail`} label="Correo de facturación" type="email" value={value.email} onChange={set('email')} />
      <Field id={`${prefix}-bphone`} label="Teléfono de facturación" value={value.phone} onChange={set('phone')} />
      <Field id={`${prefix}-address`} label="Dirección fiscal" value={value.fiscalAddress} onChange={set('fiscalAddress')} />
    </div>
  )
}

function buildBilling(b: BillingFields) {
  return {
    legalName: b.legalName.trim(),
    rfc: b.rfc.trim(),
    taxRegime: b.taxRegime.trim(),
    cfdiUse: b.cfdiUse.trim(),
    fiscalZip: b.fiscalZip.trim(),
    email: b.email.trim(),
    phone: b.phone.trim(),
    fiscalAddress: b.fiscalAddress.trim(),
  }
}

/** Generador de ventas hechas fuera de la página. */
export function NuevaVentaSection() {
  const createSale = useServerFn(crmCreateSale)
  const lookup = useServerFn(crmLookupCustomer)
  const queryClient = useQueryClient()

  const [cliente, setCliente] = React.useState<ClienteFields>(EMPTY_CLIENTE)
  const [lines, setLines] = React.useState<Line[]>([
    {
      variantId: DEFAULT_VARIANT?.id ?? '',
      customName: '',
      quantity: 1,
      unitPrice: DEFAULT_VARIANT?.price ?? 0,
    },
  ])
  const [shippingId, setShippingId] = React.useState<'local' | 'national'>('local')
  const [channel, setChannel] = React.useState<string>('WhatsApp')
  const [status, setStatus] = React.useState<'vendido' | 'pendiente' | 'no_vendido'>('vendido')
  const [notes, setNotes] = React.useState('')
  const [wantsInvoice, setWantsInvoice] = React.useState(false)
  const [addIva, setAddIva] = React.useState(false)
  const [billing, setBilling] = React.useState<BillingFields>(EMPTY_BILLING)
  const [result, setResult] = React.useState<{ orderId: string; customerNumber: number } | null>(null)

  const shipping = SHIPPING_OPTIONS.find((s) => s.id === shippingId)!
  const productsTotal = lines.reduce((sum, l) => {
    return sum + l.unitPrice * l.quantity
  }, 0)
  const subtotal = productsTotal + shipping.price
  const iva = addIva ? Math.round(subtotal * IVA_RATE * 100) / 100 : 0
  const total = subtotal + iva

  const lookupMutation = useMutation({
    mutationFn: (n: number) => lookup({ data: { customerNumber: n } }),
    onSuccess: (res) => {
      const c: any = res.customer
      if (!c) {
        toast.info('No existe ese número; se creará un cliente nuevo.')
        return
      }
      setCliente({
        customerNumber: String(c.customer_number),
        fullName: c.full_name ?? '',
        phone: c.phone ?? '',
        email: c.email ?? c.contact?.email ?? '',
        city: c.contact?.city ?? '',
        state: c.contact?.state ?? '',
        zip: c.contact?.zip ?? '',
      })
      if (c.billing) {
        setBilling({ ...EMPTY_BILLING, ...c.billing })
      }
      toast.success(`Cliente #${c.customer_number} cargado`)
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo consultar el cliente'),
  })

  const mutation = useMutation({
    mutationFn: () =>
      createSale({
        data: {
          customerNumber: cliente.customerNumber ? Number(cliente.customerNumber) : null,
          fullName: cliente.fullName.trim(),
          phone: cliente.phone.trim(),
          email: cliente.email.trim() ? cliente.email.trim() : null,
          city: cliente.city.trim(),
          state: cliente.state.trim(),
          zip: cliente.zip.trim(),
          items: lines,
          shippingId,
          wantsInvoice,
          billing: wantsInvoice ? buildBilling(billing) : null,
          status,
          addIva,
          notes: notes.trim() ? notes.trim() : null,
          channel,
        },
      }),
    onSuccess: (res) => {
      setResult({ orderId: res.orderId, customerNumber: res.customerNumber })
      toast.success(`Venta registrada · cliente #${res.customerNumber}`)
      setCliente(EMPTY_CLIENTE)
      setBilling(EMPTY_BILLING)
      setWantsInvoice(false)
      setAddIva(false)
      setNotes('')
      setLines([
        {
          variantId: DEFAULT_VARIANT?.id ?? '',
          customName: '',
          quantity: 1,
          unitPrice: DEFAULT_VARIANT?.price ?? 0,
        },
      ])
      queryClient.invalidateQueries({ queryKey: ['crm-solicitudes'] })
      queryClient.invalidateQueries({ queryKey: ['crm-customers'] })
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo registrar la venta'),
  })

  const canSubmit =
    cliente.fullName.trim().length > 1 &&
    cliente.phone.trim().length > 6 &&
    lines.length > 0 &&
    lines.every((l) => l.variantId !== CUSTOM_ID || l.customName.trim().length > 1) &&
    (!wantsInvoice || (billing.legalName.trim() && billing.rfc.trim())) &&
    !mutation.isPending

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="text-base text-foreground">Registrar venta fuera de la página</h2>
          <p className="text-sm text-muted-foreground">
            Captura ventas hechas por WhatsApp, teléfono o mostrador; se guardan en la bitácora y en
            el historial del cliente.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="venta-num" className="text-xs text-muted-foreground">
              Número de cliente (opcional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="venta-num"
                value={cliente.customerNumber}
                autoComplete="off"
                placeholder="Ej. 1024"
                onChange={(e) =>
                  setCliente({ ...cliente, customerNumber: e.target.value.replace(/\D/g, '') })
                }
              />
              <Button
                type="button"
                variant="outline"
                disabled={!cliente.customerNumber || lookupMutation.isPending}
                onClick={() => lookupMutation.mutate(Number(cliente.customerNumber))}
              >
                Cargar
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Canal de la venta</Label>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((c) => (
                <Button
                  key={c}
                  type="button"
                  size="sm"
                  variant={channel === c ? 'default' : 'outline'}
                  onClick={() => setChannel(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <ClienteFieldsGrid prefix="venta" value={cliente} onChange={setCliente} />
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm uppercase tracking-wide text-primary">Productos</h3>
        {lines.map((line, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px_100px_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Producto</Label>
              <select
                value={line.variantId}
                onChange={(e) => {
                  const selected = findVariant(e.target.value)
                  setLines(
                    lines.map((l, i) =>
                      i === index
                        ? {
                            ...l,
                            variantId: e.target.value,
                            unitPrice:
                              e.target.value === CUSTOM_ID
                                ? l.unitPrice
                                : (selected?.variant.price ?? l.unitPrice),
                          }
                        : l,
                    ),
                  )
                }}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                {PRODUCTS.map((p) => (
                  <optgroup key={p.id} label={p.title}>
                    {p.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {formatMxn(v.price)}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value={CUSTOM_ID}>Producto personalizado (nombre e importe libres)</option>
              </select>
              {line.variantId === CUSTOM_ID && (
                <Input
                  className="mt-2"
                  autoComplete="off"
                  placeholder="Nombre del producto o servicio"
                  value={line.customName}
                  onChange={(e) =>
                    setLines(
                      lines.map((l, i) => (i === index ? { ...l, customName: e.target.value } : l)),
                    )
                  }
                />
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Precio unitario</Label>
              <Input
                type="number"
                min={0}
                max={10000000}
                step="0.01"
                value={line.unitPrice}
                onChange={(e) =>
                  setLines(
                    lines.map((l, i) =>
                      i === index
                        ? { ...l, unitPrice: Math.max(0, Math.min(10_000_000, Number(e.target.value) || 0)) }
                        : l,
                    ),
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Cantidad</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={line.quantity}
                onChange={(e) =>
                  setLines(
                    lines.map((l, i) =>
                      i === index
                        ? { ...l, quantity: Math.max(1, Math.min(100, Number(e.target.value) || 1)) }
                        : l,
                    ),
                  )
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={lines.length === 1}
              onClick={() => setLines(lines.filter((_, i) => i !== index))}
            >
              Quitar
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            setLines([
              ...lines,
              {
                variantId: DEFAULT_VARIANT?.id ?? '',
                customName: '',
                quantity: 1,
                unitPrice: DEFAULT_VARIANT?.price ?? 0,
              },
            ])
          }
        >
          Agregar producto
        </Button>

        <div className="space-y-2 pt-2">
          <Label className="text-xs text-muted-foreground">Entrega</Label>
          <div className="flex flex-wrap gap-2">
            {SHIPPING_OPTIONS.map((s) => (
              <Button
                key={s.id}
                type="button"
                size="sm"
                variant={shippingId === s.id ? 'default' : 'outline'}
                onClick={() => setShippingId(s.id)}
              >
                {s.label} {s.price > 0 ? `(+${formatMxn(s.price)})` : ''}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-primary/40 bg-primary/5 p-4 text-sm">
          <p className="flex justify-between text-muted-foreground">
            <span>Productos</span>
            <span className="text-foreground">{formatMxn(productsTotal)}</span>
          </p>
          <p className="flex justify-between text-muted-foreground">
            <span>Entrega</span>
            <span className="text-foreground">{formatMxn(shipping.price)}</span>
          </p>
          <label className="flex items-center gap-2 pt-1 text-sm text-foreground">
            <input
              type="checkbox"
              checked={addIva}
              onChange={(e) => setAddIva(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Agregar IVA (16%)
          </label>
          {addIva ? (
            <p className="flex justify-between text-muted-foreground">
              <span>IVA</span>
              <span className="text-foreground">{formatMxn(iva)}</span>
            </p>
          ) : null}
          <p className="mt-2 flex justify-between border-t border-border pt-2 text-base">
            <span className="text-foreground">{addIva ? 'Total con IVA' : 'Total (IVA incluido)'}</span>
            <span className="font-semibold text-foreground">{formatMxn(total)}</span>
          </p>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <label className="flex items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={wantsInvoice}
            onChange={(e) => setWantsInvoice(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          El cliente pidió factura
        </label>
        {wantsInvoice ? <BillingFieldsGrid prefix="venta" value={billing} onChange={setBilling} /> : null}

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Estado de la venta</Label>
          <div className="flex flex-wrap gap-2">
            {(['vendido', 'pendiente', 'no_vendido'] as const).map((s) => (
              <Button
                key={s}
                type="button"
                size="sm"
                variant={status === s ? 'default' : 'outline'}
                onClick={() => setStatus(s)}
              >
                {s === 'no_vendido' ? 'No vendido' : s === 'vendido' ? 'Vendido' : 'Pendiente'}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="venta-notes" className="text-xs text-muted-foreground">
            Notas internas
          </Label>
          <textarea
            id="venta-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            placeholder="Forma de pago, fecha de instalación, acuerdos…"
          />
        </div>

        <Button disabled={!canSubmit} onClick={() => mutation.mutate()}>
          {mutation.isPending ? 'Guardando…' : 'Registrar venta'}
        </Button>

        {result ? (
          <p className="text-sm text-primary">
            Venta {result.orderId} registrada para el cliente #{result.customerNumber}.
          </p>
        ) : null}
      </section>
    </div>
  )
}

/** Registro manual de clientes sin venta asociada. */
export function RegistrarClienteSection() {
  const saveCustomer = useServerFn(crmSaveCustomer)
  const lookup = useServerFn(crmLookupCustomer)
  const queryClient = useQueryClient()

  const [cliente, setCliente] = React.useState<ClienteFields>(EMPTY_CLIENTE)
  const [withBilling, setWithBilling] = React.useState(false)
  const [billing, setBilling] = React.useState<BillingFields>(EMPTY_BILLING)
  const [created, setCreated] = React.useState<{ customerNumber: number; isNew: boolean } | null>(null)

  const lookupMutation = useMutation({
    mutationFn: (n: number) => lookup({ data: { customerNumber: n } }),
    onSuccess: (res) => {
      const c: any = res.customer
      if (!c) {
        toast.info('No existe ese número; se creará como nuevo.')
        return
      }
      setCliente({
        customerNumber: String(c.customer_number),
        fullName: c.full_name ?? '',
        phone: c.phone ?? '',
        email: c.email ?? c.contact?.email ?? '',
        city: c.contact?.city ?? '',
        state: c.contact?.state ?? '',
        zip: c.contact?.zip ?? '',
      })
      if (c.billing) {
        setBilling({ ...EMPTY_BILLING, ...c.billing })
        setWithBilling(true)
      }
      toast.success(`Cliente #${c.customer_number} cargado`)
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo consultar el cliente'),
  })

  const mutation = useMutation({
    mutationFn: () =>
      saveCustomer({
        data: {
          customerNumber: cliente.customerNumber ? Number(cliente.customerNumber) : null,
          fullName: cliente.fullName.trim(),
          phone: cliente.phone.trim(),
          email: cliente.email.trim() ? cliente.email.trim() : null,
          city: cliente.city.trim(),
          state: cliente.state.trim(),
          zip: cliente.zip.trim(),
          billing: withBilling ? buildBilling(billing) : null,
        },
      }),
    onSuccess: (res) => {
      setCreated({ customerNumber: res.customerNumber, isNew: res.isNew })
      toast.success(
        res.isNew
          ? `Cliente #${res.customerNumber} registrado`
          : `Cliente #${res.customerNumber} actualizado`,
      )
      setCliente(EMPTY_CLIENTE)
      setBilling(EMPTY_BILLING)
      setWithBilling(false)
      queryClient.invalidateQueries({ queryKey: ['crm-customers'] })
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo guardar el cliente'),
  })

  const canSubmit =
    cliente.fullName.trim().length > 1 &&
    cliente.phone.trim().length > 6 &&
    (!withBilling || (billing.legalName.trim() && billing.rfc.trim())) &&
    !mutation.isPending

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="text-base text-foreground">Registrar cliente</h2>
          <p className="text-sm text-muted-foreground">
            Da de alta un cliente sin venta. Si dejas el número vacío se genera uno automáticamente.
          </p>
        </div>

        <div className="space-y-1.5 sm:max-w-xs">
          <Label htmlFor="cli-num" className="text-xs text-muted-foreground">
            Número de cliente (opcional)
          </Label>
          <div className="flex gap-2">
            <Input
              id="cli-num"
              value={cliente.customerNumber}
              autoComplete="off"
              placeholder="Ej. 1024"
              onChange={(e) =>
                setCliente({ ...cliente, customerNumber: e.target.value.replace(/\D/g, '') })
              }
            />
            <Button
              type="button"
              variant="outline"
              disabled={!cliente.customerNumber || lookupMutation.isPending}
              onClick={() => lookupMutation.mutate(Number(cliente.customerNumber))}
            >
              Cargar
            </Button>
          </div>
        </div>

        <ClienteFieldsGrid prefix="cli" value={cliente} onChange={setCliente} />

        <label className="flex items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={withBilling}
            onChange={(e) => setWithBilling(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Guardar datos de facturación
        </label>
        {withBilling ? <BillingFieldsGrid prefix="cli" value={billing} onChange={setBilling} /> : null}

        <Button disabled={!canSubmit} onClick={() => mutation.mutate()}>
          {mutation.isPending ? 'Guardando…' : 'Guardar cliente'}
        </Button>

        {created ? (
          <p className="text-sm text-primary">
            {created.isNew ? 'Alta creada' : 'Datos actualizados'} · cliente #{created.customerNumber}
          </p>
        ) : null}
      </section>
    </div>
  )
}

/** Editor de datos de un cliente existente. */
export function EditarClienteDialog({
  customer,
  open,
  onOpenChange,
}: {
  customer: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const updateCustomer = useServerFn(crmUpdateCustomer)
  const queryClient = useQueryClient()

  const [cliente, setCliente] = React.useState<ClienteFields>(EMPTY_CLIENTE)
  const [withBilling, setWithBilling] = React.useState(false)
  const [billing, setBilling] = React.useState<BillingFields>(EMPTY_BILLING)

  React.useEffect(() => {
    if (!customer) return
    const contact = (customer.contact ?? {}) as Record<string, any>
    setCliente({
      customerNumber: String(customer.customer_number ?? ''),
      fullName: customer.full_name ?? '',
      phone: customer.phone ?? '',
      email: customer.email ?? contact['email'] ?? '',
      city: contact['city'] ?? '',
      state: contact['state'] ?? '',
      zip: contact['zip'] ?? '',
    })
    const hasBilling = customer.billing && Object.keys(customer.billing).length > 0
    setBilling(hasBilling ? { ...EMPTY_BILLING, ...customer.billing } : EMPTY_BILLING)
    setWithBilling(Boolean(hasBilling))
  }, [customer])

  const mutation = useMutation({
    mutationFn: () =>
      updateCustomer({
        data: {
          customerNumber: Number(cliente.customerNumber),
          fullName: cliente.fullName.trim(),
          phone: cliente.phone.trim(),
          email: cliente.email.trim() ? cliente.email.trim() : null,
          city: cliente.city.trim(),
          state: cliente.state.trim(),
          zip: cliente.zip.trim(),
          billing: withBilling ? buildBilling(billing) : null,
        },
      }),
    onSuccess: (res) => {
      toast.success(`Cliente #${res.customerNumber} actualizado`)
      queryClient.invalidateQueries({ queryKey: ['crm-customers'] })
      queryClient.invalidateQueries({ queryKey: ['crm-clientes'] })
      onOpenChange(false)
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : 'No se pudo actualizar el cliente'),
  })

  const canSubmit =
    cliente.fullName.trim().length > 1 &&
    cliente.phone.trim().length > 6 &&
    (!withBilling || (billing.legalName.trim() && billing.rfc.trim())) &&
    !mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar cliente #{cliente.customerNumber}</DialogTitle>
          <DialogDescription>
            Actualiza contacto y facturación. El historial de compras no se modifica.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ClienteFieldsGrid prefix="edit" value={cliente} onChange={setCliente} />

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={withBilling}
              onChange={(e) => setWithBilling(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Guardar datos de facturación
          </label>
          {withBilling ? (
            <BillingFieldsGrid prefix="edit" value={billing} onChange={setBilling} />
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button disabled={!canSubmit} onClick={() => mutation.mutate()}>
              {mutation.isPending ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
