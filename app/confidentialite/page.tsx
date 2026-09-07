import { Container, SectionTitle, Card } from "@/components/ui";
import { SITE } from "@/lib/config";

export const metadata = { title: "Politique de confidentialité" };

const sections = [
  {
    titre: "1. Responsable du traitement",
    corps: [
      `${SITE.name} — ${SITE.responsable}, ${SITE.adresse}. Contact : ${SITE.email}`,
    ],
  },
  {
    titre: "2. Données collectées",
    corps: [
      "Identité et contact : nom, prénom, email, téléphone (facultatif).",
      "Adresse du lieu de la prestation à domicile — utilisée uniquement pour le calcul du supplément kilométrique et le déplacement.",
      "Données de réservation : prestations choisies, dates, montants, statuts de paiement.",
      "Le choix d'une prestation (ex. massage prénatal, massage bébé) peut révéler une donnée de santé. Nous ne collectons aucun dossier médical : aucune information relative à un bilan, un diagnostic ou un suivi de santé n'est stockée sur cette plateforme.",
    ],
  },
  {
    titre: "3. Finalités et bases légales",
    corps: [
      "Gestion des réservations et des paiements : exécution du contrat (art. 6.1.b RGPD).",
      "Envoi des confirmations, liens de visio et rappels : exécution du contrat.",
      "Facturation et comptabilité : obligation légale.",
      "Traitement de données révélant potentiellement la santé : consentement explicite (art. 9.2.a RGPD), recueilli au moment de la réservation, et retirable à tout moment.",
    ],
  },
  {
    titre: "4. Destinataires et sous-traitants",
    corps: [
      "Hébergement : Vercel (application) et Supabase (base de données) — données hébergées dans l'Union européenne.",
      "Paiement : PayPal (et tout autre prestataire de paiement proposé sur le site).",
      "Emails : prestataire d'envoi d'emails transactionnels (Brevo).",
      "Chat en ligne : Tawk.to (messages échangés via la bulle du site, pour répondre depuis le téléphone sans afficher de numéro).",
      "Visioconférence : Zoom (création automatique du lien de réunion).",
      "Calcul de distance : OpenRouteService (adresse transformée en distance kilométrique).",
      "Chaque sous-traitant présente des garanties contractuelles conformes au RGPD.",
    ],
  },
  {
    titre: "5. Durées de conservation",
    corps: [
      "Données de réservation : [à définir — ex. 3 ans après la dernière prestation].",
      "Factures : 10 ans (obligation comptable).",
      "Journaux d'emails transactionnels : 1 an.",
      "Au-delà de ces durées, les données sont supprimées ou anonymisées.",
    ],
  },
  {
    titre: "6. Vos droits",
    corps: [
      "Vous disposez des droits d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition sur vos données, ainsi que du droit de retirer votre consentement à tout moment.",
      "Exercice : par email à " + SITE.email + ", ou via l'espace patient. Vous pouvez également saisir la CNIL (cnil.fr).",
    ],
  },
  {
    titre: "7. Cookies et traceurs",
    corps: [
      "Ce site n'utilise aucun traceur publicitaire. Seuls les cookies strictement nécessaires au fonctionnement (session de connexion) et, le cas échéant, ceux du chat Tawk.to sont utilisés.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <SectionTitle
          eyebrow="Informations légales"
          title="Politique de confidentialité"
          subtitle="Document type conforme au RGPD — à faire valider par un professionnel du droit avant la mise en ligne (données potentiellement sensibles)."
        />
        <div className="mt-10 space-y-6">
          {sections.map((s) => (
            <Card key={s.titre}>
              <h2 className="font-serif text-xl text-cream">{s.titre}</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-cream/65">
                {s.corps.map((l, i) => (
                  <li key={i} className="list-disc pl-5 marker:text-bronze/60">
                    {l}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
