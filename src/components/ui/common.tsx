import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/utils";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm text-white/80">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="underline-offset-4 hover:underline">Inicio</Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {it.href ? (
              <Link href={it.href} className="underline-offset-4 hover:underline">{it.label}</Link>
            ) : (
              <span aria-current="page" className="font-semibold text-white">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Franja de título de página interior. */
export function PageHeader({
  title,
  eyebrow,
  description,
  crumbs = [],
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="drift-a pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand/60" />
      <div aria-hidden="true" className="drift-b pointer-events-none absolute -bottom-32 right-40 size-64 rounded-full bg-sun/20" />
      <div className="container-page relative py-12 sm:py-16">
        <Breadcrumbs items={[...crumbs, { label: title }]} />
        {eyebrow && <p className="eyebrow in mt-6 !text-sun" style={{ "--i": 1 } as CSSProperties}>{eyebrow}</p>}
        <h1 className="in mt-2 max-w-3xl font-display text-4xl font-extrabold leading-tight !text-white sm:text-5xl" style={{ "--i": 2 } as CSSProperties}>{title}</h1>
        {description && <p className="in mt-4 max-w-2xl text-lg text-white/85" style={{ "--i": 3 } as CSSProperties}>{description}</p>}
        {children && <div className="in mt-6" style={{ "--i": 4 } as CSSProperties}>{children}</div>}
      </div>
    </section>
  );
}

export function Section({
  children,
  className,
  tone = "plain",
  id,
  label,
}: {
  children: ReactNode;
  className?: string;
  tone?: "plain" | "paper" | "sky" | "ink";
  id?: string;
  label?: string;
}) {
  const tones = { plain: "", paper: "bg-paper", sky: "bg-sky", ink: "bg-ink text-white" };
  return (
    <section id={id} aria-label={label} className={cx("py-14 sm:py-20", tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <div className="max-w-2xl">
        <span aria-hidden="true" className="title-rule" />
        {eyebrow && <p className={cx("eyebrow", tone === "dark" && "!text-sun")}>{eyebrow}</p>}
        <h2 className={cx("mt-2 font-display text-3xl font-extrabold sm:text-4xl", tone === "dark" && "!text-white")}>{title}</h2>
        {description && <p className={cx("mt-3 text-lg", tone === "dark" ? "text-white/80" : "text-muted")}>{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}

export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cx("inline-flex items-center gap-2 border-b-2 border-sun pb-1 font-bold text-brand hover:text-brand-dark", className)}
    >
      {children}
      <Icon name="arrow" size={18} />
    </Link>
  );
}

export function Badge({ children, tone = "sky", className }: { children: ReactNode; tone?: "sky" | "sun" | "ink" | "outline" | "danger"; className?: string }) {
  const tones = {
    sky: "bg-sky text-brand",
    sun: "bg-sun text-ink",
    ink: "bg-ink text-white",
    outline: "border border-muted/40 text-muted",
    danger: "bg-[#fde8e8] text-[#9b1c1c]",
  };
  return <span className={cx("inline-flex items-center rounded-full px-3 py-0.5 text-[0.8125rem] font-bold", tones[tone], className)}>{children}</span>;
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-sun-deep bg-sun-tint px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-sun-deep">
      Demostración
    </span>
  );
}

export function EmptyState({ title, children, icon = "info" }: { title: string; children?: ReactNode; icon?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#b9b39b] bg-white/60 px-6 py-12 text-center">
      <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-sky text-brand">
        <Icon name={icon} size={26} />
      </span>
      <p className="font-display text-xl font-bold text-ink">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-xl text-muted">{children}</div>}
    </div>
  );
}

export function Notice({ children, tone = "info", title }: { children: ReactNode; tone?: "info" | "warn" | "ok"; title?: string }) {
  const tones = {
    info: "border-sky-2 bg-sky text-ink",
    warn: "border-[#f0d982] bg-sun-tint text-[#4a3600]",
    ok: "border-[#b7e0c4] bg-[#e8f6ed] text-[#14532d]",
  };
  return (
    <div role="note" className={cx("rounded-2xl border p-4 text-[0.97rem]", tones[tone])}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      {children}
    </div>
  );
}

export function Pagination({ page, pages, hrefFor }: { page: number; pages: number; hrefFor: (p: number) => string }) {
  if (pages <= 1) return null;
  const items: number[] = [];
  for (let p = 1; p <= pages; p++) if (p === 1 || p === pages || Math.abs(p - page) <= 1) items.push(p);
  return (
    <nav aria-label="Paginación" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className="btn btn-outline btn-sm" rel="prev">
          <Icon name="left" size={16} /> Anterior
        </Link>
      )}
      {items.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && items[i - 1] !== p - 1 && <span aria-hidden="true">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Página ${p}`}
            className={cx("flex size-11 items-center justify-center rounded-xl font-bold", p === page ? "bg-ink text-white" : "border border-line bg-white text-ink hover:border-ink")}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pages && (
        <Link href={hrefFor(page + 1)} className="btn btn-outline btn-sm" rel="next">
          Siguiente <Icon name="right" size={16} />
        </Link>
      )}
    </nav>
  );
}

/** Imagen de relleno cuando un contenido no tiene fotografía. */
export function ImagePlaceholder({ label = "Sin imagen", className }: { label?: string; className?: string }) {
  return (
    <div className={cx("placeholder-img flex items-center justify-center", className)} role="img" aria-label={label}>
      <Icon name="image" size={34} className="text-brand/40" />
    </div>
  );
}
