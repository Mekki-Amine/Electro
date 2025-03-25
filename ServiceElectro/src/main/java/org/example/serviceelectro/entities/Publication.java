package org.example.serviceelectro.entities;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Publication implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String title;
    @NotNull
    private String description;
    @NotNull
    private String type;
    @NotNull
    private Double price;
    @NotNull
    private String status;

    @ManyToOne
    private Utilisateur utilisateur;

    @OneToMany(mappedBy = "publication")
    private List<Comment> comments;

    public Publication() {
    }

    public Publication(Long id, String title, String description, String type, Double price, String status, Utilisateur utilisateur, List<Comment> comments) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.price = price;
        this.status = status;
        this.utilisateur = utilisateur;
        this.comments = comments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
