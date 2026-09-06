"use client";

import { useState } from "react";
import { creerCreneau } from "./actions";
import type { Prestation } from "@/lib/supabase/types";

export default function NouveauCreneauForm({
  prestations,
}: {
  prestations: Prestation[];
}) {
  const [status, setStatus] = useState<string>("");

  async function onSubmit(formData: FormData) {
    setStatus("Enregistrement…");
    const res = await creerCreneau(formData);
    if (res && "error" in res && res.error) {
      setStatus(res.error);
      return;
    }
    setStatus("Créneau ajouté.");
    (document.getElementById("form-creneau") as HTMLFormElement | null)?.reset();
  }

  return (
    <form id="form-creneau" action={onSubmit} className="glass-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
      <label className="text-sm text-cream/70">
        Date
        <input
          name="date"
          type="date"
          required
          className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-cream/70">
          Heure
          <select
            name="heure"
            defaultValue="10"
            className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
          >
            {Array.from({ length: 13 }, (_, i) => i + 8).map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")} h
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-cream/70">
          Minutes
          <select
            name="minute"
            defaultValue="00"
            className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
          >
            <option value="0">00</option>
            <option value="30">30</option>
          </select>
        </label>
      </div>
      <label className="text-sm text-cream/70">
        Durée (minutes)
        <input
          name="duree"
          type="number"
          min={15}
          defaultValue={60}
          className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
        />
      </label>
      <label className="text-sm text-cream/70">
        Format
        <select
          name="format"
          className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
        >
          <option value="visio">Visio</option>
          <option value="domicile">Domicile</option>
          <option value="presentiel">Présentiel / collectif</option>
        </select>
      </label>
      <label className="text-sm text-cream/70">
        Capacité
        <input
          name="capacite"
          type="number"
          min={1}
          defaultValue={1}
          className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
        />
      </label>
      <label className="text-sm text-cream/70 sm:col-span-2">
        Lier à une prestation (optionnel)
        <select
          name="prestation_id"
          className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
        >
          <option value="">Toutes les prestations de ce format</option>
          {prestations.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} ({p.format})
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm text-cream/70 sm:col-span-2">
        Note interne
        <input
          name="note"
          className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream"
        />
      </label>
      <div className="sm:col-span-2 flex items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-bronze px-5 py-2.5 text-sm font-semibold text-forest-deep hover:bg-glow"
        >
          Ajouter le créneau
        </button>
        {status && <p className="text-sm text-glow">{status}</p>}
      </div>
    </form>
  );
}
