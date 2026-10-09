#!/usr/bin/env node
/**
 * Carga CONTENIDO DE DEMOSTRACIÓN para probar el diseño del sitio.
 *
 *   npm run seed:demo            → agrega el contenido de ejemplo
 *   npm run seed:demo:limpiar    → lo elimina (también se puede desde el panel)
 *
 * Todo lo que crea queda marcado con `demo: true` y se muestra en el sitio con la etiqueta
 * «Demostración». Los textos no afirman hechos sobre la escuela y las imágenes son ilustraciones.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(root, "data");
const DB = path.join(DATA_DIR, "db");
const UP = path.join(DATA_DIR, "uploads");
const clean = process.argv.includes("--limpiar");

const id = () => randomBytes(9).toString("base64url");
const mid = () => randomBytes(12).toString("hex");
const now = new Date().toISOString();

const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit" });
const today = ymd.format(new Date());
const plus = (days) => {
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

async function read(name, fallback = []) {
  try {
    return JSON.parse(await fs.readFile(path.join(DB, `${name}.json`), "utf8"));
  } catch {
    return fallback;
  }
}
async function write(name, data) {
  await fs.mkdir(DB, { recursive: true });
  await fs.writeFile(path.join(DB, `${name}.json`), JSON.stringify(data, null, 2));
}

async function removeMedia(mediaIds) {
  const media = await read("media");
  const keep = [];
  for (const m of media) {
    if (mediaIds.has(m.id)) await fs.rm(path.join(UP, `${m.id}.${m.ext}`), { force: true });
    else keep.push(m);
  }
  await write("media", keep);
}

async function purge() {
  const ids = new Set();
  for (const name of ["news", "events", "announcements", "alerts", "documents", "galleries"]) {
    const rows = await read(name);
    for (const r of rows.filter((x) => x.demo)) {
      if (r.coverMediaId) ids.add(r.coverMediaId);
      if (r.imageMediaId) ids.add(r.imageMediaId);
      if (r.file?.kind === "media") ids.add(r.file.mediaId);
      for (const g of r.gallery ?? r.images ?? []) ids.add(g.mediaId);
      for (const a of r.attachments ?? []) ids.add(a.mediaId);
    }
    await write(name, rows.filter((x) => !x.demo));
  }
  await removeMedia(ids);
}

async function addImage(file) {
  const buf = await fs.readFile(path.join(root, "scripts", "demo-assets", file));
  const mediaId = mid();
  await fs.mkdir(UP, { recursive: true });
  await fs.writeFile(path.join(UP, `${mediaId}.jpg`), buf);
  const media = await read("media");
  media.push({ id: mediaId, originalName: file, mime: "image/jpeg", ext: "jpg", size: buf.length, kind: "image", visibility: "public", createdAt: now });
  await write("media", media);
  return mediaId;
}

async function addPdf() {
  const text = "Documento de demostracion - no es un documento oficial";
  const stream = `BT /F1 18 Tf 60 740 Td (${text}) Tj ET`;
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let out = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const buf = Buffer.from(out, "latin1");
  const mediaId = mid();
  await fs.mkdir(UP, { recursive: true });
  await fs.writeFile(path.join(UP, `${mediaId}.pdf`), buf);
  const media = await read("media");
  media.push({ id: mediaId, originalName: "documento-demostracion.pdf", mime: "application/pdf", ext: "pdf", size: buf.length, kind: "pdf", visibility: "public", createdAt: now });
  await write("media", media);
  return { mediaId, size: buf.length };
}

await purge();
if (clean) {
  console.log("Contenido de demostración eliminado.");
  process.exit(0);
}

const imgs = [];
for (let i = 1; i <= 6; i++) imgs.push(await addImage(`demo-${i}.jpg`));

const lorem =
  "Este es un texto de demostración para probar el diseño del sitio. No describe hechos reales de la Escuela Particular Monterrey.\n\nPuedes eliminarlo desde el panel de administración o ejecutando `npm run seed:demo:limpiar`.\n\n## Un subtítulo de ejemplo\n\n- Primer punto de una lista\n- Segundo punto de una lista\n\nLa redacción de las noticias reales la realiza el establecimiento desde el panel.";

const news = [
  { title: "Noticia de demostración destacada", category: "Noticias institucionales", cover: imgs[0], featured: true, days: -2 },
  { title: "Ejemplo de noticia sobre una actividad pedagógica", category: "Actividades pedagógicas", cover: imgs[1], days: -9 },
  { title: "Ejemplo de noticia de arte y cultura", category: "Arte y cultura", cover: imgs[2], days: -16 },
  { title: "Ejemplo de noticia deportiva", category: "Deporte y recreación", cover: imgs[3], days: -30 },
].map((n) => ({
  id: id(),
  slug: `demo-${n.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)}`,
  title: n.title,
  summary: "Texto de demostración para probar tarjetas, filtros y paginación. No corresponde a una noticia real.",
  body: lorem,
  category: n.category,
  coverMediaId: n.cover,
  coverAlt: "Imagen de demostración",
  author: "Contenido de demostración",
  publishedAt: plus(n.days),
  status: "published",
  featured: Boolean(n.featured),
  gallery: n.featured ? imgs.slice(3, 6).map((m, i) => ({ mediaId: m, alt: `Imagen de demostración ${i + 1}` })) : [],
  attachments: [],
  demo: true,
  createdAt: now,
  updatedAt: now,
}));
await write("news", [...(await read("news")), ...news]);

const events = [
  ["Actividad de demostración", "Actividad pedagógica", 3, "09:00", "10:30", "Sala de clases"],
  ["Reunión de apoderados de ejemplo", "Reunión de apoderados", 8, "18:30", "19:30", "Patio techado"],
  ["Acto escolar de ejemplo", "Acto escolar", 15, "10:00", "11:00", "Patio techado"],
  ["Celebración de ejemplo", "Celebración institucional", 22, "", "", ""],
  ["Jornada deportiva de ejemplo", "Deporte y cultura", 29, "09:00", "13:00", "Patio exterior"],
].map(([title, category, d, st, et, loc]) => ({
  id: id(),
  title,
  date: plus(d),
  startTime: st || undefined,
  endTime: et || undefined,
  location: loc || undefined,
  category,
  description: "Evento de demostración para probar el calendario. No es una actividad real de la escuela.",
  attachments: [],
  demo: true,
  createdAt: now,
  updatedAt: now,
}));
await write("events", [...(await read("events")), ...events]);

await write("announcements", [
  ...(await read("announcements")),
  { id: id(), title: "Comunicado de demostración vigente", body: lorem, category: "General", publishedAt: plus(-1), expiresAt: plus(14), status: "published", pinned: true, attachments: [], demo: true, createdAt: now, updatedAt: now },
  { id: id(), title: "Comunicado de demostración archivado", body: lorem, category: "Reuniones", publishedAt: plus(-40), expiresAt: plus(-20), status: "published", pinned: false, attachments: [], demo: true, createdAt: now, updatedAt: now },
]);

await write("alerts", [
  ...(await read("alerts")),
  { id: id(), message: "Aviso de demostración: así se ve un mensaje prioritario con fecha de expiración.", level: "importante", startsAt: plus(-1), expiresAt: plus(5), active: true, demo: true, createdAt: now },
]);

const pdf = await addPdf();
const docs = await read("documents", null);
await write("documents", [
  ...(docs ?? [
    {
      id: "pei-2019-2023",
      title: "Proyecto Educativo Institucional (PEI) 2019–2023",
      description:
        "Documento rector de la escuela: identificación del establecimiento, misión, visión, sellos, principios y valores, modelo pedagógico, plan de estudios, diagnóstico institucional y organización.",
      category: "Proyecto Educativo Institucional (PEI)",
      file: { kind: "static", url: "/documentos/proyecto-educativo-institucional-2019-2023.pdf" },
      fileType: "PDF",
      sizeBytes: 499000,
      updatedAt: "2019-03-31",
      published: true,
      createdAt: "2019-03-31T00:00:00.000Z",
    },
  ]),
  { id: id(), title: "Documento de demostración", description: "Archivo PDF de ejemplo para probar la descarga. No es un documento oficial.", category: "Otros documentos públicos", file: { kind: "media", mediaId: pdf.mediaId }, sizeBytes: pdf.size, fileType: "PDF", updatedAt: today, published: true, demo: true, createdAt: now },
]);

await write("galleries", [
  ...(await read("galleries")),
  {
    id: id(),
    slug: "demo-galeria-de-ejemplo",
    title: "Galería de demostración",
    description: "Imágenes de ejemplo para probar el visor ampliado, con navegación por teclado. No son fotografías de la escuela.",
    category: "Actividades escolares",
    date: plus(-5),
    images: imgs.map((m, i) => ({ mediaId: m, alt: `Imagen de demostración ${i + 1}`, caption: `Imagen de demostración ${i + 1} de ${imgs.length}` })),
    published: true,
    consentConfirmed: true,
    demo: true,
    createdAt: now,
    updatedAt: now,
  },
]);

console.log("Contenido de demostración cargado:", { noticias: news.length, eventos: events.length, comunicados: 2, avisos: 1, galerias: 1, documentos: 1 });
