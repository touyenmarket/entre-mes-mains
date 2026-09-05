/**
 * Client Supabase service role (côté serveur UNIQUEMENT).
 * Bypasse le RLS — réservé aux route handlers de confiance
 * (paiement, confirmation, génération facture, etc.).
 *
 * Ne jamais importer ce fichier dans un composant client.
 */
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant. Mode démo : utiliser les adaptateurs locaux."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** True si les clés Supabase sont configurées. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
