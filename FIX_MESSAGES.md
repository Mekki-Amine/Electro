# Guide de résolution des problèmes de messages

## Problème : Erreur 500 lors de l'envoi de messages

### Solutions à essayer :

1. **Vérifier que la table Message existe dans la base de données**
   ```sql
   SHOW TABLES LIKE 'message';
   ```
   
   Si la table n'existe pas, exécuter le script :
   ```sql
   -- Voir le fichier create-message-table.sql
   ```

2. **Vérifier les logs du serveur Spring Boot**
   - Regarder la console où le serveur Spring Boot tourne
   - Chercher les messages avec les emojis : 📤, ✅, ❌
   - Les logs indiqueront exactement où l'erreur se produit

3. **Vérifier que les utilisateurs existent**
   ```sql
   SELECT id, email, role FROM utilisateur WHERE id IN (3, 6);
   ```
   - L'admin doit avoir l'ID 3
   - L'utilisateur doit avoir l'ID 6

4. **Redémarrer le serveur Spring Boot**
   - Arrêter complètement le serveur
   - Le redémarrer pour que Hibernate crée la table si nécessaire

5. **Vérifier la configuration JPA**
   - Dans `application.properties`, `spring.jpa.hibernate.ddl-auto=update`
   - Cela devrait créer automatiquement la table

### Logs à surveiller :

Dans la console serveur, vous devriez voir :
- `📤 Sending message from X to Y`
- `🔄 Creating message entity...`
- `✅ Message entity created`
- `💾 Saving message to database...`
- `✅ Message saved with ID: X`

Si vous voyez `❌` suivi d'un message d'erreur, cela indiquera le problème exact.

### Si le problème persiste :

1. Vérifier que MySQL est en cours d'exécution
2. Vérifier les permissions de la base de données
3. Vérifier que les clés étrangères sont correctement configurées
4. Vérifier les logs complets dans la console serveur


