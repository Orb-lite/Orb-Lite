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
  unitName?: string;
  alertType?: string;
  message?: string;
  severity?: "critica" | "alta" | "media";
  timestamp?: string;
  details?: Record<string, any>;
}

const severityColors: Record<string, { bg: string; text: string; label: string }> = {
  critica: { bg: "#fef2f2", text: "#dc2626", label: "EMERGENCIA CRÍTICA" },
  alta: { bg: "#fffbeb", text: "#d97706", label: "PRIORIDAD ALTA" },
  media: { bg: "#eff6ff", text: "#2563eb", label: "ADVERTENCIA" },
};

export const Email = ({
  unitName = "Vehículo",
  alertType = "Alerta Telemática",
  message = "Se ha registrado un evento de alerta en la plataforma.",
  severity = "alta",
  timestamp,
  details = {},
}: Props) => {
  const sev = severityColors[severity] || severityColors.alta;
  const timeStr =
    timestamp ||
    new Date().toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      dateStyle: "medium",
      timeStyle: "medium",
    });

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>{`[ALERTA ${sev.label}] ${unitName}: ${alertType}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>ORB-LITE · TELEMETRÍA & RASTREO SATELITAL</Text>
          <div
            style={{
              display: "inline-block",
              backgroundColor: sev.bg,
              color: sev.text,
              padding: "4px 12px",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "12px",
            }}
          >
            {sev.label}
          </div>
          <Heading style={h1}>{alertType}</Heading>
          <Text style={unitTitle}>
            Unidad: <strong style={{ color: "#111827" }}>{unitName}</strong>
          </Text>
          <Hr style={hr} />

          <Section style={messageBox}>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={metaBox}>
            <Text style={metaItem}>
              <strong>Fecha y Hora:</strong> {timeStr}
            </Text>
            {Object.entries(details).map(([k, v]) => (
              <Text key={k} style={metaItem}>
                <strong>{k}:</strong> {String(v)}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Esta alerta fue generada de manera automática por la plataforma satelital ORB-LITE.
            Notificación central enviada a <strong>ventas@orb-lite.com</strong> y destinatarios de
            seguridad registrados.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const template: TemplateEntry = {
  component: Email,
  displayName: "Alerta de Telemetría Vehicular",
  subject: (data: Record<string, any>) =>
    `🚨 [ALERTA ${data.severity === "critica" ? "SOS" : "ORB-LITE"}] ${data.unitName || "Vehículo"} - ${data.alertType || "Evento Detectado"}`,
  previewData: {
    unitName: "Nissan NP300 #04",
    alertType: "Baja Batería Vehicular",
    message: "Voltaje del acumulador descendió a 11.4V con motor apagado.",
    severity: "alta",
    details: {
      "Voltaje detectado": "11.4 V",
      "Umbral configurado": "11.8 V",
      "Estado de ignición": "Apagado",
    },
  },
};

const main: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "24px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "560px",
  padding: "32px",
};

const brand: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  margin: "0 0 16px 0",
};

const h1: React.CSSProperties = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "800",
  margin: "0 0 8px 0",
  lineHeight: "1.25",
};

const unitTitle: React.CSSProperties = {
  color: "#4b5563",
  fontSize: "15px",
  margin: "0 0 16px 0",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const messageBox: React.CSSProperties = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
};

const messageText: React.CSSProperties = {
  color: "#1f2937",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
  fontWeight: "500",
};

const metaBox: React.CSSProperties = {
  marginBottom: "16px",
};

const metaItem: React.CSSProperties = {
  color: "#4b5563",
  fontSize: "13px",
  margin: "4px 0",
};

const footer: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
  textAlign: "center",
};
