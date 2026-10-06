package com.edulearn.repo;

import com.edulearn.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepo extends JpaRepository<Student, Long> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByCourseId(Long courseId);
}
