export type Role = "admin" | "editor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  /** Obliga a cambiar la contraseña en el próximo inicio de sesión (clave temporal). */
  mustChangePassword: boolean;
  /** Se incrementa al cambiar la contraseña para invalidar sesiones anteriores. */
  tokenVersion: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface GalleryImage {
  mediaId: string;
  alt: string;
  caption?: string;
}

export interface Attachment {
  mediaId: string;
  title: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Markdown; se sanea al mostrarlo. */
  body: string;
  category: string;
  coverMediaId?: string;
  coverAlt?: string;
  author?: string;
  /** Fecha de publicación (YYYY-MM-DD, hora de Chile). Si es futura, la noticia queda programada. */
  publishedAt: string;
  status: "draft" | "published";
  featured: boolean;
  gallery: GalleryImage[];
  attachments: Attachment[];
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  /** YYYY-MM-DD (hora de Chile). */
  date: string;
  endDate?: string;
  /** HH:mm (hora de Chile). */
  startTime?: string;
  endTime?: string;
  description: string;
  location?: string;
  category: string;
  imageMediaId?: string;
  imageAlt?: string;
  attachments: Attachment[];
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  /** YYYY-MM-DD */
  publishedAt: string;
  /** YYYY-MM-DD. Pasada esta fecha el comunicado se archiva y deja de mostrarse como vigente. */
  expiresAt?: string;
  status: "draft" | "published";
  pinned: boolean;
  attachments: Attachment[];
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PriorityAlert {
  id: string;
  message: string;
  linkUrl?: string;
  linkLabel?: string;
  level: "info" | "importante" | "urgente";
  startsAt: string;
  /** Obligatoria: los mensajes prioritarios siempre vencen. */
  expiresAt: string;
  active: boolean;
  demo?: boolean;
  createdAt: string;
}

export type DocumentFile =
  | { kind: "media"; mediaId: string }
  | { kind: "static"; url: string };

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  file: DocumentFile;
  sizeBytes?: number;
  fileType: string;
  /** YYYY-MM-DD */
  updatedAt: string;
  published: boolean;
  demo?: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  /** YYYY-MM-DD */
  date: string;
  images: GalleryImage[];
  published: boolean;
  /** El editor confirma que existen autorizaciones para publicar imágenes de estudiantes. */
  consentConfirmed: boolean;
  demo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoMediaId?: string;
  order: number;
  published: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  group: string;
  order: number;
  published: boolean;
}

export interface MediaRecord {
  id: string;
  originalName: string;
  mime: string;
  ext: string;
  size: number;
  kind: "image" | "pdf";
  /** Los documentos no publicados se guardan como privados y solo los ve el personal autenticado. */
  visibility: "public" | "private";
  createdAt: string;
}

export interface SocialLink {
  id: string;
  network: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "whatsapp" | "web";
  label: string;
  url: string;
}

export interface CommunityLink {
  id: string;
  label: string;
  description: string;
  url: string;
}

export interface HeroSlide {
  mediaId: string;
  alt: string;
}

export interface Settings {
  contact: {
    address: string;
    locality: string;
    commune: string;
    region: string;
    phone: string;
    emails: string[];
    hours: string[];
    /** Opcionales: solo se muestra el mapa integrado cuando el colegio valida las coordenadas. */
    mapLat: string;
    mapLng: string;
  };
  social: SocialLink[];
  community: CommunityLink[];
  hero: {
    title: string;
    subtitle: string;
    slides: HeroSlide[];
  };
  texts: Record<string, string>;
}
