/* =============================================================================
   ASCENSION — le fil conducteur.
   Un seul nombre, 0 → 1, qui dit où l'on en est de la montée du sol vers le
   toit. Il est écrit par ScrollTrigger (scrub) et lu par la scène 3D, la
   lumière, et tout ce qui doit "monter" avec la page.
   0 = au sol, contre-plongée, lumière du matin.
   1 = quasi-zénithal, fin de journée bleutée. Atteint à 80 % de la page.
   ============================================================================= */

type Listener = (t: number) => void;

let value = 0;
const listeners = new Set<Listener>();

export const ascension = {
  get: () => value,
  set(t: number) {
    const next = Math.min(1, Math.max(0, t));
    if (next === value) return;
    value = next;
    listeners.forEach((l) => l(value));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    l(value);
    return () => { listeners.delete(l); };
  },
};

/** Interpolation linéaire, utile côté 3D et côté couleurs. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Lissage doux pour éviter les à-coups sur les valeurs scrubées. */
export const smoothstep = (t: number) => t * t * (3 - 2 * t);
