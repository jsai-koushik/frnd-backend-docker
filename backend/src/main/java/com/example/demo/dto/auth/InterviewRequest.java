package com.example.demo.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalTime;

public class InterviewRequest {

    @Schema(example = "2026-10-10")
    private LocalDate interviewDate;

    @Schema(example = "10:30")
    private LocalTime interviewTime;

    @Schema(example = "ONLINE")
    private String interviewType;

    @Schema(example = "https://meet.google.com/abc-defg-hij")
    private String meetingLink;

    @Schema(example = "Rahul")
    private String interviewerName;

    @Schema(example = "Technical interview - Java and Spring Boot")
    private String notes;

    public InterviewRequest() {
    }

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public void setInterviewDate(LocalDate interviewDate) {
        this.interviewDate = interviewDate;
    }

    public LocalTime getInterviewTime() {
        return interviewTime;
    }

    public void setInterviewTime(LocalTime interviewTime) {
        this.interviewTime = interviewTime;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getInterviewerName() {
        return interviewerName;
    }

    public void setInterviewerName(String interviewerName) {
        this.interviewerName = interviewerName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}