import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink, PageHeader, Section } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { COMMUNITY_TRAITS, INSTANCES, SCHOOL } from "@/content/pei";
import { getText } from "@/lib/content";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Conoce la historia, la misión, la visión, los sellos y el proyecto educativo de la Escuela Particular Monterrey N° 500, en Cajón, Vilcún.",
  alternates: { canonical: "/quienes-somos" },
};

const CARDS = [
  { href: "/quienes-somos/historia", icon: "clock", title: "Nuestra historia", text: "De un pequeño lugar llamado Monterrey a la localidad de Cajón: más de cuatro décadas de trayectoria." },
  { href: "/quienes-somos/mision-vision", icon: "eye", title: "Misión y visión", text: "Los textos oficiales de nuestro Proyecto Educativo Institucional." },
  { href: "/quienes-somos/sellos-y-valores", icon: "heart", title: "Sellos y valores", text: "Principios, valores y actitudes que orientan nuestra comunidad." },
  { href: "/quienes-somos/proyecto-educativo", icon: "file", title: "Proyecto educativo", text: "Presentación del PEI y descarga del documento en PDF." },
  { href: "/quienes-somos/equipo-directivo", icon: "users", title: "Equipo directivo", text: "Quiénes conducen la escuela y cómo nos organizamos." },
  { href: "/quienes-somos/establecimiento", icon: "book", title: "Nuestro establecimiento", text: "Aulas, biblioteca, laboratorio de informática y espacios comunes." },
];

export default async function QuienesSomosPage() {
  const [w1, w2] = await Promise.all([getText("welcome_1"), getText("welcome_2")]);
  return (
    <>
      <PageHeader
        title="Quiénes somos"
        eyebrow="Escuela Particular Monterrey N° 500"
        description="Una comunidad educativa particular subvencionada de Cajón, comuna de Vilcún, que educa de forma integral e inclusiva."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="prose-escuela">
            <p>{w1}</p>
            <p>{w2}</p>
            <p>
              La escuela es dirigida por {SCHOOL.director}, funciona bajo el decreto de autorización N° 935 de 1982 y se rige por su Reglamento Interno, su Manual de Convivencia y su Reglamento de Evaluación. Cada octubre celebra su aniversario.
            </p>
            <h2>Instancias de la comunidad</h2>
            <ul>
              {INSTANCES.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <aside className="card h-fit p-7">
            <h2 className="font-display text-xl font-bold">Datos del establecimiento</h2>
            <dl className="mt-4 space-y-3 text-[0.97rem]">
              {[
                ["Nombre", SCHOOL.officialName],
                ["RBD", SCHOOL.rbd],
                ["Dependencia", SCHOOL.dependency],
                ["Niveles", SCHOOL.levels],
                ["Fundación", String(SCHOOL.foundedYear)],
                ["Ubicación", `${SCHOOL.locality}, ${SCHOOL.commune}, Región de ${SCHOOL.region}`],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-line pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm font-semibold text-muted">{k}</dt>
                  <dd className="font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">Fuente: Proyecto Educativo Institucional 2019–2023.</p>
          </aside>
        </div>
      </Section>

      <Section tone="paper" label="Secciones de Quiénes somos">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal as="li" key={c.href} delay={(i % 3) * 90} className="h-full">
              <Link href={c.href} className="card lift group flex h-full flex-col p-7">
                <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-sky text-brand transition-all duration-300 group-hover:-rotate-6 group-hover:bg-brand group-hover:text-white"><Icon name={c.icon} size={26} /></span>
                <span className="font-display text-xl font-bold text-ink">{c.title}</span>
                <span className="mt-2 flex-1 text-muted">{c.text}</span>
                <span className="mt-4 inline-flex items-center gap-2 font-bold text-brand">Ver más <Icon name="arrow" size={16} /></span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="font-display text-3xl font-extrabold">Características de nuestra comunidad educativa</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {COMMUNITY_TRAITS.map((t) => (
            <li key={t} className="flex gap-3 rounded-2xl border border-line bg-white p-5">
              <Icon name="check" size={22} className="mt-0.5 shrink-0 text-brand" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <ArrowLink href="/quienes-somos/proyecto-educativo" className="mt-8">Conoce el Proyecto Educativo</ArrowLink>
      </Section>
    </>
  );
}
