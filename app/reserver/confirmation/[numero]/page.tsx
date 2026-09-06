import { notFound, redirect } from "next/navigation";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { euros, formatDateHeure } from "@/lib/dates";
import { isPaypalEnabled } from "@/lib/paiements/paypal";
import { lancerPaiementPaypal } from "../../paiement/actions";
import { assurerLienVisio } from "@/lib/visio";

export const metadata = { title: "Réservation confirmée" };

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ numero: string }>;
  searchParams: Promise<{ paye?: string; annule?: string; erreur?: string }>;
}) {
  const { numero } = await params;
  const q = await searchParams;
  const { user } = await getCurrentProfile();
  if (!user) redirect("/connexion");

  const supabase = await createClient();
  const { data } = await supabase
    .from("reservations")
    .select(
      "*, prestations(label, visio_auto, format), creneaux(debut_at, format)"
    )
    .eq("numero", numero)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!data) notFound();

  const prestation = data.prestations as {
    label: string;
    visio_auto?: boolean;
    format?: string;
  } | null;
  const creneau = data.creneaux as { debut_at: string; format: string } | null;
  const paye = data.paiement_statut === "paye";
  const paypal = isPaypalEnabled();

  let visio = data.visio_lien as string | null;
  if (paye && (prestation?.visio_auto || prestation?.format === "visio")) {
    visio = (await assurerLienVisio(data.id)) || visio;
  }

  return (
    <Container className="py-16 text-center sm:py-24">
      <Badge>{paye ? "Payée" : "C’est noté"}</Badge>
      <h1 className="mt-6 font-serif text-4xl text-cream">
        Réservation {data.numero}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-[15px] text-cream/65">
        {prestation?.label}
        {creneau ? ` · ${formatDateHeure(creneau.debut_at)}` : ""}
      </p>
      <p className="mt-3 text-glow">{euros(data.total_cents)}</p>

      {q.paye === "1" && (
        <p className="mx-auto mt-6 max-w-md text-sm text-cream/70">
          Paiement reçu. Votre créneau est confirmé.
        </p>
      )}
      {q.annule === "1" && (
        <p className="mx-auto mt-6 max-w-md text-sm text-glow">
          Paiement annulé. Vous pouvez réessayer quand vous voulez.
        </p>
      )}
      {q.erreur === "paiement" && (
        <p className="mx-auto mt-6 max-w-md text-sm text-glow">
          Le paiement n’a pas abouti. Réessayez ou écrivez-nous.
        </p>
      )}

      {paye && visio && (
        <p className="mx-auto mt-6 max-w-md text-sm text-cream/70">
          Lien visio :{" "}
          <a href={visio} className="text-glow underline" target="_blank" rel="noreferrer">
            Rejoindre la consultation
          </a>
        </p>
      )}

      {!paye && paypal && (
        <form action={lancerPaiementPaypal} className="mt-8">
          <input type="hidden" name="numero" value={data.numero} />
          <button
            type="submit"
            className="rounded-full bg-bronze px-6 py-3 text-sm font-semibold text-forest-deep hover:bg-glow"
          >
            Payer avec PayPal
          </button>
        </form>
      )}

      {!paye && !paypal && (
        <p className="mx-auto mt-6 max-w-md text-sm text-cream/50">
          Paiement en ligne en cours de configuration. Votre créneau est
          réservé.
        </p>
      )}

      {paye && (
        <div className="mt-8">
          <ButtonLink href={`/api/facture/${data.numero}`}>
            Télécharger la facture PDF
          </ButtonLink>
        </div>
      )}

      <div className="mt-10 flex justify-center gap-3">
        <ButtonLink href="/mes-rendez-vous">Mes rendez-vous</ButtonLink>
        <ButtonLink href="/" variant="ghost">
          Accueil
        </ButtonLink>
      </div>
    </Container>
  );
}
