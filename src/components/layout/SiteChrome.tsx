import Image from "next/image";
import Link from "next/link";
import { Icon, SocialIcon } from "@/components/ui/Icon";
import { getSettings, liveAlerts } from "@/lib/content";
import { SCHOOL } from "@/content/pei";
import { safeUrl, isExternal } from "@/lib/utils";

export async function TopBar() {
  const s = await getSettings();
  return (
    <div className="bg-ink text-sm text-[#dce6f5]">
      <div className="container-page flex min-h-11 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
        <p className="flex items-center gap-2">
          <Icon name="pin" size={15} className="text-sun" />
          <span>
            <span className="hidden sm:inline">{SCHOOL.name} · </span>
            {s.contact.locality}, {s.contact.commune} · {s.contact.region}
          </span>
        </p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <li className="hidden sm:block">
            <Link href="/contacto" className="underline-offset-4 hover:underline">Contacto</Link>
          </li>
          <li className="hidden sm:block">
            <Link href="/documentos" className="underline-offset-4 hover:underline">Documentos institucionales</Link>
          </li>
          <li>
            <Link href="/admin" className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-sun px-3.5 font-bold text-ink hover:bg-white">
              <Icon name="lock" size={14} /> Acceso administración
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

const LEVEL_STYLES = {
  info: "bg-sky text-ink border-sky-2",
  importante: "bg-sun-tint text-[#4a3600] border-[#f0d982]",
  urgente: "bg-[#9b1c1c] text-white border-[#7f1717]",
} as const;

export async function PriorityAlerts() {
  const alerts = await liveAlerts();
  if (!alerts.length) return null;
  return (
    <div aria-label="Avisos institucionales" role="region">
      {alerts.map((a) => {
        const href = safeUrl(a.linkUrl);
        return (
          <div key={a.id} role={a.level === "urgente" ? "alert" : "status"} className={`border-b ${LEVEL_STYLES[a.level]}`}>
            <div className="container-page flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-[0.97rem]">
              <Icon name={a.level === "info" ? "info" : "alert"} size={18} />
              <p className="flex-1">
                <strong className="mr-1 uppercase tracking-wide">{a.level === "urgente" ? "Urgente" : "Aviso"}:</strong>
                {a.message}
              </p>
              {href && (
                <Link
                  href={href}
                  {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="font-bold underline underline-offset-4"
                >
                  {a.linkLabel || "Más información"}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export async function SiteFooter() {
  const s = await getSettings();
  const year = new Date().getFullYear();
  const emails = s.contact.emails.filter(Boolean);
  return (
    <footer className="bg-ink text-[#c5d3e8]">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_1fr_1fr]">
        <div>
          <div className="inline-block rounded-2xl bg-white px-3 py-2">
            <Image src="/logo.png" alt="Logotipo Escuela Particular Monterrey" width={900} height={436} className="h-16 w-auto" />
          </div>
          <p className="mt-4 font-display text-lg font-bold text-white">{SCHOOL.officialName}</p>
          <address className="mt-1 not-italic">
            {s.contact.address}, {s.contact.locality}
            <br />
            Comuna de {s.contact.commune}, Región de {s.contact.region}
            <br />
            RBD {SCHOOL.rbd}
          </address>
          {s.social.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.social.map((l) => {
                const href = safeUrl(l.url);
                if (!href) return null;
                return (
                  <li key={l.id}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${l.label} (se abre en una pestaña nueva)`} className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-sun hover:text-ink">
                      <SocialIcon network={l.network} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <h2 className="!text-[0.8rem] font-sans font-bold uppercase tracking-[0.08em] !text-sun">Contacto</h2>
          <ul className="mt-3 space-y-2">
            {s.contact.phone && (
              <li className="flex gap-2">
                <Icon name="phone" size={18} className="mt-1 shrink-0 text-sun" />
                <a href={`tel:+56${s.contact.phone.replace(/\D/g, "")}`} className="hover:text-white">{s.contact.phone}</a>
              </li>
            )}
            {emails.map((e) => (
              <li key={e} className="flex gap-2">
                <Icon name="mail" size={18} className="mt-1 shrink-0 text-sun" />
                <a href={`mailto:${e}`} className="break-all hover:text-white">{e}</a>
              </li>
            ))}
            {s.contact.hours.filter(Boolean).map((h) => (
              <li key={h} className="flex gap-2">
                <Icon name="clock" size={18} className="mt-1 shrink-0 text-sun" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="!text-[0.8rem] font-sans font-bold uppercase tracking-[0.08em] !text-sun">Explora</h2>
          <ul className="mt-3 space-y-2">
            {[
              ["/quienes-somos", "Quiénes somos"],
              ["/quienes-somos/proyecto-educativo", "Proyecto educativo"],
              ["/formacion", "Formación"],
              ["/noticias", "Noticias"],
              ["/calendario", "Calendario escolar"],
              ["/matriculas", "Matrículas y admisión"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white hover:underline">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="!text-[0.8rem] font-sans font-bold uppercase tracking-[0.08em] !text-sun">Comunidad</h2>
          <ul className="mt-3 space-y-2">
            {[
              ["/documentos", "Documentos institucionales"],
              ["/comunicados", "Comunicados"],
              ["/convivencia", "Convivencia escolar"],
              ["/preguntas-frecuentes", "Preguntas frecuentes"],
              ["/galerias", "Galerías"],
              ["/privacidad", "Privacidad"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white hover:underline">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-5 text-sm">
          <p>© {year} {SCHOOL.name}. Todos los derechos reservados.</p>
          <p>Cajón, Vilcún · La Araucanía, Chile</p>
        </div>
      </div>
    </footer>
  );
}
