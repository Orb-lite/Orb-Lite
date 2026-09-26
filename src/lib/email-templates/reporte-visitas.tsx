import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Stop {
  label: string
  visitedAt: string | null
  comment: string | null
}
interface Props {
  routeName?: string
  stops?: Stop[]
}

function fmt(iso: string | null) {
  if (!iso) return 'Sin visitar'
  return new Date(iso).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const Email = ({ routeName = 'Ruta', stops = [] }: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>{`Reporte de visitas: ${routeName}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ORB-LITE</Text>
        <Heading style={h1}>Reporte de visitas</Heading>
        <Text style={muted}>
          {routeName} · {stops.filter((s) => s.visitedAt).length} de {stops.length} paradas visitadas
        </Text>
        <Hr style={hr} />
        {stops.map((stop, i) => (
          <Section key={i} style={row}>
            <Text style={label}>
              {i === 0 ? 'Salida' : `Parada ${i}`}: {stop.label}
            </Text>
            <Text style={muted}>{fmt(stop.visitedAt)}</Text>
            {stop.comment ? <Text style={comment}>“{stop.comment}”</Text> : null}
          </Section>
        ))}
        <Hr style={hr} />
        <Text style={muted}>Reporte generado automáticamente al terminar la ruta.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Reporte de visitas: ${d['routeName'] ?? 'Ruta'}`,
  displayName: 'Reporte de visitas de ruta',
  previewData: {
    routeName: 'Ruta Centro',
    stops: [
      { label: 'Bodega', visitedAt: '2026-09-25T15:00:00Z', comment: null },
      { label: 'Cliente A', visitedAt: '2026-09-25T16:10:00Z', comment: 'Entregado en recepción' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brand = { color: '#0b1f3a', fontWeight: 700, letterSpacing: '3px', fontSize: '12px' }
const h1 = { color: '#0b1f3a', fontSize: '22px', margin: '8px 0' }
const muted = { color: '#6b7280', fontSize: '13px', margin: '2px 0' }
const label = { color: '#111827', fontSize: '14px', fontWeight: 700, margin: '0' }
const comment = { color: '#374151', fontSize: '13px', fontStyle: 'italic', margin: '4px 0 0' }
const row = { padding: '10px 0', borderBottom: '1px solid #eef0f3' }
const hr = { borderColor: '#e5e7eb', margin: '16px 0' }
