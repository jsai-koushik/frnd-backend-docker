
package com.example.demo.dto.auth.ai;

import java.util.List;

public record RecruiterInterviewResponse(
        Long jobId,
        String jobTitle,
        List<String> technicalQuestions,
        List<String> behavioralQuestions,
        List<String> interviewerGuidance
) {
}
