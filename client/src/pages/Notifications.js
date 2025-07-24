import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaTrash, FaChartBar, FaChartLine, FaBell } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

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
                
                <Link to="/alerts" className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-xl modern-bg-white-70 modern-border-white-20 hover:modern-bg-white-90 modern-transition" style={{ textDecoration: 'none' }}>
                  <FaBell className="modern-text-orange-600" size={16} />
                  <span className="modern-text-gray-700 modern-font-medium">Alerts</span>
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
              <div className="modern-icon-bg modern-w-10 modern-h-10 modern-gradient-bg-green">
                <FaEye className="modern-text-white" style={{ fontSize: '1.25rem' }} />
              </div>
              <div>
                <h2 className="modern-text-xl modern-font-bold modern-text-gray-900">Notifications</h2>
                <p className="modern-text-sm modern-text-gray-500">View and manage your alerts</p>
              </div>
            </div>

            {/* Cleanup Button */}
            <button
              onClick={cleanupNotifications}
              className="modern-button modern-button-secondary"
            >
              <FaTrash style={{ marginRight: '0.5rem' }} />
              Cleanup Old
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          <div className="modern-mb-6">
            <p className="modern-text-gray-600 modern-text-lg">
              View and manage your recent price notifications. Clean up old notifications to keep your dashboard tidy.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="modern-grid modern-grid-3 modern-mb-8">
            <div className="modern-stats-card">
              <div className="modern-relative modern-z-10">
                <div className="modern-flex modern-justify-between modern-mb-4">
                  <div className="modern-icon-bg">
                    <FaChartBar style={{ fontSize: '1.5rem' }} />
                  </div>
                  <div className="modern-text-right">
                    <div className="modern-text-3xl modern-font-bold modern-text-gray-900">
                      {stats.total_notifications || 0}
                    </div>
                    <div className="modern-text-sm modern-text-gray-500">Total Notifications</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modern-stats-card">
              <div className="modern-relative modern-z-10">
                <div className="modern-flex modern-justify-between modern-mb-4">
                  <div className="modern-icon-bg">
                    <FaBell style={{ fontSize: '1.5rem' }} />
                  </div>
                  <div className="modern-text-right">
                    <div className="modern-text-3xl modern-font-bold modern-text-gray-900">
                      {stats.today_notifications || 0}
                    </div>
                    <div className="modern-text-sm modern-text-gray-500">Today</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modern-stats-card">
              <div className="modern-relative modern-z-10">
                <div className="modern-flex modern-justify-between modern-mb-4">
                  <div className="modern-icon-bg">
                    <FaEye style={{ fontSize: '1.5rem' }} />
                  </div>
                  <div className="modern-text-right">
                    <div className="modern-text-3xl modern-font-bold modern-text-gray-900">
                      {stats.this_week_notifications || 0}
                    </div>
                    <div className="modern-text-sm modern-text-gray-500">This Week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="modern-card">
            <div className="modern-flex modern-justify-between modern-mb-6">
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
                  <div key={notification.id} className="modern-bg-gradient-gray modern-rounded-xl modern-p-4 modern-border-gray-200">
                    <div className="modern-flex modern-justify-between modern-mb-2">
                      <div className="modern-flex modern-items-center modern-space-x-3">
                        <div className="modern-icon-bg modern-w-8 modern-h-8 modern-gradient-bg-blue">
                          <FaBell className="modern-text-white" size={12} />
                        </div>
                        <div>
                          <h4 className="modern-font-semibold modern-text-gray-900">
                            {notification.asset_name} ({notification.asset_symbol})
                          </h4>
                          <p className="modern-text-sm modern-text-gray-600">
                            Price {notification.condition_type === 'above' ? 'rose above' : 'fell below'} {formatPrice(notification.threshold_price, notification.currency)}
                          </p>
                        </div>
                      </div>
                      <div className="modern-text-right">
                        <div className="modern-text-sm modern-text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </div>
                        <div className="modern-text-xs modern-text-gray-400">
                          {new Date(notification.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="modern-text-sm modern-text-gray-600">
                      <p><strong>Current Price:</strong> {formatPrice(notification.current_price, notification.currency)}</p>
                      <p><strong>Alert Email:</strong> {notification.notification_email}</p>
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