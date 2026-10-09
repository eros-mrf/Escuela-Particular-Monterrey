import "server-only";
import { cache } from "react";
import { db } from "@/lib/db/store";
import { todayCL } from "@/lib/time";
import type { Announcement, DocumentItem, EventItem, Faq, GalleryItem, NewsItem, PriorityAlert, TeamMember } from "@/lib/db/types";
import { TEXT_FIELDS } from "@/lib/constants";

/** Lecturas de contenido PÚBLICO: aquí se filtran borradores, vencidos y programados. */

export const getSettings = cache(() => db.settings.get());

export async function getText(key: (typeof TEXT_FIELDS)[number]["key"]): Promise<string> {
  const s = await getSettings();
  return s.texts[key] ?? "";
}

export function sortNews(rows: NewsItem[]): NewsItem[] {
  return [...rows].sort((a, b) => (b.publishedAt === a.publishedAt ? b.createdAt.localeCompare(a.createdAt) : b.publishedAt.localeCompare(a.publishedAt)));
}

export const publicNews = cache(async (): Promise<NewsItem[]> => {
  const today = todayCL();
  return sortNews((await db.news.all()).filter((n) => n.status === "published" && n.publishedAt <= today));
});

export function eventSort(a: EventItem, b: EventItem): number {
  return a.date === b.date ? (a.startTime ?? "").localeCompare(b.startTime ?? "") : a.date.localeCompare(b.date);
}

export const allEvents = cache(async (): Promise<EventItem[]> => (await db.events.all()).sort(eventSort));

export async function upcomingEvents(limit?: number): Promise<EventItem[]> {
  const today = todayCL();
  const rows = (await allEvents()).filter((e) => (e.endDate ?? e.date) >= today);
  return limit ? rows.slice(0, limit) : rows;
}

export type Vigencia = "vigente" | "archivado" | "programado";

export function announcementState(a: Announcement, today = todayCL()): Vigencia {
  if (a.publishedAt > today) return "programado";
  if (a.expiresAt && a.expiresAt < today) return "archivado";
  return "vigente";
}

export const publicAnnouncements = cache(async (): Promise<(Announcement & { state: Vigencia })[]> => {
  const today = todayCL();
  return (await db.announcements.all())
    .filter((a) => a.status === "published")
    .map((a) => ({ ...a, state: announcementState(a, today) }))
    .filter((a) => a.state !== "programado")
    .sort((a, b) => (b.publishedAt === a.publishedAt ? b.createdAt.localeCompare(a.createdAt) : b.publishedAt.localeCompare(a.publishedAt)));
});

export async function activeAnnouncements(limit?: number) {
  const rows = (await publicAnnouncements()).filter((a) => a.state === "vigente").sort((a, b) => Number(b.pinned) - Number(a.pinned));
  return limit ? rows.slice(0, limit) : rows;
}

export function alertIsLive(a: PriorityAlert, today = todayCL()): boolean {
  return a.active && a.startsAt <= today && a.expiresAt >= today;
}

export async function liveAlerts(): Promise<PriorityAlert[]> {
  const today = todayCL();
  return (await db.alerts.all()).filter((a) => alertIsLive(a, today));
}

export const publicDocuments = cache(async (): Promise<DocumentItem[]> =>
  (await db.documents.all()).filter((d) => d.published).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
);

export const publicGalleries = cache(async (): Promise<GalleryItem[]> =>
  (await db.galleries.all()).filter((g) => g.published && g.images.length > 0).sort((a, b) => b.date.localeCompare(a.date)),
);

export async function publicTeam(): Promise<TeamMember[]> {
  return (await db.team.all()).filter((m) => m.published).sort((a, b) => a.order - b.order);
}

export async function publicFaqs(): Promise<Faq[]> {
  return (await db.faqs.all()).filter((f) => f.published).sort((a, b) => a.order - b.order);
}

export function documentHref(d: DocumentItem): string {
  return d.file.kind === "static" ? d.file.url : `/media/${d.file.mediaId}`;
}
