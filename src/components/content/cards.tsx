import Link from "next/link";
import { Badge, DemoBadge, ImagePlaceholder } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { documentHref, type Vigencia } from "@/lib/content";
import { dayNumber, formatDate, formatTimeRange, monthShort } from "@/lib/time";
import type { Announcement, DocumentItem, EventItem, GalleryItem, NewsItem } from "@/lib/db/types";
import { formatBytes, truncate } from "@/lib/utils";
import { stripMarkdown } from "@/lib/markdown";

export function eventColor(category: string): string {
  return EVENT_CATEGORIES.find((c) => c.id === category)?.color ?? "#14509f";
}

export function NewsCard({ item, priority = false, featured = false }: { item: NewsItem; priority?: boolean; featured?: boolean }) {
  return (
    <article className={`card lift group flex h-full flex-col overflow-hidden ${featured ? "md:flex-row" : ""}`}>
      <Link href={`/noticias/${item.slug}`} className={`block overflow-hidden ${featured ? "md:w-1/2" : ""}`} tabIndex={-1} aria-hidden="true">
        {item.coverMediaId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/media/${item.coverMediaId}`}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            width={800}
            height={500}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${featured ? "aspect-[16/10] md:h-full" : "aspect-[16/10]"}`}
          />
        ) : (
          <ImagePlaceholder className={`w-full ${featured ? "aspect-[16/10] md:h-full" : "aspect-[16/10]"}`} />
        )}
      </Link>
      <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "md:w-1/2 md:justify-center md:p-8" : ""}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <Badge>{item.category}</Badge>
          <time dateTime={item.publishedAt} className="text-muted">{formatDate(item.publishedAt, "long")}</time>
          {item.demo && <DemoBadge />}
        </div>
        <h3 className={`font-display font-bold leading-snug ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
          <Link href={`/noticias/${item.slug}`} className="hover:text-brand">{item.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-muted">{truncate(item.summary, featured ? 220 : 130)}</p>
        <Link href={`/noticias/${item.slug}`} className="mt-4 inline-flex items-center gap-2 font-bold text-brand hover:text-brand-dark" aria-label={`Leer noticia: ${item.title}`}>
          Leer noticia <Icon name="arrow" size={17} />
        </Link>
      </div>
    </article>
  );
}

export function DateTile({ date, color = "#14509f" }: { date: string; color?: string }) {
  return (
    <div className="flex w-[4.5rem] shrink-0 flex-col items-center rounded-2xl px-2 py-2.5 text-white" style={{ background: color }}>
      <span className="text-xs font-bold tracking-widest text-sun">{monthShort(date)}</span>
      <span className="font-display text-3xl font-extrabold leading-none">{dayNumber(date)}</span>
    </div>
  );
}

export function EventRow({ event }: { event: EventItem }) {
  const when = formatTimeRange(event.startTime, event.endTime);
  const color = eventColor(event.category);
  return (
    <article className="card lift flex items-center gap-4 p-4">
      <DateTile date={event.date} color={color} />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg font-bold leading-snug">
          <Link href={`/calendario/${event.id}`} className="hover:text-brand">{event.title}</Link>
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] text-muted">
          <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color }}>
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: color }} />
            {event.category}
          </span>
          {when && <span className="inline-flex items-center gap-1"><Icon name="clock" size={14} /> {when}</span>}
          {event.location && <span className="inline-flex items-center gap-1"><Icon name="pin" size={14} /> {event.location}</span>}
          {event.demo && <DemoBadge />}
        </p>
      </div>
    </article>
  );
}

export function VigenciaBadge({ state }: { state: Vigencia }) {
  if (state === "vigente") return <Badge tone="sun">Vigente</Badge>;
  if (state === "archivado") return <Badge tone="outline">Archivado</Badge>;
  return <Badge tone="outline">Programado</Badge>;
}

export function AnnouncementCard({ item, state, dark = false }: { item: Announcement; state: Vigencia; dark?: boolean }) {
  return (
    <article id={item.id} className={`rounded-2xl p-5 ${dark ? "border border-white/20" : "card"}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <VigenciaBadge state={state} />
        <Badge tone={dark ? "outline" : "sky"} className={dark ? "!border-white/40 !text-[#c5d3e8]" : ""}>{item.category}</Badge>
        <time dateTime={item.publishedAt} className={dark ? "text-[#c5d3e8]" : "text-muted"}>{formatDate(item.publishedAt, "long")}</time>
        {item.pinned && <Badge tone="ink" className={dark ? "!bg-white !text-ink" : ""}>Destacado</Badge>}
        {item.demo && <DemoBadge />}
      </div>
      <h3 className={`font-display text-lg font-bold leading-snug ${dark ? "!text-white" : ""}`}>{item.title}</h3>
      <p className={`mt-1 ${dark ? "text-[#c5d3e8]" : "text-muted"}`}>{truncate(stripMarkdown(item.body), 150)}</p>
      {item.expiresAt && (
        <p className={`mt-2 text-sm ${dark ? "text-[#c5d3e8]" : "text-muted"}`}>
          {state === "vigente" ? "Vigente hasta" : "Venció el"} {formatDate(item.expiresAt, "long")}
        </p>
      )}
    </article>
  );
}

export function DocumentCard({ doc }: { doc: DocumentItem }) {
  const href = documentHref(doc);
  const size = formatBytes(doc.sizeBytes);
  return (
    <article className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand">
        <Icon name="file" size={26} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
          <Badge>{doc.category}</Badge>
          {doc.demo && <DemoBadge />}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug">{doc.title}</h3>
        {doc.description && <p className="mt-1 text-muted">{truncate(doc.description, 200)}</p>}
        <p className="mt-2 text-sm text-muted">
          {doc.fileType}
          {size && ` · ${size}`} · Actualizado el {formatDate(doc.updatedAt, "long")}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" aria-label={`Visualizar ${doc.title} (se abre en una pestaña nueva)`}>
          <Icon name="eye" size={17} /> Visualizar
        </a>
        <a href={doc.file.kind === "media" ? `${href}?descargar=1` : href} download className="btn btn-primary btn-sm" aria-label={`Descargar ${doc.title}`}>
          <Icon name="download" size={17} /> Descargar
        </a>
      </div>
    </article>
  );
}

export function GalleryCard({ gallery }: { gallery: GalleryItem }) {
  const cover = gallery.images[0];
  return (
    <article className="card lift group overflow-hidden">
      <Link href={`/galerias/${gallery.slug}`} className="block">
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/media/${cover.mediaId}`}
            alt={cover.alt || gallery.title}
            loading="lazy"
            decoding="async"
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1 text-sm font-bold text-white">
            <Icon name="image" size={15} /> {gallery.images.length}
          </span>
        </div>
        <div className="p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <Badge>{gallery.category}</Badge>
            <time dateTime={gallery.date} className="text-muted">{formatDate(gallery.date, "long")}</time>
            {gallery.demo && <DemoBadge />}
          </div>
          <h3 className="font-display text-xl font-bold leading-snug group-hover:text-brand">{gallery.title}</h3>
        </div>
      </Link>
    </article>
  );
}
