import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/admin/AuthShell";
import { AdminForm, Field } from "@/components/admin/forms";
import { Notice } from "@/components/ui/common";
import { recoverAccess } from "../actions/auth";

export const metadata: Metadata = { title: "Recuperar acceso", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function RecuperarPage() {
  const hasToken = Boolean(process.env.SETUP_TOKEN && process.env.SETUP_TOKEN.length >= 12);
  return (
    <AuthShell
      title="Recuperar acceso"
      intro="Define una nueva contraseña con el código de instalación del servidor. Si eres editor, pide a un administrador que restablezca tu clave desde «Usuarios»."
      footer={<Link href="/admin/login" className="font-semibold text-brand underline underline-offset-4">← Volver al ingreso</Link>}
    >
      {hasToken ? (
        <AdminForm action={recoverAccess} submitLabel="Cambiar contraseña" className="space-y-5">
          <Field name="token" type="password" label="Código de instalación" required autoComplete="off" hint="Lo conoce quien administra el servidor (variable SETUP_TOKEN)." />
          <Field name="email" type="email" label="Correo del usuario" required autoComplete="username" />
          <Field name="password" type="password" label="Nueva contraseña" required hint="Mínimo 10 caracteres, con letras y números." autoComplete="new-password" />
          <Field name="confirm" type="password" label="Repite la nueva contraseña" required autoComplete="new-password" />
        </AdminForm>
      ) : (
        <Notice tone="warn" title="Recuperación por correo no disponible">
          Este sitio aún no tiene configurado un servicio de correo ni el código de instalación (SETUP_TOKEN). Quien administra el servidor puede definir SETUP_TOKEN para habilitar la recuperación.
        </Notice>
      )}
    </AuthShell>
  );
}
