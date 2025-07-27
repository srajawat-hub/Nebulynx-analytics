import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaBell, FaPlus, FaHome, FaHeart } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/prices', label: 'Prices', icon: <FaChartLine /> },
    { path: '/favorites', label: 'Favorites', icon: <FaHeart /> },
    { path: '/alerts', label: 'Price Alerts', icon: <FaBell /> },
    { path: '/notifications', label: 'Notifications', icon: <FaBell /> },
  ];

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div className="container">
        <div className="flex flex-between" style={{ padding: '16px 0' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Original Logo */}
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}>
              <span style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                fontFamily: 'Inter, Arial, sans-serif',
              }}>
                N
              </span>
            </div>
            <h1 style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '1px',
            }}>
              Nebulynx Research
            </h1>
          </Link>
          
          <nav>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '1rem',
              margin: 0,
              padding: 0,
              alignItems: 'center',
            }}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      color: location.pathname === item.path ? '#667eea' : '#666',
                      fontWeight: location.pathname === item.path ? '600' : '500',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      background: location.pathname === item.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== item.path) {
                        e.target.style.background = 'rgba(102, 126, 234, 0.05)';
                        e.target.style.color = '#667eea';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== item.path) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#666';
                      }
                    }}
                  >
                    {item.icon}
                    <span style={{ 
                      display: 'inline',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
              <li style={{ marginLeft: '0.5rem' }}>
                <Link
                  to="/alerts/create"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    whiteSpace: 'nowrap',
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
                  <FaPlus />
                  <span style={{ 
                    display: 'inline',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    New Alert
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 