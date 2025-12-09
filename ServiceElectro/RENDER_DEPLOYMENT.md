# Guide de déploiement sur Render

## Configuration des variables d'environnement

Sur Render, vous devez configurer les variables d'environnement suivantes dans les paramètres de votre service :

### Variables requises

1. **PORT** (optionnel - Render le définit automatiquement)
   - Render définit automatiquement cette variable
   - Valeur par défaut dans le code : 9090

2. **DATABASE_URL** (optionnel si vous utilisez les valeurs par défaut)
   - Format : `jdbc:mysql://host:port/database?paramètres`
   - Exemple : `jdbc:mysql://gondola.proxy.rlwy.net:21901/railway?useSSL=true&requireSSL=false&allowPublicKeyRetrieval=true&connectTimeout=30000&socketTimeout=30000`
   - Si non défini, utilise la configuration par défaut de Railway

3. **DATABASE_USERNAME** (optionnel)
   - Nom d'utilisateur de la base de données
   - Valeur par défaut : `root`

4. **DATABASE_PASSWORD** (optionnel)
   - Mot de passe de la base de données
   - Valeur par défaut : celle configurée dans application.properties

5. **DDL_AUTO** (optionnel)
   - Mode de gestion du schéma Hibernate
   - Valeurs possibles : `update`, `validate`, `none`, `create`, `create-drop`
   - Valeur par défaut : `update` (recommandé pour la production)
   - ⚠️ **NE JAMAIS utiliser `create-drop` en production** (supprime toutes les données)

## Configuration sur Render

1. Allez dans votre service sur Render
2. Cliquez sur "Environment" dans le menu de gauche
3. Ajoutez les variables d'environnement nécessaires
4. Redéployez le service

## Vérification de la connexion à la base de données

Si vous rencontrez des erreurs de connexion :

1. Vérifiez que la base de données Railway est accessible depuis Render
2. Vérifiez que les credentials sont corrects
3. Vérifiez que le firewall de Railway autorise les connexions depuis Render
4. Vérifiez les logs du service pour plus de détails

## Port du serveur

Render définit automatiquement la variable `PORT`. L'application Spring Boot utilisera cette variable. Si elle n'est pas définie, le port par défaut est 9090.

## Notes importantes

- Le mode `ddl-auto=update` est maintenant utilisé par défaut (au lieu de `create-drop`)
- Les paramètres de connexion MySQL incluent des timeouts pour améliorer la stabilité
- Le pool de connexions HikariCP est configuré pour une meilleure gestion des connexions

