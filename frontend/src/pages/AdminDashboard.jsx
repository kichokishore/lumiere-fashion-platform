import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://lumiere-fashion-server.onrender.com';
      const response = await fetch(`${apiUrl}/api/locations`);
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard container">
      <div className="dashboard-header">
        <h2>Location Analytics Dashboard</h2>
        <button className="btn btn-primary" onClick={fetchLocations}>Refresh Data</button>
      </div>

      <div className="dashboard-content">
        <div className="card map-card">
          <h3>Geographic Distribution</h3>
          <div className="map-placeholder glass-panel">
            {/* Real implementation would require Google Maps API Key and @react-google-maps/api */}
            <p>Google Maps Integration Requires API Key.</p>
            <p>Displaying {locations.length} data points visually.</p>
          </div>
        </div>

        <div className="card table-card">
          <h3>Recent Collected Data</h3>
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner-dark"></div></div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Timestamp</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Device/Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.length === 0 ? (
                    <tr><td colSpan="5" className="empty-state">No location data collected yet.</td></tr>
                  ) : (
                    locations.map(loc => (
                      <tr key={loc.id}>
                        <td>{loc.id}</td>
                        <td>{new Date(loc.timestamp).toLocaleString()}</td>
                        <td>{loc.latitude?.toFixed(4)}</td>
                        <td>{loc.longitude?.toFixed(4)}</td>
                        <td className="truncate" title={loc.userAgent}>{loc.userAgent || 'Unknown'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
