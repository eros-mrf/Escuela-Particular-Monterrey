/**
 * Ilustración referencial usada mientras el colegio no carga fotografías oficiales para la portada.
 * No representa estudiantes ni instalaciones reales: solo lomajes y el sol del logotipo, con movimiento ambiental muy lento.
 */
export function HeroIllustration() {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-sky-2 shadow-[0_30px_60px_-30px_rgba(14,31,54,0.55)]">
      <svg viewBox="0 0 560 520" className="aspect-[1.08/1] w-full" role="img" aria-label="Ilustración referencial: lomajes azules bajo un sol dorado" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EAF2FD" />
            <stop offset="1" stopColor="#FFF6D9" />
          </linearGradient>
        </defs>
        <rect width="560" height="520" fill="url(#hero-sky)" />
        <g className="sun-rays">
          <circle cx="392" cy="170" r="96" fill="none" stroke="#F8DE86" strokeWidth="26" strokeDasharray="3 8.4" opacity=".9" />
        </g>
        <circle className="sun-core" cx="392" cy="170" r="62" fill="#F5C22B" />
        <g className="hill-c"><path d="M-40 330 L120 300 L210 250 L250 232 L300 262 L380 300 L600 318 L600 520 L-40 520 Z" fill="#D5E4F8" /></g>
        <g className="hill-b"><path d="M-40 372 C90 330 170 350 250 366 C340 384 440 330 600 352 L600 520 L-40 520 Z" fill="#A9C7EE" /></g>
        <g className="hill-a"><path d="M-40 420 C110 384 200 410 290 424 C390 440 470 396 600 408 L600 520 L-40 520 Z" fill="#1E5CB0" /></g>
        <path d="M0 470 C120 444 220 462 320 474 C420 486 490 456 560 462 L560 520 L0 520 Z" fill="#14509F" />
      </svg>
    </div>
  );
}
