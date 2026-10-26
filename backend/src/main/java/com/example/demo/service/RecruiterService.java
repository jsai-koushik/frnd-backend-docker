package com.example.demo.service;

import com.example.demo.dto.auth.ApplicationResponse;
import com.example.demo.dto.auth.RecruiterJobRequest;
import com.example.demo.dto.auth.RecruiterJobResponse;

import com.example.demo.entity.ApplicationStatusRequest;
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
public class RecruiterService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public RecruiterService(
            JobRepository jobRepository,
            UserRepository userRepository,
            JobApplicationRepository jobApplicationRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    // =========================
    // CREATE JOB
    // =========================

    public RecruiterJobResponse createJob(
            String recruiterEmail,
            RecruiterJobRequest request) {

        User recruiter = getRecruiter(recruiterEmail);

        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperience(request.getExperience());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setDescription(request.getDescription());

        job.setRecruiter(recruiter);

        Job savedJob = jobRepository.save(job);

        return convertToResponse(savedJob);
    }

    // =========================
    // GET MY JOBS
    // =========================

    public List<RecruiterJobResponse> getOwnJobs(
            String recruiterEmail) {

        User recruiter = getRecruiter(recruiterEmail);

        return jobRepository
                .findByRecruiterId(recruiter.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================
    // UPDATE JOB
    // =========================

    public RecruiterJobResponse updateJob(
            String recruiterEmail,
            Long jobId,
            RecruiterJobRequest request) {

        User recruiter = getRecruiter(recruiterEmail);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        checkJobOwnership(job, recruiter);

        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperience(request.getExperience());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setDescription(request.getDescription());

        Job updatedJob = jobRepository.save(job);

        return convertToResponse(updatedJob);
    }

    // =========================
    // DELETE JOB
    // =========================

    public void deleteJob(
            String recruiterEmail,
            Long jobId) {

        User recruiter = getRecruiter(recruiterEmail);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        checkJobOwnership(job, recruiter);

        jobRepository.delete(job);
    }

    // =========================
    // GET APPLICANTS
    // =========================

    public List<ApplicationResponse> getApplicants(
            String recruiterEmail,
            Long jobId) {

        User recruiter = getRecruiter(recruiterEmail);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Job not found"
                        )
                );

        checkJobOwnership(job, recruiter);

        List<JobApplication> applications =
                jobApplicationRepository.findByJobId(jobId);

        return applications.stream()
                .map(application ->
                        new ApplicationResponse(
                                application.getId(),
                                job.getId(),
                                job.getTitle(),
                                job.getCompanyName(),
                                application.getCandidate().getId(),
                                application.getCandidate().getName(),
                                application.getCandidate().getEmail(),
                                application.getStatus().name()
                        )
                )
                .toList();
    }

    // =========================
    // UPDATE APPLICATION STATUS
    // =========================

    public ApplicationResponse updateApplicationStatus(
            String recruiterEmail,
            Long applicationId,
            ApplicationStatusRequest request) {

        User recruiter = getRecruiter(recruiterEmail);

        JobApplication application =
                jobApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        Job job = application.getJob();

        checkJobOwnership(job, recruiter);

        if (request.getStatus() == null) {
            throw new RuntimeException(
                    "Application status cannot be null"
            );
        }

        application.setStatus(request.getStatus());

        JobApplication updatedApplication =
                jobApplicationRepository.save(application);

        return new ApplicationResponse(
                updatedApplication.getId(),
                job.getId(),
                job.getTitle(),
                job.getCompanyName(),
                updatedApplication.getCandidate().getId(),
                updatedApplication.getCandidate().getName(),
                updatedApplication.getCandidate().getEmail(),
                updatedApplication.getStatus().name()
        );
    }

    // =========================
    // GET RECRUITER
    // =========================

    private User getRecruiter(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (user.getRole() != Role.RECRUITER) {

            throw new RuntimeException(
                    "Only recruiters can perform this action"
            );
        }

        return user;
    }

    // =========================
    // CHECK JOB OWNERSHIP
    // =========================

    private void checkJobOwnership(
            Job job,
            User recruiter) {

        if (job.getRecruiter() == null ||
                !job.getRecruiter()
                        .getId()
                        .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You can only manage your own jobs"
            );
        }
    }

    // =========================
    // CONVERT JOB TO RESPONSE
    // =========================

    private RecruiterJobResponse convertToResponse(
            Job job) {

        return new RecruiterJobResponse(
                job.getId(),
                job.getTitle(),
                job.getCompanyName(),
                job.getLocation(),
                job.getEmploymentType(),
                job.getExperience(),
                job.getSalary(),
                job.getSkills(),
                job.getDescription()
        );
    }
}