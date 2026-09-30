/**
 * Textes éditables depuis /admin/textes.
 * Si la table est vide ou hors ligne, on reprend ces valeurs.
 */
export const TEXTES_DEFAUT: {
  cle: string;
  page: string;
  label: string;
  valeur: string;
}[] = [
  { cle: "accueil.badge", page: "Accueil", label: "Pastille au-dessus du titre", valeur: "Naturopathie & massage bien-être" },
  { cle: "accueil.h1", page: "Accueil", label: "Grand titre", valeur: "Prendre soin de soi, en douceur et en confiance" },
  { cle: "accueil.sous_titre", page: "Accueil", label: "Ligne sous le titre", valeur: "au service de la femme" },
  { cle: "accueil.intro", page: "Accueil", label: "Paragraphe d’introduction", valeur: "Consultations de naturopathie en visio, massages bien-être à domicile pour vous et pour bébé, des ateliers de langue des signes française. Une parenthèse de douceur, chez vous." },
  { cle: "accueil.cta1", page: "Accueil", label: "Bouton 1", valeur: "Réserver une consultation" },
  { cle: "accueil.cta2", page: "Accueil", label: "Bouton 2", valeur: "Découvrir les massages" },
  { cle: "accueil.univers_eyebrow", page: "Accueil", label: "Petit titre « deux univers »", valeur: "Deux univers" },
  { cle: "accueil.univers_titre", page: "Accueil", label: "Titre « deux univers »", valeur: "Une même attention, deux façons de prendre soin de vous" },
  { cle: "accueil.univers_sous", page: "Accueil", label: "Texte sous le titre « deux univers »", valeur: "La naturopathie soutient votre vitalité de l'intérieur ; le massage relâche, enveloppe et accompagne. Deux pratiques réunies dans un seul espace, sans les confondre." },

  { cle: "naturo.badge", page: "Naturopathie", label: "Pastille", valeur: "Consultations en visio" },
  { cle: "naturo.h1", page: "Naturopathie", label: "Titre", valeur: "La naturopathie, en visio" },
  { cle: "naturo.intro", page: "Naturopathie", label: "Introduction", valeur: "La naturopathie vise à soutenir votre vitalité et préserver votre équilibre grâce à des moyens naturels, en considérant la personne dans sa globalité. En visio, profitez d'un accompagnement personnalisé, où que vous soyez, dans le confort de votre environnement." },
  { cle: "naturo.cta", page: "Naturopathie", label: "Bouton", valeur: "Réserver une consultation" },

  { cle: "massages.badge", page: "Massages", label: "Pastille", valeur: "Massages à domicile" },
  { cle: "massages.h1", page: "Massages", label: "Titre", valeur: "Le bien-être, chez vous" },
  { cle: "massages.intro", page: "Massages", label: "Introduction", valeur: "Je me déplace à votre domicile avec tout le matériel : massages prénatal, postnatal et bébé, au rythme de chacun." },
  { cle: "massages.cta", page: "Massages", label: "Bouton", valeur: "Réserver un massage" },

  { cle: "lsf.h1", page: "Bébé signes", label: "Titre", valeur: "Offrir à bébé ses premiers mots, avec les mains" },
  { cle: "lsf.intro", page: "Bébé signes", label: "Introduction", valeur: "Bien avant la parole, votre bébé a déjà beaucoup à exprimer : une faim, une envie de câlin, une fatigue… La langue des signes française lui donne un moyen simple et naturel de se faire comprendre. Au fil de l'atelier, vous apprendrez les signes essentiels du quotidien de votre bébé et la manière de les intégrer en douceur à vos échanges, à votre rythme." },
  { cle: "lsf.cta", page: "Bébé signes", label: "Bouton", valeur: "Réserver l'atelier" },
];

export function texteDefaut(cle: string) {
  return TEXTES_DEFAUT.find((t) => t.cle === cle)?.valeur || "";
}

export function t(map: Record<string, string>, cle: string) {
  const v = (map[cle] || "").trim();
  return v || texteDefaut(cle);
}

export async function chargerTextes(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const row of TEXTES_DEFAUT) map[row.cle] = row.valeur;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const db = await createClient();
    const { data } = await db.from("site_textes").select("cle, valeur");
    for (const row of data || []) {
      if (row.cle && typeof row.valeur === "string" && row.valeur.trim()) {
        map[row.cle] = row.valeur;
      }
    }
  } catch {
    /* table absente : on garde les défauts */
  }
  return map;
}
