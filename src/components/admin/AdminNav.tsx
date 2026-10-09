"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Settings } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

export interface NavEntry {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}

function NavIcon({ name }: { name: string }) {
  if (name === "home") return <Home size={19} aria-hidden="true" strokeWidth={1.9} />;
  if (name === "settings") return <Settings size={19} aria-hidden="true" strokeWidth={1.9} />;
  return <Icon name={name} size={19} />;
}

export function AdminNav({ items }: { items: NavEntry[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <nav aria-label="Secciones del panel" className="px-3 pb-3">
      <button type="button" className="btn btn-sun btn-sm mb-2 w-full lg:hidden" aria-expanded={open} aria-controls="admin-menu" onClick={() => setOpen((v) => !v)}>
        {open ? "Cerrar menú" : "Menú del panel"}
      </button>
      <ul id="admin-menu" className={`${open ? "block" : "hidden"} space-y-1 lg:block`}>
        {items.map((it) => {
          const active = it.exact ? pathname === it.href : pathname === it.href || pathname.startsWith(`${it.href}/`);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 font-semibold ${active ? "bg-brand text-white" : "hover:bg-white/10 hover:text-white"}`}
              >
                <NavIcon name={it.icon} />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
