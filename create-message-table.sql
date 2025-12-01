-- Script pour créer la table Message si elle n'existe pas
-- Ce script sera également exécuté automatiquement au démarrage de l'application
-- Vous pouvez aussi l'exécuter manuellement dans MySQL si nécessaire

USE serviceelectro;

CREATE TABLE IF NOT EXISTS message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(2000) NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (sender_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES utilisateur(id) ON DELETE CASCADE,
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vérifier que la table a été créée
SELECT 'Table message créée avec succès!' AS status;

