package com.example.demo.dto.auth.candidate;



public class JobResponse {

    private Long id;
    private String title;
    private String companyName;
    private String location;
    private String employmentType;
    private String experience;
    private String salary;
    private String skills;
    private String description;

    public JobResponse() {
    }

    public JobResponse(
            Long id,
            String title,
            String companyName,
            String location,
            String employmentType,
            String experience,
            String salary,
            String skills,
            String description) {

        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.location = location;
        this.employmentType = employmentType;
        this.experience = experience;
        this.salary = salary;
        this.skills = skills;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getLocation() {
        return location;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public String getExperience() {
        return experience;
    }

    public String getSalary() {
        return salary;
    }

    public String getSkills() {
        return skills;
    }

    public String getDescription() {
        return description;
    }
}
