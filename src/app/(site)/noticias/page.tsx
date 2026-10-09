import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/content/cards";
import { EmptyState, PageHeader, Pagination, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { publicNews } from "@/lib/content";
import { stripMarkdown } from "@/lib/markdown";
import { normalize, pick } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Noticias y actualidad",
  description: "Noticias institucionales, actividades pedagógicas, deporte, arte y cultura de la Escuela Particular Monterrey.",
  alternates: { canonical: "/noticias" },
};

const PAGE_SIZE = 9;

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function NoticiasPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (pick(sp.q) ?? "").trim().slice(0, 80);
  const categoria = pick(sp.categoria) ?? "";
  const anio = pick(sp.anio) ?? "";
  const page = Math.max(1, Number.parseInt(pick(sp.pagina) ?? "1", 10) || 1);

  const all = await publicNews();
  const years = [...new Set(all.map((n) => n.publishedAt.slice(0, 4)))].sort().reverse();
  const usedCats = NEWS_CATEGORIES.filter((c) => all.some((n) => n.category === c));
  const tokens = normalize(q).split(/\s+/).filter(Boolean);

  const filtered = all.filter((n) => {
    if (categoria && n.category !== categoria) return false;
    if (anio && !n.publishedAt.startsWith(anio)) return false;
    if (tokens.length) {
      const hay = normalize(`${n.title} ${n.summary} ${stripMarkdown(n.body)} ${n.category} ${n.author ?? ""}`);
      return tokens.every((t) => hay.includes(t));
    }
    return true;
  });

  const filtering = Boolean(q || categoria || anio);
  const featured = !filtering && page === 1 ? filtered.filter((n) => n.featured).slice(0, 1) : [];
  const rest = filtered.filter((n) => !featured.includes(n));
  const pages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rest.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const href = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (categoria) params.set("categoria", categoria);
    if (anio) params.set("anio", anio);
    if (p > 1) params.set("pagina", String(p));
    const s = params.toString();
    return s ? `/noticias?${s}` : "/noticias";
  };

  return (
    <>
      <PageHeader title="Noticias y actualidad" eyebrow="Escuela Particular Monterrey" description="Lo que ocurre en nuestra comunidad educativa, publicado por el establecimiento." />
      <Section>
        <form method="get" action="/noticias" role="search" aria-label="Buscar y filtrar noticias" className="card mb-10 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[2fr_1.3fr_1fr_auto] lg:items-end">
          <div>
            <label htmlFor="q" className="label">Buscar por palabras</label>
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Ej.: aniversario, taller, reunión" className="field" />
          </div>
          <div>
            <label htmlFor="categoria" className="label">Categoría</label>
            <select id="categoria" name="categoria" defaultValue={categoria} className="field">
              <option value="">Todas</option>
              {usedCats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="anio" className="label">Año</label>
            <select id="anio" name="anio" defaultValue={anio} className="field">
              <option value="">Todos</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary"><Icon name="search" size={18} /> Buscar</button>
            {filtering && <Link href="/noticias" className="btn btn-outline">Limpiar</Link>}
          </div>
        </form>

        <p role="status" className="mb-6 text-muted">
          {filtered.length === 0 ? "Sin resultados." : `${filtered.length} ${filtered.length === 1 ? "noticia" : "noticias"}${filtering ? " encontradas" : ""}.`}
        </p>

        {filtered.length === 0 ? (
          <EmptyState title={all.length === 0 ? "Aún no hay noticias publicadas" : "No encontramos noticias con esos filtros"} icon="news">
            {all.length === 0 ? "Las noticias que publique el establecimiento aparecerán en esta página." : "Prueba con otras palabras o limpia los filtros."}
          </EmptyState>
        ) : (
          <>
            {featured.map((n) => (
              <div key={n.id} className="mb-6">
                <NewsCard item={n} featured priority />
              </div>
            ))}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((n, i) => (
                <NewsCard key={n.id} item={n} priority={i < 3 && !featured.length} />
              ))}
            </div>
            <Pagination page={current} pages={pages} hrefFor={href} />
          </>
        )}
      </Section>
    </>
  );
}
