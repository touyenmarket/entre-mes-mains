import { redirect } from "next/navigation";
import Link from "next/link";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Détail transaction" };

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function ComptaDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; ref?: string }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    if (!gate.user) redirect("/connexion");
    redirect("/mes-rendez-vous");
  }
  const { type, ref } = await searchParams;
  if (!type || !ref) redirect("/admin/compta");

  const admin = createAdminClient();

  if (type === "document") {
    const { data: doc } = await admin
      .from("documents_manuels")
      .select("*")
      .eq("numero", ref)
      .maybeSingle();
    if (!doc) redirect("/admin/compta");
    return (
      <Container className="py-14">
        <Badge>Comptabilité</Badge>
        <h1 className="mt-5 font-serif text-4xl text-cream">
          {doc.kind === "devis" ? "Devis" : "Facture"} {doc.numero}
        </h1>
        <dl className="mt-8 space-y-3 text-sm text-cream/80">
          <p>Date : {String(doc.created_at).slice(0, 10)}</p>
          <p>Client : {doc.client_nom}</p>
          <p>Email : {doc.client_email || "—"}</p>
          <p>Adresse : {doc.client_adresse || "—"}</p>
          <p>Désignation : {doc.designation}</p>
          <p>Détail : {doc.details || "—"}</p>
          <p>Montant : {euros(doc.montant_ttc_cents)}</p>
          <p>Statut : {doc.statut}</p>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/api/documents/${doc.numero}`}>Télécharger le PDF</ButtonLink>
          <ButtonLink href="/admin/compta" variant="ghost">
            Retour au journal
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const { data: r } = await admin
    .from("reservations")
    .select(
      "*, prestations(label, type, format), creneaux(debut_at, format), profiles(prenom, nom, email, telephone)"
    )
    .eq("numero", ref)
    .maybeSingle();
  if (!r) redirect("/admin/compta");
  const pre = r.prestations as { label?: string; type?: string; format?: string } | null;
  const cr = r.creneaux as { debut_at?: string; format?: string } | null;
  const prof = r.profiles as {
    prenom?: string;
    nom?: string;
    email?: string;
    telephone?: string;
  } | null;

  return (
    <Container className="py-14">
      <Badge>Comptabilité</Badge>
      <h1 className="mt-5 font-serif text-4xl text-cream">Réservation {r.numero}</h1>
      <dl className="mt-8 space-y-3 text-sm text-cream/80">
        <p>Date paiement : {r.paye_at ? String(r.paye_at).slice(0, 16).replace("T", " ") : "—"}</p>
        <p>
          Client : {prof?.prenom} {prof?.nom}
        </p>
        <p>Email : {prof?.email || "—"}</p>
        <p>Téléphone : {prof?.telephone || "—"}</p>
        <p>Prestation : {pre?.label || "—"}</p>
        <p>Créneau : {cr?.debut_at ? String(cr.debut_at).replace("T", " ").slice(0, 16) : "—"}</p>
        <p>Format : {cr?.format || pre?.format || "—"}</p>
        <p>Statut réservation : {r.statut}</p>
        <p>
          Paiement : {r.paiement_statut} · {r.paiement_provider || "—"}
        </p>
        <p>Base : {euros(r.base_cents || 0)}</p>
        <p>Supplément km : {euros(r.supplement_km_cents || 0)}</p>
        <p>Total : {euros(r.total_cents || 0)}</p>
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        {r.paiement_statut === "paye" && (
          <ButtonLink href={`/api/facture/${r.numero}`}>Facture PDF</ButtonLink>
        )}
        <ButtonLink href="/admin/compta" variant="ghost">
          Retour au journal
        </ButtonLink>
      </div>
    </Container>
  );
}
