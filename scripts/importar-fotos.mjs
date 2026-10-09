#!/usr/bin/env node
/**
 * Carga una carpeta de fotografías como una galería, sin pasar por el panel (útil para cargar muchas a la vez).
 *
 *   node scripts/importar-fotos.mjs <carpeta> --titulo "Taller de cocina" --categoria "Actividades escolares" \
 *        [--fecha 2026-09-18] [--descripcion "..."] [--publicar --confirmo-autorizacion]
 *
 * Reglas de privacidad (igual que el panel):
 *  - Sin `--publicar` la galería queda como BORRADOR.
 *  - Para publicar hay que declarar `--confirmo-autorizacion` (existen autorizaciones de los apoderados).
 *  - Se guardan copias sin metadatos EXIF solo si hay `sharp`/Pillow disponible; de lo contrario se copian tal cual:
 *    elimina antes la ubicación GPS de las fotos si no quieres publicarla.
 *  - Las fotos de estudiantes NO deben subirse a un repositorio público: esta carpeta de datos (`data/`) está en .gitignore.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(root, "data");
const DB = path.join(DATA_DIR, "db");
const UP = path.join(DATA_DIR, "uploads");

const args = process.argv.slice(2);
const folder = args[0] && !args[0].startsWith("--") ? args[0] : undefined;
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const flag = (name) => args.includes(`--${name}`);

const CATEGORIES = ["Actividades escolares", "Actos y celebraciones", "Deporte y recreación", "Arte y cultura", "Instalaciones", "Comunidad educativa"];
const titulo = opt("titulo");
const categoria = opt("categoria") ?? "Actividades escolares";
const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit" });
const fecha = opt("fecha") ?? ymd.format(new Date());

if (!folder || !titulo) {
  console.error('Uso: node scripts/importar-fotos.mjs <carpeta> --titulo "Título" [--categoria "..."] [--fecha AAAA-MM-DD] [--publicar --confirmo-autorizacion]');
  process.exit(1);
}
if (!CATEGORIES.includes(categoria)) {
  console.error(`Categoría inválida. Usa una de: ${CATEGORIES.join(" | ")}`);
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
  console.error("La fecha debe tener formato AAAA-MM-DD.");
  process.exit(1);
}
const publicar = flag("publicar");
if (publicar && !flag("confirmo-autorizacion")) {
  console.error("Para publicar debes agregar --confirmo-autorizacion (existen autorizaciones para difundir las imágenes de estudiantes).");
  process.exit(1);
}

function detect(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mime: "image/png", ext: "png" };
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return { mime: "image/webp", ext: "webp" };
  return null;
}

async function readJson(name) {
  try {
    return JSON.parse(await fs.readFile(path.join(DB, `${name}.json`), "utf8"));
  } catch {
    return [];
  }
}
async function writeJson(name, data) {
  await fs.mkdir(DB, { recursive: true });
  await fs.writeFile(path.join(DB, `${name}.json`), JSON.stringify(data, null, 2));
}

const files = (await fs.readdir(folder)).sort().filter((f) => !f.startsWith("."));
const media = await readJson("media");
const images = [];
for (const f of files) {
  const buf = await fs.readFile(path.join(folder, f));
  const info = detect(buf);
  if (!info || buf.length > 8 * 1024 * 1024) {
    console.warn(`  - se omite ${f}: no es JPG/PNG/WebP o supera 8 MB`);
    continue;
  }
  const mediaId = randomBytes(12).toString("hex");
  await fs.mkdir(UP, { recursive: true });
  await fs.writeFile(path.join(UP, `${mediaId}.${info.ext}`), buf);
  media.push({ id: mediaId, originalName: f.slice(0, 80), mime: info.mime, ext: info.ext, size: buf.length, kind: "image", visibility: "public", createdAt: new Date().toISOString() });
  images.push({ mediaId, alt: `${titulo}, fotografía ${images.length + 1}` });
}
if (!images.length) {
  console.error("No se encontraron imágenes válidas en la carpeta.");
  process.exit(1);
}
await writeJson("media", media);

const slugBase = titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "galeria";
const galleries = await readJson("galleries");
let slug = slugBase;
for (let n = 2; galleries.some((g) => g.slug === slug); n++) slug = `${slugBase}-${n}`;
const now = new Date().toISOString();
galleries.push({
  id: randomBytes(9).toString("base64url"),
  slug,
  title: titulo,
  description: opt("descripcion") ?? "",
  category: categoria,
  date: fecha,
  images,
  published: publicar,
  consentConfirmed: flag("confirmo-autorizacion"),
  createdAt: now,
  updatedAt: now,
});
await writeJson("galleries", galleries);
console.log(`Galería «${titulo}» creada con ${images.length} fotografías (${publicar ? "PUBLICADA" : "borrador"}).`);
console.log("Revisa los textos alternativos de cada foto en el panel: Galerías → Editar.");
