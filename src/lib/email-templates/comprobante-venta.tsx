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

interface SaleLine {
  variantName: string
  title: string
  quantity: number
  unitPrice: number
  lineTotal: number
  addOns?: Array<{ name: string; price: number }>
  isRenewal?: boolean
  renewal?: {
    fullName?: string
    unitName?: string | null
    imei?: string | null
    iccid?: string | null
    simPhone?: string | null
  } | null
}

interface Props {
  orderId?: string
  issuedAt?: string
  channel?: string
  customerName?: string | null
  customerNumber?: number | null
  customerEmail?: string | null
  customerPhone?: string | null
  lines?: SaleLine[]
  shippingLabel?: string
  shippingPrice?: number
  productsTotal?: number
  subtotalWithoutIva?: number
  iva?: number
  total?: number
  wantsInvoice?: boolean
  billingInfo?: {
    legalName?: string
    rfc?: string
    taxRegime?: string
    cfdiUse?: string
    fiscalZip?: string
    email?: string
    phone?: string
    fiscalAddress?: string | null
  } | null
}

const mxn = (n?: number) =>
  `$${(n ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const ComprobanteVentaEmail = (p: Props) => {
  const lines = p.lines ?? []
  const billing = p.wantsInvoice ? (p.billingInfo ?? null) : null
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        {`Comprobante de venta ${p.orderId ? `#${p.orderId}` : ''} — ${mxn(p.total)} MXN`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Row>
              <Column>
                <Heading style={logo}>ORB-LITE</Heading>
                <Text style={headerSub}>Rastreo GPS Satelital</Text>
              </Column>
              <Column align="right">
                <Text style={docType}>COMPROBANTE DE VENTA</Text>
                <Text style={headerSub}>{p.orderId ? `Folio ${p.orderId}` : ''}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={card}>
            <Row>
              <Column>
                <Text style={sectionTitle}>DATOS DE LA VENTA</Text>
                <Text style={detail}>Folio: {p.orderId ?? '—'}</Text>
                <Text style={detail}>Fecha: {p.issuedAt ?? '—'}</Text>
                <Text style={detail}>Canal: {p.channel ?? 'Tienda en línea'}</Text>
                <Text style={detail}>
                  Entrega: {p.shippingLabel ?? '—'}
                </Text>
              </Column>
              <Column>
                <Text style={sectionTitle}>CLIENTE</Text>
                <Text style={detail}>{p.customerName ?? '—'}</Text>
                <Text style={detail}>
                  Número de cliente: {p.customerNumber ? `#${p.customerNumber}` : 'Por asignar'}
                </Text>
                {p.customerPhone ? <Text style={detail}>Tel: {p.customerPhone}</Text> : null}
                {p.customerEmail ? <Text style={detail}>{p.customerEmail}</Text> : null}
              </Column>
            </Row>
          </Section>

          {billing ? (
            <Section style={card}>
              <Text style={sectionTitle}>DATOS FISCALES PARA FACTURA</Text>
              <Text style={detail}>Razón social: {billing.legalName ?? '—'}</Text>
              <Text style={detail}>RFC: {billing.rfc ?? '—'}</Text>
              <Text style={detail}>Régimen fiscal: {billing.taxRegime ?? '—'}</Text>
              <Text style={detail}>Uso de CFDI: {billing.cfdiUse ?? '—'}</Text>
              <Text style={detail}>C.P. fiscal: {billing.fiscalZip ?? '—'}</Text>
              {billing.fiscalAddress ? (
                <Text style={detail}>Domicilio: {billing.fiscalAddress}</Text>
              ) : null}
              {billing.email ? <Text style={detail}>Correo fiscal: {billing.email}</Text> : null}
              {billing.phone ? <Text style={detail}>Teléfono: {billing.phone}</Text> : null}
            </Section>
          ) : null}

          <Section style={card}>
            <Text style={sectionTitle}>CONCEPTOS</Text>
            {lines.map((l, i) => (
              <Section key={i} style={lineBlock}>
                <Row>
                  <Column>
                    <Text style={lineName}>
                      {l.variantName} ×{l.quantity}
                    </Text>
                    <Text style={lineDetail}>{l.title}</Text>
                    <Text style={lineDetail}>Precio unitario: {mxn(l.unitPrice)}</Text>
                    {l.addOns?.map((a) => (
                      <Text key={a.name} style={lineDetail}>
                        + {a.name} — {mxn(a.price)}
                      </Text>
                    ))}
                    {l.renewal ? (
                      <>
                        {l.renewal.fullName ? (
                          <Text style={lineDetail}>Titular: {l.renewal.fullName}</Text>
                        ) : null}
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
              <Column><Text style={totalRow}>Entrega</Text></Column>
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
            {billing
              ? 'Este documento es el comprobante interno de la venta. El CFDI (factura fiscal) se emite con los datos fiscales de arriba y se envía por correo una vez confirmado el pago.'
              : 'Este documento es el comprobante de tu venta. Si necesitas factura fiscal (CFDI), respóndenos con tu constancia de situación fiscal vigente.'}
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
  component: ComprobanteVentaEmail,
  subject: (d: Record<string, any>) =>
    `Comprobante de venta ORB-LITE${d['orderId'] ? ` #${d['orderId']}` : ''}`,
  displayName: 'Comprobante de venta (factura)',
  previewData: {
    orderId: 'MAN-ABC123',
    issuedAt: '14 de septiembre de 2026, 10:20',
    channel: 'Venta directa',
    customerName: 'Isaac Gómez',
    customerNumber: 512,
    customerEmail: 'cliente@correo.com',
    customerPhone: '33 1835 9421',
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
    wantsInvoice: false,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const header = {
  backgroundColor: '#0B0E14',
  borderRadius: '12px',
  padding: '20px 24px',
  marginBottom: '20px',
}
const logo = { color: '#A3E635', fontSize: '24px', margin: '0', letterSpacing: '2px' }
const headerSub = { color: '#94A3B8', fontSize: '12px', margin: '4px 0 0' }
const docType = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  letterSpacing: '1.5px',
  margin: '0',
}
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
  margin: '0 0 8px',
}
const detail = { color: '#475569', fontSize: '12px', margin: '2px 0' }
const lineBlock = { marginBottom: '10px' }
const lineName = { color: '#0B0E14', fontSize: '14px', fontWeight: 'bold' as const, margin: '0' }
const lineDetail = { color: '#64748B', fontSize: '12px', margin: '2px 0 0' }
const linePrice = { color: '#0B0E14', fontSize: '14px', fontWeight: 'bold' as const, margin: '0' }
const hr = { borderColor: '#E2E8F0', margin: '12px 0' }
const totalRow = { color: '#475569', fontSize: '13px', margin: '2px 0' }
const grandTotal = {
  color: '#0B0E14',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  margin: '8px 0 0',
}
const muted = { color: '#64748B', fontSize: '12px', margin: '4px 0 16px' }
const footer = { color: '#94A3B8', fontSize: '11px', textAlign: 'center' as const }
