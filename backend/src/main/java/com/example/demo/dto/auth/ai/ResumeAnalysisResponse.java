
package com.example.demo.dto.auth.ai;

import java.util.List;

public class ResumeAnalysisResponse {

    private String summary;

    private List<String> identifiedSkills;
    private List<String> strengths;
    private List<String> improvementSuggestions;
    private List<String> recommendedJobRoles;

    public ResumeAnalysisResponse() {
    }

    public ResumeAnalysisResponse(
            String summary,
            List<String> identifiedSkills,
            List<String> strengths,
            List<String> improvementSuggestions,
            List<String> recommendedJobRoles) {

        this.summary = summary;
        this.identifiedSkills = identifiedSkills;
        this.strengths = strengths;
        this.improvementSuggestions = improvementSuggestions;
        this.recommendedJobRoles = recommendedJobRoles;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getIdentifiedSkills() {
        return identifiedSkills;
    }

    public void setIdentifiedSkills(List<String> identifiedSkills) {
        this.identifiedSkills = identifiedSkills;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getImprovementSuggestions() {
        return improvementSuggestions;
    }

    public void setImprovementSuggestions(
            List<String> improvementSuggestions) {
        this.improvementSuggestions = improvementSuggestions;
    }

    public List<String> getRecommendedJobRoles() {
        return recommendedJobRoles;
    }

    public void setRecommendedJobRoles(
            List<String> recommendedJobRoles) {
        this.recommendedJobRoles = recommendedJobRoles;
    }
}
