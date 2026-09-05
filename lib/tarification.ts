/**
 * Règle de tarification kilométrique — validée avec la praticienne.
 *
 *   15 km inclus (zone franche),
 *   au-delà : + 0,55 € par kilomètre parcouru.
 *
 * À terme, ces valeurs seront paramétrables dans le back-office
 * (table `settings`) — cf. docs/architecture.md §4.
 */
export const ZONE_FRANCHE_KM = 15;
export const TARIF_KM_CENTS = 55; // 0,55 € / km au-delà de la zone franche
export const TARIF_KM_EUR = TARIF_KM_CENTS / 100;

/** Supplément kilométrique en euros pour une distance donnée. */
export function supplementKm(distanceKm: number): number {
  if (distanceKm <= ZONE_FRANCHE_KM) return 0;
  return Math.round((distanceKm - ZONE_FRANCHE_KM) * TARIF_KM_CENTS) / 100;
}

/** Kilomètres facturés (au-delà de la zone franche). */
export function kmFactures(distanceKm: number): number {
  if (distanceKm <= ZONE_FRANCHE_KM) return 0;
  return distanceKm - ZONE_FRANCHE_KM;
}

/** Prix total = base + supplément kilométrique. */
export function totalAvecKm(prixBase: number, distanceKm: number): number {
  return prixBase + supplementKm(distanceKm);
}
