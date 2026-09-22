import { TELEPHONE_HREF } from '@/config/site.config';
import { scrollTo } from '@/hooks/useLenis';
import { PhoneIcon } from '@/components/layout/Header';

/* Barre fixe en bas sur mobile : le pouce tombe dessus, appel en un geste. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[85] grid grid-cols-2 border-t border-line bg-surface/95 backdrop-blur-md md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <a href={TELEPHONE_HREF} className="flex items-center justify-center gap-2 bg-accent py-4 text-sm font-medium text-ink-inverse">
        <PhoneIcon /> Appeler
      </a>
      <button type="button" onClick={() => scrollTo('#devis')} className="py-4 text-sm font-medium text-ink">
        Demander un devis
      </button>
    </div>
  );
}
