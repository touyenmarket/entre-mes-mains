"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type RdvAgenda = {
  id: string;
  numero: string;
  statut: string;
  total: string;
  quand: string;
  heure: string;
  jour: string;
  client: string;
  email: string;
  prestation: string;
  visio: string | null;
};

const JOURS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

export default function AgendaMois({
  annee,
  mois,
  prev,
  next,
  jours,
  rdv,
  selection,
}: {
  annee: number;
  mois: number;
  prev: string;
  next: string;
  jours: { iso: string; num: number; hors: boolean }[];
  rdv: RdvAgenda[];
  selection: string | null;
}) {
  const parJour = new Map<string, RdvAgenda[]>();
  for (const r of rdv) {
    const list = parJour.get(r.jour) || [];
    list.push(r);
    parJour.set(r.jour, list);
  }
  const titre = new Date(annee, mois - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  const duJour = selection ? parJour.get(selection) || [] : [];

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
      <div>
        <div className="flex items-center justify-between">
          <Link href={prev} className="text-sm text-bronze hover:text-glow">
            ← mois
          </Link>
          <p className="font-serif text-xl capitalize text-cream">{titre}</p>
          <Link href={next} className="text-sm text-bronze hover:text-glow">
            mois →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-cream/40">
          {JOURS.map((j) => (
            <span key={j}>{j}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {jours.map((j) => {
            const n = parJour.get(j.iso)?.length || 0;
            const actif = selection === j.iso;
            return (
              <Link
                key={j.iso}
                href={`/admin/agenda?mois=${annee}-${String(mois).padStart(2, "0")}&jour=${j.iso}`}
                className={cn(
                  "flex h-11 flex-col items-center justify-center rounded-lg text-sm",
                  j.hors && "text-cream/25",
                  !j.hors && "text-cream/80",
                  n > 0 && "bg-bronze/25 text-glow",
                  actif && "ring-1 ring-bronze",
                )}
              >
                {j.num}
                {n > 0 && (
                  <span className="text-[9px] leading-none text-glow">{n}</span>
                )}
              </Link>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-cream/45">
          Les jours bronze ont au moins un rendez-vous.
        </p>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-cream">
          {selection
            ? new Date(selection + "T12:00:00").toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : "Choisis un jour"}
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {selection && duJour.length === 0 && (
            <p className="text-sm text-cream/50">Aucun rendez-vous ce jour.</p>
          )}
          {duJour.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-bronze/25 bg-forest/50 p-4"
            >
              <p className="font-serif text-lg text-cream">
                {r.heure} · {r.prestation}
              </p>
              <p className="mt-1 text-sm text-cream/70">
                {r.client} · {r.email}
              </p>
              <p className="mt-1 text-xs text-cream/50">
                {r.numero} · {r.statut} · {r.total}
              </p>
              {r.visio ? (
                <a
                  href={r.visio}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex rounded-full bg-bronze px-4 py-2 text-sm font-semibold text-forest-deep"
                >
                  Rejoindre la visio
                </a>
              ) : (
                <p className="mt-3 text-xs text-cream/40">
                  Pas de lien visio (massage à domicile ou pas encore payé).
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
