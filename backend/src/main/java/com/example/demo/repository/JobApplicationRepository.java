package com.example.demo.repository;

import com.example.demo.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByJobId(Long jobId);

    List<JobApplication> findByCandidateId(Long candidateId);

    boolean existsByJobIdAndCandidateId(
            Long jobId,
            Long candidateId
    );
}