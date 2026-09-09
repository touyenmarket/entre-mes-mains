import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/config";
import { ZONE_FRANCHE_KM, TARIF_KM_EUR } from "@/lib/tarification";

const activites = [
  { href: "/naturopathie", label: "Naturopathie en visio" },
  { href: "/massages", label: "Massages à domicile" },
  { href: "/atelier-lsf", label: "Atelier de bébé signes" },
  { href: "/reserver", label: "Réserver" },
];

const infos = [
  { href: "/mes-rendez-vous", label: "Mes rendez-vous" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "Conditions générales" },
  { href: "/confidentialite", label: "Confidentialité (RGPD)" },
];

export default function Footer() {
  return (
    <footer className="border-t border-bronze/15 bg-forest-deep">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Image
            src="/images/logo.png"
            alt="Entre mes mains"
            width={200}
            height={128}
            className="h-[148px] w-auto drop-shadow-[0_6px_20px_rgba(232,213,163,0.5)]"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">
            {SITE.tagline}. Consultations en visio, massages à domicile pour
            vous et pour bébé, atelier de langue des signes française.
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs text-cream/55">
            <Image
              src="/images/signante.png"
              alt=""
              width={18}
              height={19}
              className="h-[19px] w-auto shrink-0"
            />
            Prestations accessibles aux personnes sourdes et malentendantes
          </p>
          <p className="mt-4 text-xs text-cream/40">
            {SITE.city} · {SITE.region}
            <br />
            {ZONE_FRANCHE_KM} km inclus, puis{" "}
            {TARIF_KM_EUR.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            €/km au-delà.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">
            Activités
          </p>
          <ul className="mt-4 space-y-2.5">
            {activites.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-cream/65 transition-colors hover:text-cream"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">
            Informations
          </p>
          <ul className="mt-4 space-y-2.5">
            {infos.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-cream/65 transition-colors hover:text-cream"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-bronze/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} {SITE.name} — Tous droits réservés · Site
        en cours de développement
      </div>
    </footer>
  );
}
