import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSync, FaChartLine, FaArrowRight, FaCaretUp, FaCaretDown, FaMinus, FaFilter, FaSearch, FaBell, FaEye } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import CoinLogo from '../components/CoinLogo';

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
                
                <Link to="/alerts" className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-xl modern-bg-white-70 modern-border-white-20 hover:modern-bg-white-90 modern-transition" style={{ textDecoration: 'none' }}>
                  <FaBell className="modern-text-orange-600" size={16} />
                  <span className="modern-text-gray-700 modern-font-medium">Alerts</span>
                </Link>
                
                <Link to="/notifications" className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-xl modern-bg-white-70 modern-border-white-20 hover:modern-bg-white-90 modern-transition" style={{ textDecoration: 'none' }}>
                  <FaEye className="modern-text-green-600" size={16} />
                  <span className="modern-text-gray-700 modern-font-medium">Notifications</span>
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
                <FaChartLine className="modern-text-white" style={{ fontSize: '1.25rem' }} />
              </div>
              <div>
                <h2 className="modern-text-xl modern-font-bold modern-text-gray-900">Live Prices</h2>
                <p className="modern-text-sm modern-text-gray-500">Real-time market data</p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchPrices}
              disabled={refreshing}
              className="modern-button modern-button-secondary"
              style={{ 
                opacity: refreshing ? 0.5 : 1, 
                cursor: refreshing ? 'not-allowed' : 'pointer'
              }}
            >
              <FaSync style={{ marginRight: '0.5rem' }} className={refreshing ? 'modern-spinner' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          {/* Category Filter */}
          <div className="modern-mb-8">
            <div className="modern-flex modern-items-center modern-space-x-4 modern-mb-4">
              <FaFilter className="modern-text-gray-600" />
              <h2 className="modern-text-lg modern-font-semibold modern-text-gray-900">Filter by Category</h2>
            </div>
            <div className="modern-flex modern-space-x-3" style={{ flexWrap: 'wrap' }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`modern-button ${selectedCategory === category.id ? 'modern-gradient-bg' : 'modern-bg-white-70 modern-border-white-20'}`}
                  style={{ 
                    background: selectedCategory === category.id ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.7)',
                    color: selectedCategory === category.id ? 'white' : '#374151',
                    border: selectedCategory === category.id ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {category.name}
                  <span className="modern-badge modern-badge-white" style={{ 
                    marginLeft: '0.5rem',
                    background: selectedCategory === category.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(107, 114, 128, 0.1)',
                    color: selectedCategory === category.id ? 'white' : '#4b5563'
                  }}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Cards Grid */}
          <div className="modern-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredPrices.map(([symbol, data]) => (
              <div
                key={symbol}
                className="modern-price-card"
                onClick={() => navigate(`/asset/${symbol}`)}
                style={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                <div className="modern-relative modern-z-10">
                  {/* Header */}
                  <div className="modern-flex modern-justify-between modern-mb-4">
                    <div className="modern-flex modern-items-center modern-space-x-3">
                      <CoinLogo symbol={symbol} size={40} />
                      <div>
                        <h3 className="modern-font-bold modern-text-gray-900" style={{ textDecoration: 'none' }}>
                          {data.name}
                        </h3>
                        <p className="modern-text-sm modern-text-gray-500">{symbol}</p>
                      </div>
                    </div>
                    <div className={`modern-badge ${
                      getAssetCategory(symbol) === 'commodity' 
                        ? 'modern-badge-commodity' 
                        : 'modern-badge-crypto'
                    }`}>
                      {getAssetCategory(symbol) === 'commodity' ? 'Commodity' : 'Crypto'}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="modern-mb-4">
                    <div className="modern-text-2xl modern-font-bold modern-text-gray-900 modern-mb-1" style={{ textDecoration: 'none' }}>
                      {formatPrice(data.price, data.currency)}
                    </div>
                    <div className={`modern-flex modern-items-center modern-text-sm ${
                      getPriceChangeClass(symbol) === 'up' ? 'modern-text-green-600' : 
                      getPriceChangeClass(symbol) === 'down' ? 'modern-text-red-600' : 'modern-text-gray-500'
                    }`}>
                      {getPriceChangeIcon(symbol)}
                      <span style={{ marginLeft: '0.25rem' }}>+2.4%</span>
                      <span style={{ marginLeft: '0.5rem' }} className="modern-text-gray-400">24h</span>
                    </div>
                  </div>

                  {/* Live indicator */}
                  <div className="modern-flex modern-justify-between">
                    <div className="modern-flex modern-items-center modern-space-x-2 modern-text-xs modern-text-gray-500">
                      <div className="modern-live-indicator"></div>
                      <span>Live</span>
                    </div>
                    <FaArrowRight className="modern-text-gray-400 modern-transform-hover" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredPrices.length === 0 && (
            <div className="modern-text-center" style={{ padding: '4rem 0' }}>
              <div className="modern-w-24 modern-h-24 modern-bg-gradient-gray modern-rounded-2xl modern-flex modern-items-center modern-justify-center" style={{ margin: '0 auto 1.5rem' }}>
                <FaSearch style={{ fontSize: '2.5rem', color: '#9ca3af' }} />
              </div>
              <h3 className="modern-text-xl modern-font-semibold modern-text-gray-900 modern-mb-2">No assets found</h3>
              <p className="modern-text-gray-500 modern-mb-6">Try selecting a different category or check back later.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="modern-button"
              >
                View All Assets
              </button>
            </div>
          )}

          {/* Market Summary */}
          <div className="modern-mt-12 modern-grid modern-grid-3">
            <div className="modern-card modern-gradient-bg">
              <div className="modern-flex modern-justify-between modern-mb-4">
                <div className="modern-icon-bg-white modern-rounded-xl modern-p-3">
                  <FaChartLine style={{ fontSize: '1.5rem' }} />
                </div>
                <div className="modern-text-right">
                  <div className="modern-text-3xl modern-font-bold">{Object.keys(prices).length}</div>
                  <div className="modern-text-blue-100">Total Assets</div>
                </div>
              </div>
              <p className="modern-text-blue-100 modern-text-sm">Monitoring real-time prices across multiple markets</p>
            </div>

            <div className="modern-card modern-gradient-bg-green">
              <div className="modern-flex modern-justify-between modern-mb-4">
                <div className="modern-icon-bg-white modern-rounded-xl modern-p-3">
                  <FaCaretUp style={{ fontSize: '1.5rem' }} />
                </div>
                <div className="modern-text-right">
                  <div className="modern-text-3xl modern-font-bold">8</div>
                  <div className="modern-text-green-100">Gaining</div>
                </div>
              </div>
              <p className="modern-text-green-100 modern-text-sm">Assets showing positive price movement today</p>
            </div>

            <div className="modern-card modern-gradient-bg-orange">
              <div className="modern-flex modern-justify-between modern-mb-4">
                <div className="modern-icon-bg-white modern-rounded-xl modern-p-3">
                  <FaCaretDown style={{ fontSize: '1.5rem' }} />
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