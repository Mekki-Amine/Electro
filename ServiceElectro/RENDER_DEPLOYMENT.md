# Guide de déploiement sur Render

## ⚠️ IMPORTANT : Configuration des variables d'environnement

**Vous DEVEZ configurer les variables d'environnement suivantes sur Render pour que la connexion à la base de données fonctionne.**

### Variables OBLIGATOIRES

1. **DATABASE_URL** (OBLIGATOIRE)
   - Format complet : `jdbc:mysql://host:port/database?paramètres`
   - Exemple complet : `jdbc:mysql://gondola.proxy.rlwy.net:21901/railway?createDatabaseIfNotExist=true&useUnicode=yes&useJDBCCompliantTimezoneShift=true&characterEncoding=UTF-8&serverTimezone=UTC&useSSL=true&requireSSL=false&allowPublicKeyRetrieval=true&connectTimeout=60000&socketTimeout=60000&autoReconnect=true&failOverReadOnly=false&maxReconnects=10`
   - **Copiez l'URL complète depuis votre service Railway** (section "Connect" → "Private Network" ou "Public Network")
   - Si vous utilisez Railway, l'URL devrait ressembler à : `mysql://user:password@host:port/railway`

2. **DATABASE_USERNAME** (OBLIGATOIRE)
   - Nom d'utilisateur de la base de données
   - Exemple : `root` (ou celui fourni par Railway)

3. **DATABASE_PASSWORD** (OBLIGATOIRE)
   - Mot de passe de la base de données
   - **Copiez le mot de passe depuis votre service Railway**

### Variables optionnelles

4. **PORT** (optionnel - Render le définit automatiquement)
   - Render définit automatiquement cette variable
   - Valeur par défaut dans le code : 9090

5. **DDL_AUTO** (optionnel)
   - Mode de gestion du schéma Hibernate
   - Valeurs possibles : `update`, `validate`, `none`, `create`, `create-drop`
   - Valeur par défaut : `update` (recommandé pour la production)
   - ⚠️ **NE JAMAIS utiliser `create-drop` en production** (supprime toutes les données)

## Configuration sur Render

1. Allez dans votre service sur Render (https://dashboard.render.com)
2. Cliquez sur votre service backend
3. Cliquez sur "Environment" dans le menu de gauche
4. Ajoutez les variables d'environnement **OBLIGATOIRES** :
   - `DATABASE_URL` : L'URL complète de votre base de données Railway
   - `DATABASE_USERNAME` : Votre nom d'utilisateur MySQL
   - `DATABASE_PASSWORD` : Votre mot de passe MySQL
5. Cliquez sur "Save Changes"
6. Redéployez le service (Render redéploiera automatiquement après avoir sauvegardé)

## Comment obtenir les credentials Railway

1. Allez sur votre service Railway (https://railway.app)
2. Cliquez sur votre base de données MySQL
3. Allez dans l'onglet "Connect" ou "Variables"
4. Copiez les valeurs suivantes :
   - **MYSQLHOST** → utilisée dans DATABASE_URL (host)
   - **MYSQLPORT** → utilisée dans DATABASE_URL (port)
   - **MYSQLDATABASE** → utilisée dans DATABASE_URL (database)
   - **MYSQLUSER** → valeur de DATABASE_USERNAME
   - **MYSQLPASSWORD** → valeur de DATABASE_PASSWORD

5. Construisez l'URL complète :
   ```
   jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE?createDatabaseIfNotExist=true&useUnicode=yes&useJDBCCompliantTimezoneShift=true&characterEncoding=UTF-8&serverTimezone=UTC&useSSL=true&requireSSL=false&allowPublicKeyRetrieval=true&connectTimeout=60000&socketTimeout=60000&autoReconnect=true&failOverReadOnly=false&maxReconnects=10
   ```

## Vérification de la connexion à la base de données

Si vous rencontrez des erreurs "Communications link failure" :

### Étape 1 : Vérifier les variables d'environnement
1. Allez dans Render → Environment
2. Vérifiez que `DATABASE_URL`, `DATABASE_USERNAME` et `DATABASE_PASSWORD` sont bien définis
3. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs

### Étape 2 : Vérifier l'accessibilité de la base de données
1. **Railway** : Vérifiez que votre base de données est en mode "Public" ou que le réseau privé est correctement configuré
2. **Firewall** : Railway devrait permettre les connexions depuis n'importe où par défaut, mais vérifiez les paramètres de sécurité
3. **Test de connexion** : Essayez de vous connecter à la base de données depuis un autre outil (MySQL Workbench, DBeaver) avec les mêmes credentials

### Étape 3 : Vérifier les logs
1. Allez dans Render → Logs
2. Cherchez les erreurs de connexion
3. Les messages d'erreur vous indiqueront si c'est :
   - Un problème d'authentification (mauvais username/password)
   - Un problème de réseau (host/port inaccessible)
   - Un problème SSL/TLS

### Étape 4 : Solutions alternatives
Si Railway n'est pas accessible depuis Render :
1. **Option 1** : Utilisez une base de données Render PostgreSQL (recommandé)
   - Créez une base de données PostgreSQL sur Render
   - Modifiez `application.properties` pour utiliser PostgreSQL
   - Mettez à jour les dépendances Maven si nécessaire

2. **Option 2** : Utilisez une base de données MySQL hébergée ailleurs
   - PlanetScale, AWS RDS, Google Cloud SQL, etc.

## Port du serveur

Render définit automatiquement la variable `PORT`. L'application Spring Boot utilisera cette variable. Si elle n'est pas définie, le port par défaut est 9090.

## Notes importantes

- Le mode `ddl-auto=update` est maintenant utilisé par défaut (au lieu de `create-drop`)
- Les paramètres de connexion MySQL incluent des timeouts étendus (60 secondes) et la reconnexion automatique
- Le pool de connexions HikariCP est configuré pour une meilleure gestion des connexions
- Le Dockerfile expose maintenant le port 9090 (au lieu de 21901 qui était le port de la base de données)

