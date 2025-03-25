package org.example.serviceelectro.controler;

import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.entities.Utilisateur;
import org.example.serviceelectro.servicees.Iuserr;
import org.example.serviceelectro.servicees.UserImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilis")

@CrossOrigin(origins = "*", allowedHeaders = "*")

public class UserController {

    @Autowired
    UserImpl iuser;


    @PostMapping
    public ResponseEntity <Utilisateur> creatCompte (@RequestBody Utilisateur utilisateur) {
        Utilisateur savedUtilisateur = iuser.creatCompte(utilisateur);
        return  new ResponseEntity<>(savedUtilisateur, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return iuser.getAllUtilisateurs();
    }

}