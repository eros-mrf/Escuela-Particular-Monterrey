"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SITE_NAV } from "@/lib/constants";
import { cx } from "@/lib/utils";

type NavItem = (typeof SITE_NAV)[number];

function isActive(pathname: string, item: NavItem): boolean {
  const base = item.href.split("#")[0];
  if (pathname === base || pathname.startsWith(`${base}/`)) return true;
  return "children" in item && item.children.some((c) => c.href.split("#")[0] === pathname);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Cierra los menús al navegar.
  useEffect(() => {
    setOpen(null);
    setMobile(false);
    setSearching(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierre con clic fuera y tecla Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setSearching(false);
        if (mobile) {
          setMobile(false);
          burgerRef.current?.focus();
        }
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobile]);

  useEffect(() => {
    if (searching) searchRef.current?.focus();
  }, [searching]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  function submitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className={cx("sticky top-0 z-40 border-b border-line bg-cream transition-shadow", scrolled && "shadow-[0_8px_24px_-16px_rgba(14,31,54,0.5)]")}>
      <div className={cx("container-page flex items-center justify-between gap-3 transition-[height] duration-200", scrolled ? "h-[4.25rem]" : "h-[4.75rem] lg:h-[5.25rem]")}>
        <Link href="/" aria-label="Escuela Particular Monterrey — ir al inicio" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Logotipo de la Escuela Particular N° 500 Monterrey"
            width={900}
            height={436}
            priority
            className={cx("w-auto transition-[height] duration-200", scrolled ? "h-11" : "h-12 lg:h-14")}
          />
        </Link>

        {/* Navegación de escritorio */}
        <nav ref={navRef} aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-0.5 text-[0.97rem] font-semibold text-ink">
            {SITE_NAV.map((item) => {
              const active = isActive(pathname, item);
              const hasChildren = "children" in item;
              return (
                <li key={item.label} className="relative" onMouseLeave={() => hasChildren && setOpen(null)}>
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={open === item.label}
                        aria-haspopup="true"
                        onClick={() => setOpen(open === item.label ? null : item.label)}
                        onMouseEnter={() => setOpen(item.label)}
                        className={cx("nav-link flex min-h-11 items-center gap-1 rounded-xl px-3 hover:bg-sky", active && "text-brand")}
                      >
                        {item.label}
                        <Icon name="down" size={16} className={cx("transition-transform", open === item.label && "rotate-180")} />
                      </button>
                      {open === item.label && (
                        <div className="absolute left-0 top-full w-80 pt-2">
                          <ul className="rounded-2xl border border-line bg-white p-2 shadow-card">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <Link href={c.href} className="block rounded-xl px-3 py-2.5 hover:bg-sky">
                                  <span className="block font-bold text-ink">{c.label}</span>
                                  <span className="block text-sm font-normal text-muted">{c.desc}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cx("nav-link flex min-h-11 items-center rounded-xl px-3 hover:bg-sky", active && "text-brand")}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearching((v) => !v)}
            aria-expanded={searching}
            aria-controls="buscador-sitio"
            aria-label="Buscar en el sitio"
            className="flex size-11 items-center justify-center rounded-xl border border-[#cfc9b6] bg-white text-ink hover:border-ink"
          >
            <Icon name={searching ? "close" : "search"} size={20} />
          </button>
          <Link href="/contacto" className="btn btn-primary btn-sm hidden sm:inline-flex xl:inline-flex">Contáctanos</Link>
          <button
            ref={burgerRef}
            type="button"
            onClick={() => setMobile(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={mobile}
            aria-controls="menu-movil"
            className="flex size-11 items-center justify-center rounded-xl bg-ink text-white xl:hidden"
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </div>

      <div ref={barRef} aria-hidden="true" className="absolute -bottom-px left-0 h-[3px] w-full origin-left bg-sun" style={{ transform: "scaleX(0)" }} />

      {/* Buscador desplegable */}
      <div id="buscador-sitio" hidden={!searching} className="border-t border-line bg-white">
        <form role="search" onSubmit={submitSearch} action="/buscar" className="container-page flex gap-2 py-3">
          <label htmlFor="busqueda-global" className="sr-only">Buscar noticias, documentos, páginas y eventos</label>
          <input
            ref={searchRef}
            id="busqueda-global"
            name="q"
            type="search"
            required
            autoComplete="off"
            placeholder="Busca noticias, documentos, eventos o páginas…"
            className="field flex-1"
          />
          <button type="submit" className="btn btn-primary">Buscar</button>
        </form>
      </div>

      {/* Menú móvil */}
      {mobile && (
        <div id="menu-movil" role="dialog" aria-modal="true" aria-label="Menú de navegación" className="fixed inset-0 z-50 flex flex-col bg-cream xl:hidden">
          <div className="container-page flex h-[4.75rem] shrink-0 items-center justify-between border-b border-line">
            <Image src="/logo.png" alt="Escuela Particular Monterrey" width={900} height={436} className="h-12 w-auto" />
            <button type="button" onClick={() => { setMobile(false); burgerRef.current?.focus(); }} aria-label="Cerrar menú" className="flex size-11 items-center justify-center rounded-xl bg-ink text-white">
              <Icon name="close" size={22} />
            </button>
          </div>
          <nav aria-label="Menú móvil" className="flex-1 overflow-y-auto">
            <ul className="container-page py-4">
              {SITE_NAV.map((item) => {
                const hasChildren = "children" in item;
                const expanded = mobileSection === item.label;
                return (
                  <li key={item.label} className="border-b border-line">
                    {hasChildren ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => setMobileSection(expanded ? null : item.label)}
                          className="flex min-h-14 w-full items-center justify-between text-left font-display text-xl font-bold text-ink"
                        >
                          {item.label}
                          <Icon name="down" size={20} className={cx("transition-transform", expanded && "rotate-180")} />
                        </button>
                        {expanded && (
                          <ul className="mb-3 space-y-1">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <Link href={c.href} className="block rounded-xl px-3 py-3 hover:bg-sky">
                                  <span className="block font-bold text-ink">{c.label}</span>
                                  <span className="block text-sm text-muted">{c.desc}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link href={item.href} className="flex min-h-14 items-center font-display text-xl font-bold text-ink">
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="container-page grid shrink-0 grid-cols-2 gap-3 border-t border-line bg-white py-4">
            <Link href="/contacto" className="btn btn-primary">Contacto</Link>
            <Link href="/buscar" className="btn btn-outline">Buscar</Link>
          </div>
        </div>
      )}
    </header>
  );
}
