import { createAdminClient } from "@/lib/supabase/admin";
import { envoyerEmail } from "@/lib/email";
import { assurerLienVisio } from "@/lib/visio";
import { emettreFactureSiBesoin } from "@/lib/factures/emettre";
import { genererPdfFacture } from "@/lib/factures/pdf";
import { formatDateHeure, euros } from "@/lib/dates";
import { SITE } from "@/lib/config";

export async function envoyerEmailReservation(reservationId: string) {
  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
    .select(
      "*, prestations(label, format), creneaux(debut_at), profiles(prenom, nom, email)"
    )
    .eq("id", reservationId)
    .maybeSingle();
  if (!reservation) return;

  const pre = reservation.prestations as { label?: string } | null;
  const cr = reservation.creneaux as { debut_at?: string } | null;
  const dest = reservation.profiles as { prenom?: string; email?: string } | null;
  if (!dest?.email) return;

  const quand = cr?.debut_at ? formatDateHeure(cr.debut_at) : "";
  const mode =
    reservation.paiement_provider === "especes"
      ? "Paiement choisi : en espèces, le jour du rendez-vous."
      : "Paiement en ligne à l’étape suivante (ou plus tard depuis votre espace).";

  await envoyerEmail({
    to: dest.email,
    subject: `Réservation ${reservation.numero} enregistrée — ${SITE.name}`,
    text: [
      `Bonjour ${dest.prenom || ""},`,
      "",
      `Votre réservation est enregistrée : ${pre?.label || ""} — ${quand}.`,
      `Montant : ${euros(reservation.total_cents)}.`,
      mode,
      "",
      "Un second email partira au règlement (avec la facture si paiement en ligne).",
      "",
      SITE.name,
      SITE.email,
    ].join("\n"),
    html: `
      <p>Bonjour ${dest.prenom || ""},</p>
      <p>Votre réservation est enregistrée :</p>
      <p><strong>${pre?.label || ""}</strong><br/>${quand}<br/>${euros(reservation.total_cents)}</p>
      <p>${mode}</p>
      <p>Un second email partira au règlement (avec la facture si paiement en ligne).</p>
      <p>${SITE.name}<br/>${SITE.email}</p>
    `,
  });
}

export async function finaliserApresPaiement(reservationId: string) {
  const admin = createAdminClient();
  const visio = await assurerLienVisio(reservationId);
  const facture = await emettreFactureSiBesoin(reservationId);

  const { data: reservation } = await admin
    .from("reservations")
    .select(
      "*, prestations(label, visio_auto, format), creneaux(debut_at), profiles(prenom, nom, email)"
    )
    .eq("id", reservationId)
    .maybeSingle();

  if (!reservation) return { visio, facture };

  const pre = reservation.prestations as { label?: string } | null;
  const cr = reservation.creneaux as { debut_at?: string } | null;
  const dest = reservation.profiles as {
    prenom?: string;
    nom?: string;
    email?: string;
  } | null;
  const adresse =
    reservation.adresse_snapshot &&
    typeof reservation.adresse_snapshot === "object"
      ? (reservation.adresse_snapshot as { libelle?: string }).libelle
      : null;

  const pdf = await genererPdfFacture({
    numeroFacture: facture.numero,
    numeroReservation: reservation.numero,
    dateEmission: new Date(facture.created_at).toLocaleDateString("fr-FR"),
    clientNom: `${dest?.prenom || ""} ${dest?.nom || ""}`.trim() || "Client",
    clientEmail: dest?.email || "",
    clientAdresse: adresse,
    prestationLabel: pre?.label || "Prestation",
    creneauLabel: cr?.debut_at ? formatDateHeure(cr.debut_at) : "",
    baseCents: reservation.base_cents,
    supplementKmCents: reservation.supplement_km_cents,
    distanceKm: reservation.distance_km,
    totalCents: reservation.total_cents,
  });

  const quand = cr?.debut_at ? formatDateHeure(cr.debut_at) : "";
  const visioHtml = visio
    ? `<p>Lien de visio : <a href="${visio}">${visio}</a></p>`
    : "";
  const visioTxt = visio ? `Lien visio : ${visio}` : "";

  if (dest?.email) {
    await envoyerEmail({
      to: dest.email,
      subject: `Confirmation ${reservation.numero} — ${SITE.name}`,
      text: [
        `Bonjour ${dest.prenom || ""},`,
        "",
        `Votre rendez-vous est confirmé : ${pre?.label || ""} — ${quand}.`,
        `Montant réglé : ${euros(reservation.total_cents)}.`,
        visioTxt,
        "",
        "La facture est jointe à cet email.",
        "",
        SITE.name,
        SITE.email,
      ].join("\n"),
      html: `
        <p>Bonjour ${dest.prenom || ""},</p>
        <p>Votre rendez-vous est confirmé :</p>
        <p><strong>${pre?.label || ""}</strong><br/>${quand}<br/>${euros(reservation.total_cents)}</p>
        ${visioHtml}
        <p>La facture PDF est jointe à cet email.</p>
        <p>${SITE.name}<br/>${SITE.email}</p>
      `,
      attachments: [
        {
          filename: `facture-${facture.numero}.pdf`,
          content: Buffer.from(pdf),
          contentType: "application/pdf",
        },
      ],
    });
  }

  if (visio && SITE.email) {
    await envoyerEmail({
      to: SITE.email,
      subject: `Visio ${reservation.numero} — ${quand}`,
      text: [
        `Rendez-vous visio confirmé.`,
        `${pre?.label || ""} — ${quand}`,
        `Cliente : ${dest?.prenom || ""} ${dest?.nom || ""} ${dest?.email || ""}`,
        `Lien (le même que la cliente) : ${visio}`,
        "",
        "Agenda : /admin/agenda",
      ].join("\n"),
      html: `<p>Rendez-vous visio confirmé.</p><p><strong>${pre?.label || ""}</strong><br/>${quand}<br/>${dest?.prenom || ""} ${dest?.nom || ""} — ${dest?.email || ""}</p><p><a href="${visio}">Rejoindre la visio</a></p>`,
    });
  }

  return { visio, facture };
}
