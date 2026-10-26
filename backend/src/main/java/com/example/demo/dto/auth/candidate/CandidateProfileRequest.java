package com.example.demo.dto.auth.candidate;



import io.swagger.v3.oas.annotations.media.Schema;

public class CandidateProfileRequest {

    @Schema(example = "9876543210")
    private String phone;

    @Schema(example = "Vijayawada")
    private String location;

    @Schema(example = "B.Tech Computer Science")
    private String education;

    @Schema(example = "Fresher")
    private String experience;

    @Schema(example = "Java developer interested in Spring Boot and DevOps")
    private String about;

    public CandidateProfileRequest() {
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }
}
