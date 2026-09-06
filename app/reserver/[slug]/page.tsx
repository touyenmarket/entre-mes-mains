import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { euros } from "@/lib/dates";
import ReservationForm from "./ReservationForm";
import type { Creneau, Prestation } from "@/lib/supabase/types";

export const metadata = { title: "Réserver" };

export default async function ReserverSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user, profile } = await getCurrentProfile();
  if (!user) redirect(`/connexion`);

  const supabase = await createClient();
  const { data: prestation } = await supabase
    .from("prestations")
    .select("*")
    .eq("slug", slug)
    .eq("actif", true)
    .maybeSingle();

  if (!prestation) notFound();
  const p = prestation as Prestation;

  const { data: creneaux } = await supabase
    .from("creneaux")
    .select("*")
    .eq("statut", "libre")
    .eq("format", p.format)
    .gt("debut_at", new Date().toISOString())
    .order("debut_at", { ascending: true });

  const disponibles = ((creneaux || []) as Creneau[]).filter(
    (c) => !c.prestation_id || c.prestation_id === p.id
  );

  return (
    <Container className="py-14 sm:py-20">
      <Link href="/reserver" className="text-sm text-cream/50 hover:text-glow">
        ← Toutes les prestations
      </Link>
      <Badge className="mt-6">{p.type}</Badge>
      <h1 className="mt-4 font-serif text-4xl text-cream">{p.label}</h1>
      <p className="mt-3 max-w-xl text-[15px] text-cream/65">{p.description}</p>
      <p className="mt-3 text-sm text-glow">
        {euros(p.prix_base_cents)} · {p.duree_min} min · {p.format}
      </p>

      <ReservationForm
        prestation={p}
        creneaux={disponibles}
        prenom={profile?.prenom || ""}
        nom={profile?.nom || ""}
        telephone={profile?.telephone || ""}
      />

      <div className="mt-10">
        <ButtonLink href="/contact" variant="ghost">
          Une question ? Écrire
        </ButtonLink>
      </div>
    </Container>
  );
}
