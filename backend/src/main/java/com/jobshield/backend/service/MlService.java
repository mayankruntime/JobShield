package com.jobshield.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.jobshield.backend.dto.MlPredictionRequest;
import com.jobshield.backend.dto.MlPredictionResponse;

@Service
public class MlService {

    private final RestClient restClient;

    public MlService(
            @Value("${ml.service.url}") String mlServiceUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(mlServiceUrl)
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