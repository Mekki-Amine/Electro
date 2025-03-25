package org.example.serviceelectro.controler;

import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.servicees.Ipub;
import org.example.serviceelectro.servicees.PubImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pub")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PubController {

    @Autowired
    private PubImpl publicationService;

    @GetMapping
    public List<Publication> getAllPublications() {
        return publicationService.getAllPublications();
    }

    @PostMapping
    public ResponseEntity<Publication>  savePublication(@RequestBody Publication publication) {
        Publication savedPublication = publicationService.savePublication(publication);
        return new ResponseEntity<>(savedPublication, HttpStatus.CREATED);
    }
}
