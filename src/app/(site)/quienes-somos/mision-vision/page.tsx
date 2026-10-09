import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/common";
import { MISSION, PEI_PERIOD, VISION } from "@/content/pei";

export const metadata: Metadata = {
  title: "Misión y visión",
  description: "Misión y visión oficiales de la Escuela Particular Monterrey, según su Proyecto Educativo Institucional.",
  alternates: { canonical: "/quienes-somos/mision-vision" },
};

export default function MisionVisionPage() {
  return (
    <>
      <PageHeader title="Misión y visión" eyebrow="Proyecto Educativo Institucional" crumbs={[{ label: "Quiénes somos", href: "/quienes-somos" }]} />
      <Section>
        <div className="mx-auto grid max-w-5xl gap-6">
          <article className="relative overflow-hidden rounded-[2rem] bg-brand p-9 text-white sm:p-14">
            <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full bg-white/10" />
            <h2 className="relative text-sm font-sans font-bold uppercase tracking-[0.14em] !text-sun">Nuestra misión</h2>
            <p className="relative mt-5 font-display text-2xl font-medium leading-snug sm:text-[2rem] sm:leading-snug">{MISSION}</p>
          </article>
          <article className="relative overflow-hidden rounded-[2rem] bg-sun-tint p-9 text-[#2a2000] sm:p-14">
            <div aria-hidden="true" className="absolute -right-20 -top-20 size-72 rounded-full bg-sun/40" />
            <h2 className="relative text-sm font-sans font-bold uppercase tracking-[0.14em] !text-[#6b4a00]">Nuestra visión</h2>
            <p className="relative mt-5 font-display text-2xl font-medium leading-snug sm:text-[2rem] sm:leading-snug">{VISION}</p>
          </article>
          <p className="text-sm text-muted">Textos oficiales del Proyecto Educativo Institucional {PEI_PERIOD}, secciones 2.2 y 2.3.</p>
        </div>
      </Section>
    </>
  );
}
