import type { Metadata } from "next";
import { EmptyState, PageHeader, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { FAQ_GROUPS } from "@/lib/constants";
import { publicFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas a las consultas más habituales de apoderados y familias de la Escuela Particular Monterrey.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default async function FaqPage() {
  const faqs = await publicFaqs();
  const groups = [...new Set([...FAQ_GROUPS, ...faqs.map((f) => f.group)])].filter((g) => faqs.some((f) => f.group === g));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <>
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}
      <PageHeader title="Preguntas frecuentes" eyebrow="Para apoderados y familias" description="Respuestas rápidas a las consultas más habituales. Si no encuentras lo que buscas, escríbenos." />
      <Section>
        {faqs.length === 0 ? (
          <EmptyState title="Aún no hay preguntas frecuentes" icon="info" />
        ) : (
          <div className="mx-auto max-w-3xl space-y-10">
            {groups.map((g) => (
              <section key={g} aria-label={g}>
                <h2 className="mb-4 font-display text-2xl font-extrabold">{g}</h2>
                <div className="space-y-3">
                  {faqs.filter((f) => f.group === g).map((f) => (
                    <details key={f.id} id={f.id} className="group rounded-2xl border border-line bg-white target:border-brand">
                      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-3 font-display text-lg font-bold">
                        {f.question}
                        <Icon name="down" size={20} className="shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="whitespace-pre-line px-6 pb-5 text-[#35414f]">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
