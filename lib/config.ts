/**
 * Configuration du site — source unique de vérité pour les textes communs.
 * TODO avant mise en ligne : compléter les coordonnées définitives.
 */
export const SITE = {
  name: "Entre mes mains",
  tagline: "Naturopathie · massages · bébé signes",
  description:
    "Consultations de naturopathie en visio, massages bien-être à domicile et atelier de langue des signes pour bébé.",
  email: "entremesmains28@gmail.com",
  /** Compte PayPal Pro qui encaisse les paiements. */
  paypalEmail: "entremesmains28@gmail.com",
  city: "Sancheville (28)",
  region: "Centre-Val de Loire",
  /** Adresse professionnelle (pages légales + contact). */
  adresse: "Sancheville, 28800",
  adresseFacture: "7 rue de Champfroid, 28800 Sancheville",
  siret: "889 059 218 00012",
  iban: "FR76 1027 8375 7000 0106 7120 171",
  titulaireIban: "Trichard Katia",
  /** Point de départ du calcul kilométrique. */
  adresseBase: "Mon domicile — entre Chartres et Châteaudun (28)",
  /** Responsable (pages légales). */
  responsable: "Katia Trichard",
};

/** Offres phares — mises en avant dans le header. */
export const OFFER_LINKS = [
  { href: "/naturopathie", label: "Naturopathie" },
  { href: "/massages", label: "Massages" },
  { href: "/atelier-lsf", label: "Bébé signes" },
] as const;

/** Espace / contact — secondaires. */
export const TOOL_LINKS = [
  { href: "/mes-rendez-vous", label: "Mes rendez-vous" },
  { href: "/connexion", label: "Connexion" },
  { href: "/contact", label: "Contact" },
] as const;

export const NAV_LINKS = [...OFFER_LINKS, ...TOOL_LINKS] as const;
