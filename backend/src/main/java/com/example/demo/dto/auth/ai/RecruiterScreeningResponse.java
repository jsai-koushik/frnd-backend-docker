
package com.example.demo.dto.auth.ai;

import java.util.List;

public record RecruiterScreeningResponse(
        Long applicationId,
        Long jobId,
        String jobTitle,
        Long candidateId,
        String candidateName,
        String matchSummary,
        List<String> matchingSkills,
        List<String> missingOrUnconfirmedRequirements,
        String experienceCompatibility,
        List<String> suggestedInterviewTopics
) {
}
