import { Link, useParams } from 'react-router';
import { useSeo } from '@/hooks/useSeo';
import { MATERIAUX, NOM_ENTREPRISE, SERVICES, TELEPHONE, TELEPHONE_HREF, VILLE } from '@/config/site.config';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { Reveal } from '@/components/ui/Reveal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { PhoneIcon } from '@/components/layout/Header';
import { Home } from '@/pages/Home';

/* Page service : le titre part de la ligne cliquée (même mot en italique),
   le matériau associé en pleine largeur, le détail à la première personne. */
export function ServicePage() {
  const { slug } = useParams();
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return <Home />;
  const m = MATERIAUX.find((x) => x.key === s.materiau)!;
  const idx = SERVICES.indexOf(s);
  const suivant = SERVICES[(idx + 1) % SERVICES.length];

  useSeo({
    title: `${s.titre} à ${VILLE} — ${NOM_ENTREPRISE}`,
    description: `${s.resume} ${NOM_ENTREPRISE}, couvreur-zingueur à ${VILLE}. Devis gratuit au ${TELEPHONE}.`,
    path: `/services/${s.slug}`,
  });

  return (
    <article className="pb-32 pt-40">
      <div className="container-fluid grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <Link to="/#services" className="link-draw text-sm text-ink-mute">← Tous les services</Link>
          <p className="eyebrow mt-8 mb-6">Service {s.index}</p>
          <SplitTitle as="h1" trigger="ready" play lines={s.titre.split(' & ').length > 1 ? s.titre.split(' & ').map((p, i) => (i ? '& ' + p : p)) : [s.titre]} accent={s.accent} className="text-3xl md:text-4xl" />
        </div>
        <Reveal variant="lift" className="col-span-12 self-end lg:col-span-3 lg:col-start-10">
          <p className="para !max-w-none">{s.resume}</p>
        </Reveal>
      </div>

      <Reveal variant="scale" className="mt-16 md:mt-24">
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <img src={`/images/materiau-${m.key}.webp`} alt={m.nom} width={900} height={900} className="h-full w-full object-cover" />
          <span className="hand absolute bottom-6 left-[var(--gutter)] !text-xl text-surface">{m.legende}</span>
        </div>
      </Reveal>

      <div className="container-fluid grid-12 mt-20 gap-y-12">
        <div className="col-span-12 md:col-span-6 md:col-start-2">
          <Reveal variant="lift"><p className="para !text-lg">{s.detail}</p></Reveal>
        </div>
        <aside className="col-span-12 md:col-span-3 md:col-start-9">
          <Reveal variant="draw" className="pt-6">
            <p className="eyebrow">Matériau associé</p>
            <p className="mt-2 font-display text-lg">{m.nom}</p>
            <p className="mt-1 text-sm text-ink-soft">Durée de vie : {m.dureeVie}</p>
            <p className="mt-1 text-sm text-ink-soft">{m.usage}</p>
          </Reveal>
          <div className="mt-8 flex flex-col items-start gap-3">
            <MagneticButton as="a" href={TELEPHONE_HREF} className="btn btn-primary" data-cursor="Appeler"><PhoneIcon /> {TELEPHONE}</MagneticButton>
            <Link to="/#devis" className="btn btn-ghost">Demander un devis</Link>
          </div>
        </aside>
      </div>

      <div className="container-fluid mt-24">
        <Link to={`/services/${suivant.slug}`} className="group rule-strong flex items-baseline justify-between gap-6 py-8" data-cursor="Suivant">
          <span className="eyebrow">Service suivant</span>
          <span className="font-display text-xl transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-2 md:text-2xl">{suivant.titre} →</span>
        </Link>
      </div>
    </article>
  );
}
