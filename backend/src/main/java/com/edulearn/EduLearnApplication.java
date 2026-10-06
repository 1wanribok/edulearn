package com.edulearn;

import com.edulearn.model.Course;
import com.edulearn.repo.CourseRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EduLearnApplication {
    public static void main(String[] args) { SpringApplication.run(EduLearnApplication.class, args); }

    /** Seeds sample courses the first time the app runs against an empty database. */
    @Bean
    CommandLineRunner seed(CourseRepo repo) {
        return args -> {
            if (repo.count() > 0) return;
            repo.save(new Course("Web Development Foundations", "Technology", "Beginner", "8 weeks", "Dr. Meera Iyer", "HTML, CSS and JavaScript from a blank file to a deployed portfolio."));
            repo.save(new Course("Data Structures in Java", "Technology", "Intermediate", "10 weeks", "Prof. Arjun Rao", "Arrays to graphs, with a practice problem set for every topic."));
            repo.save(new Course("Spoken English for Interviews", "Language", "Beginner", "6 weeks", "Ms. Kavya Nair", "Structured speaking drills, mock interviews and feedback."));
            repo.save(new Course("Statistics for Everyone", "Mathematics", "Beginner", "6 weeks", "Dr. Rohan Shah", "Probability, distributions and hypothesis tests using real datasets."));
            repo.save(new Course("Digital Marketing Essentials", "Business", "Beginner", "5 weeks", "Ms. Anita Kulkarni", "SEO, social media and analytics for small businesses."));
            repo.save(new Course("Machine Learning Basics", "Technology", "Advanced", "12 weeks", "Dr. Sameer Joshi", "Regression, classification and model evaluation in Python."));
        };
    }
}
