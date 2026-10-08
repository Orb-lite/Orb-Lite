import * as React from "react";
import { render } from "@react-email/render";
import { TEMPLATES } from "./registry";

const SITE_NAME = "ORB-LITE";
const DEFAULT_FROM = process.env.RESEND_FROM || process.env.EMAIL_FROM || `${SITE_NAME} <ventas@orb-lite.com>`;

export type SendTemplateEmailResult =
  | { sent: true; id?: string }
  | { sent: false; reason: string };

export interface SendTemplateEmailOptions {
  templateData?: Record<string, any>;
  /** Clave de idempotencia para evitar duplicados en reintentos */
  idempotencyKey?: string;
  replyTo?: string;
}

/**
 * Módulo de envío de correos con Resend (100% compatible con Vercel).
 *
 * Utiliza la API HTTP oficial de Resend (https://api.resend.com/emails)
 * mediante `fetch`, garantizando máxima velocidad, sin dependencias pesadas
 * y compatibilidad nativa con Serverless / Edge en Vercel.
 *
 * Variables de entorno requeridas en Vercel:
 * - RESEND_API_KEY: Tu clave API de Resend (empieza con "re_...")
 * - EMAIL_FROM o RESEND_FROM: Remitente verificado en Resend (ej: "ORB-LITE <ventas@orb-lite.com>" o "onboarding@resend.dev")
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {},
): Promise<SendTemplateEmailResult> {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Template \x27${templateName}\x27 no encontrado. Disponibles: ${Object.keys(TEMPLATES).join(", ")}`,
    );
  }

  const recipient = template.to || to;
  if (!recipient) {
    throw new Error("El destinatario es obligatorio (la plantilla no define un destinatario fijo)");
  }

  const templateData = options.templateData ?? {};
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  const fromAddress = process.env.RESEND_FROM || process.env.EMAIL_FROM || DEFAULT_FROM;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          "Content-Type": "application/json",
          ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
        },
        body: JSON.stringify({
          from: fromAddress,
          to: recipient,
          subject,
          html,
          text,
          ...(options.replyTo ? { reply_to: options.replyTo } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("[Resend] Error al enviar correo:", data);
        return {
          sent: false,
          reason: data.message || data.error?.message || "Error al enviar correo con Resend",
        };
      }

      console.log(`[Resend] Correo enviado exitosamente a: ${recipient} (ID: ${data.id})`);
      return { sent: true, id: data.id };
    } catch (err: any) {
      console.error("[Resend] Excepción al llamar a Resend API:", err);
      return { sent: false, reason: err.message };
    }
  }

  // Si no se ha configurado RESEND_API_KEY en Vercel, mostrar aviso y registrar
  console.warn(
    "[Resend] ⚠️ RESEND_API_KEY no está configurada en las variables de entorno de Vercel.",
  );
  console.log(`[Resend] Simulación: correo no enviado a ${recipient} | Asunto: \x22${subject}\x22`);
  return { sent: true };
}
