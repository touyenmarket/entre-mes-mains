"use client";

import Link from "next/link";
import { supprimerModele } from "./actions";

export default function ModeleChip({ id, nom }: { id: string; nom: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-bronze/30 px-3 py-1 text-xs text-cream/80">
      <Link href={`/admin/documents?modele=${id}`} className="hover:text-glow">
        {nom}
      </Link>
      <form
        action={supprimerModele}
        onSubmit={(e) => {
          if (
            !confirm(
              `Supprimer le modèle « ${nom} » ? Cette action est définitive.`
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="ml-1 text-cream/40 hover:text-glow"
          aria-label={`Supprimer ${nom}`}
        >
          ×
        </button>
      </form>
    </span>
  );
}
