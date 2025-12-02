package org.example.serviceelectro.servicees;

import org.example.serviceelectro.config.JwtUtil;
import org.example.serviceelectro.dto.LoginRequest;
import org.example.serviceelectro.dto.LoginResponse;
import org.example.serviceelectro.entities.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserImpl userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest loginRequest) {
        // Normalize email to lowercase for case-insensitive lookup
        String email = loginRequest.getEmail().toLowerCase().trim();
        
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + email);
        
        Optional<Utilisateur> utilisateurOpt = userService.findByEmail(email);
        
        if (utilisateurOpt.isEmpty()) {
            System.out.println("❌ User not found with email: " + email);
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }

        Utilisateur utilisateur = utilisateurOpt.get();
        System.out.println("✅ User found - ID: " + utilisateur.getId() + ", Email: " + utilisateur.getEmail());
        System.out.println("Password hash exists: " + (utilisateur.getPassword() != null));
        
        // Check if password matches
        boolean passwordMatches = utilisateur.getPassword() != null && 
            passwordEncoder.matches(loginRequest.getPassword(), utilisateur.getPassword());
        
        System.out.println("Password matches: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("❌ Password mismatch for user: " + email);
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }
        
        System.out.println("✅ Login successful for: " + email);
        
        // Mettre à jour le statut de connexion
        userService.setUserOnline(utilisateur.getId(), true);

        String token = jwtUtil.generateToken(utilisateur.getEmail(), utilisateur.getRole());

        // Get the actual username field value (since getUsername() is overridden to return email)
        // We'll use reflection to access the private username field
        String actualUsername = email; // Default to email
        try {
            java.lang.reflect.Field usernameField = Utilisateur.class.getDeclaredField("username");
            usernameField.setAccessible(true);
            Object usernameValue = usernameField.get(utilisateur);
            if (usernameValue != null && !usernameValue.toString().trim().isEmpty()) {
                actualUsername = usernameValue.toString();
            }
        } catch (Exception e) {
            // If reflection fails, use email as username
            actualUsername = email;
        }

        return LoginResponse.builder()
                .token(token)
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole() != null ? utilisateur.getRole() : "USER")
                .userId(utilisateur.getId())
                .username(actualUsername)
                .build();
    }
}

