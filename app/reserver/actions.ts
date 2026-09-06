"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { supplementKm } from "@/lib/tarification";
import type { Prestation } from "@/lib/supabase/types";

export async function creerReservation(formData: FormData) {
  const { user, profile } = await getCurrentProfile();
  if (!user) {
    redirect("/connexion?next=/reserver");
  }

  const prestationId = String(formData.get("prestation_id") || "");
  const creneauId = String(formData.get("creneau_id") || "");
  const consentement = formData.get("consentement") === "on";
  const distanceKm = Number(formData.get("distance_km") || 0);
  const adresse = String(formData.get("adresse") || "").trim();
  const prenom = String(formData.get("prenom") || profile?.prenom || "").trim();
  const nom = String(formData.get("nom") || profile?.nom || "").trim();
  const telephone = String(formData.get("telephone") || profile?.telephone || "").trim();

  if (!prestationId || !creneauId) {
    return { error: "Choisissez une prestation et un créneau." };
  }
  if (!consentement) {
    return { error: "Le consentement RGPD est nécessaire pour enregistrer le rendez-vous." };
  }

  const admin = createAdminClient();

  const { data: prestation, error: pErr } = await admin
    .from("prestations")
    .select("*")
    .eq("id", prestationId)
    .eq("actif", true)
    .maybeSingle();
  if (pErr || !prestation) return { error: "Prestation introuvable." };

  const p = prestation as Prestation;
  if (p.km_applicable && !adresse) {
    return { error: "Indiquez l’adresse du rendez-vous (calcul du supplément km)." };
  }

  const { data: creneau, error: cErr } = await admin
    .from("creneaux")
    .select("*")
    .eq("id", creneauId)
    .maybeSingle();
  if (cErr || !creneau) return { error: "Créneau introuvable." };
  if (creneau.statut !== "libre") return { error: "Ce créneau n’est plus disponible." };
  if (creneau.places_prises >= creneau.capacite) {
    return { error: "Plus de place sur ce créneau." };
  }
  if (creneau.prestation_id && creneau.prestation_id !== prestationId) {
    return { error: "Ce créneau est réservé à une autre prestation." };
  }
  if (creneau.format !== p.format) {
    return { error: "Le format du créneau ne correspond pas à la prestation." };
  }

  const suppEur = p.km_applicable ? supplementKm(distanceKm) : 0;
  const supplementCents = Math.round(suppEur * 100);
  const totalCents = p.prix_base_cents + supplementCents;

  const annee = new Date().getFullYear();
  const { data: numeroRpc } = await admin.rpc("generer_numero_reservation");
  const numero =
    (typeof numeroRpc === "string" && numeroRpc) ||
    `EMM-${annee}-${String(Date.now()).slice(-4)}`;

  const places = creneau.places_prises + 1;
  const nouveauStatut = places >= creneau.capacite ? "reserve" : "libre";

  const { data: reservation, error: rErr } = await admin
    .from("reservations")
    .insert({
      numero,
      profile_id: user.id,
      prestation_id: p.id,
      creneau_id: creneau.id,
      statut: "confirmee",
      base_cents: p.prix_base_cents,
      supplement_km_cents: supplementCents,
      distance_km: p.km_applicable ? distanceKm : null,
      total_cents: totalCents,
      adresse_snapshot: p.km_applicable
        ? { libelle: adresse, distance_km: distanceKm }
        : null,
      paiement_statut: "non_paye",
      paiement_provider: "demo",
    })
    .select("numero")
    .single();

  if (rErr) return { error: rErr.message };

  await admin
    .from("creneaux")
    .update({ places_prises: places, statut: nouveauStatut })
    .eq("id", creneau.id);

  await admin
    .from("profiles")
    .update({
      prenom: prenom || profile?.prenom || "",
      nom: nom || profile?.nom || "",
      telephone: telephone || null,
      consentement_rgpd_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  redirect(`/reserver/confirmation/${reservation.numero}`);
}
