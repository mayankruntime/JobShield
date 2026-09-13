package com.jobshield.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JobAnalysisRequest {

    @NotBlank(message = "Input type is required")
    private String inputType;

    @NotBlank(message = "Job content is required")
    @Size(max = 15000, message = "Job content must not exceed 15000 characters")
    private String content;

    public JobAnalysisRequest() {
    }

    public String getInputType() {
        return inputType;
    }

    public void setInputType(String inputType) {
        this.inputType = inputType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}