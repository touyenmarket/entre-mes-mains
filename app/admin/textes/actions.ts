"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TEXTES_DEFAUT } from "@/lib/textes";

export async function enregistrerTextes(formData: FormData) {
  const gate = await requireAdmin();
  if (!gate.ok) redirect("/connexion");

  const userDb = await createClient();
  let db = userDb;
  try {
    db = createAdminClient();
  } catch {
    db = userDb;
  }

  const rows = TEXTES_DEFAUT.map((def) => ({
    cle: def.cle,
    page: def.page,
    label: def.label,
    valeur: String(formData.get(def.cle) ?? def.valeur),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await db.from("site_textes").upsert(rows, { onConflict: "cle" });
  if (error) {
    redirect(`/admin/textes?erreur=${encodeURIComponent(error.message.slice(0, 160))}`);
  }

  revalidatePath("/");
  revalidatePath("/naturopathie");
  revalidatePath("/massages");
  revalidatePath("/atelier-lsf");
  revalidatePath("/admin/textes");
  redirect("/admin/textes?ok=1");
}
