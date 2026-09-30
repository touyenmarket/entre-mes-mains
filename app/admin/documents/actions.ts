"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { prochainNumero } from "@/lib/documents/numeros";
import { envoyerEmail } from "@/lib/email";
import { genererPdfFacture } from "@/lib/factures/pdf";
import { SITE } from "@/lib/config";

function eurosToCents(raw: string) {
  const n = Number(String(raw).replace(",", ".").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export async function creerDocumentManuel(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) redirect("/connexion");

  const kind = String(formData.get("kind") || "devis") as "devis" | "facture";
  const clientNom = String(formData.get("client_nom") || "").trim();
  const clientEmail = String(formData.get("client_email") || "").trim();
  const clientAdresse = String(formData.get("client_adresse") || "").trim();
  const designation = String(formData.get("designation") || "").trim();
  const dateDoc = String(formData.get("date_doc") || "");
  const quantite = Math.max(1, Number(String(formData.get("quantite") || "1").replace(",", ".")) || 1);
  const pu = eurosToCents(String(formData.get("prix_unitaire") || "0"));
  const montant = Math.round(quantite * pu);
  const tvaTaux = 0;
  const paiement = String(formData.get("paiement_mention") || "").trim();
  const envoyer = String(formData.get("envoyer") || "") === "oui";
  const details = dateDoc ? `Date du document : ${dateDoc}` : "";

  if (!clientNom || !designation || montant <= 0) {
    redirect("/admin/documents?erreur=champs");
  }

  const tvaCents = 0;
  const ht = montant;
  const tvaMention = "TVA non applicable — article 293-B du CGI";

  const admin = createAdminClient();
  const numero = await prochainNumero(kind);
  const { data, error } = await admin
    .from("documents_manuels")
    .insert({
      kind,
      numero,
      client_nom: clientNom,
      client_email: clientEmail,
      client_adresse: clientAdresse || null,
      designation,
      details: details || null,
      lignes: [
        {
          libelle: designation,
          quantite,
          prixUnitaireCents: pu,
          montantCents: montant,
        },
      ],
      montant_ht_cents: ht,
      tva_taux: tvaTaux,
      tva_cents: tvaCents,
      montant_ttc_cents: montant,
      tva_mention: tvaMention,
      paiement_mention:
        paiement ||
        (kind === "devis"
          ? "Ce document est un devis. Il ne vaut pas facture."
          : "Paiement à réception / selon accord."),
      statut: envoyer ? "envoye" : "brouillon",
    })
    .select("id, numero")
    .single();

  if (error || !data) {
    redirect("/admin/documents?erreur=save");
  }

  if (envoyer && clientEmail) {
    const bytes = await genererPdfFacture({
      numeroFacture: numero,
      numeroReservation: "",
      dateEmission: dateDoc
        ? new Date(dateDoc).toLocaleDateString("fr-FR")
        : new Date().toLocaleDateString("fr-FR"),
      clientNom,
      clientEmail,
      clientAdresse,
      prestationLabel: designation,
      creneauLabel: details,
      baseCents: ht || montant,
      supplementKmCents: 0,
      distanceKm: null,
      totalCents: montant,
      kind,
      tvaMention,
      paiementMention:
        paiement ||
        (kind === "devis"
          ? "Ce document est un devis. Il ne vaut pas facture."
          : "Paiement à réception / selon accord."),
      tvaCents,
      lignes: [
        {
          libelle: designation,
          quantite,
          prixUnitaireCents: pu,
          montantCents: montant,
        },
      ],
    });
    await envoyerEmail({
      to: clientEmail,
      subject:
        kind === "devis"
          ? `Devis ${numero} — ${SITE.name}`
          : `Facture ${numero} — ${SITE.name}`,
      text: `Bonjour ${clientNom},\n\nVeuillez trouver ci-joint votre ${kind} ${numero}.\n\n${SITE.name}`,
      html: `<p>Bonjour ${clientNom},</p><p>Veuillez trouver ci-joint votre ${kind} <strong>${numero}</strong>.</p><p>${SITE.name}</p>`,
      attachments: [
        {
          filename: `${kind}-${numero}.pdf`,
          content: Buffer.from(bytes),
          contentType: "application/pdf",
        },
      ],
    });
  }

  redirect(`/admin/documents?ok=${data.numero}`);
}

export async function transformerDevisEnFacture(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) redirect("/connexion");
  const id = String(formData.get("id") || "");
  const admin = createAdminClient();
  const { data: devis } = await admin
    .from("documents_manuels")
    .select("*")
    .eq("id", id)
    .eq("kind", "devis")
    .maybeSingle();
  if (!devis) redirect("/admin/documents?erreur=introuvable");

  const numero = await prochainNumero("facture");
  await admin.from("documents_manuels").insert({
    kind: "facture",
    numero,
    client_nom: devis.client_nom,
    client_email: devis.client_email,
    client_adresse: devis.client_adresse,
    designation: devis.designation,
    details: devis.details,
    lignes: devis.lignes,
    montant_ht_cents: devis.montant_ht_cents,
    tva_taux: devis.tva_taux,
    tva_cents: devis.tva_cents,
    montant_ttc_cents: devis.montant_ttc_cents,
    tva_mention: devis.tva_mention,
    paiement_mention: "Paiement à réception / selon accord.",
    statut: "emise",
    devis_source_id: devis.id,
  });
  await admin
    .from("documents_manuels")
    .update({ statut: "transforme" })
    .eq("id", devis.id);
  redirect(`/admin/documents?ok=${numero}`);
}
