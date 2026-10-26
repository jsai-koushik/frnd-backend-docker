package com.example.demo.controller;

import com.example.demo.dto.auth.ApplicationResponse;
import com.example.demo.service.ApplicationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(
        name = "Applications",
        description = "Candidate job application management APIs"
)
@SecurityRequirement(name = "bearerAuth")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService = applicationService;
    }

    @PostMapping("/jobs/{jobId}")
    @Operation(
            summary = "Apply for a job",
            description = "Allows the logged-in candidate to apply for a job"
    )
    public ResponseEntity<ApplicationResponse> applyForJob(
            Authentication authentication,
            @PathVariable Long jobId) {

        String candidateEmail = authentication.getName();

        ApplicationResponse response =
                applicationService.applyForJob(
                        candidateEmail,
                        jobId
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    @Operation(
            summary = "Get my applications",
            description = "Returns all applications submitted by the logged-in candidate"
    )
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        String candidateEmail = authentication.getName();

        List<ApplicationResponse> applications =
                applicationService.getMyApplications(
                        candidateEmail
                );

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{applicationId}")
    @Operation(
            summary = "Get application by ID",
            description = "Returns details of a specific application"
    )
    public ResponseEntity<ApplicationResponse> getApplicationById(
            Authentication authentication,
            @PathVariable Long applicationId) {

        String candidateEmail = authentication.getName();

        ApplicationResponse response =
                applicationService.getApplicationById(
                        candidateEmail,
                        applicationId
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{applicationId}/withdraw")
    @Operation(
            summary = "Withdraw application",
            description = "Allows the candidate to withdraw their application"
    )
    public ResponseEntity<String> withdrawApplication(
            Authentication authentication,
            @PathVariable Long applicationId) {

        String candidateEmail = authentication.getName();

        applicationService.withdrawApplication(
                candidateEmail,
                applicationId
        );

        return ResponseEntity.ok(
                "Application withdrawn successfully"
        );
    }
}