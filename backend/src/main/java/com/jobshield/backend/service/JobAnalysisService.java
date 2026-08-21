package com.jobshield.backend.service;

import org.springframework.stereotype.Service;

import com.jobshield.backend.dto.JobAnalysisRequest;
import com.jobshield.backend.dto.JobAnalysisResponse;

@Service
public class JobAnalysisService {

    public JobAnalysisResponse analyzeJob(JobAnalysisRequest request) {

        return new JobAnalysisResponse(
                0,
                "PENDING",
                "Analysis request received successfully"
        );
    }
}
