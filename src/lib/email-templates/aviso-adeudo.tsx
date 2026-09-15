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
  stage?: "bloqueo" | "segundo-mes" | "baja";
  customerName?: string | null;
  customerNumber?: number | null;
  variantName?: string;
  platform?: string | null;
  renewalDate?: string;
  amount?: number;
  daysOverdue?: number;
  unitName?: string | null;
  imei?: string | null;
  iccid?: string | null;
  simPhone?: string | null;
  isInternal?: boolean;
}

const money = (n?: number) =>
  `$${Number(n ?? 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

const TITLES: Record<string, string> = {
  bloqueo: "Acceso bloqueado por falta de pago",
  "segundo-mes": "Aviso de cancelación — segundo mes de adeudo",
  baja: "Servicio dado de baja",
};

const Email = ({
  stage = "bloqueo",
  customerName,
  customerNumber,
  variantName = "Renovación de servicio",
  platform,
  renewalDate,
  amount,
  daysOverdue = 20,
  unitName,
  imei,
  iccid,
  simPhone,
  isInternal,
}: Props) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>{TITLES[stage] ?? "Aviso de adeudo"}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ORB-LITE</Text>
        <Heading style={h1}>
          {isInternal ? `Aviso interno: ${TITLES[stage] ?? "adeudo"}` : (TITLES[stage] ?? "Aviso de adeudo")}
        </Heading>
        <Text style={p}>
          {customerName ? `Hola ${customerName}, ` : "Hola, "}
          el servicio <strong>{variantName}</strong>
          {platform ? ` (plataforma ${platform})` : ""} tenía fecha de renovación el{" "}
          <strong>{renewalDate}</strong> y registra <strong>{daysOverdue} días</strong> de atraso.
        </Text>

        {stage === "bloqueo" && (
          <Text style={p}>
            Pasaron los 20 días de plazo, por lo que el <strong>acceso quedó bloqueado</strong> y se
            cobra el mes en curso. El adeudo puede acumularse al mes siguiente; si no se cubre, el
            servicio se dará de baja.
          </Text>
        )}
        {stage === "segundo-mes" && (
          <Text style={p}>
            Al no registrar tu pago, la cuenta entra en <strong>proceso de cancelación</strong>.
            Tienes todo este segundo mes para ponerte al corriente. Envíanos el{" "}
            <strong>comprobante de pago</strong> a ventas@orb-lite.com para reactivar el servicio.
          </Text>
        )}
        {stage === "baja" && (
          <Text style={p}>
            Al cumplirse el tercer mes de adeudo, el servicio se <strong>dio de baja</strong>. Si
            deseas reactivarlo, responde este correo con tu comprobante de pago y validaremos la
            reactivación.
          </Text>
        )}

        <Section style={card}>
          <Text style={row}>Importe pendiente: {money(amount)}</Text>
          {customerNumber && <Text style={row}>Cliente #{customerNumber}</Text>}
          {unitName && <Text style={row}>Equipo en plataforma: {unitName}</Text>}
          {imei && <Text style={row}>IMEI: {imei}</Text>}
          {iccid && <Text style={row}>ICCID: {iccid}</Text>}
          {simPhone && <Text style={row}>Teléfono del chip: {simPhone}</Text>}
        </Section>

        <Hr style={hr} />
        <Text style={small}>
          Envía tu comprobante de pago a ventas@orb-lite.com. Las renovaciones se aplican el día
          primero del mes de renovación.
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `${TITLES[String(data['stage'] ?? 'bloqueo')] ?? 'Aviso de adeudo'} — ${data['variantName'] ?? 'ORB-LITE'}`,
  displayName: "Aviso de adeudo / cancelación",
  previewData: {
    stage: "segundo-mes",
    customerName: "Juan Pérez",
    customerNumber: 512,
    variantName: "Renovación de Plataforma ORB-FULL (mensual)",
    renewalDate: "2026-09-01",
    amount: 275,
    daysOverdue: 35,
  },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" };
const container = { padding: "24px", maxWidth: "600px" };
const brand = { color: "#84cc16", fontWeight: 700, letterSpacing: "2px", fontSize: "13px" };
const h1 = { fontSize: "22px", color: "#0f172a", margin: "8px 0 12px" };
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
