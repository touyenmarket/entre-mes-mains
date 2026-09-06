import { NextResponse } from "next/server";
import { calculerDistanceKm } from "@/lib/distance";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { adresse?: string };
    const adresse = (body.adresse || "").trim();
    if (adresse.length < 8) {
      return NextResponse.json(
        { error: "Indiquez une adresse complète (rue, code postal, ville)." },
        { status: 400 }
      );
    }
    const result = await calculerDistanceKm(adresse);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Calcul de distance impossible.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
