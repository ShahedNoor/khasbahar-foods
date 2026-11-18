/** Vector redraw of the Khasbahar Foods symbol: clay handi with steam turning into leaves, inside a mihrab arch. */
export function LogoMark({
  className = "",
  gold = "#C49A43",
  light = "#FFFDF5",
  bg = "#174B32",
  animated = false,
}: { className?: string; gold?: string; light?: string; bg?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden="true">
      <g fill="none" stroke={gold} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 131 V62 C20 42 38 33 50 25 C56 21 59 15 60 7 C61 15 64 21 70 25 C82 33 100 42 100 62 V131" strokeWidth="2.6" />
        <path d="M26.5 131 V64 C26.5 47 42 39 53 31.5 C57 28.5 59 24.5 60 19 C61 24.5 63 28.5 67 31.5 C78 39 93.5 47 93.5 64 V131" strokeWidth="1.3" />
        <path d="M8 132 Q60 129 112 132" strokeWidth="1.6" />
      </g>
      <g className={animated ? "animate-steam" : undefined} style={{ transformOrigin: "60px 80px" }}>
        <g fill="none" stroke={gold} strokeWidth="2.4" strokeLinecap="round">
          <path d="M56 86 C50 79 60 74 55 66 C52 61 55 57 58 54" />
          <path d="M64 86 C70 78 60 72 65 64 C68 59 64.5 55 62 52" />
        </g>
        <g fill={gold}>
          <path d="M57.5 55 C48 54 43 47 44 40 C51 42 57 47 57.5 55 Z" />
          <path d="M62.5 53 C72 51 76.5 45 76 38 C69 40.5 63.5 46 62.5 53 Z" />
          <path d="M60 50 C57 45 57 41 60 37 C63 41 63 45 60 50 Z" />
        </g>
        <g fill={light} transform="translate(60 29)">
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M0 -1 C3 -3.5 3 -6.5 0 -8.5 C-3 -6.5 -3 -3.5 0 -1 Z" transform={`rotate(${a})`} />
          ))}
          <circle r="1.4" fill={gold} />
        </g>
      </g>
      <path
        d="M43 86.5 H77 C77 89.5 74 90.5 73 93 C84 97 89 105 89 113 C89 124 77 131 60 131 C43 131 31 124 31 113 C31 105 36 97 47 93 C46 90.5 43 89.5 43 86.5 Z"
        fill={gold}
      />
      <path d="M33.5 101 Q60 97.5 86.5 101" stroke={bg} strokeWidth="1" fill="none" />
      <path d="M32 112 Q60 115.5 88 112" stroke={bg} strokeWidth="1" fill="none" />
      <g fill={light}>
        {[38, 45, 52.5, 60, 67.5, 75, 82].map((x) => (
          <circle key={x} cx={x} cy="106.3" r="1.25" />
        ))}
      </g>
    </svg>
  );
}

export function Wordmark({ className = "", tone = "gold" }: { className?: string; tone?: "gold" | "forest" | "cream" }) {
  const color = tone === "gold" ? "text-gold" : tone === "forest" ? "text-forest" : "text-cream";
  return (
    <span className={`inline-flex flex-col items-center leading-none ${color} ${className}`}>
      <span className="font-caps text-[1.15em] tracking-[0.18em]">KHASBAHAR</span>
      <span className="mt-[0.3em] flex items-center gap-[0.5em] font-caps text-[0.5em] tracking-[0.55em]">
        <span className="h-px w-[1.6em] bg-current opacity-70" />
        FOODS
        <span className="h-px w-[1.6em] bg-current opacity-70" />
      </span>
    </span>
  );
}
