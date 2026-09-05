/**
 * Types TypeScript alignés sur le schéma SQL.
 * Générables plus tard via `supabase gen types typescript`.
 */

export type RoleUtilisateur = "patient" | "admin";
export type TypePrestation = "naturo" | "massage" | "atelier";
export type FormatPrestation = "visio" | "domicile" | "presentiel";
export type StatutCreneau = "libre" | "reserve" | "bloque";
export type StatutReservation =
  | "en_attente"
  | "confirmee"
  | "terminee"
  | "annulee";
export type StatutPaiement = "non_paye" | "paye" | "rembourse";
export type ProviderPaiement = "paypal" | "wero" | "stripe" | "demo";

export interface Profile {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  telephone: string | null;
  role: RoleUtilisateur;
  consentement_rgpd_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Prestation {
  id: string;
  slug: string;
  label: string;
  description: string;
  type: TypePrestation;
  format: FormatPrestation;
  duree_min: number;
  prix_base_cents: number;
  km_applicable: boolean;
  visio_auto: boolean;
  capacite: number;
  forfait_seances: number | null;
  lsf: boolean;
  actif: boolean;
  position: number;
}

export interface Creneau {
  id: string;
  debut_at: string;
  fin_at: string;
  format: FormatPrestation;
  capacite: number;
  places_prises: number;
  statut: StatutCreneau;
  prestation_id: string | null;
  note_admin: string | null;
}

export interface AdresseSnapshot {
  rue?: string;
  ville?: string;
  code_postal?: string;
  lat?: number;
  lng?: number;
  distance_km?: number;
  libelle?: string;
}

export interface Reservation {
  id: string;
  numero: string;
  profile_id: string;
  prestation_id: string;
  creneau_id: string;
  statut: StatutReservation;
  base_cents: number;
  supplement_km_cents: number;
  distance_km: number | null;
  total_cents: number;
  adresse_snapshot: AdresseSnapshot | null;
  visio_lien: string | null;
  paiement_statut: StatutPaiement;
  paiement_provider: ProviderPaiement | null;
  paiement_ref: string | null;
  paye_at: string | null;
  expire_at: string | null;
  annulee_at: string | null;
  created_at: string;
}

export interface Setting {
  cle: string;
  valeur: unknown;
}
