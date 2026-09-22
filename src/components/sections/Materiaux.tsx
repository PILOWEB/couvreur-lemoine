import { useEffect, useRef } from 'react';
import { gsap, isMobile, prefersReducedMotion } from '@/lib/motion';
import { MATERIAUX } from '@/config/site.config';
import { SplitTitle } from '@/components/ui/SplitTitle';

/* Quatre échantillons en pile. Au scroll : ils se déploient en éventail, puis
   se rangent en grille. Au survol : soulèvement, image en couleur, légende. */
export function Materiaux() {
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const els = cards.current.filter(Boolean);
    if (!els.length || isMobile() || prefersReducedMotion()) return;

    // État initial : pile, légèrement en rotation
    gsap.set(els, { position: 'absolute', left: '50%', top: '50%', xPercent: -50, yPercent: -50, rotate: (i) => (i - 1.5) * 2.5, zIndex: (i) => i });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap.current, start: 'top 70%', end: 'top 15%', scrub: 0.9 },
    });
    // 1) éventail
    tl.to(els, { rotate: (i) => (i - 1.5) * 14, x: (i) => (i - 1.5) * 90, y: (i) => Math.abs(i - 1.5) * 20, duration: 1, ease: 'power3.inOut', stagger: 0.04 })
      // 2) grille : chaque carte rejoint sa place dans la ligne
      .to(els, {
        rotate: 0, y: 0, x: (i, el) => {
          const w = el.parentElement!.clientWidth;
          const cw = el.clientWidth;
          const gap = (w - cw * 4) / 3;
          return (i - 1.5) * (cw + gap);
        },
        duration: 1.2, ease: 'power4.inOut', stagger: 0.03,
      }, '+=0.2');

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, []);

  return (
    <section id="materiaux" aria-labelledby="materiaux-title" className="section bg-surface-alt">
      <div className="container-fluid">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow mb-8">Matériaux</p>
            <SplitTitle id="materiaux-title" lines={['Quatre familles.', 'Chacune a', 'son toit.']} accent="son" className="text-2xl md:text-3xl" />
          </div>
          <p className="para col-span-12 self-end lg:col-span-5 lg:col-start-8">
            Je ne pousse pas un matériau. Je regarde la pente, l’époque de la maison, l’exposition, et je vous dis lequel tiendra le plus longtemps chez vous.
          </p>
        </div>

        <div ref={wrap} className="relative mt-16 md:h-[26rem] md:mt-24">
          <ul className="grid gap-6 md:block md:h-full">
            {MATERIAUX.map((m, i) => (
              <li
                key={m.key}
                ref={(el) => { if (el) cards.current[i] = el; }}
                className="group w-full bg-surface p-3 shadow-[0_1px_0_var(--color-line)] md:w-[22%] md:max-w-[15rem] md:will-change-transform"
                data-cursor={m.nom}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={`/images/materiau-${m.key}.webp`}
                    alt={m.nom}
                    width={900}
                    height={900}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale-[0.35] transition-[filter,transform] duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                  <span className="hand absolute bottom-2 left-2 !text-md text-surface opacity-0 transition-opacity duration-500 group-hover:opacity-100">{m.legende}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-md">{m.nom}</h3>
                  <span className="num text-xs">{m.dureeVie}</span>
                </div>
                <p className="mt-1 text-xs leading-snug text-ink-soft">{m.usage}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
