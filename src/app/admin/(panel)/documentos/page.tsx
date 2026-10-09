import Link from "next/link";
import { deleteDocument, setDocumentPublished } from "@/app/admin/actions/documents";
import { ActionButton, DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { documentHref } from "@/lib/content";
import { db } from "@/lib/db/store";
import { formatDate } from "@/lib/time";
import { formatBytes, pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminDocumentosPage({ searchParams }: { searchParams: SP }) {
  await requireUser("documents");
  const sp = await searchParams;
  const rows = (await db.documents.all()).sort((a, b) => a.category.localeCompare(b.category) || b.updatedAt.localeCompare(a.updatedAt));
  return (
    <>
      <AdminPageHeader title="Documentos" description="Sube, actualiza y reemplaza documentos PDF. Solo se muestran al público los que estén publicados." actions={<Link href="/admin/documentos/nueva" className="btn btn-primary">+ Subir documento</Link>} />
      <Flash code={pick(sp.aviso)} />
      {rows.length === 0 ? (
        <EmptyRow>Aún no hay documentos.</EmptyRow>
      ) : (
        <ul className="space-y-3">
          {rows.map((d) => (
            <li key={d.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <StatusPill status={d.published ? "published" : "draft"} label={d.published ? "Público" : "Privado"} />
                  {d.demo && <StatusPill status="demo" />}
                  <span>{d.category} · {d.fileType} {formatBytes(d.sizeBytes)} · Actualizado {formatDate(d.updatedAt, "short")}</span>
                </div>
                <Link href={`/admin/documentos/${d.id}`} className="font-display text-lg font-bold hover:text-brand">{d.title}</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={documentHref(d)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Ver PDF ↗</a>
                <Link href={`/admin/documentos/${d.id}`} className="btn btn-outline btn-sm">Editar / reemplazar</Link>
                {d.published && <ActionButton action={setDocumentPublished.bind(null, d.id, false)}>Hacer privado</ActionButton>}
                <DeleteButton action={deleteDocument.bind(null, d.id)} title="¿Eliminar este documento?" description={`Se eliminará «${d.title}» y su archivo.`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
