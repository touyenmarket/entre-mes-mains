import { TEXTES_DEFAUT } from "@/lib/textes";
import { createClient } from "@/lib/supabase/server";

export async function chargerTextes(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const row of TEXTES_DEFAUT) map[row.cle] = row.valeur;
  try {
    const db = await createClient();
    const { data } = await db.from("site_textes").select("cle, valeur");
    for (const row of data || []) {
      if (row.cle && typeof row.valeur === "string" && row.valeur.trim()) {
        map[row.cle] = row.valeur;
      }
    }
  } catch {
    /* table absente */
  }
  return map;
}
