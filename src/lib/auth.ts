import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/store";
import { DATA_DIR, IS_PROD } from "@/lib/env";
import type { Role, User } from "@/lib/db/types";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;

export const SESSION_COOKIE = "monterrey_session";
const SESSION_HOURS = 12;
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

/* ───────────── Contraseñas ───────────── */

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64, SCRYPT);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, SCRYPT);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Política mínima: 10 caracteres, con letras y números. */
export function passwordProblem(password: string): string | null {
  if (password.length < 10) return "La contraseña debe tener al menos 10 caracteres.";
  if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(password) || !/\d/.test(password)) return "Usa letras y números en la contraseña.";
  return null;
}

/* ───────────── Sesión firmada ───────────── */

let devSecret: string | undefined;

async function secret(): Promise<string> {
  const fromEnv = process.env.SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 32) return fromEnv;
  if (IS_PROD) {
    throw new Error("Falta SESSION_SECRET (mínimo 32 caracteres). Configúrala en las variables de entorno del servidor.");
  }
  if (devSecret) return devSecret;
  const file = path.join(DATA_DIR, ".dev-session-secret");
  try {
    devSecret = (await fs.readFile(file, "utf8")).trim();
  } catch {
    devSecret = randomBytes(32).toString("hex");
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, devSecret, { mode: 0o600 });
  }
  return devSecret;
}

async function sign(payload: string): Promise<string> {
  return createHmac("sha256", await secret()).update(payload).digest("base64url");
}

export async function createSession(user: User): Promise<void> {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  const payload = Buffer.from(JSON.stringify({ u: user.id, v: user.tokenVersion, e: exp })).toString("base64url");
  const token = `${payload}.${await sign(payload)}`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export type SessionUser = Pick<User, "id" | "email" | "name" | "role" | "mustChangePassword">;

/** Devuelve el usuario de la sesión actual, validando firma, vencimiento, estado y versión. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let data: { u: string; v: number; e: number };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!data.e || data.e < Date.now()) return null;
  const user = await db.users.find(data.u);
  if (!user || !user.active || user.tokenVersion !== data.v) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role, mustChangePassword: user.mustChangePassword };
}

/* ───────────── Permisos (se verifican siempre en el servidor) ───────────── */

export const PERMISSIONS = {
  news: ["admin", "editor"],
  events: ["admin", "editor"],
  announcements: ["admin", "editor"],
  alerts: ["admin", "editor"],
  galleries: ["admin", "editor"],
  documents: ["admin"],
  team: ["admin"],
  faqs: ["admin"],
  settings: ["admin"],
  users: ["admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Area = keyof typeof PERMISSIONS;

export function can(user: SessionUser | null, area: Area): boolean {
  return !!user && (PERMISSIONS[area] as readonly Role[]).includes(user.role);
}

/** Para páginas del panel: exige sesión (y permiso, si se indica). */
export async function requireUser(area?: Area): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (user.mustChangePassword) redirect("/admin/cambiar-clave");
  if (area && !can(user, area)) redirect("/admin?aviso=sin-permiso");
  return user;
}

export class ForbiddenError extends Error {}

/** Para acciones de servidor: lanza si no hay sesión o permiso. */
export async function assertCan(area: Area): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.mustChangePassword || !can(user, area)) throw new ForbiddenError("No tienes permiso para realizar esta acción.");
  return user;
}

/* ───────────── Limitador de intentos ───────────── */

const hits = new Map<string, number[]>();

/** Devuelve false si se superó el límite de `max` intentos dentro de `windowMs`. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}

export function clearRateLimit(key: string): void {
  hits.delete(key);
}

/** Compara el código de instalación del servidor en tiempo constante. */
export function setupTokenMatches(candidate: string): boolean {
  const token = process.env.SETUP_TOKEN;
  if (!token || token.length < 12) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ───────────── Token anti-spam de formularios públicos ───────────── */

/** Token firmado con la hora de renderizado del formulario (trampa de tiempo). */
export async function makeFormToken(): Promise<string> {
  const payload = String(Date.now());
  return `${payload}.${await sign(`form:${payload}`)}`;
}

/** Acepta el token si el formulario estuvo abierto entre `minMs` y `maxMs`. */
export async function checkFormToken(token: string, minMs = 3000, maxMs = 6 * 3600_000): Promise<boolean> {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await sign(`form:${payload}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const age = Date.now() - Number(payload);
  return age >= minMs && age <= maxMs;
}
