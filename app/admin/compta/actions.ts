"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function ajouterCharge(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) redirect("/connexion");
  const libelle = String(formData.get("libelle") || "").trim();
  const dateCharge = String(formData.get("date_charge") || "");
  const raw = String(formData.get("montant") || "0").replace(",", ".");
  const cents = Math.round(Number(raw) * 100);
  if (!libelle || !cents) redirect("/admin/compta?erreur=champs");
  const admin = createAdminClient();
  await admin.from("charges").insert({
    libelle,
    date_charge: dateCharge || new Date().toISOString().slice(0, 10),
    montant_cents: cents,
  });
  redirect("/admin/compta?ok=charge");
}
