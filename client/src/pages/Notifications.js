import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaChartBar, FaChartLine, FaBell } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../components/Header';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications?limit=50');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/notifications/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    }
  };

  const cleanupNotifications = async () => {
    if (!window.confirm('Are you sure you want to delete notifications older than 90 days?')) {
      return;
    }

    try {
      await axios.delete('/api/notifications/cleanup?days=90');
      toast.success('Old notifications cleaned up successfully');
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      toast.error('Failed to cleanup notifications');
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
                  Notifications
                </h1>
                <p className="modern-text-gray-600 modern-text-lg">
                  View and manage your price alert notifications
                </p>
              </div>
              <button
                onClick={cleanupNotifications}
                className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-3 modern-rounded-xl modern-bg-gray-100 modern-text-gray-700 hover:modern-bg-gray-200 modern-transition-colors modern-font-semibold"
              >
                <FaTrash size={16} />
                <span>Cleanup Old</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="modern-grid modern-mb-8" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="modern-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="modern-flex modern-justify-between modern-items-center">
                <div>
                  <div className="modern-text-3xl modern-font-bold modern-text-gray-900">
                    {stats.total_notifications || 0}
                  </div>
                  <div className="modern-text-sm modern-text-gray-600">Total Notifications</div>
                </div>
                <div className="modern-w-12 modern-h-12 modern-bg-blue-100 modern-rounded-lg modern-flex modern-items-center modern-justify-center">
                  <FaChartBar className="modern-text-blue-600" size={20} />
                </div>
              </div>
            </div>

            <div className="modern-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="modern-flex modern-justify-between modern-items-center">
                <div>
                  <div className="modern-text-3xl modern-font-bold modern-text-gray-900">
                    {stats.today_notifications || 0}
                  </div>
                  <div className="modern-text-sm modern-text-gray-600">Today</div>
                </div>
                <div className="modern-w-12 modern-h-12 modern-bg-green-100 modern-rounded-lg modern-flex modern-items-center modern-justify-center">
                  <FaBell className="modern-text-green-600" size={20} />
                </div>
              </div>
            </div>

            <div className="modern-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="modern-flex modern-justify-between modern-items-center">
                <div>
                  <div className="modern-text-3xl modern-font-bold modern-text-gray-900">
                    {stats.this_week_notifications || 0}
                  </div>
                  <div className="modern-text-sm modern-text-gray-600">This Week</div>
                </div>
                <div className="modern-w-12 modern-h-12 modern-bg-purple-100 modern-rounded-lg modern-flex modern-items-center modern-justify-center">
                  <FaEye className="modern-text-purple-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="modern-card" style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="modern-flex modern-justify-between modern-items-center modern-mb-6">
              <h2 className="modern-text-xl modern-font-bold modern-text-gray-900">Recent Notifications</h2>
              <div className="modern-text-sm modern-text-gray-500">
                Showing {notifications.length} notifications
              </div>
            </div>

            {notifications.length === 0 ? (
              <div className="modern-text-center modern-p-8">
                <FaEye size={64} style={{ marginBottom: '1.5rem', opacity: 0.5, color: '#9ca3af' }} />
                <h3 className="modern-text-xl modern-font-semibold modern-mb-2 modern-text-gray-900">
                  No Notifications
                </h3>
                <p className="modern-text-gray-600">
                  You'll see notifications here when your price alerts are triggered.
                </p>
              </div>
            ) : (
              <div className="modern-space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="modern-bg-gray-50 modern-rounded-xl modern-p-4 modern-border modern-border-gray-200 hover:modern-bg-gray-100 modern-transition-colors">
                    <div className="modern-flex modern-justify-between modern-items-start modern-mb-3">
                      <div className="modern-flex modern-items-start modern-space-x-3">
                        <div className="modern-w-10 modern-h-10 modern-bg-blue-100 modern-rounded-lg modern-flex modern-items-center modern-justify-center modern-mt-1">
                          <FaBell className="modern-text-blue-600" size={16} />
                        </div>
                        <div className="modern-flex-1">
                          <h4 className="modern-font-semibold modern-text-gray-900 modern-mb-1">
                            {notification.asset_name} ({notification.asset_symbol})
                          </h4>
                          <p className="modern-text-sm modern-text-gray-600 modern-mb-2">
                            Price {notification.condition_type === 'above' ? 'rose above' : 'fell below'} {formatPrice(notification.threshold_price, notification.currency)}
                          </p>
                          <div className="modern-text-sm modern-text-gray-500">
                            <span className="modern-font-medium">Current Price:</span> {formatPrice(notification.current_price, notification.currency)}
                          </div>
                        </div>
                      </div>
                      <div className="modern-text-right modern-text-sm modern-text-gray-500">
                        <div>{new Date(notification.created_at).toLocaleDateString()}</div>
                        <div className="modern-text-xs">{new Date(notification.created_at).toLocaleTimeString()}</div>
                      </div>
                    </div>
                    
                    <div className="modern-text-sm modern-text-gray-600 modern-mt-3 modern-pt-3 modern-border-t modern-border-gray-200">
                      <span className="modern-font-medium">Alert Email:</span> {notification.notification_email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 