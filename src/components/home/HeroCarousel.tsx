"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export interface Slide {
  src: string;
  alt: string;
}

/** Carrusel accesible con controles manuales; el avance automático se detiene al interactuar o con movimiento reducido. */
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const hovering = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const go = useCallback((n: number) => setIndex((n + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || !playing || reduced) return;
    const t = setInterval(() => {
      if (!hovering.current) setIndex((i) => (i + 1) % slides.length);
    }, 6500);
    return () => clearInterval(t);
  }, [slides.length, playing, reduced]);

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] bg-sky-2 shadow-[0_30px_60px_-30px_rgba(14,31,54,0.55)]"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotografías institucionales"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
    >
      <div className="relative aspect-[1.08/1]">
        {slides.map((s, i) => (
          <div
            key={s.src}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${slides.length}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} decoding="async" width={1000} height={926} className="size-full object-cover" />
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/70 to-transparent p-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label="Fotografía anterior" className="flex size-11 items-center justify-center rounded-full bg-white/95 text-ink hover:bg-sun">
              <Icon name="left" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Fotografía siguiente" className="flex size-11 items-center justify-center rounded-full bg-white/95 text-ink hover:bg-sun">
              <Icon name="right" />
            </button>
            {!reduced && (
              <button type="button" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing} className="rounded-full bg-white/95 px-4 text-sm font-bold text-ink hover:bg-sun">
                {playing ? "Pausar" : "Reanudar"}
              </button>
            )}
          </div>
          <div className="flex gap-2" role="group" aria-label="Elegir fotografía">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir a la fotografía ${i + 1}`}
                aria-current={i === index}
                className="flex size-6 items-center justify-center"
              >
                <span className={`block rounded-full transition-all ${i === index ? "h-3 w-7 bg-sun" : "size-3 bg-white/80"}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
