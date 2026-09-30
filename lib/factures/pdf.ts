import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import { SITE } from "@/lib/config";

export type LignePdf = {
  libelle: string;
  montantCents: number;
  quantite?: number;
  prixUnitaireCents?: number;
};

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
  kind?: "facture" | "devis";
  tvaMention?: string;
  paiementMention?: string;
  lignes?: LignePdf[];
  tvaCents?: number;
};

function euros(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function wrap(text: string, font: { widthOfTextAtSize: (t: string, s: number) => number }, size: number, max: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > max && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [text];
}

export async function genererPdfFacture(input: FacturePdfInput) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const forest = rgb(0.42, 0.51, 0.43);
  const bronze = rgb(0.639, 0.569, 0.443);
  const cream = rgb(0.992, 0.984, 0.969);
  const sand = rgb(0.93, 0.89, 0.82);
  const ink = rgb(0.16, 0.18, 0.16);

  try {
    const logoBytes = await readFile(path.join(process.cwd(), "public/images/logo.png"));
    const logo = await doc.embedPng(logoBytes);
    const lw = 72;
    const lh = (logo.height / logo.width) * lw;
    page.drawImage(logo, { x: 50, y: 770, width: lw, height: lh });
  } catch {
    /* logo optionnel si absent en local */
  }

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

  const kind = input.kind || "facture";

  const nAffiche = (() => {
    const m = input.numeroFacture.match(/(\d+)\s*$/);
    return String(Number(m ? m[1] : "1"));
  })();
  const titreBandeau = `${kind === "devis" ? "DEVIS" : "FACTURE"} N°${nAffiche}`;
  page.drawRectangle({ x: 355, y: 776, width: 190, height: 40, color: forest });
  draw(titreBandeau, 368, 789, 14, bold, cream);

  draw("ENTRE MES MAINS", 130, 808, 14, bold, forest);
  draw(SITE.tagline, 130, 792, 9, font, bronze);
  draw(`Date : ${input.dateEmission}`, 50, 734, 10);
  if (input.numeroReservation) {
    draw(`Réservation ${input.numeroReservation}`, 50, 720, 9, font, bronze);
  }

  page.drawRectangle({ x: 50, y: 628, width: 240, height: 78, color: forest });
  draw(SITE.responsable.toUpperCase(), 58, 688, 10, bold, cream);
  draw("7 rue de Champfroid", 58, 674, 9, font, cream);
  draw("28800 Sancheville", 58, 662, 9, font, cream);
  draw(SITE.email, 58, 650, 8, font, cream);
  draw(`N° SIRET : ${SITE.siret || ""}`, 58, 638, 8, font, cream);

  page.drawRectangle({ x: 305, y: 628, width: 240, height: 78, color: sand });
  draw(kind === "devis" ? "Destinataire" : "Client", 313, 688, 9, bold, forest);
  draw((input.clientNom || "Client").slice(0, 36), 313, 674, 10, bold, ink);
  const addr = (input.clientAdresse || "").split("\n").filter(Boolean);
  addr.slice(0, 2).forEach((line, i) => draw(line.slice(0, 38), 313, 660 - i * 12, 8));
  if (input.clientEmail) draw(input.clientEmail.slice(0, 38), 313, 636, 8);

  const tableTop = 590;
  page.drawRectangle({ x: 50, y: tableTop, width: 495, height: 22, color: sand });
  draw("Description", 58, tableTop + 7, 9, bold, forest);
  draw("Qté", 320, tableTop + 7, 9, bold, forest);
  draw("Prix unitaire", 360, tableTop + 7, 9, bold, forest);
  draw("Total", 490, tableTop + 7, 9, bold, forest);

  const lignes: LignePdf[] =
    input.lignes && input.lignes.length > 0
      ? input.lignes
      : [
          {
            libelle: input.prestationLabel,
            montantCents: input.baseCents,
            quantite: 1,
            prixUnitaireCents: input.baseCents,
          },
        ];

  let y = tableTop - 18;
  page.drawRectangle({
    x: 50,
    y: tableTop - 130,
    width: 495,
    height: 130,
    borderColor: bronze,
    borderWidth: 0.6,
  });

  lignes.forEach((ligne) => {
    const qty = ligne.quantite ?? 1;
    const pu = ligne.prixUnitaireCents ?? Math.round(ligne.montantCents / qty);
    const total = ligne.montantCents || qty * pu;
    const descLines = wrap(ligne.libelle, font, 9, 250);
    descLines.forEach((ln, i) => draw(ln, 58, y - i * 12, 9));
    draw(String(qty), 326, y, 10);
    draw(euros(pu), 360, y, 10);
    draw(euros(total), 470, y, 10);
    y -= Math.max(20, descLines.length * 12 + 6);
  });

  if (input.creneauLabel) {
    wrap(input.creneauLabel, font, 8, 250).forEach((ln) => {
      draw(ln, 58, y, 8, font, bronze);
      y -= 11;
    });
  }
  if (input.supplementKmCents > 0) {
    const km = input.distanceKm != null ? ` (${input.distanceKm} km)` : "";
    draw(`Supplément déplacement${km}`, 58, y, 9);
    draw(euros(input.supplementKmCents), 470, y, 9);
    y -= 16;
  }

  draw("Total à payer", 350, 430, 12, bold, forest);
  draw(euros(input.totalCents), 455, 430, 12, bold, forest);
  page.drawLine({
    start: { x: 348, y: 424 },
    end: { x: 545, y: 424 },
    thickness: 1.2,
    color: forest,
  });

  page.drawRectangle({ x: 140, y: 388, width: 315, height: 22, color: forest });
  draw(
    input.tvaMention || "TVA non applicable — article 293-B du CGI",
    150,
    395,
    9,
    bold,
    cream
  );

  if (kind === "devis") {
    draw("Ce document est un devis. Il ne vaut pas une véritable facture.", 50, 360, 9, font, bronze);
  } else if (input.paiementMention) {
    draw(input.paiementMention, 50, 360, 9, font, bronze);
  }

  page.drawRectangle({ x: 50, y: 280, width: 260, height: 62, color: forest });
  draw("INFORMATIONS BANCAIRES", 58, 322, 8, bold, cream);
  draw(SITE.titulaireIban || SITE.responsable, 58, 308, 9, font, cream);
  draw(`IBAN ${SITE.iban || ""}`, 58, 294, 8, font, cream);

  draw(
    "Prestation de bien-être / accompagnement. Ne se substitue pas à un acte médical.",
    50,
    80,
    8,
    font,
    bronze
  );
  draw(`${SITE.name} — ${SITE.email}`, 50, 64, 8, font, bronze);

  return doc.save();
}
