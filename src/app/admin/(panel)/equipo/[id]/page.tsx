import { notFound } from "next/navigation";
import { saveTeamMember } from "@/app/admin/actions/site";
import { AdminForm, Check, Field, ImageField, TextArea } from "@/components/admin/forms";
import { AdminPageHeader } from "@/components/admin/parts";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/store";

export default async function EditarEquipoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("team");
  const { id } = await params;
  const item = id === "nueva" ? null : await db.team.find(id);
  if (id !== "nueva" && !item) notFound();
  return (
    <>
      <AdminPageHeader title={item ? "Editar ficha" : "Nueva ficha"} back={{ href: "/admin/equipo", label: "Volver al equipo" }} />
      <AdminForm action={saveTeamMember.bind(null, item?.id ?? "nueva")} submitLabel={item ? "Guardar cambios" : "Crear ficha"}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Field name="name" label="Nombre completo" required maxLength={120} defaultValue={item?.name} />
          <Field name="role" label="Cargo" required maxLength={120} defaultValue={item?.role} placeholder="Ej.: Directora" />
          <Field name="order" type="number" label="Orden de aparición" defaultValue={item?.order ?? 10} min="0" max="999" hint="Número menor aparece primero." />
          <div className="flex items-end pb-1"><Check name="published" label="Mostrar en el sitio" defaultChecked={item?.published ?? true} /></div>
        </div>
        <TextArea name="bio" label="Presentación breve (opcional)" rows={3} maxLength={500} defaultValue={item?.bio} />
        <ImageField name="photo" label="Fotografía (opcional)" currentId={item?.photoMediaId} hint="Cuadrada o de retrato, JPG/PNG/WebP hasta 8 MB. Solo con consentimiento de la persona." />
      </AdminForm>
    </>
  );
}
