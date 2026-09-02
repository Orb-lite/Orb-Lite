import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type SolicitudStatus = 'pendiente' | 'vendido' | 'no_vendido'

export const STATUS_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  vendido: 'Vendido',
  no_vendido: 'No vendido',
}

export const mxn = (n: number) =>
  `$${(n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function summarizeItems(items: unknown): string {
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

export function SolicitudCard({
  row,
  pending,
  onSave,
  onExpand,
}: {
  row: any
  pending: boolean
  onSave: (status: SolicitudStatus, notes: string) => void
  onExpand?: () => void
}) {
  const [status, setStatus] = React.useState<SolicitudStatus>(row.status)
  const [notes, setNotes] = React.useState<string>(row.notes ?? '')

  React.useEffect(() => {
    setStatus(row.status)
    setNotes(row.notes ?? '')
  }, [row.status, row.notes])

  const dirty = status !== row.status || notes !== (row.notes ?? '')

  return (
    <article className="space-y-3 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm text-primary">
            Pedido #{row.order_id}
            {row.customer_number ? ` · Cliente #${row.customer_number}` : ''}
          </p>
          <p className="text-base text-foreground">
            {row.full_name || 'Sin nombre'} · {row.phone || 'Sin teléfono'}
          </p>
          {row.email ? <p className="text-sm text-muted-foreground">{row.email}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-base font-semibold text-foreground">{mxn(Number(row.total ?? 0))}</p>
          {onExpand ? (
            <Button size="sm" variant="outline" onClick={onExpand}>
              Ver completo
            </Button>
          ) : null}
        </div>
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
