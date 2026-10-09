"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      aria-label="Volver al inicio de la página"
      tabIndex={show ? 0 : -1}
      className={`no-print fixed bottom-5 right-5 z-30 flex size-12 items-center justify-center rounded-full bg-ink text-white shadow-card transition-all duration-300 hover:bg-brand ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <Icon name="up" size={22} />
    </button>
  );
}
