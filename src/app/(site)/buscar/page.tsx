import type { Metadata } from "next";
import Link from "next/link";
import { Badge, EmptyState, PageHeader, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { searchSite } from "@/lib/search";
import { pick } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Buscar en el sitio",
  robots: { index: false, follow: true },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function BuscarPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (pick(sp.q) ?? "").trim().slice(0, 100);
  const hits = q.length >= 2 ? await searchSite(q) : [];
  return (
    <>
      <PageHeader title="Buscar en el sitio" description="Encuentra noticias, documentos, comunicados, eventos y páginas." />
      <Section>
        <form action="/buscar" method="get" role="search" className="mx-auto mb-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <label htmlFor="q" className="sr-only">Buscar</label>
          <input id="q" name="q" type="search" defaultValue={q} required minLength={2} placeholder="¿Qué estás buscando?" className="field flex-1 !min-h-14 text-lg" />
          <button type="submit" className="btn btn-primary !min-h-14"><Icon name="search" size={20} /> Buscar</button>
        </form>
        <div className="mx-auto max-w-3xl">
          {q.length < 2 ? (
            <p className="text-center text-muted">Escribe al menos dos letras para buscar.</p>
          ) : hits.length === 0 ? (
            <EmptyState title={`Sin resultados para «${q}»`} icon="search">
              Revisa la ortografía o prueba con otras palabras. También puedes explorar el <Link href="/documentos" className="font-bold text-brand underline">centro documental</Link> o las <Link href="/noticias" className="font-bold text-brand underline">noticias</Link>.
            </EmptyState>
          ) : (
            <>
              <p role="status" className="mb-5 text-muted">{hits.length} {hits.length === 1 ? "resultado" : "resultados"} para «{q}»</p>
              <ul className="space-y-3">
                {hits.map((h) => (
                  <li key={h.type + h.href + h.title}>
                    <Link href={h.href} className="card lift block p-5">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-sm">
                        <Badge>{h.type}</Badge>
                        {h.date && <span className="text-muted">{h.date}</span>}
                      </div>
                      <p className="font-display text-lg font-bold text-ink">{h.title}</p>
                      <p className="mt-1 text-muted">{h.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
