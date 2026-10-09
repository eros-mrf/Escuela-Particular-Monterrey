import { notFound } from "next/navigation";
import { deleteAnnouncement, saveAnnouncement } from "@/app/admin/actions/announcements";
import { AdminForm, AttachmentsField, Check, DeleteButton, Field, RichText, Select } from "@/components/admin/forms";
import { AdminPageHeader, Flash } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { ANNOUNCEMENT_CATEGORIES } from "@/lib/constants";
import { db } from "@/lib/db/store";
import { todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditarComunicadoPage({ params, searchParams }: Props) {
  await requireUser("announcements");
  const { id } = await params;
  const sp = await searchParams;
  const item = id === "nueva" ? null : await db.announcements.find(id);
  if (id !== "nueva" && !item) notFound();
  const published = item?.status === "published";
  return (
    <>
      <AdminPageHeader
        title={item ? "Editar comunicado" : "Nuevo comunicado"}
        back={{ href: "/admin/comunicados", label: "Volver a comunicados" }}
        description={item?.title}
        actions={item && <DeleteButton action={deleteAnnouncement.bind(null, item.id)} title="¿Eliminar este comunicado?" description={`Se eliminará «${item.title}».`} />}
      />
      <Flash code={pick(sp.guardado)} />
      <AdminForm
        action={saveAnnouncement.bind(null, item?.id ?? "nueva")}
        intents={published ? [{ value: "publish", label: "Guardar cambios" }, { value: "draft", label: "Pasar a borrador", className: "btn btn-outline" }] : [{ value: "publish", label: "Publicar" }, { value: "draft", label: "Guardar borrador", className: "btn btn-outline" }]}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2"><Field name="title" label="Título" required maxLength={160} defaultValue={item?.title} /></div>
          <Select name="category" label="Categoría" required options={ANNOUNCEMENT_CATEGORIES} defaultValue={item?.category} />
          <div className="flex items-end pb-1"><Check name="pinned" label="Destacar al inicio" hint="Aparece primero en la lista de vigentes." defaultChecked={item?.pinned} /></div>
          <Field name="publishedAt" type="date" label="Fecha de publicación" required defaultValue={item?.publishedAt ?? todayCL()} hint="Si es futura, se mostrará ese día." />
          <Field name="expiresAt" type="date" label="Vigente hasta (opcional)" defaultValue={item?.expiresAt} hint="Después de esta fecha pasa automáticamente al archivo. Déjala en blanco si no vence." />
        </div>
        <RichText name="body" label="Texto del comunicado" required rows={12} defaultValue={item?.body} />
        <AttachmentsField prefix="att" items={item?.attachments ?? []} />
      </AdminForm>
    </>
  );
}
