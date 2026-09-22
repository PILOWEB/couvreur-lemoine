import { useEffect, useRef, type ComponentType, type ElementType } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';

interface Props {
  as?: ElementType;
  /** Une entrée par ligne ; chaque ligne est découpée en mots. */
  lines: readonly string[];
  /** Mot rendu en italique terre cuite. */
  accent?: string;
  className?: string;
  /** 'ready' : déclenché par la prop `play`. 'scroll' : à l'entrée dans le viewport. */
  trigger?: 'ready' | 'scroll';
  play?: boolean;
  id?: string;
}

/* Chaque mot sort d'un masque, 60 ms de décalage, ressort doux. */
export function SplitTitle({ as = 'h2', lines, accent, className = '', trigger = 'scroll', play = false, id }: Props) {
  const Tag = as as unknown as ComponentType<any>;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>('[data-word]');
    if (prefersReducedMotion()) { gsap.set(words, { yPercent: 0, rotate: 0 }); return; }
    gsap.set(words, { yPercent: 110, rotate: 3 });

    const animate = () => gsap.to(words, {
      yPercent: 0, rotate: 0,
      duration: 0.9,
      ease: 'back.out(1.4)',
      stagger: 0.06,
      overwrite: true,
    });

    if (trigger === 'ready') {
      if (play) animate();
      return;
    }
    const st = ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: animate });
    return () => st.kill();
  }, [trigger, play, lines]);

  return (
    <Tag ref={ref} id={id} className={className} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(' ').map((w, wi) => {
            const clean = w.replace(/[.,;:!?’']/g, '');
            const isAccent = accent && clean.toLowerCase() === accent.toLowerCase();
            return (
              <span key={wi} className="line-mask inline-block align-top pb-[0.08em] -mb-[0.08em]">
                <span data-word className="inline-block origin-bottom-left will-change-transform">
                  {isAccent ? <em>{w}</em> : w}
                  {wi < line.split(' ').length - 1 ? ' ' : ''}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
