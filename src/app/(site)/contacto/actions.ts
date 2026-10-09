"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { checkFormToken, rateLimit } from "@/lib/auth";
import { contactMailConfigured } from "@/lib/env";

export interface ContactState {
  status: "idle" | "ok" | "error" | "disabled";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "subject" | "message" | "consent", string>>;
  values?: { name: string; email: string; subject: string; message: string };
}

const schema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre completo.").max(100, "El nombre es demasiado largo."),
  email: z.string().trim().email("Escribe un correo electrónico válido.").max(160),
  subject: z.string().trim().min(3, "Escribe un asunto.").max(120, "El asunto es demasiado largo."),
  message: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(2000, "El mensaje no puede superar los 2000 caracteres."),
  consent: z.literal("on", { error: "Debes aceptar el tratamiento de tus datos para poder enviar el mensaje." }),
});

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (!contactMailConfigured()) {
    return { status: "disabled", message: "El formulario de contacto aún no está habilitado. Escríbenos o llámanos por los canales oficiales." };
  }

  // Antispam: campo trampa oculto + tiempo mínimo de llenado + límite por dirección.
  const honeypot = String(formData.get("website") ?? "");
  const token = String(formData.get("ft") ?? "");
  if (honeypot || !(await checkFormToken(token))) {
    return { status: "error", message: "No pudimos validar el envío. Espera unos segundos e inténtalo de nuevo." };
  }
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida";
  if (!rateLimit(`contact:${ip}`, 5, 3600_000)) {
    return { status: "error", message: "Enviaste varios mensajes en poco tiempo. Inténtalo más tarde o llámanos." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: String(formData.get("consent") ?? ""),
  };
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: NonNullable<ContactState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", errors, values: { name: raw.name, email: raw.email, subject: raw.subject, message: raw.message } };
  }

  const { name, email, subject, message } = parsed.data;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `[Sitio web] ${subject}`,
        text: `Mensaje recibido desde el formulario de contacto del sitio web.\n\nNombre: ${name}\nCorreo: ${email}\nAsunto: ${subject}\n\n${message}\n\n— El remitente aceptó el tratamiento de sus datos para responder esta consulta.`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  } catch (err) {
    console.error("[contacto] fallo al enviar el correo:", err instanceof Error ? err.message : err);
    return {
      status: "error",
      message: "No pudimos enviar tu mensaje en este momento. Inténtalo nuevamente o comunícate por teléfono.",
      values: { name, email, subject, message },
    };
  }
  return { status: "ok", message: "¡Gracias! Recibimos tu mensaje y te responderemos al correo que indicaste." };
}
