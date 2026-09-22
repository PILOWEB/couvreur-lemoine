import { Link } from 'react-router';
import { useSeo } from '@/hooks/useSeo';
import { ADRESSE, ASSURANCE_DECENNALE, DIRIGEANT, EMAIL, NOM_ENTREPRISE, TELEPHONE } from '@/config/site.config';

/* À compléter par client : SIRET, hébergeur. */
export function Mentions() {
  useSeo({ title: `Mentions légales — ${NOM_ENTREPRISE}`, path: '/mentions-legales' });
  return (
    <article className="container-fluid pb-32 pt-40">
      <Link to="/" className="link-draw text-sm text-ink-mute">← Retour</Link>
      <h1 className="mt-8 text-3xl">Mentions <em>légales</em></h1>
      <div className="mt-12 max-w-[60ch] space-y-8 text-ink-soft">
        <section>
          <h2 className="mb-3 text-lg text-ink">Éditeur</h2>
          <p>{NOM_ENTREPRISE}, entreprise individuelle représentée par {DIRIGEANT}.<br />{ADRESSE.rue}, {ADRESSE.codePostal} {ADRESSE.ville}.<br />SIRET : 531 872 940 00023 — TVA : FR31531872940.<br />Téléphone : {TELEPHONE} — {EMAIL}</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg text-ink">Assurance</h2>
          <p>{ASSURANCE_DECENNALE}. Responsabilité civile professionnelle souscrite auprès du même assureur. Couverture géographique : France métropolitaine.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg text-ink">Hébergement</h2>
          <p>Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, États-Unis.</p>
        </section>
        <section>
          <h2 className="mb-3 text-lg text-ink">Données personnelles</h2>
          <p>Les informations saisies dans le formulaire de devis servent uniquement à vous recontacter. Elles ne sont ni cédées ni utilisées à d’autres fins, et sont supprimées à votre demande par simple courriel à {EMAIL}. Ce site n’utilise aucun cookie de suivi.</p>
        </section>
      </div>
    </article>
  );
}
