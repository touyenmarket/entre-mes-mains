import { Mail, MapPin, Clock } from "lucide-react";
import {
  Container,
  SectionTitle,
  Card,
  HaloStrong,
} from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/config";
import { ZONE_FRANCHE_KM } from "@/lib/tarification";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="relative py-20 sm:py-24">
      <HaloStrong className="left-1/2 top-1/4 h-[400px] w-[800px] -translate-x-1/2" />
      <Container className="relative">
        <SectionTitle
          center
          eyebrow="Contact"
          title="Une question ? Parlons-en"
          subtitle="Un doute sur une prestation, une demande particulière, un créneau spécifique : écrivez-moi, je réponds rapidement."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* INFOS */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Card>
              <p className="flex items-center gap-3 text-sm text-cream/80">
                <Mail size={16} className="shrink-0 text-bronze" />
                {SITE.email}
              </p>
              <p className="mt-4 flex items-start gap-3 text-sm text-cream/80">
                <MapPin size={16} className="mt-0.5 shrink-0 text-bronze" />
                <span>
                  {SITE.adresse}
                  <br />
                  <span className="text-cream/55">{SITE.region}</span>
                </span>
              </p>
              <p className="mt-4 flex items-center gap-3 text-sm text-cream/80">
                <Clock size={16} className="shrink-0 text-bronze" />
                Sur rendez-vous
              </p>
            </Card>

            <Card>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">
                Zone d&apos;intervention — massages à domicile
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">
                Déplacements uniquement pour les massages à domicile, au
                départ de mon domicile situé entre Chartres et Châteaudun. Les{" "}
                {ZONE_FRANCHE_KM} premiers kilomètres sont inclus, puis 0,55 €
                par kilomètre au-delà.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/65">
                Au-delà de la zone couverte, parlons-en : une solution est
                souvent possible (déplacement groupé…).
              </p>
            </Card>
          </div>

          {/* FORMULAIRE */}
          <Card className="p-8 lg:col-span-3">
            <ContactForm />
          </Card>
        </div>
      </Container>
    </section>
  );
}
