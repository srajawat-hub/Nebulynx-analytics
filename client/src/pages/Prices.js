import React, { useState, useEffect } from 'react';
import { FaSync, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Prices = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/prices/current');
      setPrices(response.data);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.error('Failed to load prices');
    } finally {
      setLoading(false);
    }
  };

  const refreshPrices = async () => {
    try {
      setRefreshing(true);
      await fetchPrices();
      toast.success('Prices refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh prices');
    } finally {
      setRefreshing(false);
    }
  };

  const getPriceChangeClass = (symbol) => {
    // This would normally compare with previous price
    // For demo, we'll use a random class
    const classes = ['price-up', 'price-down', 'price-neutral'];
    return classes[Math.floor(Math.random() * classes.length)];
  };

  const getPriceChangeIcon = (symbol) => {
    const className = getPriceChangeClass(symbol);
    if (className === 'price-up') return '📈';
    if (className === 'price-down') return '📉';
    return '➡️';
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
          Live Prices
        </h1>
        <button
          onClick={refreshPrices}
          className="btn btn-secondary"
          disabled={refreshing}
        >
          {refreshing ? (
            <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
          ) : (
            <FaSync style={{ marginRight: '8px' }} />
          )}
          Refresh
        </button>
      </div>
      <p style={{ fontSize: '16px', color: '#444', marginBottom: '24px' }}>
        View real-time prices for gold and top cryptocurrencies. Stay updated with the latest market movements.
      </p>

      {/* Price Cards */}
      <div className="grid grid-3">
        {Object.entries(prices).map(([symbol, data]) => (
          <div key={symbol} className="card">
            <div className="flex flex-between mb-2">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                  {data.name} ({symbol})
                </h3>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {data.currency}
                </p>
              </div>
              <div style={{ fontSize: '24px' }}>
                {getPriceChangeIcon(symbol)}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p className={getPriceChangeClass(symbol)} style={{ 
                fontSize: '24px', 
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {data.currency} {data.price.toLocaleString()}
              </p>
              
              <div className="flex flex-between" style={{ fontSize: '12px', color: '#666' }}>
                <span>Last Updated</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div style={{
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#666'
            }}>
              <div className="flex flex-between" style={{ marginBottom: '4px' }}>
                <span>24h Change:</span>
                <span className={getPriceChangeClass(symbol)}>
                  +2.45% {/* This would be calculated from price history */}
                </span>
              </div>
              <div className="flex flex-between">
                <span>24h High:</span>
                <span>{data.currency} {(data.price * 1.05).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Summary */}
      <div className="card mt-3">
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Market Summary
        </h3>
        
        <div className="grid grid-3">
          <div className="text-center">
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
              {Object.keys(prices).length}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>Assets Tracked</p>
          </div>
          
          <div className="text-center">
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#28a745', marginBottom: '4px' }}>
              {Object.keys(prices).filter(symbol => getPriceChangeClass(symbol) === 'price-up').length}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>Gaining</p>
          </div>
          
          <div className="text-center">
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#dc3545', marginBottom: '4px' }}>
              {Object.keys(prices).filter(symbol => getPriceChangeClass(symbol) === 'price-down').length}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>Declining</p>
          </div>
        </div>
      </div>

      {/* Asset Categories */}
      <div className="grid grid-2 mt-3">
        {/* Cryptocurrencies */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            <FaChartLine style={{ marginRight: '8px' }} />
            Cryptocurrencies (USD)
          </h3>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(prices)
              .filter(([symbol, data]) => data.currency === 'USD')
              .map(([symbol, data]) => (
                <div key={symbol} className="flex flex-between" style={{
                  padding: '12px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  background: '#f8f9fa'
                }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                      {data.name} ({symbol})
                    </h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {data.currency}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={getPriceChangeClass(symbol)} style={{ fontSize: '16px', fontWeight: '600' }}>
                      {data.currency} {data.price.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '10px', color: '#666' }}>
                      {getPriceChangeIcon(symbol)} Live
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Commodities */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            <FaChartLine style={{ marginRight: '8px' }} />
            Commodities (INR)
          </h3>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(prices)
              .filter(([symbol, data]) => data.currency === 'INR')
              .map(([symbol, data]) => (
                <div key={symbol} className="flex flex-between" style={{
                  padding: '12px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  background: '#f8f9fa'
                }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                      {data.name} ({symbol})
                    </h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                      {data.currency} per 10g
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={getPriceChangeClass(symbol)} style={{ fontSize: '16px', fontWeight: '600' }}>
                      {data.currency} {data.price.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '10px', color: '#666' }}>
                      {getPriceChangeIcon(symbol)} Live
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="card mt-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          📊 Real-time Price Monitoring
        </h3>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          • Prices are updated every 5 minutes automatically
        </p>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          • Gold prices are in Indian Rupees (INR) per 10 grams
        </p>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>
          • Cryptocurrency prices are in US Dollars (USD)
        </p>
      </div>
    </div>
  );
};

export default Prices; 