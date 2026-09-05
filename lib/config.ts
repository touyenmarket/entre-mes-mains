/**
 * Configuration du site — source unique de vérité pour les textes communs.
 * TODO avant mise en ligne : compléter les coordonnées définitives.
 */
export const SITE = {
  name: "Entre mes mains",
  tagline: "Naturopathie & massage bien-être",
  description:
    "Consultations de naturopathie en visio, massages bien-être à domicile et atelier de langue des signes pour bébé.",
  email: "Entremesmains28@gmail.com",
  city: "Sancheville (28)",
  region: "Centre-Val de Loire",
  /** Adresse professionnelle (pages légales + contact). */
  adresse: "7 rue de Champfroid, 28800 Sancheville",
  /** Point de départ du calcul kilométrique. */
  adresseBase: "Mon domicile — entre Chartres et Châteaudun (28)",
  /** Responsable (pages légales). */
  responsable: "Katia Trichard",
};

export const NAV_LINKS = [
  { href: "/naturopathie", label: "Naturopathie" },
  { href: "/massages", label: "Massages" },
  { href: "/atelier-lsf", label: "Atelier LSF" },
  { href: "/mes-rendez-vous", label: "Mes rendez-vous", soon: true },
  { href: "/contact", label: "Contact" },
] as const;
