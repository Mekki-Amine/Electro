package org.example.serviceelectro.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
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

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    @Column(nullable = true)
    private Long verifiedBy;

    @Column(nullable = true)
    private LocalDateTime verifiedAt;

    @Column(length = 500)
    private String fileUrl;

    @Column(length = 255)
    private String fileName;

    @Column(length = 100)
    private String fileType;

    @Column
    private Long fileSize;

    @ManyToOne
    private Utilisateur utilisateur;

    @OneToMany(mappedBy = "publication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
