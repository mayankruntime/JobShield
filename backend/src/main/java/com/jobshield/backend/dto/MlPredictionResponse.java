package com.jobshield.backend.dto;

public class MlPredictionResponse {

    private String prediction;
    private double fraudProbability;
    private double legitimateProbability;

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public double getFraudProbability() {
        return fraudProbability;
    }

    public void setFraudProbability(double fraudProbability) {
        this.fraudProbability = fraudProbability;
    }

    public double getLegitimateProbability() {
        return legitimateProbability;
    }

    public void setLegitimateProbability(double legitimateProbability) {
        this.legitimateProbability = legitimateProbability;
    }
}