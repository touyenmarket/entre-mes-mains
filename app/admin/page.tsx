import { redirect } from "next/navigation";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateHeure } from "@/lib/dates";
import NouveauCreneauForm from "./NouveauCreneauForm";
import { changerStatutCreneau } from "./actions";
import type { Prestation, StatutCreneau } from "@/lib/supabase/types";

export const metadata = { title: "Calendrier admin" };

async function BoutonStatut({
  id,
  statut,
  label,
}: {
  id: string;
  statut: StatutCreneau;
  label: string;
}) {
  async function action() {
    "use server";
    await changerStatutCreneau(id, statut);
  }
  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded-full border border-bronze/40 px-3 py-1 text-xs text-cream/80 hover:text-glow"
      >
        {label}
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    if (!gate.user) redirect("/connexion");
    redirect("/mes-rendez-vous");
  }

  const admin = createAdminClient();
  const [{ data: prestations }, { data: creneaux }, { data: reservations }] =
    await Promise.all([
      admin.from("prestations").select("*").eq("actif", true).order("position"),
      admin
        .from("creneaux")
        .select("*")
        .gte("debut_at", new Date(Date.now() - 86400000).toISOString())
        .order("debut_at", { ascending: true }),
      admin
        .from("reservations")
        .select("id, numero, statut, total_cents, created_at, prestation_id")
        .neq("statut", "annulee")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  return (
    <Container className="py-14 sm:py-20">
      <Badge>Back-office</Badge>
      <h1 className="mt-5 font-serif text-4xl text-cream">Calendrier</h1>
      <p className="mt-3 max-w-xl text-[15px] text-cream/65">
        Ajoute tes disponibilités. Les patients ne voient que les créneaux
        libres du format correspondant.
      </p>

      <h2 className="mt-10 font-serif text-2xl text-cream">Nouveau créneau</h2>
      <div className="mt-4">
        <NouveauCreneauForm prestations={(prestations || []) as Prestation[]} />
      </div>

      <h2 className="mt-12 font-serif text-2xl text-cream">À venir</h2>
      <div className="mt-4 flex flex-col gap-3">
        {(creneaux || []).length === 0 && (
          <p className="text-sm text-cream/50">Aucun créneau pour le moment.</p>
        )}
        {(creneaux || []).map((c) => (
          <div
            key={c.id}
            className="glass-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-cream">{formatDateHeure(c.debut_at)}</p>
              <p className="text-sm text-cream/50">
                {c.format} · {c.places_prises}/{c.capacite} · {c.statut}
                {c.note_admin ? ` · ${c.note_admin}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              {c.statut !== "bloque" && (
                <BoutonStatut id={c.id} statut="bloque" label="Bloquer" />
              )}
              {c.statut !== "libre" && (
                <BoutonStatut id={c.id} statut="libre" label="Libérer" />
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-serif text-2xl text-cream">Dernières réservations</h2>
      <div className="mt-4 flex flex-col gap-2">
        {(reservations || []).length === 0 && (
          <p className="text-sm text-cream/50">Pas encore de réservation.</p>
        )}
        {(reservations || []).map((r) => (
          <p key={r.id} className="text-sm text-cream/70">
            {r.numero} · {r.statut} · {(r.total_cents / 100).toFixed(2)} €
          </p>
        ))}
      </div>

      <div className="mt-10">
        <ButtonLink href="/mes-rendez-vous" variant="ghost">
          Retour à l’espace
        </ButtonLink>
      </div>
    </Container>
  );
}
