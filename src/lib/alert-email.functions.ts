import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

const DEFAULT_ALERT_RECIPIENT = "ventas@orb-lite.com";

const alertEmailSchema = z.object({
  unitName: z.string().min(1),
  alertType: z.string().min(1),
  message: z.string().min(1),
  severity: z.enum(["critica", "alta", "media"]),
  additionalEmails: z.array(z.string()).optional(),
  details: z.record(z.any()).optional(),
});

export const sendAlertEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => alertEmailSchema.parse(input))
  .handler(async ({ data }) => {
    // Lista de correos: siempre incluye ventas@orb-lite.com como correo central
    const recipientsSet = new Set<string>();
    recipientsSet.add(DEFAULT_ALERT_RECIPIENT.toLowerCase().trim());

    if (data.additionalEmails && Array.isArray(data.additionalEmails)) {
      for (const email of data.additionalEmails) {
        const clean = (email || "").trim().toLowerCase();
        // Validar formato básico de email
        if (clean && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
          recipientsSet.add(clean);
        }
      }
    }

    const recipients = Array.from(recipientsSet);
    const results: Array<{ to: string; sent: boolean; reason?: string }> = [];

    const templateData = {
      unitName: data.unitName,
      alertType: data.alertType,
      message: data.message,
      severity: data.severity,
      timestamp: new Date().toLocaleString("es-MX", {
        timeZone: "America/Mexico_City",
        dateStyle: "medium",
        timeStyle: "medium",
      }),
      details: data.details || {},
    };

    for (const recipient of recipients) {
      try {
        const res = await sendTemplateEmail("alerta-evento", recipient, {
          templateData,
          idempotencyKey: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        });
        results.push({ to: recipient, sent: res.sent, reason: (res as any).reason });
      } catch (err: any) {
        console.error(`[alert-email] Error enviando a ${recipient}:`, err);
        results.push({ to: recipient, sent: false, reason: err?.message || "Error al enviar" });
      }
    }

    const successfulCount = results.filter((r) => r.sent).length;
    console.log(
      `[alert-email] Alerta "${data.alertType}" enviada a ${successfulCount}/${recipients.length} destinatarios: ${recipients.join(", ")}`,
    );

    return {
      success: true,
      recipients,
      successfulCount,
      results,
    };
  });
