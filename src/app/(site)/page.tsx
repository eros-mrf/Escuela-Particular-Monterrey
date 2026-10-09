import Link from "next/link";
import type { CSSProperties } from "react";
import { AnnouncementCard, EventRow, NewsCard } from "@/components/content/cards";
import { Reveal } from "@/components/motion/Reveal";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HeroIllustration } from "@/components/home/HeroIllustration";
import { SchoolJsonLd } from "@/components/seo/JsonLd";
import { ArrowLink, EmptyState, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { MISSION, SCHOOL, SEALS, VISION } from "@/content/pei";
import { activeAnnouncements, getSettings, getText, publicGalleries, publicNews, upcomingEvents } from "@/lib/content";
import { isExternal, safeUrl } from "@/lib/utils";

const QUICK = [
  { href: "/comunicados", icon: "megaphone", title: "Comunicados", sub: "Avisos vigentes y archivo" },
  { href: "/calendario", icon: "calendar", title: "Calendario escolar", sub: "Actividades y reuniones" },
  { href: "/documentos", icon: "file", title: "Documentos oficiales", sub: "PEI, reglamentos y protocolos" },
  { href: "/matriculas", icon: "userplus", title: "Matrículas", sub: "Admisión e información" },
  { href: "/noticias", icon: "news", title: "Noticias", sub: "Lo que ocurre en la escuela" },
  { href: "/contacto", icon: "mail", title: "Contacto", sub: "Teléfono, correo y ubicación" },
];

const FACTS = [
  { big: String(SCHOOL.foundedYear), label: "Año de fundación" },
  { big: "NT1 a 8°", label: "Niveles que atiende" },
  { big: "JEC", label: "Jornada Escolar Completa" },
  { big: SCHOOL.rbd, label: "RBD del establecimiento" },
];

export default async function HomePage() {
  const [settings, news, events, announcements, galleries, w1, w2] = await Promise.all([
    getSettings(),
    publicNews(),
    upcomingEvents(4),
    activeAnnouncements(3),
    publicGalleries(),
    getText("welcome_1"),
    getText("welcome_2"),
  ]);
  const latest = news.slice(0, 3);
  const slides = settings.hero.slides.map((s) => ({ src: `/media/${s.mediaId}`, alt: s.alt || "Fotografía institucional de la Escuela Particular Monterrey" }));
  const mosaic = galleries.flatMap((g) => g.images.slice(0, 5).map((img) => ({ ...img, gallery: g }))).slice(0, 5);

  return (
    <>
      <SchoolJsonLd settings={settings} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cream to-paper">
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
          <div>
            <p style={{ "--i": 0 } as CSSProperties} className="in mb-5 inline-flex items-center gap-2.5 rounded-full bg-sky px-4 py-2 text-[0.8rem] font-bold uppercase tracking-[0.06em] text-brand">
              <span aria-hidden="true" className="size-2 rounded-full bg-sun" />
              Escuela N° {SCHOOL.number} · Fundada en {SCHOOL.foundedYear}
            </p>
            <h1 style={{ "--i": 1 } as CSSProperties} className="in font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              {settings.hero.title === SCHOOL.name ? (
                <>Escuela Particular <span className="text-brand">Monterrey</span></>
              ) : (
                settings.hero.title
              )}
            </h1>
            <p style={{ "--i": 2 } as CSSProperties} className="in mt-5 max-w-xl text-lg leading-relaxed text-[#35414f] sm:text-xl">{settings.hero.subtitle}</p>
            <div style={{ "--i": 3 } as CSSProperties} className="in mt-8 flex flex-wrap gap-3">
              <Link href="/quienes-somos" className="btn btn-primary text-[1.05rem]">
                Conoce nuestro colegio <Icon name="arrow" size={18} />
              </Link>
              <Link href="/noticias" className="btn btn-outline text-[1.05rem]">Noticias y actividades</Link>
            </div>
          </div>
          <div style={{ "--i": 2 } as CSSProperties} className="in">
            <div className="relative">
            {slides.length ? <HeroCarousel slides={slides} /> : <HeroIllustration />}
            <div className="float-badge absolute -bottom-5 left-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card sm:-left-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-sun-tint text-sun-deep"><Icon name="clock" size={24} /></span>
              <div>
                <p className="font-bold leading-tight text-ink">Jornada Escolar Completa</p>
                <p className="text-sm text-muted">Educación Parvularia y Básica</p>
              </div>
            </div>
            </div>
            {!slides.length && <p className="mt-9 text-sm text-muted">Ilustración referencial. La dirección puede cargar fotografías oficiales desde el panel.</p>}
          </div>
        </div>
      </section>

      {/* Datos del establecimiento */}
      <section aria-label="Datos del establecimiento" className="bg-ink text-white">
        <dl className="container-page grid grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 90} y={14} className={`px-4 py-6 sm:px-6 ${i > 0 ? "lg:border-l lg:border-white/15" : ""} ${i % 2 === 1 ? "border-l border-white/15 lg:border-l" : ""}`}>
              <dd className="font-display text-3xl font-extrabold leading-tight text-sun sm:text-4xl">{f.big}</dd>
              <dt className="mt-1 text-[0.95rem] text-[#c5d3e8]">{f.label}</dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Accesos rápidos */}
      <Section label="Accesos rápidos">
        <SectionTitle title="¿Qué necesitas hoy?" description="Los avisos y trámites más consultados por las familias, a un toque." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK.map((q, i) => (
            <Reveal as="li" key={q.href} delay={(i % 3) * 90}>
              <Link href={q.href} className="card lift group flex h-full items-center gap-5 p-5 sm:p-6">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-brand group-hover:text-white">
                  <Icon name={q.icon} size={30} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-bold text-ink">{q.title}</span>
                  <span className="block text-muted">{q.sub}</span>
                </span>
                <Icon name="arrow" size={20} className="shrink-0 -translate-x-2 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Bienvenida */}
      <Section label="Bienvenida institucional" className="!pt-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <Reveal from="left" className="relative">
            <div className="placeholder-img flex aspect-[4/5] items-end rounded-[1.75rem] border border-dashed border-[#9db8e0] p-5">
              <p className="rounded-xl bg-white px-4 py-2 text-sm text-[#35414f]">Fotografía institucional · por incorporar</p>
            </div>
            <div className="absolute -right-2 top-7 rounded-2xl bg-sun px-5 py-4 text-center text-ink shadow-card sm:-right-4">
              <p className="font-display text-4xl font-extrabold leading-none">{SCHOOL.foundedYear}</p>
              <p className="text-sm font-semibold">año de fundación</p>
            </div>
          </Reveal>
          <Reveal from="right">
            <p className="eyebrow">Bienvenidos</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Una escuela que nació de su propia comunidad</h2>
            <p className="mt-6 text-lg text-[#35414f]">{w1}</p>
            <p className="mt-4 text-lg text-[#35414f]">{w2}</p>
            <ArrowLink href="/quienes-somos" className="mt-7">Quiénes somos</ArrowLink>
          </Reveal>
        </div>
      </Section>

      {/* Misión y visión (textos oficiales del PEI) */}
      <section aria-label="Misión y visión" className="pb-14 sm:pb-20">
        <div className="container-page grid gap-5 lg:grid-cols-2">
          <Reveal from="left" className="h-full"><article className="relative h-full overflow-hidden rounded-[1.9rem] bg-brand p-8 text-white sm:p-12">
            <div aria-hidden="true" className="drift-a absolute -right-16 -top-16 size-56 rounded-full bg-white/10" />
            <h2 className="relative text-[0.85rem] font-sans font-bold uppercase tracking-[0.12em] !text-sun">Nuestra misión</h2>
            <p className="relative mt-4 font-display text-2xl font-medium leading-snug sm:text-[1.65rem]">{MISSION}</p>
          </article></Reveal>
          <Reveal from="right" delay={120} className="h-full"><article className="relative h-full overflow-hidden rounded-[1.9rem] bg-sun-tint p-8 text-[#2a2000] sm:p-12">
            <div aria-hidden="true" className="drift-b absolute -right-16 -top-16 size-56 rounded-full bg-sun/40" />
            <h2 className="relative text-[0.85rem] font-sans font-bold uppercase tracking-[0.12em] !text-[#6b4a00]">Nuestra visión</h2>
            <p className="relative mt-4 font-display text-2xl font-medium leading-snug sm:text-[1.65rem]">{VISION}</p>
          </article></Reveal>
        </div>
      </section>

      {/* Sellos */}
      <section aria-label="Sellos educativos" className="pb-14 sm:pb-20">
        <div className="container-page">
          <SectionTitle
            eyebrow="Sellos educativos"
            title="Lo que nos distingue como comunidad"
            action={<ArrowLink href="/quienes-somos/sellos-y-valores">Principios y valores</ArrowLink>}
          />
          <ul className="grid gap-5 lg:grid-cols-3">
            {SEALS.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 110} className="h-full"><div className="card lift group h-full p-7 sm:p-8">
                <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-ink text-sun transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"><Icon name={s.icon} size={28} /></span>
                <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 text-[1.05rem] text-[#35414f]">{s.text}</p>
              </div></Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Noticias */}
      <Section tone="paper" label="Últimas noticias">
        <SectionTitle
          eyebrow="Actualidad"
          title="Últimas noticias"
          action={<Link href="/noticias" className="btn btn-outline btn-sm">Ver todas las noticias</Link>}
        />
        {latest.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((n, i) => (
              <Reveal key={n.id} delay={i * 100} className="h-full">
                <NewsCard item={n} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState title="Aún no hay noticias publicadas" icon="news">
            Las noticias que publique el establecimiento aparecerán aquí. Mientras tanto, revisa el calendario y los comunicados.
          </EmptyState>
        )}
      </Section>

      {/* Actividades y comunicados */}
      <Section label="Próximas actividades y comunicados">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <h2 className="mb-6 font-display text-3xl font-extrabold">Próximas actividades</h2>
            {events.length ? (
              <div className="space-y-3">
                {events.map((e, i) => (
                  <Reveal key={e.id} delay={i * 90} from="left">
                    <EventRow event={e} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState title="No hay actividades programadas" icon="calendar">
                Cuando el establecimiento agende actividades, reuniones o actos escolares, las verás aquí.
              </EmptyState>
            )}
            <ArrowLink href="/calendario" className="mt-6">Abrir el calendario escolar</ArrowLink>
          </div>
          <Reveal from="right" className="h-fit"><aside className="h-fit rounded-[1.75rem] bg-ink p-7 text-white sm:p-8" aria-label="Comunicados importantes">
            <div className="mb-5 flex items-center gap-3">
              <Icon name="megaphone" size={28} className="text-sun" />
              <h2 className="font-display text-2xl font-extrabold !text-white">Comunicados</h2>
            </div>
            {announcements.length ? (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <AnnouncementCard key={a.id} item={a} state={a.state} dark />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-white/20 p-5 text-[#c5d3e8]">No hay comunicados vigentes en este momento.</p>
            )}
            <Link href="/comunicados" className="mt-5 inline-flex items-center gap-2 font-bold text-sun hover:text-white">
              Ver centro de comunicados <Icon name="arrow" size={17} />
            </Link>
          </aside></Reveal>
        </div>
      </Section>

      {/* Galería */}
      <section aria-label="Galería destacada" className="pb-14 sm:pb-20">
        <div className="container-page">
          <SectionTitle eyebrow="Vida escolar" title="Galería destacada" action={<ArrowLink href="/galerias">Ver galerías completas</ArrowLink>} />
          {mosaic.length >= 3 ? (
            <ul className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] lg:grid-cols-4">
              {mosaic.map((m, i) => (
                <Reveal as="li" key={`${m.mediaId}-${i}`} delay={i * 80} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                  <Link href={`/galerias/${m.gallery.slug}`} className="group relative block size-full overflow-hidden rounded-3xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/media/${m.mediaId}`} alt={m.alt || m.gallery.title} loading="lazy" decoding="async" width={800} height={600} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{m.gallery.title}</span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <EmptyState title="Las galerías de fotografías se publicarán pronto" icon="image">
              Solo se publican imágenes con las autorizaciones correspondientes de las familias.
            </EmptyState>
          )}
        </div>
      </section>

      {/* Documentos y accesos de la comunidad */}
      <Section tone="sky" label="Documentos y accesos de la comunidad">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Documentos institucionales</h2>
            <p className="mt-4 text-lg text-[#35414f]">Proyecto Educativo, reglamentos, protocolos y circulares en un solo lugar, con buscador y descarga directa.</p>
            <Link href="/documentos" className="btn btn-primary mt-7">Ir al centro documental</Link>
          </div>
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold">Accesos de la comunidad</h2>
            {settings.community.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {settings.community.map((c) => {
                  const href = safeUrl(c.url);
                  if (!href) return null;
                  return (
                    <Reveal as="li" key={c.id} className="h-full">
                      <a
                        href={href}
                        {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="card lift flex h-full items-start gap-3 p-5"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block font-bold text-ink">{c.label}</span>
                          <span className="block text-sm text-muted">{c.description}</span>
                        </span>
                        <Icon name="external" size={18} className="mt-1 shrink-0 text-brand" />
                      </a>
                    </Reveal>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted">Los enlaces oficiales de la comunidad se mostrarán aquí.</p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
