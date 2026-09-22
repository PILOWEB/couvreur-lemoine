import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { METHODE } from '@/data/content';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { Reveal } from '@/components/ui/Reveal';

/* Quatre étapes reliées par un filet vertical qui se dessine au scroll,
   comme une échelle qu'on grimpe : on monte encore d'un cran. */
export function Methode() {
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = line.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(el, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <section id="methode" aria-labelledby="methode-title" className="section slate-scales bg-surface-alt">
      <div className="container-fluid">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow mb-8">Méthode</p>
            <SplitTitle id="methode-title" lines={['Quatre étapes,', 'toujours dans', 'cet ordre.']} accent="toujours" className="text-2xl md:text-3xl" />
            <p className="para mt-8">Vous savez à chaque moment ce qui se passe sur votre toit et ce que ça coûte.</p>
          </div>

          <ol className="relative col-span-12 lg:col-span-7 lg:col-start-6">
            <span ref={line} aria-hidden className="absolute left-[1.15rem] top-2 bottom-2 w-px origin-top bg-line-strong md:left-[1.4rem]" />
            {METHODE.map((e, i) => (
              <Reveal key={e.etape} variant="lift" delay={i * 0.06}>
                <li className="relative grid grid-cols-[2.4rem_1fr] gap-x-6 pb-14 last:pb-0 md:grid-cols-[2.9rem_1fr_6rem] md:gap-x-10">
                  <span className="relative z-10 flex h-9 w-9 items-center justify-center bg-surface-alt font-display text-md text-ocre ring-1 ring-line-strong md:h-11 md:w-11">{e.etape}</span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl">
                      {e.titre.split(' ').map((w, wi) => {
                        const clean = w.replace(/[.,]/g, '');
                        return <span key={wi}>{clean.toLowerCase() === e.accent.toLowerCase() ? <em>{w}</em> : w}{' '}</span>;
                      })}
                    </h3>
                    <p className="para mt-4 !text-base">{e.texte}</p>
                  </div>
                  <span className="col-start-2 mt-3 text-xs uppercase tracking-[0.16em] text-ink-mute md:col-start-3 md:mt-2 md:text-right">{e.duree}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
