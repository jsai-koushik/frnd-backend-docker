package com.example.demo.service;

import com.example.demo.dto.auth.AdminApplicationResponse;
import com.example.demo.dto.auth.AdminCandidateResponse;
import com.example.demo.dto.auth.AdminDashboardResponse;
import com.example.demo.dto.auth.AdminJobResponse;
import com.example.demo.dto.auth.AdminRecruiterResponse;
import com.example.demo.dto.auth.AdminUserResponse;
import com.example.demo.entity.CandidateProfile;
import com.example.demo.entity.Job;
import com.example.demo.entity.JobApplication;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.CandidateProfileRepository;
import com.example.demo.repository.InterviewRepository;
import com.example.demo.repository.JobApplicationRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;

    private final CandidateProfileRepository candidateProfileRepository;

    private final JobRepository jobRepository;

    private final JobApplicationRepository jobApplicationRepository;

    private final InterviewRepository interviewRepository;

    public AdminService(
            UserRepository userRepository,
            CandidateProfileRepository candidateProfileRepository,
            JobRepository jobRepository,
            JobApplicationRepository jobApplicationRepository,
            InterviewRepository interviewRepository) {

        this.userRepository = userRepository;

        this.candidateProfileRepository =
                candidateProfileRepository;

        this.jobRepository = jobRepository;

        this.jobApplicationRepository =
                jobApplicationRepository;

        this.interviewRepository =
                interviewRepository;
    }

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    public AdminDashboardResponse getDashboard() {

        long totalUsers =
                userRepository.count();

        long totalCandidates =
                userRepository
                        .findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.CANDIDATE)
                        .count();

        long totalRecruiters =
                userRepository
                        .findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.RECRUITER)
                        .count();

        long totalJobs =
                jobRepository.count();

        long totalApplications =
                jobApplicationRepository.count();

        long totalInterviews =
                interviewRepository.count();

        return new AdminDashboardResponse(
                totalUsers,
                totalCandidates,
                totalRecruiters,
                totalJobs,
                totalApplications,
                totalInterviews
        );
    }

    // ==========================================
    // GET ALL USERS
    // ==========================================

    public List<AdminUserResponse> getAllUsers() {

        List<User> users =
                userRepository.findAll();

        return users.stream()
                .map(user ->
                        new AdminUserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole().name()
                        )
                )
                .toList();
    }

    // ==========================================
    // GET ALL CANDIDATES
    // ==========================================

    public List<AdminCandidateResponse> getAllCandidates() {

        List<User> candidates =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.CANDIDATE)
                        .toList();

        return candidates.stream()
                .map(user -> {

                    CandidateProfile profile =
                            candidateProfileRepository
                                    .findByUserId(user.getId())
                                    .orElse(null);

                    return new AdminCandidateResponse(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            profile != null
                                    ? profile.getPhone()
                                    : null,
                            profile != null
                                    ? profile.getLocation()
                                    : null,
                            profile != null
                                    ? profile.getEducation()
                                    : null,
                            profile != null
                                    ? profile.getExperience()
                                    : null,
                            profile != null
                                    ? profile.getAbout()
                                    : null
                    );
                })
                .toList();
    }

    // ==========================================
    // GET ALL RECRUITERS
    // ==========================================

    public List<AdminRecruiterResponse> getAllRecruiters() {

        List<User> recruiters =
                userRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() == Role.RECRUITER)
                        .toList();

        return recruiters.stream()
                .map(recruiter -> {

                    long totalJobs =
                            jobRepository
                                    .findByRecruiterId(
                                            recruiter.getId()
                                    )
                                    .size();

                    return new AdminRecruiterResponse(
                            recruiter.getId(),
                            recruiter.getName(),
                            recruiter.getEmail(),
                            recruiter.getRole().name(),
                            totalJobs
                    );
                })
                .toList();
    }

    // ==========================================
    // GET ALL JOBS
    // ==========================================

    public List<AdminJobResponse> getAllJobs() {

        List<Job> jobs =
                jobRepository.findAll();

        return jobs.stream()
                .map(job -> {

                    User recruiter =
                            job.getRecruiter();

                    Long recruiterId = null;

                    String recruiterName = null;

                    String recruiterEmail = null;

                    if (recruiter != null) {

                        recruiterId =
                                recruiter.getId();

                        recruiterName =
                                recruiter.getName();

                        recruiterEmail =
                                recruiter.getEmail();
                    }

                    return new AdminJobResponse(
                            job.getId(),
                            job.getTitle(),
                            job.getCompanyName(),
                            job.getLocation(),
                            job.getEmploymentType(),
                            job.getExperience(),
                            job.getSalary(),
                            job.getSkills(),
                            job.getDescription(),
                            recruiterId,
                            recruiterName,
                            recruiterEmail
                    );
                })
                .toList();
    }

    // ==========================================
    // GET ALL APPLICATIONS
    // ==========================================

    public List<AdminApplicationResponse> getAllApplications() {

        List<JobApplication> applications =
                jobApplicationRepository.findAll();

        return applications.stream()
                .map(application -> {

                    User candidate =
                            application.getCandidate();

                    Job job =
                            application.getJob();

                    User recruiter =
                            job.getRecruiter();

                    Long recruiterId = null;

                    String recruiterName = null;

                    String recruiterEmail = null;

                    if (recruiter != null) {

                        recruiterId =
                                recruiter.getId();

                        recruiterName =
                                recruiter.getName();

                        recruiterEmail =
                                recruiter.getEmail();
                    }

                    return new AdminApplicationResponse(
                            application.getId(),

                            candidate.getId(),
                            candidate.getName(),
                            candidate.getEmail(),

                            job.getId(),
                            job.getTitle(),
                            job.getCompanyName(),

                            recruiterId,
                            recruiterName,
                            recruiterEmail,

                            application.getStatus().name()
                    );
                })
                .toList();
    }

    // ==========================================
    // DELETE USER
    // ==========================================

    public void deleteUser(Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        if (user.getRole() == Role.ADMIN) {

            throw new RuntimeException(
                    "Admin user cannot be deleted"
            );
        }

        userRepository.delete(user);
    }

    // ==========================================
    // DELETE JOB
    // ==========================================

    public void deleteJob(Long jobId) {

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found"
                                )
                        );

        jobRepository.delete(job);
    }
}