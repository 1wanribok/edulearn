package com.edulearn.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String title;
    public String category;
    public String level;
    public String duration;
    public String instructor;
    @Column(length = 500)
    public String description;

    public Course() {}
    public Course(String title, String category, String level, String duration, String instructor, String description) {
        this.title = title; this.category = category; this.level = level;
        this.duration = duration; this.instructor = instructor; this.description = description;
    }
}
