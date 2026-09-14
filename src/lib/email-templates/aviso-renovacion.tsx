import React from "react";
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
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  customerName?: string | null;
  customerNumber?: number | null;
  variantName?: string;
  platform?: string | null;
  period?: string;
  renewalDate?: string;
  amount?: number;
  daysLeft?: number;
  unitName?: string | null;
  imei?: string | null;
  iccid?: string | null;
  simPhone?: string | null;
  isInternal?: boolean;
}

const money = (n?: number) =>
  `$${Number(n ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

const Email = ({
  customerName,
  customerNumber,
  variantName = "Renovación de servicio",
  platform,
  period,
  renewalDate,
  amount,
  daysLeft = 10,
  unitName,
  imei,
  iccid,
  simPhone,
  isInternal,
}: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>{`Tu renovación vence en ${daysLeft} día(s) — ${variantName}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ORB-LITE</Text>
        <Heading style={h1}>
          {isInternal
            ? `Aviso interno: renovación en ${daysLeft} día(s)`
            : `Tu renovación vence en ${daysLeft} día(s)`}
        </Heading>
        <Text style={p}>
          {customerName ? `Hola ${customerName}, ` : "Hola, "}
          te recordamos que el servicio <strong>{variantName}</strong>
          {platform ? ` (plataforma ${platform})` : ""} se renueva el{" "}
          <strong>{renewalDate}</strong>. Las renovaciones se aplican el día primero del mes de
          renovación.
        </Text>

        <Section style={card}>
          <Text style={row}>Servicio: {variantName}</Text>
          {period && (
            <Text style={row}>
              Periodo: {period === "monthly" ? "Mensual" : "Anual"}
            </Text>
          )}
          <Text style={row}>Importe a renovar: {money(amount)}</Text>
          {customerNumber && <Text style={row}>Cliente #{customerNumber}</Text>}
          {unitName && <Text style={row}>Equipo en plataforma: {unitName}</Text>}
          {imei && <Text style={row}>IMEI: {imei}</Text>}
          {iccid && <Text style={row}>ICCID: {iccid}</Text>}
          {simPhone && <Text style={row}>Teléfono del chip: {simPhone}</Text>}
        </Section>

        <Hr style={hr} />
        <Heading as="h2" style={h2}>
          Condiciones de renovación
        </Heading>
        <Text style={small}>
          • Tienes <strong>20 días</strong> a partir de la fecha de renovación para pagar. Al pasar
          ese plazo se <strong>bloquea el acceso</strong> a la plataforma y se cobra el mes en
          curso.
        </Text>
        <Text style={small}>
          • El adeudo puede acumularse al mes siguiente; si no se cubre, el servicio se da de baja.
        </Text>
        <Text style={small}>
          • Si no registramos tu pago, la cuenta se <strong>cancela al segundo mes de adeudo</strong>.
          Tienes todo ese segundo mes para ponerte al corriente; al cumplir el tercer mes se da de
          baja definitiva.
        </Text>
        <Text style={small}>
          Para renovar responde este correo o escríbenos a ventas@orb-lite.com con tu comprobante de
          pago.
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Renovación en ${data['daysLeft'] ?? 10} día(s) — ${data['variantName'] ?? 'ORB-LITE'}`,
  displayName: "Aviso de renovación próxima",
  previewData: {
    customerName: "Juan Pérez",
    customerNumber: 512,
    variantName: "Renovación de Plataforma Klifnet (mensual)",
    platform: "Klifnet",
    period: "monthly",
    renewalDate: "2026-10-01",
    amount: 275,
    daysLeft: 10,
    unitName: "Camioneta 4",
    imei: "356938035643809",
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" };
const container = { padding: "24px", maxWidth: "600px" };
const brand = { color: "#84cc16", fontWeight: 700, letterSpacing: "2px", fontSize: "13px" };
const h1 = { fontSize: "22px", color: "#0f172a", margin: "8px 0 12px" };
const h2 = { fontSize: "15px", color: "#0f172a", margin: "16px 0 8px" };
const p = { fontSize: "14px", color: "#334155", lineHeight: "22px" };
const card = {
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  padding: "14px 16px",
  margin: "16px 0",
};
const row = { fontSize: "13px", color: "#0f172a", margin: "4px 0" };
const small = { fontSize: "12px", color: "#475569", lineHeight: "19px", margin: "6px 0" };
const hr = { borderColor: "#e2e8f0", margin: "18px 0" };
