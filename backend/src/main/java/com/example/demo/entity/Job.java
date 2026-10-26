package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String employmentType;

    @Column(nullable = false)
    private String experience;

    @Column(nullable = false)
    private String salary;

    @Column(length = 1000)
    private String skills;

    @Column(length = 3000)
    private String description;

    // =========================
    // RECRUITER
    // =========================

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

    // =========================
    // DEFAULT CONSTRUCTOR
    // =========================

    public Job() {
    }

    // =========================
    // CONSTRUCTOR
    // =========================

    public Job(
            String title,
            String companyName,
            String location,
            String employmentType,
            String experience,
            String salary,
            String skills,
            String description,
            User recruiter) {

        this.title = title;
        this.companyName = companyName;
        this.location = location;
        this.employmentType = employmentType;
        this.experience = experience;
        this.salary = salary;
        this.skills = skills;
        this.description = description;
        this.recruiter = recruiter;
    }

    // =========================
    // GET ID
    // =========================

    public Long getId() {
        return id;
    }

    // =========================
    // TITLE
    // =========================

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // =========================
    // COMPANY
    // =========================

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    // =========================
    // LOCATION
    // =========================

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    // =========================
    // EMPLOYMENT TYPE
    // =========================

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    // =========================
    // EXPERIENCE
    // =========================

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    // =========================
    // SALARY
    // =========================

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    // =========================
    // SKILLS
    // =========================

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    // =========================
    // DESCRIPTION
    // =========================

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // =========================
    // RECRUITER
    // =========================

    public User getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(User recruiter) {
        this.recruiter = recruiter;
    }
}