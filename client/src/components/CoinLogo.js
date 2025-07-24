import React, { useState } from 'react';

const CoinLogo = ({ symbol, size = 32, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  
  // CoinGecko logo URLs for popular cryptocurrencies
  const logoUrls = {
    'BTC': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    'ETH': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    'XRP': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    'ADA': 'https://assets.coingecko.com/coins/images/975/large/Cardano_Logo.png',
    'DOT': 'https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png',
    'LINK': 'https://assets.coingecko.com/coins/images/877/large/chainlink.png',
    'LTC': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
    'BCH': 'https://assets.coingecko.com/coins/images/780/large/bitcoin_cash.png',
    'TON': 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png',
    'GOLD': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' // Using ETH logo as placeholder for gold
  };

  const getInitials = (symbol) => {
    return symbol.slice(0, 2).toUpperCase();
  };

  const getBackgroundColor = (symbol) => {
    const colors = {
      'BTC': '#F7931A',
      'ETH': '#627EEA',
      'XRP': '#23292F',
      'ADA': '#0033AD',
      'DOT': '#E6007A',
      'LINK': '#2A5ADA',
      'LTC': '#BFBBBB',
      'BCH': '#0AC18E',
      'TON': '#0088CC',
      'GOLD': '#FFD700'
    };
    return colors[symbol] || '#667eea';
  };

  if (imageError || !logoUrls[symbol]) {
    return (
      <div
        className={`coin-logo-fallback ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: getBackgroundColor(symbol),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: size * 0.4,
          fontWeight: '600',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {getInitials(symbol)}
      </div>
    );
  }

  return (
    <img
      src={logoUrls[symbol]}
      alt={`${symbol} logo`}
      className={`coin-logo ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover'
      }}
      onError={() => setImageError(true)}
    />
  );
};

export default CoinLogo; 