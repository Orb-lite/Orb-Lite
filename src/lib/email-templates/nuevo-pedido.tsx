import * as React from 'react'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface OrderLine {
  variantName: string
  title: string
  quantity: number
  unitPrice: number
  lineTotal: number
  addOns: Array<{ name: string; price: number }>
  isRenewal: boolean
  renewal?: { fullName: string; unitName: string } | null
}

interface Props {
  orderId?: string
  lines?: OrderLine[]
  shippingLabel?: string
  shippingPrice?: number
  productsTotal?: number
  subtotalWithoutIva?: number
  iva?: number
  total?: number
  totalItems?: number
  isNational?: boolean
  shippingInfo?: {
    fullName: string
    phone: string
    zip: string
    city: string
    state: string
  } | null
  pickupInfo?: { fullName: string; phone: string } | null
  wantsInvoice?: boolean
  billingInfo?: {
    legalName: string
    rfc: string
    taxRegime: string
    cfdiUse: string
    fiscalZip: string
    email: string
    phone: string
  } | null
}

const mxn = (n?: number) =>
  `$${(n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const NuevoPedidoEmail = (p: Props) => {
  const lines = p.lines ?? []
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        {`Nuevo pedido ${p.orderId ?? ''} — ${p.totalItems ?? 0} artículo(s) — ${mxn(p.total)} MXN`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ORB-LITE</Heading>
            <Text style={headerSub}>Rastreo GPS Satelital · Bitácora de ventas</Text>
          </Section>

          <Heading as="h2" style={h2}>
            Nuevo pedido {p.orderId ? `#${p.orderId}` : ''}
          </Heading>
          <Text style={muted}>
            Entrega: <strong>{p.shippingLabel ?? '—'}</strong>
            {p.isNational ? ' (envío foráneo)' : ' (entrega local)'}
          </Text>

          <Section style={card}>
            <Text style={sectionTitle}>PAQUETES</Text>
            {lines.map((l, i) => (
              <Section key={i} style={lineBlock}>
                <Row>
                  <Column>
                    <Text style={lineName}>
                      {l.variantName} ×{l.quantity}
                    </Text>
                    <Text style={lineDetail}>{l.title}</Text>
                    {l.addOns?.map((a) => (
                      <Text key={a.name} style={lineDetail}>
                        + {a.name} — {mxn(a.price)}
                      </Text>
                    ))}
                    {l.isRenewal && l.renewal ? (
                      <Text style={lineDetail}>
                        Equipo: {l.renewal.unitName} ({l.renewal.fullName})
                      </Text>
                    ) : null}
                  </Column>
                  <Column align="right">
                    <Text style={linePrice}>{mxn(l.lineTotal)}</Text>
                  </Column>
                </Row>
              </Section>
            ))}
            <Hr style={hr} />
            <Row>
              <Column><Text style={totalRow}>Productos</Text></Column>
              <Column align="right"><Text style={totalRow}>{mxn(p.productsTotal)}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={totalRow}>Envío</Text></Column>
              <Column align="right"><Text style={totalRow}>{mxn(p.shippingPrice)}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={totalRow}>Subtotal sin IVA</Text></Column>
              <Column align="right"><Text style={totalRow}>{mxn(p.subtotalWithoutIva)}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={totalRow}>IVA (16%)</Text></Column>
              <Column align="right"><Text style={totalRow}>{mxn(p.iva)}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={grandTotal}>TOTAL</Text></Column>
              <Column align="right"><Text style={grandTotal}>{mxn(p.total)} MXN</Text></Column>
            </Row>
          </Section>

          {p.isNational && p.shippingInfo ? (
            <Section style={card}>
              <Text style={sectionTitle}>DATOS DE ENVÍO (FORÁNEO)</Text>
              <Text style={detail}>Nombre: {p.shippingInfo.fullName}</Text>
              <Text style={detail}>Teléfono: {p.shippingInfo.phone}</Text>
              <Text style={detail}>
                {p.shippingInfo.city}, {p.shippingInfo.state} — C.P. {p.shippingInfo.zip}
              </Text>
            </Section>
          ) : null}

          {!p.isNational && p.pickupInfo ? (
            <Section style={card}>
              <Text style={sectionTitle}>CONTACTO PARA ENTREGA LOCAL</Text>
              <Text style={detail}>Nombre: {p.pickupInfo.fullName}</Text>
              <Text style={detail}>Teléfono: {p.pickupInfo.phone}</Text>
            </Section>
          ) : null}

          {p.wantsInvoice && p.billingInfo ? (
            <Section style={card}>
              <Text style={sectionTitle}>FACTURACIÓN (CFDI 4.0)</Text>
              <Text style={detail}>Razón social: {p.billingInfo.legalName}</Text>
              <Text style={detail}>RFC: {p.billingInfo.rfc}</Text>
              <Text style={detail}>Régimen fiscal: {p.billingInfo.taxRegime}</Text>
              <Text style={detail}>Uso de CFDI: {p.billingInfo.cfdiUse}</Text>
              <Text style={detail}>C.P. fiscal: {p.billingInfo.fiscalZip}</Text>
              <Text style={detail}>Correo: {p.billingInfo.email}</Text>
              <Text style={detail}>Teléfono: {p.billingInfo.phone}</Text>
            </Section>
          ) : (
            <Text style={muted}>El cliente no requiere factura.</Text>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Correo automático de orb-lite.com · Cada pedido finalizado por WhatsApp queda
            registrado aquí como bitácora de venta.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: NuevoPedidoEmail,
  subject: (d: Record<string, any>) =>
    `Nuevo pedido ORB-LITE${d['orderId'] ? ` #${d['orderId']}` : ''} — ${mxn(d['total'])} MXN`,
  displayName: 'Notificación de nuevo pedido',
  to: 'ventas@orb-lite.com',
  previewData: {
    orderId: 'ABC123',
    lines: [
      {
        variantName: 'Kit con SIM global M2M',
        title: 'Equipo GPS ORB-LITE OL-01',
        quantity: 1,
        unitPrice: 1500,
        lineTotal: 1500,
        addOns: [],
        isRenewal: false,
      },
    ],
    shippingLabel: 'Envío nacional',
    shippingPrice: 450,
    productsTotal: 1500,
    subtotalWithoutIva: 1681.03,
    iva: 268.97,
    total: 1950,
    totalItems: 1,
    isNational: true,
    shippingInfo: {
      fullName: 'Isaac Gómez',
      phone: '3318359421',
      zip: '44100',
      city: 'Guadalajara',
      state: 'Jalisco',
    },
    wantsInvoice: false,
    billingInfo: null,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px', margin: '0 auto' }
const header = {
  backgroundColor: '#0B0E14',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '20px',
}
const logo = { color: '#A3E635', fontSize: '24px', margin: '0', letterSpacing: '2px' }
const headerSub = { color: '#94A3B8', fontSize: '12px', margin: '4px 0 0' }
const h2 = { color: '#0B0E14', fontSize: '20px', margin: '0 0 8px' }
const muted = { color: '#64748B', fontSize: '13px', margin: '4px 0 16px' }
const card = {
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
}
const sectionTitle = {
  color: '#0B0E14',
  fontSize: '11px',
  fontWeight: 'bold' as const,
  letterSpacing: '1.5px',
  margin: '0 0 10px',
}
const lineBlock = { marginBottom: '10px' }
const lineName = { color: '#0B0E14', fontSize: '14px', fontWeight: 'bold' as const, margin: '0' }
const lineDetail = { color: '#64748B', fontSize: '12px', margin: '2px 0 0' }
const linePrice = { color: '#0B0E14', fontSize: '14px', fontWeight: 'bold' as const, margin: '0' }
const hr = { borderColor: '#E2E8F0', margin: '12px 0' }
const totalRow = { color: '#475569', fontSize: '13px', margin: '2px 0' }
const grandTotal = { color: '#0B0E14', fontSize: '16px', fontWeight: 'bold' as const, margin: '8px 0 0' }
const detail = { color: '#334155', fontSize: '13px', margin: '3px 0' }
const footer = { color: '#94A3B8', fontSize: '11px', textAlign: 'center' as const }
