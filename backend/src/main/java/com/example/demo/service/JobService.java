package com.example.demo.service;

import com.example.demo.dto.auth.candidate.JobRequest;
import com.example.demo.dto.auth.candidate.JobResponse;
import com.example.demo.entity.Job;
import com.example.demo.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // Create a new job
    public JobResponse createJob(JobRequest request) {

        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperience(request.getExperience());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setDescription(request.getDescription());

        Job savedJob = jobRepository.save(job);

        return convertToResponse(savedJob);
    }

    // Get all jobs
    public List<JobResponse> getAllJobs() {

        List<Job> jobs = jobRepository.findAll();

        return jobs.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get one job by ID
    public JobResponse getJobById(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        return convertToResponse(job);
    }

    // Update existing job
    public JobResponse updateJob(
            Long jobId,
            JobRequest request) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

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

    // Delete job
    public void deleteJob(Long jobId) {

        if (!jobRepository.existsById(jobId)) {
            throw new RuntimeException("Job not found");
        }

        jobRepository.deleteById(jobId);
    }

    // Convert Entity → Response DTO
    private JobResponse convertToResponse(Job job) {

        return new JobResponse(
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