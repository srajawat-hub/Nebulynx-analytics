import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaChartBar } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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
          Notifications
        </h1>
        <button
          onClick={cleanupNotifications}
          className="btn btn-secondary"
        >
          <FaTrash style={{ marginRight: '8px' }} />
          Cleanup Old
        </button>
      </div>
      <p style={{ fontSize: '16px', color: '#444', marginBottom: '24px' }}>
        View and manage your recent price notifications. Clean up old notifications to keep your dashboard tidy.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card">
          <div className="flex flex-between">
            <div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Total Notifications
              </h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#333' }}>
                {stats.total_notifications || 0}
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
              <FaEye size={20} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-between">
            <div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Success Rate
              </h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#28a745' }}>
                {stats.success_rate || 0}%
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
              <FaChartBar size={20} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex flex-between">
            <div>
              <h3 style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Unique Assets
              </h3>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107' }}>
                {stats.unique_assets || 0}
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
              <FaChartBar size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Recent Notifications
        </h2>
        
        {notifications.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 20px', color: '#666' }}>
            <FaEye size={64} style={{ marginBottom: '24px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
              No Notifications Yet
            </h3>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              Notifications will appear here when your price alerts are triggered
            </p>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>
              Create some alerts to start receiving notifications
            </p>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex flex-between"
                style={{
                  padding: '20px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="flex flex-between" style={{ marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                      {notification.asset_name} Alert Triggered
                    </h4>
                    <span className={`badge ${notification.status === 'sent' ? 'badge-success' : 'badge-danger'}`}>
                      {notification.status}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    <strong>Current Price:</strong> {notification.currency} {notification.current_price.toLocaleString()} | 
                    <strong> Threshold:</strong> {notification.currency} {notification.threshold_price.toLocaleString()} | 
                    <strong> Condition:</strong> {notification.condition_type.toUpperCase()}
                  </p>
                  
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    <span>Sent: {new Date(notification.sent_at).toLocaleString()}</span>
                    {notification.user_name && (
                      <span style={{ marginLeft: '16px' }}>
                        User: {notification.user_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Stats */}
      {stats.total_notifications > 0 && (
        <div className="card mt-3">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Notification Statistics (Last 7 Days)
          </h3>
          
          <div className="grid grid-3">
            <div className="text-center">
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#28a745', marginBottom: '4px' }}>
                {stats.successful_notifications || 0}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>Successful</p>
            </div>
            
            <div className="text-center">
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545', marginBottom: '4px' }}>
                {stats.failed_notifications || 0}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>Failed</p>
            </div>
            
            <div className="text-center">
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#667eea', marginBottom: '4px' }}>
                {stats.unique_users || 0}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>Users Notified</p>
            </div>
          </div>
          
          {stats.first_notification && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
              <div className="flex flex-between" style={{ fontSize: '14px', color: '#666' }}>
                <span>First notification: {new Date(stats.first_notification).toLocaleString()}</span>
                <span>Last notification: {new Date(stats.last_notification).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="card mt-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          📧 Notification System
        </h3>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          • Notifications are sent via email when price alerts are triggered
        </p>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          • Each notification includes current price, threshold, and condition details
        </p>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          • Failed notifications are logged and can be retried
        </p>
      </div>
    </div>
  );
};

export default Notifications; 