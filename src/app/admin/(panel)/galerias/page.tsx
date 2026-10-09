import Link from "next/link";
import { deleteGallery, setGalleryPublished } from "@/app/admin/actions/galleries";
import { ActionButton, DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { formatDate } from "@/lib/time";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminGaleriasPage({ searchParams }: { searchParams: SP }) {
  await requireUser("galleries");
  const sp = await searchParams;
  const rows = (await db.galleries.all()).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <AdminPageHeader title="Galerías de fotografías" description="Agrupa las fotografías por actividad. Solo publica imágenes de estudiantes con autorización de sus apoderados." actions={<Link href="/admin/galerias/nueva" className="btn btn-primary">+ Nueva galería</Link>} />
      <Flash code={pick(sp.aviso)} />
      {rows.length === 0 ? (
        <EmptyRow>Aún no hay galerías.</EmptyRow>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {rows.map((g) => (
            <li key={g.id} className="card overflow-hidden">
              <div className="flex gap-4 p-4">
                {g.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/media/${g.images[0].mediaId}`} alt="" className="size-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="placeholder-img size-24 shrink-0 rounded-xl" />
                )}
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                    <StatusPill status={g.published ? "published" : "draft"} />
                    {g.demo && <StatusPill status="demo" />}
                    <span>{g.images.length} fotos</span>
                  </div>
                  <Link href={`/admin/galerias/${g.id}`} className="font-display text-lg font-bold leading-snug hover:text-brand">{g.title}</Link>
                  <p className="text-sm text-muted">{g.category} · {formatDate(g.date, "short")}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line p-3">
                <Link href={`/admin/galerias/${g.id}`} className="btn btn-outline btn-sm">Editar</Link>
                {g.published && <ActionButton action={setGalleryPublished.bind(null, g.id, false)}>Despublicar</ActionButton>}
                <DeleteButton action={deleteGallery.bind(null, g.id)} title="¿Eliminar esta galería?" description={`Se eliminarán «${g.title}» y sus ${g.images.length} fotografías.`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
