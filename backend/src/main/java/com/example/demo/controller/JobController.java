package com.example.demo.controller;

import com.example.demo.dto.auth.candidate.JobRequest;
import com.example.demo.dto.auth.candidate.JobResponse;
import com.example.demo.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(
        name = "Jobs",
        description = "Job management APIs"
)
@SecurityRequirement(name = "bearerAuth")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // Create a new job
    @PostMapping
    @Operation(
            summary = "Create job",
            description = "Creates a new job"
    )
    public ResponseEntity<JobResponse> createJob(
            @RequestBody JobRequest request) {

        JobResponse response =
                jobService.createJob(request);

        return ResponseEntity.ok(response);
    }

    // Get all jobs
    @GetMapping
    @Operation(
            summary = "Get all jobs",
            description = "Returns all available jobs"
    )
    public ResponseEntity<List<JobResponse>> getAllJobs() {

        List<JobResponse> jobs =
                jobService.getAllJobs();

        return ResponseEntity.ok(jobs);
    }

    // Get job by ID
    @GetMapping("/{jobId}")
    @Operation(
            summary = "Get job by ID",
            description = "Returns details of a specific job"
    )
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long jobId) {

        JobResponse response =
                jobService.getJobById(jobId);

        return ResponseEntity.ok(response);
    }

    // Update job
    @PutMapping("/{jobId}")
    @Operation(
            summary = "Update job",
            description = "Updates an existing job"
    )
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long jobId,
            @RequestBody JobRequest request) {

        JobResponse response =
                jobService.updateJob(
                        jobId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // Delete job
    @DeleteMapping("/{jobId}")
    @Operation(
            summary = "Delete job",
            description = "Deletes an existing job"
    )
    public ResponseEntity<String> deleteJob(
            @PathVariable Long jobId) {

        jobService.deleteJob(jobId);

        return ResponseEntity.ok(
                "Job deleted successfully"
        );
    }
}