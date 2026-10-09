import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryCard } from "@/components/content/cards";
import { EmptyState, Notice, PageHeader, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { getText, publicGalleries } from "@/lib/content";
import { pick } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Galerías de fotografías",
  description: "Fotografías de actividades, actos y celebraciones de la Escuela Particular Monterrey, publicadas con autorización.",
  alternates: { canonical: "/galerias" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function GaleriasPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const categoria = pick(sp.categoria) ?? "";
  const anio = pick(sp.anio) ?? "";
  const all = await publicGalleries();
  const policy = await getText("images_policy");
  const years = [...new Set(all.map((g) => g.date.slice(0, 4)))].sort().reverse();
  const list = all.filter((g) => (!categoria || g.category === categoria) && (!anio || g.date.startsWith(anio)));

  return (
    <>
      <PageHeader title="Galerías de fotografías" eyebrow="Vida escolar" description="Los momentos que viven nuestros estudiantes, organizados por actividad, año y categoría." />
      <Section>
        <form method="get" action="/galerias" aria-label="Filtrar galerías" className="card mb-8 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label htmlFor="categoria" className="label">Categoría</label>
            <select id="categoria" name="categoria" defaultValue={categoria} className="field">
              <option value="">Todas</option>
              {GALLERY_CATEGORIES.map((c) => (
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
            <button type="submit" className="btn btn-primary"><Icon name="search" size={18} /> Filtrar</button>
            {(categoria || anio) && <Link href="/galerias" className="btn btn-outline">Limpiar</Link>}
          </div>
        </form>

        {list.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g, i) => (
              <Reveal as="li" key={g.id} delay={(i % 3) * 90}>
                <GalleryCard gallery={g} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <EmptyState title={all.length ? "No hay galerías con esos filtros" : "Las galerías se publicarán pronto"} icon="image">
            Solo se publican fotografías cuando existe autorización para difundir imágenes de estudiantes.
          </EmptyState>
        )}
        <div className="mt-10"><Notice tone="info" title="Privacidad de las imágenes">{policy}</Notice></div>
      </Section>
    </>
  );
}
