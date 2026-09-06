package com.jobshield.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobshield.backend.entity.AnalysisHistory;
import com.jobshield.backend.entity.User;

public interface AnalysisHistoryRepository
        extends JpaRepository<AnalysisHistory, Long> {

    List<AnalysisHistory> findByUserOrderByCreatedAtDesc(User user);
}
