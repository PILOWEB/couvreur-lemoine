import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { useAppReady } from '@/hooks/useAppReady';
import { NOM_ENTREPRISE } from '@/config/site.config';

/* Compteur 0 → 100 en serif géante, puis rideau qui se retire vers le haut.
   À la fin, signale au hero qu'il peut monter son titre. */
export function Preloader() {
  const { setReady } = useAppReady();
  const [done, setDone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || sessionStorage.getItem('preloaded')) {
      setDone(true); setReady(true); return;
    }
    document.documentElement.style.overflow = 'hidden';
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        sessionStorage.setItem('preloaded', '1');
        setDone(true);
      },
    });
    tl.to(counter, {
      v: 100, duration: 1.6, ease: 'power3.inOut',
      onUpdate: () => {
        num.current!.textContent = String(Math.round(counter.v)).padStart(3, '0');
        gsap.set(bar.current, { scaleX: counter.v / 100 });
      },
    })
      .to(num.current, { yPercent: -120, duration: 0.5, ease: 'power4.in' }, '+=0.15')
      .add(() => setReady(true), '-=0.05')
      .to(wrap.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.2');
    return () => { tl.kill(); document.documentElement.style.overflow = ''; };
  }, [setReady]);

  if (done) return null;

  return (
    <div ref={wrap} aria-hidden className="fixed inset-0 z-[95] flex flex-col justify-between bg-ink px-[var(--gutter)] py-8 text-ink-inverse">
      <div className="flex items-center justify-between">
        <span className="font-display text-md">{NOM_ENTREPRISE}</span>
        <span className="eyebrow !text-ink-inverse/60">Dourdan — Essonne</span>
      </div>
      <div className="line-mask self-end">
        <span ref={num} className="font-display text-5xl leading-none tabular-nums">000</span>
      </div>
      <span ref={bar} className="block h-px w-full origin-left scale-x-0 bg-accent" />
    </div>
  );
}
