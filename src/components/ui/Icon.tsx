import {
  Accessibility,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cross,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Hammer,
  Heart,
  Image as ImageIcon,
  Info,
  Lightbulb,
  Link as LinkIcon,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Newspaper,
  Phone,
  Search,
  Share2,
  ShieldCheck,
  Sprout,
  TriangleAlert,
  UserPlus,
  Users,
  X,
  type LucideProps,
} from "lucide-react";

const icons = {
  accessibility: Accessibility,
  arrow: ArrowRight,
  book: BookOpen,
  calendar: CalendarDays,
  check: Check,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
  clock: Clock,
  cross: Cross,
  download: Download,
  external: ExternalLink,
  eye: Eye,
  file: FileText,
  hammer: Hammer,
  heart: Heart,
  image: ImageIcon,
  info: Info,
  lightbulb: Lightbulb,
  link: LinkIcon,
  lock: Lock,
  mail: Mail,
  pin: MapPin,
  megaphone: Megaphone,
  menu: Menu,
  news: Newspaper,
  phone: Phone,
  search: Search,
  share: Share2,
  shield: ShieldCheck,
  sprout: Sprout,
  alert: TriangleAlert,
  userplus: UserPlus,
  users: Users,
  close: X,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 20, ...rest }: { name: string; size?: number } & Omit<LucideProps, "size">) {
  const Cmp = icons[name as IconName] ?? Info;
  return <Cmp size={size} aria-hidden="true" strokeWidth={1.9} {...rest} />;
}

/* Iconos de redes sociales (lucide ya no incluye marcas). */
export function SocialIcon({ network, size = 20 }: { network: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  switch (network) {
    case "facebook":
      return (
        <svg {...common}>
          <path d="M13.5 21v-7.5h2.6l.5-3.2h-3.1V8.4c0-.9.4-1.7 1.8-1.7h1.4V3.9S15.4 3.7 14.2 3.7c-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4v3.2h2.7V21h3.4z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7.6 2h8.8A5.6 5.6 0 0 1 22 7.6v8.8a5.6 5.6 0 0 1-5.6 5.6H7.6A5.6 5.6 0 0 1 2 16.4V7.6A5.6 5.6 0 0 1 7.6 2zm0 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.2-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M16.6 2h-3.2v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.3a6.1 6.1 0 1 0 5.2 6V8.9a7.4 7.4 0 0 0 4.3 1.4V7.1a4.3 4.3 0 0 1-4.3-4.2V2z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />
        </svg>
      );
    default:
      return <Icon name="link" size={size} />;
  }
}
