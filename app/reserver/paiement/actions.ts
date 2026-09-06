"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { creerCommandePaypal, isPaypalEnabled } from "@/lib/paiements/paypal";

export async function lancerPaiementPaypal(formData: FormData) {
  const numero = String(formData.get("numero") || "");
  if (!numero) return { error: "Réservation introuvable." };

  const { user } = await getCurrentProfile();
  if (!user) redirect("/connexion");

  if (!isPaypalEnabled()) {
    return { error: "PayPal n’est pas encore configuré sur l’hébergement." };
  }

  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
    .select("*, prestations(label)")
    .eq("numero", numero)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!reservation) return { error: "Réservation introuvable." };
  if (reservation.paiement_statut === "paye") {
    redirect(`/reserver/confirmation/${numero}`);
  }

  const label =
    (reservation.prestations as { label?: string } | null)?.label ||
    `Réservation ${numero}`;

  const order = await creerCommandePaypal({
    numero,
    totalCents: reservation.total_cents,
    label,
  });

  await admin
    .from("reservations")
    .update({
      paiement_provider: "paypal",
      paiement_ref: order.id,
    })
    .eq("id", reservation.id);

  redirect(order.approveUrl);
}
