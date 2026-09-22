import { Link } from 'react-router';
import { SERVICES } from '@/config/site.config';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { Reveal } from '@/components/ui/Reveal';

/* Liste éditoriale, pas une grille d'icônes : chaque service est une ligne
   numérotée qui s'ouvre au survol sur son échantillon de matériau. */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section container-fluid">
      <div className="grid-12 gap-y-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow mb-8">Services</p>
          <SplitTitle id="services-title" lines={['Sept façons', 'de garder', 'l’eau dehors.']} accent="dehors." className="text-2xl md:text-3xl" />
        </div>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <ol className="rule-strong">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} variant="lift" delay={i * 0.04}>
                <li className="group relative">
                  <Link
                    to={`/services/${s.slug}`}
                    className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-line py-6 md:grid-cols-[4rem_1fr_minmax(0,18rem)_auto] md:py-7"
                    data-cursor="Voir"
                  >
                    <span className="num text-sm">{s.index}</span>
                    <h3 className="font-display text-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2 md:text-xl">
                      {s.titre.split(' ').map((w, wi) => {
                        const clean = w.replace(/[&.,]/g, '');
                        return <span key={wi}>{clean.toLowerCase() === s.accent.toLowerCase() ? <em>{w}</em> : w}{' '}</span>;
                      })}
                    </h3>
                    <p className="col-span-3 text-sm text-ink-soft md:col-span-1 md:col-start-3">{s.resume}</p>
                    <span className="hidden text-ink-mute transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 md:block" aria-hidden>→</span>
                  </Link>
                  <img
                    src={`/images/materiau-${s.materiau}.webp`}
                    alt=""
                    width={900}
                    height={900}
                    loading="lazy"
                    className="pointer-events-none absolute right-0 top-1/2 hidden h-28 w-28 -translate-y-1/2 scale-90 object-cover opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] group-hover:-translate-x-12 group-hover:scale-100 group-hover:opacity-100 lg:block"
                    aria-hidden
                  />
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
