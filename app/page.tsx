import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  CalendarDays,
  CreditCard,
  HeartHandshake,
  Video,
  Leaf,
  Heart,
  Hand,
  MapPin,
  ChevronRight,
} from "lucide-react";
import {
  Container,
  Badge,
  SectionTitle,
  Card,
  ButtonLink,
  LeafDivider,
  HaloStrong,
} from "@/components/ui";
import { SITE } from "@/lib/config";
import DistancePreview from "@/components/DistancePreview";

const etapes = [
  {
    icon: Sparkles,
    titre: "Vous choisissez votre soin",
    texte:
      "Consultation, massage ou atelier : vous trouvez la formule qui vous ressemble, avec des tarifs clairs.",
  },
  {
    icon: CalendarDays,
    titre: "Vous réservez votre créneau",
    texte:
      "Les disponibilités s'affichent en temps réel. Pour un massage, le supplément kilométrique est calculé automatiquement depuis votre adresse.",
  },
  {
    icon: CreditCard,
    titre: "Vous réglez en ligne",
    texte:
      "Paiement intégral sécurisé à la réservation. Simple et sans surprise.",
  },
  {
    icon: HeartHandshake,
    titre: "Vous êtes accompagnées",
    texte:
      "Confirmation immédiate, lien visio envoyé automatiquement et rappel la veille. Il ne reste qu'à profiter.",
  },
];

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/60 via-forest-deep/50 to-forest-deep" />
        <HaloStrong className="left-1/2 top-1/3 h-[480px] w-[760px] -translate-x-1/2" />

        <Container className="relative flex flex-col items-center py-24 text-center sm:py-32">
          <Badge>Naturopathie & massage bien-être</Badge>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl font-medium leading-[1.15] text-cream sm:text-6xl">
            Prendre soin de soi, en douceur et en confiance
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Consultations de naturopathie en visio, massages bien-être à
            domicile pour vous et pour bébé, des ateliers de langue des
            signes française. Une parenthèse de douceur, chez vous.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/naturopathie">
              Réserver une consultation
            </ButtonLink>
            <ButtonLink href="/massages" variant="ghost">
              Découvrir les massages
            </ButtonLink>
          </div>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs text-cream/55">
            <span className="flex items-center gap-1.5">
              <Video size={13} className="text-bronze" /> Lien visio envoyé
              automatiquement après paiement
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard size={13} className="text-bronze" /> Paiement en ligne
              sécurisé
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} className="text-bronze" /> Rappel la
              veille
            </span>
          </div>
        </Container>
      </section>

      {/* ---------- DEUX UNIVERS ---------- */}
      <section className="relative py-20 sm:py-24">
        <Container>
          <SectionTitle
            center
            eyebrow="Deux univers"
            title="Une même attention, deux façons de prendre soin de vous"
            subtitle="La naturopathie soutient votre vitalité de l'intérieur ; le massage relâche, enveloppe et accompagne. Deux pratiques réunies dans un seul espace, sans les confondre."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Link
              href="/naturopathie"
              className="group relative overflow-hidden rounded-3xl border border-bronze/25 bg-forest/60 transition-colors hover:border-bronze/50"
            >
              <Image
                src="/images/naturo.jpg"
                alt=""
                width={800}
                height={260}
                className="h-52 w-full object-cover opacity-55 transition-opacity group-hover:opacity-70"
              />
              <div className="p-7">
                <Leaf size={24} className="text-sage" />
                <h3 className="mt-4 font-serif text-2xl text-cream">
                  Naturopathie — en visio
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">
                  Bilan de vitalité, conseils d&apos;hygiène de vie et suivi
                  personnalisé, où que vous soyez.
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-cream/70">
                  <li>· Premier rendez-vous de 1h30, puis suivis d&apos;1h</li>
                  <li>· Lien visio envoyé automatiquement après paiement</li>
                  <li>· Rappel la veille, sans démarche de votre côté</li>
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-glow">
                  Découvrir la naturopathie{" "}
                  <ChevronRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>

            <Link
              href="/massages"
              className="group relative overflow-hidden rounded-3xl border border-bronze/25 bg-forest/60 transition-colors hover:border-bronze/50"
            >
              <Image
                src="/images/massage-domicile.jpg"
                alt=""
                width={800}
                height={260}
                className="h-52 w-full object-cover opacity-55 transition-opacity group-hover:opacity-70"
              />
              <div className="p-7">
                <Heart size={24} className="text-sage" />
                <h3 className="mt-4 font-serif text-2xl text-cream">
                  Massage — à domicile
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">
                  Prénatal, postnatal, bébé — je me déplace chez vous
                  avec tout le matériel.
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-cream/70">
                  <li>· Tarif kilométrique transparent et calculé pour vous</li>
                  <li>· Forfait bébé 4 séances ou séance à l&apos;unité</li>
                  <li>· Tout le matériel est prévu</li>
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-glow">
                  Découvrir les massages{" "}
                  <ChevronRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* ---------- COMMENT ÇA SE PASSE ---------- */}
      <section className="relative py-20 sm:py-24">
        <HaloStrong className="left-1/2 top-0 h-[380px] w-[900px] -translate-x-1/2" />
        <Container className="relative">
          <SectionTitle
            center
            eyebrow="En pratique"
            title="Comment ça se passe ?"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {etapes.map((e, i) => (
              <Card key={e.titre} className="relative">
                <span className="absolute right-6 top-6 font-serif text-4xl text-bronze/25">
                  0{i + 1}
                </span>
                <e.icon size={22} className="text-bronze" />
                <h3 className="mt-4 font-serif text-lg text-cream">
                  {e.titre}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cream/60">
                  {e.texte}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- ZONE DE DÉPLACEMENT ---------- */}
      <section className="relative py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge>Déplacements</Badge>
              <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl">
                Des kilomètres clairs, sans surprise
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-cream/65">
                Les 15 premiers kilomètres sont inclus dans le prix de la
                séance. Au-delà, le supplément est de 0,55&nbsp;€ par
                kilomètre, calculé automatiquement depuis votre adresse lors
                de la réservation. Vous connaissez le montant exact avant de
                confirmer.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/massages#zone">
                  Voir la zone de déplacement
                </ButtonLink>
                <ButtonLink href="/massages" variant="ghost">
                  Les massages
                </ButtonLink>
              </div>
            </div>
            <Card className="p-8">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">
                <MapPin size={14} /> Aperçu du supplément
              </p>
              <div className="mt-5">
                <DistancePreview />
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* ---------- ATELIER LSF ---------- */}
      <section className="relative py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <Image
                src="/images/mains-bebe.jpg"
                alt="Main de femme et main de bébé"
                width={800}
                height={520}
                className="w-full rounded-3xl border border-bronze/25 object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <Badge>Atelier bébé signes</Badge>
              <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl">
                Parler avec bébé avant les mots
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-cream/65">
                L&apos;atelier de langue des signes française pour bébé vous
                donne les signes essentiels du quotidien — besoins, émotions,
                envies — pour communiquer avec votre tout-petit dès ses
                premiers mois.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-cream/70">
                <li className="flex items-center gap-2.5">
                  <Hand size={15} className="text-bronze" /> À domicile, en
                  collectif ou en visio
                </li>
                <li className="flex items-center gap-2.5">
                  <Video size={15} className="text-bronze" /> Supports vidéo
                  signés et sous-titrés
                </li>
              </ul>
              <div className="mt-7">
                <ButtonLink href="/atelier-lsf">
                  Découvrir l&apos;atelier
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- À PROPOS ---------- */}
      <section className="relative py-20 sm:py-24">
        <HaloStrong className="left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2" />
        <Container className="relative flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Entre mes mains"
            width={240}
            height={153}
            className="h-[130px] w-auto sm:h-[150px]"
          />
          <LeafDivider className="mt-8" />
          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-cream/65">
            {SITE.name} réunit trois univers qui se répondent : la
            naturopathie, pour comprendre et soutenir votre vitalité ; le
            massage bien-être, pour relâcher et accompagner les grands
            moments de la vie ; et les ateliers de signes associés à la
            parole, pour offrir à bébé ses premiers mots, avec les mains.
            <br />
            <br />
            Une approche douce, fondée sur l&apos;écoute, le respect du rythme
            de chacun et des gestes précis, du tout-petit à l&apos;adulte.
          </p>
          <div className="mt-8">
            <ButtonLink href="/contact" variant="ghost">
              Me contacter
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="relative overflow-hidden py-24">
        <Image
          src="/images/bebe.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep via-forest-deep/70 to-forest-deep" />
        <Container className="relative flex flex-col items-center text-center">
          <h2 className="max-w-2xl font-serif text-3xl font-medium leading-tight text-cream sm:text-5xl">
            Prête à vous accorder ce moment&nbsp;?
          </h2>
          <p className="mt-5 max-w-lg text-[15px] text-cream/65">
            Réservez votre consultation ou votre massage en quelques clics — ou
            écrivez-moi pour en parler.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/reserver">Réserver en ligne</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Poser une question
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
