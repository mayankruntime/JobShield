package com.jobshield.backend.service;

import org.springframework.stereotype.Service;

import com.jobshield.backend.dto.DashboardResponse;
import com.jobshield.backend.entity.User;
import com.jobshield.backend.repository.AnalysisHistoryRepository;
import com.jobshield.backend.repository.UserRepository;

@Service
public class DashboardService {

    private final AnalysisHistoryRepository analysisHistoryRepository;
    private final UserRepository userRepository;

    public DashboardService(
            AnalysisHistoryRepository analysisHistoryRepository,
            UserRepository userRepository
    ) {
        this.analysisHistoryRepository = analysisHistoryRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        long total = analysisHistoryRepository.countByUser(user);

        long highRisk =
                analysisHistoryRepository
                        .countByUserAndRiskLevel(user, "HIGH RISK");

        long suspicious =
                analysisHistoryRepository
                        .countByUserAndRiskLevel(user, "SUSPICIOUS");

        long lowRisk =
                analysisHistoryRepository
                        .countByUserAndRiskLevel(user, "LOW RISK");

        return new DashboardResponse(
                total,
                highRisk,
                suspicious,
                lowRisk
        );
    }
}
