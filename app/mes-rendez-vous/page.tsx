import { Container, Badge, HaloStrong, ButtonLink } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { euros, formatDateHeure } from "@/lib/dates";
import Link from "next/link";

export const metadata = { title: "Mes rendez-vous" };

export default async function MesRdvPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Container className="relative py-24 text-center">
        <ButtonLink href="/connexion">Aller à la connexion</ButtonLink>
      </Container>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Container className="relative py-24 text-center">
        <HaloStrong className="left-1/2 top-1/3 h-[420px] w-[640px] -translate-x-1/2" />
        <div className="relative">
          <Badge>Espace patient</Badge>
          <h1 className="mt-6 font-serif text-4xl font-medium text-cream">
            Votre espace
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] text-cream/60">
            Connectez-vous pour voir vos rendez-vous.
          </p>
          <div className="mt-8">
            <ButtonLink href="/connexion">Recevoir mon lien</ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("prenom, nom, email, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: reservations } = await supabase
    .from("reservations")
    .select("*, prestations(label), creneaux(debut_at, format)")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  const prenom = profile?.prenom || user.email?.split("@")[0] || "vous";

  return (
    <Container className="relative py-16 sm:py-24">
      <HaloStrong className="left-1/2 top-0 h-[360px] w-[560px] -translate-x-1/2" />
      <div className="relative">
        <Badge>Espace patient</Badge>
        <h1 className="mt-6 font-serif text-4xl font-medium text-cream">
          Bonjour {prenom}
        </h1>
        <p className="mt-3 text-sm text-cream/55">{user.email}</p>
        {profile?.role === "admin" && (
          <div className="mt-4">
            <ButtonLink href="/admin">Ouvrir le calendrier admin</ButtonLink>
          </div>
        )}

        <div className="mt-10 space-y-4">
          {(!reservations || reservations.length === 0) && (
            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-serif text-2xl text-cream">Rendez-vous</h2>
              <p className="mt-3 text-[15px] text-cream/65">
                Aucune réservation pour le moment.
              </p>
              <div className="mt-6">
                <ButtonLink href="/reserver">Réserver une séance</ButtonLink>
              </div>
            </div>
          )}
          {(reservations || []).map((r) => {
            const pre = r.prestations as { label: string } | null;
            const cr = r.creneaux as { debut_at: string } | null;
            return (
              <div key={r.id} className="glass-card rounded-2xl p-6">
                <p className="text-xs uppercase tracking-wide text-glow">
                  {r.numero} · {r.statut}
                </p>
                <p className="mt-2 font-serif text-2xl text-cream">
                  {pre?.label || "Prestation"}
                </p>
                {cr && (
                  <p className="mt-1 text-sm text-cream/60">
                    {formatDateHeure(cr.debut_at)}
                  </p>
                )}
                <p className="mt-2 text-sm text-cream/70">
                  {euros(r.total_cents)}
                  {r.paiement_statut === "paye" ? " · payé" : " · en attente de paiement"}
                </p>
                {r.paiement_statut !== "paye" && (
                  <p className="mt-2 text-sm">
                    <Link
                      href={`/reserver/confirmation/${r.numero}`}
                      className="text-glow hover:underline"
                    >
                      Payer cette réservation
                    </Link>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <form action="/auth/signout" method="post" className="mt-8">
          <button
            type="submit"
            className="text-sm text-cream/50 underline-offset-4 hover:text-cream hover:underline"
          >
            Se déconnecter
          </button>
        </form>
        <p className="mt-6 text-sm text-cream/40">
          Besoin d&apos;aide ?{" "}
          <Link href="/contact" className="text-glow hover:underline">
            Contact
          </Link>
        </p>
      </div>
    </Container>
  );
}
