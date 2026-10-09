import { notFound } from "next/navigation";
import { deleteGallery, saveGallery } from "@/app/admin/actions/galleries";
import { AdminForm, Check, DeleteButton, Field, GalleryField, Select, TextArea } from "@/components/admin/forms";
import { AdminPageHeader, Flash } from "@/components/admin/parts";
import { Notice } from "@/components/ui/common";
import { requireUser } from "@/lib/auth";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { db } from "@/lib/db/store";
import { todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditarGaleriaPage({ params, searchParams }: Props) {
  await requireUser("galleries");
  const { id } = await params;
  const sp = await searchParams;
  const item = id === "nueva" ? null : await db.galleries.find(id);
  if (id !== "nueva" && !item) notFound();
  return (
    <>
      <AdminPageHeader
        title={item ? "Editar galería" : "Nueva galería"}
        back={{ href: "/admin/galerias", label: "Volver a galerías" }}
        description={item?.title}
        actions={item && <DeleteButton action={deleteGallery.bind(null, item.id)} title="¿Eliminar esta galería?" description={`Se eliminarán «${item.title}» y sus fotografías.`} />}
      />
      <Flash code={pick(sp.guardado)} />
      <AdminForm
        action={saveGallery.bind(null, item?.id ?? "nueva")}
        intents={item?.published ? [{ value: "publish", label: "Guardar cambios" }, { value: "draft", label: "Pasar a borrador", className: "btn btn-outline" }] : [{ value: "publish", label: "Publicar" }, { value: "draft", label: "Guardar borrador", className: "btn btn-outline" }]}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2"><Field name="title" label="Título de la galería" required maxLength={140} defaultValue={item?.title} placeholder="Ej.: Acto de aniversario" /></div>
          <Select name="category" label="Categoría" required options={GALLERY_CATEGORIES} defaultValue={item?.category} />
          <Field name="date" type="date" label="Fecha de la actividad" required defaultValue={item?.date ?? todayCL()} />
          <div className="lg:col-span-2"><TextArea name="description" label="Descripción (opcional)" rows={3} maxLength={500} defaultValue={item?.description} /></div>
        </div>
        <GalleryField prefix="img" label="Fotografías" images={item?.images ?? []} />
        <div className="rounded-2xl border border-line bg-white p-5">
          <Check name="consent" label="Confirmo que existen las autorizaciones para publicar estas imágenes" hint="Si aparecen estudiantes, sus apoderados deben haber autorizado la difusión. Obligatorio para publicar." defaultChecked={item?.consentConfirmed} />
        </div>
        <Notice tone="warn" title="Privacidad de menores">No incluyas nombres completos de estudiantes en las descripciones ni fotografías de documentos, listas o pantallas con datos personales.</Notice>
      </AdminForm>
    </>
  );
}
