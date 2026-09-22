import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { ANNEES_EXPERIENCE, QUALIFICATIONS, ZONE_INTERVENTION } from '@/config/site.config';

const ITEMS = [
  ...QUALIFICATIONS,
  `${ANNEES_EXPERIENCE} ans de métier`,
  ...ZONE_INTERVENTION.slice(0, 6),
];

/* Bande défilante : décennale, qualifications, communes. Vitesse constante,
   sens inversé sous le bandeau urgence pour casser la symétrie. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    const w = el.scrollWidth / 2;
    const tween = gsap.to(el, { x: -w, duration: w / 60, ease: 'none', repeat: -1 });
    return () => { tween.kill(); };
  }, []);

  return (
    <div className="rule mt-2 overflow-hidden py-5" aria-label="Qualifications et communes desservies">
      <div ref={track} className="marquee-track gap-10">
        {[...ITEMS, ...ITEMS].map((it, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10 font-display text-md text-ink-soft" aria-hidden={i >= ITEMS.length}>
            {it}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
