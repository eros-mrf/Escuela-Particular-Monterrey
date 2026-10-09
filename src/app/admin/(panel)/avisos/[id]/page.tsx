import { notFound } from "next/navigation";
import { deleteAlert, saveAlert } from "@/app/admin/actions/announcements";
import { AdminForm, Check, DeleteButton, Field, Select, TextArea } from "@/components/admin/forms";
import { AdminPageHeader, Flash } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { ALERT_LEVELS } from "@/lib/constants";
import { db } from "@/lib/db/store";
import { addDays, todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditarAvisoPage({ params, searchParams }: Props) {
  await requireUser("alerts");
  const { id } = await params;
  const sp = await searchParams;
  const item = id === "nueva" ? null : await db.alerts.find(id);
  if (id !== "nueva" && !item) notFound();
  return (
    <>
      <AdminPageHeader
        title={item ? "Editar aviso" : "Nuevo aviso prioritario"}
        back={{ href: "/admin/avisos", label: "Volver a avisos" }}
        actions={item && <DeleteButton action={deleteAlert.bind(null, item.id)} title="¿Eliminar este aviso?" description="El aviso dejará de mostrarse en el sitio." />}
      />
      <Flash code={pick(sp.guardado)} />
      <AdminForm action={saveAlert.bind(null, item?.id ?? "nueva")} submitLabel={item ? "Guardar cambios" : "Crear aviso"}>
        <TextArea name="message" label="Mensaje" required rows={3} maxLength={240} defaultValue={item?.message} hint="Breve y claro (máximo 240 caracteres)." />
        <div className="grid gap-5 lg:grid-cols-2">
          <Select name="level" label="Nivel" required options={ALERT_LEVELS.map((l) => ({ value: l.id, label: l.label }))} defaultValue={item?.level ?? "info"} hint="«Urgente» se muestra en rojo y se anuncia a lectores de pantalla." />
          <div className="flex items-end pb-1"><Check name="active" label="Aviso activo" hint="Desmárcalo para ocultarlo sin eliminarlo." defaultChecked={item?.active ?? true} /></div>
          <Field name="startsAt" type="date" label="Mostrar desde" required defaultValue={item?.startsAt ?? todayCL()} />
          <Field name="expiresAt" type="date" label="Mostrar hasta (expira)" required defaultValue={item?.expiresAt ?? addDays(todayCL(), 7)} hint="Obligatoria. Pasada esta fecha el aviso desaparece solo." />
          <Field name="linkUrl" label="Enlace (opcional)" placeholder="https://… o /comunicados" defaultValue={item?.linkUrl} />
          <Field name="linkLabel" label="Texto del enlace (opcional)" maxLength={60} defaultValue={item?.linkLabel} placeholder="Más información" />
        </div>
      </AdminForm>
    </>
  );
}
