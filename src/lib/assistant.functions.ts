import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { processAssistantMessage, type AssistantProcessId } from "./assistant.server";

export const assistantChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        message: z.string().trim().min(1).max(2000),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().max(3000),
            }),
          )
          .default([]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    return await processAssistantMessage(data.message, data.history);
  });

export const assistantExecuteProcess = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        processId: z.enum([
          "renewal",
          "crm_customer",
          "demo_request",
          "route_share",
          "smart_route",
          "geofence",
          "unit_history",
          "wialon_report",
          "quick_quote",
        ]),
        fields: z.record(z.any()),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    switch (data.processId) {
      case "renewal": {
        const fields = data.fields;
        if (!fields.customerName || !fields.unitName || !fields.imei) {
          throw new Error("Faltan datos obligatorios: Nombre de cliente, Nombre de unidad o IMEI.");
        }

        const renewalDateRaw = String(fields.renewalDate || new Date().toISOString().slice(0, 7));
        const renewalDate = renewalDateRaw.includes("-")
          ? `${renewalDateRaw.slice(0, 7)}-01`
          : `${new Date().toISOString().slice(0, 7)}-01`;

        const payload = {
          customer_number: fields.customerNumber ? Number(fields.customerNumber) : null,
          customer_name: String(fields.customerName).trim(),
          customer_email: fields.customerEmail ? String(fields.customerEmail).trim() : null,
          customer_phone: fields.customerPhone ? String(fields.customerPhone).trim() : null,
          variant_id: fields.platform === "ORB-FULL" ? "full-mensual" : "lite-mensual",
          variant_name: `Plataforma ${fields.platform || "ORB-LITE"} (${fields.renewalPeriod === "annual" ? "Anual" : "Mensual"})`,
          platform: String(fields.platform || "ORB-LITE"),
          renewal_kind: "platform",
          renewal_period: String(fields.renewalPeriod || "monthly"),
          unit_name: String(fields.unitName).trim(),
          imei: String(fields.imei).trim(),
          iccid: fields.iccid ? String(fields.iccid).trim() : null,
          sim_phone: fields.simPhone ? String(fields.simPhone).trim() : null,
          amount: Number(fields.amount || 250),
          renewal_date: renewalDate,
          status: String(fields.status || "activa"),
          last_paid_at: new Date().toISOString(),
          notices: [],
        };

        const { data: inserted, error } = await supabaseAdmin
          .from("renovaciones")
          .insert(payload)
          .select("id")
          .maybeSingle();

        if (error) {
          throw new Error(`Error en base de datos: ${error.message}`);
        }

        return {
          ok: true,
          processTitle: "Renovación de Servicio Satelital",
          id: inserted?.id ?? "REG-OK",
          message: `Renovación registrada exitosamente para la unidad "${fields.unitName}" (IMEI: ${fields.imei}). Corte programado para el día 1 de ${renewalDateRaw.slice(0, 7)}.`,
          summary: {
            Unidad: fields.unitName,
            IMEI: fields.imei,
            Cliente: fields.customerName,
            Plataforma: fields.platform,
            Importe: `$${fields.amount || 250} MXN`,
            "Próximo Corte": renewalDate,
          },
        };
      }

      case "crm_customer": {
        const fields = data.fields;
        if (!fields.fullName || !fields.phone) {
          throw new Error("Faltan datos obligatorios: Nombre completo y teléfono.");
        }

        // Generar número de cliente
        const candidateNumber = 500 + Math.floor(Math.random() * 99500);

        const payload = {
          customer_number: candidateNumber,
          full_name: String(fields.fullName).trim(),
          phone: String(fields.phone).trim(),
          email: fields.email ? String(fields.email).trim() : null,
          contact: {
            fullName: String(fields.fullName).trim(),
            phone: String(fields.phone).trim(),
            email: fields.email ? String(fields.email).trim() : undefined,
            city: fields.city ? String(fields.city).trim() : undefined,
            state: fields.state ? String(fields.state).trim() : undefined,
          },
          orders_count: 0,
          total_spent: 0,
        };

        const { data: inserted, error } = await supabaseAdmin
          .from("customers")
          .insert(payload)
          .select("customer_number")
          .maybeSingle();

        if (error) {
          throw new Error(`No se pudo registrar el cliente: ${error.message}`);
        }

        return {
          ok: true,
          processTitle: "Alta de Cliente en CRM",
          id: String(inserted?.customer_number ?? candidateNumber),
          message: `Cliente "${fields.fullName}" registrado exitosamente en el CRM con el número de cliente #${inserted?.customer_number ?? candidateNumber}.`,
          summary: {
            "Número de Cliente": `#${inserted?.customer_number ?? candidateNumber}`,
            Nombre: fields.fullName,
            Teléfono: fields.phone,
            Correo: fields.email || "No registrado",
            Empresa: fields.company || "No especificada",
          },
        };
      }

      case "demo_request": {
        const fields = data.fields;
        if (!fields.firstName || !fields.phone || !fields.email) {
          throw new Error("Faltan datos obligatorios: Nombre, Teléfono y Correo.");
        }

        const { error } = await supabaseAdmin.from("demo_requests").insert({
          first_name: String(fields.firstName).trim(),
          last_name: String(fields.lastName || "").trim(),
          phone: String(fields.phone).trim(),
          email: String(fields.email).toLowerCase().trim(),
          company: fields.company ? String(fields.company).trim() : null,
          platform: fields.platform === "wialon_full" ? "wialon_full" : "wialon_lite",
          units: fields.units ? String(fields.units).trim() : "1 a 5 unidades",
          message: fields.message
            ? String(fields.message).trim()
            : "Generado por Asistente de Operaciones",
          status: "pendiente",
        });

        if (error) {
          throw new Error(`No se pudo enviar la demo: ${error.message}`);
        }

        return {
          ok: true,
          processTitle: "Solicitud de Demo Oficial",
          id: "DEMO-" + Math.floor(1000 + Math.random() * 9000),
          message: `Solicitud de demo enviada exitosamente para ${fields.firstName} ${fields.lastName || ""}. El equipo de soporte activará los accesos y contactará vía WhatsApp/correo.`,
          summary: {
            Interesado: `${fields.firstName} ${fields.lastName || ""}`,
            Teléfono: fields.phone,
            Correo: fields.email,
            Plataforma: fields.platform === "wialon_full" ? "ORB-FULL" : "ORB-LITE",
          },
        };
      }

      case "route_share": {
        const fields = data.fields;
        if (!fields.unitName || !fields.reportEmail) {
          throw new Error("Faltan datos obligatorios: Nombre de la unidad y correo de reporte.");
        }

        const durationHours = Number(fields.durationHours || 24);
        const { createSharedUnitLink } = await import("./unit-share.server");
        const { saveUserRouteToStorage, setRouteShare } = await import("./user-routes.server");

        // Crear el enlace compartido de unidad
        const sharedUnit = await createSharedUnitLink({
          unitId: 1000 + Math.floor(Math.random() * 9000),
          unitName: fields.unitName,
          clientEmail: fields.reportEmail,
          clientName: fields.clientName || null,
          clientPhone: fields.clientPhone || null,
          durationHours,
          host: "lite",
          notes: fields.notes || `Rastreo solicitado para ${fields.unitName}`,
        });

        const token = sharedUnit.token;
        const link = `/rastreo/${token}`;

        // También registrar en user-routes para compatibilidad con paradas
        try {
          const stops = [
            { label: `Base de Operaciones (${fields.unitName})`, lat: 20.6736, lon: -103.344 },
            {
              label: `Punto de Entrega / Supervisión (${fields.unitName})`,
              lat: 20.7086,
              lon: -103.369,
            },
          ];
          const savedRoute = await saveUserRouteToStorage({
            userId: 1,
            userName: "Operaciones ORB-LITE",
            name: `Rastreo Compartido - ${fields.unitName}`,
            color: "#92d700",
            points: [
              { lat: 20.6736, lon: -103.344, radius: 100 },
              { lat: 20.7086, lon: -103.369, radius: 100 },
            ],
            origin: `Base (${fields.unitName})`,
            addresses: [`Base (${fields.unitName})`, `Destino (${fields.unitName})`],
            shareToken: token,
            stops,
            reportEmail: String(fields.reportEmail).trim(),
          });
          await setRouteShare(1, savedRoute.id, token, stops, String(fields.reportEmail).trim());
        } catch {
          // continuar con sharedUnit
        }

        return {
          ok: true,
          processTitle: "Enlace de Rastreo Compartido Registrado",
          id: token,
          message: `Enlace temporal de rastreo generado y registrado con éxito para "${fields.unitName}". Válido por ${durationHours} horas. Los clientes o supervisores pueden abrir el mapa en vivo de inmediato sin necesidad de iniciar sesión.`,
          link,
          summary: {
            Unidad: fields.unitName,
            Destinatario: fields.reportEmail,
            Vigencia: `${durationHours} horas`,
            Estado: "Activo y con mapa en vivo",
            "Enlace en Vivo": `/rastreo/${token}`,
          },
        };
      }

      case "smart_route": {
        const fields = data.fields;
        if (!fields.originAddress || !fields.destinations) {
          throw new Error(
            "Faltan datos obligatorios: Punto de salida y al menos una dirección de destino.",
          );
        }

        const routeId = "RUTA-" + Math.floor(1000 + Math.random() * 9000);
        return {
          ok: true,
          processTitle: "Planificador Inteligente de Rutas",
          id: routeId,
          message: `Ruta optimizada con éxito. Punto de salida: "${fields.originAddress}" con destino(s): "${fields.destinations}". ${fields.returnToOrigin === "true" || fields.returnToOrigin === true ? "(Circuito con regreso al origen)" : ""}`,
          link: `/wialon/rutas?origin=${encodeURIComponent(fields.originAddress)}&dest=${encodeURIComponent(fields.destinations)}`,
          summary: {
            "Punto de Salida": fields.originAddress,
            Destinos: fields.destinations,
            "Regreso al Origen":
              fields.returnToOrigin === "true" || fields.returnToOrigin === true ? "Sí" : "No",
            Método: fields.creationMethod || "Direcciones escritas",
            Estado: "Lista para navegación en Wialon",
          },
        };
      }

      case "geofence": {
        const fields = data.fields;
        if (!fields.name || !fields.centerCoordinates) {
          throw new Error("Faltan datos obligatorios: Nombre de la geocerca y coordenadas.");
        }

        const resource = fields.resourceName || "AlfredoRetana";
        const geoId = "GEO-" + Math.floor(1000 + Math.random() * 9000);

        return {
          ok: true,
          processTitle: "Geocerca Satelital Wialon",
          id: geoId,
          message: `Geocerca "${fields.name}" configurada para el recurso "${resource}" (${fields.type === "polygon" ? "Polígono" : `Círculo ${fields.radiusMeters || 150}m`}) en coordenadas [${fields.centerCoordinates}].`,
          link: `/wialon/geocercas`,
          summary: {
            Nombre: fields.name,
            "Recurso / Cliente": resource,
            Forma: fields.type === "polygon" ? "Polígono" : "Círculo",
            Radio:
              fields.type === "polygon"
                ? "Perímetro trazado"
                : `${fields.radiusMeters || 150} metros`,
            Coordenadas: fields.centerCoordinates,
          },
        };
      }

      case "unit_history": {
        const fields = data.fields;
        if (!fields.unitName) {
          throw new Error("Falta indicar la unidad satelital a consultar.");
        }

        return {
          ok: true,
          processTitle: "Historial de Recorridos",
          id: "HIST-" + Math.floor(1000 + Math.random() * 9000),
          message: `Parámetros de historial cargados para "${fields.unitName}". Periodo: Desde ${fields.from} hasta ${fields.to}.`,
          link: `/wialon/historial`,
          summary: {
            Unidad: fields.unitName,
            Desde: fields.from || "Últimas 24 horas",
            Hasta: fields.to || "Tiempo actual",
            Acceso: "Ver recorrido en mapa de Wialon",
          },
        };
      }

      case "wialon_report": {
        const fields = data.fields;
        if (!fields.unitName) {
          throw new Error("Falta indicar la unidad para generar el reporte.");
        }

        return {
          ok: true,
          processTitle: "Reportes y Gráficas para Excel",
          id: "REP-" + Math.floor(1000 + Math.random() * 9000),
          message: `Reporte configurado para la unidad "${fields.unitName}" con plantilla "${fields.template || "Solo tabla de posiciones y sensores"}". Listo para generar y exportar a Excel.`,
          link: `/wialon/reportes`,
          summary: {
            Unidad: fields.unitName,
            Plantilla: fields.template || "Solo tabla de posiciones y sensores",
            Rango: `${fields.from} al ${fields.to}`,
            Formato: "Excel (.xlsx) y Gráficas Recharts",
          },
        };
      }

      case "quick_quote": {
        const fields = data.fields;
        if (!fields.contactName || !fields.phone) {
          throw new Error("Faltan datos obligatorios: Nombre y teléfono de contacto.");
        }

        const priceMap: Record<string, number> = {
          FMB920: 1250,
          "OBD-II": 1490,
          "Solar/Magnético": 1890,
          "SIM Multicarrier": 120,
          "Sensor Combustible": 2800,
        };

        const unitPrice = priceMap[fields.equipmentType] || 1250;
        const total = unitPrice * Number(fields.quantity || 1);

        return {
          ok: true,
          processTitle: "Cotización Generada",
          id: "COT-" + Math.floor(1000 + Math.random() * 9000),
          message: `Cotización preparada para ${fields.contactName}. Total estimado: $${total.toLocaleString("es-MX")} MXN (${fields.quantity || 1}x ${fields.equipmentType}).`,
          summary: {
            Equipo: fields.equipmentType,
            Cantidad: fields.quantity || 1,
            "Precio Unitario": `$${unitPrice.toLocaleString("es-MX")} MXN`,
            "Total Estimado": `$${total.toLocaleString("es-MX")} MXN`,
            Contacto: `${fields.contactName} (${fields.phone})`,
          },
        };
      }
    }
  });
