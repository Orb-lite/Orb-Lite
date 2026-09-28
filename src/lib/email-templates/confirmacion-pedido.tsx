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
  renewal?: {
    fullName: string
    unitName?: string | null
    imei?: string | null
    iccid?: string | null
    simPhone?: string | null
  } | null
}

interface Props {
  orderId?: string
  customerName?: string
  customerNumber?: number | null
  ordersCount?: number | null
  lines?: OrderLine[]
  shippingLabel?: string
  shippingPrice?: number
  productsTotal?: number
  subtotalWithoutIva?: number
  iva?: number
  total?: number
  isNational?: boolean
  wantsInvoice?: boolean
}

const mxn = (n?: number) =>
  `$${(n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const ConfirmacionPedidoEmail = (p: Props) => {
  const lines = p.lines ?? []
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        {`Recibimos tu solicitud ${p.orderId ? `#${p.orderId}` : ''} — ${mxn(p.total)} MXN`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>ORB-LITE</Heading>
            <Text style={headerSub}>Rastreo GPS Satelital</Text>
          </Section>

          <Heading as="h2" style={h2}>
            {p.customerName ? `¡Gracias, ${p.customerName}!` : '¡Gracias por tu solicitud!'}
          </Heading>
          <Text style={muted}>
            Recibimos tu solicitud {p.orderId ? <strong>#{p.orderId}</strong> : null} y nuestro
            equipo te contactará por WhatsApp para confirmar la entrega y el pago.
          </Text>

          <Section style={numberCard}>
            <Text style={numberLabel}>TU NÚMERO DE CLIENTE</Text>
            <Text style={numberValue}>
              {p.customerNumber ? `#${p.customerNumber}` : 'Se asignará al confirmar tu compra'}
            </Text>
            <Text style={numberNote}>
              Guárdalo y menciónalo en tus próximas compras: con tus compras acumuladas se activan
              descuentos y promociones exclusivas para clientes ORB-LITE.
              {p.ordersCount ? ` Llevas ${p.ordersCount} compra(s) registrada(s).` : ''}
            </Text>
          </Section>

          <Section style={card}>
            <Text style={sectionTitle}>RESUMEN DE TU SOLICITUD</Text>
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
                      <>
                        <Text style={lineDetail}>Titular: {l.renewal.fullName}</Text>
                        {l.renewal.unitName ? (
                          <Text style={lineDetail}>
                            Equipo en plataforma: {l.renewal.unitName}
                          </Text>
                        ) : null}
                        {l.renewal.imei ? (
                          <Text style={lineDetail}>IMEI: {l.renewal.imei}</Text>
                        ) : null}
                        {l.renewal.iccid ? (
                          <Text style={lineDetail}>ICCID: {l.renewal.iccid}</Text>
                        ) : null}
                        {l.renewal.simPhone ? (
                          <Text style={lineDetail}>Tel. del chip: {l.renewal.simPhone}</Text>
                        ) : null}
                      </>
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
              <Column>
                <Text style={totalRow}>
                  Entrega{p.shippingLabel ? ` — ${p.shippingLabel}` : ''}
                </Text>
              </Column>
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

          <Text style={muted}>
            {p.wantsInvoice
              ? 'Registramos tu solicitud de factura con los datos fiscales que capturaste.'
              : 'No solicitaste factura en este pedido. Si la necesitas, avísanos por WhatsApp.'}
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            ORB-LITE · ventas@orb-lite.com · WhatsApp 33 1835 9421 · orb-lite.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ConfirmacionPedidoEmail,
  subject: (d: Record<string, any>) =>
    `Recibimos tu solicitud ORB-LITE${d['orderId'] ? ` #${d['orderId']}` : ''}`,
  displayName: 'Confirmación de pedido (cliente)',
  previewData: {
    orderId: 'ABC123',
    customerName: 'Isaac Gómez',
    customerNumber: 69228,
    ordersCount: 2,
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
    isNational: true,
    wantsInvoice: false,
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
const numberCard = {
  backgroundColor: '#F7FEE7',
  border: '1px solid #A3E635',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
}
const numberLabel = {
  color: '#3F6212',
  fontSize: '11px',
  fontWeight: 'bold' as const,
  letterSpacing: '1.5px',
  margin: '0 0 4px',
}
const numberValue = {
  color: '#0B0E14',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  margin: '0 0 6px',
}
const numberNote = { color: '#3F6212', fontSize: '12px', margin: '0' }
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
const footer = { color: '#94A3B8', fontSize: '11px', textAlign: 'center' as const }
