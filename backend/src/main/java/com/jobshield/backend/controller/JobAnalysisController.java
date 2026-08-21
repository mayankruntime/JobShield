package com.jobshield.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobshield.backend.dto.JobAnalysisRequest;
import com.jobshield.backend.dto.JobAnalysisResponse;
import com.jobshield.backend.service.JobAnalysisService;

@RestController
@RequestMapping("/api")
public class JobAnalysisController {

    private final JobAnalysisService jobAnalysisService;

    public JobAnalysisController(
            JobAnalysisService jobAnalysisService
    ) {
        this.jobAnalysisService = jobAnalysisService;
    }

    @PostMapping("/analyze")
    public JobAnalysisResponse analyzeJob(
            @RequestBody JobAnalysisRequest request
    ) {

        return jobAnalysisService.analyzeJob(request);
    }
}
