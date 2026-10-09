import { NewsForm } from "@/components/admin/NewsForm";
import { AdminPageHeader } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";

export default async function NuevaNoticiaPage() {
  await requireUser("news");
  return (
    <>
      <AdminPageHeader title="Nueva noticia" back={{ href: "/admin/noticias", label: "Volver a noticias" }} description="Escribe la noticia y elige si la publicas ahora o la guardas como borrador." />
      <NewsForm />
    </>
  );
}
