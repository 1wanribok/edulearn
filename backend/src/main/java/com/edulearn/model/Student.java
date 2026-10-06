package com.edulearn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 80, message = "Name must be 3 to 80 characters")
    public String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Column(unique = true)
    public String email;

    @Pattern(regexp = "^[6-9][0-9]{9}$", message = "Enter a 10-digit mobile number")
    public String phone;

    @NotNull(message = "Choose a course")
    public Long courseId;

    public LocalDateTime registeredAt = LocalDateTime.now();
    public String status = "PENDING";
}
