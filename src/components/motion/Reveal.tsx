"use client";

import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Hace aparecer su contenido con un desvanecimiento suave al entrar en pantalla.
 * Sin JavaScript (o con «reducir movimiento») el contenido simplemente se ve: la regla CSS `.js .reveal`
 * solo oculta cuando la clase `js` existe y el usuario no pidió reducir el movimiento.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y,
  from,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Retardo en milisegundos (para escalonar tarjetas de una misma fila). */
  delay?: number;
  y?: number;
  from?: "left" | "right";
  as?: "div" | "li" | "section" | "article" | "p" | "h2" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { "--reveal-delay": `${delay}ms`, ...(y !== undefined ? { "--reveal-y": `${y}px` } : {}) } as CSSProperties;
  return createElement(as, { ref, className: `reveal ${className}`.trim(), style, "data-from": from }, children);
}
