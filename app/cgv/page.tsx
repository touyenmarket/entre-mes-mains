import { Container, SectionTitle, Card } from "@/components/ui";
import { ZONE_FRANCHE_KM } from "@/lib/tarification";

export const metadata = { title: "Conditions générales de vente" };

const sections = [
  {
    titre: "1. Objet",
    corps: [
      "Les présentes conditions générales de vente encadrent les prestations proposées : consultations de naturopathie en visioconférence, massages bien-être à domicile et atelier de langue des signes française pour bébé.",
    ],
  },
  {
    titre: "2. Réservation",
    corps: [
      "La réservation s'effectue en ligne : choix de la prestation, d'un créneau disponible puis règlement. Elle n'est confirmée qu'après paiement.",
      "Un email de confirmation récapitule la prestation, la date, l'heure et, le cas échéant, le lien de visioconférence.",
    ],
  },
  {
    titre: "3. Prix et paiement",
    corps: [
      "Les prix sont affichés en euros, toutes taxes comprises (TVA non applicable, art. 293 B du CGI).",
      "Le paiement est dû intégralement à la réservation, par les moyens de paiement proposés sur le site (PayPal, Wero — selon disponibilité).",
      `Pour les prestations à domicile, le tarif comprend les ${ZONE_FRANCHE_KM} premiers kilomètres. Au-delà, un supplément de 0,55 € par kilomètre parcouru s'applique, calculé automatiquement depuis l'adresse indiquée à la réservation.`,
      "Une facture est adressée automatiquement après paiement.",
    ],
  },
  {
    titre: "4. Annulation et report",
    corps: [
      "Délai d'annulation sans frais : [à définir] avant la séance. Au-delà de ce délai : [politique à définir — remboursement partiel / avoir / report].",
      "En cas d'impossibilité de la praticienne (maladie, imprévu), la séance est reportée à une date convenue ensemble ou intégralement remboursée.",
      "Toute demande d'annulation ou de report s'effectue par email ou depuis l'espace patient.",
    ],
  },
  {
    titre: "5. Déroulement des prestations",
    corps: [
      "Consultations en visio : le lien est envoyé automatiquement à la confirmation ; un rappel est adressé la veille. En cas de retard du patient au-delà de 15 minutes sans nouvelle, la consultation pourra être considérée comme due.",
      "Massages à domicile : la praticienne se déplace avec l'ensemble du matériel. Le patient veille à prévoir un espace calme et adapté. La séance ne peut avoir lieu en cas de contre-indication manifeste (fièvre, état infectieux, plaie…).",
      "Le massage bébé peut également se faire en visio : la praticienne montre les gestes visuellement et contrôle la bonne reproduction des gestes.",
      "Le massage bien-être n'a pas de visée thérapeutique ; il ne remplace ni un avis ni un suivi médical. Certaines situations (grossesse pathologique, post-opératoire récent…) peuvent nécessiter l'avis préalable d'un médecin.",
    ],
  },
  {
    titre: "6. Données personnelles",
    corps: [
      "Les données collectées lors de la réservation (identité, contact, adresse pour le calcul kilométrique) sont traitées conformément à notre politique de confidentialité et au RGPD.",
    ],
  },
  {
    titre: "7. Droit applicable et médiation",
    corps: [
      "Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité ; à défaut, les tribunaux français seront compétents. [Médiateur de la consommation : à compléter]",
    ],
  },
];

export default function CGVPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <SectionTitle
          eyebrow="Informations légales"
          title="Conditions générales de vente"
          subtitle="Document de travail — les mentions entre crochets sont à compléter avant la mise en ligne."
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
