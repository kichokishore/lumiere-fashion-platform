package com.example.backend.controller;

import com.example.backend.model.UserLocation;
import com.example.backend.repository.UserLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(originPatterns = "*")
public class LocationController {

    @Autowired
    private UserLocationRepository repository;

    @PostMapping
    public ResponseEntity<String> saveLocation(@RequestBody UserLocation location, @RequestHeader(value = "User-Agent", required = false) String userAgent) {
        if (userAgent != null) {
            location.setUserAgent(userAgent);
        }
        repository.save(location);
        return ResponseEntity.ok("Location saved successfully");
    }

    @GetMapping
    public ResponseEntity<List<UserLocation>> getAllLocations() {
        return ResponseEntity.ok(repository.findAll());
    }
}
