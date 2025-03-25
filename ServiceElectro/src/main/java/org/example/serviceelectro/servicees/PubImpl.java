package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Publication;
import org.example.serviceelectro.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PubImpl implements Ipub {
    @Autowired
    private PublicationRepository publicationRepository;

    @Override
    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }

    @Override
    public Publication savePublication(Publication publication) {

        return publicationRepository.save(publication);
    }
}
