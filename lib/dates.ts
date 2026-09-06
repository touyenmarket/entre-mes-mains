const PARIS = "Europe/Paris";

export function formatDateHeure(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatHeure(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

/** Convertit une date/heure murale à Paris vers un ISO UTC. */
export function parisLocalToIso(date: string, hour: number, minute: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const hh = pad(hour);
  const mm = pad(minute);
  for (const offset of ["+02:00", "+01:00"] as const) {
    const d = new Date(`${date}T${hh}:${mm}:00${offset}`);
    const shown = new Intl.DateTimeFormat("fr-FR", {
      timeZone: PARIS,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(d);
    if (shown === `${hh}:${mm}`) return d.toISOString();
  }
  return new Date(`${date}T${hh}:${mm}:00+02:00`).toISOString();
}
