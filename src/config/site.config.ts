/* =============================================================================
   VARIABLES MÉTIER — le seul fichier à modifier pour un nouveau couvreur.
   Tout le contenu du site est dérivé de ces valeurs.
   ============================================================================= */

export const NOM_ENTREPRISE = 'Lemoine Couverture';
export const BASELINE = 'Couvreur-zingueur à Dourdan. On lit un toit avant d’y toucher.';
export const VILLE = 'Dourdan';
export const DEPARTEMENT = 'Essonne';
export const ZONE_INTERVENTION: readonly string[] = [
  'Dourdan', 'Saint-Chéron', 'Étampes', 'Limours', 'Arpajon', 'Breuillet',
  'Angervilliers', 'Saint-Arnoult-en-Yvelines', 'Sermaise', 'Roinville', 'Corbreuse', 'Les Granges-le-Roi',
];
export const TELEPHONE = '06 74 21 08 53';
export const EMAIL = 'contact@lemoine-couverture.fr';
export const ANNEE_CREATION = 2011;
export const NB_CHANTIERS = 680;
export const ASSURANCE_DECENNALE = 'Garantie décennale Groupama n° 45892013';
export const QUALIFICATIONS: readonly string[] = [
  'RGE Qualibat 3112',
  'Artisan couvreur-zingueur',
  'Garantie décennale',
  'Habilitation travaux en hauteur',
];
export const COULEUR_ACCENT = '#B0492A';
export const DELAI_URGENCE = 'Bâchage sous 24 h';
export const DIRIGEANT = 'Thomas Lemoine';
export const ADRESSE = { rue: '7 route de Chartres', codePostal: '91410', ville: VILLE };
export const HORAIRES: readonly { jours: string; heures: string }[] = [
  { jours: 'Lundi – vendredi', heures: '7h30 – 18h' },
  { jours: 'Samedi', heures: '8h – 12h' },
  { jours: 'Urgences tempête', heures: '7 j / 7' },
];

/* Matériaux --------------------------------------------------------------- */

export type MateriauKey = 'ardoise' | 'tuile' | 'zinc' | 'bac-acier';

export interface Materiau {
  key: MateriauKey;
  nom: string;
  dureeVie: string;
  usage: string;
  legende: string;
}

export const MATERIAUX: readonly Materiau[] = [
  {
    key: 'ardoise',
    nom: 'Ardoise naturelle',
    dureeVie: '80 à 120 ans',
    usage: 'Maisons de bourg, pentes fortes, toitures d’avant 1950.',
    legende: 'posée au crochet inox, jamais au clou',
  },
  {
    key: 'tuile',
    nom: 'Tuile terre cuite',
    dureeVie: '50 à 80 ans',
    usage: 'Pavillons et longères de l’Essonne, plate ou mécanique selon le bâti.',
    legende: 'la plate se pose à deux par rang',
  },
  {
    key: 'zinc',
    nom: 'Zinc',
    dureeVie: '60 à 100 ans',
    usage: 'Gouttières, noues, faîtages, lucarnes, toitures à faible pente.',
    legende: 'soudé à l’étain, patiné en dix-huit mois',
  },
  {
    key: 'bac-acier',
    nom: 'Bac acier',
    dureeVie: '40 à 60 ans',
    usage: 'Extensions, ateliers, garages, toitures à pente très faible.',
    legende: 'le plus rapide à poser, le plus bruyant sous la pluie',
  },
];

/* Services ---------------------------------------------------------------- */

export interface Service {
  slug: string;
  titre: string;
  /** le mot du titre rendu en italique */
  accent: string;
  resume: string;
  detail: string;
  materiau: MateriauKey;
  index: string;
}

export const SERVICES: readonly Service[] = [
  {
    slug: 'couverture-neuve',
    titre: 'Couverture neuve',
    accent: 'neuve',
    resume: 'Charpente à nu, on pose l’écran, la volige, le matériau choisi et la zinguerie qui va avec.',
    detail:
      'Une couverture neuve se joue à la préparation : ventilation de la sous-toiture, écran sous toiture posé tendu, contre-lattage qui laisse respirer. Je pose ardoise, tuile plate ou mécanique, et je termine chaque rive et chaque faîtage moi-même.',
    materiau: 'tuile',
    index: '01',
  },
  {
    slug: 'refection-complete',
    titre: 'Réfection complète',
    accent: 'complète',
    resume: 'Dépose de l’ancienne couverture, contrôle de la charpente, remise à neuf du toit.',
    detail:
      'Avant de déposer, je photographie chaque versant et je sonde la charpente. Les pièces saines restent, les autres sont traitées ou remplacées. La maison reste habitée pendant les travaux : chaque soir, le toit est hors d’eau.',
    materiau: 'ardoise',
    index: '02',
  },
  {
    slug: 'zinguerie-gouttieres',
    titre: 'Zinguerie & gouttières',
    accent: 'gouttières',
    resume: 'Gouttières, descentes, noues, abergements de cheminée : tout ce qui conduit l’eau.',
    detail:
      'La zinguerie, c’est la moitié d’un toit qui dure. Je façonne les pièces à l’atelier, je soude à l’étain sur place, et je dimensionne les gouttières à la surface réelle de toiture, pas au catalogue.',
    materiau: 'zinc',
    index: '03',
  },
  {
    slug: 'demoussage-traitement',
    titre: 'Démoussage & traitement',
    accent: 'traitement',
    resume: 'Nettoyage basse pression, traitement anti-mousse, hydrofuge si le matériau le demande.',
    detail:
      'Le nettoyeur haute pression abîme les tuiles et décolle les ardoises. Je travaille à la brosse et à basse pression, puis j’applique un traitement qui agit sur six mois. L’hydrofuge n’est pas systématique : sur une ardoise saine, il ne sert à rien.',
    materiau: 'tuile',
    index: '04',
  },
  {
    slug: 'isolation-combles',
    titre: 'Isolation de combles',
    accent: 'combles',
    resume: 'Par l’extérieur (sarking) lors d’une réfection, ou par l’intérieur en combles perdus.',
    detail:
      'Quand on refait la couverture, isoler par l’extérieur ne coûte que le surcoût de l’isolant : la main-d’œuvre est déjà là. En combles perdus, je souffle de la laine minérale en veillant aux spots et à la ventilation.',
    materiau: 'bac-acier',
    index: '05',
  },
  {
    slug: 'recherche-de-fuite',
    titre: 'Recherche de fuite',
    accent: 'fuite',
    resume: 'Diagnostic sur le toit, pas depuis le jardin. Réparation le jour même quand c’est possible.',
    detail:
      'Une trace au plafond ne se trouve presque jamais à l’aplomb de la fuite. Je monte, je suis le chemin de l’eau, et je vous montre les photos avant de réparer. Solin décollé, tuile fendue, noue percée : les causes les plus fréquentes se règlent en une matinée.',
    materiau: 'zinc',
    index: '06',
  },
  {
    slug: 'apres-sinistre',
    titre: 'Intervention après sinistre',
    accent: 'sinistre',
    resume: 'Tempête, grêle, chute d’arbre : bâchage sous 24 h, rapport photo pour l’assurance.',
    detail:
      'Après une tempête, la priorité est de mettre hors d’eau. Je bâche, je sécurise ce qui menace de tomber, et je vous remets un rapport photo daté qui sert directement au dossier d’assurance. Le devis de réparation suit dans la semaine.',
    materiau: 'ardoise',
    index: '07',
  },
];

/* Valeurs dérivées ---------------------------------------------------------- */
export const ANNEES_EXPERIENCE = new Date().getFullYear() - ANNEE_CREATION;
export const TELEPHONE_HREF = `tel:+33${TELEPHONE.replace(/\s/g, '').replace(/^0/, '')}`;
export const ZONE_LABEL = `${VILLE} et sud ${DEPARTEMENT}, jusqu’à 30 km`;
