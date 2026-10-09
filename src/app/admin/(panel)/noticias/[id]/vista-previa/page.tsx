import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/common";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/time";

export default async function VistaPreviaNoticia({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("news");
  const { id } = await params;
  const n = await db.news.find(id);
  if (!n) notFound();
  return (
    <>
      <div role="note" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f0d982] bg-sun-tint p-4 font-semibold text-[#4a3600]">
        <span>Vista previa — {n.status === "published" ? "esta noticia ya está publicada" : "aún no es visible para el público"}.</span>
        <Link href={`/admin/noticias/${n.id}`} className="btn btn-outline btn-sm">← Volver al editor</Link>
      </div>
      <article className="card mx-auto max-w-4xl overflow-hidden">
        {n.coverMediaId && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/media/${n.coverMediaId}`} alt={n.coverAlt || ""} className="max-h-96 w-full object-cover" />
        )}
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{n.category}</Badge>
            <time dateTime={n.publishedAt} className="text-muted">{formatDate(n.publishedAt, "full")}</time>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{n.title}</h1>
          <p className="mt-3 text-xl text-muted">{n.summary}</p>
          {n.author && <p className="mt-3 text-muted">Por <strong className="text-ink">{n.author}</strong></p>}
          <div className="prose-escuela mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(n.body) }} />
          {n.gallery.length > 0 && (
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {n.gallery.map((g) => (
                <li key={g.mediaId}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/${g.mediaId}`} alt={g.alt} className="aspect-[4/3] w-full rounded-xl object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </>
  );
}
