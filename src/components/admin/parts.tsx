import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

export function AdminPageHeader({ title, description, actions, back }: { title: string; description?: string; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <header className="mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
          <Icon name="left" size={16} /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

const FLASH: Record<string, string> = {
  publicada: "Publicado correctamente. Ya es visible en el sitio.",
  borrador: "Guardado como borrador. Aún no es visible en el sitio.",
  despublicada: "Se despublicó. Ya no es visible en el sitio.",
  eliminada: "Eliminado correctamente.",
  guardado: "Cambios guardados.",
  creado: "Creado correctamente.",
  "sin-permiso": "Tu rol no tiene permiso para esa sección.",
  "clave-cambiada": "Tu contraseña se actualizó correctamente.",
};

export function Flash({ code, tone = "ok" }: { code?: string; tone?: "ok" | "warn" }) {
  if (!code || !FLASH[code]) return null;
  return (
    <p role="status" className={`mb-6 rounded-2xl border p-4 font-semibold ${tone === "ok" && code !== "sin-permiso" ? "border-[#b7e0c4] bg-[#e8f6ed] text-[#14532d]" : "border-[#f0d982] bg-sun-tint text-[#4a3600]"}`}>
      {code === "sin-permiso" ? "⚠ " : "✓ "}
      {FLASH[code]}
    </p>
  );
}

export function StatusPill({ status, label }: { status: "published" | "draft" | "scheduled" | "off" | "demo"; label?: string }) {
  const map = {
    published: ["bg-[#e8f6ed] text-[#14532d]", "Publicado"],
    draft: ["bg-paper text-[#55606f] border border-line", "Borrador"],
    scheduled: ["bg-sky text-brand", "Programado"],
    off: ["bg-paper text-[#55606f] border border-line", "Inactivo"],
    demo: ["bg-sun-tint text-sun-deep border border-dashed border-sun-deep", "Demostración"],
  } as const;
  const [cls, text] = map[status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{label ?? text}</span>;
}

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card p-5 sm:p-7 ${className}`}>
      {title && <h2 className="mb-4 font-display text-xl font-bold">{title}</h2>}
      {children}
    </section>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-[#b9b39b] bg-white/60 p-8 text-center text-muted">{children}</p>;
}
