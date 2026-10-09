import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementCard } from "@/components/content/cards";
import { EmptyState, PageHeader, Pagination, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { ANNOUNCEMENT_CATEGORIES } from "@/lib/constants";
import { publicAnnouncements } from "@/lib/content";
import { db } from "@/lib/db/store";
import { renderMarkdown } from "@/lib/markdown";
import { normalize, pick, formatBytes } from "@/lib/utils";
import { formatDate } from "@/lib/time";

export const metadata: Metadata = {
  title: "Centro de comunicados",
  description: "Avisos y comunicados institucionales para apoderados de la Escuela Particular Monterrey, con fecha, categoría y vigencia.",
  alternates: { canonical: "/comunicados" },
};

const PAGE_SIZE = 10;
type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ComunicadosPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (pick(sp.q) ?? "").trim().slice(0, 80);
  const categoria = pick(sp.categoria) ?? "";
  const anio = pick(sp.anio) ?? "";
  const estado = pick(sp.estado) === "archivo" ? "archivo" : pick(sp.estado) === "todos" ? "todos" : "vigentes";
  const page = Math.max(1, Number.parseInt(pick(sp.pagina) ?? "1", 10) || 1);

  const all = await publicAnnouncements();
  const years = [...new Set(all.map((a) => a.publishedAt.slice(0, 4)))].sort().reverse();
  const tokens = normalize(q).split(/\s+/).filter(Boolean);
  const filtered = all
    .filter((a) => (estado === "vigentes" ? a.state === "vigente" : estado === "archivo" ? a.state === "archivado" : true))
    .filter((a) => (categoria ? a.category === categoria : true))
    .filter((a) => (anio ? a.publishedAt.startsWith(anio) : true))
    .filter((a) => tokens.every((t) => normalize(`${a.title} ${a.body} ${a.category}`).includes(t)))
    .sort((a, b) => (estado === "vigentes" ? Number(b.pinned) - Number(a.pinned) : 0));

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const media = new Map((await db.media.all()).map((m) => [m.id, m]));

  const href = (p: number, over: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    const vals = { q, categoria, anio, estado: estado === "vigentes" ? "" : estado, ...over };
    for (const [k, v] of Object.entries(vals)) if (v) params.set(k, v);
    if (p > 1) params.set("pagina", String(p));
    const s = params.toString();
    return s ? `/comunicados?${s}` : "/comunicados";
  };

  const tabs = [
    ["vigentes", "Vigentes"],
    ["archivo", "Archivo"],
    ["todos", "Todos"],
  ] as const;

  return (
    <>
      <PageHeader title="Centro de comunicados" eyebrow="Para apoderados" description="Todos los avisos institucionales en un solo lugar. Los comunicados vencidos pasan automáticamente al archivo." />
      <Section>
        <div role="group" aria-label="Estado del comunicado" className="mb-6 inline-flex rounded-2xl border border-line bg-white p-1">
          {tabs.map(([id, label]) => (
            <Link key={id} href={href(1, { estado: id === "vigentes" ? "" : id })} aria-current={estado === id ? "page" : undefined} className={`flex min-h-11 items-center rounded-xl px-5 font-bold ${estado === id ? "bg-ink text-white" : "text-ink"}`}>{label}</Link>
          ))}
        </div>

        <form method="get" action="/comunicados" role="search" aria-label="Buscar comunicados" className="card mb-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-[2fr_1.3fr_1fr_auto] lg:items-end">
          {estado !== "vigentes" && <input type="hidden" name="estado" value={estado} />}
          <div>
            <label htmlFor="q" className="label">Buscar</label>
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Ej.: reunión, uniforme, vacaciones" className="field" />
          </div>
          <div>
            <label htmlFor="categoria" className="label">Categoría</label>
            <select id="categoria" name="categoria" defaultValue={categoria} className="field">
              <option value="">Todas</option>
              {ANNOUNCEMENT_CATEGORIES.map((c) => (
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
            {(q || categoria || anio) && <Link href={href(1, { q: "", categoria: "", anio: "" })} className="btn btn-outline">Limpiar</Link>}
          </div>
        </form>

        {visible.length ? (
          <div className="space-y-5">
            {visible.map((a) => {
              const atts = a.attachments.map((x) => ({ x, m: media.get(x.mediaId) })).filter((v) => v.m);
              return (
                <div key={a.id}>
                  <AnnouncementCard item={a} state={a.state} />
                  <details className="-mt-3 rounded-b-2xl border border-t-0 border-line bg-white px-5 py-3">
                    <summary className="flex min-h-11 cursor-pointer items-center font-bold text-brand">Leer el comunicado completo</summary>
                    <div className="prose-escuela mt-3" dangerouslySetInnerHTML={{ __html: renderMarkdown(a.body) }} />
                    {atts.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {atts.map(({ x, m }) => (
                          <li key={x.mediaId}>
                            <a href={`/media/${x.mediaId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-brand underline underline-offset-4">
                              <Icon name="file" size={18} /> {x.title} <span className="font-normal text-muted">(PDF · {formatBytes(m!.size)})</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-3 text-sm text-muted">Publicado el {formatDate(a.publishedAt, "long")}.</p>
                  </details>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title={estado === "vigentes" ? "No hay comunicados vigentes" : "No hay comunicados para mostrar"} icon="megaphone">
            {estado === "vigentes" ? "Cuando el establecimiento publique un aviso, lo verás aquí. Los anteriores están en el archivo." : "Prueba con otros filtros."}
          </EmptyState>
        )}
        <Pagination page={current} pages={pages} hrefFor={(p) => href(p)} />
      </Section>
    </>
  );
}
