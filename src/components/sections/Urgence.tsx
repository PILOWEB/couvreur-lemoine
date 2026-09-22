import { DELAI_URGENCE, TELEPHONE, TELEPHONE_HREF } from '@/config/site.config';
import { Reveal } from '@/components/ui/Reveal';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { PhoneIcon } from '@/components/layout/Header';

/* Bandeau urgence : le visiteur inquiet trouve le numéro sans chercher.
   Pulsation très lente sur le bouton, jamais clignotante. */
export function Urgence() {
  return (
    <section aria-labelledby="urgence-title" className="container-fluid">
      <Reveal variant="draw" className="grid-12 items-center gap-y-6 py-8">
        <div className="col-span-12 md:col-span-7">
          <h2 id="urgence-title" className="text-lg md:text-xl">
            Fuite, tuiles envolées, <em>tempête</em> ?
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            {DELAI_URGENCE}, rapport photo daté pour l’assurance. Sept jours sur sept.
          </p>
        </div>
        <div className="col-span-12 flex md:col-span-5 md:justify-end">
          <MagneticButton as="a" href={TELEPHONE_HREF} className="btn btn-primary pulse-slow" data-cursor="Appeler">
            <PhoneIcon /> {TELEPHONE}
          </MagneticButton>
        </div>
      </Reveal>
    </section>
  );
}
