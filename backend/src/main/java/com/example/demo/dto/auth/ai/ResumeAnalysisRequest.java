
package com.example.demo.dto.auth.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResumeAnalysisRequest {

    @NotBlank(message = "Resume text is required")
    @Size(
        max = 30000,
        message = "Resume text must not exceed 30000 characters"
    )
    private String resumeText;

    public ResumeAnalysisRequest() {
    }

    public ResumeAnalysisRequest(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }
}
