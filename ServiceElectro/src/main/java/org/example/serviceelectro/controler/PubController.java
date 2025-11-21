package org.example.serviceelectro.controler;

import jakarta.validation.Valid;
import org.example.serviceelectro.dto.PublicationDTO;
import org.example.serviceelectro.dto.VerifyPublicationRequest;
import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.entities.Utilisateur;
import org.example.serviceelectro.mapper.PublicationMapper;
import org.example.serviceelectro.servicees.FileStorageService;
import org.example.serviceelectro.servicees.PubImpl;
import org.example.serviceelectro.servicees.UserImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pub")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PubController {

    @Autowired
    private PubImpl publicationService;

    @Autowired
    private PublicationMapper publicationMapper;

    @Autowired
    private UserImpl userService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<List<PublicationDTO>> getAllPublications() {
        List<PublicationDTO> publications = publicationService.getAllPublications().stream()
                .map(publicationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(publications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicationDTO> getPublicationById(@PathVariable Long id) {
        return publicationService.findById(id)
                .map(publicationMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PublicationDTO> savePublication(@Valid @RequestBody PublicationDTO publicationDTO) {
        Utilisateur utilisateur = null;
        if (publicationDTO.getUtilisateurId() != null) {
            utilisateur = userService.findById(publicationDTO.getUtilisateurId())
                    .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        }

        Publication publication = publicationMapper.toEntity(publicationDTO, utilisateur);
        Publication savedPublication = publicationService.savePublication(publication);
        return new ResponseEntity<>(publicationMapper.toDTO(savedPublication), HttpStatus.CREATED);
    }

    @PostMapping(value = "/with-file", consumes = {"multipart/form-data"})
    public ResponseEntity<PublicationDTO> savePublicationWithFile(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("type") String type,
            @RequestParam("price") Double price,
            @RequestParam("status") String status,
            @RequestParam("utilisateurId") Long utilisateurId,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        
        Utilisateur utilisateur = userService.findById(utilisateurId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        PublicationDTO publicationDTO = PublicationDTO.builder()
                .title(title)
                .description(description)
                .type(type)
                .price(price)
                .status(status)
                .utilisateurId(utilisateurId)
                .build();

        Publication publication = publicationMapper.toEntity(publicationDTO, utilisateur);

        // Gérer l'upload du fichier si présent
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = fileStorageService.storeFile(file);
                String fileUrl = fileStorageService.getFileUrl(fileName);
                
                publication.setFileName(fileName);
                publication.setFileUrl(fileUrl);
                publication.setFileType(file.getContentType());
                publication.setFileSize(file.getSize());
            } catch (RuntimeException e) {
                throw new IllegalArgumentException("Erreur lors de l'upload du fichier: " + e.getMessage());
            }
        }

        Publication savedPublication = publicationService.savePublication(publication);
        return new ResponseEntity<>(publicationMapper.toDTO(savedPublication), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/file")
    public ResponseEntity<PublicationDTO> updatePublicationFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        
        Publication publication = publicationService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Publication non trouvée"));

        // Supprimer l'ancien fichier s'il existe
        if (publication.getFileName() != null) {
            try {
                fileStorageService.deleteFile(publication.getFileName());
            } catch (Exception e) {
                // Ignorer l'erreur si le fichier n'existe pas
            }
        }

        // Upload du nouveau fichier
        try {
            String fileName = fileStorageService.storeFile(file);
            String fileUrl = fileStorageService.getFileUrl(fileName);
            
            publication.setFileName(fileName);
            publication.setFileUrl(fileUrl);
            publication.setFileType(file.getContentType());
            publication.setFileSize(file.getSize());
            
            Publication updatedPublication = publicationService.savePublication(publication);
            return ResponseEntity.ok(publicationMapper.toDTO(updatedPublication));
        } catch (RuntimeException e) {
            throw new IllegalArgumentException("Erreur lors de l'upload du fichier: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublication(@PathVariable Long id) {
        publicationService.deletePublication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PublicationDTO>> getPublicationsByUser(@PathVariable Long userId) {
        List<PublicationDTO> publications = publicationService.findByUtilisateurId(userId).stream()
                .map(publicationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(publications);
    }

    // Endpoints pour l'administration
    @GetMapping("/admin/all")
    public ResponseEntity<List<PublicationDTO>> getAllPublicationsIncludingUnverified() {
        List<PublicationDTO> publications = publicationService.getAllPublicationsIncludingUnverified().stream()
                .map(publicationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(publications);
    }

    @GetMapping("/admin/unverified")
    public ResponseEntity<List<PublicationDTO>> getUnverifiedPublications() {
        List<PublicationDTO> publications = publicationService.findUnverifiedPublications().stream()
                .map(publicationMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(publications);
    }

    @PostMapping("/admin/verify/{id}")
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

    @PostMapping("/admin/unverify/{id}")
    public ResponseEntity<PublicationDTO> unverifyPublication(@PathVariable Long id) {
        Publication unverifiedPublication = publicationService.unverifyPublication(id);
        return ResponseEntity.ok(publicationMapper.toDTO(unverifiedPublication));
    }
}
