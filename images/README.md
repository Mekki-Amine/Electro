# Dossier des Images pour le Rapport PFE

Ce dossier contient toutes les images nécessaires pour le rapport LaTeX.

## Structure des dossiers

```
images/
├── diagrammes/
│   ├── cas_utilisation.png
│   ├── classes.png
│   ├── sequence_authentification.png
│   ├── sequence_inscription.png
│   └── architecture_logicielle.png
└── screenshots/
    ├── inscription.png
    ├── authentification.png
    ├── authentification_google.png
    ├── publication.png
    ├── catalogue.png
    ├── catalogue_recherche.png
    ├── admin_publications.png
    ├── panier.png
    ├── messagerie.png
    ├── messagerie_conversation.png
    ├── admin_utilisateurs.png
    ├── notifications.png
    ├── chatbot.png
    ├── chatbot_recherche.png
    ├── accueil.png
    └── profil.png
```

## Instructions pour ajouter les images

### 1. Diagrammes UML

Créez vos diagrammes UML avec un outil comme :
- **Draw.io** (https://app.diagrams.net/)
- **PlantUML**
- **Lucidchart**
- **StarUML**

Exportez-les en PNG ou PDF avec une résolution d'au moins 300 DPI pour une bonne qualité d'impression.

### 2. Captures d'écran

Pour prendre des captures d'écran de qualité :

1. **Sur Windows** : Utilisez l'outil Capture d'écran (Win + Shift + S)
2. **Sur Mac** : Utilisez Cmd + Shift + 4
3. **Outils recommandés** : 
   - **Greenshot** (Windows)
   - **Snagit**
   - **ShareX** (Windows)

**Conseils pour les captures d'écran** :
- Utilisez un navigateur en mode plein écran
- Masquez les informations sensibles si nécessaire
- Utilisez une résolution d'au moins 1920x1080
- Sauvegardez en PNG pour une meilleure qualité

### 3. Format des images

- **Format recommandé** : PNG (pour les captures d'écran et diagrammes)
- **Résolution minimale** : 300 DPI pour l'impression
- **Taille** : Les images seront redimensionnées automatiquement par LaTeX

### 4. Noms des fichiers

Respectez exactement les noms de fichiers indiqués dans la structure ci-dessus, car le fichier LaTeX les référence directement.

## Images manquantes

Si une image n'est pas disponible, LaTeX affichera une erreur lors de la compilation. Vous pouvez :
1. Créer une image placeholder temporaire
2. Commenter la ligne `\includegraphics` dans le fichier .tex
3. Ajouter l'image manquante dans le bon dossier

## Exemple de création d'un diagramme

Pour créer un diagramme de cas d'utilisation avec Draw.io :

1. Allez sur https://app.diagrams.net/
2. Créez un nouveau diagramme
3. Utilisez les formes UML pour créer votre diagramme
4. Exportez en PNG (Fichier > Exporter > PNG)
5. Sauvegardez dans `images/diagrammes/cas_utilisation.png`


