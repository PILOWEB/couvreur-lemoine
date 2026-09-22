import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';
import { CHIFFRES } from '@/data/content';
import { Reveal } from '@/components/ui/Reveal';

/* Compteurs à défilement vertical façon compteur mécanique : chaque chiffre
   est une colonne 0-9 qui roule jusqu'à sa valeur, en cascade. */
function Odometer({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digits = String(value).split('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cols = el.querySelectorAll<HTMLElement>('[data-col]');
    if (prefersReducedMotion()) { cols.forEach((c) => { c.style.transform = `translateY(-${Number(c.dataset.col) * 10}%)`; }); return; }
    gsap.set(cols, { yPercent: 0 });
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(cols, {
        yPercent: (_i, c) => -Number((c as HTMLElement).dataset.col) * 10,
        duration: 1.6, ease: 'power4.out', stagger: 0.12,
      }),
    });
    return () => st.kill();
  }, [value]);

  return (
    <span ref={ref} className="inline-flex items-baseline font-display text-4xl leading-none tabular-nums md:text-5xl" aria-label={`${value}${suffix}`}>
      {digits.map((d, i) => (
        <span key={i} className="inline-block h-[0.92em] overflow-hidden" aria-hidden>
          <span data-col={d} className="flex flex-col will-change-transform">
            {Array.from({ length: 10 }).map((_, n) => <span key={n} className="block h-[0.92em] leading-[0.92em]">{n}</span>)}
          </span>
        </span>
      ))}
      <span className="ml-1 text-lg text-ocre md:text-xl" aria-hidden>{suffix}</span>
    </span>
  );
}

export function Chiffres() {
  return (
    <section aria-label="Chiffres clés" className="section container-fluid">
      <Reveal variant="draw">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12 pt-12 md:grid-cols-4">
          {CHIFFRES.map((c, i) => (
            <div key={c.label} className={`${i % 2 === 1 ? 'md:mt-16' : ''}`}>
              <dd className="order-1"><Odometer value={c.valeur} suffix={c.suffixe} /></dd>
              <dt className="mt-4 max-w-[16ch] text-sm text-ink-soft">{c.label}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
