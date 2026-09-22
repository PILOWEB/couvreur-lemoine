import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

interface Props {
  avant: string;
  apres: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/* Poignée draggable à inertie. Sans interaction, la révélation suit la
   position dans le viewport : on entre à 15 %, on finit à 65 %. */
export function BeforeAfter({ avant, apres, alt, width, height, className = '' }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const pos = useRef({ v: 0.15, target: 0.15, dragging: false, touched: false });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const p = pos.current;
    const apply = () => { el.style.setProperty('--cut', `${(p.v * 100).toFixed(2)}%`); };

    if (prefersReducedMotion()) { p.v = 0.55; apply(); return; }

    const tick = () => {
      const k = p.dragging ? 0.35 : 0.08;
      p.v += (p.target - p.v) * k;
      apply();
    };
    gsap.ticker.add(tick);

    // Révélation progressive selon la position dans le viewport, tant que l'utilisateur n'a pas touché
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 85%', end: 'bottom 35%', scrub: true,
      onUpdate: (self) => { if (!p.touched) p.target = 0.15 + self.progress * 0.5; },
    });

    const toRatio = (clientX: number) => {
      const r = el.getBoundingClientRect();
      return Math.min(0.96, Math.max(0.04, (clientX - r.left) / r.width));
    };
    const down = (e: PointerEvent) => { p.dragging = true; p.touched = true; p.target = toRatio(e.clientX); el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (p.dragging) p.target = toRatio(e.clientX); };
    const up = () => { p.dragging = false; };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      gsap.ticker.remove(tick); st.kill();
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const p = pos.current;
    if (e.key === 'ArrowLeft') { p.touched = true; p.target = Math.max(0.04, p.target - 0.05); }
    if (e.key === 'ArrowRight') { p.touched = true; p.target = Math.min(0.96, p.target + 0.05); }
  };

  return (
    <div
      ref={wrap}
      className={`relative select-none overflow-hidden touch-pan-y ${className}`}
      style={{ ['--cut' as string]: '15%' }}
      data-cursor="Glisser"
      data-lenis-prevent
    >
      <img src={avant} alt={`${alt} — avant`} width={width} height={height} loading="lazy" className="block h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 var(--cut))' }}>
        <img src={apres} alt={`${alt} — après`} width={width} height={height} loading="lazy" className="block h-full w-full object-cover" />
      </div>
      <span className="pointer-events-none absolute bottom-3 left-3 bg-ink/70 px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-ink-inverse">Avant</span>
      <span className="pointer-events-none absolute bottom-3 right-3 bg-accent px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-ink-inverse">Après</span>
      <div
        role="slider"
        aria-label="Comparer avant et après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos.current.v * 100)}
        tabIndex={0}
        onKeyDown={onKey}
        className="absolute inset-y-0 w-px bg-surface"
        style={{ left: 'var(--cut)' }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-surface bg-ink/70 text-surface backdrop-blur-sm">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 6l-5 6 5 6M15 6l5 6-5 6" /></svg>
        </span>
      </div>
    </div>
  );
}
