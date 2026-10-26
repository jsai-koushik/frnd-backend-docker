package com.example.demo.dto.auth;

public class AdminApplicationResponse {

    private Long applicationId;

    private Long candidateId;
    private String candidateName;
    private String candidateEmail;

    private Long jobId;
    private String jobTitle;
    private String companyName;

    private Long recruiterId;
    private String recruiterName;
    private String recruiterEmail;

    private String status;

    public AdminApplicationResponse() {
    }

    public AdminApplicationResponse(
            Long applicationId,
            Long candidateId,
            String candidateName,
            String candidateEmail,
            Long jobId,
            String jobTitle,
            String companyName,
            Long recruiterId,
            String recruiterName,
            String recruiterEmail,
            String status) {

        this.applicationId = applicationId;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.recruiterId = recruiterId;
        this.recruiterName = recruiterName;
        this.recruiterEmail = recruiterEmail;
        this.status = status;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public Long getJobId() {
        return jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCompanyName() {
        return companyName;
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

    public String getStatus() {
        return status;
    }
}