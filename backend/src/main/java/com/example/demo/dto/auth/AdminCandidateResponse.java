package com.example.demo.dto.auth;

public class AdminCandidateResponse {

    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String location;
    private String education;
    private String experience;
    private String about;

    public AdminCandidateResponse() {
    }

    public AdminCandidateResponse(
            Long userId,
            String name,
            String email,
            String phone,
            String location,
            String education,
            String experience,
            String about) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.location = location;
        this.education = education;
        this.experience = experience;
        this.about = about;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public String getEducation() {
        return education;
    }

    public String getExperience() {
        return experience;
    }

    public String getAbout() {
        return about;
    }
}