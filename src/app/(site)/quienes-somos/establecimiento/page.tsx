import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { FACILITIES } from "@/content/pei";
import { publicGalleries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nuestro establecimiento",
  description: "Espacios educativos y recursos de la Escuela Particular Monterrey: aulas, biblioteca CRA, laboratorio de informática y áreas comunes.",
  alternates: { canonical: "/quienes-somos/establecimiento" },
};

export default async function EstablecimientoPage() {
  const galleries = (await publicGalleries()).filter((g) => g.category === "Instalaciones");
  return (
    <>
      <PageHeader title="Nuestro establecimiento" eyebrow="Espacios para aprender" crumbs={[{ label: "Quiénes somos", href: "/quienes-somos" }]} description="Los espacios educativos con que cuenta la escuela, según el Proyecto Educativo Institucional." />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {FACILITIES.map((g) => (
            <section key={g.group} className="card p-7" aria-label={g.group}>
              <h2 className="font-display text-xl font-bold text-brand">{g.group}</h2>
              <ul className="mt-4 divide-y divide-line">
                {g.items.map((i) => (
                  <li key={i.name} className="flex items-center justify-between gap-4 py-2.5">
                    <span>{i.name}</span>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky font-bold text-brand" aria-label={`${i.qty} ${i.qty === 1 ? "unidad" : "unidades"}`}>{i.qty}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-8">
          <Notice tone="warn" title="Datos del PEI 2019">
            Los espacios y su cantidad corresponden al PEI (antecedentes del establecimiento 2019), donde se declaran en buen estado. La dirección puede actualizar esta información y sumar fotografías de las instalaciones.
          </Notice>
        </div>
      </Section>

      <Section tone="paper">
        <SectionTitle eyebrow="Fotografías" title="Conoce nuestras instalaciones" />
        {galleries.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((g) => (
              <li key={g.id}>
                <Link href={`/galerias/${g.slug}`} className="card lift block overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/${g.images[0].mediaId}`} alt={g.images[0].alt || g.title} loading="lazy" decoding="async" width={800} height={600} className="aspect-[4/3] w-full object-cover" />
                  <span className="block p-5 font-display text-lg font-bold">{g.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#b9b39b] bg-white/60 p-10 text-center text-muted">
            <Icon name="image" size={30} className="mx-auto mb-3 text-brand/60" />
            Las fotografías de las instalaciones se publicarán cuando el establecimiento las incorpore.
          </div>
        )}
      </Section>
    </>
  );
}
