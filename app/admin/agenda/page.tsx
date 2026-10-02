import { redirect } from "next/navigation";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatHeure } from "@/lib/dates";
import AgendaMois from "./AgendaMois";

export const metadata = { title: "Agenda des rendez-vous" };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ mois?: string; jour?: string }>;
}) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    if (!gate.user) redirect("/connexion");
    redirect("/mes-rendez-vous");
  }

  const sp = await searchParams;
  const now = new Date();
  const [ya, ma] = (sp.mois || `${now.getFullYear()}-${pad(now.getMonth() + 1)}`).split("-");
  const annee = Number(ya) || now.getFullYear();
  const mois = Number(ma) || now.getMonth() + 1;
  const debut = new Date(annee, mois - 1, 1);
  const fin = new Date(annee, mois, 1);
  const startPad = (debut.getDay() + 6) % 7;
  const jours: { iso: string; num: number; hors: boolean }[] = [];
  for (let i = 0; i < startPad; i++) {
    const d = new Date(annee, mois - 1, 1 - (startPad - i));
    jours.push({
      iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      num: d.getDate(),
      hors: true,
    });
  }
  for (let day = 1; day <= new Date(annee, mois, 0).getDate(); day++) {
    jours.push({
      iso: `${annee}-${pad(mois)}-${pad(day)}`,
      num: day,
      hors: false,
    });
  }
  while (jours.length % 7 !== 0) {
    const d = new Date(annee, mois - 1, jours.length - startPad + 1);
    jours.push({
      iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      num: d.getDate(),
      hors: true,
    });
  }

  const prevD = new Date(annee, mois - 2, 1);
  const nextD = new Date(annee, mois, 1);
  const prev = `/admin/agenda?mois=${prevD.getFullYear()}-${pad(prevD.getMonth() + 1)}`;
  const next = `/admin/agenda?mois=${nextD.getFullYear()}-${pad(nextD.getMonth() + 1)}`;

  const admin = createAdminClient();
  const { data } = await admin
    .from("reservations")
    .select(
      "id, numero, statut, total_cents, visio_lien, creneaux(debut_at), prestations(label), profiles(prenom, nom, email)",
    )
    .neq("statut", "annulee")
    .order("created_at", { ascending: false })
    .limit(400);

  const rdv = (data || [])
    .map((r) => {
      const cr = r.creneaux as { debut_at?: string } | null;
      const pre = r.prestations as { label?: string } | null;
      const prof = r.profiles as { prenom?: string; nom?: string; email?: string } | null;
      if (!cr?.debut_at) return null;
      const d = new Date(cr.debut_at);
      const jour = new Intl.DateTimeFormat("fr-CA", {
        timeZone: "Europe/Paris",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
      return {
        id: r.id,
        numero: r.numero,
        statut: r.statut,
        total: `${(r.total_cents / 100).toFixed(2)} €`,
        quand: cr.debut_at,
        heure: formatHeure(cr.debut_at),
        jour,
        client: [prof?.prenom, prof?.nom].filter(Boolean).join(" ") || "Cliente",
        email: prof?.email || "",
        prestation: pre?.label || "Prestation",
        visio: r.visio_lien,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.quand.localeCompare(b!.quand)) as {
    id: string;
    numero: string;
    statut: string;
    total: string;
    quand: string;
    heure: string;
    jour: string;
    client: string;
    email: string;
    prestation: string;
    visio: string | null;
  }[];

  return (
    <Container className="py-14 sm:py-20">
      <Badge>Back-office</Badge>
      <h1 className="mt-5 font-serif text-4xl text-cream">Agenda</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <ButtonLink href="/admin" variant="ghost">
          Créneaux
        </ButtonLink>
        <ButtonLink href="/admin/documents" variant="ghost">
          Devis & factures
        </ButtonLink>
        <ButtonLink href="/admin/compta" variant="ghost">
          Comptabilité
        </ButtonLink>
        <ButtonLink href="/admin/textes" variant="ghost">
          Textes du site
        </ButtonLink>
      </div>
      <p className="mt-3 max-w-xl text-[15px] text-cream/65">
        Les rendez-vous pris, mois par mois. Un jour bronze = au moins une séance.
        Le bouton visio ouvre la même salle que la cliente.
      </p>
      <AgendaMois
        annee={annee}
        mois={mois}
        prev={prev}
        next={next}
        jours={jours}
        rdv={rdv}
        selection={sp.jour || null}
      />
    </Container>
  );
}
