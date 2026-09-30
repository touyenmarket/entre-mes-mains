# Entre mes mains — plateforme de réservation

Site web **Naturopathie & Massage bien-être à domicile** : consultations en visio,
massages à domicile (prénatal, postnatal, intuitif, bébé), atelier de langue des signes
pour bébé, réservation en ligne et paiement sécurisé.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Supabase** en production (PostgreSQL + Auth + Storage) — schéma dans `supabase/migrations/`
- Paiement : PayPal (adaptateur prêt pour Wero via un PSP) · Visio : Zoom (ou lien fixe)
- Emails : Brevo · Distance : OpenRouteService

## Démarrer en local

```bash
npm install
npm run dev   # http://localhost:3000
npm test      # km, dates, textes, numéros devis
```

Copier `.env.example` vers `.env.local` et renseigner les clés au fur et à mesure.
Sans aucune clé, le site fonctionne en **mode démo** (paiement simulé, emails journalisés).

## Structure

```
app/            pages (publiques, réservation, espace patient, admin, API)
components/     design system & composants partagés
lib/            logique métier (tarification km, config, adaptateurs…)
supabase/       migrations SQL (identique local & production)
docs/           documents du projet (architecture…)
```

## État d'avancement

| Étape | Contenu | Statut |
|---|---|---|
| 1 | Squelette + design system + pages publiques | ✅ livré |
| 2 | Schéma SQL + clients Supabase + guide GitHub/Vercel | ✅ livré |
| 3 | Auth (lien magique, rôles patient / admin) | ✅ livré |
| 4 | Calendrier admin + créneaux + réservations (naturo, massage, bébé signes) | ✅ livré |
| 5 | Paiement PayPal (compte Pro) + espèces + statuts | ✅ livré |
| 6 | Visio auto (naturo) + emails Brevo (réservation + paiement + facture) | ✅ livré |
| 7 | Factures PDF auto + devis/factures manuels + journal comptable + export CSV | ✅ livré |
| 8 | Chat Tawk.to + pages légales + print (hors repo) | ✅ livré |
| 9 | Recette complète + tests automatisés | ✅ livré — `docs/recette.md` + `npm test` |

## Documents

- Architecture validée : [`docs/architecture.md`](../docs/architecture.md)
- **Guide hébergement** : [`docs/guide-hebergement-github-supabase-vercel.md`](../docs/guide-hebergement-github-supabase-vercel.md)
- Compte rendu : [`docs/compte-rendu.md`](../docs/compte-rendu.md)
- **Recette** : [`docs/recette.md`](docs/recette.md)
