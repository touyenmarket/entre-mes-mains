"use client";

import { useState } from "react";
import { modifierCreneau, supprimerCreneau, changerStatutCreneau } from "./actions";
import { formatDateHeure } from "@/lib/dates";
import type { Creneau } from "@/lib/supabase/types";

function partsFromIso(iso: string) {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("fr-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));
  const fin = new Date(iso);
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    heure: Number(parts.hour),
    minute: Number(parts.minute) >= 30 ? 30 : 0,
  };
}

export default function CreneauAdminRow({ creneau }: { creneau: Creneau }) {
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");
  const init = partsFromIso(creneau.debut_at);
  const duree = Math.max(
    15,
    Math.round((new Date(creneau.fin_at).getTime() - new Date(creneau.debut_at).getTime()) / 60000),
  );

  async function onSave(formData: FormData) {
    setMsg("Enregistrement…");
    const res = await modifierCreneau(formData);
    if (res && "error" in res && res.error) {
      setMsg(res.error);
      return;
    }
    setMsg("Modifié.");
    setEdit(false);
  }

  async function onDelete() {
    if (!confirm("Supprimer ce créneau ?")) return;
    setMsg("Suppression…");
    const res = await supprimerCreneau(creneau.id);
    if (res && "error" in res && res.error) setMsg(res.error);
  }

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-cream">{formatDateHeure(creneau.debut_at)}</p>
          <p className="text-sm text-cream/50">
            {creneau.format} · {creneau.places_prises}/{creneau.capacite} · {creneau.statut}
            {creneau.note_admin ? ` · ${creneau.note_admin}` : ""}
          </p>
          {msg && <p className="mt-1 text-xs text-glow">{msg}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEdit((v) => !v)}
            className="rounded-full border border-bronze/40 px-3 py-1 text-xs text-cream/80 hover:text-glow"
          >
            {edit ? "Fermer" : "Modifier"}
          </button>
          {creneau.statut !== "bloque" && (
            <form
              action={async () => {
                await changerStatutCreneau(creneau.id, "bloque");
              }}
            >
              <button type="submit" className="rounded-full border border-bronze/40 px-3 py-1 text-xs text-cream/80 hover:text-glow">
                Bloquer
              </button>
            </form>
          )}
          {creneau.statut !== "libre" && (
            <form
              action={async () => {
                await changerStatutCreneau(creneau.id, "libre");
              }}
            >
              <button type="submit" className="rounded-full border border-bronze/40 px-3 py-1 text-xs text-cream/80 hover:text-glow">
                Libérer
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-200/80 hover:text-red-100"
          >
            Supprimer
          </button>
        </div>
      </div>

      {edit && (
        <form action={onSave} className="mt-4 grid gap-3 border-t border-bronze/20 pt-4 sm:grid-cols-4">
          <input type="hidden" name="id" value={creneau.id} />
          <label className="text-xs text-cream/70">
            Date
            <input name="date" type="date" defaultValue={init.date} required className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream" />
          </label>
          <label className="text-xs text-cream/70">
            Heure
            <select name="heure" defaultValue={init.heure} className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream">
              {Array.from({ length: 13 }, (_, i) => i + 8).map((h) => (
                <option key={h} value={h}>{String(h).padStart(2, "0")} h</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-cream/70">
            Minutes
            <select name="minute" defaultValue={init.minute} className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream">
              <option value="0">00</option>
              <option value="30">30</option>
            </select>
          </label>
          <label className="text-xs text-cream/70">
            Durée
            <input name="duree" type="number" min={15} defaultValue={duree} className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream" />
          </label>
          <label className="text-xs text-cream/70">
            Format
            <select name="format" defaultValue={creneau.format} className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream">
              <option value="visio">Visio</option>
              <option value="domicile">Domicile</option>
              <option value="presentiel">Présentiel</option>
            </select>
          </label>
          <label className="text-xs text-cream/70">
            Capacité
            <input name="capacite" type="number" min={1} defaultValue={creneau.capacite} className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream" />
          </label>
          <label className="text-xs text-cream/70 sm:col-span-2">
            Note
            <input name="note" defaultValue={creneau.note_admin || ""} className="mt-1 w-full rounded-xl border border-bronze/30 bg-forest-deep/60 px-3 py-2 text-cream" />
          </label>
          <div className="sm:col-span-4">
            <button type="submit" className="rounded-full bg-bronze px-4 py-2 text-xs font-semibold text-forest-deep">
              Enregistrer
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
