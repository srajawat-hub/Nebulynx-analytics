import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChartLine, FaBell, FaEye, FaPlus, FaArrowRight, FaCaretUp, FaCaretDown, FaMinus, FaGlobe, FaChartBar, FaUsers, FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import CoinLogo from '../components/CoinLogo';
import Header from '../components/Header';

const Dashboard = () => {
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [pricesRes, alertsRes] = await Promise.all([
        axios.get('/api/prices/current'),
        axios.get('/api/alerts')
      ]);
      setPrices(pricesRes.data);
      setAlerts(alertsRes.data.filter(alert => alert.is_active));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = Object.entries(prices)
      .filter(([symbol, data]) => 
        data.name.toLowerCase().includes(query.toLowerCase()) ||
        symbol.toLowerCase().includes(query.toLowerCase())
      )
      .map(([symbol, data]) => ({ symbol, ...data }))
      .slice(0, 8);

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (symbol) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/asset/${symbol}`);
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
    if (changeClass === 'up') return <FaCaretUp size={12} />;
    if (changeClass === 'down') return <FaCaretDown size={12} />;
    return <FaMinus size={12} />;
  };

  const formatPrice = (price, currency) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  const stats = [
    { icon: <FaGlobe size={24} />, label: 'Assets Monitored', value: Object.keys(prices).length, color: 'modern-gradient-bg-blue' },
    { icon: <FaBell size={24} />, label: 'Active Alerts', value: alerts.length, color: 'modern-gradient-bg-orange' },
    { icon: <FaChartBar size={24} />, label: 'Total Value', value: '$2.4M', color: 'modern-gradient-bg-green' },
    { icon: <FaUsers size={24} />, label: 'Users', value: '1.2K', color: 'modern-gradient-bg-purple' }
  ];

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

      {/* Search Section - Separated with more spacing */}
      <div className="modern-header" style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        backdropFilter: 'blur(10px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '2rem'
      }}>
        <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="modern-flex modern-p-6" style={{ gap: '1.5rem', alignItems: 'center' }}>
            {/* Search Bar */}
            <div className="modern-relative" style={{ flex: 1, minWidth: 0 }}>
              <div className="modern-relative">
                <FaSearch className="modern-absolute" style={{ left: '1.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 10, fontSize: '1.2rem' }} />
                <input
                  type="text"
                  placeholder="Search for assets, cryptocurrencies, or commodities..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  className="modern-w-full modern-pr-12 modern-py-4 modern-bg-white-70 modern-border-white-20 modern-rounded-2xl modern-text-gray-900 modern-placeholder-gray-500 focus:modern-outline-none focus:modern-ring-2 focus:modern-ring-blue-500 focus:modern-border-transparent"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    height: '56px',
                    paddingLeft: '4rem'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="modern-absolute modern-right-4 modern-top-1/2 modern-transform -modern-translate-y-1/2 modern-text-gray-400 hover:modern-text-gray-600"
                    style={{ zIndex: 10 }}
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="modern-absolute modern-top-full modern-left-0 modern-right-0 modern-mt-3 modern-bg-white modern-rounded-2xl modern-shadow-xl modern-border modern-border-gray-200 modern-z-50" style={{ 
                  maxHeight: '400px', 
                  overflowY: 'auto',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  {searchResults.map((result) => (
                    <div
                      key={result.symbol}
                      onClick={() => handleSearchResultClick(result.symbol)}
                      className="modern-flex modern-items-center modern-space-x-4 modern-p-4 modern-cursor-pointer modern-hover:modern-bg-gray-50 modern-transition"
                      style={{ borderBottom: '1px solid #f3f4f6' }}
                    >
                      <CoinLogo symbol={result.symbol} size={32} />
                      <div className="modern-flex-1">
                        <div className="modern-font-semibold modern-text-gray-900 modern-text-lg">{result.name}</div>
                        <div className="modern-text-sm modern-text-gray-500">{result.symbol}</div>
                      </div>
                      <div className="modern-text-right">
                        <div className="modern-font-bold modern-text-gray-900 modern-text-lg">
                          {formatPrice(result.price, result.currency)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Alert Button */}
            <button
              onClick={() => navigate('/alerts/create')}
              className="modern-button"
              style={{
                padding: '1rem 2rem',
                fontSize: '16px',
                fontWeight: '600',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '1rem',
                color: '#374151',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                height: '56px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <FaPlus style={{ marginRight: '0.75rem' }} />
              Create Alert
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
        <div className="modern-p-6">
          {/* Stats Grid */}
          <div className="modern-grid modern-grid-4 modern-mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="modern-stats-card"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="modern-relative modern-z-10">
                  <div className="modern-flex modern-justify-between modern-mb-4">
                    <div className="modern-icon-bg">
                      <div className="modern-text-gray-600">{stat.icon}</div>
                    </div>
                    <div className="modern-text-right">
                      <div className="modern-text-3xl modern-font-bold modern-text-gray-900">{stat.value}</div>
                      <div className="modern-text-sm modern-text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Overview */}
          <div className="modern-grid modern-grid-3 modern-mb-8">
            {/* Current Prices */}
            <div className="modern-card" style={{ gridColumn: 'span 2' }}>
              <div className="modern-flex modern-justify-between modern-mb-6">
                <h2 className="modern-text-xl modern-font-bold modern-text-gray-900">Market Overview</h2>
                <Link to="/prices" className="modern-text-blue-600 hover:modern-text-blue-700 modern-font-medium modern-flex modern-items-center" style={{ textDecoration: 'none' }}>
                  View All
                  <FaArrowRight style={{ marginLeft: '0.5rem' }} className="modern-transform-hover" />
                </Link>
              </div>
              <div className="modern-grid modern-grid-2">
                {Object.entries(prices).slice(0, 8).map(([symbol, data]) => (
                  <div
                    key={symbol}
                    className="modern-price-card"
                    onClick={() => navigate(`/asset/${symbol}`)}
                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                  >
                    <div className="modern-relative modern-z-10">
                      <div className="modern-flex modern-justify-between">
                        <div className="modern-flex modern-items-center modern-space-x-3">
                          <CoinLogo symbol={symbol} size={32} />
                          <div>
                            <div className="modern-font-semibold modern-text-gray-900" style={{ textDecoration: 'none' }}>
                              {data.name}
                            </div>
                            <div className="modern-text-sm modern-text-gray-500">{symbol}</div>
                          </div>
                        </div>
                        <div className="modern-text-right">
                          <div className="modern-font-bold modern-text-gray-900" style={{ textDecoration: 'none' }}>
                            {formatPrice(data.price, data.currency)}
                          </div>
                          <div className={`modern-flex modern-items-center modern-justify-end modern-text-sm ${
                            getPriceChangeClass(symbol) === 'up' ? 'modern-text-green-600' : 
                            getPriceChangeClass(symbol) === 'down' ? 'modern-text-red-600' : 'modern-text-gray-500'
                          }`}>
                            {getPriceChangeIcon(symbol)}
                            <span style={{ marginLeft: '0.25rem' }}>2.4%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="modern-card">
              <div className="modern-flex modern-justify-between modern-mb-6">
                <h2 className="modern-text-xl modern-font-bold modern-text-gray-900">Active Alerts</h2>
                <Link to="/alerts" className="modern-text-blue-600 hover:modern-text-blue-700 modern-font-medium modern-flex modern-items-center" style={{ textDecoration: 'none' }}>
                  View All
                  <FaArrowRight style={{ marginLeft: '0.5rem' }} className="modern-transform-hover" />
                </Link>
              </div>
              <div className="modern-space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="modern-bg-gradient-gray modern-rounded-xl modern-p-4 modern-border-gray-200">
                    <div className="modern-flex modern-justify-between modern-mb-2">
                      <div className="modern-flex modern-items-center modern-space-x-2">
                        <CoinLogo symbol={alert.asset_symbol} size={20} />
                        <span className="modern-font-semibold modern-text-gray-900">{alert.asset_name}</span>
                      </div>
                      <div className="modern-text-sm modern-text-gray-500">
                        {alert.condition_type === 'above' ? '>' : '<'} {formatPrice(alert.threshold_price, alert.currency)}
                      </div>
                    </div>
                    <div className="modern-text-sm modern-text-gray-600">
                      Alert for {alert.notification_email}
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="modern-text-center modern-p-6 modern-text-gray-500">
                    <FaBell style={{ fontSize: '3rem', margin: '0 auto 1rem', color: '#d1d5db' }} />
                    <p>No active alerts</p>
                    <button
                      onClick={() => navigate('/alerts/create')}
                      className="modern-mt-4 modern-text-blue-600 hover:modern-text-blue-700 modern-font-medium"
                    >
                      Create your first alert
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="modern-grid modern-grid-3">
            <Link
              to="/prices"
              className="modern-card modern-gradient-bg modern-overflow-hidden"
              style={{ textDecoration: 'none' }}
            >
              <div className="modern-relative modern-z-10">
                <div className="modern-flex modern-justify-between modern-mb-4">
                  <FaChartLine style={{ fontSize: '1.875rem' }} />
                  <FaArrowRight style={{ fontSize: '1.25rem' }} className="modern-transform-hover" />
                </div>
                <h3 className="modern-text-xl modern-font-bold modern-mb-2">Live Prices</h3>
                <p className="modern-text-blue-100">Monitor real-time cryptocurrency and gold prices</p>
              </div>
            </Link>

            <Link
              to="/alerts"
              className="modern-card modern-gradient-bg-orange modern-overflow-hidden"
              style={{ textDecoration: 'none' }}
            >
              <div className="modern-relative modern-z-10">
                <div className="modern-flex modern-justify-between modern-mb-4">
                  <FaBell style={{ fontSize: '1.875rem' }} />
                  <FaArrowRight style={{ fontSize: '1.25rem' }} className="modern-transform-hover" />
                </div>
                <h3 className="modern-text-xl modern-font-bold modern-mb-2">Price Alerts</h3>
                <p className="modern-text-orange-100">Set up notifications for price movements</p>
              </div>
            </Link>

            <Link
              to="/notifications"
              className="modern-card modern-gradient-bg-green modern-overflow-hidden"
              style={{ textDecoration: 'none' }}
            >
              <div className="modern-relative modern-z-10">
                <div className="modern-flex modern-justify-between modern-mb-4">
                  <FaEye style={{ fontSize: '1.875rem' }} />
                  <FaArrowRight style={{ fontSize: '1.25rem' }} className="modern-transform-hover" />
                </div>
                <h3 className="modern-text-xl modern-font-bold modern-mb-2">Notifications</h3>
                <p className="modern-text-green-100">View your alert history and notifications</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div 
          className="modern-fixed modern-inset-0 modern-z-40" 
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </div>
  );
};

export default Dashboard; 