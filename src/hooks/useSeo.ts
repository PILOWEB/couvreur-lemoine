import { useEffect } from 'react';
import {
  ADRESSE, ANNEE_CREATION, EMAIL, HORAIRES, NOM_ENTREPRISE, TELEPHONE, TELEPHONE_HREF,
  VILLE, DEPARTEMENT, ZONE_INTERVENTION, ZONE_LABEL, QUALIFICATIONS,
} from '@/config/site.config';

interface SeoOptions {
  title?: string;
  description?: string;
  path?: string;
  /** Commune ciblée par la page : title et meta dédiés pour le SEO local. */
  commune?: string;
}

const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.content = content;
};

const setJsonLd = (id: string, data: object) => {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; document.head.appendChild(el); }
  el.textContent = JSON.stringify(data);
};

export function useSeo(opts?: SeoOptions) {
  useEffect(() => {
    const lieu = opts?.commune ?? VILLE;
    const title = opts?.title ?? `Couvreur-zingueur à ${lieu} — ${NOM_ENTREPRISE}`;
    const description = opts?.description ??
      `${NOM_ENTREPRISE}, couvreur-zingueur à ${lieu} (${DEPARTEMENT}) depuis ${ANNEE_CREATION}. Réfection, zinguerie, démoussage, recherche de fuite. Intervention ${ZONE_LABEL}. Bâchage sous 24 h, appel au ${TELEPHONE}.`;

    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:image', '/images/og-image.webp', 'property');
    setMeta('og:locale', 'fr_FR', 'property');

    const canonical = `${window.location.origin}${opts?.path ?? '/'}`;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;

    setJsonLd('ld-business', {
      '@context': 'https://schema.org',
      '@type': ['RoofingContractor', 'LocalBusiness'],
      name: NOM_ENTREPRISE,
      telephone: TELEPHONE_HREF.replace('tel:', ''),
      email: EMAIL,
      url: window.location.origin,
      foundingDate: String(ANNEE_CREATION),
      address: {
        '@type': 'PostalAddress',
        streetAddress: ADRESSE.rue,
        postalCode: ADRESSE.codePostal,
        addressLocality: ADRESSE.ville,
        addressRegion: DEPARTEMENT,
        addressCountry: 'FR',
      },
      areaServed: ZONE_INTERVENTION.map((nom) => ({ '@type': 'City', name: nom })),
      openingHoursSpecification: HORAIRES.filter((h) => !/urgence/i.test(h.jours)).map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.jours,
        opens: h.heures.split('–')[0]?.trim(),
        closes: h.heures.split('–')[1]?.trim(),
      })),
      hasCredential: QUALIFICATIONS.map((q) => ({ '@type': 'EducationalOccupationalCredential', name: q })),
      priceRange: '€€',
    });
  }, [opts?.title, opts?.description, opts?.path, opts?.commune]);
}
