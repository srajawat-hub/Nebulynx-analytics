import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBell, FaBellSlash } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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
          Price Alerts
        </h1>
        <Link to="/alerts/create" className="btn btn-primary">
          <FaPlus style={{ marginRight: '8px' }} />
          Create Alert
        </Link>
      </div>
      <p style={{ fontSize: '16px', color: '#444', marginBottom: '24px' }}>
        Create and manage alerts for your favorite assets. Get notified instantly when prices hit your chosen thresholds.
      </p>

      {alerts.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <FaBell size={64} style={{ marginBottom: '24px', opacity: 0.5, color: '#666' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
            No Alerts Yet
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            Create your first price alert to start monitoring your favorite assets
          </p>
          <Link to="/alerts/create" className="btn btn-primary">
            <FaPlus style={{ marginRight: '8px' }} />
            Create Your First Alert
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="card">
              <div className="flex flex-between mb-2">
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {alert.asset_name} ({alert.asset_symbol})
                  </h3>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {alert.notification_email}
                  </p>
                </div>
                <span className={`badge ${alert.is_active ? 'badge-success' : 'badge-warning'}`}>
                  {alert.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div className="flex flex-between" style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Condition:</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {alert.condition_type === 'above' ? 'Above' : 'Below'} {alert.currency} {alert.threshold_price.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex flex-between" style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>Created:</span>
                  <span style={{ fontSize: '14px' }}>
                    {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                </div>

                {alert.last_triggered && (
                  <div className="flex flex-between">
                    <span style={{ fontSize: '14px', color: '#666' }}>Last Triggered:</span>
                    <span style={{ fontSize: '14px' }}>
                      {new Date(alert.last_triggered).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex" style={{ gap: '8px' }}>
                <button
                  onClick={() => toggleAlertStatus(alert.id, alert.is_active)}
                  className={`btn ${alert.is_active ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1, fontSize: '12px' }}
                >
                  {alert.is_active ? (
                    <>
                      <FaBellSlash style={{ marginRight: '4px' }} />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <FaBell style={{ marginRight: '4px' }} />
                      Activate
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="btn btn-danger"
                  disabled={deleting === alert.id}
                  style={{ fontSize: '12px' }}
                >
                  {deleting === alert.id ? (
                    <div className="spinner" style={{ width: '12px', height: '12px' }}></div>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {alerts.length > 0 && (
        <div className="card mt-3">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Alert Summary
          </h3>
          
          <div className="grid grid-3">
            <div className="text-center">
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                {alerts.length}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>Total Alerts</p>
            </div>
            
            <div className="text-center">
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#28a745', marginBottom: '4px' }}>
                {alerts.filter(alert => alert.is_active).length}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>Active Alerts</p>
            </div>
            
            <div className="text-center">
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#ffc107', marginBottom: '4px' }}>
                {alerts.filter(alert => !alert.is_active).length}
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>Inactive Alerts</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts; 