"use client";

import { transformerDevisEnFacture } from "./actions";

export default function ConvertDevisForm({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  return (
    <form
      action={transformerDevisEnFacture}
      className="flex flex-wrap items-center justify-end gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <input
        type="email"
        name="client_email"
        defaultValue={email}
        placeholder="Email pour l’envoi"
        className="w-44 rounded-lg border border-bronze/20 bg-forest-deep/40 px-2 py-1 text-xs text-cream"
      />
      <label className="flex items-center gap-1 text-[11px] text-cream/70">
        <input type="checkbox" name="envoyer" value="oui" />
        Envoyer
      </label>
      <button className="text-bronze hover:text-glow" type="submit">
        → Facture
      </button>
    </form>
  );
}
