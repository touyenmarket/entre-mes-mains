import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { SITE } from "@/lib/config";
import { formatDateHeure } from "@/lib/dates";

export type FacturePdfInput = {
  numeroFacture: string;
  numeroReservation: string;
  dateEmission: string;
  clientNom: string;
  clientEmail: string;
  clientAdresse?: string | null;
  prestationLabel: string;
  creneauLabel: string;
  baseCents: number;
  supplementKmCents: number;
  distanceKm: number | null;
  totalCents: number;
};

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export async function genererPdfFacture(input: FacturePdfInput) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const forest = rgb(0.18, 0.24, 0.19);
  const bronze = rgb(0.64, 0.57, 0.44);
  const ink = rgb(0.15, 0.15, 0.15);

  const draw = (
    text: string,
    x: number,
    y: number,
    size = 11,
    f = font,
    color = ink
  ) => {
    page.drawText(text, { x, y, size, font: f, color });
  };

  draw("ENTRE MES MAINS", 50, 790, 16, bold, forest);
  draw(SITE.tagline, 50, 772, 10, font, bronze);
  draw(SITE.responsable, 50, 748, 10);
  draw(SITE.adresse, 50, 734, 10);
  draw(SITE.email, 50, 720, 10);

  draw("FACTURE", 400, 790, 18, bold, forest);
  draw(input.numeroFacture, 400, 770, 12, bold);
  draw(`Émise le ${input.dateEmission}`, 400, 754, 10);
  draw(`Réservation ${input.numeroReservation}`, 400, 740, 10);

  draw("Facturée à", 50, 680, 10, bold, bronze);
  draw(input.clientNom || "Client", 50, 664, 12, bold);
  draw(input.clientEmail, 50, 648, 10);
  if (input.clientAdresse) {
    const lines = input.clientAdresse.split("\n");
    lines.forEach((line, i) => draw(line, 50, 632 - i * 14, 10));
  }

  const tableTop = 560;
  page.drawRectangle({
    x: 50,
    y: tableTop,
    width: 495,
    height: 22,
    color: rgb(0.93, 0.89, 0.82),
  });
  draw("Désignation", 58, tableTop + 7, 10, bold);
  draw("Montant", 480, tableTop + 7, 10, bold);

  draw(input.prestationLabel, 58, tableTop - 22, 11, bold);
  draw(input.creneauLabel, 58, tableTop - 38, 9, font, bronze);
  draw(euros(input.baseCents), 470, tableTop - 22, 11);

  let y = tableTop - 60;
  if (input.supplementKmCents > 0) {
    const km =
      input.distanceKm != null ? ` (${input.distanceKm} km)` : "";
    draw(`Supplément déplacement${km}`, 58, y, 11);
    draw(euros(input.supplementKmCents), 470, y, 11);
    y -= 22;
  }

  page.drawLine({
    start: { x: 50, y: y + 8 },
    end: { x: 545, y: y + 8 },
    thickness: 0.6,
    color: bronze,
  });
  draw("Total TTC", 350, y - 12, 12, bold);
  draw(euros(input.totalCents), 460, y - 12, 12, bold, forest);

  draw("Paiement reçu via PayPal.", 50, 280, 10);
  draw("TVA non applicable, art. 293 B du CGI (si micro-entreprise).", 50, 264, 9, font, bronze);
  draw(
    "Prestation de bien-être / accompagnement. Ne se substitue pas à un acte médical.",
    50,
    248,
    9,
    font,
    bronze
  );
  draw(
    `${SITE.name} — ${SITE.city} — ${SITE.email}`,
    50,
    60,
    9,
    font,
    bronze
  );

  return doc.save();
}
