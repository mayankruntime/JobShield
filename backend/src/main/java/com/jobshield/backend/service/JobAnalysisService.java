
package com.jobshield.backend.service;

import org.springframework.stereotype.Service;

import com.jobshield.backend.dto.JobAnalysisRequest;
import com.jobshield.backend.dto.JobAnalysisResponse;
import com.jobshield.backend.entity.AnalysisHistory;
import com.jobshield.backend.entity.User;
import com.jobshield.backend.repository.AnalysisHistoryRepository;
import com.jobshield.backend.repository.UserRepository;

@Service
public class JobAnalysisService {

    private final AnalysisHistoryRepository analysisHistoryRepository;
    private final UserRepository userRepository;

    public JobAnalysisService(
            AnalysisHistoryRepository analysisHistoryRepository,
            UserRepository userRepository
    ) {
        this.analysisHistoryRepository = analysisHistoryRepository;
        this.userRepository = userRepository;
    }

    public JobAnalysisResponse analyzeJob(
            JobAnalysisRequest request,
            String email
    ) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        int riskScore = 0;
        String riskLevel = "PENDING";
        String message = "Analysis request received successfully";

        AnalysisHistory history = new AnalysisHistory(
                user,
                request.getContent(),
                request.getInputType(),
                riskScore,
                riskLevel,
                message
        );

        analysisHistoryRepository.save(history);

        return new JobAnalysisResponse(
                riskScore,
                riskLevel,
                message
        );
    }
}

