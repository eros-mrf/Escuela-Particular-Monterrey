import type { Metadata } from "next";
import Link from "next/link";
import { InfoBlock } from "@/components/content/TextBlock";
import { ArrowLink, Notice, PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { LEVELS, SCHOOL, SUPPORT_PROGRAMS } from "@/content/pei";
import { getSettings, getText, publicFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Matrículas y admisión",
  description: "Información para familias que desean conocer o ingresar a la Escuela Particular Monterrey: oferta educativa, proceso de admisión, requisitos y contacto.",
  alternates: { canonical: "/matriculas" },
};

export default async function MatriculasPage() {
  const [settings, intro, process, reqs, dates, docs, faqs] = await Promise.all([
    getSettings(),
    getText("admission_intro"),
    getText("admission_process"),
    getText("admission_requirements"),
    getText("admission_dates"),
    getText("admission_documents"),
    publicFaqs(),
  ]);
  const sae = settings.community.find((c) => /sistemadeadmisionescolar\.cl/i.test(c.url));
  const admissionFaqs = faqs.filter((f) => f.group === "Matrículas y admisión");

  return (
    <>
      <PageHeader title="Matrículas y admisión" eyebrow="Para nuevas familias" description="Conoce nuestra propuesta y cómo acercarte a la escuela." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SectionTitle eyebrow="Presentación" title="Bienvenida a las familias" />
            <p className="-mt-4 text-lg text-[#35414f]">{intro}</p>
            <h3 className="mt-8 font-display text-xl font-bold">Oferta educativa</h3>
            <ul className="mt-3 space-y-4">
              {LEVELS.map((l) => (
                <li key={l.group}>
                  <p className="font-semibold text-brand">{l.group}</p>
                  <p className="mt-1 flex flex-wrap gap-2">
                    {l.courses.map((c) => (
                      <span key={c} className="rounded-xl bg-sky px-3 py-1.5 text-[0.95rem] font-semibold">{c}</span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-muted">Dependencia: {SCHOOL.dependency}. Jornada Escolar Completa. Programas de apoyo: {SUPPORT_PROGRAMS.slice(0, 4).join(", ")}.</p>
          </div>
          <aside className="rounded-[1.75rem] bg-ink p-8 text-white">
            <h2 className="font-display text-2xl font-extrabold !text-white">Canales de contacto</h2>
            <ul className="mt-5 space-y-3">
              {settings.contact.phone && (
                <li className="flex gap-3"><Icon name="phone" size={20} className="mt-1 shrink-0 text-sun" /><a href={`tel:+56${settings.contact.phone.replace(/\D/g, "")}`} className="hover:underline">{settings.contact.phone}</a></li>
              )}
              {settings.contact.emails.filter(Boolean).map((e) => (
                <li key={e} className="flex gap-3"><Icon name="mail" size={20} className="mt-1 shrink-0 text-sun" /><a href={`mailto:${e}`} className="break-all hover:underline">{e}</a></li>
              ))}
              <li className="flex gap-3"><Icon name="pin" size={20} className="mt-1 shrink-0 text-sun" /><span>{settings.contact.address}, {settings.contact.locality}, {settings.contact.commune}</span></li>
              {settings.contact.hours.filter(Boolean).map((h) => (
                <li key={h} className="flex gap-3"><Icon name="clock" size={20} className="mt-1 shrink-0 text-sun" /><span>{h}</span></li>
              ))}
            </ul>
            <Link href="/contacto" className="btn btn-sun mt-6 w-full">Ir a contacto</Link>
          </aside>
        </div>
      </Section>

      <Section tone="paper">
        <SectionTitle eyebrow="Proceso de admisión" title="Lo que necesitas saber" description="El establecimiento completa estos datos con información oficial. Los marcadores en amarillo indican contenido pendiente." />
        <div className="grid gap-5 md:grid-cols-2">
          <InfoBlock title="Cómo es el proceso" icon="userplus" text={process} />
          <InfoBlock title="Requisitos" icon="check" text={reqs} list />
          <InfoBlock title="Fechas importantes" icon="calendar" text={dates} list />
          <InfoBlock title="Documentos necesarios" icon="file" text={docs} list />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Notice tone="info" title="Sistema de Admisión Escolar (SAE)">
            El Ministerio de Educación administra el Sistema de Admisión Escolar. Consulta con el establecimiento si el nivel que te interesa se gestiona por ese sistema.{" "}
            <a href={sae?.url ?? "https://www.sistemadeadmisionescolar.cl"} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4">Ir al sitio oficial del SAE</a>.
          </Notice>
          <Notice tone="warn" title="Este sitio es informativo">
            No recibimos postulaciones ni solicitamos documentos personales por este medio. Los trámites se realizan por los canales oficiales de la escuela y del Mineduc.
          </Notice>
        </div>
      </Section>

      {admissionFaqs.length > 0 && (
        <Section>
          <SectionTitle title="Preguntas frecuentes sobre matrículas" action={<ArrowLink href="/preguntas-frecuentes">Ver todas</ArrowLink>} />
          <div className="space-y-3">
            {admissionFaqs.map((f) => (
              <details key={f.id} className="group rounded-2xl border border-line bg-white">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-3 font-display text-lg font-bold">
                  {f.question}
                  <Icon name="down" size={20} className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-[#35414f]">{f.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
