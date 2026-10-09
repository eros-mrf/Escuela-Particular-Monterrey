import type { Metadata } from "next";
import { Notice, PageHeader, Section, SectionTitle } from "@/components/ui/common";
import { Icon } from "@/components/ui/Icon";
import { ORGANIZATION } from "@/content/pei";
import { publicTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "Equipo directivo",
  description: "Equipo directivo y organización de la Escuela Particular Monterrey.",
  alternates: { canonical: "/quienes-somos/equipo-directivo" },
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function EquipoPage() {
  const team = await publicTeam();
  return (
    <>
      <PageHeader title="Equipo directivo" eyebrow="Quiénes conducen la escuela" crumbs={[{ label: "Quiénes somos", href: "/quienes-somos" }]} />
      <Section>
        {team.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <li key={m.id} className="card overflow-hidden">
                {m.photoMediaId ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/media/${m.photoMediaId}`} alt={`Fotografía de ${m.name}`} loading="lazy" decoding="async" width={600} height={600} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-sky" role="img" aria-label={`${m.name}, sin fotografía`}>
                    <span className="flex size-28 items-center justify-center rounded-full bg-brand font-display text-4xl font-extrabold text-white">{initials(m.name)}</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-display text-xl font-bold">{m.name}</h2>
                  <p className="mt-1 font-semibold text-brand">{m.role}</p>
                  {m.bio && <p className="mt-3 text-muted">{m.bio}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">El equipo directivo se publicará próximamente.</p>
        )}
        <p className="mt-6 text-sm text-muted">Información del equipo según el PEI 2019–2023. La dirección actualiza estas fichas desde el panel de administración.</p>
      </Section>

      <Section tone="paper">
        <SectionTitle eyebrow="Organización" title="Organigrama institucional" description="Así se organiza la escuela según su PEI." />
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-3 text-center">
            {ORGANIZATION.top.map((t, i) => (
              <div key={t} className="flex flex-col items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-5 w-0.5 bg-brand/40" />}
                <div className="min-w-56 rounded-2xl bg-ink px-6 py-3 font-display font-bold text-white">{t}</div>
              </div>
            ))}
            <span aria-hidden="true" className="h-5 w-0.5 bg-brand/40" />
            <ul className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {ORGANIZATION.second.map((t) => (
                <li key={t} className="rounded-2xl border-2 border-brand bg-white px-3 py-3 text-sm font-bold text-ink">{t}</li>
              ))}
            </ul>
            <span aria-hidden="true" className="h-5 w-0.5 bg-brand/40" />
            <p className="text-sm text-muted">Bajo la Unidad Técnico-Pedagógica:</p>
            <ul className="flex flex-wrap justify-center gap-3">
              {ORGANIZATION.third.map((t) => (
                <li key={t} className="rounded-2xl bg-sky px-5 py-3 text-sm font-bold text-brand">{t}</li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <Notice tone="info" title="Datos del establecimiento">
              <span className="inline-flex items-center gap-2"><Icon name="info" size={16} /> Según el PEI, la escuela cuenta con 3 docentes directivos, 16 docentes y 10 asistentes de la educación (datos 2019).</span>
            </Notice>
          </div>
        </div>
      </Section>
    </>
  );
}
