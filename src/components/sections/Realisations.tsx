import { REALISATIONS } from '@/data/content';
import { MATERIAUX } from '@/config/site.config';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { Reveal } from '@/components/ui/Reveal';
import { BeforeAfter } from '@/components/ui/BeforeAfter';

/* Galerie asymétrique : colonnes désaxées, formats mélangés, jamais deux
   cartes de même taille côte à côte. Avant/après sur les chantiers qui en ont. */
const LAYOUT: Record<number, string> = {
  1: 'col-span-12 md:col-span-7',
  2: 'col-span-12 md:col-span-4 md:col-start-9 md:-mt-24',
  3: 'col-span-12 md:col-span-5 md:col-start-2 md:mt-8',
  4: 'col-span-12 md:col-span-6 md:col-start-7 md:-mt-12',
  5: 'col-span-12 md:col-span-4 md:col-start-4 md:mt-4',
};

const RATIO: Record<string, string> = { paysage: 'aspect-[7/5]', portrait: 'aspect-[5/7]', carre: 'aspect-square' };
const DIM: Record<string, [number, number]> = { paysage: [1400, 1000], portrait: [1000, 1400], carre: [1400, 1000] };

export function Realisations() {
  const nomMateriau = (k: string) => MATERIAUX.find((m) => m.key === k)?.nom ?? k;

  return (
    <section id="realisations" aria-labelledby="realisations-title" className="section container-fluid">
      <div className="grid-12 items-end gap-y-6">
        <div className="col-span-12 md:col-span-6">
          <p className="eyebrow mb-8">Réalisations</p>
          <SplitTitle id="realisations-title" lines={['Des toits', 'qu’on a', 'vus de près.']} accent="près." className="text-2xl md:text-3xl" />
        </div>
        <p className="para col-span-12 md:col-span-4 md:col-start-9">
          Glissez la poignée : le toit avant, le toit après. Localisation et type de couverture en légende.
        </p>
      </div>

      <ul className="grid-12 mt-20 gap-y-16 md:gap-y-0">
        {REALISATIONS.map((r, i) => {
          const [w, h] = DIM[r.format];
          return (
            <li key={r.id} className={`${LAYOUT[r.id]}`}>
              <Reveal variant="scale" delay={i * 0.05}>
                <figure>
                  {r.avantApres ? (
                    <BeforeAfter
                      avant={`/images/chantier-${r.id}-avant.webp`}
                      apres={`/images/chantier-${r.id}-apres.webp`}
                      alt={`${r.titre}, ${r.lieu}`}
                      width={w}
                      height={h}
                      className={RATIO[r.format]}
                    />
                  ) : (
                    <div className={`${RATIO[r.format]} overflow-hidden`} data-cursor={r.lieu}>
                      <img src={`/images/chantier-${r.id}.webp`} alt={`${r.titre}, ${r.lieu}`} width={w} height={h} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] hover:scale-[1.03]" />
                    </div>
                  )}
                  <figcaption className="mt-4 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-t border-line pt-3">
                    <span className="num text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-display text-md">{r.titre} <span className="text-ink-mute">— {r.lieu}</span></h3>
                    <span className="col-start-2 text-xs text-ink-soft">{r.typeToiture} · {nomMateriau(r.materiau)} · {r.annee}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
