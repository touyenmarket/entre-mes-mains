import { Container, SectionTitle, Card } from "@/components/ui";
import { SITE } from "@/lib/config";

export const metadata = { title: "Mentions légales" };

const sections = [
  {
    titre: "Éditrice du site",
    corps: [
      `${SITE.name} — ${SITE.responsable}`,
      "Statut : micro-entreprise",
      "SIRET : 88905921800012",
      `Adresse : ${SITE.adresse}`,
      `Email : ${SITE.email}`,
      "Activité : naturopathie, massage bien-être à domicile et animatrice de bébé signe. TVA non applicable, art. 293 B du CGI.",
    ],
  },
  {
    titre: "Directrice de la publication",
    corps: [SITE.responsable],
  },
  {
    titre: "Hébergement",
    corps: [
      "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (avec hébergement des données possible dans l'Union européenne).",
      "La base de données est hébergée par Supabase (plateforme PostgreSQL), région Europe.",
    ],
  },
  {
    titre: "Propriété intellectuelle",
    corps: [
      `L'ensemble des contenus du site (textes, visuels, logo, charte graphique) est la propriété de ${SITE.name}, sauf mention contraire. Toute reproduction sans autorisation préalable est interdite.`,
    ],
  },
  {
    titre: "Responsabilité",
    corps: [
      "Les informations diffusées sur ce site ont un caractère informatif et ne constituent pas un avis médical. La naturopathie et le massage bien-être ne se substituent pas à un suivi médical ni à un traitement prescrit par un professionnel de santé.",
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <SectionTitle eyebrow="Informations légales" title="Mentions légales" />
        <div className="mt-10 space-y-6">
          {sections.map((s) => (
            <Card key={s.titre}>
              <h2 className="font-serif text-xl text-cream">{s.titre}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-cream/65">
                {s.corps.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
