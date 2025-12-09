# Fixer - Service de Réparation Électronique
## Documentation Complète et Guide d'Utilisation

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Fichiers de Documentation](#fichiers-de-documentation)
3. [Améliorations Apportées](#améliorations-apportées)
4. [Structure du Projet](#structure-du-projet)
5. [Guide de Démarrage](#guide-de-démarrage)
6. [Architecture](#architecture)

---

## Vue d'Ensemble

**Fixer** est une application web complète de gestion de services de réparation d'électroménagers. Elle permet aux utilisateurs de publier des demandes de réparation, consulter un catalogue, communiquer via un système de messagerie, et gérer un panier d'achat.

### Technologies

- **Backend** : Spring Boot 3.4.3 (Java 21)
- **Frontend** : React 18 + Vite + Tailwind CSS
- **Base de données** : MySQL 8.0
- **Sécurité** : JWT (JSON Web Tokens)
- **Déploiement** : Render (Frontend & Backend), Railway (Database)

---

## Fichiers de Documentation

### 📚 Documentation Technique

**`DOCUMENTATION_TECHNIQUE.md`**
- Architecture complète de l'application
- Explication détaillée du backend (Spring Boot)
- Explication détaillée du frontend (React)
- Diagrammes UML (Classes, Séquence, Activité)
- Documentation de l'API REST
- Schéma de la base de données
- Configuration de sécurité
- Guide de déploiement

### 📊 Rapport d'Analyse

**`RAPPORT_ANALYSE.md`**
- Analyse complète du code
- Points forts et points d'amélioration
- Recommandations (court, moyen, long terme)
- Métriques et statistiques
- Diagrammes détaillés
- Cas d'utilisation

### 📖 Ce Fichier

**`README_COMPLET.md`**
- Vue d'ensemble
- Guide de démarrage rapide
- Structure du projet
- Liens vers la documentation

---

## Améliorations Apportées

### 🎨 Design et Interface

✅ **Amélioration du CSS global**
- Variables CSS personnalisées pour un thème cohérent
- Animations et transitions fluides
- Scrollbars personnalisées
- Effets glass et gradients modernes

✅ **Composants UI améliorés**
- Boutons avec effets hover améliorés
- Cartes avec animations
- Inputs avec focus states améliorés

### 🧹 Nettoyage du Code

✅ **Frontend**
- Création du fichier `api.js` centralisé pour les appels API
- Correction de la navbar pour utiliser l'instance `api`
- Suppression des références à `axios` directes
- Amélioration de la gestion des erreurs

✅ **Backend**
- Documentation des points d'amélioration (logs, transactions)
- Identification des zones à optimiser

### 📝 Documentation

✅ **Documentation Technique Complète**
- Architecture détaillée
- Explication de chaque couche
- Diagrammes UML complets
- Guide API REST

✅ **Rapport d'Analyse**
- Analyse approfondie du code
- Recommandations concrètes
- Métriques du projet

---

## Structure du Projet

```
ReparationService/
├── FrontEnd/                    # Application React
│   ├── src/
│   │   ├── api.js              # Configuration Axios (NOUVEAU)
│   │   ├── components/         # Composants réutilisables
│   │   ├── pages/              # Pages de l'application
│   │   ├── contexts/           # Context API
│   │   ├── shared/             # Composants partagés
│   │   ├── App.jsx              # Routeur principal
│   │   └── index.css            # Styles globaux (AMÉLIORÉ)
│   └── package.json
│
├── ServiceElectro/              # Application Spring Boot
│   ├── src/main/java/org/example/serviceelectro/
│   │   ├── config/             # Configurations
│   │   ├── entities/            # Entités JPA
│   │   ├── repository/          # Repositories
│   │   ├── servicees/           # Services métier
│   │   ├── controler/            # Contrôleurs REST
│   │   ├── dto/                  # Data Transfer Objects
│   │   └── mapper/               # Mappers
│   └── src/main/resources/
│       └── application.properties
│
└── Documentation/               # Documentation (NOUVEAU)
    ├── DOCUMENTATION_TECHNIQUE.md
    ├── RAPPORT_ANALYSE.md
    └── README_COMPLET.md
```

---

## Guide de Démarrage

### Prérequis

- **Java 21** ou supérieur
- **Node.js 18+** et npm
- **MySQL 8.0+**
- **Maven 3.6+**

### Installation Backend

```bash
cd ServiceElectro

# Configurer la base de données dans application.properties
# Modifier :
# - spring.datasource.url
# - spring.datasource.username
# - spring.datasource.password

# Compiler et lancer
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur `http://localhost:9090`

### Installation Frontend

```bash
cd FrontEnd

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

### Variables d'Environnement

**Frontend** (optionnel) :
```env
VITE_API_URL=https://electro-433v.onrender.com
```

**Backend** (pour le déploiement) :
```env
DATABASE_URL=jdbc:mysql://host:port/database?...
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
PORT=9090
```

---

## Architecture

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  Pages → Components → Context API → API Calls               │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST
                        │ JSON
┌───────────────────────▼─────────────────────────────────────┐
│                    BACKEND (Spring Boot)                    │
│  Controllers → Services → Repositories → Entities           │
└───────────────────────┬─────────────────────────────────────┘
                        │ JDBC
                        │ SQL
┌───────────────────────▼─────────────────────────────────────┐
│                    DATABASE (MySQL)                          │
│  Tables: utilisateur, publication, message, ...            │
└─────────────────────────────────────────────────────────────┘
```

### Couches Backend

1. **Controller Layer** : Gère les requêtes HTTP
2. **Service Layer** : Logique métier
3. **Repository Layer** : Accès aux données
4. **Entity Layer** : Modèle de domaine

### Couches Frontend

1. **Pages** : Routes de l'application
2. **Components** : Composants réutilisables
3. **Contexts** : Gestion d'état globale
4. **API** : Appels au backend

---

## Diagrammes Disponibles

Tous les diagrammes sont disponibles dans `DOCUMENTATION_TECHNIQUE.md` :

1. **Diagramme de Classes** : Structure des entités et relations
2. **Diagramme de Séquence** : Flux d'authentification, création de publication
3. **Diagramme d'Activité** : Processus métier (login, vérification)
4. **Diagramme de Déploiement** : Architecture de déploiement
5. **Diagramme de Cas d'Utilisation** : Fonctionnalités par acteur

---

## Fonctionnalités Principales

### Pour les Utilisateurs

- ✅ Inscription et connexion
- ✅ Création de publications de réparation
- ✅ Consultation du catalogue
- ✅ Ajout au panier
- ✅ Messagerie avec autres utilisateurs
- ✅ Notifications en temps réel
- ✅ Gestion du profil

### Pour les Administrateurs

- ✅ Dashboard administrateur
- ✅ Vérification des publications
- ✅ Gestion des utilisateurs
- ✅ Gestion des messages
- ✅ Statistiques

---

## Sécurité

### Authentification

- **JWT (JSON Web Tokens)** : Tokens avec expiration de 24h
- **BCrypt** : Hashage des mots de passe (10 rounds)
- **Spring Security** : Protection des endpoints

### Autorisation

- **Rôles** : USER, ADMIN
- **Routes protégées** : Vérification du token JWT
- **CORS** : Configuration pour les origines autorisées

---

## API REST

### Endpoints Principaux

**Authentification**
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout/{userId}` - Déconnexion

**Utilisateurs**
- `POST /api/utilis` - Créer un compte
- `GET /api/utilis/profile/{userId}` - Profil utilisateur
- `PUT /api/utilis/profile/{userId}` - Mettre à jour le profil

**Publications**
- `GET /api/publications` - Liste des publications
- `POST /api/publications` - Créer une publication
- `PUT /api/publications/{id}/verify` - Vérifier (Admin)
- `DELETE /api/publications/{id}` - Supprimer

**Messages**
- `POST /api/messages` - Envoyer un message
- `GET /api/messages/conversation/{userId1}/{userId2}` - Conversation

**Panier**
- `GET /api/cart/user/{userId}` - Obtenir le panier
- `POST /api/cart/user/{userId}/items` - Ajouter un article
- `DELETE /api/cart/user/{userId}/items/{itemId}` - Supprimer un article

Voir `DOCUMENTATION_TECHNIQUE.md` pour la documentation complète de l'API.

---

## Déploiement

### Backend (Render)

1. Connecter le repository GitHub
2. Configurer les variables d'environnement :
   - `DATABASE_URL`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
3. Déployer

### Frontend (Render)

1. Connecter le repository GitHub
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Déployer

### Base de Données (Railway)

1. Créer une base MySQL
2. Récupérer les credentials
3. Configurer dans Render (variables d'environnement)

---

## Points d'Amélioration Identifiés

Voir `RAPPORT_ANALYSE.md` pour les détails complets.

### Court Terme

- Remplacer les `System.out.println()` par des loggers
- Ajouter la pagination
- Améliorer la gestion d'erreurs frontend

### Moyen Terme

- Ajouter des tests (unitaires et d'intégration)
- Optimiser les performances (cache, lazy loading)
- Améliorer la sécurité (rate limiting, refresh token)

### Long Terme

- Migration vers TypeScript
- Monitoring et observabilité
- Architecture microservices (si nécessaire)

---

## Support et Contact

Pour toute question ou problème :
1. Consulter la documentation technique
2. Vérifier le rapport d'analyse
3. Examiner les logs d'erreur

---

## Licence

Ce projet est un projet éducatif/démonstration.

---

**Dernière mise à jour** : Décembre 2025

