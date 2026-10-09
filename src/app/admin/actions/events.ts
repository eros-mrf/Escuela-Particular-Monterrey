"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { assertCan } from "@/lib/auth";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { db, newId } from "@/lib/db/store";
import type { EventItem } from "@/lib/db/types";
import { UploadError, deleteMedia } from "@/lib/media";
import { isValidDate, nowISO } from "@/lib/time";
import { dateRe, raw, str, timeRe, zodErrors, type ActionState } from "../_lib/forms";
import { processAttachments, processSingleImage } from "../_lib/uploads";

const categories = EVENT_CATEGORIES.map((c) => c.id) as [string, ...string[]];

const schema = z.object({
  title: z.string().min(3, "Escribe el nombre de la actividad.").max(160),
  date: z.string().regex(dateRe, "Elige la fecha."),
  endDate: z.string().regex(dateRe, "Fecha inválida.").optional(),
  startTime: z.string().regex(timeRe, "Hora inválida (formato 24 h, por ejemplo 08:30).").optional(),
  endTime: z.string().regex(timeRe, "Hora inválida.").optional(),
  location: z.string().max(160).optional(),
  category: z.enum(categories, { error: "Elige un tipo de actividad." }),
  description: z.string().max(20_000),
  imageAlt: z.string().max(200).optional(),
});

export async function saveEvent(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("events");
  const parsed = schema.safeParse({
    title: str(fd, "title"),
    date: str(fd, "date"),
    endDate: str(fd, "endDate") || undefined,
    startTime: str(fd, "startTime") || undefined,
    endTime: str(fd, "endTime") || undefined,
    location: str(fd, "location") || undefined,
    category: str(fd, "category"),
    description: raw(fd, "description").trim(),
    imageAlt: str(fd, "imageAlt") || undefined,
  });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const d = parsed.data;
  if (!isValidDate(d.date)) return { ok: false, message: "La fecha no es válida.", errors: { date: "Fecha inválida." } };
  if (d.endDate && (!isValidDate(d.endDate) || d.endDate < d.date)) return { ok: false, message: "La fecha de término no puede ser anterior al inicio.", errors: { endDate: "Debe ser igual o posterior al inicio." } };
  if (d.endTime && !d.startTime) return { ok: false, message: "Indica también la hora de inicio.", errors: { startTime: "Falta la hora de inicio." } };
  if (d.startTime && d.endTime && (d.endDate ?? d.date) === d.date && d.endTime < d.startTime) {
    return { ok: false, message: "La hora de término no puede ser anterior a la de inicio.", errors: { endTime: "Debe ser posterior al inicio." } };
  }

  const existing = id === "nueva" ? null : await db.events.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "La actividad ya no existe." };

  let imageMediaId: string | undefined;
  let attachments: EventItem["attachments"];
  try {
    imageMediaId = await processSingleImage(fd, "image", existing?.imageMediaId);
    attachments = await processAttachments(fd, "att");
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, message: err.message };
    throw err;
  }

  const base = {
    title: d.title,
    date: d.date,
    endDate: d.endDate && d.endDate !== d.date ? d.endDate : undefined,
    startTime: d.startTime,
    endTime: d.endTime,
    location: d.location,
    category: d.category,
    description: d.description,
    imageMediaId,
    imageAlt: imageMediaId ? d.imageAlt || d.title : undefined,
    attachments,
    updatedAt: nowISO(),
  };
  if (!existing) {
    const item: EventItem = { id: newId(), createdAt: nowISO(), ...base };
    await db.events.insert(item);
    redirect(`/admin/eventos/${item.id}?guardado=creado`);
  }
  await db.events.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect(`/admin/eventos/${existing.id}?guardado=guardado`);
}

export async function deleteEvent(id: string): Promise<void> {
  await assertCan("events");
  const e = await db.events.remove(id);
  if (e) {
    await deleteMedia(e.imageMediaId);
    for (const a of e.attachments) await deleteMedia(a.mediaId);
  }
  redirect("/admin/eventos?aviso=eliminada");
}
