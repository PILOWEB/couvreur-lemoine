import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, isMobile, prefersReducedMotion } from '@/lib/motion';

let instance: Lenis | null = null;

export const getLenis = () => instance;

/** Défilement fluide desktop. Sur mobile et en reduced-motion : scroll natif. */
export function useLenis() {
  useEffect(() => {
    if (isMobile() || prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      smoothWheel: true,
    });
    instance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    document.documentElement.classList.add('lenis');
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
      document.documentElement.classList.remove('lenis');
    };
  }, []);
}

/** Défile vers une cible, en respectant Lenis quand il est actif. */
export function scrollTo(target: string | HTMLElement, offset = 0) {
  if (instance) instance.scrollTo(target, { offset, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
