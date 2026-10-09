import { saveCommunity, saveContact, saveHero, saveSocial, saveTexts } from "@/app/admin/actions/site";
import { AdminForm, Field, FileField, Select, TextArea } from "@/components/admin/forms";
import { AdminPageHeader, Panel } from "@/components/admin/parts";
import { Notice } from "@/components/ui/common";
import { requireUser } from "@/lib/auth";
import { SOCIAL_NETWORKS, TEXT_FIELDS } from "@/lib/constants";
import { db } from "@/lib/db/store";

const SECTIONS = [
  ["portada", "Portada"],
  ["contacto", "Contacto"],
  ["redes", "Redes sociales"],
  ["accesos", "Accesos de la comunidad"],
  ["textos", "Textos institucionales"],
];

export default async function ConfiguracionPage() {
  await requireUser("settings");
  const s = await db.settings.get();
  const socialRows = Array.from({ length: 6 }, (_, i) => s.social[i]);
  const communityRows = Array.from({ length: 8 }, (_, i) => s.community[i]);

  return (
    <>
      <AdminPageHeader title="Portada y contacto" description="Datos oficiales, imágenes de la portada, redes y accesos que se muestran en todo el sitio." />
      <nav aria-label="Secciones de configuración" className="mb-8 flex flex-wrap gap-2">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="btn btn-outline btn-sm">{label}</a>
        ))}
      </nav>

      <div className="space-y-10">
        <Panel title="Portada">
          <div id="portada" className="-mt-24 pt-24" aria-hidden="true" />
          <AdminForm action={saveHero} submitLabel="Guardar portada">
            <Field name="title" label="Título principal" required maxLength={80} defaultValue={s.hero.title} />
            <TextArea name="subtitle" label="Mensaje de bienvenida" required rows={3} maxLength={240} defaultValue={s.hero.subtitle} hint="Se muestra bajo el título. Puedes usar una frase del PEI." />
            <fieldset className="space-y-4 rounded-2xl border border-line bg-white p-4">
              <legend className="px-2 font-semibold">Fotografías de la portada (carrusel)</legend>
              {s.hero.slides.length === 0 && <p className="text-muted">Sin fotografías: se muestra una ilustración referencial. Con una foto se muestra fija; con varias, un carrusel con controles manuales.</p>}
              <ul className="grid gap-4 sm:grid-cols-2">
                {s.hero.slides.map((sl, i) => (
                  <li key={sl.mediaId} className="space-y-2 rounded-xl border border-line p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/media/${sl.mediaId}`} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
                    <Field name={`slide_alt_${i}`} label="Texto alternativo" defaultValue={sl.alt} maxLength={200} />
                    <label className="flex cursor-pointer items-center gap-2 font-semibold text-[#9b1c1c]"><input type="checkbox" name={`slide_del_${i}`} className="size-5 accent-[#9b1c1c]" /> Quitar de la portada</label>
                  </li>
                ))}
              </ul>
              <FileField name="slide_new" label="Agregar fotografías (hasta 6 en total)" accept="image/jpeg,image/png,image/webp" multiple hint="Formato casi cuadrado funciona mejor. Solo imágenes autorizadas." />
            </fieldset>
          </AdminForm>
        </Panel>

        <Panel title="Datos de contacto">
          <div id="contacto" className="-mt-24 pt-24" aria-hidden="true" />
          <AdminForm action={saveContact} submitLabel="Guardar contacto">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="lg:col-span-2"><Field name="address" label="Dirección (calle y número)" required defaultValue={s.contact.address} /></div>
              <Field name="locality" label="Localidad" required defaultValue={s.contact.locality} />
              <Field name="commune" label="Comuna" required defaultValue={s.contact.commune} />
              <Field name="region" label="Región" required defaultValue={s.contact.region} />
              <Field name="phone" label="Teléfono" defaultValue={s.contact.phone} hint="Con código de área, por ejemplo 45 237 1282." />
              <TextArea name="emails" label="Correos institucionales (uno por línea)" rows={3} defaultValue={s.contact.emails.join("\n")} />
              <TextArea name="hours" label="Horarios (uno por línea)" rows={3} defaultValue={s.contact.hours.join("\n")} />
              <Field name="mapLat" label="Latitud del mapa (opcional)" defaultValue={s.contact.mapLat} placeholder="-38.00000" hint="Solo con coordenadas validadas por el colegio." />
              <Field name="mapLng" label="Longitud del mapa (opcional)" defaultValue={s.contact.mapLng} placeholder="-72.00000" />
            </div>
          </AdminForm>
        </Panel>

        <Panel title="Redes sociales oficiales">
          <div id="redes" className="-mt-24 pt-24" aria-hidden="true" />
          <AdminForm action={saveSocial} submitLabel="Guardar redes">
            <p className="text-muted">Agrega solo cuentas oficiales del establecimiento. Las filas vacías se ignoran.</p>
            {socialRows.map((r, i) => (
              <div key={i} className="grid gap-4 rounded-2xl border border-line bg-white p-4 lg:grid-cols-[1fr_1fr_2fr]">
                <Select name={`network_${i}`} label={`Red ${i + 1}`} options={SOCIAL_NETWORKS.map((n) => ({ value: n.id, label: n.label }))} defaultValue={r?.network ?? "facebook"} />
                <Field name={`label_${i}`} label="Nombre visible" defaultValue={r?.label} maxLength={40} />
                <Field name={`url_${i}`} label="Enlace (https://…)" defaultValue={r?.url} />
              </div>
            ))}
          </AdminForm>
        </Panel>

        <Panel title="Accesos de la comunidad">
          <div id="accesos" className="-mt-24 pt-24" aria-hidden="true" />
          <AdminForm action={saveCommunity} submitLabel="Guardar accesos">
            <p className="text-muted">Enlaces a plataformas oficiales de aprendizaje, comunicación o gestión escolar que use el colegio. No se inventan plataformas: solo aparece lo que agregues aquí.</p>
            {communityRows.map((r, i) => (
              <div key={i} className="grid gap-4 rounded-2xl border border-line bg-white p-4 lg:grid-cols-3">
                <Field name={`label_${i}`} label={`Nombre ${i + 1}`} defaultValue={r?.label} maxLength={80} />
                <Field name={`url_${i}`} label="Enlace (https://…)" defaultValue={r?.url} />
                <Field name={`description_${i}`} label="Descripción breve" defaultValue={r?.description} maxLength={160} />
              </div>
            ))}
          </AdminForm>
        </Panel>

        <Panel title="Textos institucionales">
          <div id="textos" className="-mt-24 pt-24" aria-hidden="true" />
          <AdminForm action={saveTexts} submitLabel="Guardar textos">
            <Notice tone="info" title="Misión, visión y sellos">Los textos oficiales de misión, visión y sellos provienen del PEI y se modifican en el código del sitio cuando el establecimiento publique un nuevo PEI. Aquí puedes editar los demás textos. Si dejas uno en blanco, se restablece el original.</Notice>
            {TEXT_FIELDS.map((f) => (
              <TextArea key={f.key} name={f.key} label={f.label} rows={f.rows} defaultValue={s.texts[f.key]} hint={f.help} />
            ))}
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
