package com.example.demo.repository;

import com.example.demo.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository
        extends JpaRepository<Interview, Long> {

    Optional<Interview> findByApplicationId(Long applicationId);

    List<Interview> findByApplicationCandidateId(Long candidateId);

    List<Interview> findByApplicationJobRecruiterId(Long recruiterId);
}