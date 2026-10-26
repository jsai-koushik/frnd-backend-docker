
package com.example.demo.controller;

import com.example.demo.dto.auth.ai.*;
import com.example.demo.service.RecruiterAiService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter/ai")
@Tag(
        name = "Recruiter AI",
        description = "AI-powered recruiter assistance APIs"
)
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterAiController {

    private final RecruiterAiService recruiterAiService;

    public RecruiterAiController(
            RecruiterAiService recruiterAiService) {

        this.recruiterAiService = recruiterAiService;
    }

    // ==========================================
    // AI APPLICANT PROFILE SCREENING
    // ==========================================

    @PostMapping("/applications/{applicationId}/screen")
    @Operation(
            summary = "AI Applicant Profile Screening",
            description = "Compares an applicant's available profile with job requirements"
    )
    public ResponseEntity<RecruiterScreeningResponse> screenApplication(
            Authentication authentication,
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                recruiterAiService.screenApplication(
                        authentication.getName(),
                        applicationId
                )
        );
    }

    // ==========================================
    // AI INTERVIEW QUESTIONS
    // ==========================================

    @PostMapping("/jobs/{jobId}/interview-questions")
    @Operation(
            summary = "AI Interview Question Generator",
            description = "Generates job-specific interview questions for the recruiter"
    )
    public ResponseEntity<RecruiterInterviewResponse> generateQuestions(
            Authentication authentication,
            @PathVariable Long jobId,
            @Valid @RequestBody RecruiterInterviewRequest request) {

        return ResponseEntity.ok(
                recruiterAiService.generateInterviewQuestions(
                        authentication.getName(),
                        jobId,
                        request
                )
        );
    }
}
