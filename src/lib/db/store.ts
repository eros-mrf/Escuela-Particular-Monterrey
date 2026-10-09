import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { DATA_DIR } from "@/lib/env";
import { defaultDocuments, defaultFaqs, defaultSettings, defaultTeam } from "@/content/defaults";
import type {
  Announcement,
  DocumentItem,
  EventItem,
  Faq,
  GalleryItem,
  MediaRecord,
  NewsItem,
  PriorityAlert,
  Settings,
  TeamMember,
  User,
} from "@/lib/db/types";

/**
 * Base de datos en archivos JSON (una por colección) dentro de DATA_DIR/db.
 *
 * Es una persistencia REAL en el servidor: lo que se publica desde el panel se conserva al
 * reiniciar y lo ven todos los visitantes. Requiere un servidor con disco persistente
 * (VPS, Docker con volumen, etc.). La interfaz de `Collection` es deliberadamente pequeña para
 * poder reemplazarla por Supabase/Postgres sin tocar las páginas (ver docs/PERSISTENCIA.md).
 */

const DB_DIR = path.join(DATA_DIR, "db");
const locks = new Map<string, Promise<unknown>>();

function withLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(name) ?? Promise.resolve();
  const run = prev.catch(() => undefined).then(fn);
  locks.set(name, run.catch(() => undefined));
  return run;
}

async function readJson<T>(name: string, fallback: () => T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DB_DIR, `${name}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback();
    throw err;
  }
}

async function writeJson(name: string, data: unknown): Promise<void> {
  await fs.mkdir(DB_DIR, { recursive: true });
  const target = path.join(DB_DIR, `${name}.json`);
  const tmp = `${target}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, target); // escritura atómica
}

export function newId(): string {
  return randomBytes(9).toString("base64url");
}

class Collection<T extends { id: string }> {
  constructor(
    private readonly name: string,
    private readonly defaults: () => T[] = () => [],
  ) {}

  all(): Promise<T[]> {
    return readJson<T[]>(this.name, this.defaults);
  }

  async find(id: string): Promise<T | null> {
    return (await this.all()).find((r) => r.id === id) ?? null;
  }

  insert(item: T): Promise<T> {
    return withLock(this.name, async () => {
      const rows = await this.all();
      rows.push(item);
      await writeJson(this.name, rows);
      return item;
    });
  }

  update(id: string, fn: (current: T) => T): Promise<T | null> {
    return withLock(this.name, async () => {
      const rows = await this.all();
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      rows[idx] = fn(rows[idx]);
      await writeJson(this.name, rows);
      return rows[idx];
    });
  }

  remove(id: string): Promise<T | null> {
    return withLock(this.name, async () => {
      const rows = await this.all();
      const idx = rows.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      const [removed] = rows.splice(idx, 1);
      await writeJson(this.name, rows);
      return removed;
    });
  }

  replaceAll(rows: T[]): Promise<void> {
    return withLock(this.name, () => writeJson(this.name, rows));
  }
}

const settingsStore = {
  async get(): Promise<Settings> {
    const base = defaultSettings();
    const saved = await readJson<Partial<Settings>>("settings", () => ({}));
    return {
      contact: { ...base.contact, ...saved.contact },
      social: saved.social ?? base.social,
      community: saved.community ?? base.community,
      hero: { ...base.hero, ...saved.hero, slides: saved.hero?.slides ?? base.hero.slides },
      texts: { ...base.texts, ...saved.texts },
    };
  },
  save(mutate: (current: Settings) => Settings): Promise<Settings> {
    return withLock("settings", async () => {
      const next = mutate(await settingsStore.get());
      await writeJson("settings", next);
      return next;
    });
  },
};

export const db = {
  users: new Collection<User>("users"),
  news: new Collection<NewsItem>("news"),
  events: new Collection<EventItem>("events"),
  announcements: new Collection<Announcement>("announcements"),
  alerts: new Collection<PriorityAlert>("alerts"),
  documents: new Collection<DocumentItem>("documents", defaultDocuments),
  galleries: new Collection<GalleryItem>("galleries"),
  team: new Collection<TeamMember>("team", defaultTeam),
  faqs: new Collection<Faq>("faqs", defaultFaqs),
  media: new Collection<MediaRecord>("media"),
  settings: settingsStore,
};
