import Image from "next/image";
import { MapPin, Music, Sun, Armchair } from "lucide-react";
import {
  Container,
  Badge,
  SectionTitle,
  Card,
  ButtonLink,
  HaloStrong,
} from "@/components/ui";
import DistancePreview from "@/components/DistancePreview";
import MassageAccordion from "@/components/MassageAccordion";
import { ZONE_FRANCHE_KM } from "@/lib/tarification";

const pratique = [
  {
    icon: Armchair,
    titre: "Tout le matériel est prévu",
    texte: "Table, huiles, musique, serviettes : je viens avec tout.",
  },
  {
    icon: Sun,
    titre: "Votre cocon, chez vous",
    texte:
      "La séance s'installe dans votre salon : lumière tamisée, calme, chaleur.",
  },
  {
    icon: Music,
    titre: "Il suffit d'un espace calme",
    texte:
      "Une pièce au calme et environ une heure devant vous : c'est tout ce qu'il faut.",
  },
];

export default function MassagesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/massage-dos.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/60 to-forest-deep" />
        <HaloStrong className="left-1/2 top-1/3 h-[400px] w-[640px] -translate-x-1/2" />
        <Container className="relative flex flex-col items-center py-24 text-center sm:py-28">
          <Badge>Massages à domicile</Badge>
          <h1 className="mt-6 max-w-2xl font-serif text-4xl font-medium leading-[1.15] text-cream sm:text-5xl">
            Le bien-être, chez vous
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-cream/70">
            Je me déplace à votre domicile avec tout le matériel : massages
            prénatal, postnatal et bébé, au rythme de chacun.
          </p>
          <div className="mt-8">
            <ButtonLink href="/reserver?type=massage">Réserver un massage</ButtonLink>
          </div>
          <p className="mt-7 flex items-center justify-center gap-2 text-xs font-medium text-sage-light">
            <Image
              src="/images/signante.png"
              alt=""
              width={32}
              height={34}
              className="h-[34px] w-auto shrink-0 drop-shadow-[0_2px_8px_rgba(232,213,163,0.45)]"
            />
            Massages accessibles aux personnes sourdes et malentendantes
          </p>
        </Container>
      </section>

      {/* MASSAGES (détail dépliable) */}
      <section className="relative py-20">
        <Container>
          <SectionTitle
            center
            eyebrow="Les massages"
            title="Choisissez le moment qui vous correspond"
            subtitle="Cliquez sur un massage pour découvrir son déroulé, sa durée et les précautions."
          />
          <MassageAccordion />
        </Container>
      </section>

      {/* ZONE & TARIF KM */}
      <section id="zone" className="relative scroll-mt-20 py-20">
        <HaloStrong className="left-1/2 top-1/4 h-[420px] w-[840px] -translate-x-1/2" />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge>Zone de déplacement</Badge>
              <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-cream sm:text-4xl">
                Un supplément kilométrique transparent
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-cream/65">
                Les {ZONE_FRANCHE_KM} premiers kilomètres sont inclus dans le
                prix de la séance. Au-delà, comptez 0,55&nbsp;€ par kilomètre
                parcouru — par exemple, 30&nbsp;km correspondent à un
                supplément de 8,25&nbsp;€.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-cream/65">
                Lors de la réservation, le supplément est calculé
                automatiquement depuis votre adresse exacte : vous validez en
                toute connaissance du montant final.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/reserver?type=massage">Réserver un massage</ButtonLink>
                <ButtonLink href="/contact" variant="ghost">
                  Une question sur la zone ?
                </ButtonLink>
              </div>
            </div>
            <Card className="p-8">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">
                <MapPin size={14} /> Estimer le supplément
              </p>
              <div className="mt-5">
                <DistancePreview />
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* PRATIQUE */}
      <section className="relative py-20">
        <Container>
          <SectionTitle
            center
            eyebrow="Côté pratique"
            title="Une séance clé en main"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pratique.map((p) => (
              <Card key={p.titre}>
                <p.icon size={22} className="text-bronze" />
                <h3 className="mt-4 font-serif text-lg text-cream">
                  {p.titre}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cream/60">
                  {p.texte}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <Container className="flex flex-col items-center text-center">
          <h2 className="max-w-xl font-serif text-3xl font-medium text-cream sm:text-4xl">
            S&apos;accorder une pause, sans bouger de chez soi
          </h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/reserver?type=massage">Réserver un massage</ButtonLink>
            <ButtonLink href="/atelier-lsf" variant="ghost">
              Découvrir l&apos;atelier de bébé signes
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
