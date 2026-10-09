import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLink, Notice, PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import {
  LEVELS,
  PEDAGOGICAL_MODEL,
  PEI_PDF_URL,
  PIE_STRATEGIES,
  PILLARS,
  PROGRAMS,
  SEALS,
  STUDY_PLAN,
  SUPPORT_PROGRAMS,
  WORKSHOPS,
} from "@/content/pei";

export const metadata: Metadata = {
  title: "Proyecto educativo y formación",
  description: "Enfoque pedagógico, niveles, formación integral, inclusión, talleres y recursos de aprendizaje de la Escuela Particular Monterrey.",
  alternates: { canonical: "/formacion" },
};

const SUBNAV = [
  ["enfoque", "Enfoque pedagógico"],
  ["niveles", "Niveles"],
  ["integral", "Formación integral"],
  ["inclusion", "Inclusión y apoyo"],
  ["talleres", "Talleres y plan de estudios"],
  ["recursos", "Biblioteca y recursos"],
  ["convivencia", "Convivencia"],
];

export default function FormacionPage() {
  return (
    <>
      <PageHeader
        title="Proyecto educativo y formación"
        eyebrow="Propuesta pedagógica"
        description="Una formación integral e inclusiva, con altas expectativas de aprendizaje y apoyo para cada niño y niña."
      >
        <a href={PEI_PDF_URL} target="_blank" rel="noopener noreferrer" className="btn btn-sun"><Icon name="file" size={18} /> Leer el PEI completo</a>
      </PageHeader>

      <nav aria-label="Secciones de esta página" className="sticky top-[4.25rem] z-30 border-b border-line bg-cream">
        <ul className="container-page flex gap-1 overflow-x-auto py-2 text-[0.95rem] font-semibold">
          {SUBNAV.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} className="flex min-h-11 items-center rounded-xl px-3.5 hover:bg-sky">{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="enfoque">
        <SectionTitle eyebrow="Enfoque pedagógico" title="Un modelo por competencias" description={PEDAGOGICAL_MODEL.intro} />
        <ul className="grid gap-5 md:grid-cols-3">
          {PEDAGOGICAL_MODEL.knowledge.map((k, i) => (
            <li key={k.title} className="card p-7">
              <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-ink font-display text-xl font-extrabold text-sun">{i + 1}</span>
              <h3 className="font-display text-xl font-bold">{k.title}</h3>
              <p className="mt-2 text-[#35414f]">{k.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl bg-sky p-7">
            <h3 className="font-display text-xl font-bold">Diseño Universal para el Aprendizaje (DUA)</h3>
            <p className="mt-2 text-[#35414f]">{PEDAGOGICAL_MODEL.dua}</p>
          </article>
          <article className="rounded-3xl bg-sun-tint p-7 text-[#2a2000]">
            <h3 className="font-display text-xl font-bold !text-[#2a2000]">Matemática con metodología Singapur</h3>
            <p className="mt-2">{PEDAGOGICAL_MODEL.math}</p>
          </article>
        </div>
        <article className="mt-5 rounded-3xl border border-line bg-white p-7">
          <h3 className="font-display text-xl font-bold">Cómo evaluamos</h3>
          <p className="mt-2 text-[#35414f]">{PEDAGOGICAL_MODEL.evaluation}</p>
        </article>
      </Section>

      <Section tone="paper" id="niveles">
        <SectionTitle eyebrow="Niveles educativos" title="De Nivel de Transición 1 a 8° básico" description="La escuela trabaja con los planes y programas del Ministerio de Educación, en Jornada Escolar Completa." />
        <div className="grid gap-5 md:grid-cols-2">
          {LEVELS.map((l) => (
            <section key={l.group} className="rounded-3xl bg-white p-7" aria-label={l.group}>
              <h3 className="font-display text-xl font-bold text-brand">{l.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {l.courses.map((c) => (
                  <li key={c} className="rounded-xl bg-sky px-4 py-2 font-semibold text-ink">{c}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>

      <Section id="integral">
        <SectionTitle eyebrow="Formación integral" title="Cuatro pilares y tres sellos" description="Nuestro proceso formativo se alza sobre los cuatro pilares de la educación del Informe Delors y sobre los sellos de nuestro proyecto." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <li key={p.title} className="flex items-center gap-4 rounded-3xl border border-line bg-white p-6">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name={p.icon} size={26} /></span>
              <span className="font-display text-lg font-bold">{p.title}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {SEALS.map((s) => (
            <li key={s.id} className="rounded-3xl bg-ink p-7 text-white">
              <h3 className="font-display text-lg font-bold !text-sun">{s.title}</h3>
              <p className="mt-2 text-[#dce6f5]">{s.text}</p>
            </li>
          ))}
        </ul>
        <ArrowLink href="/quienes-somos/sellos-y-valores" className="mt-8">Principios, valores y actitudes</ArrowLink>
      </Section>

      <Section tone="sky" id="inclusion">
        <SectionTitle eyebrow="Inclusión y apoyo educativo" title="Una escuela que valora las diferencias" description="Programa de Integración Escolar «Aceptando nuestras diferencias» (Decreto N° 170), desde 2003; en 2012 se sumó el programa para necesidades educativas transitorias." />
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl bg-white p-7">
            <h3 className="font-display text-xl font-bold">Programas de apoyo a estudiantes</h3>
            <ul className="mt-4 space-y-3">
              {SUPPORT_PROGRAMS.map((s) => (
                <li key={s} className="flex gap-3"><Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand" />{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-7">
            <h3 className="font-display text-xl font-bold">Estrategias del PIE</h3>
            <ul className="mt-4 space-y-3">
              {PIE_STRATEGIES.map((s) => (
                <li key={s.strategy} className="border-b border-line pb-3 last:border-0 last:pb-0">
                  <p className="font-semibold text-ink">{s.strategy}</p>
                  <p className="text-[0.95rem] text-muted">{s.activity}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="talleres">
        <SectionTitle eyebrow="Actividades complementarias" title="Talleres que enriquecen la formación" description="La malla curricular contempla los siguientes talleres, entre otros, que contribuyen a la formación integral de los estudiantes de pre-básica y básica." />
        <ul className="flex flex-wrap gap-3">
          {WORKSHOPS.map((w) => (
            <li key={w} className="rounded-2xl border-2 border-brand/20 bg-white px-5 py-3 font-display text-lg font-bold text-ink">{w}</li>
          ))}
        </ul>
        <Notice tone="warn">
          Listado según el PEI. Los talleres vigentes cada año pueden variar: consulta en secretaría o revisa las noticias y comunicados.
        </Notice>

        <h3 className="mb-4 mt-12 font-display text-2xl font-extrabold">Plan de estudios (horas semanales)</h3>
        <div className="space-y-4">
          {STUDY_PLAN.map((p) => (
            <details key={p.title} className="group rounded-2xl border border-line bg-white" open={p.title.startsWith("1°")}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-3 font-display text-lg font-bold">
                {p.title}
                <Icon name="down" size={20} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto px-6 pb-6">
                <table className="w-full min-w-[26rem] border-collapse text-left">
                  <caption className="sr-only">Horas semanales por asignatura, {p.title}</caption>
                  <thead>
                    <tr className="bg-sky">
                      <th scope="col" className="rounded-l-xl px-4 py-2.5">Asignatura</th>
                      {p.grades.map((g, i) => (
                        <th key={g} scope="col" className={`px-4 py-2.5 text-center ${i === p.grades.length - 1 ? "rounded-r-xl" : ""}`}>{g}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.rows.map((r) => (
                      <tr key={r.subject} className="border-b border-line last:border-0">
                        <th scope="row" className="px-4 py-2.5 font-semibold">{r.subject}</th>
                        {r.hours.map((h, i) => (
                          <td key={i} className="px-4 py-2.5 text-center">{h ?? "—"}</td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-paper font-bold">
                      <th scope="row" className="rounded-l-xl px-4 py-2.5">Total</th>
                      {p.grades.map((g, i) => (
                        <td key={g} className={`px-4 py-2.5 text-center ${i === p.grades.length - 1 ? "rounded-r-xl" : ""}`}>
                          {p.rows.reduce((sum, r) => sum + (r.hours[i] ?? 0), 0)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">Fuente: PEI 2019–2023, sección 4.3. «Taller JECD» corresponde a las horas de libre disposición de la jornada completa.</p>
      </Section>

      <Section tone="paper" id="recursos">
        <SectionTitle eyebrow="Biblioteca y recursos de aprendizaje" title="Herramientas al servicio del aprendizaje" description="Proyectos y plataformas declarados en el PEI, con su año de inicio." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <li key={p.name + p.since} className="rounded-3xl bg-white p-6">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-ink px-3 py-1 text-sm font-bold text-white">{p.name}</span>
                <span className="text-sm font-semibold text-muted">Desde {p.since}</span>
              </div>
              <p className="font-semibold text-ink">{p.title}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">Según el PEI 2019–2023. Las plataformas de uso actual se informan a las familias por los canales oficiales.</p>
      </Section>

      <Section id="convivencia">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-brand p-8 text-white sm:p-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold !text-white">Convivencia y bienestar escolar</h2>
            <p className="mt-3 text-lg text-white/90">Un ambiente seguro, de respeto y valoración para toda la comunidad educativa es condición para aprender.</p>
          </div>
          <Link href="/convivencia" className="btn btn-sun">Ver convivencia escolar <Icon name="arrow" size={18} /></Link>
        </div>
      </Section>
    </>
  );
}
