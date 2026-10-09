import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({ title, intro, children, footer }: { title: string; intro?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <main id="contenido" className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex justify-center" aria-label="Volver al sitio público">
          <span className="rounded-2xl bg-white px-4 py-2 shadow-sm">
            <Image src="/logo.png" alt="Escuela Particular Monterrey" width={900} height={436} className="h-16 w-auto" priority />
          </span>
        </Link>
        <div className="card p-7 shadow-card sm:p-9">
          <p className="eyebrow">Panel de administración</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold">{title}</h1>
          {intro && <p className="mt-2 text-muted">{intro}</p>}
          <div className="mt-6">{children}</div>
        </div>
        <div className="mt-5 text-center text-sm text-muted">{footer ?? <Link href="/" className="font-semibold text-brand underline underline-offset-4">← Volver al sitio público</Link>}</div>
      </div>
    </main>
  );
}
