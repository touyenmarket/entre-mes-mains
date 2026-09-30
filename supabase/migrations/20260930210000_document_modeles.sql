CREATE TABLE IF NOT EXISTS document_modeles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('devis', 'facture')),
  client_nom TEXT NOT NULL DEFAULT '',
  client_email TEXT NOT NULL DEFAULT '',
  client_adresse TEXT,
  designation TEXT NOT NULL DEFAULT '',
  details TEXT,
  quantite NUMERIC NOT NULL DEFAULT 1,
  prix_unitaire_cents INTEGER NOT NULL DEFAULT 0,
  paiement_mention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE document_modeles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "document_modeles_admin_all" ON document_modeles;
CREATE POLICY "document_modeles_admin_all"
  ON document_modeles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

GRANT ALL ON TABLE document_modeles TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';
