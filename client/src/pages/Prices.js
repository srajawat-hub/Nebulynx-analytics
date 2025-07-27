import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSync, FaChartLine, FaArrowRight, FaCaretUp, FaCaretDown, FaMinus, FaFilter, FaSearch, FaBell, FaEye, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import CoinLogo from '../components/CoinLogo';
import FavoriteButton from '../components/FavoriteButton';
import Header from '../components/Header';

const Prices = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('/api/prices/current');
      setPrices(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.error('Failed to fetch prices');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getPriceChangeClass = (symbol) => {
    // Mock price change for demo - in real app, you'd track previous prices
    const changes = {
      BTC: 'up', ETH: 'down', XRP: 'up', ADA: 'down', 
      DOT: 'up', LINK: 'down', LTC: 'up', BCH: 'down', 
      TON: 'up', GOLD: 'up'
    };
    return changes[symbol] || 'neutral';
  };

  const getPriceChangeIcon = (symbol) => {
    const changeClass = getPriceChangeClass(symbol);
    if (changeClass === 'up') return <FaCaretUp size={16} />;
    if (changeClass === 'down') return <FaCaretDown size={16} />;
    return <FaMinus size={16} />;
  };

  const formatPrice = (price, currency) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const getAssetCategory = (symbol) => {
    const categories = {
      BTC: 'crypto',
      ETH: 'crypto', 
      XRP: 'crypto',
      ADA: 'crypto',
      DOT: 'crypto',
      LINK: 'crypto',
      LTC: 'crypto',
      BCH: 'crypto',
      TON: 'crypto',
      GOLD: 'commodity'
    };
    return categories[symbol] || 'crypto';
  };

  const categories = [
    { id: 'all', name: 'All Assets', count: Object.keys(prices).length },
    { id: 'crypto', name: 'Cryptocurrencies', count: Object.keys(prices).filter(s => getAssetCategory(s) === 'crypto').length },
    { id: 'commodity', name: 'Commodities', count: Object.keys(prices).filter(s => getAssetCategory(s) === 'commodity').length }
  ];

  const filteredPrices = Object.entries(prices).filter(([symbol]) => {
    if (selectedCategory === 'all') return true;
    return getAssetCategory(symbol) === selectedCategory;
  });

  if (loading) {
    return (
      <div className="modern-loading">
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div className="modern-min-h-screen modern-bg-gradient">
      <Header />

      {/* Main Content */}
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          {/* Back Button and Page Header */}
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
            
            {/* Page Header Card */}
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
                  <div className="modern-icon-bg" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                  }}>
                    <FaChartLine size={40} />
                  </div>
                  <div>
                    <h1 className="modern-text-3xl modern-font-bold modern-text-gray-900 modern-mb-3">
                      Live Market Prices
                    </h1>
                    <p className="modern-text-gray-600 modern-text-lg" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                      Real-time cryptocurrency and commodity prices with live market data and price tracking
                    </p>
                  </div>
                </div>
                
                {/* Refresh Button */}
                <button
                  onClick={fetchPrices}
                  disabled={refreshing}
                  className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-3 modern-rounded-xl modern-font-semibold modern-transition"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    border: 'none',
                    opacity: refreshing ? 0.7 : 1,
                    cursor: refreshing ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!refreshing) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!refreshing) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                >
                  <FaSync className={refreshing ? 'modern-spinner' : ''} size={16} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="modern-card modern-mb-8" style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="modern-flex modern-items-center modern-space-x-4 modern-mb-6">
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
                <FaFilter size={24} />
              </div>
              <h2 className="modern-text-xl modern-font-bold modern-text-gray-900">Filter by Category</h2>
            </div>
            <div className="modern-flex modern-space-x-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="modern-px-6 modern-py-3 modern-rounded-xl modern-font-semibold modern-transition"
                  style={{ 
                    background: selectedCategory === category.id 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    color: selectedCategory === category.id ? 'white' : '#374151',
                    border: selectedCategory === category.id ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: selectedCategory === category.id 
                      ? '0 4px 12px rgba(102, 126, 234, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                    }
                  }}
                >
                  {category.name}
                  <span className="modern-badge" style={{ 
                    marginLeft: '0.75rem',
                    background: selectedCategory === category.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(107, 114, 128, 0.1)',
                    color: selectedCategory === category.id ? 'white' : '#4b5563',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Cards Grid */}
          <div className="modern-grid" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {filteredPrices.map(([symbol, data]) => (
              <div
                key={symbol}
                className="modern-card"
                onClick={() => navigate(`/asset/${symbol}`)}
                style={{ 
                  cursor: 'pointer', 
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="modern-relative modern-z-10">
                  {/* Header */}
                  <div className="modern-flex modern-justify-between modern-mb-6">
                    <div className="modern-flex modern-items-center" style={{ gap: '1rem' }}>
                      <CoinLogo symbol={symbol} size={48} />
                      <div>
                        <h3 className="modern-text-xl modern-font-bold modern-text-gray-900 modern-mb-1">
                          {data.name}
                        </h3>
                        <p className="modern-text-gray-500 modern-font-medium">{symbol}</p>
                      </div>
                    </div>
                    <div className="modern-flex modern-items-center" style={{ gap: '0.5rem' }}>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                        }}
                      >
                        <FavoriteButton symbol={symbol} size={24} />
                      </div>
                      <div className="modern-badge" style={{
                        background: getAssetCategory(symbol) === 'commodity' 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {getAssetCategory(symbol) === 'commodity' ? 'Commodity' : 'Crypto'}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="modern-mb-6">
                    <div className="modern-text-3xl modern-font-bold modern-text-gray-900 modern-mb-2">
                      {formatPrice(data.price, data.currency)}
                    </div>
                    <div className={`modern-flex modern-items-center modern-text-sm modern-font-semibold ${
                      getPriceChangeClass(symbol) === 'up' ? 'modern-text-green-600' : 
                      getPriceChangeClass(symbol) === 'down' ? 'modern-text-red-600' : 'modern-text-gray-500'
                    }`}>
                      {getPriceChangeIcon(symbol)}
                      <span style={{ marginLeft: '0.5rem' }}>+2.4%</span>
                      <span style={{ marginLeft: '0.75rem' }} className="modern-text-gray-400">24h</span>
                    </div>
                  </div>

                  {/* Live indicator */}
                  <div className="modern-flex modern-justify-between modern-items-center">
                    <div className="modern-flex modern-items-center" style={{ gap: '0.5rem' }}>
                      <div className="modern-live-indicator"></div>
                      <span className="modern-text-sm modern-text-gray-500 modern-font-medium">Live</span>
                    </div>
                    <FaArrowRight className="modern-text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredPrices.length === 0 && (
            <div className="modern-card modern-text-center" style={{ 
              padding: '4rem 2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="modern-w-24 modern-h-24 modern-bg-gradient-gray modern-rounded-2xl modern-flex modern-items-center modern-justify-center" style={{ 
                margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #e2e8f0'
              }}>
                <FaSearch style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
              </div>
              <h3 className="modern-text-xl modern-font-semibold modern-text-gray-900 modern-mb-2">No assets found</h3>
              <p className="modern-text-gray-500 modern-mb-6">Try selecting a different category or check back later.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="modern-px-6 modern-py-3 modern-rounded-xl modern-font-semibold modern-transition"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  border: 'none'
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
                View All Assets
              </button>
            </div>
          )}

          {/* Market Summary */}
          <div className="modern-grid modern-grid-3" style={{ gap: '2rem' }}>
            <div className="modern-card" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              color: 'white'
            }}>
              <div className="modern-flex modern-justify-between modern-mb-4">
                <div className="modern-icon-bg" style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <FaChartLine size={28} />
                </div>
                <div className="modern-text-right">
                  <div className="modern-text-3xl modern-font-bold">{Object.keys(prices).length}</div>
                  <div className="modern-text-blue-100">Total Assets</div>
                </div>
              </div>
              <p className="modern-text-blue-100 modern-text-sm">Monitoring real-time prices across multiple markets</p>
            </div>

            <div className="modern-card" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
              color: 'white'
            }}>
              <div className="modern-flex modern-justify-between modern-mb-4">
                <div className="modern-icon-bg" style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <FaCaretUp size={28} />
                </div>
                <div className="modern-text-right">
                  <div className="modern-text-3xl modern-font-bold">8</div>
                  <div className="modern-text-green-100">Gaining</div>
                </div>
              </div>
              <p className="modern-text-green-100 modern-text-sm">Assets showing positive price movement today</p>
            </div>

            <div className="modern-card" style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
              color: 'white'
            }}>
              <div className="modern-flex modern-justify-between modern-mb-4">
                <div className="modern-icon-bg" style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <FaCaretDown size={28} />
                </div>
                <div className="modern-text-right">
                  <div className="modern-text-3xl modern-font-bold">2</div>
                  <div className="modern-text-orange-100">Declining</div>
                </div>
              </div>
              <p className="modern-text-orange-100 modern-text-sm">Assets showing negative price movement today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prices; 