package com.example.backend.repository;

import com.example.backend.model.VisitorAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorAnalyticsRepository extends JpaRepository<VisitorAnalytics, Long> {
}
