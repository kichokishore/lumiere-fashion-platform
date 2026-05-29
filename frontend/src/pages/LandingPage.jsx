import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Midnight Silk Dress', price: '$120', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Urban Trench Coat', price: '$250', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Cashmere Knit Sweater', price: '$180', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Classic Leather Tote', price: '$150', image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const LandingPage = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('');

  useEffect(() => {
    // Show consent modal a short time after loading
    const timer = setTimeout(() => {
      setShowConsent(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAllowLocation = () => {
    setShowConsent(false);
    setLoadingLocation(true);
    setDeliveryStatus('Checking nearby delivery availability...');

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Hardcoding the exact backend URL to ensure it works instantly
            const rawApiUrl = import.meta.env.VITE_API_URL || 'https://lumiere-fashion-server.onrender.com';
            const apiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
            const response = await fetch(`${apiUrl}/api/locations`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ latitude, longitude })
            });
            if (response.ok) {
              setDeliveryStatus('Good news! Express delivery is available in your area.');
            } else {
              setDeliveryStatus('Standard delivery available.');
            }
          } catch (error) {
            console.error("Failed to save location", error);
            setDeliveryStatus('Standard delivery available.');
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoadingLocation(false);
          setDeliveryStatus('Location access denied. Standard delivery applies.');
        }
      );
    } else {
      setLoadingLocation(false);
      setDeliveryStatus('Geolocation not supported by your browser.');
    }
  };

  const handleDenyLocation = () => {
    setShowConsent(false);
    setDeliveryStatus('Location access denied. Standard delivery applies.');
  };

  return (
    <div className="landing-page">
      {showConsent && (
        <div className="consent-overlay">
          <div className="consent-modal glass-panel">
            <h3>Find Nearby Availability</h3>
            <p>We'd like to use your location to provide accurate delivery times, local store offers, and faster service. We value your privacy.</p>
            <div className="consent-actions">
              <button className="btn" onClick={handleDenyLocation}>Not Now</button>
              <button className="btn btn-primary" onClick={handleAllowLocation}>Allow Location</button>
            </div>
          </div>
        </div>
      )}

      {loadingLocation && (
        <div className="loading-bar">
          <div className="spinner"></div>
          <span>Checking nearby delivery availability...</span>
        </div>
      )}

      {deliveryStatus && !loadingLocation && (
        <div className="delivery-status">
          {deliveryStatus}
        </div>
      )}

      <section className="hero">
        <div className="hero-content">
          <h1>Define Your Style</h1>
          <p>Discover the latest trends in our premium collection.</p>
          <button className="btn btn-primary btn-large">Shop the Collection</button>
        </div>
      </section>

      <section className="container products-section">
        <h2 className="section-title">New Arrivals</h2>
        <div className="product-grid">
          {MOCK_PRODUCTS.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} loading="lazy" />
                <div className="product-overlay">
                  <button className="btn btn-accent">Quick Add</button>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
