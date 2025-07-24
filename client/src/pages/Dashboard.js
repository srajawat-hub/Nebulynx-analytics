import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaBell, FaEye, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pricesRes, alertsRes, notificationsRes] = await Promise.all([
        axios.get('/api/prices/current'),
        axios.get('/api/alerts'),
        axios.get('/api/notifications?limit=5')
      ]);

      setPrices(pricesRes.data);
      setAlerts(alertsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getPriceChangeClass = (symbol) => {
    // This would normally compare with previous price
    // For demo, we'll use a random class
    const classes = ['price-up', 'price-down', 'price-neutral'];
    return classes[Math.floor(Math.random() * classes.length)];
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-between mb-3">
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#222', marginBottom: '0' }}>
          Dashboard
        </h1>
        <Link to="/alerts/create" className="btn btn-primary">
          <FaPlus style={{ marginRight: '8px' }} />
          Create Alert
        </Link>
      </div>
      <p style={{ fontSize: '16px', color: '#444', marginBottom: '24px' }}>
        Welcome to Nebulynx Research! Track real-time prices for gold and top cryptocurrencies, set custom alerts, and receive instant notifications. Explore your dashboard below.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card dashboard-card" role="button" tabIndex={0} onClick={() => navigate('/alerts')} onKeyPress={e => { if (e.key === 'Enter') navigate('/alerts'); }} style={{ cursor: 'pointer' }}>
          <div className="flex flex-between">
            <div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Active Alerts
              </h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#333' }}>
                {alerts.filter(alert => alert.is_active).length}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <FaBell size={20} />
            </div>
          </div>
        </div>

        <div className="card dashboard-card" role="button" tabIndex={0} onClick={() => navigate('/prices')} onKeyPress={e => { if (e.key === 'Enter') navigate('/prices'); }} style={{ cursor: 'pointer' }}>
          <div className="flex flex-between">
            <div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Assets Monitored
              </h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#333' }}>
                {Object.keys(prices).length}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <FaChartLine size={20} />
            </div>
          </div>
        </div>

        <div className="card dashboard-card" role="button" tabIndex={0} onClick={() => navigate('/notifications')} onKeyPress={e => { if (e.key === 'Enter') navigate('/notifications'); }} style={{ cursor: 'pointer' }}>
          <div className="flex flex-between">
            <div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Recent Notifications
              </h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#333' }}>
                {notifications.length}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <FaEye size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Current Prices */}
        <div className="card">
          <div className="flex flex-between mb-2">
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Current Prices</h2>
            <Link to="/prices" className="btn btn-secondary" style={{ fontSize: '12px' }}>
              View All
            </Link>
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Object.entries(prices).map(([symbol, data]) => (
              <div
                key={symbol}
                className="flex flex-between"
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    <Link 
                      to={`/asset/${symbol}`} 
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onMouseEnter={(e) => e.target.style.color = '#667eea'}
                      onMouseLeave={(e) => e.target.style.color = 'inherit'}
                    >
                      {data.name} ({symbol})
                    </Link>
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {data.currency}
                  </p>
                </div>
                <div className="text-right">
                  <p className={getPriceChangeClass(symbol)} style={{ fontSize: '18px', fontWeight: '700' }}>
                    {data.currency} {data.price.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Live
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="card">
          <div className="flex flex-between mb-2">
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Alerts</h2>
            <Link to="/alerts" className="btn btn-secondary" style={{ fontSize: '12px' }}>
              View All
            </Link>
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex flex-between"
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {alert.asset_name} ({alert.asset_symbol})
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {alert.condition_type} {alert.currency} {alert.threshold_price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`badge ${alert.is_active ? 'badge-success' : 'badge-warning'}`}>
                    {alert.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center" style={{ padding: '40px 20px', color: '#666' }}>
                <FaBell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>No alerts created yet</p>
                <Link to="/alerts/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                  Create Your First Alert
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="card">
        <div className="flex flex-between mb-2">
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Recent Notifications</h2>
          <Link to="/notifications" className="btn btn-secondary" style={{ fontSize: '12px' }}>
            View All
          </Link>
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex flex-between"
              style={{
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  {notification.asset_name} Alert Triggered
                </h4>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Price: {notification.currency} {notification.current_price.toLocaleString()} | 
                  Threshold: {notification.currency} {notification.threshold_price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className={`badge ${notification.status === 'sent' ? 'badge-success' : 'badge-danger'}`}>
                  {notification.status}
                </span>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {new Date(notification.sent_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="text-center" style={{ padding: '40px 20px', color: '#666' }}>
              <FaEye size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No notifications yet</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Create alerts to start receiving notifications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 