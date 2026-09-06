import { SITE } from "@/lib/config";

export type DistanceResult = {
  distance_km: number;
  origine: string;
  destination: string;
  mode: "ors" | "osrm";
};

type LngLat = { lng: number; lat: number };

const ORIGINE_LIBELLE = `${SITE.adresse}, France`;

async function geocodeNominatim(query: string): Promise<LngLat | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "fr");
  const res = await fetch(url, {
    headers: {
      "User-Agent": "EntreMesMains/1.0 (https://entre-mes-mains-two.vercel.app)",
      Accept: "application/json",
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { lon: string; lat: string }[];
  if (!data[0]) return null;
  return { lng: Number(data[0].lon), lat: Number(data[0].lat) };
}

async function geocodeOrs(query: string, key: string): Promise<LngLat | null> {
  const url = new URL("https://api.openrouteservice.org/geocode/search");
  url.searchParams.set("api_key", key);
  url.searchParams.set("text", query);
  url.searchParams.set("boundary.country", "FR");
  url.searchParams.set("size", "1");
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    features?: { geometry?: { coordinates?: [number, number] } }[];
  };
  const coords = data.features?.[0]?.geometry?.coordinates;
  if (!coords) return null;
  return { lng: coords[0], lat: coords[1] };
}

async function routeOrs(from: LngLat, to: LngLat, key: string): Promise<number | null> {
  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
      method: "POST",
      headers: {
        Authorization: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [from.lng, from.lat],
          [to.lng, to.lat],
        ],
      }),
    }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    routes?: { summary?: { distance?: number } }[];
  };
  const meters = data.routes?.[0]?.summary?.distance;
  return typeof meters === "number" ? meters / 1000 : null;
}

async function routeOsrm(from: LngLat, to: LngLat): Promise<number | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    routes?: { distance?: number }[];
  };
  const meters = data.routes?.[0]?.distance;
  return typeof meters === "number" ? meters / 1000 : null;
}

export async function calculerDistanceKm(
  adressePatient: string
): Promise<DistanceResult> {
  const destination = adressePatient.trim();
  if (destination.length < 8) {
    throw new Error("Adresse trop courte.");
  }

  const orsKey = process.env.OPENROUTESERVICE_API_KEY;
  let from: LngLat | null = null;
  let to: LngLat | null = null;
  let mode: DistanceResult["mode"] = "osrm";

  if (orsKey) {
    from = await geocodeOrs(ORIGINE_LIBELLE, orsKey);
    to = await geocodeOrs(destination, orsKey);
  }
  if (!from) from = await geocodeNominatim(ORIGINE_LIBELLE);
  if (!to) to = await geocodeNominatim(destination);
  if (!from || !to) {
    throw new Error("Adresse introuvable. Précisez le numéro, le code postal et la ville.");
  }

  let km: number | null = null;
  if (orsKey) {
    km = await routeOrs(from, to, orsKey);
    if (km != null) mode = "ors";
  }
  if (km == null) {
    km = await routeOsrm(from, to);
    mode = "osrm";
  }
  if (km == null) {
    throw new Error("Impossible de calculer l’itinéraire. Réessayez dans un instant.");
  }

  return {
    distance_km: Math.round(km * 10) / 10,
    origine: ORIGINE_LIBELLE,
    destination,
    mode,
  };
}
