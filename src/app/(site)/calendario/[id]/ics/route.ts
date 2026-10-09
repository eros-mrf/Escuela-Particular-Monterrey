import { NextResponse } from "next/server";
import { db } from "@/lib/db/store";
import { addDays } from "@/lib/time";
import { SCHOOL } from "@/content/pei";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const compact = (d: string) => d.replace(/-/g, "");
const clock = (t: string) => `${t.replace(":", "")}00`;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ev = await db.events.find(id);
  if (!ev) return new NextResponse("No encontrado", { status: 404 });

  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//${SCHOOL.name}//Calendario escolar//ES`, "CALSCALE:GREGORIAN", "BEGIN:VEVENT", `UID:${ev.id}@monterrey`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "")}`];
  if (ev.startTime) {
    const endDate = ev.endDate ?? ev.date;
    lines.push(`DTSTART;TZID=America/Santiago:${compact(ev.date)}T${clock(ev.startTime)}`);
    lines.push(`DTEND;TZID=America/Santiago:${compact(endDate)}T${clock(ev.endTime ?? ev.startTime)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${compact(ev.date)}`);
    lines.push(`DTEND;VALUE=DATE:${compact(addDays(ev.endDate ?? ev.date, 1))}`);
  }
  lines.push(`SUMMARY:${esc(ev.title)}`);
  if (ev.description) lines.push(`DESCRIPTION:${esc(ev.description)}`);
  if (ev.location) lines.push(`LOCATION:${esc(ev.location)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="actividad-${ev.date}.ics"`,
    },
  });
}
