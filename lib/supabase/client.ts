/**
 * Client Supabase côté navigateur (anon key).
 * Utilisé uniquement pour Auth (lien magique) et lectures publiques.
 * Les mutations métier passent par les route handlers (service role).
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
