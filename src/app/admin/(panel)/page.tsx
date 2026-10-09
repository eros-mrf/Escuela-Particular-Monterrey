import Link from "next/link";
import { purgeDemoContent } from "@/app/admin/actions/system";
import { DeleteButton } from "@/components/admin/forms";
import { AdminPageHeader, Flash, Panel } from "@/components/admin/parts";
import { Icon } from "@/components/ui/Icon";
import { can, requireUser } from "@/lib/auth";
import { alertIsLive, announcementState, sortNews } from "@/lib/content";
import { db } from "@/lib/db/store";
import { contactMailConfigured } from "@/lib/env";
import { formatDate, formatTimeRange, todayCL } from "@/lib/time";
import { pick } from "@/lib/utils";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function PanelHome({ searchParams }: { searchParams: SP }) {
  const user = await requireUser();
  const sp = await searchParams;
  const today = todayCL();
  const [news, events, announcements, alerts, docs, galleries] = await Promise.all([db.news.all(), db.events.all(), db.announcements.all(), db.alerts.all(), db.documents.all(), db.galleries.all()]);

  const published = news.filter((n) => n.status === "published" && n.publishedAt <= today).length;
  const scheduled = news.filter((n) => n.status === "published" && n.publishedAt > today).length;
  const drafts = news.filter((n) => n.status === "draft");
  const upcoming = events.filter((e) => (e.endDate ?? e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const activeAnn = announcements.filter((a) => a.status === "published" && announcementState(a, today) === "vigente").length;
  const liveAlerts = alerts.filter((a) => alertIsLive(a, today)).length;
  const docsPublic = docs.filter((d) => d.published).length;
  const demoCount = [...news, ...events, ...announcements, ...alerts, ...docs, ...galleries].filter((x) => "demo" in x && x.demo).length;

  const stats = [
    { label: "Noticias publicadas", n: published, href: "/admin/noticias?estado=publicadas" },
    { label: "Borradores", n: drafts.length, href: "/admin/noticias?estado=borrador" },
    { label: "Próximos eventos", n: upcoming.length, href: "/admin/eventos" },
    { label: "Comunicados activos", n: activeAnn, href: "/admin/comunicados" },
    { label: "Documentos públicos", n: docsPublic, href: "/admin/documentos" },
  ];
  const quick = [
    { href: "/admin/noticias/nueva", label: "Nueva noticia", area: "news" as const },
    { href: "/admin/eventos/nueva", label: "Nuevo evento", area: "events" as const },
    { href: "/admin/comunicados/nueva", label: "Nuevo comunicado", area: "announcements" as const },
    { href: "/admin/avisos/nueva", label: "Aviso prioritario", area: "alerts" as const },
    { href: "/admin/galerias/nueva", label: "Nueva galería", area: "galleries" as const },
    { href: "/admin/documentos/nueva", label: "Subir documento", area: "documents" as const },
  ].filter((q) => can(user, q.area));

  const checks = [
    { ok: Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32), label: "Clave de sesiones (SESSION_SECRET)", fix: "Defínela en el servidor; sin ella el panel no inicia en producción." },
    { ok: Boolean(process.env.SETUP_TOKEN && process.env.SETUP_TOKEN.length >= 12), label: "Código de recuperación (SETUP_TOKEN)", fix: "Permite recuperar el acceso si se pierde la contraseña." },
    { ok: contactMailConfigured(), label: "Envío de correo del formulario de contacto", fix: "Faltan RESEND_API_KEY, CONTACT_TO_EMAIL y CONTACT_FROM_EMAIL: el formulario figura «no habilitado»." },
    { ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL), label: "Dirección pública del sitio (NEXT_PUBLIC_SITE_URL)", fix: "Necesaria para SEO, mapa del sitio y enlaces para compartir." },
  ];

  return (
    <>
      <AdminPageHeader title={`Hola, ${user.name.split(" ")[0]}`} description="Resumen del contenido publicado y accesos rápidos." />
      <Flash code={pick(sp.aviso) ?? (sp.clave ? "clave-cambiada" : undefined)} />

      <ul className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="card lift block p-5">
              <span className="block text-sm font-semibold text-muted">{s.label}</span>
              <span className="block font-display text-4xl font-extrabold text-brand">{s.n}</span>
            </Link>
          </li>
        ))}
      </ul>
      {(scheduled > 0 || liveAlerts > 0) && (
        <p className="-mt-4 mb-8 text-sm text-muted">
          {scheduled > 0 && <>Hay {scheduled} {scheduled === 1 ? "noticia programada" : "noticias programadas"} para una fecha futura. </>}
          {liveAlerts > 0 && <>{liveAlerts} {liveAlerts === 1 ? "aviso prioritario visible" : "avisos prioritarios visibles"} ahora.</>}
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <Panel title="Publicar ahora">
            <ul className="grid gap-3 sm:grid-cols-2">
              {quick.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="flex min-h-14 items-center gap-3 rounded-2xl border border-dashed border-[#9db8e0] bg-[#f5f9fe] px-4 font-bold text-brand hover:bg-sky">
                    <Icon name="close" size={18} className="rotate-45" /> {q.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Próximas actividades">
            {upcoming.length ? (
              <ul className="divide-y divide-line">
                {upcoming.slice(0, 5).map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <Link href={`/admin/eventos/${e.id}`} className="font-semibold hover:text-brand">{e.title}</Link>
                    <span className="text-sm text-muted">{formatDate(e.date, "short")} {formatTimeRange(e.startTime, e.endTime)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No hay actividades agendadas.</p>
            )}
          </Panel>

          {drafts.length > 0 && (
            <Panel title="Borradores pendientes">
              <ul className="divide-y divide-line">
                {sortNews(drafts).slice(0, 5).map((n) => (
                  <li key={n.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <Link href={`/admin/noticias/${n.id}`} className="font-semibold hover:text-brand">{n.title}</Link>
                    <span className="text-sm text-muted">{formatDate(n.publishedAt, "short")}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        <div className="space-y-8">
          {user.role === "admin" && (
            <Panel title="Estado del sistema">
              <p className="mb-3 text-sm text-muted">Información real de la configuración del servidor. No se muestran visitas ni estadísticas de uso, porque no hay una fuente de datos conectada.</p>
              <ul className="space-y-3">
                <li className="flex gap-3"><Icon name="check" size={20} className="mt-0.5 shrink-0 text-[#14532d]" /><span><strong>Almacenamiento:</strong> archivos en el servidor del sitio. El contenido se conserva al reiniciar; requiere disco persistente y respaldos.</span></li>
                {checks.map((c) => (
                  <li key={c.label} className="flex gap-3">
                    <Icon name={c.ok ? "check" : "alert"} size={20} className={`mt-0.5 shrink-0 ${c.ok ? "text-[#14532d]" : "text-[#a15c00]"}`} />
                    <span><strong>{c.label}:</strong> {c.ok ? "configurado" : <span className="text-[#7a4a00]">pendiente. {c.fix}</span>}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {demoCount > 0 && can(user, "settings") && (
            <Panel title="Contenido de demostración">
              <p className="text-muted">Hay {demoCount} elementos de ejemplo cargados para probar el diseño. Están marcados como «Demostración» en el sitio público y no son información real del colegio.</p>
              <div className="mt-4">
                <DeleteButton action={purgeDemoContent} label="Eliminar contenido de demostración" title="¿Eliminar todo el contenido de demostración?" description="Se eliminarán las noticias, eventos, comunicados, avisos, documentos y galerías marcados como demostración." />
              </div>
            </Panel>
          )}

          <Panel title="Ayuda rápida">
            <ul className="space-y-2 text-[0.97rem]">
              <li><strong>Publicar una noticia:</strong> Noticias → Nueva noticia → «Publicar».</li>
              <li><strong>Subir un PDF:</strong> Documentos → Subir documento.</li>
              <li><strong>Agendar una actividad:</strong> Calendario → Nuevo evento.</li>
              <li><strong>Avisar algo urgente:</strong> Avisos prioritarios (siempre con fecha de expiración).</li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
