
package com.jobshield.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;

import com.jobshield.backend.dto.JobAnalysisRequest;
import com.jobshield.backend.dto.JobAnalysisResponse;
import com.jobshield.backend.dto.MlPredictionResponse;
import com.jobshield.backend.entity.AnalysisHistory;
import com.jobshield.backend.entity.User;
import com.jobshield.backend.repository.AnalysisHistoryRepository;
import com.jobshield.backend.repository.UserRepository;

@Service
public class JobAnalysisService {

    private final AnalysisHistoryRepository analysisHistoryRepository;
    private final UserRepository userRepository;
    private final MlService mlService;

    public JobAnalysisService(
            AnalysisHistoryRepository analysisHistoryRepository,
            UserRepository userRepository,
            MlService mlService
    ) {
        this.analysisHistoryRepository = analysisHistoryRepository;
        this.userRepository = userRepository;
        this.mlService = mlService;
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

        String content = request.getContent();

        if (content == null || content.trim().isEmpty()) {

            List<String> reasons = new ArrayList<>();

            reasons.add("Job description is empty.");

            return new JobAnalysisResponse(
                    0,
                    "UNKNOWN",
                    "Please provide a job description for analysis.",
                    reasons
            );
        }

        String text = content.toLowerCase(Locale.ROOT);

        int ruleScore = 0;

        List<String> reasons = new ArrayList<>();

        // ==============================
        // RULE-BASED DETECTION
        // ==============================

        // 1. Registration / processing / joining fee
        if (containsAny(text,
                "registration fee",
                "processing fee",
                "joining fee",
                "pay fee",
                "pay a fee",
                "security deposit",
                "deposit money",
                "pay money")) {

            ruleScore += 25;

            reasons.add(
                    "Job asks for registration, processing, joining fee or money deposit."
            );
        }

        // 2. Bank / UPI / financial information
        if (containsAny(text,
                "bank account",
                "bank details",
                "credit card",
                "debit card",
                "upi",
                "upi id",
                "account number",
                "atm pin",
                "card number")) {

            ruleScore += 25;

            reasons.add(
                    "Job asks for sensitive financial or payment information."
            );
        }

        // 3. WhatsApp / Telegram communication
        if (containsAny(text,
                "whatsapp",
                "telegram",
                "contact me on whatsapp",
                "message me on telegram")) {

            ruleScore += 15;

            reasons.add(
                    "Recruiter asks to communicate through WhatsApp or Telegram."
            );
        }

        // 4. Unrealistic salary
        if (containsAny(text,
                "earn ₹1 lakh",
                "earn rs 1 lakh",
                "earn 1 lakh",
                "earn $10000",
                "earn $10,000",
                "guaranteed income",
                "guaranteed salary",
                "make money fast",
                "easy money",
                "earn money from home")) {

            ruleScore += 20;

            reasons.add(
                    "Job contains potentially unrealistic or guaranteed earning claims."
            );
        }

        // 5. Urgency / pressure
        if (containsAny(text,
                "act now",
                "apply immediately",
                "limited seats",
                "limited vacancies",
                "urgent hiring",
                "urgent requirement",
                "hurry",
                "apply today",
                "immediate joining")) {

            ruleScore += 10;

            reasons.add(
                    "Job uses urgency or pressure to encourage immediate action."
            );
        }

        // 6. Personal documents
        if (containsAny(text,
                "send your aadhaar",
                "send aadhaar",
                "aadhar card",
                "pan card",
                "passport",
                "send your id",
                "identity proof",
                "government id")) {

            ruleScore += 20;

            reasons.add(
                    "Job requests sensitive personal identity documents."
            );
        }

        // 7. Suspicious links
        if (containsAny(text,
                "bit.ly",
                "tinyurl",
                "click this link",
                "click here to register",
                "verify your account")) {

            ruleScore += 15;

            reasons.add(
                    "Job contains potentially suspicious links or verification requests."
            );
        }

        ruleScore = Math.min(ruleScore, 100);

        // ==============================
        // ML MODEL PREDICTION
        // ==============================

        MlPredictionResponse mlResult = mlService.predict(content);

        String mlPrediction = mlResult.getPrediction();
        double mlDecisionScore = mlResult.getDecisionScore();

        // ==============================
        // COMBINE RULE + ML
        // ==============================

        int mlScore = 0;

        if ("FRAUDULENT".equalsIgnoreCase(mlPrediction)) {
            mlScore = 60;

            reasons.add(
                    "Machine learning model detected patterns similar to fraudulent job postings."
            );
        }

        /*
         * Rule score gets 60% weight.
         * ML score gets 40% weight.
         */
        int finalRiskScore =
                (int) Math.round(
                        (ruleScore * 0.60) +
                        (mlScore * 0.40)
                );

        finalRiskScore = Math.min(finalRiskScore, 100);

        // ==============================
        // FINAL RISK LEVEL
        // ==============================

        String riskLevel;
        String message;

        if (finalRiskScore >= 60) {

            riskLevel = "HIGH RISK";

            message =
                    "This job posting contains multiple suspicious indicators. "
                    + "Proceed with extreme caution.";

        } else if (finalRiskScore >= 30) {

            riskLevel = "SUSPICIOUS";

            message =
                    "This job posting contains some suspicious indicators. "
                    + "Verify the recruiter and company before proceeding.";

        } else {

            riskLevel = "LOW RISK";

            message =
                    "No major scam indicators were detected in this job posting. "
                    + "Still verify the employer before sharing personal information.";
        }

        // ==============================
        // SAVE ANALYSIS HISTORY
        // ==============================

        AnalysisHistory history = new AnalysisHistory(
                user,
                content,
                request.getInputType(),
                finalRiskScore,
                riskLevel,
                message
        );

        analysisHistoryRepository.save(history);

        // ==============================
        // RETURN RESULT
        // ==============================

        return new JobAnalysisResponse(
                finalRiskScore,
                riskLevel,
                message,
                reasons
        );
    }

    private boolean containsAny(
            String text,
            String... keywords
    ) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}