import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { emettreFactureSiBesoin } from "@/lib/factures/emettre";
import { genererPdfFacture } from "@/lib/factures/pdf";
import { formatDateHeure } from "@/lib/dates";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ numero: string }> }
) {
  const { numero } = await ctx.params;
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    return NextResponse.redirect(new URL("/connexion", _req.url));
  }

  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
    .select("*, prestations(label), creneaux(debut_at), profiles(prenom, nom, email)")
    .eq("numero", numero)
    .maybeSingle();

  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  }
  if (reservation.profile_id !== user.id && profile?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  if (reservation.paiement_statut !== "paye") {
    return NextResponse.json(
      { error: "La facture est disponible après paiement." },
      { status: 409 }
    );
  }

  const facture = await emettreFactureSiBesoin(reservation.id);
  const pre = reservation.prestations as { label?: string } | null;
  const cr = reservation.creneaux as { debut_at?: string } | null;
  const dest = reservation.profiles as {
    prenom?: string;
    nom?: string;
    email?: string;
  } | null;
  const adresse =
    reservation.adresse_snapshot &&
    typeof reservation.adresse_snapshot === "object"
      ? (reservation.adresse_snapshot as { libelle?: string }).libelle
      : null;

  const bytes = await genererPdfFacture({
    numeroFacture: facture.numero,
    numeroReservation: reservation.numero,
    dateEmission: new Date(facture.created_at).toLocaleDateString("fr-FR"),
    clientNom: `${dest?.prenom || ""} ${dest?.nom || ""}`.trim() || "Client",
    clientEmail: dest?.email || user.email || "",
    clientAdresse: adresse,
    prestationLabel: pre?.label || "Prestation",
    creneauLabel: cr?.debut_at ? formatDateHeure(cr.debut_at) : "",
    baseCents: reservation.base_cents,
    supplementKmCents: reservation.supplement_km_cents,
    distanceKm: reservation.distance_km,
    totalCents: reservation.total_cents,
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${facture.numero}.pdf"`,
    },
  });
}
