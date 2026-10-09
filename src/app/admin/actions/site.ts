"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { assertCan } from "@/lib/auth";
import { FAQ_GROUPS, SOCIAL_NETWORKS, TEXT_FIELDS } from "@/lib/constants";
import { db, newId } from "@/lib/db/store";
import type { CommunityLink, HeroSlide, SocialLink, TeamMember } from "@/lib/db/types";
import { UploadError, deleteMedia, isFile, saveUpload } from "@/lib/media";
import { safeUrl } from "@/lib/utils";
import { bool, raw, str, zodErrors, lines, type ActionState } from "../_lib/forms";
import { processSingleImage } from "../_lib/uploads";

/* ───────────── Equipo directivo ───────────── */

const teamSchema = z.object({
  name: z.string().min(3, "Escribe el nombre completo.").max(120),
  role: z.string().min(3, "Escribe el cargo.").max(120),
  bio: z.string().max(500, "Máximo 500 caracteres.").optional(),
  order: z.coerce.number().int().min(0).max(999),
});

export async function saveTeamMember(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("team");
  const parsed = teamSchema.safeParse({ name: str(fd, "name"), role: str(fd, "role"), bio: str(fd, "bio") || undefined, order: str(fd, "order") || "1" });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const existing = id === "nueva" ? null : await db.team.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "La ficha ya no existe." };
  let photoMediaId: string | undefined;
  try {
    photoMediaId = await processSingleImage(fd, "photo", existing?.photoMediaId);
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, message: err.message };
    throw err;
  }
  const base = { ...parsed.data, photoMediaId, published: bool(fd, "published") };
  if (!existing) {
    const item: TeamMember = { id: newId(), ...base };
    await db.team.insert(item);
    redirect(`/admin/equipo?aviso=creado`);
  }
  await db.team.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect(`/admin/equipo?aviso=guardado`);
}

export async function deleteTeamMember(id: string): Promise<void> {
  await assertCan("team");
  const m = await db.team.remove(id);
  await deleteMedia(m?.photoMediaId);
  redirect("/admin/equipo?aviso=eliminada");
}

/* ───────────── Preguntas frecuentes ───────────── */

const faqSchema = z.object({
  question: z.string().min(5, "Escribe la pregunta.").max(200),
  answer: z.string().min(5, "Escribe la respuesta.").max(3000),
  group: z.enum(FAQ_GROUPS, { error: "Elige un grupo." }),
  order: z.coerce.number().int().min(0).max(999),
});

export async function saveFaq(id: string, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("faqs");
  const parsed = faqSchema.safeParse({ question: str(fd, "question"), answer: raw(fd, "answer").trim(), group: str(fd, "group"), order: str(fd, "order") || "99" });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const existing = id === "nueva" ? null : await db.faqs.find(id);
  if (id !== "nueva" && !existing) return { ok: false, message: "La pregunta ya no existe." };
  const base = { ...parsed.data, published: bool(fd, "published") };
  if (!existing) {
    await db.faqs.insert({ id: newId(), ...base });
    redirect("/admin/preguntas?aviso=creado");
  }
  await db.faqs.update(existing.id, (cur) => ({ ...cur, ...base }));
  redirect("/admin/preguntas?aviso=guardado");
}

export async function deleteFaq(id: string): Promise<void> {
  await assertCan("faqs");
  await db.faqs.remove(id);
  redirect("/admin/preguntas?aviso=eliminada");
}

/* ───────────── Configuración del sitio ───────────── */

const contactSchema = z.object({
  address: z.string().min(3, "Escribe la dirección.").max(160),
  locality: z.string().min(2, "Escribe la localidad.").max(80),
  commune: z.string().min(2, "Escribe la comuna.").max(80),
  region: z.string().min(2, "Escribe la región.").max(80),
  phone: z.string().max(40),
  mapLat: z.string().max(20),
  mapLng: z.string().max(20),
});

export async function saveContact(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("settings");
  const parsed = contactSchema.safeParse({
    address: str(fd, "address"),
    locality: str(fd, "locality"),
    commune: str(fd, "commune"),
    region: str(fd, "region"),
    phone: str(fd, "phone"),
    mapLat: str(fd, "mapLat"),
    mapLng: str(fd, "mapLng"),
  });
  if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", errors: zodErrors(parsed.error) };
  const emails = lines(fd, "emails");
  const badEmail = emails.find((e) => !z.string().email().safeParse(e).success);
  if (badEmail) return { ok: false, message: `El correo «${badEmail}» no es válido.`, errors: { emails: "Revisa los correos (uno por línea)." } };
  const { mapLat, mapLng } = parsed.data;
  if ((mapLat || mapLng) && !(Number.isFinite(Number(mapLat)) && Number.isFinite(Number(mapLng)) && Math.abs(Number(mapLat)) <= 90 && Math.abs(Number(mapLng)) <= 180 && mapLat && mapLng)) {
    return { ok: false, message: "Las coordenadas deben ser números válidos (por ejemplo -38.7 y -72.5) o quedar ambas en blanco.", errors: { mapLat: "Coordenada inválida.", mapLng: "Coordenada inválida." } };
  }
  await db.settings.save((s) => ({ ...s, contact: { ...parsed.data, emails, hours: lines(fd, "hours") } }));
  return { ok: true, message: "Datos de contacto actualizados. Ya se ven en el sitio." };
}

export async function saveSocial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("settings");
  const networks = SOCIAL_NETWORKS.map((n) => n.id) as string[];
  const out: SocialLink[] = [];
  for (let i = 0; i < 6; i++) {
    const url = str(fd, `url_${i}`);
    const network = str(fd, `network_${i}`);
    if (!url) continue;
    const safe = safeUrl(url);
    if (!safe || !/^https?:\/\//.test(safe)) return { ok: false, message: `El enlace de la fila ${i + 1} debe comenzar con https://`, errors: { [`url_${i}`]: "Enlace no válido." } };
    if (!networks.includes(network)) return { ok: false, message: `Elige la red de la fila ${i + 1}.`, errors: { [`network_${i}`]: "Elige una red." } };
    const label = str(fd, `label_${i}`) || SOCIAL_NETWORKS.find((n) => n.id === network)!.label;
    out.push({ id: newId(), network: network as SocialLink["network"], label: label.slice(0, 40), url: safe });
  }
  await db.settings.save((s) => ({ ...s, social: out }));
  return { ok: true, message: `Redes sociales guardadas (${out.length}).` };
}

export async function saveCommunity(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("settings");
  const out: CommunityLink[] = [];
  for (let i = 0; i < 8; i++) {
    const url = str(fd, `url_${i}`);
    const label = str(fd, `label_${i}`);
    if (!url && !label) continue;
    const safe = safeUrl(url);
    if (!label) return { ok: false, message: `Falta el nombre en la fila ${i + 1}.`, errors: { [`label_${i}`]: "Escribe un nombre." } };
    if (!safe) return { ok: false, message: `El enlace de la fila ${i + 1} no es válido (debe comenzar con https:// o /).`, errors: { [`url_${i}`]: "Enlace no válido." } };
    out.push({ id: newId(), label: label.slice(0, 80), description: str(fd, `description_${i}`).slice(0, 160), url: safe });
  }
  await db.settings.save((s) => ({ ...s, community: out }));
  return { ok: true, message: `Accesos de la comunidad guardados (${out.length}).` };
}

export async function saveHero(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("settings");
  const title = str(fd, "title");
  const subtitle = str(fd, "subtitle");
  if (title.length < 3 || title.length > 80) return { ok: false, message: "El título debe tener entre 3 y 80 caracteres.", errors: { title: "Entre 3 y 80 caracteres." } };
  if (subtitle.length < 10 || subtitle.length > 240) return { ok: false, message: "El mensaje debe tener entre 10 y 240 caracteres.", errors: { subtitle: "Entre 10 y 240 caracteres." } };
  const current = (await db.settings.get()).hero.slides;
  const slides: HeroSlide[] = [];
  try {
    for (let i = 0; i < current.length; i++) {
      const keep = fd.get(`slide_del_${i}`) !== "on";
      if (keep) slides.push({ mediaId: current[i].mediaId, alt: str(fd, `slide_alt_${i}`).slice(0, 200) || "Fotografía institucional" });
      else await deleteMedia(current[i].mediaId);
    }
    for (const f of fd.getAll("slide_new").filter(isFile)) {
      if (slides.length >= 6) break;
      const rec = await saveUpload(f, { accept: "image" });
      slides.push({ mediaId: rec.id, alt: "Fotografía institucional de la Escuela Particular Monterrey" });
    }
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, message: err.message };
    throw err;
  }
  await db.settings.save((s) => ({ ...s, hero: { title, subtitle, slides } }));
  return { ok: true, message: "Portada actualizada." };
}

export async function saveTexts(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await assertCan("settings");
  const texts: Record<string, string> = {};
  for (const f of TEXT_FIELDS) {
    const v = raw(fd, f.key).trim();
    if (v.length > 4000) return { ok: false, message: `«${f.label}» es demasiado largo (máximo 4000 caracteres).`, errors: { [f.key]: "Máximo 4000 caracteres." } };
    texts[f.key] = v || f.default; // en blanco = restablecer el texto original
  }
  await db.settings.save((s) => ({ ...s, texts }));
  return { ok: true, message: "Textos actualizados." };
}
