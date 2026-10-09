import type { Metadata } from "next";
import { Notice, PageHeader, Section } from "@/components/ui/common";
import { HistoryTimeline } from "@/components/motion/HistoryTimeline";
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
        <HistoryTimeline items={[...HISTORY]} />
        <div className="mx-auto mt-14 max-w-3xl">
          <Notice title="Fuente de la información" tone="info">
            Reseña histórica tomada del Proyecto Educativo Institucional 2019–2023 (sección 3.2). La dirección puede ampliar esta línea de tiempo con hitos posteriores, una vez verificados.
          </Notice>
        </div>
      </Section>
    </>
  );
}
