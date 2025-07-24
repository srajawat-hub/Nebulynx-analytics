import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaGlobe, FaFileAlt, FaGithub, FaTwitter, FaReddit, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const Asset = () => {
  const { symbol } = useParams();
  const [assetDetails, setAssetDetails] = useState(null);
  const [priceHistory, setPriceHistory] = useState({});
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');

  useEffect(() => {
    fetchAssetData();
  }, [symbol]);

  useEffect(() => {
    if (selectedPeriod) {
      fetchPriceHistory(selectedPeriod);
    }
  }, [selectedPeriod, symbol]);

  const fetchAssetData = async () => {
    try {
      setLoading(true);
      const [detailsRes, priceRes] = await Promise.all([
        axios.get(`/api/assets/${symbol}`),
        axios.get(`/api/prices/current/${symbol}`)
      ]);

      setAssetDetails(detailsRes.data);
      setCurrentPrice(priceRes.data);
    } catch (error) {
      console.error('Error fetching asset data:', error);
      toast.error('Failed to load asset data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceHistory = async (period) => {
    try {
      const response = await axios.get(`/api/assets/${symbol}/price-history?period=${period}`);
      setPriceHistory(response.data);
    } catch (error) {
      console.error('Error fetching price history:', error);
      toast.error('Failed to load price history');
    }
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatChartData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      const date = new Date(item.timestamp);
      let timeLabel;
      
      // Format based on selected period
      if (selectedPeriod === '24h') {
        timeLabel = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (selectedPeriod === '7d') {
        timeLabel = date.toLocaleDateString('en-US', {
          weekday: 'short',
          hour: '2-digit'
        });
      } else if (selectedPeriod === '1m') {
        timeLabel = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      } else if (selectedPeriod === '3m') {
        timeLabel = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
      
      return {
        time: timeLabel,
        price: parseFloat(item.price),
        timestamp: date.getTime(),
        fullDate: date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    });
  };

  const getPriceChangeClass = () => {
    // This would normally compare with previous price
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

  if (!assetDetails) {
    return (
      <div className="text-center" style={{ padding: '40px 20px' }}>
        <h2>Asset not found</h2>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  const chartData = formatChartData(priceHistory.data);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-between mb-3">
        <div>
          <Link to="/" className="btn btn-secondary" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center' }}>
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#222', marginBottom: '8px' }}>
            {assetDetails.asset_name} ({symbol})
          </h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            {assetDetails.description}
          </p>
        </div>
        
        {currentPrice && (
          <div className="text-right">
            <p className={getPriceChangeClass()} style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
              {currentPrice.currency} {currentPrice.price.toLocaleString()}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Live Price
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-2">
        {/* Asset Information */}
        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Asset Information
          </h2>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="flex flex-between">
              <span style={{ color: '#666' }}>Market Cap:</span>
              <span style={{ fontWeight: '600' }}>
                {formatNumber(assetDetails.market_cap)}
              </span>
            </div>
            
            <div className="flex flex-between">
              <span style={{ color: '#666' }}>24h Volume:</span>
              <span style={{ fontWeight: '600' }}>
                {formatNumber(assetDetails.volume_24h)}
              </span>
            </div>
            
            <div className="flex flex-between">
              <span style={{ color: '#666' }}>Circulating Supply:</span>
              <span style={{ fontWeight: '600' }}>
                {assetDetails.circulating_supply ? 
                  `${assetDetails.circulating_supply.toLocaleString()} ${symbol}` : 'N/A'}
              </span>
            </div>
            
            <div className="flex flex-between">
              <span style={{ color: '#666' }}>Total Supply:</span>
              <span style={{ fontWeight: '600' }}>
                {assetDetails.total_supply ? 
                  `${assetDetails.total_supply.toLocaleString()} ${symbol}` : 'N/A'}
              </span>
            </div>
            
            <div className="flex flex-between">
              <span style={{ color: '#666' }}>Max Supply:</span>
              <span style={{ fontWeight: '600' }}>
                {assetDetails.max_supply ? 
                  `${assetDetails.max_supply.toLocaleString()} ${symbol}` : 'N/A'}
              </span>
            </div>
            
            <div className="flex flex-between">
              <span style={{ color: '#666' }}>Launch Date:</span>
              <span style={{ fontWeight: '600' }}>
                {formatDate(assetDetails.launch_date)}
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Links & Resources
          </h2>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {assetDetails.website && (
              <a 
                href={assetDetails.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FaGlobe style={{ marginRight: '8px' }} />
                Official Website
              </a>
            )}
            
            {assetDetails.whitepaper && (
              <a 
                href={assetDetails.whitepaper} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FaFileAlt style={{ marginRight: '8px' }} />
                Whitepaper
              </a>
            )}
            
            {assetDetails.github && (
              <a 
                href={assetDetails.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FaGithub style={{ marginRight: '8px' }} />
                GitHub
              </a>
            )}
            
            {assetDetails.twitter && (
              <a 
                href={assetDetails.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FaTwitter style={{ marginRight: '8px' }} />
                Twitter
              </a>
            )}
            
            {assetDetails.reddit && (
              <a 
                href={assetDetails.reddit} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FaReddit style={{ marginRight: '8px' }} />
                Reddit
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="card mt-3">
        <div className="flex flex-between mb-3">
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
            <FaChartLine style={{ marginRight: '8px' }} />
            Price History
          </h2>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {['24h', '7d', '1m', '3m'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`btn ${selectedPeriod === period ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px', padding: '8px 12px' }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ height: '400px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${currentPrice?.currency || 'USD'} ${value.toLocaleString()}`,
                    'Price'
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0] && payload[0].payload.fullDate) {
                      return payload[0].payload.fullDate;
                    }
                    return `Time: ${label}`;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#667eea" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#667eea' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center" style={{ padding: '40px 20px', color: '#666' }}>
              <FaChartLine size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No price data available for the selected period</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="card mt-3">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          Actions
        </h2>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/alerts/create" className="btn btn-primary">
            Create Alert for {symbol}
          </Link>
          <Link to="/prices" className="btn btn-secondary">
            View All Prices
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Asset; 