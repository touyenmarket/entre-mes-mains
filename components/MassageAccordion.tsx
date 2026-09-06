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
    "Le massage prénatal est proposé à partir du 4e mois de grossesse, dans le cadre d’une grossesse ne présentant pas de contre-indication particulière.",
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
      "À partir du 4e mois — un relâchement du dos, centré sur votre bien-être.",
    duree: "1h15",
    prix: "60 €",
    description: [
      "C’est un massage relaxant : il apaise le système nerveux, libère le stress, l’angoisse et la fatigue, et soulage différents maux de la grossesse.",
      "C’est un relâchement total, une pause centrée sur votre bien-être et une connexion à votre corps en plein changement.",
      "Il s’agit d’un massage du dos afin de préserver votre intimité (toutes les femmes n’aiment pas être touchées au ventre, lieu de vie de leur bébé).",
      "Le massage se fait allongée sur le côté, avec une huile végétale bio et sans huile essentielle.",
    ],
    precautions: [BLOC_PRENATAL],
  },
  {
    id: "postnatal",
    icon: Heart,
    titre: "Massage bien-être postnatal",
    accroche:
      "Pour toute femme dont le corps a porté la vie — récemment ou il y a longtemps.",
    duree: "1h30",
    prix: "75 €",
    description: [
      "Pour la femme après l’accouchement, et aussi pour celle qui a donné naissance il y a des années. Celles dont le corps, le féminin, a traversé des violences, une fausse couche, une IVG/IMG, une PMA, une transition de vie — ou simplement le désir de se reconnecter à son corps.",
      "Le massage soulage les tensions, nourrit la peau, aide à lâcher-prise, évacuer le stress et relancer les énergies.",
      "Il s’agit d’un massage du dos et des bras, à l’huile végétale bio et sans huile essentielle.",
      "Outils utilisés : bol tibétain, diapason, rebozo.",
    ],
    precautions: [BLOC_POSTNATAL],
  },
  {
    id: "bebe",
    icon: Baby,
    titre: "Massage bien-naître pour bébé",
    accroche:
      "En individuel, à domicile — vous choisissez le thème de la séance.",
    duree: "1h à 2h",
    prix: "80 €",
    description: [
      "Le massage libère les hormones du bien-être, favorise l’éveil des sens, le calme, l’endormissement et le soulagement. C’est se connecter l’un à l’autre et être à l’écoute de son bébé.",
      "Thèmes au choix : pour bien dormir ; pour l’éveil moteur ; spécifique maux de ventre ; libérer les émotions.",
      "La séance comprend un temps d’échange avec le parent, un temps autour du thème choisi, l’apprentissage et la pratique du massage, puis des postures de baby yoga en fin de séance.",
    ],
    precautions: [BLOC_BEBE],
  },
  {
    id: "bebe_forfait",
    icon: Baby,
    titre: "Massage bébé — forfait 4 séances",
    accroche:
      "Un accompagnement complet pour suivre l’évolution de bébé.",
    duree: "4 × 1h à 2h",
    prix: "280 €",
    description: [
      "Le massage bébé est un rituel précieux qui crée du lien, apaise, soutient le bien physique et émotionnel de votre enfant à chaque étape.",
      "Le forfait permet de suivre l’évolution de bébé, d’adapter les massages à ses besoins et d’installer un rituel durable. Soit 70 € la séance.",
      "Chaque séance : échange avec le parent, thème choisi, apprentissage du massage, postures de baby yoga.",
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
                  href="/reserver?type=massage"
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
