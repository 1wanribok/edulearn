package com.edulearn.web;

import com.edulearn.model.*;
import com.edulearn.repo.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final CourseRepo courses;
    private final StudentRepo students;
    private final FeedbackRepo feedback;

    public ApiController(CourseRepo c, StudentRepo s, FeedbackRepo f) {
        this.courses = c; this.students = s; this.feedback = f;
    }

    @GetMapping("/courses")
    public List<Course> allCourses() { return courses.findAll(); }

    @PostMapping("/students")
    @ResponseStatus(HttpStatus.CREATED)
    public Student register(@Valid @RequestBody Student s) {
        if (students.existsByEmailIgnoreCase(s.email))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered");
        if (!courses.existsById(s.courseId))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected course does not exist");
        s.id = null;
        s.status = "PENDING";
        return students.save(s);
    }

    @GetMapping("/feedback")
    public List<Feedback> recentFeedback() { return feedback.findTop10ByOrderByCreatedAtDesc(); }

    @PostMapping("/feedback")
    @ResponseStatus(HttpStatus.CREATED)
    public Feedback addFeedback(@Valid @RequestBody Feedback f) {
        f.id = null;
        return feedback.save(f);
    }
}
