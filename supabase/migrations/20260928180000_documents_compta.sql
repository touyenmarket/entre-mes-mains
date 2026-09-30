-- Documents manuels (devis / factures hors réservation) + charges

CREATE TABLE IF NOT EXISTS documents_manuels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('devis', 'facture')),
  numero TEXT NOT NULL UNIQUE,
  client_nom TEXT NOT NULL,
  client_email TEXT NOT NULL DEFAULT '',
  client_adresse TEXT,
  designation TEXT NOT NULL,
  details TEXT,
  lignes JSONB NOT NULL DEFAULT '[]'::jsonb,
  montant_ht_cents INTEGER NOT NULL DEFAULT 0,
  tva_taux NUMERIC(5,2) NOT NULL DEFAULT 0,
  tva_cents INTEGER NOT NULL DEFAULT 0,
  montant_ttc_cents INTEGER NOT NULL,
  tva_mention TEXT NOT NULL DEFAULT 'TVA non applicable, art. 293 B du CGI',
  paiement_mention TEXT,
  statut TEXT NOT NULL DEFAULT 'brouillon',
  devis_source_id UUID REFERENCES documents_manuels(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_manuels_kind ON documents_manuels(kind);
CREATE INDEX IF NOT EXISTS idx_documents_manuels_created ON documents_manuels(created_at DESC);

CREATE TABLE IF NOT EXISTS charges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_charge DATE NOT NULL DEFAULT CURRENT_DATE,
  libelle TEXT NOT NULL,
  montant_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_charges_date ON charges(date_charge DESC);

ALTER TABLE documents_manuels ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_manuels_admin_all"
  ON documents_manuels FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

CREATE POLICY "charges_admin_all"
  ON charges FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );
