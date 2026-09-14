"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { parisLocalToIso } from "@/lib/dates";
import type { FormatPrestation, StatutCreneau } from "@/lib/supabase/types";

function bornesDepuisForm(formData: FormData) {
  const date = String(formData.get("date") || "");
  const heure = Number(formData.get("heure") || 10);
  const minute = Number(formData.get("minute") || 0);
  const finHeureRaw = formData.get("fin_heure");
  const finMinuteRaw = formData.get("fin_minute");
  const dureeMin = Number(formData.get("duree") || 60);

  if (!date) return { error: "Indiquez la date du créneau." as const };

  const debutIso = parisLocalToIso(date, heure, minute);
  const debut = new Date(debutIso);
  if (Number.isNaN(debut.getTime())) return { error: "Date invalide." as const };

  let fin: Date;
  if (finHeureRaw != null && String(finHeureRaw) !== "") {
    const fh = Number(finHeureRaw);
    const fm = Number(finMinuteRaw || 0);
    const finIso = parisLocalToIso(date, fh, fm);
    fin = new Date(finIso);
    if (fin.getTime() <= debut.getTime()) {
      return { error: "L’heure de fin doit être après l’heure de début." as const };
    }
  } else {
    fin = new Date(debut.getTime() + Math.max(15, dureeMin) * 60 * 1000);
  }
  return { debut, fin };
}

export async function creerCreneau(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: "Accès réservé à la praticienne." };

  const format = String(formData.get("format") || "visio") as FormatPrestation;
  const capacite = Number(formData.get("capacite") || 1);
  const prestationId = String(formData.get("prestation_id") || "");
  const note = String(formData.get("note") || "").trim();

  const bornes = bornesDepuisForm(formData);
  if ("error" in bornes) return { error: bornes.error };
  const { debut, fin } = bornes;

  const admin = createAdminClient();
  const { error } = await admin.from("creneaux").insert({
    debut_at: debut.toISOString(),
    fin_at: fin.toISOString(),
    format,
    capacite: Math.max(1, capacite),
    places_prises: 0,
    statut: "libre",
    prestation_id: prestationId || null,
    note_admin: note || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/reserver");
  return { ok: true };
}

export async function modifierCreneau(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: "Accès refusé." };

  const id = String(formData.get("id") || "");
  const format = String(formData.get("format") || "visio") as FormatPrestation;
  const capacite = Number(formData.get("capacite") || 1);
  const note = String(formData.get("note") || "").trim();

  if (!id) return { error: "Créneau incomplet." };
  const bornes = bornesDepuisForm(formData);
  if ("error" in bornes) return { error: bornes.error };
  const { debut, fin } = bornes;

  const admin = createAdminClient();
  const { error } = await admin
    .from("creneaux")
    .update({
      debut_at: debut.toISOString(),
      fin_at: fin.toISOString(),
      format,
      capacite: Math.max(1, capacite),
      note_admin: note || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/reserver");
  return { ok: true };
}

export async function supprimerCreneau(id: string) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: "Accès refusé." };

  const admin = createAdminClient();
  const { data: resas } = await admin
    .from("reservations")
    .select("id")
    .eq("creneau_id", id)
    .neq("statut", "annulee")
    .limit(1);

  if (resas && resas.length > 0) {
    return { error: "Impossible : une réservation est liée à ce créneau. Annulez-la d’abord ou bloquez le créneau." };
  }

  const { error } = await admin.from("creneaux").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/reserver");
  return { ok: true };
}

export async function changerStatutCreneau(id: string, statut: StatutCreneau) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: "Accès refusé." };

  const admin = createAdminClient();
  const patch: Record<string, unknown> = { statut };
  if (statut === "libre") patch.places_prises = 0;

  const { error } = await admin.from("creneaux").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin");
  revalidatePath("/reserver");
  return { ok: true };
}
