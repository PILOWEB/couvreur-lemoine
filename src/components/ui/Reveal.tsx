import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

interface Props {
  children: ReactNode;
  /** 'mask' : sort d'un masque vers le haut. 'lift' : monte et se dévoile. 'draw' : un filet se dessine puis le contenu apparaît. 'scale' : dézoom léger. */
  variant?: 'mask' | 'lift' | 'draw' | 'scale';
  delay?: number;
  className?: string;
  /** Cascade sur les enfants directs. */
  stagger?: number;
}

/* Révélations variées, jamais un simple fade-up. */
export function Reveal({ children, variant = 'lift', delay = 0, className = '', stagger = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const targets = stagger ? Array.from(el.children) : [el];
    const from: gsap.TweenVars =
      variant === 'mask' ? { yPercent: 100 } :
      variant === 'scale' ? { scale: 1.06, opacity: 0, transformOrigin: 'center bottom' } :
      variant === 'draw' ? { opacity: 0, y: 12 } :
      { y: 40, opacity: 0 };
    gsap.set(targets, from);
    if (variant === 'draw') gsap.set(el, { '--draw': 0 });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ delay });
        if (variant === 'draw') tl.to(el, { '--draw': 1, duration: 0.8, ease: 'power4.inOut' });
        tl.to(targets, {
          y: 0, yPercent: 0, scale: 1, opacity: 1,
          duration: variant === 'mask' ? 0.9 : 0.8,
          ease: variant === 'mask' ? 'power4.out' : 'expo.out',
          stagger,
          clearProps: variant === 'mask' ? 'transform' : '',
        }, variant === 'draw' ? '-=0.3' : 0);
      },
    });
    return () => st.kill();
  }, [variant, delay, stagger]);

  const cls = variant === 'mask' ? `line-mask ${className}` : variant === 'draw' ? `reveal-draw ${className}` : className;
  return <div ref={ref} className={cls}>{children}</div>;
}
