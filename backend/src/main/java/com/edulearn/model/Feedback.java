package com.edulearn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
public class Feedback {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank(message = "Name is required")
    public String name;

    @Min(value = 1, message = "Rating must be 1 to 5")
    @Max(value = 5, message = "Rating must be 1 to 5")
    public int rating;

    @NotBlank(message = "Write a short message")
    @Size(max = 500, message = "Keep it under 500 characters")
    @Column(length = 500)
    public String message;

    public LocalDateTime createdAt = LocalDateTime.now();
}
