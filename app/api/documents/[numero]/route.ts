import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { genererPdfFacture } from "@/lib/factures/pdf";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ numero: string }> }
) {
  const { numero } = await ctx.params;
  const { user, profile } = await getCurrentProfile();
  if (!user || profile?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: doc } = await admin
    .from("documents_manuels")
    .select("*")
    .eq("numero", numero)
    .maybeSingle();
  if (!doc) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  const bytes = await genererPdfFacture({
    numeroFacture: doc.numero,
    numeroReservation: "",
    dateEmission: new Date(doc.created_at).toLocaleDateString("fr-FR"),
    clientNom: doc.client_nom,
    clientEmail: doc.client_email || "",
    clientAdresse: doc.client_adresse,
    prestationLabel: doc.designation,
    creneauLabel: doc.details || "",
    baseCents: doc.montant_ht_cents || doc.montant_ttc_cents,
    supplementKmCents: 0,
    distanceKm: null,
    totalCents: doc.montant_ttc_cents,
    kind: doc.kind,
    tvaMention: doc.tva_mention,
    paiementMention: doc.paiement_mention,
    tvaCents: doc.tva_cents,
    lignes: Array.isArray(doc.lignes) ? doc.lignes : undefined,
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${doc.kind}-${doc.numero}.pdf"`,
    },
  });
}
