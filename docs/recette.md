# Recette — Entre mes mains

Parcours à valider avant / après chaque mise en ligne.
Cocher. Noter le navigateur (Chrome / Safari iPhone) et la date.

## A. Pages publiques
- [ ] Accueil : titre, boutons, cartes naturo / massage / bébé signes
- [ ] Naturopathie : hero, déroulé, tarifs, bouton réserver
- [ ] Massages : accordéons prénatal / postnatal / bébé / forfait + précautions
- [ ] Bébé signes : formats + note professionnels
- [ ] Contact : formulaire + e-mail
- [ ] Mentions / CGV / confidentialité s’ouvrent
- [ ] Pied de page : logo, Sancheville / Villages Vovéens, accessibilité
- [ ] Header : 3 offres plus visibles que Connexion / Contact
- [ ] Bulle Tawk.to visible

## B. Compte patient
- [ ] Lien magique reçu et connexion OK
- [ ] Espace « Mes rendez-vous » liste les résas
- [ ] PDF facture téléchargeable si payé
- [ ] Lien visio présent sur une naturo payée

## C. Réservation
- [ ] Depuis Naturopathie → uniquement prestations naturo
- [ ] Depuis Massages → uniquement massages
- [ ] Depuis Bébé signes → uniquement atelier
- [ ] Calendrier compact, jours avec créneaux en surbrillance
- [ ] Créneau **futur** obligatoire (un créneau passé n’apparaît pas)
- [ ] Massage domicile : adresse → km auto → total mis à jour
- [ ] 15 km inclus, puis 0,55 €/km (ex. 30 km → 8,25 €)
- [ ] Choix PayPal **ou** espèces
- [ ] Consentement obligatoire
- [ ] Mail de confirmation à la réservation

## D. Paiement
- [ ] PayPal vers `entremesmains28@gmail.com`
- [ ] Test 1 € (prestation test + créneau futur + même fiche)
- [ ] Après paiement : mail + facture PDF
- [ ] Naturo payée : lien visio dans le mail
- [ ] Espèces : mail qui confirme le mode de paiement

## E. Admin calendrier
- [ ] Heures 00–23 h, minutes 00 et 30 en premier puis 01–59
- [ ] Lier à une prestation = visible seulement sur cette fiche
- [ ] Laisser vide = toutes les prestations du même format

## F. Devis / factures manuels
- [ ] Créer un devis → PDF « DEVIS N°X » + mention *Ce document est un devis. Il ne vaut pas une véritable facture.*
- [ ] N° interne (D-2026-00N) + N° affiché client
- [ ] Convertir devis → facture (case e-mail)
- [ ] Facture directe sans devis → PDF + mail
- [ ] Enregistrer un modèle + le réutiliser
- [ ] Supprimer un modèle (message de confirmation)

## G. Comptabilité
- [ ] Journal : résas + documents manuels
- [ ] Ligne cliquable → détail
- [ ] Export CSV sur la période choisie

## H. Textes du site
- [ ] Bouton visible sur l’espace (à côté de Calendrier)
- [ ] Modifier un titre accueil → visible après rechargement
- [ ] Modifier un encadré massage → visible dans l’accordéon
- [ ] Champ vide = texte d’origine

## I. Technique
- [ ] `npm run build` vert sur Vercel
- [ ] `npm test` vert en local
- [ ] SQL `site-textes.sql` exécuté
- [ ] Security Advisor : 0 erreur (warnings password OK si option Auth cochée)
