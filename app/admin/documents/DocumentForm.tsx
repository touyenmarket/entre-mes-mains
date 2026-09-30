"use client";

import { creerDocumentManuel } from "./actions";

const field =
  "w-full rounded-xl border border-bronze/20 bg-forest-deep/40 px-4 py-2.5 text-sm text-cream";

export type ModelePrefill = {
  kind?: "devis" | "facture";
  client_nom?: string;
  client_email?: string;
  client_adresse?: string;
  designation?: string;
  quantite?: string;
  prix_unitaire?: string;
  paiement_mention?: string;
};

export default function DocumentForm({ modele }: { modele?: ModelePrefill }) {
  return (
    <form action={creerDocumentManuel} className="glass-card mt-6 space-y-4 rounded-2xl p-6">
      <div className="flex flex-wrap gap-4 text-sm text-cream">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="kind"
            value="devis"
            defaultChecked={!modele?.kind || modele.kind === "devis"}
          />
          Devis
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="kind"
            value="facture"
            defaultChecked={modele?.kind === "facture"}
          />
          Facture
        </label>
      </div>
      <input
        type="date"
        name="date_doc"
        defaultValue={new Date().toISOString().slice(0, 10)}
        className={field}
      />
      <input
        name="client_nom"
        required
        placeholder="Client / structure"
        defaultValue={modele?.client_nom || ""}
        className={field}
      />
      <input
        name="client_email"
        type="email"
        placeholder="Email du destinataire"
        defaultValue={modele?.client_email || ""}
        className={field}
      />
      <textarea
        name="client_adresse"
        rows={2}
        placeholder="Adresse du client"
        defaultValue={modele?.client_adresse || ""}
        className={field}
      />
      <textarea
        name="designation"
        required
        rows={3}
        placeholder="Description de la prestation"
        defaultValue={modele?.designation || ""}
        className={field}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="quantite"
          required
          defaultValue={modele?.quantite || "1"}
          placeholder="Quantité"
          className={field}
        />
        <input
          name="prix_unitaire"
          required
          defaultValue={modele?.prix_unitaire || ""}
          placeholder="Prix unitaire €"
          className={field}
        />
      </div>
      <input
        name="paiement_mention"
        placeholder="Mention paiement (optionnel)"
        defaultValue={modele?.paiement_mention || ""}
        className={field}
      />
      <input
        name="nom_modele"
        placeholder="Nom du modèle (si enregistrement)"
        className={field}
      />
      <label className="flex items-center gap-2 text-sm text-cream/80">
        <input type="checkbox" name="sauver_modele" value="oui" />
        Enregistrer comme modèle réutilisable
      </label>
      <label className="flex items-center gap-2 text-sm text-cream/80">
        <input type="checkbox" name="envoyer" value="oui" />
        Envoyer le PDF par email maintenant
      </label>
      <p className="text-xs text-cream/45">
        En-tête, SIRET, mail, TVA 293-B et IBAN sont déjà préremplis.
      </p>
      <button
        type="submit"
        className="rounded-full bg-bronze px-6 py-2.5 text-sm font-semibold text-forest-deep hover:bg-glow"
      >
        Générer
      </button>
    </form>
  );
}
