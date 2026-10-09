export const NEWS_CATEGORIES = [
  "Noticias institucionales",
  "Actividades pedagógicas",
  "Deporte y recreación",
  "Arte y cultura",
  "Comunidad educativa",
  "Efemérides y celebraciones",
  "Reconocimientos",
  "Comunicados",
] as const;

export const EVENT_CATEGORIES = [
  { id: "Actividad pedagógica", short: "Pedagógica", color: "#14509f" },
  { id: "Reunión de apoderados", short: "Reunión", color: "#a15c00" },
  { id: "Acto escolar", short: "Acto", color: "#0e1f36" },
  { id: "Celebración institucional", short: "Celebración", color: "#6d28d9" },
  { id: "Deporte y cultura", short: "Deporte/cultura", color: "#0f766e" },
  { id: "Evento importante", short: "Importante", color: "#b91c1c" },
] as const;

export const ANNOUNCEMENT_CATEGORIES = [
  "General",
  "Reuniones",
  "Actividades",
  "Salud y seguridad",
  "Administrativo",
  "Urgente",
] as const;

export const DOCUMENT_CATEGORIES = [
  "Proyecto Educativo Institucional (PEI)",
  "Reglamento Interno y de Convivencia Escolar",
  "Reglamento de Evaluación",
  "Plan Integral de Seguridad Escolar (PISE)",
  "Plan de Mejoramiento Educativo (PME)",
  "Protocolos institucionales",
  "Comunicados y circulares",
  "Documentos para apoderados",
  "Documentación de matrículas",
  "Otros documentos públicos",
] as const;

export const GALLERY_CATEGORIES = [
  "Actividades escolares",
  "Actos y celebraciones",
  "Deporte y recreación",
  "Arte y cultura",
  "Instalaciones",
  "Comunidad educativa",
] as const;

export const FAQ_GROUPS = ["La escuela", "Matrículas y admisión", "Vida escolar", "Documentos y trámites"] as const;

export const ALERT_LEVELS = [
  { id: "info", label: "Informativo" },
  { id: "importante", label: "Importante" },
  { id: "urgente", label: "Urgente" },
] as const;

export const SOCIAL_NETWORKS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "x", label: "X (Twitter)" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "web", label: "Otro sitio web" },
] as const;

/** Textos institucionales editables desde el panel. El valor por defecto proviene del PEI cuando existe. */
export const TEXT_FIELDS = [
  {
    key: "welcome_1",
    label: "Bienvenida · primer párrafo",
    help: "Aparece en la portada y en «Quiénes somos».",
    rows: 4,
    default:
      "La Escuela Particular N° 500 Monterrey se fundó en 1982 para responder a las necesidades de educación de un pequeño lugar de la comuna de Vilcún llamado Monterrey, al que debe su nombre. Desde 1989 funciona en la localidad de Cajón.",
  },
  {
    key: "welcome_2",
    label: "Bienvenida · segundo párrafo",
    help: "Aparece en la portada y en «Quiénes somos».",
    rows: 4,
    default:
      "Hoy recibe a niños y niñas desde Nivel de Transición 1 hasta 8° año de Enseñanza Básica, provenientes de Cajón, Pillanlelbun, Temuco y comunidades mapuche cercanas.",
  },
  {
    key: "admission_intro",
    label: "Admisión · presentación",
    help: "Texto introductorio de la página de matrículas.",
    rows: 4,
    default:
      "La Escuela Particular Monterrey es un establecimiento particular subvencionado que recibe a niños y niñas desde Nivel de Transición 1 hasta 8° año de Enseñanza Básica, en jornada escolar completa.",
  },
  {
    key: "admission_process",
    label: "Admisión · proceso",
    help: "Describe cómo postular o matricular. Complétalo solo con información oficial.",
    rows: 5,
    default: "",
  },
  {
    key: "admission_requirements",
    label: "Admisión · requisitos",
    help: "Requisitos oficialmente informados. Un requisito por línea.",
    rows: 5,
    default: "",
  },
  {
    key: "admission_dates",
    label: "Admisión · fechas importantes",
    help: "Fechas del proceso vigente. Una por línea.",
    rows: 4,
    default: "",
  },
  {
    key: "admission_documents",
    label: "Admisión · documentos necesarios",
    help: "Documentos que las familias deben presentar. Uno por línea. No se solicitan documentos personales por este sitio.",
    rows: 4,
    default: "",
  },
  {
    key: "convivencia_intro",
    label: "Convivencia · presentación",
    help: "Introducción de la página de convivencia escolar.",
    rows: 4,
    default:
      "La escuela cuenta con un Equipo de Convivencia Escolar y se rige por su Reglamento de Convivencia Escolar. Su plan de convivencia se actualiza año a año según la normativa vigente y las necesidades de la comunidad educativa.",
  },
  {
    key: "convivencia_contact",
    label: "Convivencia · contacto pertinente",
    help: "Cómo contactar a la persona encargada de convivencia. Escríbelo solo con datos verificados.",
    rows: 3,
    default: "",
  },
  {
    key: "images_policy",
    label: "Política de imágenes de estudiantes",
    help: "Se muestra en la sección Vida escolar y en las galerías.",
    rows: 4,
    default:
      "La escuela publica imágenes de estudiantes únicamente cuando cuenta con la autorización de sus apoderados. Si deseas retirar una fotografía o no autorizar su difusión, escríbenos y la eliminaremos.",
  },
  {
    key: "contact_note",
    label: "Contacto · nota adicional",
    help: "Opcional. Por ejemplo, indicaciones para visitas.",
    rows: 3,
    default: "",
  },
] as const;

export type TextKey = (typeof TEXT_FIELDS)[number]["key"];

export const SITE_NAV = [
  {
    label: "Quiénes somos",
    href: "/quienes-somos",
    children: [
      { label: "Nuestra historia", href: "/quienes-somos/historia", desc: "Desde 1982 en el territorio" },
      { label: "Misión y visión", href: "/quienes-somos/mision-vision", desc: "Textos oficiales del PEI" },
      { label: "Sellos y valores", href: "/quienes-somos/sellos-y-valores", desc: "Lo que nos distingue" },
      { label: "Nuestro proyecto educativo", href: "/quienes-somos/proyecto-educativo", desc: "PEI y descarga en PDF" },
      { label: "Equipo directivo", href: "/quienes-somos/equipo-directivo", desc: "Quiénes conducen la escuela" },
      { label: "Nuestro establecimiento", href: "/quienes-somos/establecimiento", desc: "Espacios y recursos" },
    ],
  },
  {
    label: "Formación",
    href: "/formacion",
    children: [
      { label: "Enfoque pedagógico", href: "/formacion#enfoque", desc: "Competencias, DUA y evaluación" },
      { label: "Niveles educativos", href: "/formacion#niveles", desc: "NT1 a 8° básico" },
      { label: "Formación integral", href: "/formacion#integral", desc: "Pilares, principios y valores" },
      { label: "Inclusión y apoyo", href: "/formacion#inclusion", desc: "PIE, SEP y redes de apoyo" },
      { label: "Actividades complementarias", href: "/formacion#talleres", desc: "Talleres y plan de estudios" },
      { label: "Biblioteca y recursos", href: "/formacion#recursos", desc: "CRA, informática y plataformas" },
    ],
  },
  { label: "Noticias", href: "/noticias" },
  {
    label: "Vida escolar",
    href: "/vida-escolar",
    children: [
      { label: "Vida escolar", href: "/vida-escolar", desc: "Actividades y comunidad" },
      { label: "Galerías", href: "/galerias", desc: "Fotografías por actividad" },
      { label: "Convivencia y bienestar", href: "/convivencia", desc: "Buen trato y protocolos" },
    ],
  },
  { label: "Calendario", href: "/calendario" },
  {
    label: "Familias",
    href: "/documentos",
    children: [
      { label: "Documentos", href: "/documentos", desc: "PEI, reglamentos y protocolos" },
      { label: "Comunicados", href: "/comunicados", desc: "Avisos para apoderados" },
      { label: "Matrículas y admisión", href: "/matriculas", desc: "Información para nuevas familias" },
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes", desc: "Respuestas rápidas" },
    ],
  },
  { label: "Contacto", href: "/contacto" },
] as const;
