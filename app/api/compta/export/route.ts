import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const { user, profile } = await getCurrentProfile();
  if (!user || profile?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const url = new URL(req.url);
  const debut = url.searchParams.get("debut") || "2000-01-01";
  const fin = url.searchParams.get("fin") || "2099-12-31";
  const debutIso = `${debut}T00:00:00.000Z`;
  const finIso = `${fin}T23:59:59.999Z`;
  const admin = createAdminClient();

  const [{ data: reservations }, { data: manuels }, { data: charges }] =
    await Promise.all([
      admin
        .from("reservations")
        .select("numero, paye_at, created_at, total_cents, paiement_provider, prestations(label)")
        .eq("paiement_statut", "paye")
        .gte("paye_at", debutIso)
        .lte("paye_at", finIso),
      admin
        .from("documents_manuels")
        .select("numero, created_at, client_nom, designation, montant_ttc_cents")
        .eq("kind", "facture")
        .gte("created_at", debutIso)
        .lte("created_at", finIso),
      admin
        .from("charges")
        .select("date_charge, libelle, montant_cents")
        .gte("date_charge", debut)
        .lte("date_charge", fin),
    ]);

  const rows = [["date", "type", "piece", "libelle", "mode", "montant_eur"]];
  for (const r of reservations || []) {
    const label = (r.prestations as { label?: string } | null)?.label || "Réservation";
    rows.push([
      String(r.paye_at || r.created_at).slice(0, 10),
      "recette",
      r.numero,
      label,
      String(r.paiement_provider || ""),
      String((r.total_cents || 0) / 100),
    ]);
  }
  for (const d of manuels || []) {
    rows.push([
      String(d.created_at).slice(0, 10),
      "recette",
      d.numero,
      `${d.client_nom} — ${d.designation}`,
      "manuel",
      String((d.montant_ttc_cents || 0) / 100),
    ]);
  }
  for (const c of charges || []) {
    rows.push([
      String(c.date_charge),
      "charge",
      "",
      c.libelle,
      "",
      String(-(c.montant_cents || 0) / 100),
    ]);
  }

  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="compta-${debut}-${fin}.csv"`,
    },
  });
}
