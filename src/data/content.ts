/* =============================================================================
   TEXTES DE DÉMONSTRATION — à adapter par client.
   Ton : concret, rassurant, première personne. Jamais de jargon.
   ============================================================================= */

import type { MateriauKey } from '@/config/site.config';

export const METIER_TEXTE = {
  surtitre: 'Le métier',
  titre: ['Un toit se lit', 'avant de se réparer.'],
  accent: 'lit',
  paragraphes: [
    'Quand j’arrive sur un chantier, je ne sors pas l’échelle tout de suite. Je fais le tour de la maison. Je regarde où l’eau coule quand il pleut, où la mousse s’installe, comment le faîtage a bougé. Un toit raconte ce qu’il a vécu, et il faut le laisser parler.',
    'J’ai appris le métier à Rambouillet, chez un couvreur qui refaisait les ardoises des fermes du Hurepoix. Depuis 2011, je travaille à mon compte, avec un compagnon, sur les toits de Dourdan et des villages autour. Je n’ai pas de commercial : c’est moi qui monte, moi qui chiffre, moi qui pose.',
    'Ce que je promets tient en une phrase : vous saurez ce que j’ai vu, ce que je vais faire, et pourquoi, avant que je touche à une seule tuile.',
  ],
  signature: 'Thomas Lemoine, couvreur-zingueur',
} as const;

export interface Realisation {
  id: number;
  titre: string;
  lieu: string;
  typeToiture: string;
  materiau: MateriauKey;
  annee: number;
  /** ratio de l'image dans la galerie asymétrique */
  format: 'portrait' | 'paysage' | 'carre';
  avantApres: boolean;
}

export const REALISATIONS: readonly Realisation[] = [
  { id: 1, titre: 'Longère du Hurepoix', lieu: 'Saint-Chéron', typeToiture: 'Tuile plate, deux versants, 140 m²', materiau: 'tuile', annee: 2025, format: 'paysage', avantApres: true },
  { id: 2, titre: 'Maison de bourg', lieu: 'Dourdan, centre', typeToiture: 'Ardoise naturelle, lucarnes zinc', materiau: 'ardoise', annee: 2025, format: 'portrait', avantApres: true },
  { id: 3, titre: 'Pavillon années 70', lieu: 'Breuillet', typeToiture: 'Démoussage, tuile mécanique, 110 m²', materiau: 'tuile', annee: 2024, format: 'carre', avantApres: true },
  { id: 4, titre: 'Extension atelier', lieu: 'Limours', typeToiture: 'Bac acier, pente 8 %, isolation sarking', materiau: 'bac-acier', annee: 2024, format: 'paysage', avantApres: false },
  { id: 5, titre: 'Cheminée et noues', lieu: 'Étampes', typeToiture: 'Zinguerie complète, abergements soudés', materiau: 'zinc', annee: 2024, format: 'portrait', avantApres: false },
];

export const METHODE = [
  {
    etape: '01',
    titre: 'Diagnostic sur place',
    accent: 'place',
    texte: 'Je monte sur le toit, je photographie chaque versant, et je vous montre ce que j’ai vu depuis le sol, sur l’écran. Pas de diagnostic au jugé depuis le jardin.',
    duree: '45 min',
  },
  {
    etape: '02',
    titre: 'Devis détaillé, gratuit',
    accent: 'gratuit',
    texte: 'Poste par poste : matériaux, quantités, main-d’œuvre, évacuation. Ce que vous lisez est ce que vous paierez. Les imprévus, s’il y en a, sont chiffrés avant d’être faits.',
    duree: 'sous 5 jours',
  },
  {
    etape: '03',
    titre: 'Chantier, abords protégés',
    accent: 'protégés',
    texte: 'Bâches au sol, gouttières protégées, benne à l’écart des plantations. Chaque soir, le toit est hors d’eau. Vous restez chez vous pendant les travaux.',
    duree: '3 à 12 jours',
  },
  {
    etape: '04',
    titre: 'Réception et garantie',
    accent: 'garantie',
    texte: 'On fait le tour ensemble, photos à l’appui. Vous repartez avec la facture, l’attestation décennale, et mon numéro pour la première pluie.',
    duree: '10 ans',
  },
] as const;

export const CHIFFRES = [
  { valeur: 14, suffixe: ' ans', label: 'de métier sur les toits du sud Essonne' },
  { valeur: 680, suffixe: '', label: 'toitures suivies depuis 2011' },
  { valeur: 24, suffixe: ' h', label: 'pour bâcher après une tempête' },
  { valeur: 10, suffixe: ' ans', label: 'de garantie décennale sur chaque chantier' },
] as const;

export const TEMOIGNAGES = [
  { nom: 'Catherine V.', lieu: 'Dourdan', texte: 'Il est monté, il a pris des photos, il m’a tout expliqué avant de me dire un prix. Le devis était clair, le chantier propre. Je n’ai pas eu à courir après lui.' },
  { nom: 'Marc et Sophie D.', lieu: 'Saint-Chéron', texte: 'Tempête un dimanche soir, toit bâché le lundi midi. Le rapport photo a suffi à l’assurance. On a refait le versant avec lui le mois suivant.' },
  { nom: 'Jean-Pierre L.', lieu: 'Étampes', texte: 'Deux couvreurs avant lui m’avaient dit qu’il fallait tout refaire. Il a trouvé la noue percée en vingt minutes. Réparée dans la matinée.' },
  { nom: 'Hélène R.', lieu: 'Limours', texte: 'Il a déconseillé l’hydrofuge sur mon ardoise alors que je le demandais. C’est là que j’ai su que je pouvais lui faire confiance.' },
  { nom: 'Famille B.', lieu: 'Breuillet', texte: 'Démoussage à la brosse, pas au karcher. Le toit est propre et aucune tuile n’a bougé. Il est revenu vérifier après le premier orage, sans qu’on le demande.' },
] as const;

export const FAQ = [
  {
    q: 'Combien coûte une réfection de toiture au m² ?',
    r: 'Entre 90 et 180 € le m² pour une tuile mécanique, entre 150 et 260 € pour de l’ardoise naturelle, pose et dépose comprises. La fourchette dépend de la pente, des accès et de l’état de la charpente. Le devis est gratuit et détaillé poste par poste.',
  },
  {
    q: 'Combien de temps dure un chantier ?',
    r: 'Une recherche de fuite se règle souvent dans la matinée. Un démoussage prend une journée. Une réfection complète de 120 m² demande 8 à 12 jours ouvrés, hors intempéries. Je vous donne une date de fin dans le devis.',
  },
  {
    q: 'Êtes-vous assuré ?',
    r: 'Oui : garantie décennale Groupama, attestation remise avec chaque devis, et responsabilité civile professionnelle. Vous pouvez vérifier le numéro de police auprès de l’assureur avant de signer.',
  },
  {
    q: 'Existe-t-il des aides pour ces travaux ?',
    r: 'Pour l’isolation de combles, MaPrimeRénov’ et les certificats d’économie d’énergie s’appliquent, à condition de passer par un artisan RGE, ce que je suis. La couverture seule n’est pas éligible, sauf si elle s’inscrit dans une rénovation globale.',
  },
  {
    q: 'Sous quel délai pouvez-vous intervenir ?',
    r: 'Urgence après tempête : bâchage sous 24 h. Recherche de fuite : sous 48 h. Chantier de réfection : 3 à 6 semaines selon la saison, plus long au printemps où tout le monde s’y prend en même temps.',
  },
] as const;
