import { notFound } from "next/navigation";
import { saveFaq } from "@/app/admin/actions/site";
import { AdminForm, Check, Field, Select, TextArea } from "@/components/admin/forms";
import { AdminPageHeader } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { FAQ_GROUPS } from "@/lib/constants";
import { db } from "@/lib/db/store";

export default async function EditarPreguntaPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("faqs");
  const { id } = await params;
  const item = id === "nueva" ? null : await db.faqs.find(id);
  if (id !== "nueva" && !item) notFound();
  return (
    <>
      <AdminPageHeader title={item ? "Editar pregunta" : "Nueva pregunta"} back={{ href: "/admin/preguntas", label: "Volver a preguntas" }} />
      <AdminForm action={saveFaq.bind(null, item?.id ?? "nueva")} submitLabel={item ? "Guardar cambios" : "Crear pregunta"}>
        <Field name="question" label="Pregunta" required maxLength={200} defaultValue={item?.question} />
        <TextArea name="answer" label="Respuesta" required rows={5} maxLength={3000} defaultValue={item?.answer} hint="Responde solo con información oficial y verificada." />
        <div className="grid gap-5 lg:grid-cols-3">
          <Select name="group" label="Grupo" required options={FAQ_GROUPS} defaultValue={item?.group} />
          <Field name="order" type="number" label="Orden" defaultValue={item?.order ?? 50} min="0" max="999" />
          <div className="flex items-end pb-1"><Check name="published" label="Visible en el sitio" defaultChecked={item?.published ?? true} /></div>
        </div>
      </AdminForm>
    </>
  );
}
