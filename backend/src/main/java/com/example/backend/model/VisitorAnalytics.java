package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_analytics")
public class VisitorAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Location & Network
    private String ipAddress;
    private String city;
    private String region;
    private String country;
    private String networkProvider;

    // Device & Browser
    private String browser;
    private String os;
    private String deviceType;
    private String screenResolution;
    private String language;
    private String timezone;

    // Activity
    @Column(columnDefinition = "TEXT")
    private String referrerUrl;
    
    @Column(columnDefinition = "TEXT")
    private String userAgent;
    
    private String sessionToken;
    private Integer pageClicks = 0;
    
    private LocalDateTime timestamp;

    public VisitorAnalytics() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getNetworkProvider() { return networkProvider; }
    public void setNetworkProvider(String networkProvider) { this.networkProvider = networkProvider; }
    
    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }
    
    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }
    
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    
    public String getScreenResolution() { return screenResolution; }
    public void setScreenResolution(String screenResolution) { this.screenResolution = screenResolution; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    
    public String getReferrerUrl() { return referrerUrl; }
    public void setReferrerUrl(String referrerUrl) { this.referrerUrl = referrerUrl; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
    
    public Integer getPageClicks() { return pageClicks; }
    public void setPageClicks(Integer pageClicks) { this.pageClicks = pageClicks; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
