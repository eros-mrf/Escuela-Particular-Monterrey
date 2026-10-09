import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eventColor } from "@/components/content/cards";
import { Breadcrumbs, DemoBadge, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { db } from "@/lib/db/store";
import { renderMarkdown } from "@/lib/markdown";
import { formatBytes, truncate } from "@/lib/utils";
import { formatDate, formatTimeRange } from "@/lib/time";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const ev = await db.events.find(id);
  if (!ev) return { title: "Actividad no encontrada" };
  return { title: ev.title, description: truncate(`${formatDate(ev.date, "full")}. ${ev.description}`, 160), alternates: { canonical: `/calendario/${ev.id}` } };
}

export default async function EventoPage({ params }: { params: Params }) {
  const { id } = await params;
  const ev = await db.events.find(id);
  if (!ev) notFound();
  const color = eventColor(ev.category);
  const when = formatTimeRange(ev.startTime, ev.endTime);
  const atts = (await Promise.all(ev.attachments.map(async (a) => ({ a, m: await db.media.find(a.mediaId) })))).filter((x) => x.m);

  return (
    <>
      <section className="text-white" style={{ background: "#0e1f36" }}>
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs items={[{ label: "Calendario", href: "/calendario" }, { label: truncate(ev.title, 40) }]} />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold" style={{ color }}>
            <span aria-hidden="true" className="size-3 rounded-full" style={{ background: color }} />
            {ev.category}
          </p>
          {ev.demo && <span className="ml-2"><DemoBadge /></span>}
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight !text-white sm:text-5xl">{ev.title}</h1>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {ev.imageMediaId && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/media/${ev.imageMediaId}`} alt={ev.imageAlt || ""} width={1000} height={625} decoding="async" className="mb-8 w-full rounded-3xl object-cover" />
            )}
            {ev.description ? <div className="prose-escuela" dangerouslySetInnerHTML={{ __html: renderMarkdown(ev.description) }} /> : <p className="text-muted">Sin descripción adicional.</p>}
            {atts.length > 0 && (
              <section className="mt-8" aria-label="Documentos adjuntos">
                <h2 className="font-display text-xl font-bold">Documentos adjuntos</h2>
                <ul className="mt-3 space-y-2">
                  {atts.map(({ a, m }) => (
                    <li key={a.mediaId}>
                      <a href={`/media/${a.mediaId}`} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-4 font-semibold hover:border-brand">
                        <Icon name="file" size={22} className="text-brand" />
                        <span className="flex-1">{a.title}</span>
                        <span className="text-sm font-normal text-muted">PDF · {formatBytes(m!.size)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <aside className="card h-fit p-7">
            <h2 className="font-display text-xl font-bold">Detalles</h2>
            <dl className="mt-4 space-y-4">
              <div className="flex gap-3">
                <Icon name="calendar" size={22} className="mt-0.5 shrink-0 text-brand" />
                <div>
                  <dt className="text-sm font-semibold text-muted">Fecha</dt>
                  <dd className="font-semibold">
                    {formatDate(ev.date, "full")}
                    {ev.endDate && ev.endDate !== ev.date && <> al {formatDate(ev.endDate, "full")}</>}
                  </dd>
                </div>
              </div>
              {when && (
                <div className="flex gap-3">
                  <Icon name="clock" size={22} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <dt className="text-sm font-semibold text-muted">Horario (hora de Chile)</dt>
                    <dd className="font-semibold">{when}</dd>
                  </div>
                </div>
              )}
              {ev.location && (
                <div className="flex gap-3">
                  <Icon name="pin" size={22} className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <dt className="text-sm font-semibold text-muted">Lugar</dt>
                    <dd className="font-semibold">{ev.location}</dd>
                  </div>
                </div>
              )}
            </dl>
            <a href={`/calendario/${ev.id}/ics`} className="btn btn-primary btn-sm mt-6 w-full"><Icon name="calendar" size={17} /> Agregar a mi calendario</a>
            <Link href={`/calendario?mes=${ev.date.slice(0, 7)}`} className="btn btn-outline btn-sm mt-2 w-full">Volver al calendario</Link>
          </aside>
        </div>
      </Section>
    </>
  );
}
