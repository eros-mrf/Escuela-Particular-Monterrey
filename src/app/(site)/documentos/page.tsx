import type { Metadata } from "next";
import Link from "next/link";
import { DocumentCard } from "@/components/content/cards";
import { EmptyState, Notice, PageHeader, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { publicDocuments } from "@/lib/content";
import { normalize, pick } from "@/lib/utils";
import { REGULATIONS } from "@/content/pei";

export const metadata: Metadata = {
  title: "Documentos institucionales",
  description: "Proyecto Educativo, reglamentos, protocolos, circulares y otros documentos públicos de la Escuela Particular Monterrey.",
  alternates: { canonical: "/documentos" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function DocumentosPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (pick(sp.q) ?? "").trim().slice(0, 80);
  const categoria = pick(sp.categoria) ?? "";
  const all = await publicDocuments();
  const tokens = normalize(q).split(/\s+/).filter(Boolean);
  const filtered = all.filter((d) => {
    if (categoria && d.category !== categoria) return false;
    return tokens.every((t) => normalize(`${d.title} ${d.description} ${d.category}`).includes(t));
  });
  const counts = new Map<string, number>();
  for (const d of all) counts.set(d.category, (counts.get(d.category) ?? 0) + 1);

  return (
    <>
      <PageHeader title="Documentos institucionales" eyebrow="Centro documental" description="Documentos públicos de la escuela, disponibles para visualizar o descargar." />
      <Section>
        <form method="get" action="/documentos" role="search" aria-label="Buscar documentos" className="card mb-8 grid gap-4 p-5 md:grid-cols-[2fr_1.5fr_auto] md:items-end">
          <div>
            <label htmlFor="q" className="label">Buscar documento</label>
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Ej.: reglamento, protocolo, PEI" className="field" />
          </div>
          <div>
            <label htmlFor="categoria" className="label">Categoría</label>
            <select id="categoria" name="categoria" defaultValue={categoria} className="field">
              <option value="">Todas las categorías</option>
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}{counts.get(c) ? ` (${counts.get(c)})` : ""}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary"><Icon name="search" size={18} /> Buscar</button>
            {(q || categoria) && <Link href="/documentos" className="btn btn-outline">Limpiar</Link>}
          </div>
        </form>

        <div className="grid gap-8 lg:grid-cols-[1fr_17rem]">
          <div>
            <p role="status" className="mb-4 text-muted">{filtered.length} {filtered.length === 1 ? "documento" : "documentos"}{q || categoria ? " encontrados" : " disponibles"}.</p>
            {filtered.length ? (
              <div className="space-y-4">
                {filtered.map((d) => (
                  <DocumentCard key={d.id} doc={d} />
                ))}
              </div>
            ) : (
              <EmptyState title="No encontramos documentos" icon="file">Prueba con otras palabras o elige «Todas las categorías».</EmptyState>
            )}
          </div>
          <aside className="space-y-5">
            <nav aria-label="Categorías de documentos" className="card p-5">
              <h2 className="font-display text-lg font-bold">Categorías</h2>
              <ul className="mt-3 space-y-1 text-[0.95rem]">
                {DOCUMENT_CATEGORIES.map((c) => (
                  <li key={c}>
                    <Link href={`/documentos?categoria=${encodeURIComponent(c)}`} aria-current={categoria === c ? "true" : undefined} className={`flex items-start justify-between gap-2 rounded-xl px-3 py-2 hover:bg-sky ${categoria === c ? "bg-sky font-bold text-brand" : ""}`}>
                      <span>{c}</span>
                      <span className="shrink-0 text-muted">{counts.get(c) ?? 0}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Notice tone="info" title="Documentos en preparación">
              Según el PEI, la escuela cuenta con: {REGULATIONS.join("; ")}. Se publicarán aquí cuando el establecimiento los autorice para su difusión.
            </Notice>
          </aside>
        </div>
      </Section>
    </>
  );
}
