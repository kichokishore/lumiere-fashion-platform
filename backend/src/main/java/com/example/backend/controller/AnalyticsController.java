package com.example.backend.controller;

import com.example.backend.model.VisitorAnalytics;
import com.example.backend.repository.VisitorAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private VisitorAnalyticsRepository repository;

    @PostMapping
    public ResponseEntity<String> saveAnalytics(@RequestBody VisitorAnalytics analytics) {
        if (analytics.getTimestamp() == null) {
            analytics.setTimestamp(LocalDateTime.now());
        }
        repository.save(analytics);
        return ResponseEntity.ok("Analytics saved successfully");
    }

    @GetMapping
    public ResponseEntity<List<VisitorAnalytics>> getAllAnalytics() {
        return ResponseEntity.ok(repository.findAll());
    }
}
