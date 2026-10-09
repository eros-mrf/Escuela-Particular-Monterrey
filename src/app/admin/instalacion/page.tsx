import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/AuthShell";
import { AdminForm, Field } from "@/components/admin/forms";
import { Notice } from "@/components/ui/common";
import { db } from "@/lib/db/store";
import { setupFirstAdmin } from "../actions/auth";

export const metadata: Metadata = { title: "Instalación del panel", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function InstalacionPage() {
  if ((await db.users.all()).length > 0) redirect("/admin/login");
  const hasToken = Boolean(process.env.SETUP_TOKEN && process.env.SETUP_TOKEN.length >= 12);
  return (
    <AuthShell title="Crear el primer administrador" intro="Este paso se realiza una sola vez, al poner en marcha el sitio.">
      {hasToken ? (
        <AdminForm action={setupFirstAdmin} submitLabel="Crear administrador" className="space-y-5">
          <Field name="token" type="password" label="Código de instalación" required hint="Es el valor de la variable SETUP_TOKEN configurada en el servidor." autoComplete="off" />
          <Field name="name" label="Nombre completo" required autoComplete="name" />
          <Field name="email" type="email" label="Correo electrónico" required autoComplete="username" />
          <Field name="password" type="password" label="Contraseña" required hint="Mínimo 10 caracteres, con letras y números." autoComplete="new-password" />
          <Field name="confirm" type="password" label="Repite la contraseña" required autoComplete="new-password" />
        </AdminForm>
      ) : (
        <Notice tone="warn" title="Falta configurar SETUP_TOKEN">
          Para crear el primer administrador, define en el servidor la variable de entorno <code>SETUP_TOKEN</code> (mínimo 12 caracteres), reinicia el sitio y vuelve a esta página. Consulta la guía de instalación en el repositorio.
        </Notice>
      )}
    </AuthShell>
  );
}
