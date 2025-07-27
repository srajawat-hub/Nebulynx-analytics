import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../components/Header';

const CreateAlert = () => {
  const navigate = useNavigate();
  const [supportedAssets, setSupportedAssets] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    asset_symbol: '',
    threshold_price: '',
    condition_type: 'below',
    notification_email: ''
  });

  useEffect(() => {
    fetchSupportedAssets();
  }, []);

  const fetchSupportedAssets = async () => {
    try {
      const response = await axios.get('/api/alerts/supported-assets');
      setSupportedAssets(response.data);
    } catch (error) {
      console.error('Error fetching supported assets:', error);
      toast.error('Failed to load supported assets');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.asset_symbol || !formData.threshold_price || !formData.notification_email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.threshold_price <= 0) {
      toast.error('Threshold price must be greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('/api/alerts', formData);
      toast.success('Alert created successfully!');
      navigate('/alerts');
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error(error.response?.data?.error || 'Failed to create alert');
    } finally {
      setSubmitting(false);
    }
  };

  const getAssetCurrency = (symbol) => {
    return supportedAssets[symbol]?.currency || '';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="modern-min-h-screen modern-bg-gradient">
      <Header />
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          <div className="modern-mb-8">
            <div className="modern-flex" style={{ alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => navigate(-1)}
                className="modern-button modern-button-secondary"
                style={{ padding: '8px 12px' }}
              >
                <FaArrowLeft />
              </button>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#222', margin: 0 }}>
                Create Price Alert
              </h1>
            </div>
          </div>
      <p style={{ fontSize: '16px', color: '#444', marginBottom: '24px' }}>
        Set up a new price alert for any supported asset. You’ll get an email notification when your alert is triggered.
      </p>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Asset *</label>
            <select
              name="asset_symbol"
              value={formData.asset_symbol}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select an asset</option>
              {Object.entries(supportedAssets).map(([symbol, asset]) => (
                <option key={symbol} value={symbol}>
                  {asset.name} ({symbol}) - {asset.currency}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Condition *</label>
            <select
              name="condition_type"
              value={formData.condition_type}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="below">Price goes below</option>
              <option value="above">Price goes above</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Threshold Price ({getAssetCurrency(formData.asset_symbol)}) *
            </label>
            <input
              type="number"
              name="threshold_price"
              value={formData.threshold_price}
              onChange={handleInputChange}
              className="form-input"
              placeholder={`Enter price in ${getAssetCurrency(formData.asset_symbol)}`}
              step="0.01"
              min="0"
              required
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              You will be notified when the price {formData.condition_type} this threshold
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Notification Email *</label>
            <input
              type="email"
              name="notification_email"
              value={formData.notification_email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="your-email@example.com"
              required
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              We'll send you an email when the alert is triggered
            </small>
          </div>

          <div className="flex" style={{ gap: '12px', marginTop: '32px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ flex: 1 }}
            >
              {submitting ? (
                <div className="spinner" style={{ width: '16px', height: '16px', margin: '0 auto' }}></div>
              ) : (
                <>
                  <FaSave style={{ marginRight: '8px' }} />
                  Create Alert
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/alerts')}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Example Alerts */}
      <div className="card" style={{ maxWidth: '600px', margin: '20px auto 0' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Example Alerts
        </h3>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{
            padding: '16px',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            background: '#f8f9fa'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              Gold Price Alert
            </h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
              Notify me when Gold price goes below ₹100,000 per 10 grams
            </p>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Asset: Gold (GOLD) | Condition: Below ₹100,000
            </div>
          </div>

          <div style={{
            padding: '16px',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            background: '#f8f9fa'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              Bitcoin Price Alert
            </h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
              Notify me when Bitcoin price goes above $50,000
            </p>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Asset: Bitcoin (BTC) | Condition: Above $50,000
            </div>
          </div>

          <div style={{
            padding: '16px',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            background: '#f8f9fa'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
              Ethereum Price Alert
            </h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
              Notify me when Ethereum price goes below $3,000
            </p>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Asset: Ethereum (ETH) | Condition: Below $3,000
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAlert; 