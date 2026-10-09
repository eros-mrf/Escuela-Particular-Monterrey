import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter, TopBar } from "@/components/layout/SiteChrome";

export default function NotFound() {
  return (
    <>
      <TopBar />
      <SiteHeader />
      <main id="contenido" className="container-page flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-8xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold">No encontramos esta página</h1>
        <p className="mt-3 max-w-lg text-lg text-muted">Es posible que el enlace haya cambiado o que el contenido ya no esté publicado.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Volver al inicio</Link>
          <Link href="/buscar" className="btn btn-outline">Buscar en el sitio</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
