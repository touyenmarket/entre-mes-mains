import { redirect } from "next/navigation";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { TEXTES_DEFAUT } from "@/lib/textes";
import { chargerTextes } from "@/lib/textes-server";
import { enregistrerTextes } from "./actions";

export const metadata = { title: "Textes du site" };

export default async function TextesAdminPage({
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
  const map = await chargerTextes();
  const pages = [...new Set(TEXTES_DEFAUT.map((t) => t.page))];

  return (
    <Container className="py-14 sm:py-20">
      <Badge>Back-office</Badge>
      <h1 className="mt-5 font-serif text-4xl text-cream">Textes du site</h1>
      <p className="mt-3 max-w-xl text-[15px] text-cream/65">
        Modifie uniquement les phrases listées ici. Le design, les photos et
        les tarifs techniques restent inchangés. Vide un champ pour revenir
        au texte d’origine.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <ButtonLink href="/admin" variant="ghost">
          Calendrier
        </ButtonLink>
        <ButtonLink href="/admin/documents" variant="ghost">
          Devis & factures
        </ButtonLink>
        <ButtonLink href="/" variant="ghost">
          Voir le site
        </ButtonLink>
      </div>
      {sp.ok && (
        <p className="mt-4 text-sm text-glow">Textes enregistrés. Recharge les pages publiques pour voir le résultat.</p>
      )}
      {sp.erreur && (
        <p className="mt-4 text-sm text-glow">
          Enregistrement impossible : {sp.erreur}. Lance d’abord le SQL site-textes.sql dans Supabase.
        </p>
      )}

      <form action={enregistrerTextes} className="mt-8 space-y-10">
        {pages.map((page) => (
          <section key={page}>
            <h2 className="font-serif text-2xl text-cream">{page}</h2>
            <div className="mt-4 space-y-4">
              {TEXTES_DEFAUT.filter((t) => t.page === page).map((t) => (
                <label key={t.cle} className="block text-sm text-cream/70">
                  {t.label}
                  <textarea
                    name={t.cle}
                    rows={t.valeur.length > 80 ? 4 : 2}
                    defaultValue={map[t.cle] || t.valeur}
                    className="mt-1 w-full rounded-xl border border-bronze/20 bg-forest-deep/40 px-3 py-2 text-sm text-cream"
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
        <button
          type="submit"
          className="rounded-full bg-bronze px-6 py-2.5 text-sm font-semibold text-forest-deep hover:bg-glow"
        >
          Enregistrer les textes
        </button>
      </form>
    </Container>
  );
}
