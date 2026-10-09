/** Fechas y horas siempre en horario de Chile continental (America/Santiago). */
export const TZ = "America/Santiago";

const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

/** Fecha de hoy en Chile, formato YYYY-MM-DD. */
export function todayCL(): string {
  return ymd.format(new Date());
}

/** Convierte un instante ISO o una fecha YYYY-MM-DD en fecha de Chile (YYYY-MM-DD). */
export function toDateCL(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : ymd.format(d);
}

function asDate(value: string): Date {
  // Mediodía UTC evita desfases por zona horaria al formatear fechas sin hora.
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00Z`) : new Date(value);
}

export function formatDate(value: string, style: "short" | "long" | "full" | "monthYear" = "long"): string {
  if (!value) return "";
  const d = asDate(value);
  if (Number.isNaN(d.getTime())) return "";
  const opts: Intl.DateTimeFormatOptions =
    style === "short"
      ? { day: "numeric", month: "short", year: "numeric" }
      : style === "long"
        ? { day: "numeric", month: "long", year: "numeric" }
        : style === "full"
          ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
          : { month: "long", year: "numeric" };
  return new Intl.DateTimeFormat("es-CL", { timeZone: TZ, ...opts }).format(d);
}

export function monthShort(value: string): string {
  return new Intl.DateTimeFormat("es-CL", { timeZone: TZ, month: "short" }).format(asDate(value)).replace(".", "").toUpperCase();
}

export function dayNumber(value: string): string {
  return new Intl.DateTimeFormat("es-CL", { timeZone: TZ, day: "numeric" }).format(asDate(value));
}

export function formatTimeRange(start?: string, end?: string): string {
  if (!start) return "";
  return end ? `${start} a ${end} h` : `${start} h`;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Parte "YYYY-MM" válida o la del mes actual. */
export function parseMonth(value: string | undefined): string {
  if (value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value;
  return todayCL().slice(0, 7);
}

export function shiftMonth(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function isValidDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
