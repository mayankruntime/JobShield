package com.jobshield.backend.dto;

public class MlPredictionResponse {

    private String prediction;
    private double decisionScore;

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public double getDecisionScore() {
        return decisionScore;
    }

    public void setDecisionScore(double decisionScore) {
        this.decisionScore = decisionScore;
    }
}