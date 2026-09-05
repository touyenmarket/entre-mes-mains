"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Baby, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Blocs de précautions (textes validés avec la praticienne) ---------- */

type Bloc = { emoji: string; titre: string; points: string[] };

const BLOC_GENERAL: Bloc = {
  emoji: "🌿",
  titre: "Informations importantes – Précautions & contre-indications",
  points: [
    "Les massages proposés sont exclusivement des massages de bien-être à visée de détente et de relaxation. Ils ne constituent ni un acte médical, ni un soin thérapeutique et ne se substituent en aucun cas à un diagnostic, un traitement ou un suivi par un professionnel de santé.",
  ],
};

const BLOC_RESPONSABILITE: Bloc = {
  emoji: "⚠️",
  titre: "Responsabilité & sécurité",
  points: [
    "Il appartient au bénéficiaire de la prestation — ou au représentant légal lorsqu’il s’agit d’un enfant — de communiquer avant la séance toute information de santé pertinente, tout traitement en cours et toute contre-indication connue.",
    "En cas de doute concernant la compatibilité de la prestation avec l’état de santé de la personne ou de l’enfant, la séance pourra être différée dans l’attente de l’avis d’un professionnel de santé.",
    "La priorité reste à chaque instant la sécurité, le confort et le bien-être de la personne massée.",
  ],
};

const BLOC_PRENATAL: Bloc = {
  emoji: "🤰",
  titre: "Massage bien-être prénatal",
  points: [
    "Le massage prénatal est proposé à partir du deuxième trimestre de grossesse, dans le cadre d’une grossesse ne présentant pas de contre-indication particulière.",
    "En cas de grossesse à risque, complication, suivi médical particulier, symptômes inhabituels ou doute concernant la possibilité de recevoir un massage, un avis favorable du médecin ou de la sage-femme sera demandé avant la séance.",
    "La future maman s’engage à communiquer toute information utile concernant sa grossesse et son état de santé.",
  ],
};

const BLOC_POSTNATAL: Bloc = {
  emoji: "🤱",
  titre: "Massage bien-être postnatal",
  points: [
    "Le massage postnatal est proposé à partir de 6 semaines après l’accouchement, sous réserve d’une récupération normale et de l’absence de contre-indication.",
    "En cas de césarienne, complication post-partum, cicatrisation en cours, infection, fièvre, douleur inexpliquée ou problème de santé particulier, la séance pourra être reportée et un avis médical demandé avant sa réalisation.",
    "La cliente s’engage à signaler toute information concernant son accouchement, son post-partum ou son état de santé susceptible de nécessiter une précaution particulière.",
  ],
};

const BLOC_BEBE: Bloc = {
  emoji: "👶",
  titre: "Massage bien-naître bébé",
  points: [
    "La séance est adaptée au rythme et aux besoins de bébé.",
    "Par mesure de précaution, le massage sera reporté en cas de maladie, fièvre, infection, état inhabituel de bébé ou vaccination récente.",
    "En présence d’un problème de santé particulier ou en cas de doute, l’avis d’un professionnel de santé pourra être demandé avant la séance.",
    "Le parent s’engage à signaler toute information concernant la santé de son enfant susceptible de nécessiter une précaution ou de constituer une contre-indication au massage.",
  ],
};

/* ---------- Données des massages ---------- */

type Massage = {
  id: string;
  icon: LucideIcon;
  titre: string;
  accroche: string;
  duree: string; // durée indicative, à valider
  prix: string;
  description: string[];
  precautions: Bloc[];
};

const MASSAGES: Massage[] = [
  {
    id: "prenatal",
    icon: Heart,
    titre: "Massage bien-être prénatal",
    accroche:
      "Pour accompagner les transformations du corps, apaiser les tensions et se relier à son bébé.",
    duree: "60 min",
    prix: "À partir de 75 €",
    description: [
      "Un massage doux et enveloppant, pensé pour accompagner les transformations du corps pendant la grossesse : apaiser les tensions du dos, des jambes et de la nuque, favoriser la détente et prendre un temps pour soi et pour son bébé.",
      "Les positions sont adaptées à l’avancée de la grossesse, avec un toucher respectueux et sécurisé.",
    ],
    precautions: [BLOC_PRENATAL],
  },
  {
    id: "postnatal",
    icon: Heart,
    titre: "Massage bien-être postnatal",
    accroche:
      "Pour récupérer en douceur après l’accouchement et retrouver son souffle.",
    duree: "60 min",
    prix: "À partir de 75 €",
    description: [
      "Après l’accouchement, le corps a besoin de douceur. Ce massage aide à récupérer, relâche les zones sollicitées (dos, épaules, bassin) et offre un vrai moment de répit à la jeune maman.",
      "Il est proposé à partir de 6 semaines après l’accouchement, selon votre récupération et en l’absence de contre-indication.",
    ],
    precautions: [BLOC_POSTNATAL],
  },
  {
    id: "bebe",
    icon: Baby,
    titre: "Massage bien-être bébé",
    accroche:
      "Un moment de détente et de complicité, doux et progressif, à l’unité.",
    duree: "30 min",
    prix: "À partir de 45 €",
    description: [
      "Des gestes doux et progressifs sur le corps de bébé, pour l’apaiser, favoriser son bien-être et renforcer votre lien.",
      "La séance suit le rythme de bébé, dans son environnement familier.",
    ],
    precautions: [BLOC_BEBE],
  },
  {
    id: "bebe_forfait",
    icon: Baby,
    titre: "Massage bébé — forfait 4 séances",
    accroche:
      "Quatre séances à planifier librement, pour installer le rituel en douceur.",
    duree: "4 × 30 min",
    prix: "160 € les 4 séances",
    description: [
      "Quatre séances à planifier librement pour installer le rituel du massage dans le quotidien de bébé, à son rythme.",
      "La régularité renforce les bienfaits et la complicité. Le forfait est facturé en une seule fois.",
    ],
    precautions: [BLOC_BEBE],
  },
];

/* ---------- Composant ---------- */

export default function MassageAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-4">
      {MASSAGES.map((m) => {
        const open = openId === m.id;
        const Icon = m.icon;
        const blocs = [...m.precautions, BLOC_GENERAL, BLOC_RESPONSABILITE];
        return (
          <div
            key={m.id}
            className={cn(
              "glass-card overflow-hidden rounded-2xl transition-colors",
              open && "border-bronze/60",
            )}
          >
            <button
              onClick={() => setOpenId(open ? null : m.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-4 p-6 text-left"
            >
              <Icon size={22} className="shrink-0 text-sage" />
              <span className="flex-1">
                <span className="block font-serif text-lg leading-snug text-cream">
                  {m.titre}
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-cream/55">
                  {m.accroche}
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-glow">
                {m.prix}
              </span>
              <ChevronDown
                size={18}
                className={cn(
                  "shrink-0 text-bronze transition-transform",
                  open && "rotate-180",
                )}
              />
            </button>

            {open && (
              <div className="border-t border-bronze/15 px-6 pb-7 pt-5">
                <p className="inline-flex items-center gap-2 rounded-full border border-bronze/30 px-3 py-1 text-xs font-semibold text-cream/75">
                  <Clock size={13} className="text-bronze" /> Durée indicative
                  : {m.duree}
                </p>

                <div className="mt-4 space-y-3">
                  {m.description.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-cream/65">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-6 space-y-5">
                  {blocs.map((b, i) => (
                    <div key={i}>
                      <h4 className="text-[13px] font-semibold uppercase tracking-wide text-glow">
                        {b.emoji} {b.titre}
                      </h4>
                      <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-cream/60">
                        {b.points.map((p, j) => (
                          <li
                            key={j}
                            className="list-disc pl-5 marker:text-bronze/60"
                          >
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <Link
                  href="/reserver"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-bronze px-6 py-2.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-glow"
                >
                  Réserver ce massage
                </Link>
              </div>
            )}
          </div>
        );
      })}

      <p className="text-center text-xs text-cream/40">
        Tarifs et durées provisoires — les valeurs définitives seront
        affichées prochainement.
      </p>
    </div>
  );
}
