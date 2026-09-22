import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { EMAIL, TELEPHONE, TELEPHONE_HREF } from '@/config/site.config';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { MagneticButton } from '@/components/ui/MagneticButton';

/** Renseigner pour brancher le formulaire (Formspree, Netlify Forms, API maison).
    Vide : l'envoi est simulé. */
const ENDPOINT_DEVIS = '';

const TOITURES = ['Tuile', 'Ardoise', 'Zinc', 'Bac acier', 'Je ne sais pas'];
const DEMANDES = ['Réfection complète', 'Fuite', 'Zinguerie / gouttières', 'Démoussage', 'Isolation', 'Après tempête', 'Autre'];

type Champs = { toiture: string; demande: string; urgence: string; nom: string; telephone: string; commune: string; message: string };
const VIDE: Champs = { toiture: '', demande: '', urgence: '', nom: '', telephone: '', commune: '', message: '' };

/* Champs révélés un par un : chaque réponse fait apparaître la suivante.
   Validation inline, succès animé. */
export function Devis() {
  const [v, setV] = useState<Champs>(VIDE);
  const [err, setErr] = useState<Partial<Champs>>({});
  const [etat, setEtat] = useState<'idle' | 'envoi' | 'ok' | 'erreur'>('idle');
  const stepsRef = useRef<HTMLFormElement>(null);

  const etape =
    !v.toiture ? 1 : !v.demande ? 2 : !v.urgence ? 3 : 4;

  useEffect(() => {
    if (prefersReducedMotion() || !stepsRef.current) return;
    const el = stepsRef.current.querySelector<HTMLElement>(`[data-step="${etape}"]`);
    if (el) gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' });
  }, [etape]);

  const set = (k: keyof Champs) => (val: string) => { setV((s) => ({ ...s, [k]: val })); setErr((e) => ({ ...e, [k]: undefined })); };

  const valider = () => {
    const e: Partial<Champs> = {};
    if (v.nom.trim().length < 2) e.nom = 'Votre nom, pour vous rappeler.';
    if (!/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(v.telephone.trim())) e.telephone = 'Un numéro français à dix chiffres.';
    if (v.commune.trim().length < 2) e.commune = 'La commune du chantier.';
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const envoyer = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!valider()) return;
    setEtat('envoi');
    try {
      if (ENDPOINT_DEVIS) {
        const r = await fetch(ENDPOINT_DEVIS, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(v) });
        if (!r.ok) throw new Error(String(r.status));
      } else {
        await new Promise((res) => setTimeout(res, 900));
      }
      setEtat('ok');
    } catch {
      setEtat('erreur');
    }
  };

  return (
    <section id="devis" aria-labelledby="devis-title" className="section slate-scales bg-surface-alt">
      <div className="container-fluid grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow mb-8">Devis</p>
          <SplitTitle id="devis-title" lines={['Dites-moi', 'ce que', 'vous voyez.']} accent="voyez." className="text-2xl md:text-3xl" />
          <p className="para mt-8">Trois questions, vos coordonnées, et je vous rappelle sous 24 h ouvrées pour caler le passage. Le diagnostic et le devis sont gratuits.</p>
          <p className="mt-6 text-sm text-ink-mute">
            Plus simple de parler ? <a href={TELEPHONE_HREF} className="link-draw text-ink" data-cursor="Appeler">{TELEPHONE}</a>
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          {etat === 'ok' ? (
            <Succes nom={v.nom} />
          ) : (
            <form onSubmit={envoyer} noValidate ref={stepsRef} className="space-y-12">
              <fieldset data-step="1">
                <legend id="toiture-label" className="mb-4 font-display text-lg">Votre toiture est en… <span className="num text-sm">01</span></legend>
                <Choix name="toiture" options={TOITURES} value={v.toiture} onChange={set('toiture')} />
              </fieldset>

              {etape >= 2 && (
                <fieldset data-step="2">
                  <legend id="demande-label" className="mb-4 font-display text-lg">Il s’agit de… <span className="num text-sm">02</span></legend>
                  <Choix name="demande" options={DEMANDES} value={v.demande} onChange={set('demande')} />
                </fieldset>
              )}

              {etape >= 3 && (
                <fieldset data-step="3">
                  <legend id="urgence-label" className="mb-4 font-display text-lg">C’est urgent ? <span className="num text-sm">03</span></legend>
                  <Choix name="urgence" options={['Oui, ça fuit', 'Non, ça peut attendre']} value={v.urgence} onChange={set('urgence')} />
                </fieldset>
              )}

              {etape >= 4 && (
                <div data-step="4" className="space-y-6">
                  <p className="font-display text-lg">Vos coordonnées <span className="num text-sm">04</span></p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Champ id="nom" label="Nom" value={v.nom} onChange={set('nom')} error={err.nom} autoComplete="name" />
                    <Champ id="telephone" label="Téléphone" value={v.telephone} onChange={set('telephone')} error={err.telephone} type="tel" autoComplete="tel" inputMode="tel" />
                    <Champ id="commune" label="Commune du chantier" value={v.commune} onChange={set('commune')} error={err.commune} autoComplete="address-level2" />
                  </div>
                  <div>
                    <label htmlFor="message" className="eyebrow block">Ce que vous avez vu (facultatif)</label>
                    <textarea id="message" rows={3} value={v.message} onChange={(e) => set('message')(e.target.value)} className="mt-2 w-full border-b border-line-strong bg-transparent py-2 focus:border-ink focus:outline-none" placeholder="Une trace au plafond de la chambre depuis les pluies de mars…" />
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <MagneticButton as="button" type="submit" className="btn btn-primary" disabled={etat === 'envoi'} data-cursor="Envoyer">
                      {etat === 'envoi' ? 'Envoi…' : 'Demander mon devis'}
                    </MagneticButton>
                    {etat === 'erreur' && <p role="alert" className="text-sm text-accent">L’envoi a échoué. Appelez-moi au {TELEPHONE} ou écrivez à {EMAIL}.</p>}
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Choix({ options, value, onChange, name }: { options: readonly string[]; value: string; onChange: (s: string) => void; name: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`${name}-label`}>
      {options.map((o) => (
        <label key={o} className={`cursor-pointer border px-4 py-2.5 text-sm transition-colors duration-300 ${value === o ? 'border-accent bg-accent text-ink-inverse' : 'border-line-strong hover:border-ink'}`}>
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
          {o}
        </label>
      ))}
    </div>
  );
}

function Champ({ id, label, value, onChange, error, type = 'text', ...rest }: { id: string; label: string; value: string; onChange: (s: string) => void; error?: string; type?: string; autoComplete?: string; inputMode?: 'tel' }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`mt-2 w-full border-b bg-transparent py-2 focus:outline-none ${error ? 'border-accent' : 'border-line-strong focus:border-ink'}`}
        {...rest}
      />
      {error && <p id={`${id}-err`} className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

function Succes({ nom }: { nom: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const path = ref.current.querySelector<SVGPathElement>('path')!;
    const l = path.getTotalLength();
    gsap.set(path, { strokeDasharray: l, strokeDashoffset: l });
    gsap.timeline()
      .to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power3.inOut' })
      .from(ref.current.querySelectorAll('p'), { y: 16, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1 }, '-=0.5');
  }, []);
  return (
    <div ref={ref} role="status" className="border-t border-ink pt-8">
      <svg viewBox="0 0 120 60" className="h-16 w-32 text-accent" aria-hidden>
        <path d="M6 40 L40 6 L74 40 M20 40 L60 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
      <p className="mt-6 font-display text-2xl">Merci {nom.split(' ')[0]}, c’est noté.</p>
      <p className="para mt-4">Je vous rappelle sous 24 h ouvrées pour convenir du passage. Si ça fuit ce soir, n’attendez pas : <a href={TELEPHONE_HREF} className="link-draw text-ink">{TELEPHONE}</a>.</p>
    </div>
  );
}
