import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { PEI_PDF_URL, PEI_PERIOD, PROFILES, STRATEGIC_GOALS } from "@/content/pei";

export const metadata: Metadata = {
  title: "Nuestro proyecto educativo",
  description: "Presentación del Proyecto Educativo Institucional de la Escuela Particular Monterrey y descarga del documento en PDF.",
  alternates: { canonical: "/quienes-somos/proyecto-educativo" },
};

export default function ProyectoEducativoPage() {
  return (
    <>
      <PageHeader
        title="Nuestro proyecto educativo"
        eyebrow={`PEI ${PEI_PERIOD}`}
        crumbs={[{ label: "Quiénes somos", href: "/quienes-somos" }]}
        description="El Proyecto Educativo Institucional es la hoja de ruta de la gestión pedagógica e institucional de la escuela."
      >
        <div className="flex flex-wrap gap-3">
          <a href={PEI_PDF_URL} target="_blank" rel="noopener noreferrer" className="btn btn-sun"><Icon name="eye" size={18} /> Visualizar el PEI</a>
          <a href={PEI_PDF_URL} download className="btn btn-outline"><Icon name="download" size={18} /> Descargar PDF</a>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose-escuela">
            <p>
              A partir de 2014 la Escuela Monterrey inició un proceso de revisión de su PEI, motivado por la necesidad de contar con una herramienta de planificación que fuera un mapa de ruta para la gestión institucional y pedagógica. El proceso incluyó la participación de todos los estamentos de la comunidad educativa, convocados a expresar sus sueños, expectativas y deseos respecto del proyecto institucional.
            </p>
            <p>
              El proyecto vigente se fundamenta en un proceso de autoevaluación institucional participativo y se organiza en las dimensiones de gestión pedagógica, liderazgo, convivencia escolar, gestión de recursos y área de resultados.
            </p>
            <h2>Qué encontrarás en el PEI</h2>
            <ul>
              <li>Identificación del establecimiento.</li>
              <li>Marco curricular: pilares, visión, misión, sellos, principios, valores y perfiles.</li>
              <li>Análisis institucional y reseña histórica.</li>
              <li>Definiciones curriculares: modelo pedagógico, modelo evaluativo y plan de estudios.</li>
              <li>Diagnóstico institucional, objetivos y metas estratégicas.</li>
              <li>Programas y proyectos en ejecución, organización y reglamentos.</li>
            </ul>
          </div>
          <aside className="card h-fit p-7">
            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name="file" size={26} /></span>
            <h2 className="font-display text-xl font-bold">Proyecto Educativo Institucional {PEI_PERIOD}</h2>
            <p className="mt-2 text-muted">Documento oficial, firmado en Cajón en marzo de 2019. Formato PDF.</p>
            <div className="mt-5 grid gap-2">
              <a href={PEI_PDF_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Visualizar</a>
              <a href={PEI_PDF_URL} download className="btn btn-outline btn-sm">Descargar</a>
              <Link href="/documentos" className="btn btn-outline btn-sm">Ver todos los documentos</Link>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="paper">
        <SectionTitle eyebrow="Objetivos estratégicos" title="Hacia dónde nos proponemos avanzar" description="Objetivos definidos por dimensión de la gestión institucional." />
        <ul className="grid gap-4 md:grid-cols-2">
          {STRATEGIC_GOALS.map((g) => (
            <li key={g.dimension} className="rounded-3xl bg-white p-7">
              <h3 className="font-display text-xl font-bold text-brand">{g.dimension}</h3>
              <p className="mt-2 text-[#35414f]">{g.objective}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionTitle eyebrow="Perfiles" title="Qué esperamos de cada integrante de la comunidad" />
        <div className="space-y-3">
          {PROFILES.map((p) => (
            <details key={p.who} className="group rounded-2xl border border-line bg-white open:shadow-sm">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-3 font-display text-lg font-bold">
                {p.who}
                <Icon name="down" size={20} className="transition-transform group-open:rotate-180" />
              </summary>
              <ul className="space-y-2 px-6 pb-6 text-[#35414f]">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-3"><Icon name="check" size={18} className="mt-1 shrink-0 text-brand" />{i}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
        <div className="mt-10">
          <Notice tone="warn" title="Vigencia del documento">
            El PEI publicado corresponde al período {PEI_PERIOD}. Cuando el establecimiento publique una versión actualizada, se reemplazará desde el panel de administración.
          </Notice>
        </div>
      </Section>
    </>
  );
}
