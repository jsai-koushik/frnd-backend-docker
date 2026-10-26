package com.example.demo.service;

import com.example.demo.dto.auth.InterviewRequest;
import com.example.demo.dto.auth.InterviewResponse;
import com.example.demo.entity.ApplicationStatus;
import com.example.demo.entity.Job;
import com.example.demo.entity.JobApplication;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.Interview;

import com.example.demo.repository.InterviewRepository;
import com.example.demo.repository.JobApplicationRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public InterviewService(
            InterviewRepository interviewRepository,
            JobApplicationRepository jobApplicationRepository,
            UserRepository userRepository) {

        this.interviewRepository = interviewRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    public InterviewResponse scheduleInterview(
            String recruiterEmail,
            Long applicationId,
            InterviewRequest request) {

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

        if (interviewRepository
                .findByApplicationId(applicationId)
                .isPresent()) {

            throw new RuntimeException(
                    "Interview already scheduled for this application"
            );
        }

        if (request.getInterviewDate() == null) {

            throw new RuntimeException(
                    "Interview date is required"
            );
        }

        if (request.getInterviewTime() == null) {

            throw new RuntimeException(
                    "Interview time is required"
            );
        }

        if (request.getInterviewType() == null ||
                request.getInterviewType().isBlank()) {

            throw new RuntimeException(
                    "Interview type is required"
            );
        }

        if (request.getInterviewerName() == null ||
                request.getInterviewerName().isBlank()) {

            throw new RuntimeException(
                    "Interviewer name is required"
            );
        }

        Interview interview = new Interview();

        interview.setApplication(application);
        interview.setInterviewDate(
                request.getInterviewDate()
        );
        interview.setInterviewTime(
                request.getInterviewTime()
        );
        interview.setInterviewType(
                request.getInterviewType()
        );
        interview.setMeetingLink(
                request.getMeetingLink()
        );
        interview.setInterviewerName(
                request.getInterviewerName()
        );
        interview.setNotes(
                request.getNotes()
        );

        /*
         * Automatically update application status
         * when recruiter schedules the interview.
         */
        application.setStatus(
                ApplicationStatus.INTERVIEW_SCHEDULED
        );

        jobApplicationRepository.save(application);

        Interview savedInterview =
                interviewRepository.save(interview);

        return convertToResponse(savedInterview);
    }

    public List<InterviewResponse> getMyInterviews(
            String candidateEmail) {

        User candidate = getCandidate(candidateEmail);

        List<Interview> interviews =
                interviewRepository
                        .findByApplicationCandidateId(
                                candidate.getId()
                        );

        return interviews.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<InterviewResponse> getRecruiterInterviews(
            String recruiterEmail) {

        User recruiter = getRecruiter(recruiterEmail);

        List<Interview> interviews =
                interviewRepository
                        .findByApplicationJobRecruiterId(
                                recruiter.getId()
                        );

        return interviews.stream()
                .map(this::convertToResponse)
                .toList();
    }

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

    private User getCandidate(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        if (user.getRole() != Role.CANDIDATE) {

            throw new RuntimeException(
                    "Only candidates can perform this action"
            );
        }

        return user;
    }

    private void checkJobOwnership(
            Job job,
            User recruiter) {

        if (job.getRecruiter() == null ||
                !job.getRecruiter()
                        .getId()
                        .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You can only manage interviews for your own jobs"
            );
        }
    }

    private InterviewResponse convertToResponse(
            Interview interview) {

        JobApplication application =
                interview.getApplication();

        Job job = application.getJob();

        User candidate =
                application.getCandidate();

        return new InterviewResponse(
                interview.getId(),
                application.getId(),
                job.getId(),
                job.getTitle(),
                job.getCompanyName(),
                candidate.getId(),
                candidate.getName(),
                candidate.getEmail(),
                interview.getInterviewDate(),
                interview.getInterviewTime(),
                interview.getInterviewType(),
                interview.getMeetingLink(),
                interview.getInterviewerName(),
                interview.getNotes(),
                application.getStatus().name()
        );
    }
}