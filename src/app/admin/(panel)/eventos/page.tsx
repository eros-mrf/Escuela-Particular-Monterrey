import Link from "next/link";
import { deleteEvent } from "@/app/admin/actions/events";
import { DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { eventColor } from "@/components/content/cards";
import { requireUser } from "@/lib/auth";
import { allEvents } from "@/lib/content";
import { formatDate, formatTimeRange, todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminEventosPage({ searchParams }: { searchParams: SP }) {
  await requireUser("events");
  const sp = await searchParams;
  const today = todayCL();
  const all = await allEvents();
  const upcoming = all.filter((e) => (e.endDate ?? e.date) >= today);
  const past = all.filter((e) => (e.endDate ?? e.date) < today).reverse();

  const Row = ({ e }: { e: (typeof all)[number] }) => (
    <li className="card flex flex-wrap items-center gap-4 p-4">
      <span aria-hidden="true" className="hidden h-12 w-1.5 rounded-full sm:block" style={{ background: eventColor(e.category) }} />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">
          <strong className="text-ink">{formatDate(e.date, "long")}</strong>
          {formatTimeRange(e.startTime, e.endTime) && <span>· {formatTimeRange(e.startTime, e.endTime)}</span>}
          <span>· {e.category}</span>
          {e.demo && <StatusPill status="demo" />}
        </div>
        <Link href={`/admin/eventos/${e.id}`} className="font-display text-lg font-bold hover:text-brand">{e.title}</Link>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/admin/eventos/${e.id}`} className="btn btn-outline btn-sm">Editar</Link>
        <DeleteButton action={deleteEvent.bind(null, e.id)} title="¿Eliminar esta actividad?" description={`Se eliminará «${e.title}» del calendario.`} />
      </div>
    </li>
  );

  return (
    <>
      <AdminPageHeader title="Calendario escolar" description="Actividades, reuniones, actos y celebraciones. Las fechas y horas son de Chile." actions={<Link href="/admin/eventos/nueva" className="btn btn-primary">+ Nuevo evento</Link>} />
      <Flash code={pick(sp.aviso)} />
      <h2 className="mb-3 font-display text-xl font-bold">Próximos ({upcoming.length})</h2>
      {upcoming.length ? <ul className="space-y-3">{upcoming.map((e) => <Row key={e.id} e={e} />)}</ul> : <EmptyRow>No hay actividades próximas. Crea una con «Nuevo evento».</EmptyRow>}
      {past.length > 0 && (
        <details className="mt-10">
          <summary className="min-h-11 cursor-pointer font-display text-xl font-bold">Pasados ({past.length})</summary>
          <ul className="mt-3 space-y-3">{past.map((e) => <Row key={e.id} e={e} />)}</ul>
        </details>
      )}
    </>
  );
}
