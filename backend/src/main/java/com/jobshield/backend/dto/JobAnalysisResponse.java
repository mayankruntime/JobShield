package com.jobshield.backend.dto;

import java.util.List;

public class JobAnalysisResponse {

    private int riskScore;
    private String riskLevel;
    private String message;
    private List<String> reasons;

    private String mlPrediction;
    private double mlFraudProbability;
    private double mlLegitimateProbability;

    public JobAnalysisResponse(
            int riskScore,
            String riskLevel,
            String message,
            List<String> reasons,
            String mlPrediction,
            double mlFraudProbability,
            double mlLegitimateProbability
    ) {
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.message = message;
        this.reasons = reasons;
        this.mlPrediction = mlPrediction;
        this.mlFraudProbability = mlFraudProbability;
        this.mlLegitimateProbability = mlLegitimateProbability;
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

    public String getMlPrediction() {
        return mlPrediction;
    }

    public double getMlFraudProbability() {
        return mlFraudProbability;
    }

    public double getMlLegitimateProbability() {
        return mlLegitimateProbability;
    }
}