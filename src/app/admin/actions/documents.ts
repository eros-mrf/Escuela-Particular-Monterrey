"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { assertCan } from "@/lib/auth";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { db, newId } from "@/lib/db/store";
import type { DocumentItem } from "@/lib/db/types";
import { UploadError, deleteMedia, isFile, saveUpload, setMediaVisibility } from "@/lib/media";
import { isValidDate, nowISO, todayCL } from "@/lib/time";
import { bool, dateRe, str, zodErrors, type ActionState } from "../_lib/forms";

const schema = z.object({
  title: z.string().min(3, "Escribe el nombre del documento.").max(160),
  description: z.string().max(600, "Máximo 600 caracteres."),
  category: z.enum(DOCUMENT_CATEGORIES, { error: "Elige una categoría." }),
  updatedAt: z.string().regex(dateRe, "Elige la fecha de actualización."),
});

export async function saveDocument(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("documents");
  const parsed = schema.safeParse({ title: str(fd, "title"), description: str(fd, "description"), category: str(fd, "category"), updatedAt: str(fd, "updatedAt") });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  if (!isValidDate(parsed.data.updatedAt)) return { ok: false, message: "La fecha no es válida.", errors: { updatedAt: "Fecha inválida." } };

  const existing = id === "nueva" ? null : await db.documents.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "El documento ya no existe." };
  const published = bool(fd, "published");
  const upload = fd.get("file");

  if (!existing && !isFile(upload)) return { ok: false, message: "Selecciona el archivo PDF del documento.", errors: { file: "Falta el archivo PDF." } };
  if (!existing && published && !bool(fd, "authorized")) {
    return { ok: false, message: "Confirma que el documento está autorizado para su difusión pública.", errors: { authorized: "Debes confirmar la autorización." } };
  }
  if (existing && published && !existing.published && !bool(fd, "authorized")) {
    return { ok: false, message: "Confirma que el documento está autorizado para su difusión pública.", errors: { authorized: "Debes confirmar la autorización." } };
  }

  let file: DocumentItem["file"] | undefined = existing?.file;
  let sizeBytes = existing?.sizeBytes;
  let updatedAt = parsed.data.updatedAt;
  const visibility = published ? "public" : "private";
  try {
    if (isFile(upload)) {
      const rec = await saveUpload(upload, { accept: "pdf", visibility });
      if (existing?.file.kind === "media") await deleteMedia(existing.file.mediaId); // reemplazo: se elimina la versión anterior
      file = { kind: "media", mediaId: rec.id };
      sizeBytes = rec.size;
      if (existing && updatedAt === existing.updatedAt) updatedAt = todayCL();
    } else if (existing?.file.kind === "media") {
      await setMediaVisibility(existing.file.mediaId, visibility);
    }
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, message: err.message, errors: { file: err.message } };
    throw err;
  }
  if (!file) return { ok: false, message: "Falta el archivo." };

  const base = { title: parsed.data.title, description: parsed.data.description, category: parsed.data.category, updatedAt, published, file, sizeBytes, fileType: "PDF" };
  if (!existing) {
    const item: DocumentItem = { id: newId(), createdAt: nowISO(), ...base };
    await db.documents.insert(item);
    redirect(`/admin/documentos/${item.id}?guardado=${published ? "publicada" : "borrador"}`);
  }
  await db.documents.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect(`/admin/documentos/${existing.id}?guardado=${published ? "publicada" : "borrador"}`);
}

export async function setDocumentPublished(id: string, published: boolean): Promise<void> {
  await assertCan("documents");
  const doc = await db.documents.find(id);
  if (doc) {
    if (doc.file.kind === "media") await setMediaVisibility(doc.file.mediaId, published ? "public" : "private");
    await db.documents.update(id, (d) => ({ ...d, published }));
  }
  redirect(`/admin/documentos?aviso=${published ? "publicada" : "despublicada"}`);
}

export async function deleteDocument(id: string): Promise<void> {
  await assertCan("documents");
  const d = await db.documents.remove(id);
  if (d?.file.kind === "media") await deleteMedia(d.file.mediaId);
  redirect("/admin/documentos?aviso=eliminada");
}
