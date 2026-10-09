import type { Metadata } from "next";
import Link from "next/link";
import { GalleryCard, NewsCard } from "@/components/content/cards";
import { InfoBlock } from "@/components/content/TextBlock";
import { ArrowLink, Notice, PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { INSTANCES, SCHOOL, WORKSHOPS } from "@/content/pei";
import { getText, publicGalleries, publicNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vida escolar y comunidad",
  description: "Actividades, talleres, celebraciones, participación y galerías de la Escuela Particular Monterrey.",
  alternates: { canonical: "/vida-escolar" },
};

export default async function VidaEscolarPage() {
  const [policy, news, galleries] = await Promise.all([getText("images_policy"), publicNews(), publicGalleries()]);
  const activities = news.filter((n) => ["Actividades pedagógicas", "Deporte y recreación", "Arte y cultura", "Efemérides y celebraciones", "Comunidad educativa"].includes(n.category)).slice(0, 3);

  return (
    <>
      <PageHeader title="Vida escolar y comunidad" eyebrow="El día a día en Monterrey" description="Talleres, celebraciones y participación: una comunidad que aprende y se encuentra." />

      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <section className="card p-7 lg:col-span-2" aria-label="Talleres y experiencias educativas">
            <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name="lightbulb" size={24} /></span>
            <h2 className="font-display text-2xl font-extrabold">Talleres y experiencias educativas</h2>
            <p className="mt-2 text-[#35414f]">La malla curricular contempla talleres que contribuyen a la formación integral de los estudiantes. Según el PEI:</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {WORKSHOPS.map((w) => (
                <li key={w} className="rounded-xl bg-sky px-4 py-2 font-semibold">{w}</li>
              ))}
            </ul>
            <ArrowLink href="/formacion#talleres" className="mt-6">Plan de estudios y talleres</ArrowLink>
          </section>
          <section className="rounded-3xl bg-sun-tint p-7 text-[#2a2000]" aria-label="Aniversario">
            <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-sun-deep"><Icon name="calendar" size={24} /></span>
            <h2 className="font-display text-xl font-extrabold !text-[#2a2000]">Aniversario de la escuela</h2>
            <p className="mt-2">La escuela fue fundada en {SCHOOL.foundedYear} y celebra su aniversario cada mes de {SCHOOL.anniversaryMonth}.</p>
          </section>
        </div>
      </Section>

      <Section tone="paper">
        <SectionTitle eyebrow="Participación" title="Una comunidad organizada" description="La escuela cuenta con las siguientes instancias, según su PEI." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSTANCES.map((i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl bg-white p-5 font-semibold">
              <Icon name="users" size={22} className="shrink-0 text-brand" /> {i}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InfoBlock title="Centro de Estudiantes" icon="users" text="" placeholder="El PEI no menciona un Centro de Estudiantes. Si existe, la dirección podrá completar aquí su información." />
          <InfoBlock title="Proyectos educativos destacados" icon="lightbulb" text="" placeholder="La escuela publicará aquí los proyectos educativos que quiera destacar." />
        </div>
      </Section>

      <Section>
        <SectionTitle eyebrow="Lo que ocurre" title="Actividades recientes" action={<ArrowLink href="/noticias">Todas las noticias</ArrowLink>} />
        {activities.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-[#b9b39b] bg-white/60 p-8 text-center text-muted">Las actividades y celebraciones se publicarán en Noticias a medida que ocurran.</p>
        )}
      </Section>

      <Section tone="sky">
        <SectionTitle eyebrow="Galerías" title="Fotografías de la vida escolar" action={<ArrowLink href="/galerias">Ver todas las galerías</ArrowLink>} />
        {galleries.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.slice(0, 3).map((g) => (
              <GalleryCard key={g.id} gallery={g} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white/70 p-8 text-center text-muted">Las galerías se publicarán cuando la escuela cuente con las autorizaciones correspondientes.</p>
        )}
        <div className="mt-8"><Notice tone="info" title="Privacidad de estudiantes">{policy}</Notice></div>
        <p className="mt-6">
          <Link href="/convivencia" className="font-bold text-brand underline underline-offset-4">Conoce también nuestra convivencia escolar</Link>
        </p>
      </Section>
    </>
  );
}
