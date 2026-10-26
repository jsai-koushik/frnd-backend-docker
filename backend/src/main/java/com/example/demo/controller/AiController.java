
package com.example.demo.controller;

import com.example.demo.dto.auth.ai.*;
import com.example.demo.service.AiService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Tag(
        name = "SmartHire AI",
        description = "AI-powered candidate assistance APIs"
)
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('CANDIDATE')")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    // ==========================================
    // AI JOB MATCHING
    // ==========================================

    @PostMapping("/jobs/{jobId}/match")
    @Operation(
            summary = "AI Job Matching",
            description = "Compares the authenticated candidate profile with a job"
    )
    public ResponseEntity<JobMatchResponse> matchJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        JobMatchResponse response = aiService.matchJob(
                authentication.getName(),
                jobId
        );

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // AI RESUME ANALYSIS
    // ==========================================

    @PostMapping("/resume/analyze")
    @Operation(
            summary = "AI Resume Analyzer",
            description = "Analyzes candidate-provided resume text"
    )
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            Authentication authentication,
            @Valid @RequestBody ResumeAnalysisRequest request) {

        ResumeAnalysisResponse response =
                aiService.analyzeResume(
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // AI INTERVIEW PREPARATION
    // ==========================================

    @PostMapping("/interview/prepare")
    @Operation(
            summary = "AI Interview Preparation",
            description = "Generates practice questions for a selected job"
    )
    public ResponseEntity<InterviewPrepResponse> prepareInterview(
            Authentication authentication,
            @Valid @RequestBody InterviewPrepRequest request) {

        InterviewPrepResponse response =
                aiService.prepareInterview(
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }
}
