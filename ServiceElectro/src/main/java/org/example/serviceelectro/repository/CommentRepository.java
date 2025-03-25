package org.example.serviceelectro.repository;

import org.example.serviceelectro.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long>
{

}