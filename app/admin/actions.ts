"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FormatPrestation, StatutCreneau } from "@/lib/supabase/types";

export async function creerCreneau(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) return { error: "Accès réservé à la praticienne." };

  const debutLocal = String(formData.get("debut") || "");
  const dureeMin = Number(formData.get("duree") || 60);
  const format = String(formData.get("format") || "visio") as FormatPrestation;
  const capacite = Number(formData.get("capacite") || 1);
  const prestationId = String(formData.get("prestation_id") || "");
  const note = String(formData.get("note") || "").trim();

  if (!debutLocal) return { error: "Indiquez le début du créneau." };

  const debut = new Date(debutLocal);
  if (Number.isNaN(debut.getTime())) return { error: "Date invalide." };
  const fin = new Date(debut.getTime() + dureeMin * 60 * 1000);

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
