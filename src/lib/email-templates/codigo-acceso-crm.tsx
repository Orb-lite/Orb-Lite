import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  code?: string
  minutes?: number
  url?: string
}

const Email = ({ code = '000000', minutes = 20, url }: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu código de un solo uso para crear la contraseña del CRM</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ORB-LITE · RASTREO GPS SATELITAL</Text>
        <Heading style={h1}>Código de acceso al CRM</Heading>
        <Text style={p}>
          Usa este código de un solo uso para crear (o restablecer) la contraseña de la cuenta
          <strong> ventas@orb-lite.com</strong>.
        </Text>

        <Section style={codeBox}>
          <Text style={codeText}>{code}</Text>
        </Section>

        <Text style={p}>
          Vence en {minutes} minutos y solo puede usarse una vez.
        </Text>

        {url ? (
          <Text style={p}>
            Abre esta página para usarlo: <br />
            <span style={link}>{url}</span>
          </Text>
        ) : null}

        <Text style={small}>
          Si no solicitaste este código, ignora este correo: nadie puede entrar al CRM sin él.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Código de un solo uso · CRM ORB-LITE',
  displayName: 'Código de acceso CRM',
  previewData: { code: '482913', minutes: 20, url: 'https://orb-lite.com/acceso-crm' },
  to: 'ventas@orb-lite.com',
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '28px 26px', maxWidth: '560px' }
const brand = {
  fontSize: '11px',
  letterSpacing: '2px',
  color: '#65a30d',
  margin: '0 0 6px',
  fontWeight: 700 as const,
}
const h1 = { fontSize: '22px', color: '#0B0E14', margin: '0 0 14px' }
const p = { fontSize: '15px', color: '#1f2937', lineHeight: '22px', margin: '0 0 14px' }
const codeBox = {
  backgroundColor: '#0B0E14',
  borderRadius: '12px',
  padding: '18px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
}
const codeText = {
  fontSize: '32px',
  letterSpacing: '8px',
  color: '#A3E635',
  fontWeight: 700 as const,
  margin: '0',
}
const link = { fontSize: '14px', color: '#65a30d', wordBreak: 'break-all' as const }
const small = { fontSize: '12px', color: '#6b7280', margin: '18px 0 0' }
