# Architecture React - Plateforme Fixer

## Vue d'ensemble

Le projet utilise une **architecture modulaire hybride** combinant plusieurs patterns de conception React modernes pour créer une application scalable et maintenable.

## 🏗️ Architecture Principale : **Feature-Based + Layered Architecture**

### Structure des dossiers

```
FrontEnd/src/
├── api.js                    # Configuration Axios centralisée
├── App.jsx                   # Point d'entrée et routage
├── main.jsx                  # Bootstrap de l'application
│
├── contexts/                 # Gestion d'état global (Context API)
│   └── AuthContext.jsx       # Contexte d'authentification
│
├── pages/                    # Pages principales (Routes)
│   ├── Login.jsx
│   ├── SignUp.jsx
│   ├── AdminDashboard.jsx
│   ├── Messages.jsx
│   ├── Profile.jsx
│   ├── UserProfile.jsx
│   └── Cart.jsx
│
├── components/               # Composants réutilisables
│   ├── admin/                # Composants spécifiques admin
│   │   ├── AdminNotifications.jsx
│   │   ├── MessageManagement.jsx
│   │   ├── PublicationManagement.jsx
│   │   └── UserManagement.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── ProtectedRoute.jsx
│   ├── Chatbot.jsx
│   └── useCart.jsx          # Custom Hook
│
├── shared/                   # Composants partagés (Layout)
│   ├── layout/
│   │   └── index.jsx         # Layout principal
│   ├── nav/
│   │   └── index.jsx         # Navigation
│   └── footer/
│       └── index.jsx         # Footer
│
└── assets/                    # Ressources statiques
    └── logo.png
```

## 📐 Patterns Architecturaux Utilisés

### 1. **Context API Pattern** (Gestion d'état global)

**Fichier** : `contexts/AuthContext.jsx`

```javascript
// Pattern Provider/Consumer
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  // Logique d'authentification centralisée
  const login = async (email, password) => { ... };
  const logout = () => { ... };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook pour accéder au contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Avantages** :
- ✅ Évite le prop drilling
- ✅ État global accessible partout
- ✅ Séparation claire des responsabilités

### 2. **Component-Based Architecture** (Standard React)

**Séparation des responsabilités** :
- **Pages** : Composants de niveau route (Login, SignUp, Messages)
- **Components** : Composants réutilisables (Button, Card, Input)
- **Shared** : Composants de layout (Navbar, Footer, Layout)

**Exemple** :
```javascript
// Page (Container)
const Messages = () => {
  const { user } = useAuth(); // Utilise le contexte
  const [messages, setMessages] = useState([]);
  
  return (
    <Layout>
      <Card>
        <MessageList messages={messages} />
        <MessageForm onSubmit={handleSend} />
      </Card>
    </Layout>
  );
};
```

### 3. **Custom Hooks Pattern**

**Fichier** : `components/useCart.jsx`

```javascript
// Logique réutilisable encapsulée dans un hook
export const useCart = () => {
  const [cart, setCart] = useState([]);
  
  const addToCart = (item) => { ... };
  const removeFromCart = (id) => { ... };
  
  return { cart, addToCart, removeFromCart };
};
```

**Avantages** :
- ✅ Réutilisabilité de la logique
- ✅ Séparation logique/UI
- ✅ Testabilité améliorée

### 4. **Protected Route Pattern**

**Fichier** : `components/ProtectedRoute.jsx`

```javascript
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

**Utilisation** :
```javascript
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 5. **API Service Layer Pattern**

**Fichier** : `api.js`

```javascript
// Configuration centralisée d'Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Intercepteurs pour authentification automatique
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Déconnexion automatique
    }
    return Promise.reject(error);
  }
);
```

**Avantages** :
- ✅ Configuration centralisée
- ✅ Authentification automatique
- ✅ Gestion d'erreurs unifiée

### 6. **Layout Pattern**

**Fichier** : `shared/layout/index.jsx`

```javascript
export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
```

**Utilisation dans App.jsx** :
```javascript
<Route
  path="/*"
  element={
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </Layout>
  }
/>
```

## 🔄 Flux de Données

### 1. **Authentification**

```
User → Login.jsx → AuthContext.login() → API → localStorage → AuthContext.setUser()
                                                              ↓
                                                    Tous les composants ont accès via useAuth()
```

### 2. **Routage**

```
App.jsx (Router)
  ├── Routes publiques (Login, SignUp)
  ├── Routes protégées (ProtectedRoute)
  │   ├── Messages
  │   ├── Profile
  │   └── Cart
  └── Routes admin (requireAdmin=true)
      └── AdminDashboard
```

### 3. **Communication avec le Backend**

```
Component → api.js (Axios) → Intercepteurs → Backend API
                              ↓
                        Token automatique
                        Gestion d'erreurs
```

## 🎯 Principes de Conception

### 1. **Single Responsibility Principle (SRP)**
- Chaque composant a une responsabilité unique
- `Login.jsx` : Gère uniquement la connexion
- `Messages.jsx` : Gère uniquement les messages
- `AuthContext.jsx` : Gère uniquement l'authentification

### 2. **Separation of Concerns**
- **UI** : Composants React (JSX)
- **Logique métier** : Custom Hooks, Context
- **API** : Service layer (api.js)
- **Routage** : App.jsx

### 3. **DRY (Don't Repeat Yourself)**
- Composants réutilisables (Button, Card, Input)
- Custom Hooks pour logique partagée
- Configuration centralisée (api.js)

### 4. **Composition over Inheritance**
- Utilisation de composition de composants
- Layout composé de Navbar + Main + Footer
- Pas d'héritage de classes

## 📦 Technologies et Bibliothèques

### Core
- **React 18** : Bibliothèque UI
- **React Router v6** : Routage
- **Axios** : Client HTTP

### State Management
- **Context API** : État global (pas de Redux)
- **useState/useEffect** : État local

### Styling
- **Tailwind CSS** : Framework CSS utility-first
- **CSS Variables** : Variables CSS personnalisées

### Build Tools
- **Vite** : Build tool moderne
- **ESLint** : Linting (si configuré)

## 🏛️ Architecture en Couches

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  (Pages, Components, Shared)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         State Management Layer           │
│  (Context API, Custom Hooks)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Service Layer                    │
│  (api.js, Axios Interceptors)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Backend API                      │
│  (Spring Boot REST API)                 │
└─────────────────────────────────────────┘
```

## 🔐 Sécurité

### 1. **Authentification**
- JWT stocké dans `localStorage`
- Token ajouté automatiquement via intercepteur Axios
- Déconnexion automatique sur erreur 401

### 2. **Protection des Routes**
- `ProtectedRoute` pour routes authentifiées
- `requireAdmin` pour routes admin uniquement

### 3. **Validation**
- Validation côté client (formulaires)
- Validation côté serveur (backend)

## 📊 Avantages de cette Architecture

### ✅ **Scalabilité**
- Structure modulaire facile à étendre
- Séparation claire des responsabilités
- Ajout de nouvelles features sans impact sur l'existant

### ✅ **Maintenabilité**
- Code organisé et lisible
- Patterns cohérents
- Facile à déboguer

### ✅ **Réutilisabilité**
- Composants réutilisables
- Custom Hooks partagés
- Configuration centralisée

### ✅ **Performance**
- Pas de surcharge (pas de Redux pour un projet de cette taille)
- Context API suffisant pour l'état global
- Code splitting possible avec React.lazy()

## 🔄 Évolutions Possibles

### Pour un projet plus grand :
1. **Ajouter Redux/Zustand** si l'état global devient complexe
2. **Code splitting** avec `React.lazy()` et `Suspense`
3. **Feature folders** : Organiser par fonctionnalité plutôt que par type
4. **Tests** : Ajouter Jest + React Testing Library
5. **TypeScript** : Migration pour la sécurité de types

## 📝 Résumé

L'architecture utilisée est une **architecture modulaire hybride** qui combine :
- **Feature-Based** : Organisation par fonctionnalité (admin/, pages/)
- **Layered** : Séparation en couches (presentation, state, service)
- **Component-Based** : Composants React réutilisables
- **Context API** : Gestion d'état global légère
- **Service Layer** : Configuration API centralisée

Cette architecture est **adaptée pour une application de taille moyenne** comme Fixer, offrant un bon équilibre entre simplicité et scalabilité.

