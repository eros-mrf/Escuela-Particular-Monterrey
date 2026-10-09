import type { Metadata } from "next";
import Link from "next/link";
import { eventColor, EventRow } from "@/components/content/cards";
import { MonthGrid } from "@/components/content/Calendar";
import { EmptyState, PageHeader, Section } from "@/components/ui/common";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { allEvents } from "@/lib/content";
import { formatDate, parseMonth, isValidDate, todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Calendario escolar",
  description: "Calendario de actividades, reuniones de apoderados, actos y celebraciones de la Escuela Particular Monterrey. Horario de Chile.",
  alternates: { canonical: "/calendario" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function CalendarioPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const ym = parseMonth(pick(sp.mes));
  const vista = pick(sp.vista) === "lista" ? "lista" : "mes";
  const cat = EVENT_CATEGORIES.find((c) => c.id === pick(sp.categoria))?.id ?? "";
  const dayParam = pick(sp.dia);
  const day = isValidDate(dayParam) && dayParam.startsWith(ym) ? dayParam : "";
  const today = todayCL();

  const everything = await allEvents();
  const events = cat ? everything.filter((e) => e.category === cat) : everything;

  const href = (t: { month?: string; day?: string; vista?: string; categoria?: string | null } = {}) => {
    const p = new URLSearchParams();
    const m = t.month ?? ym;
    if (m !== today.slice(0, 7)) p.set("mes", m);
    const v = t.vista ?? vista;
    if (v === "lista") p.set("vista", "lista");
    const c = t.categoria === undefined ? cat : t.categoria;
    if (c) p.set("categoria", c);
    if (t.day) p.set("dia", t.day);
    const s = p.toString();
    return s ? `/calendario?${s}` : "/calendario";
  };

  const monthEvents = events.filter((e) => e.date.startsWith(ym) || (e.endDate ?? e.date).startsWith(ym));
  const dayEvents = day ? events.filter((e) => e.date <= day && (e.endDate ?? e.date) >= day) : [];
  const upcoming = events.filter((e) => (e.endDate ?? e.date) >= today);
  const byMonth = new Map<string, typeof upcoming>();
  for (const e of upcoming) byMonth.set(e.date.slice(0, 7), [...(byMonth.get(e.date.slice(0, 7)) ?? []), e]);

  return (
    <>
      <PageHeader title="Calendario escolar" eyebrow="Agenda institucional" description="Actividades pedagógicas, reuniones, actos y celebraciones. Todas las horas corresponden al horario de Chile." />
      <Section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Tipo de vista" className="inline-flex rounded-2xl border border-line bg-white p-1">
            <Link href={href({ vista: "mes" })} aria-current={vista === "mes" ? "page" : undefined} className={`flex min-h-11 items-center rounded-xl px-5 font-bold ${vista === "mes" ? "bg-ink text-white" : "text-ink"}`}>Vista mensual</Link>
            <Link href={href({ vista: "lista" })} aria-current={vista === "lista" ? "page" : undefined} className={`flex min-h-11 items-center rounded-xl px-5 font-bold ${vista === "lista" ? "bg-ink text-white" : "text-ink"}`}>Próximas actividades</Link>
          </div>
          <p className="text-sm text-muted">Hoy es {formatDate(today, "full")}.</p>
        </div>

        <nav aria-label="Filtrar por tipo de actividad" className="mb-8">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href={href({ categoria: null })} aria-current={!cat ? "true" : undefined} className={`flex min-h-11 items-center rounded-full border-2 px-4 font-semibold ${!cat ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"}`}>Todas</Link>
            </li>
            {EVENT_CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={href({ categoria: c.id })}
                  aria-current={cat === c.id ? "true" : undefined}
                  className={`flex min-h-11 items-center gap-2 rounded-full border-2 px-4 font-semibold ${cat === c.id ? "bg-white text-ink" : "border-line bg-white text-ink hover:border-ink"}`}
                  style={cat === c.id ? { borderColor: c.color } : undefined}
                >
                  <span aria-hidden="true" className="size-3 rounded-full" style={{ background: c.color }} />
                  {c.id}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {vista === "mes" ? (
          <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
            <MonthGrid ym={ym} events={events} selected={day} hrefFor={(t) => href({ month: t.month, day: t.day })} />
            <div>
              <h2 className="mb-4 font-display text-2xl font-extrabold">
                {day ? formatDate(day, "full") : `Actividades de ${formatDate(`${ym}-01`, "monthYear")}`}
              </h2>
              {(day ? dayEvents : monthEvents).length ? (
                <div className="space-y-3">
                  {(day ? dayEvents : monthEvents).map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </div>
              ) : (
                <EmptyState title={day ? "Sin actividades este día" : "Sin actividades este mes"} icon="calendar">
                  {cat ? "Prueba quitando el filtro de tipo de actividad." : "Cuando el establecimiento agende actividades, aparecerán aquí."}
                </EmptyState>
              )}
              {day && <Link href={href({ month: ym })} className="mt-4 inline-block font-bold text-brand underline underline-offset-4">Ver todo el mes</Link>}
            </div>
          </div>
        ) : upcoming.length ? (
          <div className="space-y-10">
            {[...byMonth.entries()].map(([m, list]) => (
              <section key={m} aria-label={formatDate(`${m}-01`, "monthYear")}>
                <h2 className="mb-4 font-display text-2xl font-extrabold first-letter:uppercase">{formatDate(`${m}-01`, "monthYear")}</h2>
                <div className="grid gap-3 lg:grid-cols-2">
                  {list.map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState title="No hay actividades próximas" icon="calendar">
            Cuando el establecimiento agende actividades, reuniones o actos escolares, las verás aquí.
          </EmptyState>
        )}

        <section aria-label="Leyenda de categorías" className="mt-12 rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-lg font-bold">Tipos de actividad</h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
            {EVENT_CATEGORIES.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-3.5 rounded-full" style={{ background: eventColor(c.id) }} />
                {c.id}
              </li>
            ))}
          </ul>
        </section>
      </Section>
    </>
  );
}
