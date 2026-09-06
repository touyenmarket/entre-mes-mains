"use client";

import { useMemo, useState } from "react";
import { creerReservation } from "../actions";
import { supplementKm, ZONE_FRANCHE_KM, TARIF_KM_EUR } from "@/lib/tarification";
import { euros, formatDateHeure } from "@/lib/dates";
import type { Creneau, Prestation } from "@/lib/supabase/types";

export default function ReservationForm({
  prestation,
  creneaux,
  prenom,
  nom,
  telephone,
}: {
  prestation: Prestation;
  creneaux: Creneau[];
  prenom: string;
  nom: string;
  telephone: string;
}) {
  const [adresse, setAdresse] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [calcStatus, setCalcStatus] = useState("");
  const [status, setStatus] = useState("");
  const km = distance ?? 0;
  const supp = prestation.km_applicable ? supplementKm(km) : 0;
  const totalCents = prestation.prix_base_cents + Math.round(supp * 100);

  async function calculerDistance(value: string) {
    if (!prestation.km_applicable) return;
    const trimmed = value.trim();
    if (trimmed.length < 8) {
      setDistance(null);
      setCalcStatus("");
      return;
    }
    setCalcStatus("Calcul de l’itinéraire…");
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adresse: trimmed }),
      });
      const data = (await res.json()) as {
        distance_km?: number;
        error?: string;
      };
      if (!res.ok || data.error || data.distance_km == null) {
        setDistance(null);
        setCalcStatus(data.error || "Adresse introuvable.");
        return;
      }
      setDistance(data.distance_km);
      setCalcStatus(`Trajet calculé : ${data.distance_km} km depuis Sancheville.`);
    } catch {
      setDistance(null);
      setCalcStatus("Impossible de calculer la distance pour le moment.");
    }
  }

  const grouped = useMemo(() => {
    return creneaux;
  }, [creneaux]);

  async function onSubmit(formData: FormData) {
    setStatus("Enregistrement…");
    const res = await creerReservation(formData);
    if (res && "error" in res && res.error) setStatus(res.error);
  }

  return (
    <form action={onSubmit} className="mt-8 space-y-6">
      <input type="hidden" name="prestation_id" value={prestation.id} />

      <div className="glass-card space-y-3 rounded-2xl p-6">
        <p className="text-sm text-cream/70">Vos coordonnées</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="prenom"
            defaultValue={prenom}
            required
            placeholder="Prénom"
            className="rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
          />
          <input
            name="nom"
            defaultValue={nom}
            required
            placeholder="Nom"
            className="rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
          />
          <input
            name="telephone"
            defaultValue={telephone}
            placeholder="Téléphone (optionnel)"
            className="rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream sm:col-span-2"
          />
        </div>
      </div>

      {prestation.km_applicable && (
        <div className="glass-card space-y-3 rounded-2xl p-6">
          <p className="text-sm font-semibold text-cream">Massage à domicile</p>
          <p className="text-sm text-cream/55">
            Déplacement au départ de Sancheville (entre Chartres et
            Châteaudun). {ZONE_FRANCHE_KM} km inclus, puis{" "}
            {TARIF_KM_EUR.toFixed(2).replace(".", ",")} €/km.
          </p>
          <input
            name="adresse"
            required
            value={adresse}
            onChange={(e) => {
              setAdresse(e.target.value);
              setDistance(null);
            }}
            onBlur={() => calculerDistance(adresse)}
            placeholder="N°, rue, code postal, ville"
            className="w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
          />
          <input type="hidden" name="distance_km" value={km} />
          <p className="text-sm text-cream/55">{calcStatus}</p>
          {distance != null && (
            <p className="text-sm text-cream/70">
              Séance {euros(prestation.prix_base_cents)} + supplément km{" "}
              {supp.toFixed(2).replace(".", ",")} € ={" "}
              <span className="text-glow">{euros(totalCents)}</span>
            </p>
          )}
        </div>
      )}

      <div className="glass-card space-y-3 rounded-2xl p-6">
        <p className="text-sm text-cream/70">Créneau</p>
        {grouped.length === 0 && (
          <p className="text-sm text-cream/50">
            Aucun créneau libre pour ce format. Revenez plus tard, ou écrivez
            via la page Contact.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {grouped.map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-bronze/25 px-3 py-2 text-sm text-cream/80"
            >
              <input type="radio" name="creneau_id" value={c.id} required />
              {formatDateHeure(c.debut_at)}
              {c.capacite > 1
                ? ` · ${c.capacite - c.places_prises} place(s)`
                : ""}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-cream/65">
        <input type="checkbox" name="consentement" required className="mt-1" />
        <span>
          J’accepte que mes coordonnées (et l’adresse si déplacement) soient
          utilisées pour organiser le rendez-vous et la facture. Ces données
          peuvent constituer des données de santé. Elles ne sont ni vendues ni
          utilisées à des fins publicitaires.
        </span>
      </label>

      <p className="font-serif text-2xl text-cream">
        Total : {euros(totalCents)}
      </p>
      <p className="text-xs text-cream/45">
        Paiement en ligne à l’étape suivante. Pour l’instant la réservation est
        enregistrée sans encaissement.
      </p>

      <button
        type="submit"
        disabled={
          grouped.length === 0 ||
          (prestation.km_applicable && distance == null)
        }
        className="rounded-full bg-bronze px-6 py-3 text-sm font-semibold text-forest-deep hover:bg-glow disabled:opacity-50"
      >
        Confirmer la réservation
      </button>
      {status && <p className="text-sm text-glow">{status}</p>}
    </form>
  );
}
