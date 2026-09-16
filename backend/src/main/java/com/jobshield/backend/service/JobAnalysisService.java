package com.jobshield.backend.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

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
    private final MlService mlService;
    private final UrlContentService urlContentService;
    private final UserRepository userRepository;

    public JobAnalysisService(
            AnalysisHistoryRepository analysisHistoryRepository,
            MlService mlService,
            UrlContentService urlContentService,
            UserRepository userRepository) {

        this.analysisHistoryRepository = analysisHistoryRepository;
        this.mlService = mlService;
        this.urlContentService = urlContentService;
        this.userRepository = userRepository;
    }

    public JobAnalysisResponse analyze(
            JobAnalysisRequest request,
            String userEmail) {

        String inputType = request.getInputType();
        String originalContent = request.getContent();

        if (originalContent == null || originalContent.isBlank()) {
            throw new RuntimeException("Job content cannot be empty");
        }

        String content = originalContent.trim();

        // =========================================================
        // URL ANALYSIS
        // =========================================================

        if ("url".equalsIgnoreCase(inputType)) {

            try {
                URI uri = URI.create(content);

                if (!"http".equalsIgnoreCase(uri.getScheme())
                        && !"https".equalsIgnoreCase(uri.getScheme())) {

                    throw new RuntimeException(
                            "Only HTTP and HTTPS URLs are supported.");
                }

                content = urlContentService.extractText(content);

            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid URL.");
            }
        }

        if (content == null || content.isBlank()) {
            throw new RuntimeException(
                    "Unable to extract meaningful content from this URL.");
        }

        String text = content.toLowerCase(Locale.ROOT);

        // =========================================================
        // RULE BASED DETECTION
        // =========================================================

        int ruleScore = 0;

        List<String> reasons = new ArrayList<>();

        // =========================================================
        // PAYMENT / MONEY REQUEST
        // =========================================================

        if (containsAny(text,
                "pay registration fee",
                "registration fee",
                "processing fee",
                "joining fee",
                "joining fees",
                "security deposit",
                "pay upfront",
                "pay first",
                "send money",
                "transfer money",
                "deposit money",
                "pay money",
                "payment required",
                "investment required",
                "invest money")) {

            ruleScore += 30;

            reasons.add(
                    "The job appears to request money or an upfront payment.");
        }

        // =========================================================
        // FINANCIAL INFORMATION
        // =========================================================

        if (containsAny(text,
                "bank account",
                "bank details",
                "account number",
                "credit card",
                "debit card",
                "card details",
                "banking information",
                "upi id",
                "upi details")) {

            ruleScore += 25;

            reasons.add(
                    "The message requests sensitive financial information.");
        }

        // =========================================================
        // IDENTITY DOCUMENTS
        // =========================================================

        if (containsAny(text,
                "aadhaar",
                "aadhar",
                "pan card",
                "passport",
                "driving licence",
                "driving license",
                "identity proof",
                "id proof",
                "government id",
                "social security number")) {

            ruleScore += 25;

            reasons.add(
                    "The job request includes sensitive identity documents.");
        }

        // =========================================================
        // WHATSAPP / TELEGRAM
        // =========================================================

        if (containsAny(text,
                "contact us on whatsapp",
                "contact me on whatsapp",
                "whatsapp me",
                "message me on whatsapp",
                "whatsapp number",
                "contact on telegram",
                "telegram me",
                "message me on telegram")) {

            ruleScore += 15;

            reasons.add(
                    "Recruitment is being pushed through WhatsApp or Telegram.");
        }

        // =========================================================
        // UNREALISTIC EARNING CLAIMS
        // =========================================================

        boolean earningClaim = containsAny(text,
                "guaranteed income",
                "guaranteed salary",
                "guaranteed earnings",
                "make money fast",
                "easy money",
                "earn money from home",
                "make money from home",
                "unlimited income",
                "earn thousands",
                "high income",
                "high earning",
                "weekly earnings",
                "quick money",
                "change your life",
                "financial freedom",
                "financial independence");

        boolean dailyEarningPattern =
                Pattern.compile(
                        "(earn|make)\\s*(up to|over|around)?\\s*[₹$€£]?\\s*\\d+[\\d,]*\\s*(per|a|each)?\\s*(day|daily)",
                        Pattern.CASE_INSENSITIVE)
                .matcher(text)
                .find();

        boolean weeklyEarningPattern =
                Pattern.compile(
                        "(earn|make)\\s*(up to|over|around)?\\s*[₹$€£]?\\s*\\d+[\\d,]*\\s*(per|a|each)?\\s*(week|weekly)",
                        Pattern.CASE_INSENSITIVE)
                .matcher(text)
                .find();

        boolean largeEarningPattern =
                Pattern.compile(
                        "(earn|make)\\s*(up to|over|around)?\\s*[₹$€£]?\\s*\\d{4,}",
                        Pattern.CASE_INSENSITIVE)
                .matcher(text)
                .find();

        if (earningClaim
                || dailyEarningPattern
                || weeklyEarningPattern
                || largeEarningPattern) {

            ruleScore += 25;

            reasons.add(
                    "The job contains unrealistic or unusually high earning claims.");
        }

        // =========================================================
        // URGENCY / PRESSURE
        // =========================================================

        boolean urgency = containsAny(text,
                "limited seats",
                "space is limited",
                "apply immediately",
                "contact immediately",
                "act now",
                "urgent",
                "hurry",
                "limited opportunity",
                "limited openings",
                "respond immediately");

        if (urgency) {

            ruleScore += 10;

            reasons.add(
                    "The message uses urgency or pressure to encourage quick action.");
        }

        // =========================================================
        // MLM / NETWORK MARKETING
        // =========================================================

        boolean networkMarketing =
                containsAny(text,
                        "network marketing",
                        "multi level marketing",
                        "multilevel marketing",
                        "mlm",
                        "business opportunity",
                        "build your own business",
                        "be your own boss",
                        "entrepreneurial opportunity",
                        "direct selling",
                        "direct sales opportunity",
                        "recruit your friends",
                        "recruit friends and family",
                        "friend and family market",
                        "friends and family market",
                        "downline",
                        "team building income",
                        "residual income",
                        "passive income");

        boolean brandPartner =
                containsAny(text,
                        "brand partner",
                        "brand partners",
                        "become a brand partner");

        boolean productPromotion =
                containsAny(text,
                        "promote products",
                        "paid to promote",
                        "promote them",
                        "promote them through",
                        "sell products",
                        "product promotion");

        boolean recruitmentLanguage =
                containsAny(text,
                        "looking for motivated individuals",
                        "looking for motivated people",
                        "motivated and hardworking individuals",
                        "join our team",
                        "join the team",
                        "build a team",
                        "grow your team",
                        "recruit",
                        "recruiting people",
                        "recruiting individuals");

        boolean motivationalLanguage =
                containsAny(text,
                        "change your life",
                        "become successful",
                        "financial freedom",
                        "financial independence",
                        "be your own boss",
                        "work on your own terms",
                        "unlimited potential",
                        "limitless income",
                        "real life business skills",
                        "entrepreneurial skills");

        // =========================================================
        // STRONG BRAND PARTNER COMBINATION
        // =========================================================

        boolean strongBrandPartnerPattern =
                brandPartner
                && (productPromotion
                    || containsAny(text,
                            "friend and family market",
                            "friends and family market",
                            "network marketing"))
                && (recruitmentLanguage || motivationalLanguage);

        if (strongBrandPartnerPattern) {

            ruleScore += 50;

            reasons.add(
                    "The job combines brand-partner/product-promotion language with recruitment or motivational messaging.");
        }

        // =========================================================
        // GENERAL NETWORK MARKETING
        // =========================================================

        if (networkMarketing && !strongBrandPartnerPattern) {

            ruleScore += 25;

            reasons.add(
                    "The message contains network-marketing or recruitment language.");
        }

        // =========================================================
        // MOTIVATIONAL + RECRUITMENT
        // =========================================================

        if (motivationalLanguage
                && recruitmentLanguage
                && !strongBrandPartnerPattern) {

            ruleScore += 20;

            reasons.add(
                    "The message uses motivational/lifestyle-focused recruitment language.");
        }

        // =========================================================
        // WORK FROM HOME + EASY MONEY
        // =========================================================

        boolean workFromHome =
                containsAny(text,
                        "work from home",
                        "work-from-home",
                        "wfh",
                        "home based job",
                        "home-based job");

        boolean easyIncome =
                containsAny(text,
                        "easy money",
                        "easy income",
                        "earn money from home",
                        "make money from home",
                        "quick money",
                        "guaranteed income");

        if (workFromHome && easyIncome) {

            ruleScore += 15;

            reasons.add(
                    "The message combines work-from-home claims with easy or fast income promises.");
        }

        // =========================================================
        // NO EXPERIENCE + IMMEDIATE START + EARNING
        // =========================================================

        boolean noExperience =
                containsAny(text,
                        "no experience required",
                        "no experience needed",
                        "without experience",
                        "no prior experience");

        boolean immediateStart =
                containsAny(text,
                        "start immediately",
                        "immediate start",
                        "start today",
                        "join immediately");

        if (noExperience
                && immediateStart
                && (earningClaim
                    || dailyEarningPattern
                    || weeklyEarningPattern
                    || largeEarningPattern)) {

            ruleScore += 20;

            reasons.add(
                    "The message combines no-experience requirements, immediate joining and earning claims.");
        }

        // =========================================================
        // VAGUE RECRUITMENT / CONTACT
        // =========================================================

        boolean vagueRecruitment =
                containsAny(text,
                        "send your details",
                        "contact me",
                        "reach out to me",
                        "message me",
                        "interested candidates contact",
                        "limited openings");

        if (vagueRecruitment
                && (urgency || recruitmentLanguage)) {

            ruleScore += 10;

            reasons.add(
                    "The recruitment message provides vague contact instructions instead of normal job application details.");
        }

        // =========================================================
        // FUNDS / MONEY COLLECTION
        // =========================================================

        boolean fundsCollection =
                containsAny(text,
                        "collect funds",
                        "collect money",
                        "receive payments",
                        "handle payments",
                        "collect payments",
                        "paypal",
                        "send payments");

        if (fundsCollection
                && containsAny(text,
                        "job",
                        "position",
                        "role",
                        "representative",
                        "assistant")) {

            ruleScore += 25;

            reasons.add(
                    "The job appears to involve collecting or handling funds.");
        }

        // =========================================================
        // SUSPICIOUS LINKS
        // =========================================================

        if (containsAny(text,
                "bit.ly",
                "tinyurl",
                "shorturl",
                "click here to apply",
                "click this link",
                "download this app")) {

            ruleScore += 15;

            reasons.add(
                    "The message contains a potentially suspicious link or application instruction.");
        }

        // =========================================================
        // LIMIT RULE SCORE
        // =========================================================

        ruleScore = Math.min(ruleScore, 100);

        // =========================================================
        // ML PREDICTION
        // =========================================================

        MlPredictionResponse mlResponse;

        try {

            mlResponse = mlService.predict(content);

        } catch (Exception e) {

            throw new RuntimeException(
                    "ML service is unavailable. Please start the ML service.");
        }

        double mlFraudProbability =
                mlResponse.getFraudProbability();

        double mlLegitimateProbability =
                mlResponse.getLegitimateProbability();

        double mlScore =
                mlFraudProbability * 100.0;

        // =========================================================
        // FINAL SCORE
        // =========================================================

        double finalScore =
                (ruleScore * 0.60)
                + (mlScore * 0.40);

        // Strong brand-partner combination
        if (strongBrandPartnerPattern) {

            finalScore += 25;
        }

        // Funds collection + PayPal
        if (fundsCollection
                && containsAny(text,
                        "paypal",
                        "collect funds",
                        "collect money")) {

            finalScore += 15;
        }

        // No experience + immediate start + earnings
        if (noExperience
                && immediateStart
                && (weeklyEarningPattern
                    || dailyEarningPattern
                    || largeEarningPattern)) {

            finalScore += 10;
        }

        finalScore = Math.min(finalScore, 100);

        int riskScore =
                (int) Math.round(finalScore);

        // =========================================================
        // RISK LEVEL
        // =========================================================

        String riskLevel;
        String message;

        if (riskScore >= 60) {

            riskLevel = "HIGH RISK";

            message =
                    "This job contains multiple scam-like warning signs. "
                    + "Proceed with extreme caution and avoid sharing money "
                    + "or sensitive personal information.";

        } else if (riskScore >= 30) {

            riskLevel = "SUSPICIOUS";

            message =
                    "This job contains some suspicious characteristics. "
                    + "Verify the employer and job details before proceeding.";

        } else {

            riskLevel = "LOW RISK";

            message =
                    "No major scam indicators were detected. "
                    + "Still verify the employer independently before accepting the job.";
        }

        // =========================================================
        // ML REASON
        // =========================================================

        if ("FRAUDULENT".equalsIgnoreCase(
                mlResponse.getPrediction())) {

            reasons.add(
                    "The machine-learning model detected patterns associated with fraudulent job postings.");
        }

        // =========================================================
        // SAVE HISTORY
        // =========================================================

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

        AnalysisHistory history =
                new AnalysisHistory(
                        user,
                        originalContent,
                        inputType,
                        riskScore,
                        riskLevel,
                        message
                );

        analysisHistoryRepository.save(history);

        // =========================================================
        // RESPONSE
        // =========================================================

        return new JobAnalysisResponse(
                riskScore,
                riskLevel,
                message,
                reasons,
                mlResponse.getPrediction(),
                mlFraudProbability,
                mlLegitimateProbability
        );
    }

    // =============================================================
    // HELPER METHOD
    // =============================================================

    private boolean containsAny(
            String text,
            String... keywords) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}