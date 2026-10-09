"use server";

import { getSessionUser } from "@/lib/auth";
import { renderMarkdown } from "@/lib/markdown";

/** Vista previa del texto enriquecido: solo para personal con sesión y siempre sanitizada. */
export async function previewMarkdown(source: string): Promise<string> {
  if (!(await getSessionUser())) return "";
  return renderMarkdown(source.slice(0, 50_000));
}
