import Image from "next/image";
import {
  Hand,
  Home,
  Users,
  Video,
  CalendarDays,
  Clock,
  BadgeCheck,
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

const formats = [
  {
    icon: Home,
    titre: "À domicile",
    texte:
      "L'atelier se déroule chez vous, dans le cocon de bébé. Le supplément kilométrique s'applique selon la zone de déplacement (15 km inclus, puis 0,55 €/km).",
  },
  {
    icon: Users,
    titre: "En collectif (présentiel)",
    texte:
      "Un petit groupe de familles, dans un lieu dédié. Les places sont limitées pour préserver la qualité des échanges.",
  },
  {
    icon: Video,
    titre: "En visio",
    texte:
      "Depuis chez vous, avec un lien de visioconférence envoyé automatiquement après réservation. Idéal sans déplacement.",
  },
];

const bienfaits = [
  {
    titre: "Moins de frustrations",
    texte:
      "Bébé peut exprimer faim, fatigue ou envie de câlin avant de savoir parler — et être entendu.",
  },
  {
    titre: "Un lien renforcé",
    texte:
      "Signer avec bébé, c'est un jeu de regards et de signes partagés, au cœur du quotidien.",
  },
  {
    titre: "Le plaisir avant la performance",
    texte:
      "L'atelier est un moment joyeux : on y apprend quelques signes essentiels, à son rythme, sans pression.",
  },
];

/* Prix provisoires — à valider avec la praticienne */
const formules = [
  {
    icon: Hand,
    tag: "À l'unité",
    titre: "Séance d'atelier",
    detail: "1h",
    texte:
      "Les signes essentiels du quotidien de bébé : besoins, repas, sommeil, émotions. Une première approche, en douceur.",
    prix: 35,
    note: "Supplément km selon la zone si l'atelier a lieu à domicile.",
    forfait: false,
  },
  {
    icon: BadgeCheck,
    tag: "Forfait recommandé",
    titre: "Forfait 4 séances",
    detail: "4 × 1h",
    texte:
      "Une progression complète à planifier librement : approfondissement des signes, récapitulatifs et supports vidéo signés et sous-titrés inclus.",
    prix: 120,
    prixBarre: 140,
    note: "Soit 30 € la séance — supplément km selon la zone si à domicile.",
    forfait: true,
  },
];

export default function AtelierLsfPage() {
  return (
    <>
      {/* HERO — main de bébé en fond */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/bebe.jpg"
          alt="Main de bébé dans la main d'un parent, lumière dorée"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/60 to-forest-deep" />
        <HaloStrong className="left-1/2 top-1/3 h-[400px] w-[640px] -translate-x-1/2" />
        <Container className="relative flex flex-col items-center py-24 text-center sm:py-28">
          <Badge>Atelier langue des signes française</Badge>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl font-medium leading-[1.15] text-cream sm:text-5xl">
            Offrir à bébé ses premiers mots, avec les mains
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/70">
            Bien avant la parole, votre bébé a déjà beaucoup à exprimer : une
            faim, une envie de câlin, une fatigue… La langue des signes
            française lui donne un moyen simple et naturel de se faire
            comprendre. Au fil de l&apos;atelier, vous apprendrez les signes
            essentiels du quotidien de votre bébé et la manière de les
            intégrer en douceur à vos échanges, à votre rythme.
          </p>
          <div className="mt-8">
            <ButtonLink href="/reserver?type=atelier">Réserver l&apos;atelier</ButtonLink>
          </div>
        </Container>
      </section>

      {/* POURQUOI */}
      <section className="relative py-20">
        <Container>
          <SectionTitle
            center
            eyebrow="Pourquoi signer ?"
            title="Des signes simples, de grands effets"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {bienfaits.map((b) => (
              <Card key={b.titre}>
                <Hand size={22} className="text-bronze" />
                <h3 className="mt-4 font-serif text-lg text-cream">
                  {b.titre}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cream/60">
                  {b.texte}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FORMATS */}
      <section className="relative py-20">
        <HaloStrong className="left-1/2 top-1/4 h-[380px] w-[800px] -translate-x-1/2" />
        <Container className="relative">
          <SectionTitle
            center
            eyebrow="Les formats"
            title="Trois façons de suivre l'atelier"
            subtitle="Choisissez le format qui convient à votre famille et les professionnels de la petite enfance : à domicile, en collectif ou en visio."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {formats.map((f) => (
              <Card key={f.titre} className="flex flex-col">
                <f.icon size={22} className="text-sage" />
                <h3 className="mt-4 font-serif text-xl text-cream">
                  {f.titre}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-cream/60">
                  {f.texte}
                </p>
                <div className="mt-5 flex items-center gap-2 border-t border-bronze/15 pt-4 text-xs text-cream/60">
                  <Clock size={13} className="text-bronze" /> Durée : 1h
                </div>
              </Card>
            ))}
          </div>

          {/* ACCESSIBILITÉ */}
          <Card className="mt-8 flex flex-col gap-5 p-8 sm:flex-row sm:items-center">
            <Image
              src="/images/signante.png"
              alt=""
              width={52}
              height={55}
              className="h-[55px] w-auto shrink-0"
            />
            <div>
              <h3 className="font-serif text-lg text-cream">
                Un atelier accessible aux personnes sourdes et malentendantes
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/60">
                L&apos;atelier est conçu pour être suivi en langue des signes
                française : des supports vidéo signés et sous-titrés
                accompagnent les séances et restent consultables après
                l&apos;atelier.
              </p>
            </div>
          </Card>
        </Container>
      </section>

      {/* TARIFS & FORMULES */}
      <section className="relative py-20">
        <Container>
          <SectionTitle
            center
            eyebrow="Tarifs & formules"
            title="À l'unité ou en forfait"
            subtitle="Prix provisoires, à confirmer — chaque formule est valable pour les formats domicile, collectif et visio."
          />
          <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            {formules.map((f) => (
              <Card
                key={f.titre}
                className={
                  f.forfait
                    ? "flex flex-col border-glow/50"
                    : "flex flex-col"
                }
              >
                <div className="flex items-center justify-between">
                  <f.icon size={22} className="text-sage" />
                  <Badge>{f.tag}</Badge>
                </div>
                <h3 className="mt-4 font-serif text-xl text-cream">
                  {f.titre}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-cream/60">
                  <Clock size={12} className="text-bronze" /> {f.detail}
                </p>
                <p className="mt-3 flex-1 text-[13px] leading-relaxed text-cream/60">
                  {f.texte}
                </p>
                <div className="mt-5 flex items-baseline gap-3 border-t border-bronze/15 pt-4">
                  <Price amount={f.prix} />
                  {f.prixBarre && (
                    <span className="text-sm text-cream/35 line-through">
                      {f.prixBarre} €
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-cream/45">
                  {f.note}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <Container className="flex flex-col items-center text-center">
          <CalendarDays size={26} className="text-bronze" />
          <h2 className="mt-5 max-w-xl font-serif text-3xl font-medium text-cream sm:text-4xl">
            Et si bébé vous le disait avec les mains&nbsp;?
          </h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/reserver?type=atelier">Réserver l&apos;atelier</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Poser une question
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
