import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { gsap, isMobile, prefersReducedMotion } from '@/lib/motion';
import { ascension } from '@/lib/ascension';
import { useAppReady } from '@/hooks/useAppReady';
import { scrollTo } from '@/hooks/useLenis';
import { BASELINE, NOM_ENTREPRISE, TELEPHONE, TELEPHONE_HREF, VILLE, ZONE_LABEL, DEPARTEMENT } from '@/config/site.config';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { PhoneIcon } from '@/components/layout/Header';

const HeroScene = lazy(() => import('@/components/three/HeroScene').then((m) => ({ default: m.HeroScene })));

/* Point de départ : au sol, on regarde le toit en contre-plongée. */
export function Hero() {
  const { ready } = useAppReady();
  const [use3d, setUse3d] = useState(false);
  const meta = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => { setUse3d(!isMobile() && !prefersReducedMotion()); }, []);

  // Le ciel derrière la scène suit l'ascension : matin doré → bleu du soir
  useEffect(() => ascension.subscribe((t) => {
    if (!bg.current) return;
    bg.current.style.setProperty('--sky-t', String(t));
  }), []);

  useEffect(() => {
    if (!ready || prefersReducedMotion() || !meta.current) return;
    gsap.fromTo(meta.current.children, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.08, delay: 0.5 });
  }, [ready]);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden pb-24 pt-32 md:pb-16">
      {/* Ciel + scène */}
      <div
        ref={bg}
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, color-mix(in oklab, var(--color-sky-dusk) calc(var(--sky-t, 0) * 100%), var(--color-sky-dawn)) 0%, var(--color-surface) 78%)',
        }}
      >
        {use3d ? (
          <Suspense fallback={null}>
            <div className="absolute inset-0 opacity-0 animate-[fade_1.4s_var(--ease-out)_0.4s_forwards]">
              <HeroScene />
            </div>
          </Suspense>
        ) : (
          <img src="/images/hero-static.webp" alt="" width={1200} height={1600} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top opacity-90" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface to-transparent" />
        {/* voile crème derrière le titre : le toit reste lisible, le texte aussi */}
        <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-surface/85 via-surface/40 to-transparent" />
      </div>

      <div className="container-fluid relative w-full">
        <div className="grid-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-9">
            <p className="eyebrow mb-6">{NOM_ENTREPRISE} · Couvreur-zingueur · {VILLE}, {DEPARTEMENT}</p>
            <SplitTitle
              as="h1"
              trigger="ready"
              play={ready}
              lines={['Un toit', 'qui tient,', 'et un homme', 'qui monte voir.']}
              accent="monte"
              className="text-4xl md:text-5xl"
            />
          </div>

          <div ref={meta} className="col-span-12 flex flex-col gap-6 lg:col-span-3 lg:pb-3">
            <p className="para !max-w-none text-ink-soft">{BASELINE}</p>
            <p className="text-sm text-ink-mute">Intervention {ZONE_LABEL}.</p>
            <div className="flex flex-wrap gap-3">
              <MagneticButton as="a" href={TELEPHONE_HREF} className="btn btn-primary" data-cursor="Appeler">
                <PhoneIcon /> {TELEPHONE}
              </MagneticButton>
              <MagneticButton as="button" type="button" onClick={() => scrollTo('#devis')} className="btn btn-ghost" data-cursor="Devis">
                Demander un devis
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="mt-16 hidden items-center gap-4 text-xs uppercase tracking-[0.18em] text-ink-mute md:flex" data-cursor="Faire défiler">
          <span className="block h-10 w-px origin-top bg-line-strong animate-[scrollhint_2.2s_var(--ease-in-out)_infinite]" />
          <span>Monter sur le toit</span>
        </div>
      </div>

      <style>{`
        @keyframes fade { to { opacity: 1 } }
        @keyframes scrollhint { 0% { transform: scaleY(0); transform-origin: top } 45% { transform: scaleY(1); transform-origin: top } 55% { transform: scaleY(1); transform-origin: bottom } 100% { transform: scaleY(0); transform-origin: bottom } }
      `}</style>
    </section>
  );
}
