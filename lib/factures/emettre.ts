import { createAdminClient } from "@/lib/supabase/admin";

export async function emettreFactureSiBesoin(reservationId: string) {
  const admin = createAdminClient();
  const { data: existante } = await admin
    .from("factures")
    .select("*")
    .eq("reservation_id", reservationId)
    .maybeSingle();
  if (existante) return existante;

  const annee = new Date().getFullYear();
  const { count } = await admin
    .from("factures")
    .select("id", { count: "exact", head: true });
  const seq = String((count || 0) + 1).padStart(3, "0");
  const numero = `${annee}-${seq}`;

  const { data: reservation } = await admin
    .from("reservations")
    .select("total_cents")
    .eq("id", reservationId)
    .maybeSingle();

  const { data: facture, error } = await admin
    .from("factures")
    .insert({
      reservation_id: reservationId,
      numero,
      montant_ttc_cents: reservation?.total_cents || 0,
      statut: "emise",
      mentions: {
        tva: "293 B CGI",
        paiement: "paypal",
      },
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return facture;
}
