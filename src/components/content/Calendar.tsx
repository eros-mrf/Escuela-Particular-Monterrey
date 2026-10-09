import Link from "next/link";
import { eventColor } from "@/components/content/cards";
import { Icon } from "@/components/ui/Icon";
import { addDays, formatDate, shiftMonth, todayCL } from "@/lib/time";
import type { EventItem } from "@/lib/db/types";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/** Celdas (con relleno) del mes `ym` (YYYY-MM), semana desde el lunes. */
function monthCells(ym: string): (string | null)[] {
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${ym}-${String(d).padStart(2, "0")}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function eventsOn(events: EventItem[], date: string): EventItem[] {
  return events.filter((e) => e.date <= date && (e.endDate ?? e.date) >= date);
}

export function MonthGrid({ ym, events, hrefFor, selected }: { ym: string; events: EventItem[]; hrefFor: (target: { month?: string; day?: string }) => string; selected?: string }) {
  const cells = monthCells(ym);
  const today = todayCL();
  const label = formatDate(`${ym}-01`, "monthYear");
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-sky px-3 py-3 sm:px-5">
        <Link href={hrefFor({ month: shiftMonth(ym, -1) })} className="btn btn-outline btn-sm" aria-label="Mes anterior" scroll={false}>
          <Icon name="left" size={18} />
        </Link>
        <h2 className="text-center font-display text-xl font-extrabold first-letter:uppercase sm:text-2xl" aria-live="polite">{label}</h2>
        <Link href={hrefFor({ month: shiftMonth(ym, 1) })} className="btn btn-outline btn-sm" aria-label="Mes siguiente" scroll={false}>
          <Icon name="right" size={18} />
        </Link>
      </div>
      <table className="w-full table-fixed border-collapse" aria-label={`Calendario de ${label}`}>
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th key={d} scope="col" className="border-b border-line py-2 text-xs font-bold uppercase tracking-wide text-muted sm:text-sm">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, w) => (
            <tr key={w}>
              {cells.slice(w * 7, w * 7 + 7).map((date, i) => {
                if (!date) return <td key={i} className="h-14 border-b border-r border-line bg-paper/60 last:border-r-0 sm:h-28" />;
                const evs = eventsOn(events, date);
                const isToday = date === today;
                const isSel = selected === date;
                return (
                  <td key={date} className={`h-14 border-b border-r border-line p-0 align-top last:border-r-0 sm:h-28 ${isSel ? "bg-sun-tint" : ""}`}>
                    <Link
                      href={hrefFor({ day: date })}
                      scroll={false}
                      aria-label={`${formatDate(date, "full")}${evs.length ? `: ${evs.length} ${evs.length === 1 ? "actividad" : "actividades"}` : ""}`}
                      aria-current={isToday ? "date" : undefined}
                      className="flex size-full flex-col gap-1 p-1 hover:bg-sky sm:p-1.5"
                    >
                      <span className={`flex size-7 items-center justify-center rounded-full text-sm font-bold ${isToday ? "bg-ink text-white" : "text-ink"}`}>{Number(date.slice(8))}</span>
                      {/* Móvil: puntos; escritorio: etiquetas con nombre */}
                      <span className="flex flex-wrap gap-0.5 sm:hidden">
                        {evs.slice(0, 3).map((e) => (
                          <span key={e.id} aria-hidden="true" className="size-2 rounded-full" style={{ background: eventColor(e.category) }} />
                        ))}
                      </span>
                      <span className="hidden flex-col gap-0.5 sm:flex">
                        {evs.slice(0, 2).map((e) => (
                          <span key={e.id} className="truncate rounded-md px-1.5 py-0.5 text-xs font-semibold text-white" style={{ background: eventColor(e.category) }}>{e.title}</span>
                        ))}
                        {evs.length > 2 && <span className="text-xs font-semibold text-muted">+{evs.length - 2} más</span>}
                      </span>
                    </Link>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { addDays };
