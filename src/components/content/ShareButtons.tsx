"use client";

import { useState } from "react";
import { Icon, SocialIcon } from "@/components/ui/Icon";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { label: "WhatsApp", network: "whatsapp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { label: "Facebook", network: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "X", network: "x", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copia este enlace:", url);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Compartir esta noticia">
      <span className="mr-1 font-semibold text-ink">Compartir:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartir en ${l.label} (se abre en una pestaña nueva)`}
          className="flex size-11 items-center justify-center rounded-xl border border-line bg-white text-ink hover:border-ink"
        >
          <SocialIcon network={l.network} />
        </a>
      ))}
      <a
        href={`mailto:?subject=${enc(title)}&body=${enc(url)}`}
        aria-label="Compartir por correo electrónico"
        className="flex size-11 items-center justify-center rounded-xl border border-line bg-white text-ink hover:border-ink"
      >
        <Icon name="mail" />
      </a>
      <button type="button" onClick={copy} className="btn btn-outline btn-sm">
        <Icon name="link" size={16} /> {copied ? "¡Enlace copiado!" : "Copiar enlace"}
      </button>
      <span role="status" className="sr-only">{copied ? "Enlace copiado al portapapeles" : ""}</span>
    </div>
  );
}
