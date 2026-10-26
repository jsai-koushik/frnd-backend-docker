package com.example.demo.dto.auth;

import java.time.LocalDate;
import java.time.LocalTime;

public class InterviewResponse {

    private Long interviewId;

    private Long applicationId;

    private Long jobId;

    private String jobTitle;

    private String companyName;

    private Long candidateId;

    private String candidateName;

    private String candidateEmail;

    private LocalDate interviewDate;

    private LocalTime interviewTime;

    private String interviewType;

    private String meetingLink;

    private String interviewerName;

    private String notes;

    private String applicationStatus;

    public InterviewResponse() {
    }

    public InterviewResponse(
            Long interviewId,
            Long applicationId,
            Long jobId,
            String jobTitle,
            String companyName,
            Long candidateId,
            String candidateName,
            String candidateEmail,
            LocalDate interviewDate,
            LocalTime interviewTime,
            String interviewType,
            String meetingLink,
            String interviewerName,
            String notes,
            String applicationStatus) {

        this.interviewId = interviewId;
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.interviewDate = interviewDate;
        this.interviewTime = interviewTime;
        this.interviewType = interviewType;
        this.meetingLink = meetingLink;
        this.interviewerName = interviewerName;
        this.notes = notes;
        this.applicationStatus = applicationStatus;
    }

    public Long getInterviewId() {
        return interviewId;
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

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public LocalTime getInterviewTime() {
        return interviewTime;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public String getInterviewerName() {
        return interviewerName;
    }

    public String getNotes() {
        return notes;
    }

    public String getApplicationStatus() {
        return applicationStatus;
    }
}