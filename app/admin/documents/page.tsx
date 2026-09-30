import { redirect } from "next/navigation";
import Link from "next/link";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import DocumentForm from "./DocumentForm";
import { transformerDevisEnFacture } from "./actions";

export const metadata = { title: "Devis & factures" };

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    if (!gate.user) redirect("/connexion");
    redirect("/mes-rendez-vous");
  }
  const sp = await searchParams;
  const admin = createAdminClient();
  const { data: docs } = await admin
    .from("documents_manuels")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <Container className="py-14 sm:py-20">
      <Badge>Back-office</Badge>
      <h1 className="mt-5 font-serif text-4xl text-cream">Devis & factures</h1>
      <p className="mt-3 max-w-xl text-[15px] text-cream/65">
        Création manuelle pour une crèche, une entreprise ou une prestation
        spéciale. Hors du parcours réservation en ligne.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <ButtonLink href="/admin" variant="ghost">
          Calendrier
        </ButtonLink>
        <ButtonLink href="/admin/compta" variant="ghost">
          Comptabilité
        </ButtonLink>
      </div>
      {sp.ok && (
        <p className="mt-4 text-sm text-glow">Document {sp.ok} enregistré.</p>
      )}
      {sp.erreur && (
        <p className="mt-4 text-sm text-glow">Impossible d’enregistrer ({sp.erreur}).</p>
      )}
      <DocumentForm />

      <h2 className="mt-12 font-serif text-2xl text-cream">Derniers documents</h2>
      <div className="mt-4 space-y-3">
        {(docs || []).length === 0 && (
          <p className="text-sm text-cream/50">Aucun document pour le moment.</p>
        )}
        {(docs || []).map((d) => (
          <div
            key={d.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-bronze/15 px-4 py-3 text-sm text-cream/80"
          >
            <div>
              <span className="font-semibold text-cream">{d.numero}</span>
              {" · "}
              {d.kind} · {d.client_nom} ·{" "}
              {(d.montant_ttc_cents / 100).toFixed(2)} €
              <span className="ml-2 text-cream/45">{d.statut}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/api/documents/${d.numero}`}
                className="text-bronze hover:text-glow"
              >
                PDF
              </Link>
              {d.kind === "devis" && d.statut !== "transforme" && (
                <form action={transformerDevisEnFacture}>
                  <input type="hidden" name="id" value={d.id} />
                  <button className="text-bronze hover:text-glow" type="submit">
                    → Facture
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
