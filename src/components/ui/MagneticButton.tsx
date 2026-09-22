import { useEffect, useRef, type ComponentPropsWithoutRef, type ComponentType, type ElementType } from 'react';
import { gsap, isTouch, prefersReducedMotion } from '@/lib/motion';

type Props<T extends ElementType> = { as?: T; strength?: number } & ComponentPropsWithoutRef<T>;

/* L'élément suit légèrement le pointeur dans un rayon, puis revient au ressort. */
export function MagneticButton<T extends ElementType = 'button'>({ as, strength = 0.35, children, ...rest }: Props<T>) {
  const Tag = (as ?? 'button') as unknown as ComponentType<any>;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isTouch() || prefersReducedMotion()) return;
    const inner = el.firstElementChild as HTMLElement;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'expo.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'expo.out' });
    const ixTo = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'expo.out' });
    const iyTo = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'expo.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength); yTo(dy * strength);
      ixTo(dx * strength * 0.4); iyTo(dy * strength * 0.4);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
      gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [strength]);

  return (
    <Tag ref={ref} {...rest}>
      <span className="inline-flex items-center gap-3 will-change-transform">{children}</span>
    </Tag>
  );
}
