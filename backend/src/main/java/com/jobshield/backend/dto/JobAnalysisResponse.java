package com.jobshield.backend.dto;

import java.util.List;

public class JobAnalysisResponse {

    private int riskScore;
    private String riskLevel;
    private String message;
    private List<String> reasons;

    public JobAnalysisResponse(
            int riskScore,
            String riskLevel,
            String message,
            List<String> reasons
    ) {
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.message = message;
        this.reasons = reasons;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getReasons() {
        return reasons;
    }
}