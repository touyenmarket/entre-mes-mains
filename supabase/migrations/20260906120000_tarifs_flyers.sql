-- Aligner les tarifs / durées sur les flyers Katia (sept. 2026)
UPDATE prestations SET
  label = 'Massage prénatal',
  duree_min = 75,
  prix_base_cents = 6000,
  description = 'À partir du 4e mois. Massage du dos, allongée sur le côté, huile végétale bio sans HE.'
WHERE slug LIKE '%prenatal%' OR label ILIKE '%prénatal%';

UPDATE prestations SET
  label = 'Massage postnatal',
  duree_min = 90,
  prix_base_cents = 7500,
  description = 'Dos et bras. Bol tibétain, diapason, rebozo. Huile végétale bio sans HE.'
WHERE slug LIKE '%postnatal%' OR label ILIKE '%postnatal%';

UPDATE prestations SET
  label = 'Massage bien-naître bébé',
  duree_min = 90,
  prix_base_cents = 8000,
  description = 'Séance 1h à 2h à domicile. Thème au choix + baby yoga.'
WHERE slug LIKE '%bebe%' AND label NOT ILIKE '%forfait%';

UPDATE prestations SET
  label = 'Forfait 4 massages bébé',
  duree_min = 90,
  prix_base_cents = 28000,
  description = '4 séances — 70 € la séance. Accompagnement dans le temps.'
WHERE label ILIKE '%forfait%' AND (label ILIKE '%bébé%' OR label ILIKE '%bebe%');

UPDATE prestations SET
  prix_base_cents = 6500,
  duree_min = 75,
  description = 'Atelier signes associés à la parole. 1h à 1h45. Devis pour les professionnels.'
WHERE type = 'atelier' AND label NOT ILIKE '%forfait%' AND label NOT ILIKE '%collectif%';
