"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { assertCan } from "@/lib/auth";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { db, newId } from "@/lib/db/store";
import type { GalleryItem } from "@/lib/db/types";
import { UploadError, deleteMedia } from "@/lib/media";
import { isValidDate, nowISO } from "@/lib/time";
import { uniqueSlug } from "@/lib/utils";
import { bool, dateRe, str, zodErrors, type ActionState } from "../_lib/forms";
import { processGallery } from "../_lib/uploads";

const schema = z.object({
  title: z.string().min(3, "Escribe el título de la galería.").max(140),
  description: z.string().max(500),
  category: z.enum(GALLERY_CATEGORIES, { error: "Elige una categoría." }),
  date: z.string().regex(dateRe, "Elige la fecha."),
});

export async function saveGallery(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("galleries");
  const parsed = schema.safeParse({ title: str(fd, "title"), description: str(fd, "description"), category: str(fd, "category"), date: str(fd, "date") });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  if (!isValidDate(parsed.data.date)) return { ok: false, message: "La fecha no es válida.", errors: { date: "Fecha inválida." } };

  const existing = id === "nueva" ? null : await db.galleries.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "La galería ya no existe." };
  const published = str(fd, "intent") === "publish";
  const consent = bool(fd, "consent");
  if (published && !consent) {
    return { ok: false, message: "Para publicar, confirma que existen las autorizaciones para difundir las imágenes.", errors: { consent: "Debes confirmar las autorizaciones." } };
  }

  let images: GalleryItem["images"];
  try {
    images = await processGallery(fd, "img", parsed.data.title);
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, message: err.message };
    throw err;
  }
  if (published && images.length === 0) return { ok: false, message: "Agrega al menos una fotografía para publicar la galería.", errors: { img_new: "Falta al menos una fotografía." } };

  const base = { title: parsed.data.title, description: parsed.data.description, category: parsed.data.category, date: parsed.data.date, images, published, consentConfirmed: consent, updatedAt: nowISO() };
  if (!existing) {
    const slug = uniqueSlug(parsed.data.title, (await db.galleries.all()).map((g) => g.slug));
    const item: GalleryItem = { id: newId(), slug, createdAt: nowISO(), ...base };
    await db.galleries.insert(item);
    redirect(`/admin/galerias/${item.id}?guardado=${published ? "publicada" : "borrador"}`);
  }
  await db.galleries.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect(`/admin/galerias/${existing.id}?guardado=${published ? "publicada" : "borrador"}`);
}

export async function setGalleryPublished(id: string, published: boolean): Promise<void> {
  await assertCan("galleries");
  await db.galleries.update(id, (g) => ({ ...g, published, updatedAt: nowISO() }));
  redirect(`/admin/galerias?aviso=${published ? "publicada" : "despublicada"}`);
}

export async function deleteGallery(id: string): Promise<void> {
  await assertCan("galleries");
  const g = await db.galleries.remove(id);
  if (g) for (const img of g.images) await deleteMedia(img.mediaId);
  redirect("/admin/galerias?aviso=eliminada");
}
