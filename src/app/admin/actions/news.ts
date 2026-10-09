"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { assertCan } from "@/lib/auth";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { db, newId } from "@/lib/db/store";
import type { NewsItem } from "@/lib/db/types";
import { UploadError, deleteMedia } from "@/lib/media";
import { isValidDate, nowISO } from "@/lib/time";
import { uniqueSlug } from "@/lib/utils";
import { bool, dateRe, str, zodErrors, raw, type ActionState } from "../_lib/forms";
import { processAttachments, processGallery, processSingleImage } from "../_lib/uploads";

const schema = z.object({
  title: z.string().min(3, "Escribe un título (mínimo 3 caracteres).").max(160, "El título es demasiado largo (máximo 160)."),
  summary: z.string().min(10, "Escribe un resumen de al menos 10 caracteres.").max(300, "El resumen no puede superar los 300 caracteres."),
  body: z.string().min(20, "El texto de la noticia es muy corto.").max(50_000),
  category: z.enum(NEWS_CATEGORIES, { error: "Elige una categoría." }),
  author: z.string().max(100).optional(),
  publishedAt: z.string().regex(dateRe, "Elige una fecha válida."),
  coverAlt: z.string().max(200).optional(),
});

function read(fd: FormData) {
  return {
    title: str(fd, "title"),
    summary: str(fd, "summary"),
    body: raw(fd, "body").trim(),
    category: str(fd, "category"),
    author: str(fd, "author") || undefined,
    publishedAt: str(fd, "publishedAt"),
    coverAlt: str(fd, "coverAlt") || undefined,
  };
}

/** Crea (id = "nueva") o actualiza una noticia. `intent` indica si queda borrador o publicada. */
export async function saveNews(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("news");
  const parsed = schema.safeParse(read(fd));
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  if (!isValidDate(parsed.data.publishedAt)) return { ok: false, message: "La fecha no es válida.", errors: { publishedAt: "Fecha inválida." } };

  const intent = str(fd, "intent") === "publish" ? "published" : str(fd, "intent") === "draft" ? "draft" : null;
  const existing = id === "nueva" ? null : await db.news.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "La noticia ya no existe." };

  const status: NewsItem["status"] = intent ?? existing?.status ?? "draft";
  let coverMediaId: string | undefined;
  let gallery: NewsItem["gallery"];
  let attachments: NewsItem["attachments"];
  try {
    coverMediaId = await processSingleImage(fd, "cover", existing?.coverMediaId);
    gallery = await processGallery(fd, "gallery", parsed.data.title);
    attachments = await processAttachments(fd, "att");
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, message: err.message };
    throw err;
  }
  if (coverMediaId && !parsed.data.coverAlt) {
    // La imagen de portada necesita texto alternativo para ser accesible.
    parsed.data.coverAlt = parsed.data.title;
  }

  const base = {
    title: parsed.data.title,
    summary: parsed.data.summary,
    body: parsed.data.body,
    category: parsed.data.category,
    author: parsed.data.author,
    publishedAt: parsed.data.publishedAt,
    coverMediaId,
    coverAlt: coverMediaId ? parsed.data.coverAlt : undefined,
    featured: bool(fd, "featured"),
    status,
    gallery,
    attachments,
    updatedAt: nowISO(),
  };

  if (!existing) {
    const slug = uniqueSlug(parsed.data.title, (await db.news.all()).map((n) => n.slug));
    const item: NewsItem = { id: newId(), slug, createdAt: nowISO(), ...base };
    await db.news.insert(item);
    redirect(`/admin/noticias/${item.id}?guardado=${status === "published" ? "publicada" : "borrador"}`);
  }
  await db.news.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect(`/admin/noticias/${existing.id}?guardado=${status === "published" ? "publicada" : "borrador"}`);
}

export async function setNewsStatus(id: string, status: "draft" | "published"): Promise<void> {
  await assertCan("news");
  await db.news.update(id, (n) => ({ ...n, status, updatedAt: nowISO() }));
  redirect(`/admin/noticias?aviso=${status === "published" ? "publicada" : "despublicada"}`);
}

export async function deleteNews(id: string): Promise<void> {
  await assertCan("news");
  const n = await db.news.remove(id);
  if (n) {
    await deleteMedia(n.coverMediaId);
    for (const g of n.gallery) await deleteMedia(g.mediaId);
    for (const a of n.attachments) await deleteMedia(a.mediaId);
  }
  redirect("/admin/noticias?aviso=eliminada");
}
