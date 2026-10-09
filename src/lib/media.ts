import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { DATA_DIR } from "@/lib/env";
import { db } from "@/lib/db/store";
import { nowISO } from "@/lib/time";
import type { MediaRecord } from "@/lib/db/types";

const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export const LIMITS = {
  image: 8 * 1024 * 1024,
  pdf: 25 * 1024 * 1024,
};

export class UploadError extends Error {}

function detect(buf: Buffer): { kind: "image" | "pdf"; mime: string; ext: string } | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { kind: "image", mime: "image/jpeg", ext: "jpg" };
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { kind: "image", mime: "image/png", ext: "png" };
  }
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return { kind: "image", mime: "image/webp", ext: "webp" };
  }
  if (buf.length > 5 && buf.subarray(0, 5).toString("ascii") === "%PDF-") return { kind: "pdf", mime: "application/pdf", ext: "pdf" };
  return null;
}

function cleanName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._ -]/g, "")
    .trim()
    .slice(0, 80) || "archivo";
}

export function isFile(value: FormDataEntryValue | null | undefined): value is File {
  return typeof value === "object" && value !== null && "size" in value && (value as File).size > 0;
}

/**
 * Guarda un archivo subido desde el panel. El tipo se determina por el CONTENIDO del archivo
 * (firma binaria), nunca por el nombre ni el tipo que declara el navegador.
 */
export async function saveUpload(
  file: File,
  opts: { accept: "image" | "pdf"; visibility?: "public" | "private" },
): Promise<MediaRecord> {
  const buf = Buffer.from(await file.arrayBuffer());
  const info = detect(buf);
  if (!info || info.kind !== opts.accept) {
    throw new UploadError(
      opts.accept === "image"
        ? "El archivo debe ser una imagen JPG, PNG o WebP."
        : "El archivo debe ser un documento PDF.",
    );
  }
  if (buf.length > LIMITS[info.kind]) {
    throw new UploadError(`El archivo supera el tamaño máximo permitido (${LIMITS[info.kind] / 1024 / 1024} MB).`);
  }
  const id = randomBytes(12).toString("hex");
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, `${id}.${info.ext}`), buf, { mode: 0o640 });
  const record: MediaRecord = {
    id,
    originalName: cleanName(file.name),
    mime: info.mime,
    ext: info.ext,
    size: buf.length,
    kind: info.kind,
    visibility: opts.visibility ?? "public",
    createdAt: nowISO(),
  };
  await db.media.insert(record);
  return record;
}

export async function deleteMedia(id: string | undefined | null): Promise<void> {
  if (!id) return;
  const rec = await db.media.remove(id);
  if (rec) await fs.rm(path.join(UPLOAD_DIR, `${rec.id}.${rec.ext}`), { force: true });
}

export async function setMediaVisibility(id: string, visibility: "public" | "private"): Promise<void> {
  await db.media.update(id, (m) => ({ ...m, visibility }));
}

export async function readMediaFile(rec: MediaRecord): Promise<Buffer> {
  return fs.readFile(path.join(UPLOAD_DIR, `${rec.id}.${rec.ext}`));
}

export function mediaUrl(id: string | undefined | null): string | null {
  return id ? `/media/${id}` : null;
}
