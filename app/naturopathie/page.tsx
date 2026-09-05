import Image from "next/image";
import {
  Leaf,
  Video,
  CalendarDays,
  MessageCircleHeart,
  ListChecks,
} from "lucide-react";
import {
  Container,
  Badge,
  SectionTitle,
  Card,
  ButtonLink,
  Price,
  HaloStrong,
} from "@/components/ui";

const approche = [
  {
    icon: Leaf,
    titre: "Vitalité au naturel",
    texte:
      "Alimentation, hygiène de vie et gestion du stress : des conseils naturels et concrets, adaptés à votre quotidien, pour soutenir votre équilibre et votre vitalité.",
  },
  {
    icon: ListChecks,
    titre: "Un plan personnalisé",
    texte:
      "À l'issue du rendez-vous, une synthèse ainsi qu'un plan d'accompagnement personnalisé sont élaborés et vous sont envoyés sous 7 jours.",
  },
  {
    icon: MessageCircleHeart,
    titre: "Un suivi dans le temps",
    texte:
      "Des consultations de suivi pour ajuster, encourager et accompagner vos changements, saison après saison.",
  },
];

const deroule = [
  {
    numero: "1",
    titre: "Le premier rendez-vous",
    detail: "1h30 maximum",
    texte:
      "Un bilan de vitalité complet : votre histoire, vos habitudes, vos ressentis. L'occasion de faire le point, en profondeur.",
  },
  {
    numero: "2",
    titre: "Des conseils personnalisés",
    detail: "à l'issue du bilan",
    texte:
      "Vous repartez avec des pistes claires : alimentation, mouvement, sommeil, gestion du stress… Une synthèse et un plan d'accompagnement personnalisé vous sont envoyés sous 7 jours.",
  },
  {
    numero: "3",
    titre: "Les suivis",
    detail: "1h",
    texte:
      "Pour ajuster les recommandations, constater les progrès et traverser les changements de saison en douceur.",
  },
];

const tarifs = [
  {
    titre: "Premier rendez-vous",
    detail: "1h30 maximum — bilan de vitalité + conseils personnalisés",
    prix: 60,
  },
  {
    titre: "Consultation de suivi",
    detail: "1h — ajustement du plan et accompagnement",
    prix: 50,
  },
];

export default function NaturopathiePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/naturo.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/60 to-forest-deep" />
        <HaloStrong className="left-1/2 top-1/3 h-[400px] w-[640px] -translate-x-1/2" />
        <Container className="relative flex flex-col items-center py-24 text-center sm:py-28">
          <Badge>Consultations en visio</Badge>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl font-medium leading-[1.15] text-cream sm:text-5xl">
            La naturopathie, en visio
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/70">
            La naturopathie vise à soutenir votre vitalité et préserver votre
            équilibre grâce à des moyens naturels, en considérant la personne
            dans sa globalité. En visio, profitez d&apos;un accompagnement
            personnalisé, où que vous soyez, dans le confort de votre
            environnement.
          </p>
          <div className="mt-8">
            <ButtonLink href="/reserver">Réserver une consultation</ButtonLink>
          </div>
          <p className="mt-7 flex items-center justify-center gap-2 text-xs font-medium text-sage-light">
            <Image
              src="/images/signante.png"
              alt=""
              width={16}
              height={17}
              className="h-[17px] w-auto shrink-0"
            />
            Consultations accessibles aux personnes sourdes et malentendantes
          </p>
        </Container>
      </section>

      {/* APPROCHE */}
      <section className="relative py-20">
        <Container>
          <SectionTitle
            center
            eyebrow="L'approche"
            title="Un accompagnement global et sur-mesure"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {approche.map((a) => (
              <Card key={a.titre}>
                <a.icon size={22} className="text-sage" />
                <h3 className="mt-4 font-serif text-lg text-cream">
                  {a.titre}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cream/60">
                  {a.texte}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* DÉROULÉ */}
      <section className="relative py-20">
        <Container>
          <SectionTitle
            eyebrow="Le déroulé"
            title="Comment se passent les consultations ?"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {deroule.map((d) => (
              <Card key={d.numero} className="relative">
                <span className="font-serif text-4xl text-bronze/30">
                  {d.numero}
                </span>
                <h3 className="mt-3 font-serif text-lg text-cream">
                  {d.titre}
                </h3>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-bronze/80">
                  {d.detail}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-cream/60">
                  {d.texte}
                </p>
              </Card>
            ))}
          </div>

          {/* VISIO */}
          <Card className="mt-8 flex flex-col gap-5 p-8 sm:flex-row sm:items-center">
            <Video size={26} className="shrink-0 text-glow" />
            <div>
              <h3 className="font-serif text-lg text-cream">
                100&nbsp;% en visio — sans rien à installer
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/60">
                Le lien de visioconférence vous est envoyé automatiquement
                après votre réservation, et un rappel vous est adressé la
                veille. Prévoyez simplement un endroit calme et une bonne
                connexion.
              </p>
            </div>
          </Card>
        </Container>
      </section>

      {/* TARIFS */}
      <section className="relative py-20">
        <HaloStrong className="left-1/2 top-1/3 h-[380px] w-[800px] -translate-x-1/2" />
        <Container className="relative">
          <SectionTitle
            center
            eyebrow="Tarifs"
            title="Des tarifs simples et transparents"
            subtitle="Paiement intégral en ligne à la réservation."
          />
          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            {tarifs.map((t) => (
              <Card key={t.titre} className="flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-cream">{t.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/55">
                    {t.detail}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Price amount={t.prix} />
                  <CalendarDays size={18} className="text-bronze/60" />
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-cream/45">
            La naturopathie s&apos;inscrit dans une démarche de bien-être et ne
            se substitue pas à un suivi médical.
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <Container className="flex flex-col items-center text-center">
          <h2 className="max-w-xl font-serif text-3xl font-medium text-cream sm:text-4xl">
            Faire le point sur votre vitalité
          </h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/reserver">Réserver une consultation</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Poser une question
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
