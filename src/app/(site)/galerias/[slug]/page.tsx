import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryViewer } from "@/components/content/GalleryViewer";
import { Badge, Breadcrumbs, DemoBadge, Notice, Section } from "@/components/ui/common";
import { getText, publicGalleries } from "@/lib/content";
import { formatDate } from "@/lib/time";
import { truncate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const g = (await publicGalleries()).find((x) => x.slug === slug);
  if (!g) return { title: "Galería no encontrada" };
  return {
    title: g.title,
    description: truncate(g.description || `Fotografías: ${g.title}`, 160),
    alternates: { canonical: `/galerias/${g.slug}` },
    openGraph: { images: [{ url: `/media/${g.images[0].mediaId}` }] },
  };
}

export default async function GaleriaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const g = (await publicGalleries()).find((x) => x.slug === slug);
  if (!g) notFound();
  const policy = await getText("images_policy");
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs items={[{ label: "Galerías", href: "/galerias" }, { label: truncate(g.title, 40) }]} />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge tone="sun">{g.category}</Badge>
            <time dateTime={g.date} className="text-white/85">{formatDate(g.date, "long")}</time>
            {g.demo && <DemoBadge />}
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight !text-white sm:text-5xl">{g.title}</h1>
          {g.description && <p className="mt-4 max-w-3xl text-lg text-white/85">{g.description}</p>}
        </div>
      </section>
      <Section>
        <GalleryViewer images={g.images.map((i, n) => ({ src: `/media/${i.mediaId}`, alt: i.alt || `${g.title}, fotografía ${n + 1}`, caption: i.caption }))} />
        <div className="mt-10"><Notice tone="info" title="Privacidad de las imágenes">{policy}</Notice></div>
      </Section>
    </>
  );
}
