import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BackToTop } from "@/components/motion/BackToTop";
import { PriorityAlerts, SiteFooter, TopBar } from "@/components/layout/SiteChrome";

// El contenido lo publica el colegio desde el panel; se lee en cada visita.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#contenido" className="sr-only z-[60] rounded-b-xl bg-sun px-5 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-0">
        Saltar al contenido
      </a>
      <TopBar />
      <SiteHeader />
      <PriorityAlerts />
      <main id="contenido" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
