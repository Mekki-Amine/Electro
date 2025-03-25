package org.example.serviceelectro.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Utilisateur  implements Serializable , UserDetails {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String username;
        private String password;
        private String email;
        private String role ;

        @OneToMany(mappedBy = "utilisateur")
        private List<Publication> publications = new ArrayList<>();


        public Utilisateur() {
        }

        public Utilisateur(Long id, String username, String password, String email, String role , List<Publication> publications) {
                this.id = id;
                this.username = username;
                this.password = password;
                this.email = email;
                this.role = role;
                this.publications = publications;
        }

        public Long getId() {
                return id;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public String getUsername() {
                return email;
        }

        @Override
        public boolean isAccountNonExpired() {
                return true ;
        }

        @Override
        public boolean isAccountNonLocked() {
                return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
                return true ;
        }

        @Override
        public boolean isEnabled() {
                return true;
        }

        public void setUsername(String username) {
                this.username = username;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
                return List.of(new SimpleGrantedAuthority(role));
        }

        public String getPassword() {
                return password;
        }

        public void setPassword(String password) {
                this.password = password;
        }

        public String getEmail() {
                return email;
        }

        public void setEmail(String email) {
                this.email = email;
        }


        public void setRoles(String role) {
                this.role = role;
        }

        public List<Publication> getPublications() {
                return publications;
        }

        public void setPublications(List<Publication> publications) {
                this.publications = publications;
        }
}
