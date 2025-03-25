package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Publication;

import java.util.List;

public interface Ipub {

    public List<Publication> getAllPublications() ;

    public Publication savePublication(Publication publication) ;
}
