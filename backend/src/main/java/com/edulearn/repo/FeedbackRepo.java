package com.edulearn.repo;

import com.edulearn.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FeedbackRepo extends JpaRepository<Feedback, Long> {

    java.util.List<Feedback> findTop10ByOrderByCreatedAtDesc();
}
