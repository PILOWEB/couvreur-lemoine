import { useEffect, useRef } from 'react';
import { gsap, isMobile, prefersReducedMotion } from '@/lib/motion';
import { METIER_TEXTE } from '@/data/content';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { Reveal } from '@/components/ui/Reveal';

/* Bloc éditorial deux colonnes, photo verticale décalée, texte à la première
   personne. Parallaxe limitée à 12 % sur la photo. */
export function Metier() {
  const photo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = photo.current;
    if (!el || isMobile() || prefersReducedMotion()) return;
    const tween = gsap.fromTo(el, { yPercent: 6 }, {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <section id="metier" aria-labelledby="metier-title" className="section slate-scales container-fluid">
      <div className="grid-12 gap-y-12">
        <div className="col-span-12 md:col-span-5 md:col-start-1 lg:col-span-4">
          <div ref={photo} className="relative md:-mt-16 lg:-mt-24">
            <Reveal variant="scale">
              <img
                src="/images/portrait-metier.webp"
                alt="Thomas Lemoine, couvreur, sur un toit d’ardoise à Dourdan"
                width={1000}
                height={1400}
                loading="lazy"
                className="aspect-[5/7] w-full object-cover"
              />
            </Reveal>
            <span className="hand absolute -bottom-6 -right-2 md:-right-10">depuis le faîtage, on voit tout</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <p className="eyebrow mb-8">{METIER_TEXTE.surtitre}</p>
          <SplitTitle id="metier-title" lines={METIER_TEXTE.titre} accent={METIER_TEXTE.accent} className="text-2xl md:text-3xl" />
          <Reveal variant="lift" stagger={0.12} className="mt-10 space-y-6">
            {METIER_TEXTE.paragraphes.map((p, i) => <p key={i} className="para">{p}</p>)}
          </Reveal>
          <Reveal variant="lift" delay={0.2}>
            <p className="hand mt-10" aria-label={METIER_TEXTE.signature}>— {METIER_TEXTE.signature}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
