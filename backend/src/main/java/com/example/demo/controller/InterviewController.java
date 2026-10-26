package com.example.demo.controller;

import com.example.demo.dto.auth.InterviewResponse;
import com.example.demo.service.InterviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@Tag(
        name = "Interviews",
        description = "Candidate interview management APIs"
)
@SecurityRequirement(name = "bearerAuth")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(
            InterviewService interviewService) {

        this.interviewService = interviewService;
    }

    // =========================
    // GET MY INTERVIEWS
    // =========================

    @GetMapping("/my")
    @Operation(
            summary = "Get my interviews",
            description = "Returns all interviews scheduled for the logged-in candidate"
    )
    public ResponseEntity<List<InterviewResponse>> getMyInterviews(
            Authentication authentication) {

        String candidateEmail =
                authentication.getName();

        List<InterviewResponse> interviews =
                interviewService.getMyInterviews(
                        candidateEmail
                );

        return ResponseEntity.ok(interviews);
    }
}