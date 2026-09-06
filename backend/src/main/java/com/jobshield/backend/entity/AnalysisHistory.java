package com.jobshield.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "analysis_history")
public class AnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String inputType;

    private Integer riskScore;

    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime createdAt;

    public AnalysisHistory() {
    }

    public AnalysisHistory(
            User user,
            String content,
            String inputType,
            Integer riskScore,
            String riskLevel,
            String message
    ) {
        this.user = user;
        this.content = content;
        this.inputType = inputType;
        this.riskScore = riskScore;
        this.riskLevel = riskLevel;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public String getInputType() {
        return inputType;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}