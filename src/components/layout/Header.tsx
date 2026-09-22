import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { NOM_ENTREPRISE, TELEPHONE, TELEPHONE_HREF, VILLE } from '@/config/site.config';
import { scrollTo } from '@/hooks/useLenis';
import { MagneticButton } from '@/components/ui/MagneticButton';

const NAV = [
  { href: '#services', label: 'Services' },
  { href: '#materiaux', label: 'Matériaux' },
  { href: '#realisations', label: 'Réalisations' },
  { href: '#methode', label: 'Méthode' },
  { href: '#zone', label: 'Zone' },
  { href: '#devis', label: 'Devis' },
];

/* Le téléphone est atteignable en moins de deux secondes : il est dans
   l'en-tête, en permanence, sur tous les écrans. */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    gsap.fromTo(ref.current, { yPercent: -100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', delay: 2.4 });
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[80] transition-[background,backdrop-filter,padding] duration-500 ease-[var(--ease-out)] ${compact ? 'bg-surface/85 py-3 backdrop-blur-md' : 'py-5'}`}
    >
      <div className="container-fluid flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-md leading-none tracking-tight md:text-lg" data-cursor="Accueil" aria-label={`${NOM_ENTREPRISE}, retour à l'accueil`}>
          {NOM_ENTREPRISE}
          <span className="ml-2 hidden font-body text-xs uppercase tracking-[0.18em] text-ink-mute md:inline">· {VILLE}</span>
        </Link>

        <nav aria-label="Principale" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)} className="link-draw text-sm text-ink-soft hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MagneticButton as="a" href={TELEPHONE_HREF} className={`btn btn-primary !py-2.5 !px-4 ${compact ? 'pulse-slow' : ''}`} data-cursor="Appeler">
            <PhoneIcon />
            <span className="hidden sm:inline">{TELEPHONE}</span>
            <span className="sm:hidden">Appeler</span>
          </MagneticButton>

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`block h-px w-6 bg-ink transition-transform duration-400 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-6 bg-ink transition-transform duration-400 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        className={`container-fluid overflow-hidden bg-surface transition-[max-height,opacity] duration-500 ease-[var(--ease-in-out)] lg:hidden ${open ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col py-6">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={go(n.href)}
              tabIndex={open ? 0 : -1}
              className="rule flex items-baseline justify-between py-4 font-display text-xl"
            >
              {n.label}
              <span className="num text-sm">0{i + 1}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PhoneIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
    </svg>
  );
}
