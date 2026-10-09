import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions/auth";
import { AdminNav, type NavEntry } from "@/components/admin/AdminNav";
import { can, type SessionUser } from "@/lib/auth";

const ENTRIES: (NavEntry & { area?: Parameters<typeof can>[1] })[] = [
  { href: "/admin", label: "Resumen", icon: "home", exact: true },
  { href: "/admin/noticias", label: "Noticias", icon: "news", area: "news" },
  { href: "/admin/eventos", label: "Calendario", icon: "calendar", area: "events" },
  { href: "/admin/comunicados", label: "Comunicados", icon: "megaphone", area: "announcements" },
  { href: "/admin/avisos", label: "Avisos prioritarios", icon: "alert", area: "alerts" },
  { href: "/admin/galerias", label: "Galerías", icon: "image", area: "galleries" },
  { href: "/admin/documentos", label: "Documentos", icon: "file", area: "documents" },
  { href: "/admin/equipo", label: "Equipo directivo", icon: "users", area: "team" },
  { href: "/admin/preguntas", label: "Preguntas frecuentes", icon: "info", area: "faqs" },
  { href: "/admin/configuracion", label: "Portada y contacto", icon: "settings", area: "settings" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "lock", area: "users" },
];

export function AdminShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const items = ENTRIES.filter((e) => !e.area || can(user, e.area)).map(({ area: _area, ...rest }) => rest);
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#contenido-admin" className="sr-only z-[60] rounded-b-xl bg-sun px-5 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-0">Saltar al contenido</a>
      <aside className="bg-ink text-[#c5d3e8] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 p-4 lg:block lg:p-5">
          <Link href="/admin" className="inline-block rounded-xl bg-white px-3 py-1.5" aria-label="Panel de administración, inicio">
            <Image src="/logo.png" alt="Escuela Particular Monterrey" width={900} height={436} className="h-11 w-auto" />
          </Link>
          <p className="hidden pt-4 text-sm lg:block">Panel de administración</p>
        </div>
        <AdminNav items={items} />
        <div className="space-y-2 border-t border-white/10 p-4 text-sm">
          <p className="font-semibold text-white">{user.name}</p>
          <p className="break-all">{user.email}</p>
          <p><span className="rounded-full bg-white/15 px-2.5 py-0.5 font-bold">{user.role === "admin" ? "Administrador general" : "Editor"}</span></p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 font-semibold">
            <Link href="/" target="_blank" className="text-sun hover:underline">Ver sitio ↗</Link>
            <Link href="/admin/cambiar-clave" className="text-sun hover:underline">Cambiar clave</Link>
          </div>
          <form action={logout}>
            <button type="submit" className="btn btn-sun btn-sm mt-2 w-full">Cerrar sesión</button>
          </form>
        </div>
      </aside>
      <main id="contenido-admin" tabIndex={-1} className="min-w-0 p-4 outline-none sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
