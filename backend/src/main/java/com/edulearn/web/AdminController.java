package com.edulearn.web;

import com.edulearn.model.*;
import com.edulearn.repo.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Admin-only API. The admin logs in with a fixed username/password (see application.properties:
 * admin.user and admin.password) and receives a token that must be sent in the X-Admin-Token header.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private static final String H = "X-Admin-Token";

    private final Set<String> tokens = ConcurrentHashMap.newKeySet();
    private final CourseRepo courseRepo;
    private final StudentRepo studentRepo;
    private final FeedbackRepo feedbackRepo;

    @Value("${admin.user:admin}")
    private String adminUser;
    @Value("${admin.password:admin123}")
    private String adminPassword;

    public AdminController(CourseRepo c, StudentRepo s, FeedbackRepo f) {
        this.courseRepo = c; this.studentRepo = s; this.feedbackRepo = f;
    }

    public record LoginRequest(String username, String password) {}

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest r) {
        if (r == null || !adminUser.equals(r.username()) || !adminPassword.equals(r.password()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong username or password");
        String token = UUID.randomUUID().toString();
        tokens.add(token);
        return Map.of("token", token);
    }

    private void check(String token) {
        if (token == null || !tokens.contains(token))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in as admin");
    }

    private static boolean blank(String s) { return s == null || s.isBlank(); }

    // ---------- students ----------
    @GetMapping("/students")
    public List<Map<String, Object>> listStudents(@RequestHeader(value = H, required = false) String token) {
        check(token);
        Map<Long, String> titles = courseRepo.findAll().stream()
                .collect(Collectors.toMap(c -> c.id, c -> c.title));
        List<Map<String, Object>> out = new ArrayList<>();
        for (Student s : studentRepo.findAll(Sort.by(Sort.Direction.DESC, "registeredAt"))) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", s.id);
            row.put("fullName", s.fullName);
            row.put("email", s.email);
            row.put("phone", s.phone);
            row.put("course", titles.getOrDefault(s.courseId, "Removed course"));
            row.put("registeredAt", s.registeredAt);
            row.put("status", s.status == null ? "PENDING" : s.status);
            out.add(row);
        }
        return out;
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudent(@PathVariable Long id, @RequestHeader(value = H, required = false) String token) {
        check(token);
        studentRepo.deleteById(id);
    }

    @PostMapping("/students/{id}/accept")
    public void acceptStudent(@PathVariable Long id, @RequestHeader(value = H, required = false) String token) {
        check(token);
        Student s = studentRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
        s.status = "ACCEPTED";
        studentRepo.save(s);
    }

    // ---------- courses ----------
    @GetMapping("/courses")
    public List<Course> listCourses(@RequestHeader(value = H, required = false) String token) {
        check(token);
        return courseRepo.findAll(Sort.by("id"));
    }

    @PostMapping("/courses")
    @ResponseStatus(HttpStatus.CREATED)
    public Course addCourse(@RequestBody Course c, @RequestHeader(value = H, required = false) String token) {
        check(token);
        if (blank(c.title) || blank(c.category) || blank(c.level) || blank(c.duration) || blank(c.instructor))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Fill in title, category, level, duration and instructor");
        c.id = null;
        return courseRepo.save(c);
    }

    @DeleteMapping("/courses/{id}")
    public void deleteCourse(@PathVariable Long id, @RequestHeader(value = H, required = false) String token) {
        check(token);
        if (studentRepo.existsByCourseId(id))
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Students are registered for this course. Delete their registrations first.");
        courseRepo.deleteById(id);
    }

    // ---------- feedback ----------
    @GetMapping("/feedback")
    public List<Feedback> listFeedback(@RequestHeader(value = H, required = false) String token) {
        check(token);
        return feedbackRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @DeleteMapping("/feedback/{id}")
    public void deleteFeedback(@PathVariable Long id, @RequestHeader(value = H, required = false) String token) {
        check(token);
        feedbackRepo.deleteById(id);
    }
}
