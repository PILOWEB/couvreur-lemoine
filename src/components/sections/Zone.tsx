import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/motion';
import { VILLE, ZONE_INTERVENTION, ZONE_LABEL, DEPARTEMENT } from '@/config/site.config';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { Reveal } from '@/components/ui/Reveal';

/* Carte stylisée dessinée : cercles de distance, points de communes, tracé
   qui se dessine au scroll. Jamais de Google Maps brut. On est en vue
   aérienne, cohérent avec la fin de l'ascension. */
const POINTS = ZONE_INTERVENTION.map((nom, i) => {
  const a = (i / ZONE_INTERVENTION.length) * Math.PI * 2 + 0.4;
  const d = i === 0 ? 0 : 0.35 + ((i * 7) % 5) * 0.13;
  return { nom, x: 50 + Math.cos(a) * d * 44, y: 50 + Math.sin(a) * d * 44 };
});

export function Zone() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || prefersReducedMotion()) return;
    const rings = el.querySelectorAll<SVGCircleElement>('[data-ring]');
    const dots = el.querySelectorAll<SVGGElement>('[data-dot]');
    const roads = el.querySelectorAll<SVGPathElement>('[data-road]');
    rings.forEach((r) => { const l = r.getTotalLength(); gsap.set(r, { strokeDasharray: l, strokeDashoffset: l }); });
    roads.forEach((r) => { const l = r.getTotalLength(); gsap.set(r, { strokeDasharray: l, strokeDashoffset: l }); });
    gsap.set(dots, { scale: 0, transformOrigin: 'center', opacity: 0 });
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 75%', once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(rings, { strokeDashoffset: 0, duration: 1.6, ease: 'power3.inOut', stagger: 0.15 })
          .to(roads, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.08 }, '-=1.2')
          .to(dots, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.06 }, '-=1');
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section id="zone" aria-labelledby="zone-title" className="section container-fluid">
      <div className="grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <p className="eyebrow mb-8">Zone d’intervention</p>
          <SplitTitle id="zone-title" lines={['Trente kilomètres', 'autour de', VILLE + '.']} accent="autour" className="text-2xl md:text-3xl" />
          <p className="para mt-8">{ZONE_LABEL}. Au-delà, j’accepte selon le chantier : appelez, on en parle.</p>
          <Reveal variant="lift" stagger={0.04} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {ZONE_INTERVENTION.map((c) => (
              <span key={c} className="border-b border-line py-2 font-display text-md">{c}</span>
            ))}
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <svg ref={svg} viewBox="0 0 100 100" className="w-full text-ink" role="img" aria-label={`Carte stylisée des communes desservies autour de ${VILLE}, ${DEPARTEMENT}`}>
            <defs>
              <pattern id="hatch" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="2" stroke="currentColor" strokeWidth="0.15" opacity="0.25" />
              </pattern>
            </defs>
            <circle cx="50" cy="50" r="44" fill="url(#hatch)" />
            {[14, 28, 44].map((r) => (
              <circle key={r} data-ring cx="50" cy="50" r={r} fill="none" stroke="var(--color-zinc)" strokeWidth="0.25" />
            ))}
            {/* routes stylisées depuis le centre */}
            {POINTS.slice(1).map((p, i) => (
              <path key={i} data-road d={`M50 50 Q ${(50 + p.x) / 2 + (i % 2 ? 4 : -4)} ${(50 + p.y) / 2 + (i % 3 ? -3 : 3)} ${p.x} ${p.y}`} fill="none" stroke="var(--color-ocre)" strokeWidth="0.2" strokeDasharray="0.6 0.8" opacity="0.7" />
            ))}
            {POINTS.map((p, i) => (
              <g key={p.nom} data-dot>
                <circle cx={p.x} cy={p.y} r={i === 0 ? 1.6 : 0.8} fill={i === 0 ? 'var(--color-accent)' : 'currentColor'} />
                <text x={p.x + (p.x > 50 ? 2 : -2)} y={p.y + 1} textAnchor={p.x > 50 ? 'start' : 'end'} fontSize={i === 0 ? 3.2 : 2.4} fontFamily="var(--font-display)" fill="currentColor" fontStyle={i === 0 ? 'italic' : 'normal'}>
                  {p.nom}
                </text>
              </g>
            ))}
            <text x="50" y="97" textAnchor="middle" fontSize="2" fontFamily="var(--font-body)" fill="var(--color-ink-mute)" letterSpacing="0.4">
              ~ 30 KM
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
