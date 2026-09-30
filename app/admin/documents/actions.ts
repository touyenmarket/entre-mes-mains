"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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

  const userDb = await createClient();
  let db = userDb;
  try {
    db = createAdminClient();
  } catch {
    db = userDb;
  }
  const numero = await prochainNumero(kind, db);
  const { data, error } = await db
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
          ? "Ce document est un devis. Il ne vaut pas une véritable facture."
          : "Paiement à réception / selon accord."),
      statut: envoyer ? "envoye" : "brouillon",
    })
    .select("id, numero")
    .single();

  if (error || !data) {
    const msg = encodeURIComponent(
      (error?.message || error?.code || "save").slice(0, 160)
    );
    redirect(`/admin/documents?erreur=${msg}`);
  }

  if (envoyer && clientEmail) {
    try {
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
          ? "Ce document est un devis. Il ne vaut pas une véritable facture."
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
    } catch (e) {
      console.error("email document", e);
    }
  }

  redirect(`/admin/documents?ok=${data.numero}`);
}

export async function transformerDevisEnFacture(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) redirect("/connexion");
  const id = String(formData.get("id") || "");
  const emailSaisi = String(formData.get("client_email") || "").trim();
  const envoyer = String(formData.get("envoyer") || "") === "oui";

  const userDb = await createClient();
  let db = userDb;
  try {
    db = createAdminClient();
  } catch {
    db = userDb;
  }

  const { data: devis } = await db
    .from("documents_manuels")
    .select("*")
    .eq("id", id)
    .eq("kind", "devis")
    .maybeSingle();
  if (!devis) redirect("/admin/documents?erreur=introuvable");

  const clientEmail = emailSaisi || devis.client_email || "";
  const numero = await prochainNumero("facture", db);
  const { data: facture, error } = await db
    .from("documents_manuels")
    .insert({
      kind: "facture",
      numero,
      client_nom: devis.client_nom,
      client_email: clientEmail,
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
      statut: envoyer ? "envoye" : "emise",
      devis_source_id: devis.id,
    })
    .select("id, numero")
    .single();

  if (error || !facture) {
    const msg = encodeURIComponent((error?.message || "save").slice(0, 160));
    redirect(`/admin/documents?erreur=${msg}`);
  }

  await db.from("documents_manuels").update({ statut: "transforme" }).eq("id", devis.id);

  if (envoyer && clientEmail) {
    try {
    const lignes = Array.isArray(devis.lignes) ? devis.lignes : undefined;
    const bytes = await genererPdfFacture({
      numeroFacture: numero,
      numeroReservation: "",
      dateEmission: new Date().toLocaleDateString("fr-FR"),
      clientNom: devis.client_nom,
      clientEmail,
      clientAdresse: devis.client_adresse,
      prestationLabel: devis.designation,
      creneauLabel: devis.details || "",
      baseCents: devis.montant_ht_cents || devis.montant_ttc_cents,
      supplementKmCents: 0,
      distanceKm: null,
      totalCents: devis.montant_ttc_cents,
      kind: "facture",
      tvaMention: devis.tva_mention,
      paiementMention: "Paiement à réception / selon accord.",
      tvaCents: devis.tva_cents,
      lignes,
    });
    await envoyerEmail({
      to: clientEmail,
      subject: `Facture ${numero} — ${SITE.name}`,
      text: `Bonjour ${devis.client_nom},\n\nVeuillez trouver ci-joint votre facture ${numero}.\n\n${SITE.name}`,
      html: `<p>Bonjour ${devis.client_nom},</p><p>Veuillez trouver ci-joint votre facture <strong>${numero}</strong>.</p><p>${SITE.name}</p>`,
      attachments: [
        {
          filename: `facture-${numero}.pdf`,
          content: Buffer.from(bytes),
          contentType: "application/pdf",
        },
      ],
    });
    } catch (e) {
      console.error("email facture", e);
    }
  }

  redirect(`/admin/documents?ok=${numero}`);
}
