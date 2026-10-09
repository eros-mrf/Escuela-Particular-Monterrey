import "server-only";
import { allEvents, publicAnnouncements, publicDocuments, publicFaqs, publicGalleries, publicNews } from "@/lib/content";
import { stripMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/time";
import { normalize, truncate } from "@/lib/utils";

export interface SearchHit {
  type: "Página" | "Noticia" | "Documento" | "Evento" | "Comunicado" | "Galería" | "Pregunta frecuente";
  title: string;
  href: string;
  excerpt: string;
  date?: string;
  score: number;
}

const PAGES = [
  { title: "Quiénes somos", href: "/quienes-somos", text: "escuela particular monterrey cajón vilcún presentación comunidad educativa" },
  { title: "Nuestra historia", href: "/quienes-somos/historia", text: "historia fundación 1982 trayectoria línea de tiempo reseña histórica lorenzo puel" },
  { title: "Misión y visión", href: "/quienes-somos/mision-vision", text: "misión visión educamos de forma integral e inclusiva altas expectativas" },
  { title: "Sellos educativos y valores", href: "/quienes-somos/sellos-y-valores", text: "sellos principios valores actitudes respeto gratitud solidaridad responsabilidad perseverancia educación cristiana" },
  { title: "Nuestro proyecto educativo", href: "/quienes-somos/proyecto-educativo", text: "pei proyecto educativo institucional descargar pdf" },
  { title: "Equipo directivo", href: "/quienes-somos/equipo-directivo", text: "directora director utp jefe unidad técnica pedagógica organigrama equipo" },
  { title: "Nuestro establecimiento", href: "/quienes-somos/establecimiento", text: "infraestructura salas biblioteca cra laboratorio informática comedor patio instalaciones espacios" },
  { title: "Proyecto educativo y formación", href: "/formacion", text: "enfoque pedagógico competencias dua singapur niveles educativos formación integral inclusión talleres plan de estudios" },
  { title: "Inclusión y apoyo educativo", href: "/formacion#inclusion", text: "pie programa de integración escolar sep subvención escolar preferencial pae alimentación" },
  { title: "Talleres y actividades complementarias", href: "/formacion#talleres", text: "banda de guerra danza folclórica taekwondo atletismo gimnasia rítmica teatro cocina inglés pintura" },
  { title: "Biblioteca y recursos de aprendizaje", href: "/formacion#recursos", text: "biblioteca cra enlaces informática plataformas papinotas lirmi gmop" },
  { title: "Vida escolar", href: "/vida-escolar", text: "actividades escolares talleres celebraciones aniversario centro de padres participación" },
  { title: "Galerías de fotografías", href: "/galerias", text: "fotos fotografías galería actividades" },
  { title: "Convivencia escolar y bienestar", href: "/convivencia", text: "convivencia buen trato reglamento protocolos bienestar familias normas" },
  { title: "Calendario escolar", href: "/calendario", text: "calendario agenda actividades reuniones apoderados actos eventos" },
  { title: "Noticias", href: "/noticias", text: "noticias actualidad" },
  { title: "Comunicados", href: "/comunicados", text: "comunicados avisos circulares apoderados" },
  { title: "Documentos institucionales", href: "/documentos", text: "documentos reglamentos protocolos pdf descargas" },
  { title: "Matrículas y admisión", href: "/matriculas", text: "matrícula admisión postulación sae requisitos fechas postular" },
  { title: "Preguntas frecuentes", href: "/preguntas-frecuentes", text: "preguntas frecuentes faq dudas" },
  { title: "Contacto y ubicación", href: "/contacto", text: "contacto teléfono correo dirección mapa ubicación alejandro urrutia horario" },
  { title: "Privacidad", href: "/privacidad", text: "privacidad datos personales imágenes estudiantes" },
];

function scoreOf(tokens: string[], title: string, body: string): number {
  const t = normalize(title);
  const b = normalize(body);
  let score = 0;
  for (const tok of tokens) {
    if (t.includes(tok)) score += 5;
    else if (b.includes(tok)) score += 1;
    else return 0; // todas las palabras deben aparecer
  }
  return score;
}

function excerptOf(text: string, tokens: string[]): string {
  const plain = text.replace(/\s+/g, " ").trim();
  const n = normalize(plain);
  const idx = tokens.length ? n.indexOf(tokens[0]) : -1;
  const start = idx > 60 ? idx - 60 : 0;
  return (start > 0 ? "…" : "") + truncate(plain.slice(start), 180);
}

export async function searchSite(query: string, limit = 40): Promise<SearchHit[]> {
  const tokens = normalize(query).split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return [];
  const hits: SearchHit[] = [];
  const push = (h: Omit<SearchHit, "score">, score: number) => score > 0 && hits.push({ ...h, score });

  for (const p of PAGES) push({ type: "Página", title: p.title, href: p.href, excerpt: truncate(p.text, 120) }, scoreOf(tokens, p.title, p.text));

  const [news, docs, events, anns, galleries, faqs] = await Promise.all([
    publicNews(),
    publicDocuments(),
    allEvents(),
    publicAnnouncements(),
    publicGalleries(),
    publicFaqs(),
  ]);

  for (const n of news) {
    const body = `${n.summary} ${stripMarkdown(n.body)} ${n.category}`;
    push({ type: "Noticia", title: n.title, href: `/noticias/${n.slug}`, excerpt: excerptOf(body, tokens), date: formatDate(n.publishedAt, "short") }, scoreOf(tokens, n.title, body));
  }
  for (const d of docs) {
    const body = `${d.description} ${d.category}`;
    push({ type: "Documento", title: d.title, href: `/documentos?q=${encodeURIComponent(d.title)}`, excerpt: excerptOf(body, tokens), date: formatDate(d.updatedAt, "short") }, scoreOf(tokens, d.title, body));
  }
  for (const e of events) {
    const body = `${e.description} ${e.location ?? ""} ${e.category}`;
    push({ type: "Evento", title: e.title, href: `/calendario/${e.id}`, excerpt: excerptOf(body, tokens), date: formatDate(e.date, "short") }, scoreOf(tokens, e.title, body));
  }
  for (const a of anns) {
    const body = `${stripMarkdown(a.body)} ${a.category}`;
    push({ type: "Comunicado", title: a.title, href: `/comunicados#${a.id}`, excerpt: excerptOf(body, tokens), date: formatDate(a.publishedAt, "short") }, scoreOf(tokens, a.title, body));
  }
  for (const g of galleries) {
    const body = `${g.description} ${g.category}`;
    push({ type: "Galería", title: g.title, href: `/galerias/${g.slug}`, excerpt: excerptOf(body, tokens), date: formatDate(g.date, "short") }, scoreOf(tokens, g.title, body));
  }
  for (const f of faqs) {
    push({ type: "Pregunta frecuente", title: f.question, href: `/preguntas-frecuentes#${f.id}`, excerpt: excerptOf(f.answer, tokens) }, scoreOf(tokens, f.question, f.answer));
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
