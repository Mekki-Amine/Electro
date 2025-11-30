-- Script to create an admin user in the database
-- Run this in MySQL console or your database client

-- Default admin credentials:
-- Email: admin@fixer.com
-- Password: admin123 (BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy)

USE serviceelectro;

-- Insert admin user
-- Note: The password hash below is for "admin123"
INSERT INTO utilisateur (username, email, password, role, created_at, updated_at)
VALUES (
    'admin',
    'admin@fixer.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- Verify the admin was created
SELECT id, username, email, role FROM utilisateur WHERE email = 'admin@fixer.com';

