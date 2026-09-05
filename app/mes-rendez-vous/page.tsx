import Link from "next/link";
import { Container, Badge, HaloStrong, ButtonLink } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export const metadata = { title: "Mes rendez-vous" };

export default async function MesRdvPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Container className="relative py-24 text-center">
        <HaloStrong className="left-1/2 top-1/3 h-[420px] w-[640px] -translate-x-1/2" />
        <div className="relative">
          <Badge>Espace patient</Badge>
          <h1 className="mt-6 font-serif text-4xl text-cream">
            Connexion bientôt active
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-cream/60">
            Les clés Supabase ne sont pas encore renseignées sur l’hébergement.
          </p>
          <div className="mt-8">
            <ButtonLink href="/connexion">Aller à la connexion</ButtonLink>
          </div>
        </div>
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
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-cream/60">
            Connectez-vous avec un lien envoyé par email pour retrouver vos
            rendez-vous, vos factures et vos liens de visio.
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
          <p className="mt-2 text-xs uppercase tracking-wide text-glow">
            Compte praticienne
          </p>
        )}

        <div className="mt-10 glass-card rounded-2xl p-8">
          <h2 className="font-serif text-2xl text-cream">Rendez-vous</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-cream/65">
            Aucune réservation pour le moment. Le calendrier et le paiement
            arrivent à l’étape suivante.
          </p>
          <div className="mt-6">
            <ButtonLink href="/reserver">Réserver une séance</ButtonLink>
          </div>
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
          Besoin d’aide ?{" "}
          <Link href="/contact" className="text-glow hover:underline">
            Contact
          </Link>
        </p>
      </div>
    </Container>
  );
}
