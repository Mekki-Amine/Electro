package org.example.serviceelectro.servicees;

import org.example.serviceelectro.entities.Utilisateur;
import org.example.serviceelectro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserImpl implements Iuserr{

    @Autowired
    private UserRepository userRepository;


    @Override
    public Utilisateur creatCompte (Utilisateur utilisateur) {

        return userRepository.save(utilisateur);

    }
    @Override
    public List<Utilisateur> getAllUtilisateurs() {
        return userRepository.findAll();
    }


}
