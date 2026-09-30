import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

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
