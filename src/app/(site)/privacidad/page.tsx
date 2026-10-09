import type { Metadata } from "next";
import { Notice, PageHeader, Section } from "@/components/ui/common";
import { getSettings, getText } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacidad y protección de datos",
  description: "Cómo la Escuela Particular Monterrey trata los datos personales y las imágenes de estudiantes en este sitio.",
  alternates: { canonical: "/privacidad" },
};

export default async function PrivacidadPage() {
  const [s, policy] = await Promise.all([getSettings(), getText("images_policy")]);
  const email = s.contact.emails.find(Boolean);
  return (
    <>
      <PageHeader title="Privacidad y protección de datos" eyebrow="Escuela Particular Monterrey" />
      <Section>
        <div className="prose-escuela mx-auto max-w-3xl">
          <p>Este sitio es informativo. Está pensado para mostrar la vida del colegio sin exponer información personal de niños, niñas y adolescentes.</p>
          <h2>Qué datos recopila este sitio</h2>
          <ul>
            <li><strong>Navegación:</strong> el sitio no usa cookies de seguimiento ni herramientas de análisis de terceros. Las cookies técnicas se usan solo en el acceso privado del personal autorizado.</li>
            <li><strong>Formulario de contacto:</strong> si lo utilizas, recibimos tu nombre, correo, asunto y mensaje, únicamente para responderte. No los usamos para otros fines ni los compartimos con terceros distintos del servicio de correo que entrega el mensaje.</li>
            <li><strong>Postulaciones y documentos personales:</strong> este sitio no los recibe. Los trámites de matrícula se realizan por los canales oficiales de la escuela y del Ministerio de Educación.</li>
          </ul>
          <h2>Imágenes de estudiantes</h2>
          <p>{policy}</p>
          <h2>Tus derechos</h2>
          <p>Puedes solicitar acceso, corrección o eliminación de los datos que nos hayas entregado, y pedir que retiremos una imagen publicada{email ? <>. Escríbenos a <a href={`mailto:${email}`}>{email}</a> o llama al {s.contact.phone}.</> : "."}</p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <Notice tone="warn" title="Documento por validar">
            Este texto resume buenas prácticas generales y debe ser revisado por la dirección y el sostenedor del establecimiento antes de considerarse la política oficial de privacidad.
          </Notice>
        </div>
      </Section>
    </>
  );
}
