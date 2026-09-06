import { notFound, redirect } from "next/navigation";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { euros, formatDateHeure } from "@/lib/dates";

export const metadata = { title: "Réservation confirmée" };

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const { user } = await getCurrentProfile();
  if (!user) redirect("/connexion");

  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select("*, prestations(label), creneaux(debut_at, format)")
    .eq("numero", numero)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!data) notFound();

  const prestation = data.prestations as { label: string } | null;
  const creneau = data.creneaux as { debut_at: string; format: string } | null;

  return (
    <Container className="py-16 text-center sm:py-24">
      <Badge>C’est noté</Badge>
      <h1 className="mt-6 font-serif text-4xl text-cream">
        Réservation {data.numero}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-[15px] text-cream/65">
        {prestation?.label}
        {creneau ? ` · ${formatDateHeure(creneau.debut_at)}` : ""}
      </p>
      <p className="mt-3 text-glow">{euros(data.total_cents)}</p>
      <p className="mx-auto mt-6 max-w-md text-sm text-cream/50">
        Le paiement en ligne sera branché à l’étape suivante. Votre créneau est
        bien réservé.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <ButtonLink href="/mes-rendez-vous">Mes rendez-vous</ButtonLink>
        <ButtonLink href="/" variant="ghost">
          Accueil
        </ButtonLink>
      </div>
    </Container>
  );
}
