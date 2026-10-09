import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SCHOOL } from "@/content/pei";
import { SITE_URL } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SCHOOL.name} · Cajón, Vilcún`,
    template: `%s · ${SCHOOL.name}`,
  },
  description:
    "Portal institucional de la Escuela Particular Monterrey N° 500, en la localidad de Cajón, comuna de Vilcún, Región de La Araucanía: noticias, calendario, documentos y matrículas.",
  applicationName: SCHOOL.name,
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SCHOOL.name,
    title: `${SCHOOL.name} · Cajón, Vilcún`,
    description: "Educación integral e inclusiva en Cajón, comuna de Vilcún, Región de La Araucanía.",
    images: [{ url: "/logo.png", width: 900, height: 436, alt: "Logotipo Escuela Particular Monterrey" }],
  },
  twitter: { card: "summary", title: SCHOOL.name },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#14509f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
