
package com.jobshield.backend.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobshield.backend.dto.JobAnalysisRequest;
import com.jobshield.backend.dto.JobAnalysisResponse;
import com.jobshield.backend.entity.AnalysisHistory;
import com.jobshield.backend.entity.User;
import com.jobshield.backend.repository.AnalysisHistoryRepository;
import com.jobshield.backend.repository.UserRepository;
import com.jobshield.backend.service.JobAnalysisService;

@RestController
@RequestMapping("/api")
public class JobAnalysisController {

    private final JobAnalysisService jobAnalysisService;
    private final AnalysisHistoryRepository analysisHistoryRepository;
    private final UserRepository userRepository;

    public JobAnalysisController(
            JobAnalysisService jobAnalysisService,
            AnalysisHistoryRepository analysisHistoryRepository,
            UserRepository userRepository
    ) {
        this.jobAnalysisService = jobAnalysisService;
        this.analysisHistoryRepository = analysisHistoryRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/analyze")
    public JobAnalysisResponse analyzeJob(
            @RequestBody JobAnalysisRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        return jobAnalysisService.analyzeJob(request, email);
    }

    @GetMapping("/analysis/history")
    public List<AnalysisHistory> getAnalysisHistory(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return analysisHistoryRepository
                .findByUserOrderByCreatedAtDesc(user);
    }
}

