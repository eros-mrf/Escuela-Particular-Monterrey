import Link from "next/link";
import { deleteTeamMember } from "@/app/admin/actions/site";
import { DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminEquipoPage({ searchParams }: { searchParams: SP }) {
  await requireUser("team");
  const sp = await searchParams;
  const rows = (await db.team.all()).sort((a, b) => a.order - b.order);
  return (
    <>
      <AdminPageHeader title="Equipo directivo" description="Fichas con fotografía, nombre y cargo. Solo agrega personas que la dirección haya autorizado a mostrar." actions={<Link href="/admin/equipo/nueva" className="btn btn-primary">+ Nueva ficha</Link>} />
      <Flash code={pick(sp.aviso)} />
      {rows.length === 0 ? (
        <EmptyRow>No hay fichas. Agrega a las personas del equipo directivo.</EmptyRow>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rows.map((m) => (
            <li key={m.id} className="card flex flex-wrap items-center gap-4 p-4">
              {m.photoMediaId ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/media/${m.photoMediaId}`} alt="" className="size-16 rounded-full object-cover" />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-full bg-sky font-display text-xl font-extrabold text-brand">{m.name.split(" ").slice(0, 2).map((p) => p[0]).join("")}</span>
              )}
              <div className="min-w-0 flex-1">
                <StatusPill status={m.published ? "published" : "draft"} label={m.published ? "Visible" : "Oculto"} />
                <p className="mt-1 font-display text-lg font-bold leading-snug">{m.name}</p>
                <p className="text-muted">{m.role}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/equipo/${m.id}`} className="btn btn-outline btn-sm">Editar</Link>
                <DeleteButton action={deleteTeamMember.bind(null, m.id)} title="¿Eliminar esta ficha?" description={`Se eliminará la ficha de ${m.name}.`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
