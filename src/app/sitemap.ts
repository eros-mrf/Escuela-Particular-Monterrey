import type { MetadataRoute } from "next";
import { allEvents, publicGalleries, publicNews } from "@/lib/content";
import { SITE_URL } from "@/lib/env";

export const dynamic = "force-dynamic";

const STATIC = [
  "",
  "/quienes-somos",
  "/quienes-somos/historia",
  "/quienes-somos/mision-vision",
  "/quienes-somos/sellos-y-valores",
  "/quienes-somos/proyecto-educativo",
  "/quienes-somos/equipo-directivo",
  "/quienes-somos/establecimiento",
  "/formacion",
  "/noticias",
  "/vida-escolar",
  "/galerias",
  "/convivencia",
  "/calendario",
  "/documentos",
  "/comunicados",
  "/matriculas",
  "/preguntas-frecuentes",
  "/contacto",
  "/privacidad",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, galleries, events] = await Promise.all([publicNews(), publicGalleries(), allEvents()]);
  return [
    ...STATIC.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...news.map((n) => ({ url: `${SITE_URL}/noticias/${n.slug}`, lastModified: n.updatedAt, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...galleries.map((g) => ({ url: `${SITE_URL}/galerias/${g.slug}`, lastModified: g.updatedAt, changeFrequency: "yearly" as const, priority: 0.4 })),
    ...events.map((e) => ({ url: `${SITE_URL}/calendario/${e.id}`, lastModified: e.updatedAt, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
