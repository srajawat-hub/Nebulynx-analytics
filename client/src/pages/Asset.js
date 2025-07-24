import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaGlobe, FaFileAlt, FaGithub, FaTwitter, FaReddit, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';
import CoinLogo from '../components/CoinLogo';

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
      if (error.response?.status === 404) {
        toast.error(`Asset ${symbol} not found. Please check the symbol.`);
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.error || 'Invalid asset symbol');
      } else {
        toast.error('Failed to load asset data. Please try again.');
      }
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
      // Handle different timestamp formats
      let date;
      if (typeof item.timestamp === 'string') {
        // Try to parse different timestamp formats
        if (item.timestamp.includes('T')) {
          // ISO format: "2025-07-23T00:00:00.000Z"
          date = new Date(item.timestamp);
        } else {
          // Custom format: "2025-07-24 15:03:00"
          date = new Date(item.timestamp.replace(' ', 'T') + 'Z');
        }
      } else {
        date = new Date(item.timestamp);
      }
      
      // Validate date
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', item.timestamp);
        return null;
      }
      
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
        time: date.getTime(), // Use timestamp for X-axis
        timeLabel: timeLabel, // Keep formatted label for reference
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
    }).filter(item => item !== null); // Remove invalid items
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
      <div style={{ marginBottom: '32px' }}>
        <Link 
          to="/" 
          className="btn btn-secondary" 
          style={{ 
            marginBottom: '24px', 
            display: 'inline-flex', 
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back to Dashboard
        </Link>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '24px',
          borderRadius: '16px',
          color: '#1a1a1a',
          marginBottom: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <CoinLogo symbol={symbol} size={48} />
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#1a1a1a'
              }}>
                {assetDetails.asset_name}
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px'
                }}>
                  {symbol}
                </span>
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#666',
                maxWidth: '400px',
                lineHeight: '1.4'
              }}>
                {assetDetails.description}
              </p>
            </div>
          </div>
          
          {currentPrice && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                marginBottom: '4px',
                color: '#1a1a1a'
              }}>
                {currentPrice.currency} {currentPrice.price.toLocaleString()}
              </p>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end',
                gap: '6px',
                fontSize: '12px',
                color: '#666'
              }}>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981',
                  animation: 'pulse 2s infinite'
                }}></div>
                Live Price
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
        {/* Asset Information - Smaller */}
        <div className="card" style={{ 
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
          height: 'fit-content'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '20px',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px'
            }}>
              <FaChartLine />
            </div>
            Asset Info
          </h2>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { label: 'Market Cap', value: formatNumber(assetDetails.market_cap), icon: '💰' },
              { label: '24h Volume', value: formatNumber(assetDetails.volume_24h), icon: '📊' },
              { label: 'Circulating Supply', value: assetDetails.circulating_supply ? `${assetDetails.circulating_supply.toLocaleString()} ${symbol}` : 'N/A', icon: '🔄' },
              { label: 'Total Supply', value: assetDetails.total_supply ? `${assetDetails.total_supply.toLocaleString()} ${symbol}` : 'N/A', icon: '📦' },
              { label: 'Max Supply', value: assetDetails.max_supply ? `${assetDetails.max_supply.toLocaleString()} ${symbol}` : 'N/A', icon: '🏆' },
              { label: 'Launch Date', value: formatDate(assetDetails.launch_date), icon: '🚀' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span style={{ color: '#666', fontWeight: '500', fontSize: '14px' }}>{item.label}:</span>
                </div>
                <span style={{ 
                  fontWeight: '700', 
                  color: '#1a1a1a',
                  fontSize: '14px'
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Chart - Larger */}
        <div className="card" style={{ 
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '700',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px'
              }}>
                <FaChartLine />
              </div>
              Price History
            </h2>
            
            {/* Period Selector */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['24h', '7d', '1m', '3m'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s ease',
                    ...(selectedPeriod === period ? {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    } : {
                      backgroundColor: '#f8f9fa',
                      color: '#666',
                      border: '1px solid #e9ecef'
                    })
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPeriod !== period) {
                      e.target.style.background = '#e9ecef';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPeriod !== period) {
                      e.target.style.background = '#f8f9fa';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#666',
              fontSize: '14px'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px'
              }}></div>
              Loading chart data...
            </div>
          ) : (
            <div style={{ 
              background: '#fafbfc',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #e9ecef'
            }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 0 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#666' }}
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => {
                        // Format to show clean whole numbers
                        if (value >= 1000) {
                          return `${(value / 1000).toFixed(0)}K`;
                        } else if (value >= 1) {
                          return value.toFixed(0);
                        } else {
                          return value.toFixed(2);
                        }
                      }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        padding: '16px 20px',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif',
                        backdropFilter: 'blur(10px)'
                      }}
                      formatter={(value, name, props) => [
                        <span style={{ 
                          color: '#667eea', 
                          fontWeight: '700',
                          fontSize: '18px'
                        }}>
                          {currentPrice?.currency || 'USD'} {value.toLocaleString()}
                        </span>,
                        'Price'
                      ]}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0] && payload[0].payload.fullDate) {
                          return (
                            <span style={{ 
                              color: '#333', 
                              fontWeight: '600',
                              fontSize: '16px'
                            }}>
                              {payload[0].payload.fullDate}
                            </span>
                          );
                        }
                        return `Time: ${label}`;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="url(#gradient)"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ 
                        r: 8, 
                        fill: '#667eea',
                        stroke: 'white',
                        strokeWidth: 2
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                        <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  <FaChartLine size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p>No price data available for the selected period</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="card" style={{ 
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f0f0f0',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          marginBottom: '20px',
          color: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px'
          }}>
            <FaGlobe />
          </div>
          Links & Resources
        </h2>
        
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { icon: <FaGlobe />, label: 'Official Website', url: assetDetails.website, color: '#3b82f6' },
            { icon: <FaFileAlt />, label: 'Whitepaper', url: assetDetails.whitepaper, color: '#10b981' },
            { icon: <FaGithub />, label: 'GitHub', url: assetDetails.github, color: '#1f2937' },
            { icon: <FaTwitter />, label: 'Twitter', url: assetDetails.twitter, color: '#1da1f2' },
            { icon: <FaReddit />, label: 'Reddit', url: assetDetails.reddit, color: '#ff4500' }
          ].map((link, index) => (
            link.url && (
              <a 
                key={index}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e9ecef';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: link.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {link.icon}
                </div>
                {link.label}
              </a>
            )
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="card" style={{ 
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f0f0f0'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700',
          marginBottom: '24px',
          color: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px'
          }}>
            ⚡
          </div>
          Quick Actions
        </h2>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link 
            to="/alerts/create" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
          >
            🔔 Create Alert for {symbol}
          </Link>
          <Link 
            to="/prices" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              background: '#f8f9fa',
              color: '#1a1a1a',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              border: '1px solid #e9ecef',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e9ecef';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f8f9fa';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📊 View All Prices
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Asset; 