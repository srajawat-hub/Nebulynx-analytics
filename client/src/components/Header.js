import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaBell, FaPlus, FaHome } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/prices', label: 'Prices', icon: <FaChartLine /> },
    { path: '/alerts', label: 'Alerts', icon: <FaBell /> },
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
            {/* New Logo SVG */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#667eea"/>
              <text x="12" y="28" fontFamily="Inter, Arial" fontWeight="bold" fontSize="22" fill="white">N</text>
              <polygon points="32,8 36,16 28,16" fill="#FFD700"/>
            </svg>
            <h1 style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '1px',
            }}>
              Nebulatics Research
            </h1>
          </Link>
          
          <nav>
            <ul style={{
              display: 'flex',
              listStyle: 'none',
              gap: '8px',
              margin: 0,
              padding: 0,
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
                    }}
                  >
                    {item.icon}
                    <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/alerts/create"
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <FaPlus />
                  <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
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