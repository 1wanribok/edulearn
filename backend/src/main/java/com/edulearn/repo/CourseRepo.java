package com.edulearn.repo;

import com.edulearn.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CourseRepo extends JpaRepository<Course, Long> {


}
