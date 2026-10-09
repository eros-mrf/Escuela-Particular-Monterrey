/**
 * Contenido institucional extraído del Proyecto Educativo Institucional (PEI) 2019–2023
 * de la Escuela Particular Monterrey N° 500 (RBD 5955-2), firmado en Cajón en marzo de 2019.
 *
 * Los textos de misión, visión, sellos, principios y valores se conservan con su
 * formulación oficial. No agregar aquí información que no esté en el PEI o que no haya
 * sido validada por la dirección del establecimiento.
 */

export const PEI_PERIOD = "2019–2023";
export const PEI_PDF_URL = "/documentos/proyecto-educativo-institucional-2019-2023.pdf";

export const SCHOOL = {
  name: "Escuela Particular Monterrey",
  officialName: "Escuela Particular Monterrey N° 500",
  shortName: "Escuela Monterrey",
  number: "500",
  rbd: "5955-2",
  foundedYear: 1982,
  dependency: "Particular Subvencionado",
  levels: "Nivel de Transición 1 a 8° año de Enseñanza Básica",
  decree: "Decreto Cooperador de la Función Educacional del Estado N° 935 del año 1982",
  director: "Dory Huenchuleo Molina",
  address: "Alejandro Urrutia N° 485",
  locality: "Cajón",
  commune: "Vilcún",
  region: "La Araucanía",
  phone: "45 237 1282",
  phoneIntl: "+56452371282",
  emails: ["monterrey.es_dorys@hotmail.com", "escuelamonterrey2013@gmail.com"],
  schedule: [
    { days: "Lunes a jueves", hours: "08:30 a 15:50 h" },
    { days: "Viernes", hours: "08:30 a 14:05 h" },
  ],
  anniversaryMonth: "octubre",
} as const;

export const VISION =
  "Aspiramos a consolidarnos como una comunidad educativa inclusiva, orientada a formar niños y niñas con altas expectativas de desarrollo asegurando el éxito académico y un buen convivir, a través de una sólida formación social y cognitiva, inspirados en el amor a Dios y al prójimo.";

export const MISSION =
  "Educamos de forma integral e inclusiva a niños y niñas, garantizando las condiciones adecuadas para un aprendizaje cognitivo y valórico orientado al alto logro, a través de metodologías innovadoras y efectivas que aseguren una transición exitosa a la enseñanza media y superior.";

export const SEALS = [
  {
    id: "educacion-cristiana",
    title: "Educación cristiana",
    icon: "cross",
    text: "Creemos y confiamos en la educación cristiana, como guía valórica para la buena convivencia de toda la comunidad educativa.",
  },
  {
    id: "altos-estandares-inclusion",
    title: "Altos estándares e inclusión",
    icon: "heart",
    text: "Estamos comprometidos con lograr altos estándares de educación expresados en procesos formativos inclusivos, incorporando elementos propios de la cultura mapuche y del entorno.",
  },
  {
    id: "innovacion-mejora-continua",
    title: "Innovación y mejora continua",
    icon: "lightbulb",
    text: "Potenciamos la innovación educativa y la mejora continua fortaleciendo prácticas pedagógicas de calidad.",
  },
] as const;

export const PILLARS = [
  { title: "Aprender a ser", icon: "sprout" },
  { title: "Aprender a aprender", icon: "book" },
  { title: "Aprender a convivir", icon: "users" },
  { title: "Aprender a hacer", icon: "hammer" },
] as const;

export const PILLARS_NOTE =
  "El proceso formativo de la escuela se alza sobre cuatro pilares de la educación establecidos en el Informe sobre la Educación del siglo XXI, presidido por Jacques Delors.";

export const PRINCIPLES = [
  {
    title: "Amor a Dios",
    text: "El amor a Dios es un amor de entrega absoluta, sacrificio y es totalmente desinteresado, podríamos decir que es el verdadero amor, este amor es superior a cualquier clase de amor humano, porque el amor de Dios es profundo, eterno y fiel.",
  },
  {
    title: "Amor al prójimo",
    text: "Amar al prójimo es uno de los mandamientos más importantes, significa respetar y brindar ayuda al otro sin esperar retribución.",
  },
  {
    title: "Excelencia",
    text: "Es una actitud que nos impulsa a realizar nuestras actividades con calidad, de manera sobresaliente, tendiendo a la mejora continua.",
  },
  {
    title: "Integralidad",
    text: "Totalidad de actitudes que puede llegar a reunir un ser humano. Una persona íntegra se destaca por desarrollarse en el área cognitiva, valórica y social.",
  },
] as const;

export const VALUES = [
  {
    title: "Respeto",
    text: "Entendido como uno de los valores morales más importantes del ser humano, pues implica lograr una armoniosa interacción social, entender, comprender al otro y valorar sus intereses, necesidades e individualidades.",
  },
  {
    title: "Gratitud",
    text: "La gratitud está vinculada al agradecimiento, que es la acción y efecto de agradecer. Por lo tanto, la persona que siente gratitud desea agradecer el beneficio recibido.",
  },
  {
    title: "Solidaridad",
    text: "Cuando dos o más personas se unen y colaboran mutuamente para conseguir un fin común. La solidaridad es compartir con otros, tanto en lo material como en lo sentimental, es ofrecer ayuda a los demás y una colaboración mutua entre las personas.",
  },
  {
    title: "Responsabilidad",
    text: "Es la capacidad de comprometerse y actuar de forma correcta, ejerciendo sus derechos y desempeñando adecuadamente sus obligaciones.",
  },
  {
    title: "Perseverancia",
    text: "Referida a la constancia y dedicación en la ejecución de algún propósito.",
  },
] as const;

export const ATTITUDES = [
  "Empatía",
  "Valoración del otro y su opinión.",
  "Reconocimiento de la propia dignidad y la de los demás.",
  "Actuar de acuerdo a las normas establecidas en la comunidad educativa.",
  "Valoración de nuestra vida y sus bendiciones.",
  "Agradecer por lo que se tiene.",
  "Apreciar lo que se recibe.",
  "Expresar optimismo.",
  "Ayudar al otro.",
  "Acompañar en momentos difíciles a quien lo necesite.",
  "Reconocer y valorar la diferencia como un aporte a la convivencia.",
  "Valoración por el trabajo bien hecho y orientación a la calidad.",
] as const;

export const COMMUNITY_TRAITS = [
  "Compromiso por el desarrollo integral de niños y niñas.",
  "Atendemos a las necesidades educativas.",
  "Estamos comprometidos con la calidad de la acción educativa, expresado en procesos formativos y organizacionales orientados a logros.",
  "Mejora continua e innovación.",
  "Valoración de la diversidad y las capacidades distintas.",
  "Creemos y propiciamos la formación cristiana como sello valórico en la educación de niños y niñas.",
] as const;

export const PROFILES: { who: string; items: string[] }[] = [
  {
    who: "Estudiantes",
    items: [
      "Muestran ser cuidadosos por el bienestar común, manteniendo el diálogo permanente, valorando y reconociendo diferencias cognitivas, psicosociales y culturales.",
      "Son estudiantes con conductas prosociales, basadas en valores cristianos.",
      "Tienen capacidad de trabajar en equipos colaborativos actuando con honestidad, compromiso, responsabilidad y empatía.",
      "Demuestran responsabilidad en sus obligaciones.",
      "Son críticos, participativos y activos en las funciones escolares y valóricas.",
      "Son ordenados y rigurosos en sus trabajos.",
      "Mantienen una cultura de altas expectativas.",
      "Son respetuosos y comprometidos con los valores del Proyecto Educativo y la normativa expresada en el Reglamento Interno.",
      "Mantienen actitudes de buen trato con estudiantes, apoderados y otros agentes de la comunidad educativa.",
    ],
  },
  {
    who: "Docentes",
    items: [
      "Muestran compromiso con los principios y valores que se expresan en el Proyecto Educativo Institucional.",
      "Planifican sus prácticas educativas alineadas con la misión y visión institucional.",
      "Son creativos y con dominio de la disciplina que enseñan.",
      "Muestran ser líderes pedagógicos.",
      "Muestran y promueven valores cristianos.",
      "Presentan un alto nivel de desempeño orientado a la mejora permanente.",
      "Se interesan por el perfeccionamiento y la innovación en sus prácticas educativas.",
      "Demuestran capacidad de adaptarse a cambios (versatilidad).",
      "Son capaces de trabajar en equipos colaborativos.",
      "Mantienen una cultura de altas expectativas.",
      "Mantienen actitudes de buen trato con estudiantes, apoderados y otros agentes de la comunidad educativa.",
      "Presentan capacidad de resiliencia.",
    ],
  },
  {
    who: "Equipo directivo",
    items: [
      "Demuestra un alto compromiso con el Proyecto Educativo Institucional.",
      "Posee habilidades para dirigir y motivar al equipo hacia el logro de metas propuestas.",
      "Presenta habilidades para la resolución de conflictos de manera pacífica.",
      "Promueve el trabajo colaborativo a través de un liderazgo participativo.",
      "Es capaz de definir metas y objetivos de manera clara y responsable.",
      "Mantiene una cultura de altas expectativas.",
      "Domina técnicas de planificación, diseño de proyectos, seguimiento y evaluación.",
      "Demuestra incorporar valores cristianos en el ejercicio de las funciones directivas.",
      "Demuestra interés por el aprendizaje de todos los estudiantes favoreciendo la inclusión educativa.",
      "Demuestra capacidad para gestionar en forma eficiente y eficaz recursos humanos, materiales y tiempo.",
      "Es capaz de tomar decisiones oportunas y adecuadas considerando elementos del entorno.",
    ],
  },
  {
    who: "Madres, padres y apoderados",
    items: [
      "Se comprometen con el Proyecto Educativo Institucional y los valores que en él se promueven.",
      "Demuestran responsabilidad y colaboración en la formación integral de sus hijos e hijas.",
      "Mantienen una actitud de respeto hacia toda la comunidad escolar, basados en valores cristianos.",
      "Demuestran altas expectativas sobre el aprendizaje de sus hijos e hijas.",
      "Contribuyen a resolver de forma pacífica los conflictos siguiendo conductas regulares.",
      "Generan alianza con quienes participan en la formación cognitiva, social y valórica de sus hijos e hijas.",
    ],
  },
  {
    who: "Asistentes de la educación",
    items: [
      "Demuestran una actitud de colaboración en el proceso de aprendizaje integral de los estudiantes.",
      "Se comprometen con el Proyecto Educativo Institucional.",
      "Aplican medidas de higiene y seguridad.",
      "Valoran a los niños con sus diferencias.",
      "Mantienen una actitud respetuosa con todos los miembros de la comunidad educativa.",
      "Mantienen actitudes de buen trato con estudiantes, apoderados y otros agentes de la comunidad educativa.",
      "Muestran actitudes basadas en valores cristianos.",
    ],
  },
];

/** Reseña histórica (PEI, sección 3.2). */
export const HISTORY: { year: string; text: string }[] = [
  {
    year: "1982",
    text: "La escuela se funda para responder a las necesidades de educación de un pequeño lugar de la comuna de Vilcún llamado Monterrey, al que debe su nombre.",
  },
  {
    year: "1989",
    text: "Se traslada a la localidad de Cajón, funcionando con cursos multigrado de 1° a 6° año de enseñanza básica.",
  },
  {
    year: "1991",
    text: "Pasa a manos de don Lorenzo Puel Huenulao. Al año siguiente se logra la separación de los cursos en forma combinada (1° y 2°, 3° y 4°, y por último 5° y 6°), aumentando su planta docente a tres profesores.",
  },
  {
    year: "1997",
    text: "En el afán de mejorar la calidad de la educación impartida, se crea la enseñanza pre-básica, se ingresa a la Jornada Escolar Completa y al Proyecto Enlaces, y aumenta a seis el número de profesores, separando algunos cursos combinados.",
  },
  {
    year: "2001",
    text: "La escuela logra impartir enseñanza básica completa, con cursos de 1° a 8° y Nivel de Transición 1 y 2. Aumentan el número de profesores y la matrícula. Desde 2004 deja de funcionar con cursos combinados y trabaja con cursos simples.",
  },
  {
    year: "2003",
    text: "Se implementa el Proyecto de Integración Educativo, para estudiantes con déficit intelectual. En 2012 se suma el programa de integración para necesidades educativas transitorias.",
  },
  {
    year: "2008",
    text: "El sostenedor, don Lorenzo Puel, firma un Convenio de Igualdad de Oportunidades y Excelencia Educativa con el Ministerio de Educación. En el mismo año asume la Dirección la señora Dory Huenchuleo Molina, la escuela se constituye como Sociedad Educacional Monterrey Ltda. y construye tres nuevas aulas y un laboratorio de computación.",
  },
  {
    year: "2009",
    text: "Se construyen dos salas y se amplía el laboratorio de computación.",
  },
  {
    year: "2010",
    text: "La escuela se adjudica el Plan TICs Bicentenario, beneficiándose con 23 computadores para la sala de informática, y el proyecto de Biblioteca CRA, que entra en funcionamiento a partir de 2011.",
  },
  {
    year: "2011–2012",
    text: "Se remodela de forma parcial el establecimiento, mejorando la infraestructura en el área administrativa, comedor, aulas, sala de profesores y otros espacios.",
  },
  {
    year: "2014",
    text: "Se inicia un proceso participativo de revisión del PEI, con la participación de todos los estamentos de la comunidad educativa, que dio origen al proyecto vigente.",
  },
  {
    year: "2006 y 2017",
    text: "Desde 2006 el establecimiento ha sido evaluado a través del Sistema Nacional de Evaluación Docente, situándose como escuela de Excelencia Académica, distinción que obtuvo nuevamente en 2017.",
  },
];

/** Talleres que el PEI declara en la malla curricular (sección 3.1). */
export const WORKSHOPS = [
  "Banda de guerra",
  "Danza folclórica",
  "Taekwondo",
  "Atletismo",
  "Gimnasia rítmica",
  "Teatro escolar",
  "Cocina",
  "Inglés",
  "Pintura",
] as const;

/** Programas y proyectos en ejecución según el PEI (sección 8). */
export const PROGRAMS = [
  { name: "PME", since: 2008, title: "Plan de Mejoramiento Educativo" },
  { name: "PIE", since: 2003, title: "Programa de Integración Escolar «Aceptando nuestras diferencias»" },
  { name: "TICs · Enlaces", since: 2010, title: "Tecnologías para el Bicentenario" },
  { name: "CRA", since: 2010, title: "Biblioteca Escolar · Centro de Recursos para el Aprendizaje" },
  { name: "Enlaces", since: 2012, title: "Proyecto gestor de planificaciones" },
  { name: "Master Class", since: 2015, title: "Base de datos de planificaciones y evaluaciones" },
  { name: "GMOP", since: 2016, title: "Plataforma de gestión pedagógica" },
  { name: "Papinotas", since: 2018, title: "Plataforma de información a los apoderados" },
  { name: "Lirmi", since: 2019, title: "Plataforma de planificación" },
] as const;

export const SUPPORT_PROGRAMS = [
  "Ley de Subvención Escolar Preferencial (SEP)",
  "Biblioteca CRA",
  "Programa de Integración Escolar (PIE)",
  "Programa de Alimentación Escolar (PAE)",
  "Jornada Escolar Completa (JEC)",
] as const;

export const PIE_STRATEGIES: { strategy: string; activity: string }[] = [
  {
    strategy: "Sensibilización e información a la comunidad educativa sobre la integración y el PIE del establecimiento.",
    activity: "Jornada de sensibilización a la comunidad educativa de la escuela Monterrey.",
  },
  {
    strategy: "Detección y evaluación de necesidades educativas especiales (NEE).",
    activity: "Elaboración de un reglamento de evaluación de las NEE y de un plan de trabajo para la detección y evaluación de las NEE.",
  },
  {
    strategy: "Coordinación y trabajo colaborativo entre profesores y profesionales de apoyo con la familia y los estudiantes.",
    activity: "Elaborar un plan de trabajo de colaboración entre profesores y profesionales de apoyo, con la familia y con los estudiantes.",
  },
  {
    strategy: "Capacitación a la comunidad educativa de atención a la diversidad y las NEE.",
    activity: "Elaborar un plan anual de capacitación de acuerdo a los planes de mejoramiento y al PEI del establecimiento.",
  },
  {
    strategy: "Adaptación y flexibilización curricular.",
    activity: "Definición de los criterios con los que se adaptará la evaluación, los objetivos, contenidos, metodologías y materiales para dar respuesta a las NEE.",
  },
  {
    strategy: "Participación de la familia y la comunidad.",
    activity: "Elaborar e implementar un plan de trabajo que incorpore a la familia y la comunidad en el proceso educativo de la escuela Monterrey.",
  },
  {
    strategy: "Convivencia escolar y respeto a la diversidad.",
    activity: "Creación de círculos de amigos, tutorías entre compañeros y formación de grupos que consideren amistades e intereses.",
  },
  {
    strategy: "Monitoreo y evaluación del PIE.",
    activity: "Elaboración de procedimientos e instrumentos para la evaluación y el seguimiento del PIE.",
  },
];

export const CONVIVENCIA_STRENGTHS = [
  "Desarrollo de un plan de convivencia escolar actualizado año a año según la normativa vigente y las necesidades de la comunidad educativa.",
  "Difusión a toda la comunidad educativa de reglamentos y protocolos de actuación.",
  "Desarrollo de talleres formativos para favorecer el aprendizaje integral de los estudiantes.",
  "Atención de estudiantes por un equipo multidisciplinario.",
] as const;

export const CONVIVENCIA_OBJECTIVE =
  "Implementar procedimientos y prácticas para desarrollar y mantener un ambiente seguro, de respeto y valoración para toda la comunidad educativa, generando un ambiente propicio para el desarrollo integral de los estudiantes y el logro de los objetivos de aprendizajes.";

export const STRATEGIC_GOALS: { dimension: string; objective: string }[] = [
  {
    dimension: "Gestión pedagógica",
    objective:
      "Fortalecer prácticas y procesos de apoyo para todos los estudiantes, generando un ambiente educativo desafiante que favorezca el logro de aprendizajes significativos.",
  },
  {
    dimension: "Liderazgo",
    objective:
      "Fortalecer la participación y el trabajo colaborativo de toda la comunidad educativa, en función de los lineamientos y objetivos de la institución, a través de un proceso de planificación institucional considerando los diferentes estamentos de la unidad educativa.",
  },
  { dimension: "Convivencia escolar", objective: CONVIVENCIA_OBJECTIVE },
  {
    dimension: "Gestión de recursos",
    objective:
      "Fortalecer procedimientos y prácticas de distribución de recursos humanos, materiales y educativos, con el propósito de asegurar el contar con un equipo humano pertinente al perfil de cargo, un clima laboral positivo y la atención a las necesidades pedagógicas del establecimiento.",
  },
  {
    dimension: "Área de resultados",
    objective:
      "Implementar prácticas para la recopilación, análisis y el uso sistemático de datos de la unidad educativa, para la toma de decisiones educativas y de monitoreo del establecimiento.",
  },
];

export const LEVELS = [
  { group: "Educación Parvularia", courses: ["Nivel de Transición 1 (NT1)", "Nivel de Transición 2 (NT2)"] },
  { group: "Educación Básica", courses: ["1° básico", "2° básico", "3° básico", "4° básico", "5° básico", "6° básico", "7° básico", "8° básico"] },
] as const;

/** Plan de estudios (PEI 4.3). Horas semanales por asignatura. */
export const STUDY_PLAN: {
  title: string;
  grades: string[];
  rows: { subject: string; hours: (number | null)[] }[];
}[] = [
  {
    title: "1° a 4° básico",
    grades: ["1° y 2°", "3° y 4°"],
    rows: [
      { subject: "Lenguaje y Comunicación", hours: [8, 8] },
      { subject: "Lengua Indígena", hours: [4, 4] },
      { subject: "Matemática", hours: [6, 6] },
      { subject: "Ciencias Naturales", hours: [3, 3] },
      { subject: "Historia y Geografía", hours: [3, 3] },
      { subject: "Educación Tecnológica", hours: [1, 1] },
      { subject: "Artes Visuales", hours: [2, 2] },
      { subject: "Música", hours: [2, 2] },
      { subject: "Educación Física", hours: [2, 2] },
      { subject: "Religión", hours: [2, 2] },
      { subject: "Orientación", hours: [1, 1] },
      { subject: "Taller JECD", hours: [4, 4] },
    ],
  },
  {
    title: "5° a 8° básico",
    grades: ["5°", "6°", "7°", "8°"],
    rows: [
      { subject: "Lenguaje y Comunicación", hours: [6, 6, null, null] },
      { subject: "Lengua y Literatura", hours: [null, null, 6, 6] },
      { subject: "Lengua Indígena", hours: [4, 4, null, null] },
      { subject: "Idioma Inglés", hours: [3, 3, 3, 3] },
      { subject: "Matemática", hours: [6, 6, 6, 6] },
      { subject: "Ciencias Naturales", hours: [4, 4, 4, 4] },
      { subject: "Historia y Geografía", hours: [4, 4, 4, 4] },
      { subject: "Educación Tecnológica", hours: [1, 1, 1, 1] },
      { subject: "Artes Visuales", hours: [1, 1, 1, 1] },
      { subject: "Música", hours: [1, 1, 1, 1] },
      { subject: "Educación Física y Salud", hours: [2, 2, 2, 2] },
      { subject: "Religión", hours: [2, 2, 2, 2] },
      { subject: "Orientación", hours: [1, 1, 1, 1] },
      { subject: "Taller JECD", hours: [3, 3, 7, 7] },
    ],
  },
];

/** Infraestructura declarada en el PEI (6.2, año 2019). */
export const FACILITIES: { group: string; items: { name: string; qty: number }[] }[] = [
  {
    group: "Aprendizaje",
    items: [
      { name: "Salas de clases de Enseñanza Básica", qty: 8 },
      { name: "Sala de clases de Pre-básica", qty: 1 },
      { name: "Sala de clases PIE", qty: 1 },
      { name: "Biblioteca CRA", qty: 1 },
      { name: "Laboratorio de Informática Enlaces", qty: 1 },
    ],
  },
  {
    group: "Espacios comunes",
    items: [
      { name: "Patio techado", qty: 1 },
      { name: "Patio exterior", qty: 1 },
      { name: "Comedor", qty: 1 },
      { name: "Hall central", qty: 1 },
      { name: "Sala de profesores", qty: 1 },
    ],
  },
  {
    group: "Servicios y bienestar",
    items: [
      { name: "Enfermería", qty: 1 },
      { name: "Cocina", qty: 1 },
      { name: "Despensa", qty: 1 },
      { name: "Servicios higiénicos para varones", qty: 5 },
      { name: "Servicios higiénicos para damas", qty: 6 },
      { name: "Servicios higiénicos de profesores y profesoras", qty: 2 },
      { name: "Servicios higiénicos de manipuladoras", qty: 1 },
      { name: "Duchas para damas", qty: 4 },
      { name: "Duchas para varones", qty: 4 },
    ],
  },
  {
    group: "Gestión",
    items: [
      { name: "Oficina de Dirección", qty: 1 },
      { name: "Oficina de UTP y convivencia", qty: 1 },
      { name: "Oficina de psicología", qty: 1 },
      { name: "Oficina de Secretaría", qty: 1 },
    ],
  },
];

export const ORGANIZATION = {
  top: ["Directorio", "Director/a"],
  second: ["Unidad Técnico-Pedagógica (UTP)", "Encargada de Convivencia", "Encargado de Finanzas", "Equipo de Gestión", "Secretaría"],
  third: ["Docentes", "Asistentes de la educación"],
};

export const REGULATIONS = [
  "Reglamento de Orden, Higiene y Seguridad",
  "Reglamento de Convivencia Escolar",
  "Reglamento de Evaluación y Promoción Escolar",
] as const;

export const INSTANCES = [
  "Dirección",
  "Unidad Técnico-Pedagógica",
  "Equipo de Gestión",
  "Equipo de Convivencia Escolar",
  "Consejo Escolar",
  "Centro General de Padres y Apoderados",
] as const;

export const PEDAGOGICAL_MODEL = {
  intro:
    "El modelo pedagógico de la escuela se basa en un modelo por competencias, lo que significa trabajar los conocimientos, el saber ser y el saber hacer. Una competencia es un conjunto de capacidades:",
  knowledge: [
    { title: "Saber conceptual", text: "Habilidad para el manejo de conceptos, datos, informaciones y hechos." },
    {
      title: "Saber procedimental",
      text: "Habilidad para ejecutar una acción o secuencia de acciones siguiendo métodos, técnicas y/o estrategias adecuadas a la resolución de una tarea concreta.",
    },
    {
      title: "Saber actitudinal",
      text: "Habilidad para vincular el saber y el saber hacer a valores, principios o normas que configuran nuestras actitudes.",
    },
  ],
  dua: "En el contexto de una educación inclusiva, la escuela utiliza el Diseño Universal para el Aprendizaje (DUA), un enfoque didáctico que se aplica al currículo de los diferentes niveles educativos. El marco del DUA estimula la creación de diseños flexibles desde el principio, que presentan opciones personalizables que permiten a todos los estudiantes progresar desde donde ellos están.",
  math: "Para la enseñanza de la matemática, la escuela se ha inclinado por la instalación, de forma progresiva, de la metodología Singapur. Este método se concibe como una herramienta para resolver problemas: la matemática es entendida como una habilidad para resolver problemas y su eje para el aprendizaje es la resolución de problemas.",
  evaluation:
    "Los procesos de evaluación se comprenden como un sistema integrado, donde se consideran las diversas modalidades de evaluación por asignatura, las evaluaciones internas y las evaluaciones externas, que a su vez se componen de evaluaciones estandarizadas nacionales y evaluaciones externas de cobertura de aprendizaje. Los resultados se utilizan como insumos para el análisis y la mejora de los resultados de aprendizaje, y el sistema considera también la evaluación diferenciada para estudiantes con necesidades educativas del establecimiento.",
};
