package org.example.serviceelectro.controler;

import jakarta.validation.Valid;
import org.example.serviceelectro.dto.UtilisateurDTO;
import org.example.serviceelectro.entities.Utilisateur;
import org.example.serviceelectro.mapper.UtilisateurMapper;
import org.example.serviceelectro.servicees.UserImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/utilis")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @Autowired
    private UserImpl userService;

    @Autowired
    private UtilisateurMapper utilisateurMapper;

    @PostMapping
    public ResponseEntity<UtilisateurDTO> creatCompte(@Valid @RequestBody UtilisateurDTO utilisateurDTO) {
        Utilisateur utilisateur = utilisateurMapper.toEntity(utilisateurDTO);
        Utilisateur savedUtilisateur = userService.creatCompte(utilisateur);
        return new ResponseEntity<>(utilisateurMapper.toDTO(savedUtilisateur), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        List<UtilisateurDTO> utilisateurs = userService.getAllUtilisateurs().stream()
                .map(utilisateurMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(utilisateurs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> getUtilisateurById(@PathVariable Long id) {
        return userService.findById(id)
                .map(utilisateurMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}