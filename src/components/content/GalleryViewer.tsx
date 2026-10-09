"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export interface ViewerImage {
  src: string;
  alt: string;
  caption?: string;
}

/** Mosaico de miniaturas con visor ampliado: navegación por teclado (← → Esc), botones y deslizamiento táctil. */
export function GalleryViewer({ images }: { images: ViewerImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  const total = images.length;
  const go = (n: number) => setIndex((n + total) % total);

  function open(i: number) {
    setIndex(i);
    dialogRef.current?.showModal();
  }

  const current = images[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <li key={img.src + i}>
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Ampliar fotografía ${i + 1} de ${total}: ${img.alt}`}
              className="group relative block w-full overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" width={600} height={450} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-white opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Icon name="eye" size={28} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`Visor de fotografías, ${index + 1} de ${total}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(index - 1);
          if (e.key === "ArrowRight") go(index + 1);
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-ink/95"
      >
        <div
          className="flex h-full flex-col text-white"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <p aria-live="polite" className="font-semibold">{index + 1} / {total}</p>
            <button type="button" onClick={() => dialogRef.current?.close()} className="flex size-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/30" aria-label="Cerrar visor">
              <Icon name="close" size={24} />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            {total > 1 && (
              <button type="button" onClick={() => go(index - 1)} aria-label="Fotografía anterior" className="absolute left-2 z-10 flex size-12 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 sm:left-4">
                <Icon name="left" size={26} />
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt} decoding="async" className="max-h-full max-w-full rounded-xl object-contain" />
            {total > 1 && (
              <button type="button" onClick={() => go(index + 1)} aria-label="Fotografía siguiente" className="absolute right-2 z-10 flex size-12 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 sm:right-4">
                <Icon name="right" size={26} />
              </button>
            )}
          </div>
          <p className="min-h-16 px-4 py-3 text-center text-[1.05rem]">{current.caption || current.alt}</p>
        </div>
      </dialog>
    </>
  );
}
