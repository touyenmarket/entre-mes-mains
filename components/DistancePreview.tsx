"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { SITE } from "@/lib/config";
import {
  ZONE_FRANCHE_KM,
  TARIF_KM_EUR,
  supplementKm,
  kmFactures,
} from "@/lib/tarification";

const fmt = (n: number) =>
  n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Aperçu du supplément kilométrique (à titre indicatif).
 * Utilise la même règle métier que le futur parcours de réservation
 * (lib/tarification.ts), où la distance sera calculée automatiquement
 * depuis l'adresse saisie par le patient.
 */
export default function DistancePreview() {
  const [km, setKm] = useState(12);
  const supplement = supplementKm(km);
  const kmSupp = kmFactures(km);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-sm text-cream/80">
          <MapPin size={15} className="text-bronze" />
          Distance depuis {SITE.adresseBase} :{" "}
          <b className="text-cream">{km} km</b>
        </p>
        <p className="text-right text-sm">
          {supplement === 0 ? (
            <span className="font-semibold text-sage">Inclus</span>
          ) : (
            <span className="font-semibold text-glow">
              + {fmt(supplement)} €
            </span>
          )}
        </p>
      </div>

      <input
        type="range"
        min={0}
        max={60}
        value={km}
        onChange={(e) => setKm(Number(e.target.value))}
        className="mt-4 w-full"
        aria-label="Distance en kilomètres"
      />

      <div className="mt-3 flex justify-between text-[11px] text-cream/40">
        <span>0 km</span>
        <span>{ZONE_FRANCHE_KM} km — zone franche</span>
        <span>60 km</span>
      </div>

      <p className="mt-5 rounded-xl bg-bronze/10 px-4 py-3 text-xs leading-relaxed text-cream/70">
        {supplement === 0 ? (
          <>
            <b className="text-sage">Aucun supplément</b> : votre adresse est
            dans les {ZONE_FRANCHE_KM} km inclus.
          </>
        ) : (
          <>
            {ZONE_FRANCHE_KM} km inclus + {kmSupp} km supplémentaires →{" "}
            {fmt(TARIF_KM_EUR)} €/km →{" "}
            <b className="text-glow">
              + {kmSupp} × {fmt(TARIF_KM_EUR)} € = {fmt(supplement)} €
            </b>
          </>
        )}
      </p>

      <p className="mt-3 text-[11px] text-cream/40">
        Lors de la réservation, le supplément sera calculé automatiquement
        depuis votre adresse exacte.
      </p>
    </div>
  );
}
