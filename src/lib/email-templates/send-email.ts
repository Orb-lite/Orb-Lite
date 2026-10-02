import * as React from "react";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { TEMPLATES } from "./registry";

const SITE_NAME = "ORB-LITE";
const DEFAULT_FROM = process.env.EMAIL_FROM || `${SITE_NAME} <ventas@orb-lite.com>`;

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
 * Módulo de envío de correos 100% compatible con Vercel.
 *
 * Detecta y utiliza automáticamente en orden de preferencia:
 * 1. Resend (Recomendado oficial en Vercel -> RESEND_API_KEY)
 * 2. Servidor SMTP propio (Google Workspace, Titan, cPanel, Outlook -> SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT)
 * 3. SendGrid (SENDGRID_API_KEY)
 * 4. Brevo / Sendinblue (BREVO_API_KEY)
 * 5. Lovable Managed API (LOVABLE_API_KEY como fallback)
 * 6. Simulación segura en consola si aún no configuras variables en Vercel
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {},
): Promise<SendTemplateEmailResult> {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Template '${templateName}' no encontrado. Disponibles: ${Object.keys(TEMPLATES).join(", ")}`,
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

  const fromAddress = process.env.EMAIL_FROM || DEFAULT_FROM;

  // 1. Resend (Opción estándar y recomendada en Vercel)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
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
        console.error("[send-email] Error en Resend API:", data);
        return { sent: false, reason: data.message || "Error al enviar con Resend" };
      }
      return { sent: true, id: data.id };
    } catch (err: any) {
      console.error("[send-email] Excepción al llamar a Resend:", err);
      return { sent: false, reason: err.message };
    }
  }

  // 2. SMTP / Nodemailer (Google Workspace, Titan, cPanel, Outlook, Amazon SES)
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = Number(process.env.SMTP_PORT || 465);
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: fromAddress,
        to: recipient,
        subject,
        html,
        text,
        replyTo: options.replyTo,
      });

      return { sent: true, id: info.messageId };
    } catch (err: any) {
      console.error("[send-email] Error en envío SMTP:", err);
      return { sent: false, reason: err.message };
    }
  }

  // 3. SendGrid
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  if (sendgridApiKey) {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipient }] }],
          from: { email: fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress, name: SITE_NAME },
          subject,
          content: [
            { type: "text/plain", value: text },
            { type: "text/html", value: html },
          ],
          ...(options.replyTo ? { reply_to: { email: options.replyTo } } : {}),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[send-email] Error en SendGrid:", errorText);
        return { sent: false, reason: errorText };
      }
      return { sent: true };
    } catch (err: any) {
      console.error("[send-email] Excepción en SendGrid:", err);
      return { sent: false, reason: err.message };
    }
  }

  // 4. Brevo (Sendinblue)
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: SITE_NAME, email: fromAddress.match(/<([^>]+)>/)?.[1] || fromAddress },
          to: [{ email: recipient }],
          subject,
          htmlContent: html,
          textContent: text,
          ...(options.replyTo ? { replyTo: { email: options.replyTo } } : {}),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("[send-email] Error en Brevo:", data);
        return { sent: false, reason: data.message || "Error en Brevo" };
      }
      return { sent: true, id: data.messageId };
    } catch (err: any) {
      console.error("[send-email] Excepción en Brevo:", err);
      return { sent: false, reason: err.message };
    }
  }

  // 5. Fallback a Lovable si aún está configurado LOVABLE_API_KEY
  const lovableApiKey = process.env.LOVABLE_API_KEY;
  if (lovableApiKey) {
    try {
      const { sendLovableEmail } = await import("@lovable.dev/email-js");
      await sendLovableEmail(
        {
          to: recipient,
          from: fromAddress,
          sender_domain: "notify.orb-lite.com",
          subject,
          html,
          text,
          purpose: "transactional",
          label: templateName,
          idempotency_key: options.idempotencyKey || crypto.randomUUID(),
          ...(options.replyTo ? { reply_to: options.replyTo } : {}),
        },
        { apiKey: lovableApiKey, sendUrl: process.env["LOVABLE_SEND_URL"] },
      );
      return { sent: true };
    } catch (error: any) {
      console.error("[send-email] Error en Lovable email API:", error);
      return { sent: false, reason: error.message };
    }
  }

  // 6. Modo Simulado / Registro: No bloquea el sistema si aún no agregas tus claves en Vercel
  console.warn(
    `[send-email] ⚠️ No se detectaron credenciales de correo (RESEND_API_KEY, SMTP_HOST, SENDGRID_API_KEY o BREVO_API_KEY).`,
  );
  console.log(`[send-email] Correo simulado exitoso para: ${recipient} | Asunto: "${subject}"`);
  return { sent: true };
}
