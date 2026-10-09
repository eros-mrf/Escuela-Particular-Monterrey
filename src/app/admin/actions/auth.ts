"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearRateLimit,
  createSession,
  destroySession,
  getSessionUser,
  hashPassword,
  passwordProblem,
  rateLimit,
  setupTokenMatches,
  verifyPassword,
} from "@/lib/auth";
import { db, newId } from "@/lib/db/store";
import { nowISO } from "@/lib/time";
import { str, zodErrors, type ActionState } from "../_lib/forms";

// Hash de relleno para igualar el tiempo de respuesta cuando el correo no existe.
const DUMMY_HASH = "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==";

async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
}

export async function login(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const ip = await clientIp();
  const ipKey = `login-ip:${ip}`;
  const mailKey = `login-mail:${email}`;
  if (!rateLimit(ipKey, 20, 15 * 60_000) || !rateLimit(mailKey, 6, 15 * 60_000)) {
    return { ok: false, message: "Demasiados intentos. Espera 15 minutos antes de volver a intentarlo." };
  }
  if (!email || !password) return { ok: false, message: "Escribe tu correo y tu contraseña." };

  const users = await db.users.all();
  if (users.length === 0) redirect("/admin/instalacion");
  const user = users.find((u) => u.email.toLowerCase() === email);
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.active || !valid) return { ok: false, message: "Correo o contraseña incorrectos." };

  clearRateLimit(mailKey);
  await db.users.update(user.id, (u) => ({ ...u, lastLoginAt: nowISO() }));
  await createSession(user);
  redirect(user.mustChangePassword ? "/admin/cambiar-clave" : "/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

const setupSchema = z
  .object({
    token: z.string().min(1, "Escribe el código de instalación."),
    name: z.string().trim().min(2, "Escribe tu nombre.").max(100),
    email: z.string().trim().toLowerCase().email("Escribe un correo válido."),
    password: z.string(),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Las contraseñas no coinciden." });

/** Crea el primer administrador. Solo funciona si no existen usuarios y se conoce SETUP_TOKEN. */
export async function setupFirstAdmin(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!rateLimit(`setup:${await clientIp()}`, 8, 15 * 60_000)) return { ok: false, message: "Demasiados intentos. Espera unos minutos." };
  if ((await db.users.all()).length > 0) redirect("/admin/login");
  const parsed = setupSchema.safeParse({
    token: String(fd.get("token") ?? ""),
    name: fd.get("name"),
    email: fd.get("email"),
    password: String(fd.get("password") ?? ""),
    confirm: String(fd.get("confirm") ?? ""),
  });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  if (!setupTokenMatches(parsed.data.token)) return { ok: false, message: "El código de instalación no es correcto.", errors: { token: "Código incorrecto." } };
  const problem = passwordProblem(parsed.data.password);
  if (problem) return { ok: false, message: problem, errors: { password: problem } };

  const user = {
    id: newId(),
    email: parsed.data.email,
    name: parsed.data.name,
    role: "admin" as const,
    passwordHash: await hashPassword(parsed.data.password),
    active: true,
    mustChangePassword: false,
    tokenVersion: 1,
    createdAt: nowISO(),
    lastLoginAt: nowISO(),
  };
  await db.users.insert(user);
  await createSession(user);
  redirect("/admin");
}

const recoverSchema = z
  .object({
    token: z.string().min(1, "Escribe el código de instalación."),
    email: z.string().trim().toLowerCase().email("Escribe un correo válido."),
    password: z.string(),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Las contraseñas no coinciden." });

/** Recuperación de acceso: quien administra el servidor (y conoce SETUP_TOKEN) define una nueva contraseña. */
export async function recoverAccess(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (!rateLimit(`recover:${await clientIp()}`, 6, 15 * 60_000)) return { ok: false, message: "Demasiados intentos. Espera unos minutos." };
  const parsed = recoverSchema.safeParse({
    token: String(fd.get("token") ?? ""),
    email: fd.get("email"),
    password: String(fd.get("password") ?? ""),
    confirm: String(fd.get("confirm") ?? ""),
  });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  if (!setupTokenMatches(parsed.data.token)) return { ok: false, message: "El código de instalación no es correcto.", errors: { token: "Código incorrecto." } };
  const problem = passwordProblem(parsed.data.password);
  if (problem) return { ok: false, message: problem, errors: { password: problem } };

  const user = (await db.users.all()).find((u) => u.email.toLowerCase() === parsed.data.email);
  if (!user) return { ok: false, message: "No existe un usuario con ese correo.", errors: { email: "No encontramos ese correo." } };
  const passwordHash = await hashPassword(parsed.data.password);
  await db.users.update(user.id, (u) => ({ ...u, passwordHash, active: true, mustChangePassword: false, tokenVersion: u.tokenVersion + 1 }));
  return { ok: true, message: "Contraseña actualizada. Ya puedes iniciar sesión con la nueva contraseña." };
}

const changeSchema = z
  .object({ current: z.string().min(1, "Escribe tu contraseña actual."), password: z.string(), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Las contraseñas no coinciden." });

export async function changePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await getSessionUser();
  if (!session) redirect("/admin/login");
  const parsed = changeSchema.safeParse({ current: String(fd.get("current") ?? ""), password: String(fd.get("password") ?? ""), confirm: String(fd.get("confirm") ?? "") });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const problem = passwordProblem(parsed.data.password);
  if (problem) return { ok: false, message: problem, errors: { password: problem } };
  const user = await db.users.find(session.id);
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return { ok: false, message: "La contraseña actual no es correcta.", errors: { current: "Contraseña incorrecta." } };
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const updated = await db.users.update(user.id, (u) => ({ ...u, passwordHash, mustChangePassword: false, tokenVersion: u.tokenVersion + 1 }));
  if (updated) await createSession(updated);
  redirect("/admin?clave=cambiada");
}

