# 📐 Cotation Menuiserie

Application web pour générer des devis et rapports de cotation pour menuiseries (fenêtres, portes, etc.).

## ✨ Fonctionnalités

✅ **Formulaire complet** avec informations client et spécifications techniques  
✅ **8 types de menuiseries** disponibles (fenêtres, portes, coulissants, etc.)  
✅ **4 types de pose** : Applique, Tunnel, Feuillure, Rénovation  
✅ **Dimensions en millimètres (mm)** pour plus de précision  
✅ **Schémas SVG vectoriels** pour chaque type de menuiserie  
✅ **Calcul automatique** des prix et remises  
✅ **Aperçu du rapport** avant génération  
✅ **Export PDF** professionnel et téléchargeable  
✅ **Design responsive** (mobile, tablette, desktop)  

## 🚀 Démarrage Rapide

### Installation

1. Clonez le repository :
```bash
git clone https://github.com/ElieRod/cotes-menuiserie.git
cd cotes-menuiserie
```

2. Ouvrez `index.html` dans votre navigateur
```bash
open index.html
```

Aucune dépendance d'installation requise ! (Les librairies jsPDF sont chargées depuis CDN)

## 📋 Utilisation

1. **Remplissez le formulaire** avec les informations client
2. **Sélectionnez le type de menuiserie** et le type de pose
3. **Entrez les dimensions en mm** (largeur × hauteur)
4. **Cliquez sur "Aperçu"** pour voir le rapport avant génération
5. **Cliquez sur "Générer PDF"** pour télécharger le devis

## 🔧 Configuration

### Types de Menuiseries
- Fenêtre 1 vantail
- Fenêtre 2 vantaux
- Porte 1 vantail
- Porte 2 vantaux
- Coulissant
- Oscillo-battant
- Châssis fixe
- Autre

### Types de Pose
- **Applique** : Pose en façade
- **Tunnel** : Pose dans l'épaisseur du mur
- **Feuillure** : Pose dans la feuillure existante
- **Rénovation** : Remplacement de menuiserie existante

### Matériaux Disponibles
- PVC
- Aluminium
- Bois
- Bois-Aluminium

### Types de Vitrage
- Simple
- Double
- Triple

## 📁 Structure des Fichiers

```
cotes-menuiserie/
├── index.html          # Page principale
├── style.css           # Styles CSS
├── app.js              # Logique JavaScript principale
├── schemas.js          # Gestion des schémas SVG
├── package.json        # Informations du projet
├── README.md           # Cette documentation
├── .gitignore          # Fichiers à ignorer
└── assets/
    └── schemas/        # Schémas SVG vectoriels
        ├── fenetre-1-vantail.svg
        ├── fenetre-2-vantaux.svg
        ├── porte-1-vantail.svg
        ├── porte-2-vantaux.svg
        ├── coulissant.svg
        ├── oscillo-battant.svg
        ├── chassis-fixe.svg
        └── autre.svg
```

## 🎨 Customisation

### Modifier les couleurs
Éditez `style.css` et changez les valeurs hex :
```css
#667eea  /* Bleu primaire */
#764ba2  /* Violet secondaire */
```

### Ajouter un nouveau type de menuiserie
1. Créez un nouveau fichier SVG dans `assets/schemas/`
2. Ajoutez une entrée dans `schemas.js`

## 💡 Améliorations Futures

- [ ] Sauvegarde automatique des données
- [ ] Base de données client
- [ ] Historique des devis
- [ ] Signatures numériques
- [ ] Mode sombre

## 📝 Bugs Corrigés (v1.1)

✅ Hauteur en millimètres (mm) au lieu de mètres  
✅ Suppression du champ "Cote Bâti"  
✅ Ajout de "Type de Pose"  
✅ Correction des pages blanches dans le PDF  
✅ Intégration des schémas SVG vectoriels  

## 📧 Support

Pour toute question ou suggestion, contactez : elie.rodriguez@example.com

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Dernière mise à jour** : 14/09/2026  
**Version** : 1.1