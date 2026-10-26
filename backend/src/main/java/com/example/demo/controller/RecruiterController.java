package com.example.demo.controller;

import com.example.demo.dto.auth.ApplicationResponse;
import com.example.demo.dto.auth.InterviewRequest;
import com.example.demo.dto.auth.InterviewResponse;
import com.example.demo.dto.auth.RecruiterJobRequest;
import com.example.demo.dto.auth.RecruiterJobResponse;

import com.example.demo.entity.ApplicationStatusRequest;

import com.example.demo.service.InterviewService;
import com.example.demo.service.RecruiterService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@Tag(
        name = "Recruiter",
        description = "Recruiter job, applicant and interview management APIs"
)
@SecurityRequirement(name = "bearerAuth")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final InterviewService interviewService;

    public RecruiterController(
            RecruiterService recruiterService,
            InterviewService interviewService) {

        this.recruiterService = recruiterService;
        this.interviewService = interviewService;
    }

    // =========================
    // CREATE JOB
    // =========================

    @PostMapping("/jobs")
    @Operation(
            summary = "Create job",
            description = "Creates a new job for the logged-in recruiter"
    )
    public ResponseEntity<RecruiterJobResponse> createJob(
            Authentication authentication,
            @RequestBody RecruiterJobRequest request) {

        String recruiterEmail =
                authentication.getName();

        RecruiterJobResponse response =
                recruiterService.createJob(
                        recruiterEmail,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET MY JOBS
    // =========================

    @GetMapping("/jobs")
    @Operation(
            summary = "Get recruiter jobs",
            description = "Returns all jobs created by the logged-in recruiter"
    )
    public ResponseEntity<List<RecruiterJobResponse>> getOwnJobs(
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        List<RecruiterJobResponse> jobs =
                recruiterService.getOwnJobs(
                        recruiterEmail
                );

        return ResponseEntity.ok(jobs);
    }

    // =========================
    // UPDATE JOB
    // =========================

    @PutMapping("/jobs/{jobId}")
    @Operation(
            summary = "Update job",
            description = "Updates a job owned by the logged-in recruiter"
    )
    public ResponseEntity<RecruiterJobResponse> updateJob(
            Authentication authentication,
            @PathVariable Long jobId,
            @RequestBody RecruiterJobRequest request) {

        String recruiterEmail =
                authentication.getName();

        RecruiterJobResponse response =
                recruiterService.updateJob(
                        recruiterEmail,
                        jobId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // DELETE JOB
    // =========================

    @DeleteMapping("/jobs/{jobId}")
    @Operation(
            summary = "Delete job",
            description = "Deletes a job owned by the logged-in recruiter"
    )
    public ResponseEntity<String> deleteJob(
            Authentication authentication,
            @PathVariable Long jobId) {

        String recruiterEmail =
                authentication.getName();

        recruiterService.deleteJob(
                recruiterEmail,
                jobId
        );

        return ResponseEntity.ok(
                "Job deleted successfully"
        );
    }

    // =========================
    // GET APPLICANTS
    // =========================

    @GetMapping("/jobs/{jobId}/applicants")
    @Operation(
            summary = "Get applicants",
            description = "Returns all applicants for a recruiter's job"
    )
    public ResponseEntity<List<ApplicationResponse>> getApplicants(
            Authentication authentication,
            @PathVariable Long jobId) {

        String recruiterEmail =
                authentication.getName();

        List<ApplicationResponse> applicants =
                recruiterService.getApplicants(
                        recruiterEmail,
                        jobId
                );

        return ResponseEntity.ok(applicants);
    }

    // =========================
    // UPDATE APPLICATION STATUS
    // =========================

    @PutMapping("/applications/{applicationId}/status")
    @Operation(
            summary = "Update application status",
            description = "Allows the recruiter to update the status of an applicant"
    )
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            Authentication authentication,
            @PathVariable Long applicationId,
            @RequestBody ApplicationStatusRequest request) {

        String recruiterEmail =
                authentication.getName();

        ApplicationResponse response =
                recruiterService.updateApplicationStatus(
                        recruiterEmail,
                        applicationId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // SCHEDULE INTERVIEW
    // =========================

    @PostMapping("/interviews/{applicationId}")
    @Operation(
            summary = "Schedule interview",
            description = "Schedules an interview for an applicant"
    )
    public ResponseEntity<InterviewResponse> scheduleInterview(
            Authentication authentication,
            @PathVariable Long applicationId,
            @RequestBody InterviewRequest request) {

        String recruiterEmail =
                authentication.getName();

        InterviewResponse response =
                interviewService.scheduleInterview(
                        recruiterEmail,
                        applicationId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET RECRUITER INTERVIEWS
    // =========================

    @GetMapping("/interviews")
    @Operation(
            summary = "Get recruiter interviews",
            description = "Returns all interviews for the logged-in recruiter's jobs"
    )
    public ResponseEntity<List<InterviewResponse>> getRecruiterInterviews(
            Authentication authentication) {

        String recruiterEmail =
                authentication.getName();

        List<InterviewResponse> interviews =
                interviewService.getRecruiterInterviews(
                        recruiterEmail
                );

        return ResponseEntity.ok(interviews);
    }
}
