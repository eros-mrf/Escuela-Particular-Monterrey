import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/AuthShell";
import { AdminForm, Field } from "@/components/admin/forms";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { login } from "../actions/auth";

export const metadata: Metadata = { title: "Ingreso al panel", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");
  const noUsers = (await db.users.all()).length === 0;
  if (noUsers) redirect("/admin/instalacion");
  return (
    <AuthShell title="Ingresar" intro="Acceso exclusivo para personal autorizado del establecimiento.">
      <AdminForm action={login} submitLabel="Ingresar" className="space-y-5">
        <Field name="email" type="email" label="Correo electrónico" required autoComplete="username" />
        <Field name="password" type="password" label="Contraseña" required autoComplete="current-password" />
      </AdminForm>
      <p className="mt-5 text-sm text-muted">
        ¿Perdiste el acceso? <Link href="/admin/recuperar" className="font-semibold text-brand underline underline-offset-4">Recuperar acceso</Link>
      </p>
    </AuthShell>
  );
}
