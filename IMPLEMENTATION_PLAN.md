# Plan d'Implémentation - Site Web de Réparation Électroménager

## Fonctionnalités à Implémenter

### 1. ✅ Affichage des mots de passe (À corriger)
- Le backend retourne déjà les mots de passe hashés
- Vérifier pourquoi ils ne s'affichent pas dans le frontend
- Le code semble correct, peut-être un problème de réponse HTTP

### 2. Création de publications directement vérifiées par l'admin
- Ajouter un formulaire dans PublicationManagement
- Créer un endpoint admin pour créer directement des publications vérifiées
- Le endpoint utilisera le même code que /api/pub/create mais avec verified=true

### 3. Système de paiement complet
- Page catalogue déjà créée avec modal de paiement
- Améliorer la validation des cartes
- Ajouter un endpoint backend pour enregistrer les transactions
- Créer une table Payment dans la base de données

### 4. Vérification d'email via Google OAuth
- Intégrer Google OAuth 2.0
- Ajouter des boutons "Se connecter avec Google"
- Vérifier automatiquement l'email après connexion Google

### 5. Design professionnel avec logo
- Créer un logo SVG
- Améliorer le design général
- Uniformiser les couleurs et le style

## Structure de Fichiers à Créer/Modifier

### Backend (ServiceElectro)
1. AdminController.java - Ajouter endpoint création publication vérifiée
2. PaymentController.java - Nouveau controller pour les paiements
3. Payment entity/DTO/Repository - Nouveau système de paiement
4. AuthController.java - Ajouter Google OAuth

### Frontend (FrontEnd)
1. PublicationManagement.jsx - Ajouter formulaire création directe
2. shop.jsx - Améliorer système de paiement
3. Login.jsx - Ajouter bouton Google OAuth
4. Logo SVG - Créer logo professionnel
5. HomePage.jsx - Améliorer design

## Priorités

1. **Urgent** : Corriger affichage mots de passe + Formulaire admin création publications
2. **Important** : Système de paiement + Logo et design
3. **Souhaitable** : Google OAuth




