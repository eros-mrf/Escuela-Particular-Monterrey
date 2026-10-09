"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { assertCan } from "@/lib/auth";
import { ALERT_LEVELS, ANNOUNCEMENT_CATEGORIES } from "@/lib/constants";
import { db, newId } from "@/lib/db/store";
import type { Announcement, PriorityAlert } from "@/lib/db/types";
import { UploadError, deleteMedia } from "@/lib/media";
import { isValidDate, nowISO } from "@/lib/time";
import { safeUrl } from "@/lib/utils";
import { bool, dateRe, raw, str, zodErrors, type ActionState } from "../_lib/forms";
import { processAttachments } from "../_lib/uploads";

const annSchema = z.object({
  title: z.string().min(3, "Escribe un título.").max(160),
  body: z.string().min(10, "Escribe el texto del comunicado.").max(30_000),
  category: z.enum(ANNOUNCEMENT_CATEGORIES, { error: "Elige una categoría." }),
  publishedAt: z.string().regex(dateRe, "Elige la fecha de publicación."),
  expiresAt: z.string().regex(dateRe, "Fecha inválida.").optional(),
});

export async function saveAnnouncement(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("announcements");
  const parsed = annSchema.safeParse({
    title: str(fd, "title"),
    body: raw(fd, "body").trim(),
    category: str(fd, "category"),
    publishedAt: str(fd, "publishedAt"),
    expiresAt: str(fd, "expiresAt") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const d = parsed.data;
  if (!isValidDate(d.publishedAt)) return { ok: false, message: "La fecha no es válida.", errors: { publishedAt: "Fecha inválida." } };
  if (d.expiresAt && (!isValidDate(d.expiresAt) || d.expiresAt < d.publishedAt)) {
    return { ok: false, message: "La fecha de vencimiento debe ser igual o posterior a la de publicación.", errors: { expiresAt: "Debe ser posterior a la publicación." } };
  }
  const intent = str(fd, "intent") === "publish" ? "published" : "draft";
  const existing = id === "nueva" ? null : await db.announcements.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "El comunicado ya no existe." };

  let attachments: Announcement["attachments"];
  try {
    attachments = await processAttachments(fd, "att");
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, message: err.message };
    throw err;
  }
  const base = { title: d.title, body: d.body, category: d.category, publishedAt: d.publishedAt, expiresAt: d.expiresAt, pinned: bool(fd, "pinned"), status: intent as Announcement["status"], attachments, updatedAt: nowISO() };
  if (!existing) {
    const item: Announcement = { id: newId(), createdAt: nowISO(), ...base };
    await db.announcements.insert(item);
    redirect(`/admin/comunicados/${item.id}?guardado=${intent === "published" ? "publicada" : "borrador"}`);
  }
  await db.announcements.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect(`/admin/comunicados/${existing.id}?guardado=${intent === "published" ? "publicada" : "borrador"}`);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await assertCan("announcements");
  const a = await db.announcements.remove(id);
  if (a) for (const att of a.attachments) await deleteMedia(att.mediaId);
  redirect("/admin/comunicados?aviso=eliminada");
}

export async function setAnnouncementStatus(id: string, status: "draft" | "published"): Promise<void> {
  await assertCan("announcements");
  await db.announcements.update(id, (a) => ({ ...a, status, updatedAt: nowISO() }));
  redirect(`/admin/comunicados?aviso=${status === "published" ? "publicada" : "despublicada"}`);
}

/* ───────────── Mensajes prioritarios (portada) ───────────── */

const levels = ALERT_LEVELS.map((l) => l.id) as ["info", "importante", "urgente"];

const alertSchema = z.object({
  message: z.string().min(5, "Escribe el mensaje.").max(240, "Máximo 240 caracteres: debe ser breve."),
  level: z.enum(levels, { error: "Elige el nivel." }),
  startsAt: z.string().regex(dateRe, "Elige la fecha de inicio."),
  expiresAt: z.string().regex(dateRe, "Todo aviso debe tener fecha de expiración."),
  linkUrl: z.string().max(500).optional(),
  linkLabel: z.string().max(60).optional(),
});

export async function saveAlert(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("alerts");
  const parsed = alertSchema.safeParse({
    message: str(fd, "message"),
    level: str(fd, "level"),
    startsAt: str(fd, "startsAt"),
    expiresAt: str(fd, "expiresAt"),
    linkUrl: str(fd, "linkUrl") || undefined,
    linkLabel: str(fd, "linkLabel") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const d = parsed.data;
  if (!isValidDate(d.startsAt) || !isValidDate(d.expiresAt) || d.expiresAt < d.startsAt) {
    return { ok: false, message: "La fecha de expiración debe ser igual o posterior a la de inicio.", errors: { expiresAt: "Debe ser posterior al inicio." } };
  }
  if (d.linkUrl && !safeUrl(d.linkUrl)) return { ok: false, message: "El enlace debe comenzar con https:// o con /.", errors: { linkUrl: "Enlace no válido." } };
  const existing = id === "nueva" ? null : await db.alerts.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "El aviso ya no existe." };
  const base = { message: d.message, level: d.level, startsAt: d.startsAt, expiresAt: d.expiresAt, linkUrl: d.linkUrl ? safeUrl(d.linkUrl)! : undefined, linkLabel: d.linkLabel, active: bool(fd, "active") };
  if (!existing) {
    const item: PriorityAlert = { id: newId(), createdAt: nowISO(), ...base };
    await db.alerts.insert(item);
    redirect(`/admin/avisos/${item.id}?guardado=creado`);
  }
  await db.alerts.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect(`/admin/avisos/${existing.id}?guardado=guardado`);
}

export async function deleteAlert(id: string): Promise<void> {
  await assertCan("alerts");
  await db.alerts.remove(id);
  redirect("/admin/avisos?aviso=eliminada");
}
