import "server-only";
import { db } from "@/lib/db/store";
import { deleteMedia, isFile, saveUpload } from "@/lib/media";
import type { Attachment, GalleryImage } from "@/lib/db/types";
import { raw, str } from "./forms";

/**
 * Procesa un campo de imagen única (portada, foto de persona, imagen de evento):
 *  - `<name>` (archivo): reemplaza la imagen actual.
 *  - `<name>_remove` (checkbox): quita la imagen actual.
 * Devuelve el id de media resultante.
 */
export async function processSingleImage(fd: FormData, name: string, current: string | undefined): Promise<string | undefined> {
  const file = fd.get(name);
  const remove = fd.get(`${name}_remove`) === "on";
  if (isFile(file)) {
    const rec = await saveUpload(file, { accept: "image" });
    await deleteMedia(current);
    return rec.id;
  }
  if (remove) {
    await deleteMedia(current);
    return undefined;
  }
  return current;
}

/**
 * Galería de varias imágenes. Campos:
 *  - `${p}_count`: cantidad de imágenes existentes enviadas.
 *  - `${p}_id_i`, `${p}_alt_i`, `${p}_cap_i`, `${p}_del_i` (checkbox).
 *  - `${p}_new`: archivos nuevos (múltiples).
 */
export async function processGallery(fd: FormData, p: string, fallbackAlt: string): Promise<GalleryImage[]> {
  const count = Number.parseInt(raw(fd, `${p}_count`) || "0", 10) || 0;
  const kept: GalleryImage[] = [];
  for (let i = 0; i < count; i++) {
    const mediaId = str(fd, `${p}_id_${i}`);
    if (!mediaId) continue;
    if (fd.get(`${p}_del_${i}`) === "on") {
      await deleteMedia(mediaId);
      continue;
    }
    kept.push({ mediaId, alt: str(fd, `${p}_alt_${i}`).slice(0, 200), caption: str(fd, `${p}_cap_${i}`).slice(0, 300) || undefined });
  }
  const files = fd.getAll(`${p}_new`).filter(isFile);
  for (const f of files) {
    const rec = await saveUpload(f, { accept: "image" });
    kept.push({ mediaId: rec.id, alt: `${fallbackAlt}, fotografía ${kept.length + 1}` });
  }
  return kept;
}

/** Adjuntos PDF: `${p}_count`, `${p}_id_i`, `${p}_title_i`, `${p}_del_i`; nuevo: `${p}_new` + `${p}_new_title`. */
export async function processAttachments(fd: FormData, p: string): Promise<Attachment[]> {
  const count = Number.parseInt(raw(fd, `${p}_count`) || "0", 10) || 0;
  const kept: Attachment[] = [];
  for (let i = 0; i < count; i++) {
    const mediaId = str(fd, `${p}_id_${i}`);
    if (!mediaId) continue;
    if (fd.get(`${p}_del_${i}`) === "on") {
      await deleteMedia(mediaId);
      continue;
    }
    kept.push({ mediaId, title: str(fd, `${p}_title_${i}`).slice(0, 160) || "Documento adjunto" });
  }
  const file = fd.get(`${p}_new`);
  if (isFile(file)) {
    const rec = await saveUpload(file, { accept: "pdf" });
    kept.push({ mediaId: rec.id, title: str(fd, `${p}_new_title`).slice(0, 160) || rec.originalName.replace(/\.pdf$/i, "") });
  }
  return kept;
}

export async function deleteAll(ids: (string | undefined)[]): Promise<void> {
  for (const id of ids) await deleteMedia(id);
}

export async function mediaMap(ids: string[]) {
  const all = await db.media.all();
  const set = new Set(ids);
  return new Map(all.filter((m) => set.has(m.id)).map((m) => [m.id, m]));
}
