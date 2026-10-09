import Link from "next/link";
import { deleteFaq } from "@/app/admin/actions/site";
import { DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { pick, truncate } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminPreguntasPage({ searchParams }: { searchParams: SP }) {
  await requireUser("faqs");
  const sp = await searchParams;
  const rows = (await db.faqs.all()).sort((a, b) => a.group.localeCompare(b.group) || a.order - b.order);
  return (
    <>
      <AdminPageHeader title="Preguntas frecuentes" description="Respuestas a las consultas habituales de los apoderados." actions={<Link href="/admin/preguntas/nueva" className="btn btn-primary">+ Nueva pregunta</Link>} />
      <Flash code={pick(sp.aviso)} />
      {rows.length === 0 ? (
        <EmptyRow>No hay preguntas.</EmptyRow>
      ) : (
        <ul className="space-y-3">
          {rows.map((f) => (
            <li key={f.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <StatusPill status={f.published ? "published" : "draft"} label={f.published ? "Visible" : "Oculta"} />
                  <span>{f.group} · orden {f.order}</span>
                </div>
                <Link href={`/admin/preguntas/${f.id}`} className="font-display text-lg font-bold hover:text-brand">{f.question}</Link>
                <p className="text-muted">{truncate(f.answer, 120)}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/preguntas/${f.id}`} className="btn btn-outline btn-sm">Editar</Link>
                <DeleteButton action={deleteFaq.bind(null, f.id)} title="¿Eliminar esta pregunta?" description={`Se eliminará «${f.question}».`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
