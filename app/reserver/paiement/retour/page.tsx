import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { capturerCommandePaypal } from "@/lib/paiements/paypal";
import { finaliserApresPaiement } from "@/lib/notifications/confirmation";

export const metadata = { title: "Paiement" };

export default async function PaiementRetourPage({
  searchParams,
}: {
  searchParams: Promise<{ numero?: string; token?: string }>;
}) {
  const { numero, token } = await searchParams;
  const { user } = await getCurrentProfile();
  if (!user) redirect("/connexion");
  if (!numero) redirect("/mes-rendez-vous");

  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
    .select("*")
    .eq("numero", numero)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!reservation) redirect("/mes-rendez-vous");
  if (reservation.paiement_statut === "paye") {
    redirect(`/reserver/confirmation/${numero}?paye=1`);
  }

  const orderId = token || reservation.paiement_ref;
  if (!orderId) {
    redirect(`/reserver/confirmation/${numero}?erreur=paiement`);
  }

  try {
    const capture = await capturerCommandePaypal(orderId);
    const ok = capture.status === "COMPLETED" || capture.status === "APPROVED";
    if (!ok) {
      redirect(`/reserver/confirmation/${numero}?erreur=paiement`);
    }
    await admin
      .from("reservations")
      .update({
        paiement_statut: "paye",
        paiement_provider: "paypal",
        paiement_ref: capture.id || orderId,
        paye_at: new Date().toISOString(),
        statut: "confirmee",
      })
      .eq("id", reservation.id);
    await finaliserApresPaiement(reservation.id);
  } catch {
    redirect(`/reserver/confirmation/${numero}?erreur=paiement`);
  }

  redirect(`/reserver/confirmation/${numero}?paye=1`);
}
