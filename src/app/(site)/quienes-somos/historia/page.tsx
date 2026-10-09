import type { Metadata } from "next";
import { Notice, PageHeader, Section } from "@/components/ui/common";
import { HISTORY } from "@/content/pei";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description: "Reseña histórica de la Escuela Particular Monterrey: desde su fundación en 1982 hasta hoy.",
  alternates: { canonical: "/quienes-somos/historia" },
};

export default function HistoriaPage() {
  return (
    <>
      <PageHeader
        title="Nuestra historia"
        eyebrow="Desde 1982"
        crumbs={[{ label: "Quiénes somos", href: "/quienes-somos" }]}
        description="Una escuela que nació para responder a las necesidades de educación de un pequeño lugar de la comuna de Vilcún llamado Monterrey, al que debe su nombre."
      />
      <Section>
        <ol className="relative mx-auto max-w-3xl border-l-4 border-sky-2 pl-8 sm:pl-12">
          {HISTORY.map((h) => (
            <li key={h.year + h.text.slice(0, 10)} className="relative pb-10 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[2.9rem] top-1 flex size-5 items-center justify-center rounded-full border-4 border-cream bg-sun sm:-left-[3.65rem]" />
              <p className="font-display text-3xl font-extrabold text-brand">{h.year}</p>
              <p className="mt-2 text-lg text-[#35414f]">{h.text}</p>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-14 max-w-3xl">
          <Notice title="Fuente de la información" tone="info">
            Reseña histórica tomada del Proyecto Educativo Institucional 2019–2023 (sección 3.2). La dirección puede ampliar esta línea de tiempo con hitos posteriores, una vez verificados.
          </Notice>
        </div>
      </Section>
    </>
  );
}
