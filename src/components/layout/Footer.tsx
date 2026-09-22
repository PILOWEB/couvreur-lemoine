import { Link } from 'react-router';
import {
  ADRESSE, ANNEE_CREATION, ASSURANCE_DECENNALE, EMAIL, HORAIRES, NOM_ENTREPRISE,
  QUALIFICATIONS, TELEPHONE, TELEPHONE_HREF, VILLE, DEPARTEMENT,
} from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { scrollTo } from '@/hooks/useLenis';

/* Fin de l'ascension : on est sur le toit, il fait bleu. Fond ardoise. */
export function Footer() {
  return (
    <footer className="slate-scales slate-scales-inverse relative bg-surface-deep pb-28 pt-[var(--section-y)] text-ink-inverse md:pb-16">
      <div className="container-fluid">
        <Reveal variant="mask">
          <p className="font-display text-4xl leading-[0.88] tracking-[-0.03em] md:text-5xl">
            {NOM_ENTREPRISE.split(' ')[0]}
            <br />
            <em className="text-accent">{NOM_ENTREPRISE.split(' ').slice(1).join(' ')}</em>
          </p>
        </Reveal>

        <div className="grid-12 mt-16 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow !text-ink-inverse/50">Nous joindre</p>
            <a href={TELEPHONE_HREF} className="link-draw mt-4 block font-display text-2xl" data-cursor="Appeler">{TELEPHONE}</a>
            <a href={`mailto:${EMAIL}`} className="link-draw mt-2 inline-block text-sm text-ink-inverse/70">{EMAIL}</a>
            <address className="mt-6 text-sm not-italic text-ink-inverse/70">
              {ADRESSE.rue}<br />{ADRESSE.codePostal} {ADRESSE.ville}, {DEPARTEMENT}
            </address>
          </div>

          <div className="col-span-12 md:col-span-3 md:col-start-6">
            <p className="eyebrow !text-ink-inverse/50">Horaires</p>
            <dl className="mt-4 space-y-2 text-sm">
              {HORAIRES.map((h) => (
                <div key={h.jours} className="flex justify-between gap-4 border-b border-ink-inverse/15 pb-2">
                  <dt className="text-ink-inverse/70">{h.jours}</dt>
                  <dd className="tabular-nums">{h.heures}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-12 md:col-span-3 md:col-start-10">
            <p className="eyebrow !text-ink-inverse/50">Garanties</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-inverse/80">
              {QUALIFICATIONS.map((q) => <li key={q}>{q}</li>)}
            </ul>
            <p className="mt-4 text-xs text-ink-inverse/50">{ASSURANCE_DECENNALE}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-inverse/15 pt-6 text-xs text-ink-inverse/50 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {NOM_ENTREPRISE} — Couvreur-zingueur à {VILLE} depuis {ANNEE_CREATION}</span>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="link-draw">Mentions légales</Link>
            <button type="button" onClick={() => scrollTo('#top')} className="link-draw" data-cursor="Redescendre">Redescendre au sol ↑</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
