import type { Metadata } from "next";
import Link from "next/link";
import { InfoBlock } from "@/components/content/TextBlock";
import { Notice, PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { ATTITUDES, CONVIVENCIA_OBJECTIVE, CONVIVENCIA_STRENGTHS, PROFILES, REGULATIONS } from "@/content/pei";
import { getText, publicDocuments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Convivencia escolar y bienestar",
  description: "Convivencia escolar, buen trato, reglamentos y orientaciones para las familias de la Escuela Particular Monterrey.",
  alternates: { canonical: "/convivencia" },
};

export default async function ConvivenciaPage() {
  const [intro, contact, docs] = await Promise.all([getText("convivencia_intro"), getText("convivencia_contact"), publicDocuments()]);
  const related = docs.filter((d) => /convivencia|protocolo|seguridad/i.test(`${d.category} ${d.title}`));
  const families = PROFILES.find((p) => p.who.startsWith("Madres"))!;

  return (
    <>
      <PageHeader title="Convivencia escolar y bienestar" eyebrow="Un ambiente seguro, de respeto y valoración" description={intro} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-[1.75rem] bg-brand p-8 text-white sm:p-10">
            <h2 className="text-sm font-sans font-bold uppercase tracking-[0.12em] !text-sun">Nuestro objetivo</h2>
            <p className="mt-3 font-display text-xl font-medium leading-snug sm:text-2xl">{CONVIVENCIA_OBJECTIVE}</p>
            <p className="mt-4 text-sm text-white/80">Objetivo estratégico de convivencia escolar, PEI 2019–2023.</p>
          </article>
          <div className="card p-8">
            <h2 className="font-display text-2xl font-extrabold">Cómo trabajamos la convivencia</h2>
            <ul className="mt-4 space-y-3">
              {CONVIVENCIA_STRENGTHS.map((s) => (
                <li key={s} className="flex gap-3"><Icon name="check" size={20} className="mt-1 shrink-0 text-brand" />{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionTitle eyebrow="Promoción del buen trato" title="Actitudes que cultivamos" description="Las actitudes definidas en nuestro proyecto educativo orientan la convivencia cotidiana." />
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ATTITUDES.map((a) => (
            <li key={a} className="flex gap-3 rounded-2xl bg-white p-4"><Icon name="heart" size={20} className="mt-0.5 shrink-0 text-brand" />{a}</li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Orientaciones para las familias" title="Madres, padres y apoderados" />
            <ul className="-mt-4 space-y-3">
              {families.items.map((i) => (
                <li key={i} className="flex gap-3"><Icon name="check" size={20} className="mt-1 shrink-0 text-brand" />{i}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-5">
            <section className="card p-7" aria-label="Reglamentos y protocolos">
              <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name="shield" size={24} /></span>
              <h3 className="font-display text-xl font-bold">Reglamentos y protocolos</h3>
              <p className="mt-2 text-[#35414f]">Según el PEI, la escuela se rige por:</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {REGULATIONS.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              {related.length ? (
                <ul className="mt-4 space-y-2">
                  {related.map((d) => (
                    <li key={d.id}><Link href={`/documentos?q=${encodeURIComponent(d.title)}`} className="inline-flex items-center gap-2 font-bold text-brand underline underline-offset-4"><Icon name="file" size={17} />{d.title}</Link></li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-xl bg-sun-tint px-4 py-3 text-[0.95rem] font-semibold text-[#4a3600]">[Los reglamentos y protocolos se publicarán en Documentos cuando el establecimiento los autorice.]</p>
              )}
              <Link href="/documentos" className="btn btn-outline btn-sm mt-4">Ir a Documentos</Link>
            </section>
            <InfoBlock title="Contacto institucional" icon="mail" text={contact} placeholder="La escuela indicará aquí la persona y el canal de contacto para temas de convivencia." />
          </div>
        </div>
        <div className="mt-10">
          <Notice tone="warn" title="Situaciones sensibles">
            Este sitio no cuenta con formularios para denunciar o informar situaciones de convivencia. Si necesitas comunicar una situación delicada, hazlo por los canales oficiales de la escuela (teléfono o atención presencial), donde la información se trata de forma confidencial.
          </Notice>
        </div>
      </Section>
    </>
  );
}
