"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** Línea de tiempo: la línea se va «llenando» a medida que la persona avanza por la historia. */
export function HistoryTimeline({ items }: { items: { year: string; text: string }[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill.style.transform = "scaleY(1)";
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.62 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol ref={listRef} className="relative mx-auto max-w-3xl pl-10 sm:pl-14">
      <div aria-hidden="true" className="absolute bottom-0 left-[0.6rem] top-0 w-1 rounded bg-sky-2 sm:left-[0.9rem]">
        <div ref={fillRef} className="h-full w-full origin-top rounded bg-gradient-to-b from-brand to-sun" style={{ transform: "scaleY(1)" }} />
      </div>
      {items.map((h, i) => (
        <Reveal as="li" key={h.year + h.text.slice(0, 12)} className="relative pb-10 last:pb-0" delay={0} from={i % 2 ? "right" : "left"}>
          <span aria-hidden="true" className="timeline-dot absolute -left-[2.15rem] top-2 size-5 rounded-full border-4 border-cream bg-sun shadow sm:-left-[2.9rem]" />
          <p className="font-display text-3xl font-extrabold text-brand">{h.year}</p>
          <p className="mt-2 text-lg text-[#35414f]">{h.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
