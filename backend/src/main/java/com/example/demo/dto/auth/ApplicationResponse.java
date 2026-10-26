package com.example.demo.dto.auth;



public class ApplicationResponse {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String status;

    public ApplicationResponse() {
    }

    public ApplicationResponse(
            Long applicationId,
            Long jobId,
            String jobTitle,
            String companyName,
            Long candidateId,
            String candidateName,
            String candidateEmail,
            String status) {

        this.applicationId = applicationId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.status = status;
    }

    public Long getApplicationId() {
        return applicationId;
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

    public Long getCandidateId() {
        return candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public String getStatus() {
        return status;
    }
}

