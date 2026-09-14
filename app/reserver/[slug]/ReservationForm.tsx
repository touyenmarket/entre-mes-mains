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

  const [mois, setMois] = useState(() => {
    const first = creneaux[0] ? new Date(creneaux[0].debut_at) : new Date();
    return new Date(first.getFullYear(), first.getMonth(), 1);
  });
  const [jourActif, setJourActif] = useState<string | null>(null);

  const jourKey = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));

  const joursDispo = useMemo(() => {
    const s = new Set<string>();
    creneaux.forEach((c) => s.add(jourKey(c.debut_at)));
    return s;
  }, [creneaux]);

  const grouped = useMemo(() => {
    if (!jourActif) return creneaux;
    return creneaux.filter((c) => jourKey(c.debut_at) === jourActif);
  }, [creneaux, jourActif]);

  const cells = useMemo(() => {
    const start = new Date(mois.getFullYear(), mois.getMonth(), 1);
    const startPad = (start.getDay() + 6) % 7; // lundi = 0
    const daysInMonth = new Date(mois.getFullYear(), mois.getMonth() + 1, 0).getDate();
    const list: { key: string; day: number | null; dispo: boolean }[] = [];
    for (let i = 0; i < startPad; i++) list.push({ key: `e-${i}`, day: null, dispo: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${mois.getFullYear()}-${String(mois.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      list.push({ key, day: d, dispo: joursDispo.has(key) });
    }
    return list;
  }, [mois, joursDispo]);

  const moisLabel = mois.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

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

      <div className="glass-card space-y-4 rounded-2xl p-6">
        <p className="text-sm text-cream/70">Créneau</p>
        {creneaux.length === 0 && (
          <p className="text-sm text-cream/50">
            Aucun créneau libre pour ce format. Revenez plus tard, ou écrivez
            via la page Contact.
          </p>
        )}
        {creneaux.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMois(new Date(mois.getFullYear(), mois.getMonth() - 1, 1))}
                className="rounded-full border border-bronze/30 px-3 py-1 text-xs text-cream/70"
              >
                ←
              </button>
              <p className="font-serif text-lg capitalize text-cream">{moisLabel}</p>
              <button
                type="button"
                onClick={() => setMois(new Date(mois.getFullYear(), mois.getMonth() + 1, 1))}
                className="rounded-full border border-bronze/30 px-3 py-1 text-xs text-cream/70"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-cream/45">
              {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                <span key={`${d}-${i}`}>{d}</span>
              ))}
              {cells.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  disabled={!c.day || !c.dispo}
                  onClick={() => setJourActif(c.dispo ? c.key : null)}
                  className={[
                    "aspect-square rounded-lg text-sm",
                    !c.day ? "opacity-0" : "",
                    c.dispo
                      ? jourActif === c.key
                        ? "bg-bronze text-forest-deep font-semibold"
                        : "bg-bronze/35 text-glow font-semibold hover:bg-bronze/55"
                      : "text-cream/30",
                  ].join(" ")}
                >
                  {c.day || ""}
                </button>
              ))}
            </div>
            <p className="text-xs text-cream/45">
              Les jours en surbrillance ont au moins un créneau libre.
              {jourActif ? " Filtre actif — cliquez un autre jour, ou " : ""}
              {jourActif && (
                <button type="button" className="underline" onClick={() => setJourActif(null)}>
                  voir tous les créneaux
                </button>
              )}
            </p>
          </>
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
          {creneaux.length > 0 && grouped.length === 0 && (
            <p className="text-sm text-cream/50">Aucun créneau ce jour-là.</p>
          )}
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
