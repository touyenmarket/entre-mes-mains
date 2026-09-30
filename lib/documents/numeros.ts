import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export const AFFICHE_RE = /\[\[AFFICHE:([^\]]+)\]\]/;

export function extraireNumeroAffiche(details?: string | null) {
  const m = String(details || "").match(AFFICHE_RE);
  return m ? m[1].trim() : null;
}

export function detailsSansAffiche(details?: string | null) {
  return String(details || "").replace(AFFICHE_RE, "").replace(/^\n+/, "").trim();
}

export function detailsAvecAffiche(details: string, numeroAffiche: string) {
  const corps = detailsSansAffiche(details);
  return `[[AFFICHE:${numeroAffiche}]]${corps ? "\n" + corps : ""}`;
}

export async function prochainNumero(
  kind: "devis" | "facture",
  client?: SupabaseClient
) {
  const db = client ?? createAdminClient();
  const annee = new Date().getFullYear();
  const prefix = kind === "devis" ? `D-${annee}-` : `F-${annee}-`;
  const { data } = await db
    .from("documents_manuels")
    .select("numero")
    .like("numero", `${prefix}%`)
    .order("numero", { ascending: false })
    .limit(1);
  const last = data?.[0]?.numero as string | undefined;
  const n = last ? Number(last.replace(prefix, "")) + 1 : 1;
  return `${prefix}${String(n).padStart(3, "0")}`;
}

export async function prochainNumeroClient(
  kind: "devis" | "facture",
  clientNom: string,
  dbClient?: SupabaseClient
) {
  const db = dbClient ?? createAdminClient();
  const { data } = await db
    .from("documents_manuels")
    .select("details")
    .eq("kind", kind)
    .ilike("client_nom", clientNom.trim());
  let max = 0;
  for (const row of data || []) {
    const a = extraireNumeroAffiche(row.details);
    const n = a ? Number(String(a).replace(/\D/g, "")) : 0;
    if (n > max) max = n;
  }
  return String(max + 1);
}
