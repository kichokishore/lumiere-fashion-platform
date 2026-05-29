import { useEffect, useRef } from 'react';

// Generates a simple unique session token
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Gets or creates a session token for the current visit
const getSessionToken = () => {
  let token = sessionStorage.getItem('visitor_session_token');
  if (!token) {
    token = generateSessionToken();
    sessionStorage.setItem('visitor_session_token', token);
  }
  return token;
};

// Simple OS detection from user agent
const getOS = (userAgent) => {
  if (userAgent.indexOf("Win") !== -1) return "Windows";
  if (userAgent.indexOf("Mac") !== -1) return "MacOS";
  if (userAgent.indexOf("X11") !== -1) return "UNIX";
  if (userAgent.indexOf("Linux") !== -1) return "Linux";
  if (userAgent.indexOf("Android") !== -1) return "Android";
  if (userAgent.indexOf("like Mac") !== -1) return "iOS";
  return "Unknown OS";
};

// Simple Browser detection
const getBrowser = (userAgent) => {
  if (userAgent.indexOf("Chrome") !== -1) return "Chrome";
  if (userAgent.indexOf("Safari") !== -1) return "Safari";
  if (userAgent.indexOf("Firefox") !== -1) return "Firefox";
  if (userAgent.indexOf("Edge") !== -1) return "Edge";
  if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1) return "Internet Explorer";
  return "Unknown Browser";
};

// Detect device type based on screen width
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return "Mobile";
  if (width < 1024) return "Tablet";
  return "Desktop";
};

export const useTracking = () => {
  const trackedRef = useRef(false);
  const clickCountRef = useRef(0);

  useEffect(() => {
    // Only track once per page load to prevent duplicate entries in React StrictMode
    if (trackedRef.current) return;
    trackedRef.current = true;

    const trackVisitor = async () => {
      try {
        // Collect standard browser information safely
        const nav = window.navigator;
        const userAgent = nav.userAgent;
        const os = getOS(userAgent);
        const browser = getBrowser(userAgent);
        const deviceType = getDeviceType();
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const language = nav.language || nav.userLanguage;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const referrerUrl = document.referrer || "Direct";
        const sessionToken = getSessionToken();

        // Object to hold data before sending
        let analyticsData = {
          os,
          browser,
          deviceType,
          screenResolution,
          language,
          timezone,
          referrerUrl,
          userAgent,
          sessionToken,
          pageClicks: 0
        };

        // Fetch IP and Approximate Location safely using ipapi.co
        // This does not require GPS permissions and is perfectly standard
        try {
          const ipResponse = await fetch('https://ipapi.co/json/');
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            analyticsData.ipAddress = ipData.ip;
            analyticsData.city = ipData.city;
            analyticsData.region = ipData.region;
            analyticsData.country = ipData.country_name;
            analyticsData.networkProvider = ipData.org;
          }
        } catch (ipError) {
          console.warn("Could not fetch IP location data", ipError);
          // If adblocker blocks ipapi, we still send the rest of the data
        }

        // Send data to our Spring Boot Backend Analytics Endpoint
        const apiUrl = import.meta.env.VITE_API_URL || 'https://lumiere-fashion-server.onrender.com';
        await fetch(`${apiUrl}/api/analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(analyticsData)
        });

      } catch (error) {
        console.error("Error sending analytics tracking data", error);
      }
    };

    trackVisitor();

    // Setup global click listener to count clicks (Simple Activity Tracking)
    const handleClick = () => {
      clickCountRef.current += 1;
      // In a more complex setup, you could periodically send click updates to the server.
      // For this implementation, we log initial visit, but keep clickCount in memory.
      // (You could easily extend this to send an update on page exit/unload)
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};
