import { PEI_PDF_URL, SCHOOL } from "@/content/pei";
import type { DocumentItem, Faq, Settings, TeamMember } from "@/lib/db/types";
import { TEXT_FIELDS } from "@/lib/constants";

export function defaultSettings(): Settings {
  return {
    contact: {
      address: SCHOOL.address,
      locality: SCHOOL.locality,
      commune: SCHOOL.commune,
      region: SCHOOL.region,
      phone: SCHOOL.phone,
      emails: [...SCHOOL.emails],
      hours: SCHOOL.schedule.map((s) => `${s.days}: ${s.hours}`),
      mapLat: "",
      mapLng: "",
    },
    social: [],
    community: [
      {
        id: "sae",
        label: "Sistema de Admisión Escolar (Mineduc)",
        description: "Sitio oficial del Ministerio de Educación para el proceso de admisión escolar.",
        url: "https://www.sistemadeadmisionescolar.cl",
      },
    ],
    hero: {
      title: SCHOOL.name,
      subtitle:
        "Una comunidad educativa inclusiva que forma a niños y niñas con altas expectativas de desarrollo, en Cajón, comuna de Vilcún.",
      slides: [],
    },
    texts: Object.fromEntries(TEXT_FIELDS.map((f) => [f.key, f.default])),
  };
}

export function defaultDocuments(): DocumentItem[] {
  return [
    {
      id: "pei-2019-2023",
      title: "Proyecto Educativo Institucional (PEI) 2019–2023",
      description:
        "Documento rector de la escuela: identificación del establecimiento, misión, visión, sellos, principios y valores, modelo pedagógico, plan de estudios, diagnóstico institucional y organización.",
      category: "Proyecto Educativo Institucional (PEI)",
      file: { kind: "static", url: PEI_PDF_URL },
      fileType: "PDF",
      sizeBytes: 499_000,
      updatedAt: "2019-03-31",
      published: true,
      createdAt: "2019-03-31T00:00:00.000Z",
    },
  ];
}

export function defaultTeam(): TeamMember[] {
  return [
    {
      id: "directora",
      name: SCHOOL.director,
      role: "Directora",
      bio: "Dirige el establecimiento desde 2008. Información según el PEI 2019–2023.",
      order: 1,
      published: true,
    },
    {
      id: "jefe-utp",
      name: "Luis Alvaro Valenzuela Venegas",
      role: "Jefe de la Unidad Técnico-Pedagógica (UTP)",
      bio: "Información según el PEI 2019–2023. Por validar su vigencia.",
      order: 2,
      published: true,
    },
  ];
}

export function defaultFaqs(): Faq[] {
  const f = (order: number, group: string, question: string, answer: string): Faq => ({
    id: `faq-${order}`,
    order,
    group,
    question,
    answer,
    published: true,
  });
  return [
    f(1, "La escuela", "¿Dónde está ubicada la escuela?", "En Alejandro Urrutia N° 485, localidad de Cajón, comuna de Vilcún, Región de La Araucanía. Según el PEI, se encuentra a unos 12 km de la ciudad de Temuco."),
    f(2, "La escuela", "¿Qué niveles se imparten?", "Educación Parvularia (Nivel de Transición 1 y 2) y Enseñanza Básica de 1° a 8° año."),
    f(3, "La escuela", "¿Qué tipo de establecimiento es?", "Es una escuela particular subvencionada, que funciona con Jornada Escolar Completa y trabaja con los planes y programas del Ministerio de Educación."),
    f(4, "Vida escolar", "¿Cuál es el horario de funcionamiento?", "De lunes a jueves, de 08:30 a 15:50 horas, y los viernes de 08:30 a 14:05 horas (Educación Parvularia y Básica)."),
    f(5, "Vida escolar", "¿Qué talleres ofrece la escuela?", "El PEI declara talleres de banda de guerra, danza folclórica, taekwondo, atletismo, gimnasia rítmica, teatro escolar, cocina, inglés y pintura, entre otros. Consulta en secretaría cuáles están vigentes este año."),
    f(6, "Documentos y trámites", "¿Dónde puedo leer el Proyecto Educativo?", "En la sección Documentos puedes visualizar y descargar el PEI 2019–2023 en formato PDF."),
    f(7, "Documentos y trámites", "¿Qué reglamentos rigen a la escuela?", "Según el PEI, la escuela se rige por el Reglamento de Orden, Higiene y Seguridad, el Reglamento de Convivencia Escolar y el Reglamento de Evaluación y Promoción Escolar. Cuando el establecimiento los publique, estarán disponibles en la sección Documentos."),
    f(8, "Matrículas y admisión", "¿Cómo puedo matricular a mi hijo o hija?", "El establecimiento publicará en la sección Matrículas el proceso, los requisitos y las fechas vigentes. Mientras tanto, puedes consultar por teléfono al 45 237 1282 o por correo electrónico a los canales oficiales de contacto."),
    f(9, "Matrículas y admisión", "¿Esta página recibe postulaciones o documentos personales?", "No. Este sitio es informativo: no recibe postulaciones ni solicita documentos personales. Los trámites se realizan por los canales oficiales del establecimiento y del Ministerio de Educación."),
  ];
}
