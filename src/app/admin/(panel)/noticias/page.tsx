import Link from "next/link";
import { deleteNews, setNewsStatus } from "@/app/admin/actions/news";
import { ActionButton, DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, EmptyRow, Flash, StatusPill } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { sortNews } from "@/lib/content";
import { db } from "@/lib/db/store";
import { formatDate, todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminNoticiasPage({ searchParams }: { searchParams: SP }) {
  await requireUser("news");
  const sp = await searchParams;
  const estado = pick(sp.estado) ?? "";
  const rows = sortNews(await db.news.all()).filter((n) => (estado === "borrador" ? n.status === "draft" : estado === "publicadas" ? n.status === "published" : true));
  const today = todayCL();

  return (
    <>
      <AdminPageHeader
        title="Noticias"
        description="Crea, edita, publica y elimina noticias institucionales."
        actions={<Link href="/admin/noticias/nueva" className="btn btn-primary">+ Nueva noticia</Link>}
      />
      <Flash code={pick(sp.aviso)} />
      <div role="group" aria-label="Filtrar por estado" className="mb-5 inline-flex rounded-2xl border border-line bg-white p-1">
        {[["", "Todas"], ["publicadas", "Publicadas"], ["borrador", "Borradores"]].map(([v, l]) => (
          <Link key={v} href={v ? `/admin/noticias?estado=${v}` : "/admin/noticias"} aria-current={estado === v ? "page" : undefined} className={`flex min-h-10 items-center rounded-xl px-4 font-bold ${estado === v ? "bg-ink text-white" : ""}`}>{l}</Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyRow>Aún no hay noticias. Crea la primera con «Nueva noticia».</EmptyRow>
      ) : (
        <ul className="space-y-3">
          {rows.map((n) => {
            const scheduled = n.status === "published" && n.publishedAt > today;
            return (
              <li key={n.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <StatusPill status={scheduled ? "scheduled" : n.status} />
                    {n.demo && <StatusPill status="demo" />}
                    {n.featured && <span className="rounded-full bg-sun px-2.5 py-0.5 text-xs font-bold text-ink">Destacada</span>}
                    <span className="text-sm text-muted">{n.category} · {formatDate(n.publishedAt, "short")}</span>
                  </div>
                  <p className="font-display text-lg font-bold leading-snug">
                    <Link href={`/admin/noticias/${n.id}`} className="hover:text-brand">{n.title}</Link>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/noticias/${n.id}`} className="btn btn-outline btn-sm">Editar</Link>
                  {n.status === "published" ? (
                    <>
                      <Link href={`/noticias/${n.slug}`} target="_blank" className="btn btn-outline btn-sm">Ver ↗</Link>
                      <ActionButton action={setNewsStatus.bind(null, n.id, "draft")}>Despublicar</ActionButton>
                    </>
                  ) : (
                    <>
                      <Link href={`/admin/noticias/${n.id}/vista-previa`} className="btn btn-outline btn-sm">Vista previa</Link>
                      <ActionButton action={setNewsStatus.bind(null, n.id, "published")} className="btn btn-primary btn-sm">Publicar</ActionButton>
                    </>
                  )}
                  <DeleteButton action={deleteNews.bind(null, n.id)} title="¿Eliminar esta noticia?" description={`Se eliminará «${n.title}» junto con sus fotografías y adjuntos.`} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
