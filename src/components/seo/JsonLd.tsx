import { SCHOOL } from "@/content/pei";
import { SITE_URL } from "@/lib/env";
import type { Settings } from "@/lib/db/types";

/** Datos estructurados de la organización educativa: solo datos oficiales del PEI/ajustes (sin coordenadas inventadas). */
export function SchoolJsonLd({ settings }: { settings: Settings }) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "School",
    name: SCHOOL.officialName,
    alternateName: SCHOOL.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    foundingDate: String(SCHOOL.foundedYear),
    identifier: `RBD ${SCHOOL.rbd}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.contact.address,
      addressLocality: settings.contact.locality,
      addressRegion: settings.contact.region,
      addressCountry: "CL",
    },
    areaServed: `${settings.contact.commune}, ${settings.contact.region}`,
  };
  if (settings.contact.phone) data.telephone = `+56 ${settings.contact.phone}`;
  const email = settings.contact.emails.find(Boolean);
  if (email) data.email = email;
  const sameAs = settings.social.map((s) => s.url).filter((u) => /^https?:\/\//.test(u));
  if (sameAs.length) data.sameAs = sameAs;
  if (settings.contact.mapLat && settings.contact.mapLng) {
    data.geo = { "@type": "GeoCoordinates", latitude: settings.contact.mapLat, longitude: settings.contact.mapLng };
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
