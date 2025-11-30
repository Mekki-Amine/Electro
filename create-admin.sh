#!/bin/bash
# Script to create admin user via API
# Make sure the Spring Boot server is running on port 9090

echo "Creating admin user..."

# First, create a regular user
curl -X POST http://localhost:9090/api/utilis \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@fixer.com",
    "password": "admin123",
    "role": "ADMIN"
  }'

echo ""
echo "Admin user created! Now update the role in the database:"
echo "UPDATE utilisateur SET role = '\''ADMIN'\'' WHERE email = '\''admin@fixer.com'\'';"

