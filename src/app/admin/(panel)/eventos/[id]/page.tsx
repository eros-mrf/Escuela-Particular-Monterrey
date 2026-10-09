import { notFound } from "next/navigation";
import { deleteEvent, saveEvent } from "@/app/admin/actions/events";
import { AdminForm, AttachmentsField, DeleteButton, Field, ImageField, Select, TextArea } from "@/components/admin/forms";
import { AdminPageHeader, Flash } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { db } from "@/lib/db/store";
import { todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditarEventoPage({ params, searchParams }: Props) {
  await requireUser("events");
  const { id } = await params;
  const sp = await searchParams;
  const item = id === "nueva" ? null : await db.events.find(id);
  if (id !== "nueva" && !item) notFound();
  return (
    <>
      <AdminPageHeader
        title={item ? "Editar evento" : "Nuevo evento"}
        back={{ href: "/admin/eventos", label: "Volver al calendario" }}
        description={item?.title}
        actions={item && <DeleteButton action={deleteEvent.bind(null, item.id)} title="¿Eliminar esta actividad?" description={`Se eliminará «${item.title}» del calendario.`} />}
      />
      <Flash code={pick(sp.guardado)} />
      <AdminForm action={saveEvent.bind(null, item?.id ?? "nueva")} submitLabel={item ? "Guardar cambios" : "Crear evento"}>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2"><Field name="title" label="Nombre de la actividad" required maxLength={160} defaultValue={item?.title} /></div>
          <Select name="category" label="Tipo de actividad" required options={EVENT_CATEGORIES.map((c) => c.id)} defaultValue={item?.category} />
          <Field name="location" label="Lugar (opcional)" maxLength={160} defaultValue={item?.location} placeholder="Ej.: Patio techado" />
          <Field name="date" type="date" label="Fecha" required defaultValue={item?.date ?? todayCL()} />
          <Field name="endDate" type="date" label="Fecha de término (si dura varios días)" defaultValue={item?.endDate} />
          <Field name="startTime" type="time" label="Hora de inicio (opcional)" defaultValue={item?.startTime} hint="Hora de Chile, formato 24 h." />
          <Field name="endTime" type="time" label="Hora de término (opcional)" defaultValue={item?.endTime} />
        </div>
        <TextArea name="description" label="Descripción" rows={6} defaultValue={item?.description} hint="Qué se hará, a quiénes está dirigida y qué deben llevar. Puedes dejarla en blanco." />
        <ImageField name="image" label="Imagen (opcional)" currentId={item?.imageMediaId} altName="imageAlt" altValue={item?.imageAlt} />
        <AttachmentsField prefix="att" items={item?.attachments ?? []} />
      </AdminForm>
    </>
  );
}
