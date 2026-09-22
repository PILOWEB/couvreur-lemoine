import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
/* Pas de rattrapage après un gel d'onglet : Lenis et les scrubs restent cohérents. */
gsap.ticker.lagSmoothing(0);

/* Courbes nommées, alignées sur les tokens CSS. Jamais "power1.out" par défaut. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power4.inOut',
  spring: 'back.out(1.4)',
  anticipate: 'back.inOut(1.2)',
} as const;

export const DUR = { fast: 0.4, base: 0.6, slow: 0.9 } as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

/** Sous 768 px : 3D remplacée, curseur désactivé, scroll simplifié. */
export const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export { gsap, ScrollTrigger };
