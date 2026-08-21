package com.jobshield.backend.dto;

public class JobAnalysisRequest {

    private String inputType;
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