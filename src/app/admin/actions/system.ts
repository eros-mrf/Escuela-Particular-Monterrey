"use server";

import { redirect } from "next/navigation";
import { assertCan } from "@/lib/auth";
import { db } from "@/lib/db/store";
import { deleteMedia } from "@/lib/media";

/** Elimina todo el contenido marcado como «demostración» (y sus archivos). */
export async function purgeDemoContent(): Promise<void> {
  await assertCan("settings");
  const news = (await db.news.all()).filter((n) => n.demo);
  for (const n of news) {
    await deleteMedia(n.coverMediaId);
    for (const g of n.gallery) await deleteMedia(g.mediaId);
    for (const a of n.attachments) await deleteMedia(a.mediaId);
    await db.news.remove(n.id);
  }
  for (const e of (await db.events.all()).filter((x) => x.demo)) {
    await deleteMedia(e.imageMediaId);
    for (const a of e.attachments) await deleteMedia(a.mediaId);
    await db.events.remove(e.id);
  }
  for (const a of (await db.announcements.all()).filter((x) => x.demo)) {
    for (const att of a.attachments) await deleteMedia(att.mediaId);
    await db.announcements.remove(a.id);
  }
  for (const a of (await db.alerts.all()).filter((x) => x.demo)) await db.alerts.remove(a.id);
  for (const d of (await db.documents.all()).filter((x) => x.demo)) {
    if (d.file.kind === "media") await deleteMedia(d.file.mediaId);
    await db.documents.remove(d.id);
  }
  for (const g of (await db.galleries.all()).filter((x) => x.demo)) {
    for (const i of g.images) await deleteMedia(i.mediaId);
    await db.galleries.remove(g.id);
  }
  redirect("/admin?aviso=eliminada");
}
