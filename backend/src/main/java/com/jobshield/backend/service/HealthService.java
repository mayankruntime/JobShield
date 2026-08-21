package com.jobshield.backend.service;

import org.springframework.stereotype.Service;

import com.jobshield.backend.dto.HealthResponse;

@Service
public class HealthService {

    public HealthResponse getHealthStatus() {

        return new HealthResponse(
                "UP",
                "JobShield Backend",
                "JobShield Backend is running successfully"
        );
    }
}
