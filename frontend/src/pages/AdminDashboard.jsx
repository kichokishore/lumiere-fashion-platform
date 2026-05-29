import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('visitor'); // 'visitor' or 'location'
  
  const [locations, setLocations] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://lumiere-fashion-server.onrender.com';
      const apiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
      
      // Fetch both simultaneously
      const [locRes, analyticsRes] = await Promise.all([
        fetch(`${apiUrl}/api/locations`),
        fetch(`${apiUrl}/api/analytics`)
      ]);
      
      if (locRes.ok) setLocations(await locRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const getDeviceData = () => {
    const counts = analytics.reduce((acc, curr) => {
      acc[curr.deviceType || 'Unknown'] = (acc[curr.deviceType || 'Unknown'] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  };

  const getCountryData = () => {
    const counts = analytics.reduce((acc, curr) => {
      acc[curr.country || 'Unknown'] = (acc[curr.country || 'Unknown'] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="admin-dashboard container">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <div className="tab-controls">
          <button 
            className={`btn ${activeTab === 'visitor' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('visitor')}
          >
            Visitor Analytics
          </button>
          <button 
            className={`btn ${activeTab === 'location' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('location')}
          >
            Location Analytics
          </button>
          <button className="btn btn-accent" onClick={fetchData}>Refresh Data</button>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="spinner-wrapper"><div className="spinner-dark"></div></div>
        ) : (
          <>
            {/* VISITOR ANALYTICS TAB */}
            {activeTab === 'visitor' && (
              <>
                <div className="charts-grid">
                  <div className="card chart-card">
                    <h3>Device Distribution</h3>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={getDeviceData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {getDeviceData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="card chart-card">
                    <h3>Visitors by Country</h3>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getCountryData()}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="card table-card">
                  <h3>Recent Visitors</h3>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>IP Address</th>
                          <th>Location</th>
                          <th>Device & OS</th>
                          <th>Browser</th>
                          <th>Referrer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.length === 0 ? (
                          <tr><td colSpan="6" className="empty-state">No visitor data collected yet.</td></tr>
                        ) : (
                          analytics.map(item => (
                            <tr key={item.id}>
                              <td>{new Date(item.timestamp).toLocaleString()}</td>
                              <td>{item.ipAddress || 'N/A'}</td>
                              <td>{item.city ? `${item.city}, ${item.country}` : 'N/A'}</td>
                              <td>{item.deviceType} - {item.os}</td>
                              <td>{item.browser}</td>
                              <td className="truncate" title={item.referrerUrl}>{item.referrerUrl || 'Direct'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* LOCATION ANALYTICS TAB */}
            {activeTab === 'location' && (
              <>
                <div className="card map-card">
                  <h3>Geographic Distribution</h3>
                  <div className="map-placeholder glass-panel">
                    <p>Google Maps Integration Requires API Key.</p>
                    <p>Displaying {locations.length} data points visually.</p>
                  </div>
                </div>

                <div className="card table-card">
                  <h3>GPS Location Data</h3>
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
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
