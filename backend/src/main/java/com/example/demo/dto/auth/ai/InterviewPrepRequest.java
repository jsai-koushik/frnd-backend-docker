
package com.example.demo.dto.auth.ai;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class InterviewPrepRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @Min(
        value = 1,
        message = "Minimum 1 question is required"
    )
    @Max(
        value = 20,
        message = "Maximum 20 questions are allowed"
    )
    private int numberOfQuestions = 5;

    public InterviewPrepRequest() {
    }

    public InterviewPrepRequest(
            Long jobId,
            int numberOfQuestions) {

        this.jobId = jobId;
        this.numberOfQuestions = numberOfQuestions;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public int getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public void setNumberOfQuestions(int numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }
}
