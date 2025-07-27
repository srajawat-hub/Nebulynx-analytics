import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaGlobe, FaFileAlt, FaGithub, FaTwitter, FaReddit, FaChartLine, FaBell, FaCaretUp, FaCaretDown, FaMinus } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';
import CoinLogo from '../components/CoinLogo';
import Header from '../components/Header';

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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatChartData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    // Get current price for reference
    const currentPriceValue = currentPrice?.price || 0;
    
    return data.map(item => {
      let date;
      if (typeof item.timestamp === 'string') {
        if (item.timestamp.includes('T')) {
          date = new Date(item.timestamp);
        } else {
          date = new Date(item.timestamp.replace(' ', 'T') + 'Z');
        }
      } else {
        date = new Date(item.timestamp);
      }
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', item.timestamp);
        return null;
      }
      
      const price = parseFloat(item.price);
      
      // Filter out obviously incorrect data (e.g., 45K for BTC when current price is much higher)
      // Remove data points that are more than 50% different from current price
      if (currentPriceValue > 0 && Math.abs(price - currentPriceValue) / currentPriceValue > 0.5) {
        console.warn('Filtering out outlier price:', price, 'current:', currentPriceValue);
        return null;
      }
      
      // Remove any prices that are unreasonably low or high
      if (price <= 0 || price > 1000000) {
        console.warn('Filtering out invalid price:', price);
        return null;
      }
      
      let timeLabel;
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
      } else {
        timeLabel = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
      
      return {
        time: date.getTime(),
        timeLabel: timeLabel,
        price: price,
        timestamp: date.getTime(),
        fullDate: date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    }).filter(item => item !== null);
  };

  const getPriceChangeClass = () => {
    // Mock price change for demo
    const changes = {
      BTC: 'up', ETH: 'down', XRP: 'up', ADA: 'down', 
      DOT: 'up', LINK: 'down', LTC: 'up', BCH: 'down', 
      TON: 'up', GOLD: 'up'
    };
    return changes[symbol] || 'neutral';
  };

  const getPriceChangeIcon = () => {
    const changeClass = getPriceChangeClass();
    if (changeClass === 'up') return <FaCaretUp size={12} />;
    if (changeClass === 'down') return <FaCaretDown size={12} />;
    return <FaMinus size={12} />;
  };

  const formatPrice = (price, currency) => {
    if (!price) return 'N/A';
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

  if (!assetDetails) {
    return (
      <div className="modern-min-h-screen modern-bg-gradient">
        <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="modern-p-6">
            <div className="modern-text-center" style={{ padding: '40px 20px' }}>
              <h2 className="modern-text-2xl modern-font-bold modern-text-gray-900 modern-mb-4">Asset not found</h2>
              <Link to="/" className="modern-button">Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const chartData = formatChartData(priceHistory.data);

  return (
    <div className="modern-min-h-screen modern-bg-gradient">
      <Header />

      {/* Main Content */}
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          {/* Back Button and Asset Header */}
          <div className="modern-mb-8">
            <Link 
              to="/" 
              className="modern-flex modern-items-center modern-space-x-3 modern-px-6 modern-py-3 modern-rounded-xl modern-font-semibold modern-transition" 
              style={{ 
                textDecoration: 'none',
                background: 'rgba(102, 126, 234, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                width: 'fit-content',
                marginBottom: '24px',
                color: '#667eea'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
                e.target.style.background = 'rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                e.target.style.background = 'rgba(102, 126, 234, 0.1)';
              }}
            >
              <FaArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
            
            {/* Asset Header Card */}
            <div className="modern-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '2rem'
            }}>
              <div className="modern-flex modern-items-center modern-justify-between">
                <div className="modern-flex modern-items-center" style={{ gap: '2rem' }}>
                  <CoinLogo symbol={symbol} size={80} />
                  <div>
                    <h1 className="modern-text-3xl modern-font-bold modern-text-gray-900 modern-mb-3" style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      {assetDetails.asset_name || symbol}
                      <span className="modern-badge modern-badge-crypto" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        {symbol}
                      </span>
                    </h1>
                    <p className="modern-text-gray-600 modern-text-lg" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                      {assetDetails.description || `${symbol} is a digital asset with real-time price tracking and market data.`}
                    </p>
                  </div>
                </div>
                
                {currentPrice && (
                  <div className="modern-text-right">
                    <div className="modern-text-4xl modern-font-bold modern-text-gray-900 modern-mb-2">
                      {formatPrice(currentPrice.price, currentPrice.currency)}
                    </div>
                    <div className="modern-flex modern-items-center modern-justify-end modern-space-x-2">
                      <div className={`modern-flex modern-items-center modern-space-x-1 modern-text-sm ${
                        getPriceChangeClass() === 'up' ? 'modern-text-green-600' : 
                        getPriceChangeClass() === 'down' ? 'modern-text-red-600' : 'modern-text-gray-500'
                      }`}>
                        {getPriceChangeIcon()}
                        <span>2.4%</span>
                      </div>
                      <div className="modern-live-indicator"></div>
                      <span className="modern-text-sm modern-text-gray-500">Live</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="modern-grid modern-grid-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
                        {/* Asset Information */}
            <div className="modern-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="modern-flex modern-items-center modern-justify-between modern-mb-6">
                <h2 className="modern-text-xl modern-font-bold modern-text-gray-900" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div className="modern-icon-bg" style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FaChartLine size={24} />
                  </div>
                  Asset Information
                </h2>
                
                <button
                  onClick={fetchAssetData}
                  className="modern-px-4 modern-py-3 modern-bg-gradient modern-rounded-xl modern-text-white modern-font-semibold modern-text-sm modern-transition"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  🔄 Refresh
                </button>
              </div>
              
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                {[
                  { label: 'Market Cap', value: formatNumber(assetDetails.market_cap), icon: '💰' },
                  { label: '24h Volume', value: formatNumber(assetDetails.volume_24h), icon: '📊' },
                  { label: 'Circulating Supply', value: assetDetails.circulating_supply ? `${assetDetails.circulating_supply.toLocaleString()} ${symbol}` : 'N/A', icon: '🔄' },
                  { label: 'Total Supply', value: assetDetails.total_supply ? `${assetDetails.total_supply.toLocaleString()} ${symbol}` : 'N/A', icon: '📦' },
                  { label: 'Max Supply', value: assetDetails.max_supply ? `${assetDetails.max_supply.toLocaleString()} ${symbol}` : 'N/A', icon: '🏆' },
                  { label: 'Launch Date', value: formatDate(assetDetails.launch_date), icon: '🚀' }
                ].map((item, index) => (
                  <div key={index} className="modern-flex modern-items-center modern-justify-between modern-p-3 modern-bg-gradient-gray modern-rounded-xl modern-border-gray-200" style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    height: '60px',
                    flex: 1
                  }}>
                    <div className="modern-flex modern-items-center" style={{ gap: '1rem' }}>
                      <span style={{ fontSize: '18px', marginLeft: '0.5rem' }}>{item.icon}</span>
                      <span className="modern-text-gray-600 modern-font-medium">{item.label}</span>
                    </div>
                    <span className="modern-font-bold modern-text-gray-900" style={{ marginRight: '1rem' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart */}
            <div className="modern-card" style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              height: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="modern-flex modern-items-center modern-justify-between modern-mb-8">
                <h2 className="modern-text-xl modern-font-bold modern-text-gray-900" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div className="modern-icon-bg" style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <FaChartLine size={24} />
                  </div>
                  Price History
                </h2>
                
                {/* Period Selector */}
                <div className="modern-flex modern-space-x-2">
                  {['24h', '7d', '1m', '3m'].map(period => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className="modern-px-4 modern-py-2 modern-rounded-xl modern-font-semibold modern-text-sm modern-transition"
                      style={{
                        ...(selectedPeriod === period ? {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        } : {
                          background: 'rgba(255, 255, 255, 0.8)',
                          color: '#6b7280',
                          border: '1px solid #e5e7eb'
                        })
                      }}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="modern-bg-gradient-gray modern-rounded-xl modern-border-gray-200" style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 0 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        domain={['dataMin - 0.1', 'dataMax + 0.1']}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => {
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
                  <div className="modern-text-center modern-p-12" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <FaChartLine size={48} style={{ marginBottom: '1rem', opacity: 0.5, color: '#9ca3af' }} />
                    <p className="modern-text-gray-500">No price data available for the selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="modern-card modern-mb-8" style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 className="modern-text-xl modern-font-bold modern-text-gray-900 modern-mb-8" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div className="modern-icon-bg" style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <FaGlobe size={24} />
              </div>
              Links & Resources
            </h2>
            
            <div className="modern-grid modern-grid-3" style={{ gap: '1.5rem' }}>
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
                    className="modern-flex modern-items-center modern-p-5 modern-bg-gradient-gray modern-rounded-xl modern-border-gray-200 modern-transition"
                    style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      textDecoration: 'none',
                      color: '#374151',
                      fontWeight: '500',
                      minHeight: '100px',
                      gap: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div className="modern-icon-bg" style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: link.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0,
                      marginLeft: '0.5rem'
                    }}>
                      {link.icon}
                    </div>
                    <span style={{ fontSize: '16px', lineHeight: '1.5', fontWeight: '600' }}>{link.label}</span>
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="modern-card" style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 className="modern-text-2xl modern-font-bold modern-text-gray-900 modern-mb-8" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div className="modern-icon-bg" style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
              }}>
                ⚡
              </div>
              Quick Actions
            </h2>
            
            <div className="modern-flex modern-space-x-4 modern-flex-wrap">
              <Link 
                to="/alerts/create" 
                className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-4 modern-bg-gradient modern-rounded-xl modern-text-white modern-font-semibold modern-transition"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textDecoration: 'none',
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
                <FaBell />
                <span>Create Alert for {symbol}</span>
              </Link>
              <Link 
                to="/prices" 
                className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-4 modern-bg-gradient-gray modern-rounded-xl modern-text-gray-700 modern-font-semibold modern-transition"
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <FaChartLine />
                <span>View All Prices</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asset; 