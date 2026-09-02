import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface PendingOrder {
  orderId: string
  createdAt: string
  customerNumber?: number | null
  fullName?: string | null
  phone?: string | null
  email?: string | null
  total?: number | null
  shippingLabel?: string | null
  wantsInvoice?: boolean | null
  itemsSummary?: string | null
  status?: string | null
}

interface Props {
  date?: string
  count?: number
  totalPending?: number
  orders?: PendingOrder[]
  panelUrl?: string
}

const mxn = (n?: number | null) =>
  `$${(n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const navy = '#0B0E14'
const lime = '#A3E635'
const border = '#22262F'
const muted = '#9BA3AF'

export function ResumenPendientesEmail({
  date = '',
  count = 0,
  totalPending = 0,
  orders = [],
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{`${count} solicitud(es) pendientes por revisar`}</Preview>
      <Body style={{ backgroundColor: navy, margin: 0, fontFamily: 'Barlow, Arial, sans-serif' }}>
        <Container style={{ maxWidth: '640px', margin: '0 auto', padding: '24px' }}>
          <Section
            style={{
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '24px',
              backgroundColor: '#11151D',
            }}
          >
            <Text style={{ color: lime, fontSize: '12px', letterSpacing: '2px', margin: 0 }}>
              ORB-LITE · BITÁCORA DIARIA
            </Text>
            <Heading style={{ color: '#FFFFFF', fontSize: '22px', margin: '8px 0 4px' }}>
              Solicitudes pendientes por revisar
            </Heading>
            <Text style={{ color: muted, fontSize: '13px', margin: '0 0 16px' }}>
              Corte del {date} (00:00 GMT)
            </Text>

            <Text style={{ color: '#FFFFFF', fontSize: '15px', margin: '0 0 4px' }}>
              Pendientes: <strong style={{ color: lime }}>{count}</strong>
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: '15px', margin: '0 0 16px' }}>
              Valor total pendiente: <strong style={{ color: lime }}>{mxn(totalPending)}</strong>
            </Text>

            <Hr style={{ borderColor: border, margin: '16px 0' }} />

            {count === 0 ? (
              <Text style={{ color: muted, fontSize: '14px' }}>
                No hay solicitudes pendientes. Todo está marcado como vendido o no vendido.
              </Text>
            ) : (
              orders.map((o) => (
                <Section
                  key={o.orderId}
                  style={{
                    border: `1px solid ${border}`,
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '12px',
                  }}
                >
                  <Text style={{ color: lime, fontSize: '13px', margin: '0 0 6px' }}>
                    Pedido #{o.orderId}
                    {o.customerNumber ? ` · Cliente #${o.customerNumber}` : ''}
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontSize: '14px', margin: '0 0 4px' }}>
                    {o.fullName || 'Sin nombre'} · {o.phone || 'Sin teléfono'}
                  </Text>
                  {o.email ? (
                    <Text style={{ color: muted, fontSize: '13px', margin: '0 0 4px' }}>
                      {o.email}
                    </Text>
                  ) : null}
                  {o.itemsSummary ? (
                    <Text style={{ color: muted, fontSize: '13px', margin: '0 0 4px' }}>
                      {o.itemsSummary}
                    </Text>
                  ) : null}
                  <Text style={{ color: muted, fontSize: '13px', margin: '0 0 4px' }}>
                    Entrega: {o.shippingLabel || 'Entrega local'} · Factura:{' '}
                    {o.wantsInvoice ? 'Sí' : 'No'}
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontSize: '14px', margin: '4px 0 0' }}>
                    Total: <strong>{mxn(o.total)}</strong>
                  </Text>
                  <Text style={{ color: muted, fontSize: '12px', margin: '4px 0 0' }}>
                    Recibido: {o.createdAt}
                  </Text>
                </Section>
              ))
            )}

            <Hr style={{ borderColor: border, margin: '16px 0' }} />
            {panelUrl ? (
              <Section style={{ marginBottom: '12px' }}>
                <Link
                  href={panelUrl}
                  style={{
                    display: 'inline-block',
                    backgroundColor: lime,
                    color: navy,
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '12px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Actualizar estados de solicitudes
                </Link>
                <Text style={{ color: muted, fontSize: '12px', margin: '8px 0 0' }}>
                  Enlace privado y no listado en el sitio: no lo compartas.
                </Text>
              </Section>
            ) : null}
            <Text style={{ color: muted, fontSize: '12px', margin: 0 }}>
              Estas solicitudes seguirán apareciendo en el resumen diario hasta que cambies su
              estado a vendido o no vendido (desde el enlace de arriba o en la base de datos).
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template: TemplateEntry = {
  component: ResumenPendientesEmail,
  subject: (data: Record<string, any>) =>
    `ORB-LITE · ${data['count'] ?? 0} solicitudes pendientes por revisar`,
  displayName: 'Resumen diario de pendientes',
  to: 'ventas@orb-lite.com',
  previewData: {
    date: '02/09/2026',
    count: 1,
    totalPending: 2946,
    orders: [
      {
        orderId: 'ABC123',
        createdAt: '01/09/2026 18:20',
        customerNumber: 500,
        fullName: 'Juan Pérez',
        phone: '3318359421',
        email: 'juan@example.com',
        total: 2946,
        shippingLabel: 'Envío foráneo (ocurre)',
        wantsInvoice: true,
        itemsSummary: '1 × Equipo GPS con SIM',
        status: 'pendiente',
      },
    ],
  },
}
