package org.example.serviceelectro.controler;

import org.example.serviceelectro.dto.PublicationDTO;
import org.example.serviceelectro.dto.UtilisateurDTO;
import org.example.serviceelectro.dto.VerifyPublicationRequest;
import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.entities.Utilisateur;
import org.example.serviceelectro.mapper.PublicationMapper;
import org.example.serviceelectro.mapper.UtilisateurMapper;
import org.example.serviceelectro.servicees.PubImpl;
import org.example.serviceelectro.servicees.UserImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    @Autowired
    private UserImpl userService;

    @Autowired
    private PubImpl publicationService;

    @Autowired
    private UtilisateurMapper utilisateurMapper;

    @Autowired
    private PublicationMapper publicationMapper;

    // User Management
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UtilisateurDTO>> getAllUsers() {
        List<UtilisateurDTO> users = userService.getAllUtilisateurs().stream()
                .map(utilisateur -> {
                    UtilisateurDTO dto = utilisateurMapper.toDTO(utilisateur);
                    // Include password hash for admin viewing
                    dto.setPassword(utilisateur.getPassword());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UtilisateurDTO> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(utilisateur -> {
                    UtilisateurDTO dto = utilisateurMapper.toDTO(utilisateur);
                    // Include password hash for admin viewing
                    dto.setPassword(utilisateur.getPassword());
                    return dto;
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/{id}/verify-email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UtilisateurDTO> verifyUserEmail(@PathVariable Long id) {
        Utilisateur utilisateur = userService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        utilisateur.setEmailVerified(true);
        Utilisateur updatedUser = userService.updateUser(utilisateur);
        
        UtilisateurDTO dto = utilisateurMapper.toDTO(updatedUser);
        dto.setPassword(updatedUser.getPassword());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/users/{id}/unverify-email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UtilisateurDTO> unverifyUserEmail(@PathVariable Long id) {
        Utilisateur utilisateur = userService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        utilisateur.setEmailVerified(false);
        Utilisateur updatedUser = userService.updateUser(utilisateur);
        
        UtilisateurDTO dto = utilisateurMapper.toDTO(updatedUser);
        dto.setPassword(updatedUser.getPassword());
        return ResponseEntity.ok(dto);
    }

    // Publication Management
    @GetMapping("/publications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PublicationDTO>> getAllPublications() {
        List<PublicationDTO> publications = publicationService.getAllPublicationsIncludingUnverified().stream()
                .map(publicationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(publications);
    }

    @GetMapping("/publications/unverified")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PublicationDTO>> getUnverifiedPublications() {
        List<PublicationDTO> publications = publicationService.findUnverifiedPublications().stream()
                .map(publicationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(publications);
    }

    @PostMapping("/publications/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PublicationDTO> verifyPublication(
            @PathVariable Long id,
            @RequestBody(required = false) VerifyPublicationRequest request) {
        Long adminId = (request != null && request.getAdminId() != null)
                ? request.getAdminId()
                : null;

        if (adminId == null) {
            throw new IllegalArgumentException("L'ID de l'administrateur est requis");
        }

        Publication verifiedPublication = publicationService.verifyPublication(id, adminId);
        return ResponseEntity.ok(publicationMapper.toDTO(verifiedPublication));
    }

    @PostMapping("/publications/{id}/unverify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PublicationDTO> unverifyPublication(@PathVariable Long id) {
        Publication unverifiedPublication = publicationService.unverifyPublication(id);
        return ResponseEntity.ok(publicationMapper.toDTO(unverifiedPublication));
    }

    @DeleteMapping("/publications/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePublication(@PathVariable Long id) {
        publicationService.deletePublication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/publications/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PublicationDTO>> getPublicationsByStatus(@PathVariable String status) {
        List<PublicationDTO> publications = publicationService.findByStatus(status).stream()
                .map(publicationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(publications);
    }

    @PutMapping("/publications/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PublicationDTO> updatePublicationStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        if (request == null || request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Le statut est requis");
        }
        
        Publication updatedPublication = publicationService.updatePublicationStatus(id, request.getStatus());
        return ResponseEntity.ok(publicationMapper.toDTO(updatedPublication));
    }

    // Classe interne pour la requête de mise à jour du statut
    public static class UpdateStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}

