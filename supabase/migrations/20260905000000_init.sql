-- ============================================================
-- Entre mes mains — schéma initial (étape 2)
-- Compatible Supabase (région UE) et PostgreSQL local
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------
CREATE TYPE role_utilisateur AS ENUM ('patient', 'admin');
CREATE TYPE type_prestation AS ENUM ('naturo', 'massage', 'atelier');
CREATE TYPE format_prestation AS ENUM ('visio', 'domicile', 'presentiel');
CREATE TYPE statut_creneau AS ENUM ('libre', 'reserve', 'bloque');
CREATE TYPE statut_reservation AS ENUM ('en_attente', 'confirmee', 'terminee', 'annulee');
CREATE TYPE statut_paiement AS ENUM ('non_paye', 'paye', 'rembourse');
CREATE TYPE provider_paiement AS ENUM ('paypal', 'wero', 'stripe', 'demo');
CREATE TYPE type_email AS ENUM (
  'confirmation',
  'rappel',
  'lien_visio',
  'notification_admin',
  'facture',
  'annulation'
);

-- ------------------------------------------------------------
-- profiles (lié à auth.users de Supabase)
-- ------------------------------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  prenom TEXT NOT NULL DEFAULT '',
  nom TEXT NOT NULL DEFAULT '',
  telephone TEXT,
  role role_utilisateur NOT NULL DEFAULT 'patient',
  consentement_rgpd_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ------------------------------------------------------------
-- prestations (catalogue modifiable en admin)
-- ------------------------------------------------------------
CREATE TABLE prestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type type_prestation NOT NULL,
  format format_prestation NOT NULL,
  duree_min INTEGER NOT NULL DEFAULT 60,
  prix_base_cents INTEGER NOT NULL,
  km_applicable BOOLEAN NOT NULL DEFAULT false,
  visio_auto BOOLEAN NOT NULL DEFAULT false,
  capacite INTEGER NOT NULL DEFAULT 1,
  forfait_seances INTEGER, -- null = séance unique, 4 = forfait bébé
  lsf BOOLEAN NOT NULL DEFAULT false,
  actif BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prestations_type ON prestations(type);
CREATE INDEX idx_prestations_actif ON prestations(actif);

-- ------------------------------------------------------------
-- creneaux (calendrier)
-- ------------------------------------------------------------
CREATE TABLE creneaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debut_at TIMESTAMPTZ NOT NULL,
  fin_at TIMESTAMPTZ NOT NULL,
  format format_prestation NOT NULL,
  capacite INTEGER NOT NULL DEFAULT 1,
  places_prises INTEGER NOT NULL DEFAULT 0,
  statut statut_creneau NOT NULL DEFAULT 'libre',
  prestation_id UUID REFERENCES prestations(id) ON DELETE SET NULL,
  note_admin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT creneaux_places_check CHECK (places_prises >= 0 AND places_prises <= capacite),
  CONSTRAINT creneaux_dates_check CHECK (fin_at > debut_at)
);

CREATE INDEX idx_creneaux_debut ON creneaux(debut_at);
CREATE INDEX idx_creneaux_statut ON creneaux(statut);
CREATE INDEX idx_creneaux_format ON creneaux(format);

-- ------------------------------------------------------------
-- reservations
-- ------------------------------------------------------------
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT NOT NULL UNIQUE, -- ex. EMM-2026-0001
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  prestation_id UUID NOT NULL REFERENCES prestations(id) ON DELETE RESTRICT,
  creneau_id UUID NOT NULL REFERENCES creneaux(id) ON DELETE RESTRICT,
  statut statut_reservation NOT NULL DEFAULT 'en_attente',
  -- montants gelés à la réservation (en centimes)
  base_cents INTEGER NOT NULL,
  supplement_km_cents INTEGER NOT NULL DEFAULT 0,
  distance_km NUMERIC(8,2),
  total_cents INTEGER NOT NULL,
  -- adresse patient (snapshot) pour massages domicile
  adresse_snapshot JSONB,
  visio_lien TEXT,
  -- paiement
  paiement_statut statut_paiement NOT NULL DEFAULT 'non_paye',
  paiement_provider provider_paiement,
  paiement_ref TEXT,
  paye_at TIMESTAMPTZ,
  -- cycle de vie
  expire_at TIMESTAMPTZ, -- libération auto si non payé
  annulee_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservations_profile ON reservations(profile_id);
CREATE INDEX idx_reservations_statut ON reservations(statut);
CREATE INDEX idx_reservations_creneau ON reservations(creneau_id);
CREATE INDEX idx_reservations_numero ON reservations(numero);

-- ------------------------------------------------------------
-- factures
-- ------------------------------------------------------------
CREATE TABLE factures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  numero TEXT NOT NULL UNIQUE, -- séquence légale, ex. 2026-001
  montant_ttc_cents INTEGER NOT NULL,
  statut TEXT NOT NULL DEFAULT 'emise', -- emise | annulee
  pdf_path TEXT, -- chemin dans le bucket Storage privé
  mentions JSONB, -- SIRET, adresse, TVA, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_factures_reservation ON factures(reservation_id);

-- ------------------------------------------------------------
-- devis
-- ------------------------------------------------------------
CREATE TABLE devis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  numero TEXT NOT NULL UNIQUE,
  montant_ttc_cents INTEGER NOT NULL,
  statut TEXT NOT NULL DEFAULT 'brouillon', -- brouillon | envoye | accepte | refuse | expire
  pdf_path TEXT,
  mentions JSONB,
  expire_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- settings (clé/valeur — paramétrable sans coder)
-- ------------------------------------------------------------
CREATE TABLE settings (
  cle TEXT PRIMARY KEY,
  valeur JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- emails_log (traçabilité)
-- ------------------------------------------------------------
CREATE TABLE emails_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destinataire TEXT NOT NULL,
  type type_email NOT NULL,
  sujet TEXT,
  statut TEXT NOT NULL DEFAULT 'envoye', -- envoye | echec | simule
  erreur TEXT,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_emails_log_created ON emails_log(created_at DESC);

-- ------------------------------------------------------------
-- Séquence pour numéros de réservation
-- ------------------------------------------------------------
CREATE SEQUENCE reservation_numero_seq START 1;

CREATE OR REPLACE FUNCTION generer_numero_reservation()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  annee TEXT := to_char(now(), 'YYYY');
  seq INTEGER;
BEGIN
  seq := nextval('reservation_numero_seq');
  RETURN 'EMM-' || annee || '-' || lpad(seq::text, 4, '0');
END;
$$;

-- ------------------------------------------------------------
-- Trigger : créer un profil automatiquement à l'inscription
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, prenom, nom)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    COALESCE(NEW.raw_user_meta_data->>'nom', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ------------------------------------------------------------
-- Trigger updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER prestations_updated_at BEFORE UPDATE ON prestations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER creneaux_updated_at BEFORE UPDATE ON creneaux
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- RLS (Row Level Security)
-- ------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE creneaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE devis ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_log ENABLE ROW LEVEL SECURITY;

-- Helper : est-ce l'admin ?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- profiles
CREATE POLICY "profiles_select_own_or_admin"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_all"
  ON profiles FOR ALL
  USING (is_admin());

-- prestations : lecture publique (catalogue), écriture admin
CREATE POLICY "prestations_select_public"
  ON prestations FOR SELECT
  USING (actif = true OR is_admin());

CREATE POLICY "prestations_admin_all"
  ON prestations FOR ALL
  USING (is_admin());

-- creneaux : libres lisibles par tous, écriture admin / serveur
CREATE POLICY "creneaux_select_libres"
  ON creneaux FOR SELECT
  USING (statut = 'libre' OR is_admin());

CREATE POLICY "creneaux_admin_all"
  ON creneaux FOR ALL
  USING (is_admin());

-- reservations : patient voit les siennes, admin voit tout
CREATE POLICY "reservations_select_own_or_admin"
  ON reservations FOR SELECT
  USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "reservations_insert_own"
  ON reservations FOR INSERT
  WITH CHECK (profile_id = auth.uid() OR is_admin());

CREATE POLICY "reservations_update_own_or_admin"
  ON reservations FOR UPDATE
  USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "reservations_admin_all"
  ON reservations FOR ALL
  USING (is_admin());

-- factures
CREATE POLICY "factures_select_own_or_admin"
  ON factures FOR SELECT
  USING (
    is_admin()
    OR reservation_id IN (
      SELECT id FROM reservations WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "factures_admin_all"
  ON factures FOR ALL
  USING (is_admin());

-- devis
CREATE POLICY "devis_select_own_or_admin"
  ON devis FOR SELECT
  USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "devis_admin_all"
  ON devis FOR ALL
  USING (is_admin());

-- settings : lecture pour le site, écriture admin
CREATE POLICY "settings_select_all"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "settings_admin_all"
  ON settings FOR ALL
  USING (is_admin());

-- emails_log : admin uniquement
CREATE POLICY "emails_log_admin"
  ON emails_log FOR ALL
  USING (is_admin());

-- ------------------------------------------------------------
-- Données initiales : settings
-- ------------------------------------------------------------
INSERT INTO settings (cle, valeur) VALUES
  ('zone_franche_km', '15'),
  ('tarif_km_cents', '55'),
  ('acompte_pct', '100'),
  ('delai_annulation_h', '24'),
  ('delai_rappel_h', '24'),
  ('lien_visio_fixe', '""'),
  ('adresse_base', '"Mon domicile — entre Chartres et Châteaudun (28)"'),
  ('mentions_facture', '{
    "raison_sociale": "Katia Trichard",
    "statut": "Micro-entreprise",
    "siret": "88905921800012",
    "adresse": "7 rue de Champfroid, 28800 Sancheville",
    "email": "Entremesmains28@gmail.com",
    "tva": "TVA non applicable, art. 293 B du CGI"
  }'::jsonb),
  ('texte_consentement_rgpd', '"J''accepte que mes données (coordonnées, adresse, nature de la prestation) soient utilisées pour organiser mon rendez-vous et établir la facture. Ces données peuvent constituer des données de santé. Elles ne sont ni vendues ni utilisées à des fins publicitaires."');

-- ------------------------------------------------------------
-- Données initiales : prestations (prix provisoires)
-- À ajuster dans l'admin plus tard
-- ------------------------------------------------------------
INSERT INTO prestations (slug, label, description, type, format, duree_min, prix_base_cents, km_applicable, visio_auto, capacite, forfait_seances, lsf, position) VALUES
  -- Naturopathie
  ('naturo-premier', 'Premier rendez-vous naturopathie', 'Bilan de vitalité complet en visio (1h30 max). Synthèse et plan personnalisé sous 7 jours.', 'naturo', 'visio', 90, 6000, false, true, 1, NULL, true, 10),
  ('naturo-suivi', 'Rendez-vous de suivi naturopathie', 'Suivi et ajustement du plan de vitalité en visio.', 'naturo', 'visio', 60, 5000, false, true, 1, NULL, true, 20),

  -- Massages domicile
  ('massage-prenatal', 'Massage prénatal', 'Massage bien-être adapté à la grossesse (à partir du 2e trimestre).', 'massage', 'domicile', 60, 7000, true, false, 1, NULL, true, 30),
  ('massage-postnatal', 'Massage postnatal', 'Massage bien-être post-accouchement (après 6 semaines, avis médical si césarienne).', 'massage', 'domicile', 60, 7000, true, false, 1, NULL, true, 40),
  ('massage-bebe', 'Massage bien-naître bébé', 'Séance de massage bébé (démonstration + accompagnement des gestes).', 'massage', 'domicile', 30, 4500, true, false, 1, NULL, true, 50),
  ('massage-bebe-forfait', 'Forfait 4 massages bébé', 'Forfait de 4 séances de massage bien-naître bébé.', 'massage', 'domicile', 30, 15000, true, false, 1, 4, true, 60),

  -- Atelier LSF (3 formats)
  ('atelier-lsf-domicile', 'Atelier LSF à domicile', 'Apprendre les signes essentiels du quotidien de bébé, à domicile.', 'atelier', 'domicile', 60, 4500, true, false, 1, NULL, true, 70),
  ('atelier-lsf-collectif', 'Atelier LSF collectif', 'Atelier en présentiel (groupe). Places limitées.', 'atelier', 'presentiel', 60, 3500, false, false, 8, NULL, true, 80),
  ('atelier-lsf-visio', 'Atelier LSF en visio', 'Atelier en visioconférence. Lien envoyé automatiquement.', 'atelier', 'visio', 60, 3500, false, true, 1, NULL, true, 90);

-- ------------------------------------------------------------
-- Storage : bucket privé pour les factures PDF
-- (à exécuter aussi via le dashboard Supabase Storage si besoin)
-- ------------------------------------------------------------
-- INSERT INTO storage.buckets (id, name, public) VALUES ('factures', 'factures', false);
-- Les policies Storage se configurent dans le dashboard ou via SQL storage.
