package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Utilisateur;
import org.example.serviceelectro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserImpl implements Iuserr{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Utilisateur creatCompte (Utilisateur utilisateur) {
        // Vérifier si l'email existe déjà
        if (userRepository.findByEmail(utilisateur.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
        }

        // Hasher le mot de passe
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));

        // Définir le rôle par défaut si non spécifié
        if (utilisateur.getRole() == null || utilisateur.getRole().isEmpty()) {
            utilisateur.setRole("USER");
        }

        return userRepository.save(utilisateur);
    }

    @Override
    public List<Utilisateur> getAllUtilisateurs() {
        return userRepository.findAll();
    }

    public Optional<Utilisateur> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<Utilisateur> findById(Long id) {
        return userRepository.findById(id);
    }
}
