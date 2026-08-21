package com.jobshield.backend.dto;

public class HealthResponse {

    private String status;
    private String service;
    private String message;

    public HealthResponse(String status, String service, String message) {
        this.status = status;
        this.service = service;
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public String getService() {
        return service;
    }

    public String getMessage() {
        return message;
    }
}