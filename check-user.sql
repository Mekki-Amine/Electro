-- Check if user exists and see password status
-- Run this in MySQL Workbench

USE serviceelectro;

-- Check for specific user
SELECT 
    id, 
    username, 
    email, 
    role,
    CASE 
        WHEN password IS NULL THEN 'NULL - No password set'
        WHEN password = '' THEN 'EMPTY - Empty password'
        WHEN LENGTH(password) < 20 THEN 'INVALID - Too short to be BCrypt hash'
        ELSE CONCAT('HASHED - Length: ', LENGTH(password), ' chars')
    END as password_status,
    created_at,
    updated_at
FROM utilisateur 
WHERE email = 'amine@sesame.tn' OR email = 'admin@fixer.com';

-- See all users
SELECT id, username, email, role FROM utilisateur;

