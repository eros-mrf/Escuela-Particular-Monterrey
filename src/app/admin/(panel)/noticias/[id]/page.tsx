import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteNews } from "@/app/admin/actions/news";
import { DeleteButton } from "@/components/admin/forms";
import { NewsForm } from "@/components/admin/NewsForm";
import { AdminPageHeader, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { pick } from "@/lib/utils";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditarNoticiaPage({ params, searchParams }: Props) {
  await requireUser("news");
  const { id } = await params;
  const sp = await searchParams;
  const item = await db.news.find(id);
  if (!item) notFound();
  return (
    <>
      <AdminPageHeader
        title="Editar noticia"
        back={{ href: "/admin/noticias", label: "Volver a noticias" }}
        description={item.title}
        actions={
          <>
            <StatusPill status={item.status} />
            {item.status === "published" ? (
              <Link href={`/noticias/${item.slug}`} target="_blank" className="btn btn-outline btn-sm">Ver en el sitio ↗</Link>
            ) : (
              <Link href={`/admin/noticias/${item.id}/vista-previa`} className="btn btn-outline btn-sm">Vista previa</Link>
            )}
            <DeleteButton action={deleteNews.bind(null, item.id)} title="¿Eliminar esta noticia?" description={`Se eliminará «${item.title}» junto con sus fotografías y adjuntos.`} />
          </>
        }
      />
      <Flash code={pick(sp.guardado)} />
      <NewsForm item={item} />
    </>
  );
}
