package org.example.serviceelectro.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class MessageTableInitializer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Vérifier si la table existe déjà
            String checkTableQuery = "SELECT COUNT(*) FROM information_schema.tables " +
                    "WHERE table_schema = DATABASE() AND table_name = 'message'";
            
            Integer tableCount = jdbcTemplate.queryForObject(checkTableQuery, Integer.class);
            
            if (tableCount == null || tableCount == 0) {
                System.out.println("========================================");
                System.out.println("📋 Table 'message' n'existe pas. Création en cours...");
                
                // Créer la table
                String createTableSQL = "CREATE TABLE IF NOT EXISTS message (" +
                        "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                        "content VARCHAR(2000) NOT NULL, " +
                        "sender_id BIGINT NOT NULL, " +
                        "receiver_id BIGINT NOT NULL, " +
                        "is_read BOOLEAN NOT NULL DEFAULT FALSE, " +
                        "created_at TIMESTAMP NULL DEFAULT NULL, " +
                        "updated_at TIMESTAMP NULL DEFAULT NULL, " +
                        "FOREIGN KEY (sender_id) REFERENCES utilisateur(id) ON DELETE CASCADE, " +
                        "FOREIGN KEY (receiver_id) REFERENCES utilisateur(id) ON DELETE CASCADE, " +
                        "INDEX idx_sender (sender_id), " +
                        "INDEX idx_receiver (receiver_id), " +
                        "INDEX idx_created_at (created_at)" +
                        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
                
                jdbcTemplate.execute(createTableSQL);
                
                System.out.println("✅ Table 'message' créée avec succès!");
                System.out.println("========================================");
            } else {
                System.out.println("✅ Table 'message' existe déjà.");
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'initialisation de la table 'message': " + e.getMessage());
            e.printStackTrace();
            // Ne pas bloquer le démarrage de l'application si la table existe déjà
            // ou si c'est une autre erreur non critique
            if (!e.getMessage().contains("already exists") && 
                !e.getMessage().contains("Duplicate")) {
                System.err.println("⚠️  Veuillez créer manuellement la table 'message' en exécutant le script SQL.");
            }
        }
    }
}

