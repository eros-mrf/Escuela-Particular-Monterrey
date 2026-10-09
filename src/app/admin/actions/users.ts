"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertCan, hashPassword } from "@/lib/auth";
import { db, newId } from "@/lib/db/store";
import type { Role, User } from "@/lib/db/types";
import { nowISO } from "@/lib/time";
import { bool, str, zodErrors, type ActionState } from "../_lib/forms";

/** Clave temporal legible (sin caracteres ambiguos). Se muestra una sola vez. */
function tempPassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(14);
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `${out.slice(0, 4)}-${out.slice(4, 9)}-${out.slice(9)}7`;
}

const createSchema = z.object({
  name: z.string().trim().min(2, "Escribe el nombre.").max(100),
  email: z.string().trim().toLowerCase().email("Escribe un correo válido."),
  role: z.enum(["admin", "editor"], { error: "Elige un rol." }),
});

export async function createUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("users");
  const parsed = createSchema.safeParse({ name: str(fd, "name"), email: str(fd, "email"), role: str(fd, "role") });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const users = await db.users.all();
  if (users.some((u) => u.email.toLowerCase() === parsed.data.email)) return { ok: false, message: "Ya existe un usuario con ese correo.", errors: { email: "Correo ya registrado." } };
  const pass = tempPassword();
  const user: User = {
    id: newId(),
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role as Role,
    passwordHash: await hashPassword(pass),
    active: true,
    mustChangePassword: true,
    tokenVersion: 1,
    createdAt: nowISO(),
  };
  await db.users.insert(user);
  revalidatePath("/admin/usuarios");
  return { ok: true, message: `Usuario creado: ${user.email}.`, notice: `Clave temporal (anótala ahora, no se vuelve a mostrar): ${pass} — la persona deberá cambiarla al ingresar.` };
}

async function activeAdmins(excludingId?: string): Promise<number> {
  return (await db.users.all()).filter((u) => u.role === "admin" && u.active && u.id !== excludingId).length;
}

export async function updateUser(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await assertCan("users");
  const user = await db.users.find(id);
  if (!user) return { ok: false, message: "El usuario ya no existe." };
  const role = str(fd, "role") === "admin" ? "admin" : "editor";
  const active = bool(fd, "active");
  if (user.id === me.id && (role !== "admin" || !active)) return { ok: false, message: "No puedes quitarte tu propio rol de administrador ni desactivar tu cuenta." };
  if (user.role === "admin" && user.active && (role !== "admin" || !active) && (await activeAdmins(user.id)) === 0) {
    return { ok: false, message: "Debe quedar al menos un administrador activo." };
  }
  await db.users.update(id, (u) => ({ ...u, role, active, tokenVersion: active ? u.tokenVersion : u.tokenVersion + 1 }));
  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Usuario actualizado." };
}

export async function resetUserPassword(id: string, _prev: ActionState, _fd: FormData): Promise<ActionState> {
  await assertCan("users");
  const user = await db.users.find(id);
  if (!user) return { ok: false, message: "El usuario ya no existe." };
  const pass = tempPassword();
  const passwordHash = await hashPassword(pass);
  await db.users.update(id, (u) => ({ ...u, passwordHash, mustChangePassword: true, tokenVersion: u.tokenVersion + 1 }));
  revalidatePath("/admin/usuarios");
  return { ok: true, message: `Clave restablecida para ${user.email}.`, notice: `Clave temporal (anótala ahora, no se vuelve a mostrar): ${pass}` };
}

export async function deleteUser(id: string): Promise<void> {
  const me = await assertCan("users");
  const user = await db.users.find(id);
  if (!user || user.id === me.id) redirect("/admin/usuarios?aviso=sin-permiso");
  if (user.role === "admin" && user.active && (await activeAdmins(user.id)) === 0) redirect("/admin/usuarios?aviso=sin-permiso");
  await db.users.remove(id);
  redirect("/admin/usuarios?aviso=eliminada");
}
