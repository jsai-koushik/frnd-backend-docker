package com.example.demo.dto.auth.candidate;



import io.swagger.v3.oas.annotations.media.Schema;

public class JobRequest {

    @Schema(example = "Java Developer")
    private String title;

    @Schema(example = "ABC Technologies")
    private String companyName;

    @Schema(example = "Hyderabad")
    private String location;

    @Schema(example = "Full Time")
    private String employmentType;

    @Schema(example = "0-2 years")
    private String experience;

    @Schema(example = "6-10 LPA")
    private String salary;

    @Schema(example = "Java, Spring Boot, MySQL, Docker")
    private String skills;

    @Schema(example = "We are looking for a Java developer with knowledge of Spring Boot.")
    private String description;

    public JobRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}