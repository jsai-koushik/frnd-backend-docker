package com.example.demo.dto.auth;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalJobs;
    private long totalApplications;
    private long totalInterviews;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(
            long totalUsers,
            long totalCandidates,
            long totalRecruiters,
            long totalJobs,
            long totalApplications,
            long totalInterviews) {

        this.totalUsers = totalUsers;
        this.totalCandidates = totalCandidates;
        this.totalRecruiters = totalRecruiters;
        this.totalJobs = totalJobs;
        this.totalApplications = totalApplications;
        this.totalInterviews = totalInterviews;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public long getTotalRecruiters() {
        return totalRecruiters;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public long getTotalInterviews() {
        return totalInterviews;
    }
}