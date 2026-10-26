package com.example.demo.service;



import com.example.demo.dto.auth.ApplicationResponse;
import com.example.demo.entity.ApplicationStatus;
import com.example.demo.entity.Job;
import com.example.demo.entity.JobApplication;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.JobApplicationRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            JobApplicationRepository jobApplicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public ApplicationResponse applyForJob(
            String candidateEmail,
            Long jobId) {

        User candidate = getCandidate(candidateEmail);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        if (jobApplicationRepository.existsByJobIdAndCandidateId(
                jobId,
                candidate.getId())) {

            throw new RuntimeException(
                    "You have already applied for this job"
            );
        }

        JobApplication application = new JobApplication();

        application.setJob(job);
        application.setCandidate(candidate);
        application.setStatus(ApplicationStatus.APPLIED);

        JobApplication savedApplication =
                jobApplicationRepository.save(application);

        return convertToResponse(savedApplication);
    }

    public List<ApplicationResponse> getMyApplications(
            String candidateEmail) {

        User candidate = getCandidate(candidateEmail);

        List<JobApplication> applications =
                jobApplicationRepository.findByCandidateId(
                        candidate.getId()
                );

        return applications.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ApplicationResponse getApplicationById(
            String candidateEmail,
            Long applicationId) {

        User candidate = getCandidate(candidateEmail);

        JobApplication application =
                jobApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));

        if (!application.getCandidate()
                .getId()
                .equals(candidate.getId())) {

            throw new RuntimeException(
                    "You can only view your own application"
            );
        }

        return convertToResponse(application);
    }

    public void withdrawApplication(
            String candidateEmail,
            Long applicationId) {

        User candidate = getCandidate(candidateEmail);

        JobApplication application =
                jobApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));

        if (!application.getCandidate()
                .getId()
                .equals(candidate.getId())) {

            throw new RuntimeException(
                    "You can only withdraw your own application"
            );
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);

        jobApplicationRepository.save(application);
    }

    private User getCandidate(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.CANDIDATE) {

            throw new RuntimeException(
                    "Only candidates can perform this action"
            );
        }

        return user;
    }

    private ApplicationResponse convertToResponse(
            JobApplication application) {

        Job job = application.getJob();
        User candidate = application.getCandidate();

        return new ApplicationResponse(
                application.getId(),
                job.getId(),
                job.getTitle(),
                job.getCompanyName(),
                candidate.getId(),
                candidate.getName(),
                candidate.getEmail(),
                application.getStatus().name()
        );
    }
}
