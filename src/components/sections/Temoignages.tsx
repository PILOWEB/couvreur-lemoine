import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';
import { TEMOIGNAGES } from '@/data/content';
import { SplitTitle } from '@/components/ui/SplitTitle';

/* Bande horizontale en défilement infini. La vitesse est modulée par la
   vélocité du scroll vertical : on accélère avec la page, jamais de hijack. */
export function Temoignages() {
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    const half = el.scrollWidth / 2;
    let x = 0, speed = 0.6, boost = 0;
    const set = gsap.quickSetter(el, 'x', 'px');
    const tick = () => {
      boost *= 0.92;
      x -= speed + boost;
      if (x <= -half) x += half;
      set(x);
    };
    gsap.ticker.add(tick);
    const st = ScrollTrigger.create({
      onUpdate: (self) => { boost = Math.min(18, Math.abs(self.getVelocity()) / 90); },
    });
    return () => { gsap.ticker.remove(tick); st.kill(); };
  }, []);

  return (
    <section aria-labelledby="temoignages-title" className="section overflow-hidden">
      <div className="container-fluid">
        <p className="eyebrow mb-8">Ils ont laissé monter quelqu’un</p>
        <SplitTitle id="temoignages-title" lines={['Ce qu’on', 'dit après', 'la première pluie.']} accent="pluie." className="text-2xl md:text-3xl" />
      </div>
      <ul ref={track} className="marquee-track mt-16 gap-6 pl-[var(--gutter)]">
        {[...TEMOIGNAGES, ...TEMOIGNAGES].map((t, i) => (
          <li
            key={i}
            aria-hidden={i >= TEMOIGNAGES.length}
            className={`w-[min(80vw,26rem)] shrink-0 border-l border-line pl-6 ${i % 2 ? 'mt-10' : ''}`}
          >
            <blockquote>
              <p className="font-display text-lg leading-[1.15] text-ink md:text-xl">« {t.texte} »</p>
              <footer className="mt-5 text-xs uppercase tracking-[0.16em] text-ink-mute">
                <cite className="not-italic">{t.nom}</cite> — {t.lieu}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  );
}
