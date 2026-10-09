import Link from "next/link";
import { deleteAnnouncement, setAnnouncementStatus } from "@/app/admin/actions/announcements";
import { ActionButton, DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { announcementState } from "@/lib/content";
import { db } from "@/lib/db/store";
import { formatDate } from "@/lib/time";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminComunicadosPage({ searchParams }: { searchParams: SP }) {
  await requireUser("announcements");
  const sp = await searchParams;
  const rows = (await db.announcements.all()).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <>
      <AdminPageHeader title="Comunicados" description="Avisos para apoderados. Al vencer, pasan solos al archivo y dejan de verse como vigentes." actions={<Link href="/admin/comunicados/nueva" className="btn btn-primary">+ Nuevo comunicado</Link>} />
      <Flash code={pick(sp.aviso)} />
      {rows.length === 0 ? (
        <EmptyRow>Aún no hay comunicados.</EmptyRow>
      ) : (
        <ul className="space-y-3">
          {rows.map((a) => {
            const state = a.status === "published" ? announcementState(a) : null;
            return (
              <li key={a.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                    {a.status === "draft" ? <StatusPill status="draft" /> : state === "vigente" ? <StatusPill status="published" label="Vigente" /> : state === "archivado" ? <StatusPill status="off" label="Archivado (vencido)" /> : <StatusPill status="scheduled" />}
                    {a.demo && <StatusPill status="demo" />}
                    <span>{a.category} · {formatDate(a.publishedAt, "short")}{a.expiresAt ? ` → vence ${formatDate(a.expiresAt, "short")}` : ""}</span>
                  </div>
                  <Link href={`/admin/comunicados/${a.id}`} className="font-display text-lg font-bold hover:text-brand">{a.title}</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/comunicados/${a.id}`} className="btn btn-outline btn-sm">Editar</Link>
                  {a.status === "published" ? (
                    <ActionButton action={setAnnouncementStatus.bind(null, a.id, "draft")}>Despublicar</ActionButton>
                  ) : (
                    <ActionButton action={setAnnouncementStatus.bind(null, a.id, "published")} className="btn btn-primary btn-sm">Publicar</ActionButton>
                  )}
                  <DeleteButton action={deleteAnnouncement.bind(null, a.id)} title="¿Eliminar este comunicado?" description={`Se eliminará «${a.title}».`} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
