package com.example.demo.dto.auth;

public class AdminJobResponse {

    private Long jobId;
    private String title;
    private String companyName;
    private String location;
    private String employmentType;
    private String experience;
    private String salary;
    private String skills;
    private String description;

    private Long recruiterId;
    private String recruiterName;
    private String recruiterEmail;

    public AdminJobResponse() {
    }

    public AdminJobResponse(
            Long jobId,
            String title,
            String companyName,
            String location,
            String employmentType,
            String experience,
            String salary,
            String skills,
            String description,
            Long recruiterId,
            String recruiterName,
            String recruiterEmail) {

        this.jobId = jobId;
        this.title = title;
        this.companyName = companyName;
        this.location = location;
        this.employmentType = employmentType;
        this.experience = experience;
        this.salary = salary;
        this.skills = skills;
        this.description = description;
        this.recruiterId = recruiterId;
        this.recruiterName = recruiterName;
        this.recruiterEmail = recruiterEmail;
    }

    public Long getJobId() {
        return jobId;
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

    public Long getRecruiterId() {
        return recruiterId;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }
}