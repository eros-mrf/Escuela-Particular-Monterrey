import { saveNews } from "@/app/admin/actions/news";
import { AdminForm, AttachmentsField, Check, Field, GalleryField, ImageField, RichText, Select, TextArea } from "@/components/admin/forms";
import { NEWS_CATEGORIES } from "@/lib/constants";
import type { NewsItem } from "@/lib/db/types";
import { todayCL } from "@/lib/time";

export function NewsForm({ item }: { item?: NewsItem }) {
  const action = saveNews.bind(null, item?.id ?? "nueva");
  const published = item?.status === "published";
  return (
    <AdminForm
      action={action}
      intents={
        published
          ? [
              { value: "publish", label: "Guardar cambios" },
              { value: "draft", label: "Pasar a borrador", className: "btn btn-outline" },
            ]
          : [
              { value: "publish", label: "Publicar" },
              { value: "draft", label: "Guardar borrador", className: "btn btn-outline" },
            ]
      }
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2"><Field name="title" label="Título" required maxLength={160} defaultValue={item?.title} hint="Claro y específico. Máximo 160 caracteres." /></div>
        <div className="lg:col-span-2"><TextArea name="summary" label="Resumen" required rows={3} maxLength={300} defaultValue={item?.summary} hint="Se muestra en las tarjetas y al compartir. Máximo 300 caracteres." /></div>
        <Select name="category" label="Categoría" required options={NEWS_CATEGORIES} defaultValue={item?.category} />
        <Field name="publishedAt" label="Fecha de publicación" type="date" required defaultValue={item?.publishedAt ?? todayCL()} hint="Si eliges una fecha futura, la noticia aparecerá ese día (publicación programada)." />
        <Field name="author" label="Autor o responsable (opcional)" maxLength={100} defaultValue={item?.author} />
        <div className="flex items-end pb-1"><Check name="featured" label="Noticia destacada" hint="Se muestra en grande al inicio de la lista de noticias." defaultChecked={item?.featured} /></div>
      </div>
      <RichText name="body" label="Texto de la noticia" required rows={16} defaultValue={item?.body} hint="Usa los botones para dar formato. Revisa el resultado en «Vista previa»." />
      <ImageField name="cover" label="Imagen de portada" currentId={item?.coverMediaId} altName="coverAlt" altValue={item?.coverAlt} />
      <GalleryField prefix="gallery" label="Galería de fotografías (opcional)" images={item?.gallery ?? []} />
      <AttachmentsField prefix="att" items={item?.attachments ?? []} />
    </AdminForm>
  );
}
