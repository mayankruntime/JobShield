package com.jobshield.backend.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.jobshield.backend.dto.MlPredictionRequest;
import com.jobshield.backend.dto.MlPredictionResponse;

@Service
public class MlService {

    private final RestClient restClient;

    public MlService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://127.0.0.1:8000")
                .build();
    }

    public MlPredictionResponse predict(String text) {

        MlPredictionRequest request =
                new MlPredictionRequest(text);

        return restClient.post()
                .uri("/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(MlPredictionResponse.class);
    }
}