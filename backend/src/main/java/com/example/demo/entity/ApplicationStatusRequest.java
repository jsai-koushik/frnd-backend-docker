package com.example.demo.entity;



import com.example.demo.entity.ApplicationStatus;
import io.swagger.v3.oas.annotations.media.Schema;

public class ApplicationStatusRequest {

    @Schema(example = "SHORTLISTED")
    private ApplicationStatus status;

    public ApplicationStatusRequest() {
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
