import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaBell, FaBellSlash, FaChartLine, FaEye } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const toggleAlertStatus = async (alertId, currentStatus) => {
    try {
      await axios.put(`/api/alerts/${alertId}`, {
        is_active: !currentStatus
      });
      toast.success(`Alert ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
      toast.error('Failed to update alert status');
    }
  };

  const deleteAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) {
      return;
    }

    try {
      setDeleting(alertId);
      await axios.delete(`/api/alerts/${alertId}`);
      toast.success('Alert deleted successfully');
      fetchAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    } finally {
      setDeleting(null);
    }
  };

  const formatPrice = (price, currency) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  if (loading) {
    return (
      <div className="modern-loading">
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div className="modern-min-h-screen modern-bg-gradient">
      {/* Main Header - Logo and Navigation */}
      <div className="modern-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="modern-flex modern-flex-between modern-p-4">
            {/* Left Side - Logo */}
            <div className="modern-flex modern-items-center modern-space-x-3">
              <div className="modern-icon-bg modern-w-10 modern-h-10 modern-gradient-bg-blue">
                <FaChartLine className="modern-text-white" style={{ fontSize: '1.25rem' }} />
              </div>
              <div>
                <h1 className="modern-text-xl modern-font-bold modern-text-gradient">
                  Nebulynx Research
                </h1>
              </div>
            </div>

            {/* Right Side - Navigation and Live Indicator */}
            <div className="modern-flex modern-items-center modern-space-x-4">
              {/* Navigation Links */}
              <div className="modern-flex modern-items-center modern-space-x-4">
                <Link to="/" className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-xl modern-bg-white-70 modern-border-white-20 hover:modern-bg-white-90 modern-transition" style={{ textDecoration: 'none' }}>
                  <FaChartLine className="modern-text-blue-600" size={16} />
                  <span className="modern-text-gray-700 modern-font-medium">Dashboard</span>
                </Link>
                
                <Link to="/prices" className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-xl modern-bg-white-70 modern-border-white-20 hover:modern-bg-white-90 modern-transition" style={{ textDecoration: 'none' }}>
                  <FaChartLine className="modern-text-green-600" size={16} />
                  <span className="modern-text-gray-700 modern-font-medium">Prices</span>
                </Link>
                
                <Link to="/notifications" className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-xl modern-bg-white-70 modern-border-white-20 hover:modern-bg-white-90 modern-transition" style={{ textDecoration: 'none' }}>
                  <FaEye className="modern-text-green-600" size={16} />
                  <span className="modern-text-gray-700 modern-font-medium">Notifications</span>
                </Link>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Page Section - Title and Actions */}
      <div className="modern-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="modern-flex modern-flex-between modern-p-4">
            {/* Page Title */}
            <div className="modern-flex modern-items-center modern-space-x-3">
              <div className="modern-icon-bg modern-w-10 modern-h-10 modern-gradient-bg-orange">
                <FaBell className="modern-text-white" style={{ fontSize: '1.25rem' }} />
              </div>
              <div>
                <h2 className="modern-text-xl modern-font-bold modern-text-gray-900">Price Alerts</h2>
                <p className="modern-text-sm modern-text-gray-500">Monitor and manage your alerts</p>
              </div>
            </div>

            {/* Create Alert Button */}
            <button
              onClick={() => navigate('/alerts/create')}
              className="modern-button"
            >
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Create Alert
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          <div className="modern-mb-6">
            <p className="modern-text-gray-600 modern-text-lg">
              Create and manage alerts for your favorite assets. Get notified instantly when prices hit your chosen thresholds.
            </p>
          </div>

          {alerts.length === 0 ? (
            <div className="modern-card modern-text-center" style={{ padding: '4rem 2rem' }}>
              <FaBell size={64} style={{ marginBottom: '1.5rem', opacity: 0.5, color: '#9ca3af' }} />
              <h2 className="modern-text-2xl modern-font-semibold modern-mb-4 modern-text-gray-900">
                No Alerts Yet
              </h2>
              <p className="modern-text-gray-600 modern-mb-8 modern-text-lg">
                Create your first price alert to start monitoring your favorite assets
              </p>
              <button
                onClick={() => navigate('/alerts/create')}
                className="modern-button"
              >
                <FaPlus style={{ marginRight: '0.5rem' }} />
                Create Your First Alert
              </button>
            </div>
          ) : (
            <div className="modern-grid modern-grid-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="modern-card">
                  <div className="modern-flex modern-justify-between modern-items-start modern-mb-4">
                    <div>
                      <h3 className="modern-text-xl modern-font-bold modern-text-gray-900 modern-mb-2">
                        {alert.asset_name} ({alert.asset_symbol})
                      </h3>
                      <div className="modern-flex modern-items-center modern-space-x-4 modern-text-sm modern-text-gray-600">
                        <span>
                          {alert.condition_type === 'above' ? 'Price above' : 'Price below'} {formatPrice(alert.threshold_price, alert.currency)}
                        </span>
                        <span className={`modern-badge ${alert.is_active ? 'modern-badge-success' : 'modern-badge-warning'}`}>
                          {alert.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="modern-flex modern-space-x-2">
                      <button
                        onClick={() => toggleAlertStatus(alert.id, alert.is_active)}
                        className={`modern-button ${alert.is_active ? 'modern-button-secondary' : 'modern-button'}`}
                        style={{ padding: '0.5rem', minWidth: 'auto' }}
                      >
                        {alert.is_active ? <FaBellSlash size={14} /> : <FaBell size={14} />}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        disabled={deleting === alert.id}
                        className="modern-button modern-button-red"
                        style={{ padding: '0.5rem', minWidth: 'auto' }}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="modern-text-sm modern-text-gray-600 modern-mb-4">
                    <p><strong>Email:</strong> {alert.notification_email}</p>
                    <p><strong>Created:</strong> {new Date(alert.created_at).toLocaleDateString()}</p>
                  </div>

                  {alert.last_triggered && (
                    <div className="modern-text-sm modern-text-gray-500">
                      <p><strong>Last triggered:</strong> {new Date(alert.last_triggered).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts; 