import { redirect } from "next/navigation";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { ajouterCharge } from "./actions";

export const metadata = { title: "Comptabilité" };

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function ComptaPage({
  searchParams,
}: {
  searchParams: Promise<{ debut?: string; fin?: string; ok?: string }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    if (!gate.user) redirect("/connexion");
    redirect("/mes-rendez-vous");
  }
  const sp = await searchParams;
  const now = new Date();
  const debut =
    sp.debut ||
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const fin =
    sp.fin ||
    new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  const admin = createAdminClient();
  const debutIso = `${debut}T00:00:00.000Z`;
  const finIso = `${fin}T23:59:59.999Z`;

  const [{ data: reservations }, { data: facturesAuto }, { data: manuels }, { data: charges }] =
    await Promise.all([
      admin
        .from("reservations")
        .select("numero, created_at, paye_at, total_cents, paiement_statut, paiement_provider, prestations(label)")
        .eq("paiement_statut", "paye")
        .gte("paye_at", debutIso)
        .lte("paye_at", finIso)
        .order("paye_at", { ascending: true }),
      admin
        .from("factures")
        .select("numero, created_at, montant_ttc_cents")
        .gte("created_at", debutIso)
        .lte("created_at", finIso),
      admin
        .from("documents_manuels")
        .select("*")
        .eq("kind", "facture")
        .gte("created_at", debutIso)
        .lte("created_at", finIso)
        .order("created_at", { ascending: true }),
      admin
        .from("charges")
        .select("*")
        .gte("date_charge", debut)
        .lte("date_charge", fin)
        .order("date_charge", { ascending: true }),
    ]);

  const recettesResa = (reservations || []).reduce((s, r) => s + (r.total_cents || 0), 0);
  const recettesManuelles = (manuels || []).reduce((s, d) => s + (d.montant_ttc_cents || 0), 0);
  const totalRecettes = recettesResa + recettesManuelles;
  const totalCharges = (charges || []).reduce((s, c) => s + (c.montant_cents || 0), 0);
  const resultat = totalRecettes - totalCharges;

  return (
    <Container className="py-14 sm:py-20">
      <Badge>Back-office</Badge>
      <h1 className="mt-5 font-serif text-4xl text-cream">Comptabilité</h1>
      <p className="mt-3 max-w-xl text-[15px] text-cream/65">
        Journal automatique des encaissements (réservations + factures manuelles)
        et charges saisies. Choisis la période, exporte.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <ButtonLink href="/admin" variant="ghost">
          Calendrier
        </ButtonLink>
        <ButtonLink href="/admin/documents" variant="ghost">
          Devis & factures
        </ButtonLink>
        <a
          href={`/api/compta/export?debut=${debut}&fin=${fin}`}
          className="text-sm text-bronze hover:text-glow"
        >
          Export CSV
        </a>
      </div>

      <form className="mt-8 flex flex-wrap items-end gap-3" method="get">
        <label className="text-xs text-cream/60">
          Début
          <input
            type="date"
            name="debut"
            defaultValue={debut}
            className="mt-1 block rounded-xl border border-bronze/20 bg-forest-deep/40 px-3 py-2 text-sm text-cream"
          />
        </label>
        <label className="text-xs text-cream/60">
          Fin
          <input
            type="date"
            name="fin"
            defaultValue={fin}
            className="mt-1 block rounded-xl border border-bronze/20 bg-forest-deep/40 px-3 py-2 text-sm text-cream"
          />
        </label>
        <button className="rounded-full bg-bronze px-5 py-2 text-sm font-semibold text-forest-deep">
          Filtrer
        </button>
      </form>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-bronze">Recettes</p>
          <p className="mt-2 font-serif text-3xl text-cream">{euros(totalRecettes)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-bronze">Charges</p>
          <p className="mt-2 font-serif text-3xl text-cream">{euros(totalCharges)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-bronze">Résultat</p>
          <p className="mt-2 font-serif text-3xl text-cream">{euros(resultat)}</p>
        </div>
      </div>

      <h2 className="mt-12 font-serif text-2xl text-cream">Journal des recettes</h2>
      <div className="mt-4 space-y-2 text-sm text-cream/75">
        {(reservations || []).map((r) => (
          <p key={r.numero}>
            {(r.paye_at || r.created_at).slice(0, 10)} · {r.numero} ·{" "}
            {(r.prestations as { label?: string } | null)?.label || "Réservation"} ·{" "}
            {r.paiement_provider || "—"} · {euros(r.total_cents)}
          </p>
        ))}
        {(manuels || []).map((d) => (
          <p key={d.id}>
            {String(d.created_at).slice(0, 10)} · {d.numero} · {d.client_nom} ·{" "}
            {d.designation} · {euros(d.montant_ttc_cents)}
          </p>
        ))}
        {(reservations || []).length === 0 && (manuels || []).length === 0 && (
          <p className="text-cream/45">Aucune recette sur cette période.</p>
        )}
      </div>
      <p className="mt-3 text-xs text-cream/40">
        {(facturesAuto || []).length} facture(s) auto émise(s) sur la période.
      </p>

      <h2 className="mt-12 font-serif text-2xl text-cream">Charges</h2>
      <form action={ajouterCharge} className="mt-4 flex flex-wrap gap-3">
        <input
          type="date"
          name="date_charge"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="rounded-xl border border-bronze/20 bg-forest-deep/40 px-3 py-2 text-sm text-cream"
        />
        <input
          name="libelle"
          required
          placeholder="Libellé (essence, huiles…)"
          className="min-w-[200px] flex-1 rounded-xl border border-bronze/20 bg-forest-deep/40 px-3 py-2 text-sm text-cream"
        />
        <input
          name="montant"
          required
          placeholder="Montant €"
          className="w-28 rounded-xl border border-bronze/20 bg-forest-deep/40 px-3 py-2 text-sm text-cream"
        />
        <button className="rounded-full bg-bronze px-5 py-2 text-sm font-semibold text-forest-deep">
          Ajouter
        </button>
      </form>
      <div className="mt-4 space-y-2 text-sm text-cream/75">
        {(charges || []).map((c) => (
          <p key={c.id}>
            {c.date_charge} · {c.libelle} · {euros(c.montant_cents)}
          </p>
        ))}
        {(charges || []).length === 0 && (
          <p className="text-cream/45">Aucune charge sur cette période.</p>
        )}
      </div>
    </Container>
  );
}
