
package com.example.demo.service;

import com.example.demo.dto.auth.candidate.CandidateProfileRequest;
import com.example.demo.dto.auth.candidate.CandidateProfileResponse;
import com.example.demo.entity.CandidateProfile;
import com.example.demo.entity.User;
import com.example.demo.repository.CandidateProfileRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;

    public CandidateService(
            CandidateProfileRepository candidateProfileRepository,
            UserRepository userRepository) {

        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // CREATE CANDIDATE PROFILE
    // ==========================================

    public CandidateProfileResponse createProfile(
            Long userId,
            CandidateProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        if (candidateProfileRepository.existsByUserId(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Candidate profile already exists"
            );
        }

        CandidateProfile profile = new CandidateProfile();

        profile.setPhone(request.getPhone());
        profile.setLocation(request.getLocation());
        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());
        profile.setAbout(request.getAbout());
        profile.setUser(user);

        CandidateProfile savedProfile =
                candidateProfileRepository.save(profile);

        return convertToResponse(savedProfile);
    }

    // ==========================================
    // GET CANDIDATE PROFILE
    // ==========================================

    public CandidateProfileResponse getProfile(Long userId) {

        CandidateProfile profile =
                candidateProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Candidate profile not found"
                                )
                        );

        return convertToResponse(profile);
    }

    // ==========================================
    // UPDATE CANDIDATE PROFILE
    // ==========================================

    public CandidateProfileResponse updateProfile(
            Long userId,
            CandidateProfileRequest request) {

        CandidateProfile profile =
                candidateProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Candidate profile not found"
                                )
                        );

        profile.setPhone(request.getPhone());
        profile.setLocation(request.getLocation());
        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());
        profile.setAbout(request.getAbout());

        CandidateProfile updatedProfile =
                candidateProfileRepository.save(profile);

        return convertToResponse(updatedProfile);
    }

    // ==========================================
    // CONVERT ENTITY TO RESPONSE DTO
    // ==========================================

    private CandidateProfileResponse convertToResponse(
            CandidateProfile profile) {

        User user = profile.getUser();

        return new CandidateProfileResponse(
                profile.getId(),
                user.getName(),
                user.getEmail(),
                profile.getPhone(),
                profile.getLocation(),
                profile.getEducation(),
                profile.getExperience(),
                profile.getAbout()
        );
    }
}
