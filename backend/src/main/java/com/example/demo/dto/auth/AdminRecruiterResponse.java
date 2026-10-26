package com.example.demo.dto.auth;

public class AdminRecruiterResponse {

    private Long userId;
    private String name;
    private String email;
    private String role;
    private long totalJobs;

    public AdminRecruiterResponse() {
    }

    public AdminRecruiterResponse(
            Long userId,
            String name,
            String email,
            String role,
            long totalJobs) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.totalJobs = totalJobs;
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

    public String getRole() {
        return role;
    }

    public long getTotalJobs() {
        return totalJobs;
    }
}