import Link from "next/link";
import { Container, Badge, HaloStrong } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { euros } from "@/lib/dates";
import type { Prestation } from "@/lib/supabase/types";

export const metadata = { title: "Réserver" };

const TYPE_LABEL: Record<string, string> = {
  naturo: "Naturopathie",
  massage: "Massages à domicile",
  atelier: "Atelier de bébé signes",
};

const INTROS: Record<string, string> = {
  naturo:
    "Choisissez votre consultation. Le rendez-vous se fait en visio.",
  massage:
    "Choisissez le massage. L’adresse servira à calculer le déplacement.",
  atelier:
    "Choisissez le format de l’atelier de bébé signes : domicile, collectif ou visio. Tout le matériel et les supports sont fournis.",
};

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: typeParam } = await searchParams;
  const typeFiltre =
    typeParam === "naturo" || typeParam === "massage" || typeParam === "atelier"
      ? typeParam
      : null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("prestations")
    .select("*")
    .eq("actif", true)
    .order("position");

  const prestations = ((data || []) as Prestation[]).filter((p) =>
    typeFiltre ? p.type === typeFiltre : true
  );
  const groups = (typeFiltre
    ? [typeFiltre]
    : ["naturo", "massage", "atelier"]) as Array<"naturo" | "massage" | "atelier">;

  return (
    <Container className="relative py-16 sm:py-24">
      <HaloStrong className="left-1/2 top-0 h-[360px] w-[560px] -translate-x-1/2" />
      <div className="relative">
        <Badge>Réservation</Badge>
        <h1 className="mt-5 font-serif text-4xl font-medium text-cream">
          {typeFiltre ? TYPE_LABEL[typeFiltre] : "Choisir une prestation"}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] text-cream/65">
          {typeFiltre
            ? INTROS[typeFiltre]
            : "Sélectionnez l’accompagnement. Vous choisirez ensuite un créneau parmi les disponibilités ouvertes."}
        </p>
        {typeFiltre && (
          <p className="mt-3 text-sm">
            <Link href="/reserver" className="text-glow hover:underline">
              Voir toutes les prestations
            </Link>
          </p>
        )}

        {prestations.length === 0 && (
          <p className="mt-8 text-cream/55">
            Le catalogue n’est pas encore chargé. Vérifiez la connexion
            Supabase.
          </p>
        )}

        {groups.map((type) => {
          const items = prestations.filter((p) => p.type === type);
          if (!items.length) return null;
          return (
            <section key={type} className="mt-12">
              <h2 className="font-serif text-2xl text-cream">{TYPE_LABEL[type]}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    href={`/reserver/${p.slug}`}
                    className="glass-card rounded-2xl p-6 transition-colors hover:border-glow/40"
                  >
                    <p className="font-serif text-xl text-cream">{p.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-cream/60">
                      {p.description}
                    </p>
                    <p className="mt-4 text-sm text-glow">
                      {euros(p.prix_base_cents)} · {p.duree_min} min · {p.format}
                      {p.km_applicable ? " + km" : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
