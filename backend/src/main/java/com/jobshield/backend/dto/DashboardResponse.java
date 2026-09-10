package com.jobshield.backend.dto;

public class DashboardResponse {

    private long totalAnalyses;
    private long highRisk;
    private long suspicious;
    private long lowRisk;

    public DashboardResponse(
            long totalAnalyses,
            long highRisk,
            long suspicious,
            long lowRisk
    ) {
        this.totalAnalyses = totalAnalyses;
        this.highRisk = highRisk;
        this.suspicious = suspicious;
        this.lowRisk = lowRisk;
    }

    public long getTotalAnalyses() {
        return totalAnalyses;
    }

    public long getHighRisk() {
        return highRisk;
    }

    public long getSuspicious() {
        return suspicious;
    }

    public long getLowRisk() {
        return lowRisk;
    }
}
