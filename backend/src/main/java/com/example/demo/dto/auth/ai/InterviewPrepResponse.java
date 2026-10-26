
package com.example.demo.dto.auth.ai;

import java.util.List;

public class InterviewPrepResponse {

    private Long jobId;
    private String jobTitle;

    private List<String> technicalQuestions;
    private List<String> hrQuestions;
    private List<String> preparationTips;

    public InterviewPrepResponse() {
    }

    public InterviewPrepResponse(
            Long jobId,
            String jobTitle,
            List<String> technicalQuestions,
            List<String> hrQuestions,
            List<String> preparationTips) {

        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.technicalQuestions = technicalQuestions;
        this.hrQuestions = hrQuestions;
        this.preparationTips = preparationTips;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public List<String> getTechnicalQuestions() {
        return technicalQuestions;
    }

    public void setTechnicalQuestions(
            List<String> technicalQuestions) {
        this.technicalQuestions = technicalQuestions;
    }

    public List<String> getHrQuestions() {
        return hrQuestions;
    }

    public void setHrQuestions(List<String> hrQuestions) {
        this.hrQuestions = hrQuestions;
    }

    public List<String> getPreparationTips() {
        return preparationTips;
    }

    public void setPreparationTips(
            List<String> preparationTips) {
        this.preparationTips = preparationTips;
    }
}
