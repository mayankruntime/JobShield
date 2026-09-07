package com.jobshield.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.jobshield.backend.dto.MlPredictionResponse;
import com.jobshield.backend.service.MlService;

@RestController
@RequestMapping("/api/ml")
public class MlController {

    private final MlService mlService;

    public MlController(MlService mlService) {
        this.mlService = mlService;
    }

    @PostMapping("/predict")
    public MlPredictionResponse predict(@RequestBody String text) {

        return mlService.predict(text);
    }
}
