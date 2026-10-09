import type { Metadata } from "next";
import { PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { ATTITUDES, PILLARS, PILLARS_NOTE, PRINCIPLES, SEALS, VALUES } from "@/content/pei";

export const metadata: Metadata = {
  title: "Sellos educativos y valores",
  description: "Sellos educativos, principios, valores y actitudes que orientan el proyecto educativo de la Escuela Particular Monterrey.",
  alternates: { canonical: "/quienes-somos/sellos-y-valores" },
};

export default function SellosPage() {
  return (
    <>
      <PageHeader title="Sellos educativos y valores" eyebrow="Proyecto Educativo Institucional" crumbs={[{ label: "Quiénes somos", href: "/quienes-somos" }]} />

      <Section id="sellos">
        <SectionTitle eyebrow="Sellos educativos" title="Lo que nos distingue" />
        <ul className="grid gap-5 lg:grid-cols-3">
          {SEALS.map((s) => (
            <li key={s.id} className="card p-8">
              <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-ink text-sun"><Icon name={s.icon} size={28} /></span>
              <h3 className="font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-lg text-[#35414f]">{s.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" id="pilares">
        <SectionTitle eyebrow="Pilares de nuestra acción pedagógica" title="Aprender a ser, aprender, convivir y hacer" description={PILLARS_NOTE} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <li key={p.title} className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name={p.icon} size={26} /></span>
              <span className="font-display text-xl font-bold">{p.title}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="principios">
        <SectionTitle eyebrow="Principios" title="Los fundamentos de nuestro proyecto" />
        <ul className="grid gap-5 md:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="card p-7">
              <h3 className="font-display text-xl font-bold text-brand">{p.title}</h3>
              <p className="mt-2 text-[#35414f]">{p.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sky" id="valores">
        <SectionTitle eyebrow="Valores" title="Cinco valores que cultivamos cada día" />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v) => (
            <li key={v.title} className="rounded-3xl bg-white p-7">
              <h3 className="font-display text-xl font-bold">{v.title}</h3>
              <p className="mt-2 text-[#35414f]">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="actitudes">
        <SectionTitle eyebrow="Actitudes" title="Cómo se expresan en la convivencia" />
        <ul className="grid gap-3 md:grid-cols-2">
          {ATTITUDES.map((a) => (
            <li key={a} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
              <Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
