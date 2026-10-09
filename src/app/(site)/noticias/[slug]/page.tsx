import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/content/cards";
import { ShareButtons } from "@/components/content/ShareButtons";
import { GalleryViewer } from "@/components/content/GalleryViewer";
import { Badge, Breadcrumbs, DemoBadge, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { publicNews } from "@/lib/content";
import { SITE_URL } from "@/lib/env";
import { renderMarkdown } from "@/lib/markdown";
import { db } from "@/lib/db/store";
import { formatDate } from "@/lib/time";
import { formatBytes, truncate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

async function load(slug: string) {
  const all = await publicNews();
  return { all, item: all.find((n) => n.slug === slug) };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await load(slug);
  if (!item) return { title: "Noticia no encontrada" };
  return {
    title: item.title,
    description: truncate(item.summary, 160),
    alternates: { canonical: `/noticias/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: truncate(item.summary, 200),
      publishedTime: item.publishedAt,
      images: item.coverMediaId ? [{ url: `/media/${item.coverMediaId}`, alt: item.coverAlt || item.title }] : [{ url: "/logo.png" }],
    },
  };
}

export default async function NoticiaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const { all, item } = await load(slug);
  if (!item) notFound();

  const html = renderMarkdown(item.body);
  const related = all.filter((n) => n.id !== item.id && n.category === item.category).slice(0, 3);
  const fallback = related.length < 3 ? all.filter((n) => n.id !== item.id && !related.includes(n)).slice(0, 3 - related.length) : [];
  const attachments = (
    await Promise.all(item.attachments.map(async (a) => ({ a, m: await db.media.find(a.mediaId) })))
  ).filter((x) => x.m);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    description: item.summary,
    image: item.coverMediaId ? [`${SITE_URL}/media/${item.coverMediaId}`] : undefined,
    author: item.author ? { "@type": "Person", name: item.author } : { "@type": "Organization", name: "Escuela Particular Monterrey" },
    publisher: { "@type": "Organization", name: "Escuela Particular Monterrey", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article>
        <header className="bg-ink text-white">
          <div className="container-page py-10 sm:py-14">
            <Breadcrumbs items={[{ label: "Noticias", href: "/noticias" }, { label: truncate(item.title, 50) }]} />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge tone="sun">{item.category}</Badge>
              <time dateTime={item.publishedAt} className="text-white/85">{formatDate(item.publishedAt, "full")}</time>
              {item.demo && <DemoBadge />}
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight !text-white sm:text-5xl">{item.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-white/85 sm:text-xl">{item.summary}</p>
            {item.author && <p className="mt-4 text-white/80">Por <strong className="text-white">{item.author}</strong></p>}
          </div>
        </header>

        <div className="container-page py-10 sm:py-14">
          {item.coverMediaId && (
            <figure className="mx-auto mb-10 max-w-5xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/${item.coverMediaId}`} alt={item.coverAlt || ""} width={1200} height={750} decoding="async" fetchPriority="high" className="w-full rounded-[1.75rem] object-cover shadow-card" />
            </figure>
          )}

          <div className="mx-auto max-w-3xl">
            <div className="prose-escuela" dangerouslySetInnerHTML={{ __html: html }} />

            {attachments.length > 0 && (
              <section className="mt-10" aria-label="Documentos adjuntos">
                <h2 className="font-display text-xl font-bold">Documentos adjuntos</h2>
                <ul className="mt-3 space-y-2">
                  {attachments.map(({ a, m }) => (
                    <li key={a.mediaId}>
                      <a href={`/media/${a.mediaId}`} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-4 font-semibold hover:border-brand">
                        <Icon name="file" size={22} className="text-brand" />
                        <span className="flex-1">{a.title}</span>
                        <span className="text-sm font-normal text-muted">PDF · {formatBytes(m!.size)}</span>
                        <Icon name="download" size={18} className="text-brand" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-10 border-t border-line pt-6">
              <ShareButtons url={`${SITE_URL}/noticias/${item.slug}`} title={item.title} />
            </div>
          </div>

          {item.gallery.length > 0 && (
            <section className="mt-14" aria-label="Galería de fotografías de la noticia">
              <h2 className="mb-5 font-display text-2xl font-extrabold">Fotografías</h2>
              <GalleryViewer images={item.gallery.map((g) => ({ src: `/media/${g.mediaId}`, alt: g.alt || item.title, caption: g.caption }))} />
            </section>
          )}
        </div>
      </article>

      {(related.length > 0 || fallback.length > 0) && (
        <Section tone="paper" label="Noticias relacionadas">
          <SectionTitle title={related.length ? "Noticias relacionadas" : "Más noticias"} action={<Link href="/noticias" className="btn btn-outline btn-sm">Ver todas</Link>} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...related, ...fallback].map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
