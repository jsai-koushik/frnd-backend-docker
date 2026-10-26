package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "job_applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"job_id", "candidate_id"}
                )
        }
)
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // JOB
    // =========================

    @ManyToOne
    @JoinColumn(
            name = "job_id",
            nullable = false
    )
    private Job job;

    // =========================
    // CANDIDATE
    // =========================

    @ManyToOne
    @JoinColumn(
            name = "candidate_id",
            nullable = false
    )
    private User candidate;

    // =========================
    // APPLICATION STATUS
    // =========================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    // =========================
    // DEFAULT CONSTRUCTOR
    // =========================

    public JobApplication() {
    }

    // =========================
    // CONSTRUCTOR
    // =========================

    public JobApplication(
            Job job,
            User candidate,
            ApplicationStatus status) {

        this.job = job;
        this.candidate = candidate;
        this.status = status;
    }

    // =========================
    // GET ID
    // =========================

    public Long getId() {
        return id;
    }

    // =========================
    // GET JOB
    // =========================

    public Job getJob() {
        return job;
    }

    // =========================
    // SET JOB
    // =========================

    public void setJob(Job job) {
        this.job = job;
    }

    // =========================
    // GET CANDIDATE
    // =========================

    public User getCandidate() {
        return candidate;
    }

    // =========================
    // SET CANDIDATE
    // =========================

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    // =========================
    // GET STATUS
    // =========================

    public ApplicationStatus getStatus() {
        return status;
    }

    // =========================
    // SET STATUS
    // =========================

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}