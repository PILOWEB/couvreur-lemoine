import { useEffect, useRef } from 'react';
import { gsap, isTouch, prefersReducedMotion } from '@/lib/motion';

/* Disque terre cuite en mix-blend-mode difference. Inertie lerp 0.15.
   Grossit au survol et affiche un libellé lu sur [data-cursor]. Jamais sur tactile. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return;
    const el = dot.current!, txt = label.current!;
    document.documentElement.classList.add('has-custom-cursor');

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    const setX = gsap.quickSetter(el, 'x', 'px'), setY = gsap.quickSetter(el, 'y', 'px');

    const onMove = (e: PointerEvent) => { target.x = e.clientX; target.y = e.clientY; };
    const tick = () => {
      pos.x += (target.x - pos.x) * 0.15;
      pos.y += (target.y - pos.y) * 0.15;
      setX(pos.x); setY(pos.y);
    };
    gsap.ticker.add(tick);

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
      if (!t) return;
      const text = t.dataset.cursor ?? (t.matches('a[href^="tel:"]') ? 'Appeler' : t.matches('a, button') ? 'Voir' : '');
      txt.textContent = text;
      gsap.to(el, { scale: text ? 5.5 : 2.4, duration: 0.5, ease: 'expo.out' });
      gsap.to(txt, { opacity: text ? 1 : 0, duration: 0.3, ease: 'power2.out' });
    };
    const onOut = (e: Event) => {
      const t = (e.target as HTMLElement).closest('[data-cursor], a, button');
      if (!t) return;
      gsap.to(el, { scale: 1, duration: 0.6, ease: 'expo.out' });
      gsap.to(txt, { opacity: 0, duration: 0.2 });
    };
    const onDown = () => gsap.to(el, { scale: 0.7, duration: 0.15, ease: 'power2.out' });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.5, ease: 'back.out(2)' });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent [.has-custom-cursor_&]:block"
      style={{ mixBlendMode: 'difference' }}
    >
      <span
        ref={label}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-body text-[2.2px] font-medium uppercase tracking-[0.12em] text-surface opacity-0"
      />
    </div>
  );
}
