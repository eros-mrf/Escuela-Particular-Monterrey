import { notFound } from "next/navigation";
import { deleteDocument, saveDocument } from "@/app/admin/actions/documents";
import { AdminForm, Check, DeleteButton, Field, FileField, Select, TextArea } from "@/components/admin/forms";
import { AdminPageHeader, Flash } from "@/components/admin/parts";
import { Notice } from "@/components/ui/common";
import { requireUser } from "@/lib/auth";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { documentHref } from "@/lib/content";
import { db } from "@/lib/db/store";
import { todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function EditarDocumentoPage({ params, searchParams }: Props) {
  await requireUser("documents");
  const { id } = await params;
  const sp = await searchParams;
  const item = id === "nueva" ? null : await db.documents.find(id);
  if (id !== "nueva" && !item) notFound();
  return (
    <>
      <AdminPageHeader
        title={item ? "Editar documento" : "Subir documento"}
        back={{ href: "/admin/documentos", label: "Volver a documentos" }}
        description={item?.title}
        actions={item && <DeleteButton action={deleteDocument.bind(null, item.id)} title="¿Eliminar este documento?" description={`Se eliminará «${item.title}» y su archivo.`} />}
      />
      <Flash code={pick(sp.guardado)} />
      <AdminForm action={saveDocument.bind(null, item?.id ?? "nueva")} submitLabel={item ? "Guardar cambios" : "Subir documento"}>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2"><Field name="title" label="Nombre del documento" required maxLength={160} defaultValue={item?.title} /></div>
          <div className="lg:col-span-2"><TextArea name="description" label="Descripción breve" rows={3} maxLength={600} defaultValue={item?.description} /></div>
          <Select name="category" label="Categoría" required options={DOCUMENT_CATEGORIES} defaultValue={item?.category} />
          <Field name="updatedAt" type="date" label="Fecha de actualización" required defaultValue={item?.updatedAt ?? todayCL()} hint="Si reemplazas el archivo y no cambias esta fecha, se actualiza a hoy." />
        </div>
        {item && (
          <p className="text-[0.97rem]">
            Archivo actual: <a href={documentHref(item)} target="_blank" rel="noopener noreferrer" className="font-bold text-brand underline underline-offset-4">ver PDF ↗</a>
            {item.file.kind === "static" && " (documento incluido con el sitio; al subir uno nuevo, lo reemplaza)"}
          </p>
        )}
        <FileField name="file" label={item ? "Reemplazar el archivo (opcional)" : "Archivo PDF"} accept="application/pdf" required={!item} hint="Solo PDF, hasta 25 MB. El archivo anterior se elimina al reemplazarlo." />
        <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
          <Check name="published" label="Publicar para el público" defaultChecked={item?.published} hint="Si no lo marcas, el archivo queda privado: solo lo ve el personal con sesión iniciada." />
          <Check name="authorized" label="Confirmo que este documento está autorizado para su difusión pública" hint="Revisa que no contenga datos personales, notas internas ni información reservada." defaultChecked={item?.published} />
        </div>
        <Notice tone="warn" title="Antes de publicar">Los documentos públicos pueden ser descargados por cualquier persona. No subas listas de estudiantes, fichas ni archivos con datos personales.</Notice>
      </AdminForm>
    </>
  );
}
