CREATE TABLE IF NOT EXISTS site_textes (
  cle TEXT PRIMARY KEY,
  page TEXT NOT NULL DEFAULT 'Accueil',
  label TEXT NOT NULL DEFAULT '',
  valeur TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE site_textes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_textes_public_read" ON site_textes;
CREATE POLICY "site_textes_public_read"
  ON site_textes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "site_textes_admin_write" ON site_textes;
CREATE POLICY "site_textes_admin_write"
  ON site_textes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

GRANT SELECT ON TABLE site_textes TO anon, authenticated, service_role;
GRANT ALL ON TABLE site_textes TO authenticated, service_role;
NOTIFY pgrst, 'reload schema';
