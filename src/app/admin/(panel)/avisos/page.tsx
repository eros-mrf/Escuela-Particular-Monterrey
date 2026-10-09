import Link from "next/link";
import { deleteAlert } from "@/app/admin/actions/announcements";
import { DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { alertIsLive } from "@/lib/content";
import { db } from "@/lib/db/store";
import { formatDate } from "@/lib/time";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminAvisosPage({ searchParams }: { searchParams: SP }) {
  await requireUser("alerts");
  const sp = await searchParams;
  const rows = (await db.alerts.all()).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  return (
    <>
      <AdminPageHeader title="Avisos prioritarios" description="Mensajes breves que se muestran en la parte superior de todo el sitio, con fecha de expiración obligatoria." actions={<Link href="/admin/avisos/nueva" className="btn btn-primary">+ Nuevo aviso</Link>} />
      <Flash code={pick(sp.aviso)} />
      {rows.length === 0 ? (
        <EmptyRow>No hay avisos. Crea uno para destacar información urgente en el sitio.</EmptyRow>
      ) : (
        <ul className="space-y-3">
          {rows.map((a) => (
            <li key={a.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                  {alertIsLive(a) ? <StatusPill status="published" label="Visible ahora" /> : <StatusPill status="off" label={a.active ? "Fuera de fechas" : "Desactivado"} />}
                  <span className="capitalize">{a.level}</span>
                  <span>· {formatDate(a.startsAt, "short")} → {formatDate(a.expiresAt, "short")}</span>
                  {a.demo && <StatusPill status="demo" />}
                </div>
                <Link href={`/admin/avisos/${a.id}`} className="font-semibold hover:text-brand">{a.message}</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/avisos/${a.id}`} className="btn btn-outline btn-sm">Editar</Link>
                <DeleteButton action={deleteAlert.bind(null, a.id)} title="¿Eliminar este aviso?" description="El aviso dejará de mostrarse en el sitio." />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
