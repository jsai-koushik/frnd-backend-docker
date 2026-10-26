
package com.example.demo.controller;

import com.example.demo.dto.auth.candidate.CandidateProfileRequest;
import com.example.demo.dto.auth.candidate.CandidateProfileResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CandidateService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/candidates")
@Tag(
        name = "Candidate",
        description = "Candidate profile management APIs"
)
@SecurityRequirement(name = "bearerAuth")
public class CandidateController {

    private final CandidateService candidateService;
    private final UserRepository userRepository;

    public CandidateController(
            CandidateService candidateService,
            UserRepository userRepository) {

        this.candidateService = candidateService;
        this.userRepository = userRepository;
    }

    private void verifyCandidateOwnership(
            Long userId,
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
            );
        }

        User authenticatedUser = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Authenticated user not found"
                        )
                );

        if (authenticatedUser.getRole() != Role.CANDIDATE) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only candidates can manage candidate profiles"
            );
        }

        if (!authenticatedUser.getId().equals(userId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only manage your own profile"
            );
        }
    }

    @PostMapping("/{userId}/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(
            summary = "Create candidate profile",
            description = "Creates a profile for the authenticated candidate"
    )
    public ResponseEntity<CandidateProfileResponse> createProfile(
            @PathVariable Long userId,
            @RequestBody CandidateProfileRequest request,
            Authentication authentication) {

        verifyCandidateOwnership(userId, authentication);

        CandidateProfileResponse response =
                candidateService.createProfile(userId, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(
            summary = "Get candidate profile",
            description = "Retrieves the authenticated candidate's profile"
    )
    public ResponseEntity<CandidateProfileResponse> getProfile(
            @PathVariable Long userId,
            Authentication authentication) {

        verifyCandidateOwnership(userId, authentication);

        CandidateProfileResponse response =
                candidateService.getProfile(userId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    @Operation(
            summary = "Update candidate profile",
            description = "Updates the authenticated candidate's profile"
    )
    public ResponseEntity<CandidateProfileResponse> updateProfile(
            @PathVariable Long userId,
            @RequestBody CandidateProfileRequest request,
            Authentication authentication) {

        verifyCandidateOwnership(userId, authentication);

        CandidateProfileResponse response =
                candidateService.updateProfile(userId, request);

        return ResponseEntity.ok(response);
    }
}
