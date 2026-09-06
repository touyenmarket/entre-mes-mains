import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getCurrentProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  const { supabase, user } = await getSessionUser();
  if (!user) return { user: null, profile: null };

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (data as Profile | null) ?? null };
}

export async function requireAdmin() {
  const ctx = await getCurrentProfile();
  if (!ctx.user || ctx.profile?.role !== "admin") {
    return { ok: false as const, ...ctx };
  }
  return { ok: true as const, ...ctx };
}
