# Cotes Menuiserie

Application web simple permettant de saisir les cotes de menuiseries (fenêtres, portes-fenêtres, châssis fixes, coulissants, etc.) repère par repère, et de générer un rapport de cotes professionnel au format PDF.

## Fonctionnalités prévues

- Choix du type de menuiserie (fenêtre 1 vantail, fenêtre 2 vantaux, porte-fenêtre 1/2 vantaux, châssis fixe, coulissant, ... liste extensible)
- Saisie des cotes par repère : largeur, hauteur, cote bâti, type de vitrage (dépoli, fixe sécurité, ...), teinte PVC extérieur/intérieur, référence panneau
- Ajout illimité de repères (Repère 1, Repère 2, ...)
- Génération d'un rapport PDF avec mise en page professionnelle, un bloc par repère
- Aucune installation nécessaire : fonctionne directement dans un navigateur (ordinateur ou tablette)

## Utilisation

Ouvrir le fichier `index.html` dans un navigateur (ou héberger le dossier sur un serveur statique / GitHub Pages).

## Structure du projet

- `index.html` : page principale de l'application (formulaire)
- `style.css` : mise en forme de l'application
- `app.js` : logique de saisie des repères, gestion des données
- `pdf.js` (généré / lib externe) : génération du rapport PDF

## Roadmap

Voir les issues du dépôt pour le détail des tâches en cours.
