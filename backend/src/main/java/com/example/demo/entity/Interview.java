package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "application_id",
            nullable = false,
            unique = true
    )
    private JobApplication application;

    @Column(nullable = false)
    private LocalDate interviewDate;

    @Column(nullable = false)
    private LocalTime interviewTime;

    @Column(nullable = false)
    private String interviewType;

    private String meetingLink;

    @Column(nullable = false)
    private String interviewerName;

    @Column(length = 2000)
    private String notes;

    public Interview() {
    }

    public Interview(
            JobApplication application,
            LocalDate interviewDate,
            LocalTime interviewTime,
            String interviewType,
            String meetingLink,
            String interviewerName,
            String notes) {

        this.application = application;
        this.interviewDate = interviewDate;
        this.interviewTime = interviewTime;
        this.interviewType = interviewType;
        this.meetingLink = meetingLink;
        this.interviewerName = interviewerName;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public JobApplication getApplication() {
        return application;
    }

    public void setApplication(JobApplication application) {
        this.application = application;
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