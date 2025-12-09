# Documentation Technique Complète
## Service de Réparation Électronique - Fixer

---

## Table des Matières

1. [Architecture Générale](#architecture-générale)
2. [Backend (Spring Boot)](#backend-spring-boot)
3. [Frontend (React)](#frontend-react)
4. [Diagrammes UML](#diagrammes-uml)
5. [API REST](#api-rest)
6. [Base de Données](#base-de-données)
7. [Sécurité](#sécurité)
8. [Déploiement](#déploiement)

---

## Architecture Générale

### Vue d'Ensemble

L'application **Fixer** est une plateforme web de gestion de services de réparation d'électroménagers. Elle suit une architecture **3-tiers** :

```
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE PRÉSENTATION                      │
│              React + Vite + Tailwind CSS                     │
│              (Frontend - Interface Utilisateur)              │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API
                        │ (JSON)
┌───────────────────────▼─────────────────────────────────────┐
│                    COUCHE LOGIQUE MÉTIER                     │
│              Spring Boot + Spring Security                   │
│              (Backend - Services & Contrôleurs)             │
└───────────────────────┬─────────────────────────────────────┘
                        │ JDBC/Hibernate
                        │ (SQL)
┌───────────────────────▼─────────────────────────────────────┐
│                    COUCHE DONNÉES                           │
│              MySQL (Railway)                                │
│              (Base de Données Relationnelle)               │
└─────────────────────────────────────────────────────────────┘
```

### Technologies Utilisées

**Backend:**
- Java 21
- Spring Boot 3.4.3
- Spring Security (JWT)
- Spring Data JPA / Hibernate
- MySQL 8.0
- Maven

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Context API

**Déploiement:**
- Render (Backend & Frontend)
- Railway (Base de données MySQL)

---

## Backend (Spring Boot)

### Structure du Projet

```
ServiceElectro/
├── src/main/java/org/example/serviceelectro/
│   ├── config/              # Configurations
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   ├── JwtUtil.java
│   │   └── GlobalExceptionHandler.java
│   ├── entities/            # Entités JPA
│   │   ├── Utilisateur.java
│   │   ├── Publication.java
│   │   ├── Comment.java
│   │   ├── Message.java
│   │   ├── Notification.java
│   │   ├── Cart.java
│   │   └── Recommendation.java
│   ├── repository/          # Repositories Spring Data
│   │   ├── UserRepository.java
│   │   ├── PublicationRepository.java
│   │   └── ...
│   ├── servicees/           # Services métier
│   │   ├── AuthService.java
│   │   ├── UserImpl.java
│   │   ├── PubImpl.java
│   │   └── ...
│   ├── controler/           # Contrôleurs REST
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── PubController.java
│   │   └── ...
│   ├── dto/                 # Data Transfer Objects
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   └── ...
│   └── mapper/              # Mappers DTO ↔ Entity
│       ├── UtilisateurMapper.java
│       └── ...
└── src/main/resources/
    └── application.properties
```

### Couches de l'Architecture Backend

#### 1. **Couche Contrôleur (Controller Layer)**

Les contrôleurs gèrent les requêtes HTTP et retournent les réponses JSON.

**Exemple : AuthController**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
```

**Responsabilités :**
- Recevoir les requêtes HTTP
- Valider les données d'entrée (@Valid)
- Appeler les services appropriés
- Retourner les réponses HTTP

#### 2. **Couche Service (Service Layer)**

Les services contiennent la logique métier de l'application.

**Exemple : AuthService**
```java
@Service
public class AuthService {
    @Autowired
    private UserImpl userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        // 1. Trouver l'utilisateur
        Utilisateur user = userService.findByEmail(request.getEmail());
        
        // 2. Vérifier le mot de passe
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }
        
        // 3. Générer le token JWT
        String token = jwtUtil.generateToken(user);
        
        // 4. Retourner la réponse
        return LoginResponse.builder()
            .token(token)
            .email(user.getEmail())
            .role(user.getRole())
            .userId(user.getId())
            .build();
    }
}
```

**Responsabilités :**
- Implémenter la logique métier
- Gérer les transactions
- Appeler les repositories
- Gérer les exceptions métier

#### 3. **Couche Repository (Data Access Layer)**

Les repositories gèrent l'accès aux données via Spring Data JPA.

**Exemple : UserRepository**
```java
@Repository
public interface UserRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    List<Utilisateur> findByRole(String role);
    Optional<Utilisateur> findByUsername(String username);
}
```

**Responsabilités :**
- Accès aux données
- Requêtes personnalisées
- Gestion des entités JPA

#### 4. **Couche Entity (Domain Model)**

Les entités représentent les tables de la base de données.

**Exemple : Utilisateur**
```java
@Entity
@Getter
@Setter
@Builder
public class Utilisateur implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String email;
    private String password;
    private String role;
    
    @OneToMany(mappedBy = "utilisateur")
    private List<Publication> publications;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

**Responsabilités :**
- Représenter les données
- Définir les relations
- Validation des données

### Flux de Données (Login)

```
1. Client (Frontend)
   └─> POST /api/auth/login
       { email, password }

2. AuthController
   └─> Valide la requête (@Valid)
   └─> Appelle AuthService.login()

3. AuthService
   └─> Trouve l'utilisateur (UserRepository.findByEmail)
   └─> Vérifie le mot de passe (BCrypt)
   └─> Génère le token JWT (JwtUtil)
   └─> Retourne LoginResponse

4. AuthController
   └─> Retourne ResponseEntity.ok(response)

5. Client (Frontend)
   └─> Reçoit { token, email, role, userId }
   └─> Stocke le token dans localStorage
```

### Sécurité

#### JWT (JSON Web Token)

**Génération du Token :**
```java
public String generateToken(Utilisateur user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("role", user.getRole());
    claims.put("userId", user.getId());
    
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(user.getEmail())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
}
```

**Validation du Token :**
```java
public Boolean validateToken(String token, UserDetails userDetails) {
    final String email = extractEmail(token);
    return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
}
```

#### Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/utilis").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

---

## Frontend (React)

### Structure du Projet

```
FrontEnd/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── ...
│   ├── pages/              # Pages de l'application
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   ├── HomePage.jsx
│   │   ├── Profile.jsx
│   │   └── ...
│   ├── contexts/           # Context API
│   │   └── AuthContext.jsx
│   ├── shared/             # Composants partagés
│   │   ├── nav/
│   │   ├── footer/
│   │   └── layout/
│   ├── api.js              # Configuration Axios
│   ├── App.jsx             # Routeur principal
│   └── main.jsx            # Point d'entrée
└── package.json
```

### Architecture Frontend

#### 1. **Composants**

**Composants Fonctionnels (Hooks)**
```jsx
import React, { useState } from 'react';

const Button = ({ children, onClick, variant = "primary" }) => {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

**Composants de Page**
```jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>Profil de {user?.username}</h1>
    </div>
  );
};
```

#### 2. **Context API (Gestion d'État)**

**AuthContext**
```jsx
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, userId, username } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setUser({ email, userId, username });
    setToken(token);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 3. **Configuration API (Axios)**

**api.js**
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://electro-433v.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api, API_BASE_URL };
```

### Flux de Navigation

```
App.jsx (Routeur)
│
├── /login → Login.jsx
├── /signup → SignUp.jsx
├── / → HomePage.jsx
├── /profile → Profile.jsx (ProtectedRoute)
├── /admin/* → AdminDashboard.jsx (ProtectedRoute + requireAdmin)
└── /* → Layout
    ├── Navbar
    ├── {children}
    └── Footer
```

### Gestion des Routes Protégées

```jsx
const ProtectedRoute = ({ children, requireAdmin = false }) => {
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

---

## Diagrammes UML

### Diagramme de Classes (Backend)

```
┌─────────────────────────────────────────────────────────────┐
│                        Utilisateur                           │
├─────────────────────────────────────────────────────────────┤
│ - id: Long                                                   │
│ - username: String                                           │
│ - email: String                                              │
│ - password: String                                           │
│ - role: String                                               │
│ - profilePhoto: String                                       │
│ - phone: String                                              │
│ - address: String                                            │
│ - emailVerified: Boolean                                     │
│ - isOnline: Boolean                                          │
│ - createdAt: LocalDateTime                                  │
│ - updatedAt: LocalDateTime                                  │
├─────────────────────────────────────────────────────────────┤
│ + getUsername(): String                                      │
│ + getAuthorities(): Collection<GrantedAuthority>            │
└───────────────────────┬─────────────────────────────────────┘
                        │ 1
                        │
                        │ *
┌───────────────────────▼─────────────────────────────────────┐
│                      Publication                             │
├─────────────────────────────────────────────────────────────┤
│ - id: Long                                                   │
│ - title: String                                              │
│ - description: String                                        │
│ - type: String                                               │
│ - price: Double                                              │
│ - status: String                                             │
│ - verified: Boolean                                          │
│ - inCatalog: Boolean                                         │
│ - inPublications: Boolean                                    │
│ - fileUrl: String                                            │
│ - createdAt: LocalDateTime                                  │
│ - updatedAt: LocalDateTime                                  │
├─────────────────────────────────────────────────────────────┤
│ + verify(): void                                             │
│ + unverify(): void                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │ 1
                        │
                        │ *
┌───────────────────────▼─────────────────────────────────────┐
│                        Comment                               │
├─────────────────────────────────────────────────────────────┤
│ - id: Long                                                   │
│ - content: String                                            │
│ - createdAt: LocalDateTime                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Message                               │
├─────────────────────────────────────────────────────────────┤
│ - id: Long                                                   │
│ - content: String                                            │
│ - fileUrl: String                                            │
│ - latitude: Double                                           │
│ - longitude: Double                                          │
│ - createdAt: LocalDateTime                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      Notification                            │
├─────────────────────────────────────────────────────────────┤
│ - id: Long                                                   │
│ - message: String                                            │
│ - type: String                                               │
│ - isRead: Boolean                                            │
│ - createdAt: LocalDateTime                                  │
└─────────────────────────────────────────────────────────────┘
```

### Diagramme de Séquence (Login)

```
Client          AuthController    AuthService    UserRepository    JwtUtil
  │                    │               │               │              │
  │──POST /login──────>│               │               │              │
  │                    │               │               │              │
  │                    │──login()─────>│               │              │
  │                    │               │               │              │
  │                    │               │──findByEmail()──────────────>│
  │                    │               │<──────────────Optional<User>│
  │                    │               │               │              │
  │                    │               │──matches()───>│              │
  │                    │               │<──true────────│              │
  │                    │               │               │              │
  │                    │               │──generateToken()───────────>│
  │                    │               │<──────────────Token──────────│
  │                    │               │               │              │
  │                    │<──LoginResponse──────────────│              │
  │<──200 OK───────────│               │               │              │
  │                    │               │               │              │
```

### Diagramme de Séquence (Création Publication)

```
Client          PubController    PubImpl    PublicationRepository    NotificationService
  │                    │            │              │                        │
  │──POST /pub────────>│            │              │                        │
  │                    │            │              │                        │
  │                    │──create()─>│              │                        │
  │                    │            │              │                        │
  │                    │            │──save()─────>│                        │
  │                    │            │<──Publication│                        │
  │                    │            │              │                        │
  │                    │            │──createNotification()───────────────>│
  │                    │            │              │<──Notification─────────│
  │                    │<──PublicationDTO──────────│                        │
  │<──201 Created──────│            │              │                        │
  │                    │            │              │                        │
```

### Diagramme d'Activité (Processus d'Authentification)

```
[Début]
  │
  ▼
[Saisie email/password]
  │
  ▼
{Email valide?}
  │ NO
  │ └─>[Afficher erreur]
  │ YES
  │
  ▼
[Envoyer requête POST /api/auth/login]
  │
  ▼
{Utilisateur trouvé?}
  │ NO
  │ └─>[Erreur: Email incorrect]
  │ YES
  │
  ▼
{Mot de passe correct?}
  │ NO
  │ └─>[Erreur: Mot de passe incorrect]
  │ YES
  │
  ▼
[Générer token JWT]
  │
  ▼
[Stocker token dans localStorage]
  │
  ▼
{Rôle = ADMIN?}
  │ YES
  │ └─>[Rediriger vers /admin]
  │ NO
  │
  ▼
[Rediriger vers /]
  │
  ▼
[Fin]
```

### Diagramme de Déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERNET                                │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   RENDER     │   │   RENDER     │   │   RAILWAY    │
│              │   │              │   │              │
│  Frontend    │   │  Backend     │   │   MySQL      │
│  (React)     │   │  (Spring)    │   │  Database    │
│              │   │              │   │              │
│  Port: 443   │   │  Port: 443   │   │  Port: 3306  │
└──────────────┘   └──────┬───────┘   └──────▲──────┘
                           │                   │
                           └───────JDBC────────┘
```

---

## API REST

### Endpoints Principaux

#### Authentification

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "user@example.com",
  "role": "USER",
  "userId": 1,
  "username": "john_doe"
}
```

**POST /api/auth/logout/{userId}**
- Déconnecte l'utilisateur
- Met à jour isOnline = false

#### Utilisateurs

**POST /api/utilis**
- Créer un nouveau compte

**GET /api/utilis/profile/{userId}**
- Obtenir le profil d'un utilisateur

**PUT /api/utilis/profile/{userId}**
- Mettre à jour le profil

#### Publications

**GET /api/publications**
- Liste toutes les publications

**POST /api/publications**
- Créer une nouvelle publication

**PUT /api/publications/{id}/verify**
- Vérifier une publication (Admin)

**DELETE /api/publications/{id}**
- Supprimer une publication

#### Messages

**POST /api/messages**
- Envoyer un message

**GET /api/messages/conversation/{userId1}/{userId2}**
- Obtenir la conversation entre deux utilisateurs

#### Panier

**GET /api/cart/user/{userId}**
- Obtenir le panier d'un utilisateur

**POST /api/cart/user/{userId}/items**
- Ajouter un article au panier

**DELETE /api/cart/user/{userId}/items/{itemId}**
- Supprimer un article du panier

---

## Base de Données

### Schéma Relationnel

```
Utilisateur (1) ────< (N) Publication
Utilisateur (1) ────< (N) Message (sender)
Utilisateur (1) ────< (N) Message (receiver)
Utilisateur (1) ────< (N) Notification
Utilisateur (1) ────< (1) Cart
Publication (1) ────< (N) Comment
Cart (1) ────< (N) CartItem
```

### Tables Principales

**utilisateur**
- id (PK)
- username
- email (UNIQUE)
- password (BCrypt)
- role (USER/ADMIN)
- profile_photo
- phone
- address
- email_verified
- is_online
- created_at
- updated_at

**publication**
- id (PK)
- title
- description
- type
- price
- status
- verified
- in_catalog
- in_publications
- file_url
- utilisateur_id (FK)
- created_at
- updated_at

**message**
- id (PK)
- content
- file_url
- latitude
- longitude
- sender_id (FK)
- receiver_id (FK)
- created_at

**cart**
- id (PK)
- utilisateur_id (FK)
- created_at
- updated_at

**cart_item**
- id (PK)
- cart_id (FK)
- publication_id (FK)
- quantity
- created_at

---

## Sécurité

### Authentification JWT

1. **Login** : L'utilisateur envoie email/password
2. **Validation** : Le serveur vérifie les credentials
3. **Token** : Génération d'un JWT avec :
   - Subject (email)
   - Role
   - UserId
   - Expiration (24h)
4. **Stockage** : Le client stocke le token dans localStorage
5. **Requêtes** : Le token est envoyé dans le header `Authorization: Bearer {token}`
6. **Validation** : Chaque requête protégée valide le token

### CORS Configuration

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "https://electro-2-d3sk.onrender.com"
        ));
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        return source;
    }
}
```

### Hashage des Mots de Passe

- **Algorithme** : BCrypt
- **Salt Rounds** : 10 (par défaut)
- **Stockage** : Hash uniquement, jamais le mot de passe en clair

---

## Déploiement

### Backend (Render)

1. **Build** : Maven package
2. **Dockerfile** : Multi-stage build
3. **Variables d'environnement** :
   - `DATABASE_URL`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `PORT` (défini automatiquement par Render)

### Frontend (Render)

1. **Build** : `npm run build`
2. **Output** : `dist/`
3. **Variables d'environnement** :
   - `VITE_API_URL` (optionnel)

### Base de Données (Railway)

- MySQL 8.0
- Accès via URL JDBC
- Variables d'environnement Railway :
  - `MYSQLHOST`
  - `MYSQLPORT`
  - `MYSQLDATABASE`
  - `MYSQLUSER`
  - `MYSQLPASSWORD`

---

## Conclusion

Cette application suit les meilleures pratiques de développement :
- **Architecture en couches** claire et séparée
- **Sécurité** avec JWT et BCrypt
- **API REST** bien structurée
- **Frontend moderne** avec React
- **Base de données relationnelle** normalisée
- **Déploiement cloud** scalable

