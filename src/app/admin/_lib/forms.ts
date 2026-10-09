import type { ZodError } from "zod";

export interface ActionState {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Aviso adicional (por ejemplo, una clave temporal que se muestra una sola vez). */
  notice?: string;
}

export const initialState: ActionState = {};

export function zodErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function raw(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

export function lines(fd: FormData, key: string): string[] {
  return raw(fd, key)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export const dateRe = /^\d{4}-\d{2}-\d{2}$/;
export const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;
