import { createUser, deleteUser, resetUserPassword, updateUser } from "@/app/admin/actions/users";
import { AdminForm, Check, DeleteButton, Field, Select } from "@/components/admin/forms";
import { AdminPageHeader, Flash, Panel, StatusPill } from "@/components/admin/parts";
import { Notice } from "@/components/ui/common";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { formatDate } from "@/lib/time";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

const ROLES = [
  { value: "editor", label: "Editor — noticias, calendario, comunicados, avisos y galerías" },
  { value: "admin", label: "Administrador general — todo, incluidos documentos, ajustes y usuarios" },
];

export default async function UsuariosPage({ searchParams }: { searchParams: SP }) {
  const me = await requireUser("users");
  const sp = await searchParams;
  const users = (await db.users.all()).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <AdminPageHeader title="Usuarios" description="Personas autorizadas para entrar al panel y su rol." />
      <Flash code={pick(sp.aviso)} />
      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <section aria-label="Usuarios registrados" className="space-y-4">
          {users.map((u) => (
            <article key={u.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold">{u.name} {u.id === me.id && <span className="text-sm font-normal text-muted">(tú)</span>}</p>
                  <p className="break-all text-muted">{u.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={u.active ? "published" : "off"} label={u.active ? "Activo" : "Desactivado"} />
                  <span className="rounded-full bg-sky px-2.5 py-0.5 text-xs font-bold text-brand">{u.role === "admin" ? "Administrador" : "Editor"}</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted">Último ingreso: {u.lastLoginAt ? formatDate(u.lastLoginAt, "short") : "nunca"}{u.mustChangePassword ? " · debe cambiar su clave" : ""}</p>
              <details className="mt-3">
                <summary className="flex min-h-11 cursor-pointer items-center font-bold text-brand">Editar o restablecer clave</summary>
                <div className="mt-3 space-y-5 border-t border-line pt-4">
                  <AdminForm action={updateUser.bind(null, u.id)} submitLabel="Guardar rol y estado" className="space-y-4">
                    <Select name="role" label="Rol" options={ROLES} defaultValue={u.role} />
                    <Check name="active" label="Cuenta activa" hint="Desactívala para impedir el ingreso sin borrar la cuenta." defaultChecked={u.active} />
                  </AdminForm>
                  <AdminForm action={resetUserPassword.bind(null, u.id)} submitLabel="Restablecer clave (genera una temporal)" className="space-y-3">
                    <p className="text-muted">Se generará una clave temporal y se cerrarán sus sesiones abiertas.</p>
                  </AdminForm>
                  {u.id !== me.id && <DeleteButton action={deleteUser.bind(null, u.id)} title="¿Eliminar este usuario?" description={`Se eliminará la cuenta de ${u.name}. Su contenido publicado no se borra.`} />}
                </div>
              </details>
            </article>
          ))}
        </section>

        <Panel title="Agregar usuario" className="h-fit">
          <AdminForm action={createUser} submitLabel="Crear usuario">
            <Field name="name" label="Nombre completo" required autoComplete="off" />
            <Field name="email" type="email" label="Correo electrónico" required autoComplete="off" />
            <Select name="role" label="Rol" required options={ROLES} defaultValue="editor" />
            <Notice tone="info">Se genera una clave temporal que verás una sola vez. Entrégala por un medio seguro; la persona deberá cambiarla al ingresar.</Notice>
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
