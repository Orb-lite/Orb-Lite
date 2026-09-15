import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  username?: string
  platform?: 'wialon_lite' | 'wialon_full'
}

const ACCESS = {
  wialon_lite: {
    label: 'Wialon Lite',
    platformUrl: 'https://lite.wialon.us/',
    unitsUrl: 'https://cms-lite.wialon.us',
  },
  wialon_full: {
    label: 'Wialon',
    platformUrl: 'https://hosting.wialon.com/',
    unitsUrl: 'https://hosting.wialon.com/',
  },
} as const

const Email = ({ name, username, platform = 'wialon_lite' }: Props) => {
  const access = ACCESS[platform] ?? ACCESS.wialon_lite
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Tus claves de acceso a la plataforma {access.label} — ORB-LITE</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={brand}>ORB-LITE</Heading>
          <Text style={text}>Buen día{name ? ` ${name}` : ''},</Text>
          <Text style={text}>
            Te detallo el link de acceso así como las claves nuevas solicitadas.
          </Text>

          <Section style={block}>
            <Heading as="h2" style={h2}>
              Plataforma {access.label}
            </Heading>
            <Text style={text}>Link de acceso:</Text>
            <Button style={button} href={access.platformUrl}>
              {access.platformUrl}
            </Button>
          </Section>

          <Section style={block}>
            <Heading as="h2" style={h2}>
              Dar de alta unidades
            </Heading>
            <Text style={text}>Link de acceso:</Text>
            <Button style={button} href={access.unitsUrl}>
              {access.unitsUrl}
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={block}>
            <Heading as="h2" style={h2}>
              Claves de acceso y link
            </Heading>
            <Text style={text}>
              Usuario: <strong style={mono}>{username ?? 'tu-usuario'}</strong>
            </Text>
            <Text style={text}>
              Contraseña: <strong style={mono}>Abc2026+</strong>
            </Text>
            <Text style={note}>
              La contraseña es provisional; en el primer ingreso solicitará su reemplazo.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            App móvil disponible en iOS, Android o AppGallery Huawei:{' '}
            <strong>{access.label === 'Wialon Lite' ? 'Wialon Lite' : 'Wialon'}</strong>
          </Text>

          <Text style={footer}>
            ORB-LITE · Rastreo GPS y telemetría ·{' '}
            <Link href="https://orb-lite.com" style={link}>
              orb-lite.com
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Tus accesos ${data?.platform === 'wialon_full' ? 'Wialon' : 'Wialon Lite'} — ORB-LITE`,
  displayName: 'Accesos demo Wialon',
  previewData: { name: 'Juan Pérez', username: 'juan.transportesabc', platform: 'wialon_lite' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const brand = { color: '#0b1f3a', fontSize: '22px', letterSpacing: '2px', margin: '0 0 16px' }
const h2 = { color: '#0b1f3a', fontSize: '16px', margin: '0 0 8px' }
const text = { color: '#1f2937', fontSize: '14px', lineHeight: '22px', margin: '6px 0' }
const note = { color: '#6b7280', fontSize: '13px', lineHeight: '20px', margin: '6px 0' }
const block = { margin: '14px 0' }
const hr = { borderColor: '#e5e7eb', margin: '16px 0' }
const mono = { fontFamily: 'monospace', color: '#0b1f3a' } as const
const link = { color: '#16a34a' }
const button = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  fontSize: '14px',
  padding: '10px 18px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '4px 0',
}
const footer = { color: '#9ca3af', fontSize: '12px', marginTop: '24px' }
