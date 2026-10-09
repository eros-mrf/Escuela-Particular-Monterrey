import type { Metadata } from "next";
import { Notice, PageHeader, Section } from "@/components/ui/common";
import { Icon, SocialIcon } from "@/components/ui/Icon";
import { SCHOOL } from "@/content/pei";
import { makeFormToken } from "@/lib/auth";
import { getSettings, getText } from "@/lib/content";
import { contactMailConfigured } from "@/lib/env";
import { safeUrl } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacto y ubicación",
  description: "Dirección, teléfono, correos y ubicación de la Escuela Particular Monterrey, en Cajón, comuna de Vilcún, La Araucanía.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage() {
  const [s, note] = await Promise.all([getSettings(), getText("contact_note")]);
  const enabled = contactMailConfigured();
  const token = enabled ? await makeFormToken() : "";
  const c = s.contact;
  const fullAddress = `${c.address}, ${c.locality}, ${c.commune}, Región de ${c.region}, Chile`;
  const lat = Number.parseFloat(c.mapLat);
  const lng = Number.parseFloat(c.mapLng);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  const d = 0.006;
  const osmEmbed = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d}%2C${lng + d}%2C${lat + d}&layer=mapnik&marker=${lat}%2C${lng}`
    : null;
  const mapQuery = encodeURIComponent(fullAddress);

  return (
    <>
      <PageHeader title="Contacto y ubicación" eyebrow={SCHOOL.officialName} description="Estamos en la localidad de Cajón, comuna de Vilcún. Escríbenos o visítanos." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-6">
            <section className="card p-7" aria-label="Datos de contacto">
              <h2 className="font-display text-2xl font-extrabold">Datos oficiales</h2>
              <dl className="mt-5 space-y-5">
                <div className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name="pin" size={24} /></span>
                  <div>
                    <dt className="text-sm font-semibold text-muted">Dirección</dt>
                    <dd className="font-semibold text-ink">{c.address}<br />{c.locality}, comuna de {c.commune}<br />Región de {c.region}</dd>
                  </div>
                </div>
                {c.phone && (
                  <div className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name="phone" size={24} /></span>
                    <div>
                      <dt className="text-sm font-semibold text-muted">Teléfono</dt>
                      <dd><a href={`tel:+56${c.phone.replace(/\D/g, "")}`} className="font-semibold text-ink hover:text-brand">{c.phone}</a></dd>
                    </div>
                  </div>
                )}
                {c.emails.filter(Boolean).length > 0 && (
                  <div className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name="mail" size={24} /></span>
                    <div>
                      <dt className="text-sm font-semibold text-muted">Correo electrónico</dt>
                      {c.emails.filter(Boolean).map((e) => (
                        <dd key={e}><a href={`mailto:${e}`} className="break-all font-semibold text-ink hover:text-brand">{e}</a></dd>
                      ))}
                    </div>
                  </div>
                )}
                {c.hours.filter(Boolean).length > 0 && (
                  <div className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky text-brand"><Icon name="clock" size={24} /></span>
                    <div>
                      <dt className="text-sm font-semibold text-muted">Horario de funcionamiento</dt>
                      {c.hours.filter(Boolean).map((h) => (
                        <dd key={h} className="font-semibold text-ink">{h}</dd>
                      ))}
                    </div>
                  </div>
                )}
              </dl>
              {s.social.length > 0 && (
                <div className="mt-6 border-t border-line pt-5">
                  <p className="mb-3 text-sm font-semibold text-muted">Redes sociales oficiales</p>
                  <ul className="flex flex-wrap gap-2">
                    {s.social.map((l) => {
                      const href = safeUrl(l.url);
                      return href ? (
                        <li key={l.id}>
                          <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm"><SocialIcon network={l.network} size={18} /> {l.label}</a>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
              {note && <p className="mt-5 text-muted">{note}</p>}
            </section>
          </div>

          <div>
            <h2 className="mb-4 font-display text-2xl font-extrabold">Escríbenos</h2>
            {enabled ? (
              <ContactForm formToken={token} />
            ) : (
              <Notice tone="warn" title="El formulario aún no está habilitado">
                Estamos terminando de conectar el servicio de correo. Mientras tanto, comunícate por teléfono o escribe directamente a los correos institucionales indicados.
              </Notice>
            )}
          </div>
        </div>
      </Section>

      <Section tone="paper" label="Mapa">
        <h2 className="mb-6 font-display text-3xl font-extrabold">Cómo llegar</h2>
        {osmEmbed ? (
          <div className="overflow-hidden rounded-3xl border border-line bg-white">
            <iframe title={`Mapa de ubicación de la ${SCHOOL.name}`} src={osmEmbed} loading="lazy" className="block h-[24rem] w-full border-0" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#b9b39b] bg-white p-8">
            <p className="text-lg"><strong>{fullAddress}</strong></p>
            <p className="mt-2 text-muted">El mapa integrado se activará cuando el colegio valide las coordenadas exactas de su ubicación (se cargan desde el panel). Mientras tanto, puedes abrir la dirección en un mapa:</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`https://www.openstreetmap.org/search?query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Abrir en OpenStreetMap <Icon name="external" size={16} /></a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Abrir en Google Maps <Icon name="external" size={16} /></a>
            </div>
          </div>
        )}
        <p className="mt-4 text-sm text-muted">Según el PEI, la escuela se encuentra a unos 12 km de la ciudad de Temuco.</p>
      </Section>
    </>
  );
}
