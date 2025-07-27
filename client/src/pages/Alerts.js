import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaBell, FaBellSlash, FaChartLine, FaEye } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../components/Header';

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
      <div className="modern-min-h-screen modern-bg-gradient">
        <Header />
        <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="modern-p-6">
            <div className="modern-flex modern-items-center modern-justify-center" style={{ height: '50vh' }}>
              <div className="modern-spinner"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-min-h-screen modern-bg-gradient">
      <Header />

      {/* Main Content */}
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          {/* Page Header */}
          <div className="modern-mb-8">
            <div className="modern-flex modern-justify-between modern-items-center modern-mb-6">
              <div>
                <h1 className="modern-text-3xl modern-font-bold modern-text-gray-900 modern-mb-2">
                  Price Alerts
                </h1>
                <p className="modern-text-gray-600 modern-text-lg">
                  Monitor and manage your price alerts
                </p>
              </div>
              <button
                onClick={() => navigate('/alerts/create')}
                className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-3 modern-rounded-xl modern-bg-blue-600 modern-text-white hover:modern-bg-blue-700 modern-transition-colors modern-font-semibold"
                style={{ textDecoration: 'none' }}
              >
                <FaPlus size={16} />
                <span>Create Alert</span>
              </button>
            </div>
          </div>

          {alerts.length === 0 ? (
            <div className="modern-card modern-text-center" style={{ 
              padding: '4rem 2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <FaBell size={64} style={{ marginBottom: '1.5rem', opacity: 0.5, color: '#9ca3af' }} />
              <h2 className="modern-text-2xl modern-font-semibold modern-mb-4 modern-text-gray-900">
                No Alerts Yet
              </h2>
              <p className="modern-text-gray-600 modern-mb-8 modern-text-lg">
                Create your first price alert to start monitoring your favorite assets
              </p>
              <button
                onClick={() => navigate('/alerts/create')}
                className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-3 modern-rounded-xl modern-bg-blue-600 modern-text-white hover:modern-bg-blue-700 modern-transition-colors modern-font-semibold"
              >
                <FaPlus size={16} />
                <span>Create Your First Alert</span>
              </button>
            </div>
          ) : (
            <div className="modern-grid" style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '1.5rem'
            }}>
              {alerts.map((alert) => (
                <div key={alert.id} className="modern-card" style={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Alert Header */}
                  <div className="modern-flex modern-justify-between modern-items-start modern-mb-4">
                    <div className="modern-flex-1">
                      <h3 className="modern-text-xl modern-font-bold modern-text-gray-900 modern-mb-1">
                        {alert.asset_name} ({alert.asset_symbol})
                      </h3>
                      <p className="modern-text-gray-600 modern-text-sm">
                        {alert.condition_type === 'above' ? 'Price above' : 'Price below'} {formatPrice(alert.threshold_price, alert.currency)}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`modern-px-3 modern-py-1 modern-rounded-full modern-text-xs modern-font-semibold ${
                      alert.is_active 
                        ? 'modern-bg-green-100 modern-text-green-800' 
                        : 'modern-bg-gray-100 modern-text-gray-600'
                    }`}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  {/* Alert Details */}
                  <div className="modern-space-y-2 modern-mb-4">
                    <div className="modern-text-sm modern-text-gray-600">
                      <span className="modern-font-medium">Email:</span> {alert.notification_email}
                    </div>
                    <div className="modern-text-sm modern-text-gray-600">
                      <span className="modern-font-medium">Created:</span> {new Date(alert.created_at).toLocaleDateString()}
                    </div>
                    {alert.last_triggered && (
                      <div className="modern-text-sm modern-text-gray-600">
                        <span className="modern-font-medium">Last triggered:</span> {new Date(alert.last_triggered).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="modern-flex modern-space-x-2">
                    <button
                      onClick={() => toggleAlertStatus(alert.id, alert.is_active)}
                      className={`modern-flex-1 modern-flex modern-items-center modern-justify-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-lg modern-text-sm modern-font-medium modern-transition-colors ${
                        alert.is_active
                          ? 'modern-bg-gray-100 modern-text-gray-700 hover:modern-bg-gray-200'
                          : 'modern-bg-blue-100 modern-text-blue-700 hover:modern-bg-blue-200'
                      }`}
                    >
                      {alert.is_active ? (
                        <>
                          <FaBellSlash size={14} />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <FaBell size={14} />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      disabled={deleting === alert.id}
                      className="modern-flex modern-items-center modern-justify-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-lg modern-bg-red-100 modern-text-red-700 hover:modern-bg-red-200 modern-transition-colors modern-text-sm modern-font-medium disabled:modern-opacity-50"
                    >
                      <FaTrash size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
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