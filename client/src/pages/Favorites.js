import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaHeartBroken, FaStar, FaChartLine, FaEye, FaTrash, FaSync, FaCaretUp, FaCaretDown, FaMinus, FaPlus, FaBell } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import CoinLogo from '../components/CoinLogo';
import Header from '../components/Header';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('/api/favorites/with-prices');
      setFavorites(response.data.data || []);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to fetch favorites');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const removeFromFavorites = async (symbol) => {
    try {
      await axios.delete(`/api/favorites/remove/${symbol}`);
      toast.success(`${symbol} removed from favorites`);
      fetchFavorites(); // Refresh the list
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const formatPrice = (price, currency) => {
    if (!price) return 'N/A';
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
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

  const getAssetCategory = (symbol) => {
    return symbol === 'GOLD' ? 'commodity' : 'crypto';
  };

  if (loading) {
    return (
      <div className="modern-min-h-screen modern-bg-gradient">
        <Header />
        <div className="modern-container" style={{ maxWidth: '100%', padding: '0 2rem' }}>
          <div className="modern-p-6">
            <div className="modern-flex modern-items-center modern-justify-center" style={{ height: '50vh' }}>
              <div className="modern-spinner"></div>
            </div>
          </div>
        </div>
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
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '2rem'
            }}>
              <div className="modern-flex modern-flex-between modern-items-center">
                <div className="modern-flex modern-items-center modern-space-x-4">
                  <div className="modern-relative">
                    <div className="modern-w-16 modern-h-16 modern-rounded-2xl modern-gradient-bg-red modern-flex modern-items-center modern-justify-center" style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
                    }}>
                      <FaHeart className="modern-text-white" style={{ fontSize: '2rem' }} />
                    </div>
                    <div className="modern-absolute -modern-top-1 -modern-right-1 modern-w-6 modern-h-6 modern-bg-yellow-400 modern-rounded-full" style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)'
                    }}></div>
                  </div>
                  
                  <div>
                    <h1 className="modern-text-4xl modern-font-black modern-text-gradient" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.025em',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      marginBottom: '0.5rem'
                    }}>
                      My Favorites
                    </h1>
                    <p className="modern-text-gray-600 modern-text-lg modern-font-medium">
                      Track your favorite cryptocurrencies and assets with real-time prices
                    </p>
                  </div>
                </div>

                <button
                  onClick={fetchFavorites}
                  disabled={refreshing}
                  className="modern-flex modern-items-center modern-space-x-3 modern-px-6 modern-py-3 modern-rounded-xl modern-font-semibold modern-transition" 
                  style={{ 
                    background: 'rgba(34, 197, 94, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    opacity: refreshing ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!refreshing) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.3)';
                      e.target.style.background = 'rgba(34, 197, 94, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!refreshing) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
                      e.target.style.background = 'rgba(34, 197, 94, 0.1)';
                    }
                  }}
                >
                  <FaSync className={refreshing ? 'modern-animate-spin' : ''} size={16} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Favorites List */}
          {favorites.length === 0 ? (
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
                <FaHeartBroken style={{ fontSize: '3rem', color: '#9ca3af' }} />
              </div>
              <h3 className="modern-text-2xl modern-font-semibold modern-text-gray-900 modern-mb-4">No favorites yet</h3>
              <p className="modern-text-gray-600 modern-mb-8 modern-text-lg">
                Start adding your favorite assets to track them here
              </p>
              <Link
                to="/prices"
                className="modern-button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <FaChartLine size={16} />
                Browse Assets
              </Link>
            </div>
          ) : (
            <div className="modern-grid" style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="modern-card"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                  onClick={() => navigate(`/asset/${favorite.asset_symbol}`)}
                >
                  <div className="modern-relative modern-z-10">
                    {/* Header */}
                    <div className="modern-flex modern-justify-between modern-mb-6">
                      <div className="modern-flex modern-items-center" style={{ gap: '1rem' }}>
                        <CoinLogo symbol={favorite.asset_symbol} size={48} />
                        <div>
                          <h3 className="modern-text-xl modern-font-bold modern-text-gray-900 modern-mb-1">
                            {favorite.asset_name}
                          </h3>
                          <p className="modern-text-gray-500 modern-font-medium">{favorite.asset_symbol}</p>
                        </div>
                      </div>
                      <div className="modern-flex modern-items-center" style={{ gap: '0.5rem' }}>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                          }}
                        >
                          <button
                            onClick={() => removeFromFavorites(favorite.asset_symbol)}
                            className="modern-text-red-500 hover:modern-text-red-700 modern-transition-colors"
                            title="Remove from favorites"
                            style={{ padding: '0.5rem' }}
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                        <div className="modern-badge" style={{
                          background: getAssetCategory(favorite.asset_symbol) === 'commodity' 
                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '600'
                        }}>
                          {getAssetCategory(favorite.asset_symbol) === 'commodity' ? 'Commodity' : 'Crypto'}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="modern-mb-6">
                      <div className="modern-text-3xl modern-font-bold modern-text-gray-900 modern-mb-2">
                        {formatPrice(favorite.current_price, favorite.currency)}
                      </div>
                      <div className={`modern-flex modern-items-center modern-text-sm modern-font-semibold ${
                        getPriceChangeClass(favorite.asset_symbol) === 'up' ? 'modern-text-green-600' : 
                        getPriceChangeClass(favorite.asset_symbol) === 'down' ? 'modern-text-red-600' : 'modern-text-gray-500'
                      }`}>
                        {getPriceChangeIcon(favorite.asset_symbol)}
                        <span style={{ marginLeft: '0.5rem' }}>+2.4%</span>
                        <span style={{ marginLeft: '0.75rem' }} className="modern-text-gray-400">24h</span>
                      </div>
                    </div>

                    {/* Added Date */}
                    <div className="modern-mb-6">
                      <div className="modern-text-sm modern-text-gray-600">
                        Added: {new Date(favorite.added_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="modern-flex modern-justify-between modern-items-center">
                      <div className="modern-flex modern-items-center" style={{ gap: '0.5rem' }}>
                        <div className="modern-live-indicator"></div>
                        <span className="modern-text-sm modern-text-gray-500 modern-font-medium">Live</span>
                      </div>
                      <div className="modern-flex modern-items-center" style={{ gap: '0.5rem' }}>
                        <Link
                          to={`/asset/${favorite.asset_symbol}`}
                          className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-lg modern-bg-blue-600 modern-text-white hover:modern-bg-blue-700 modern-transition-colors modern-text-sm"
                          style={{ textDecoration: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaEye size={14} />
                          <span>View</span>
                        </Link>
                        <Link
                          to={`/alerts/create`}
                          className="modern-flex modern-items-center modern-space-x-2 modern-px-4 modern-py-2 modern-rounded-lg modern-bg-green-600 modern-text-white hover:modern-bg-green-700 modern-transition-colors modern-text-sm"
                          style={{ textDecoration: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaBell size={14} />
                          <span>Alert</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          {favorites.length > 0 && (
            <div className="modern-card" style={{ 
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 className="modern-text-xl modern-font-semibold modern-text-gray-900 modern-mb-4">Quick Actions</h3>
              <div className="modern-flex modern-flex-wrap" style={{ gap: '1rem' }}>
                <Link
                  to="/prices"
                  className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-3 modern-rounded-xl modern-bg-blue-600 modern-text-white hover:modern-bg-blue-700 modern-transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  <FaChartLine size={16} />
                  <span>View All Prices</span>
                </Link>
                <Link
                  to="/alerts"
                  className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-3 modern-rounded-xl modern-bg-green-600 modern-text-white hover:modern-bg-green-700 modern-transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  <FaBell size={16} />
                  <span>Set Alerts</span>
                </Link>
                <button
                  onClick={() => {
                    toast.info('Clear all favorites feature coming soon!');
                  }}
                  className="modern-flex modern-items-center modern-space-x-2 modern-px-6 modern-py-3 modern-rounded-xl modern-bg-red-600 modern-text-white hover:modern-bg-red-700 modern-transition-colors"
                >
                  <FaTrash size={16} />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites; 