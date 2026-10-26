
package com.example.demo.dto.auth.ai;

import java.util.List;

public class JobMatchResponse {

    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String matchSummary;

    private List<String> matchingSkills;
    private List<String> missingSkills;
    private List<String> recommendations;

    private String experienceCompatibility;

    public JobMatchResponse() {
    }

    public JobMatchResponse(
            Long jobId,
            String jobTitle,
            String companyName,
            String matchSummary,
            List<String> matchingSkills,
            List<String> missingSkills,
            List<String> recommendations,
            String experienceCompatibility) {

        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.matchSummary = matchSummary;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.recommendations = recommendations;
        this.experienceCompatibility = experienceCompatibility;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getMatchSummary() {
        return matchSummary;
    }

    public void setMatchSummary(String matchSummary) {
        this.matchSummary = matchSummary;
    }

    public List<String> getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(List<String> matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public String getExperienceCompatibility() {
        return experienceCompatibility;
    }

    public void setExperienceCompatibility(
            String experienceCompatibility) {
        this.experienceCompatibility = experienceCompatibility;
    }
}
