import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/AuthShell";
import { AdminForm, Field } from "@/components/admin/forms";
import { getSessionUser } from "@/lib/auth";
import { changePassword } from "../actions/auth";

export const metadata: Metadata = { title: "Cambiar contraseña", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CambiarClavePage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return (
    <AuthShell
      title="Cambiar contraseña"
      intro={user.mustChangePassword ? "Ingresaste con una clave temporal. Define tu propia contraseña para continuar." : `Sesión iniciada como ${user.email}.`}
      footer={user.mustChangePassword ? undefined : <Link href="/admin" className="font-semibold text-brand underline underline-offset-4">← Volver al panel</Link>}
    >
      <AdminForm action={changePassword} submitLabel="Guardar contraseña" className="space-y-5">
        <Field name="current" type="password" label="Contraseña actual" required autoComplete="current-password" />
        <Field name="password" type="password" label="Nueva contraseña" required hint="Mínimo 10 caracteres, con letras y números." autoComplete="new-password" />
        <Field name="confirm" type="password" label="Repite la nueva contraseña" required autoComplete="new-password" />
      </AdminForm>
    </AuthShell>
  );
}
