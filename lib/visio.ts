import { createAdminClient } from "@/lib/supabase/admin";

export function creerLienVisio(numero: string) {
  const fixe = process.env.VISIO_LIEN_FIXE?.trim();
  if (fixe) return fixe;
  const slug = numero.replace(/[^A-Za-z0-9-]/g, "");
  return `https://meet.jit.si/EntreMesMains-${slug}`;
}

export async function assurerLienVisio(reservationId: string) {
  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
    .select("id, numero, visio_lien, prestations(visio_auto, format)")
    .eq("id", reservationId)
    .maybeSingle();
  if (!reservation) return null;

  const pre = reservation.prestations as {
    visio_auto?: boolean;
    format?: string;
  } | null;
  const besoin = Boolean(pre?.visio_auto || pre?.format === "visio");
  if (!besoin) return reservation.visio_lien;

  if (reservation.visio_lien) return reservation.visio_lien;

  const lien = creerLienVisio(reservation.numero);
  await admin
    .from("reservations")
    .update({ visio_lien: lien })
    .eq("id", reservation.id);
  return lien;
}
