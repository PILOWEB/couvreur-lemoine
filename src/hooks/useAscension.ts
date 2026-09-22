import { useEffect } from 'react';
import { ScrollTrigger, prefersReducedMotion } from '@/lib/motion';
import { ascension } from '@/lib/ascension';

/** Écrit la progression 0 → 1 entre le haut de page et 80 % de sa hauteur.
    Un seul ScrollTrigger scrubé pour toute la page ; la 3D et la lumière
    s'y abonnent. En reduced-motion, la valeur reste à 0 (vue du sol). */
export function useAscension() {
  useEffect(() => {
    if (prefersReducedMotion()) { ascension.set(0); return; }
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: () => `${(document.documentElement.scrollHeight - window.innerHeight) * 0.8}px top`,
      scrub: 0.8,
      onUpdate: (self) => ascension.set(self.progress),
    });
    return () => st.kill();
  }, []);
}
