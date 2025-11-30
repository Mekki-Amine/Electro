-- Create user for amine@sesame.tn
-- Password: (you need to set this - use signup API or hash it with BCrypt)
-- The password hash below is for "password123" - CHANGE IT!

USE serviceelectro;

-- Option 1: Create user with BCrypt hashed password
-- Password hash for "password123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- Replace with your desired password hash

INSERT INTO utilisateur (username, email, password, role, created_at, updated_at)
VALUES (
    'amine',
    'amine@sesame.tn',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: password123
    'USER',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE 
    role = COALESCE(role, 'USER'),
    updated_at = NOW();

-- Verify user was created
SELECT id, username, email, role FROM utilisateur WHERE email = 'amine@sesame.tn';

