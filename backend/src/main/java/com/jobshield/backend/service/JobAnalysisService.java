
package com.jobshield.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

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

        int riskScore = 0;

        List<String> reasons = new ArrayList<>();

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

            riskScore += 25;

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

            riskScore += 25;

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

            riskScore += 15;

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

            riskScore += 20;

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

            riskScore += 10;

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

            riskScore += 20;

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

            riskScore += 15;

            reasons.add(
                    "Job contains potentially suspicious links or verification requests."
            );
        }

        // Maximum score = 100
        riskScore = Math.min(riskScore, 100);

        String riskLevel;
        String message;

        if (riskScore >= 60) {

            riskLevel = "HIGH RISK";

            message =
                    "This job posting contains multiple suspicious indicators. "
                    + "Proceed with extreme caution.";

        } else if (riskScore >= 30) {

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

        // Save analysis history
        AnalysisHistory history = new AnalysisHistory(
                user,
                content,
                request.getInputType(),
                riskScore,
                riskLevel,
                message
        );

        analysisHistoryRepository.save(history);

        return new JobAnalysisResponse(
                riskScore,
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