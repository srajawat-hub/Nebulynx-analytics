const axios = require('axios');
const { getDatabase } = require('../database/database');
const { SUPPORTED_ASSETS } = require('./priceMonitor');

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BINANCE_API = 'https://api.binance.com/api/v3';

// Asset configuration with API identifiers
const ASSET_CONFIG = {
  'BTC': { 
    coingecko_id: 'bitcoin',
    binance_symbol: 'BTCUSDT',
    launch_date: '2009-01-03',
    description: 'Bitcoin is a decentralized cryptocurrency that enables peer-to-peer transactions without intermediaries.',
    website: 'https://bitcoin.org',
    whitepaper: 'https://bitcoin.org/bitcoin.pdf'
  },
  'ETH': { 
    coingecko_id: 'ethereum',
    binance_symbol: 'ETHUSDT',
    launch_date: '2015-07-30',
    description: 'Ethereum is a decentralized platform that enables the creation of smart contracts and decentralized applications.',
    website: 'https://ethereum.org',
    whitepaper: 'https://ethereum.org/en/whitepaper/'
  },
  'XRP': { 
    coingecko_id: 'ripple',
    binance_symbol: 'XRPUSDT',
    launch_date: '2012-09-26',
    description: 'XRP is a digital asset designed for fast, low-cost international money transfers.',
    website: 'https://ripple.com',
    whitepaper: 'https://ripple.com/files/ripple_consensus_whitepaper.pdf'
  },
  'ADA': { 
    coingecko_id: 'cardano',
    binance_symbol: 'ADAUSDT',
    launch_date: '2017-10-01',
    description: 'Cardano is a blockchain platform for smart contracts, designed to be more secure and scalable.',
    website: 'https://cardano.org',
    whitepaper: 'https://cardano.org/static/white-paper-english.pdf'
  },
  'DOT': { 
    coingecko_id: 'polkadot',
    binance_symbol: 'DOTUSDT',
    launch_date: '2020-05-26',
    description: 'Polkadot is a multi-chain network that enables different blockchains to transfer messages and value.',
    website: 'https://polkadot.network',
    whitepaper: 'https://polkadot.network/PolkaDotPaper.pdf'
  },
  'LINK': { 
    coingecko_id: 'chainlink',
    binance_symbol: 'LINKUSDT',
    launch_date: '2017-09-19',
    description: 'Chainlink is a decentralized oracle network that connects smart contracts with real-world data.',
    website: 'https://chainlinklabs.com',
    whitepaper: 'https://link.smartcontract.com/whitepaper.pdf'
  },
  'LTC': { 
    coingecko_id: 'litecoin',
    binance_symbol: 'LTCUSDT',
    launch_date: '2011-10-07',
    description: 'Litecoin is a peer-to-peer cryptocurrency that enables instant, near-zero cost payments.',
    website: 'https://litecoin.org',
    whitepaper: 'https://litecoin.org/LitecoinPaper.pdf'
  },
  'BCH': { 
    coingecko_id: 'bitcoin-cash',
    binance_symbol: 'BCHUSDT',
    launch_date: '2017-08-01',
    description: 'Bitcoin Cash is a cryptocurrency that is a fork of Bitcoin, designed to enable more transactions per block.',
    website: 'https://bitcoincash.org',
    whitepaper: 'https://bitcoincash.org/bitcoin.pdf'
  },
  'TON': { 
    coingecko_id: 'the-open-network',
    binance_symbol: null, // Not available on Binance
    launch_date: '2018-07-12',
    description: 'The Open Network (TON) is a decentralized blockchain platform designed to handle millions of transactions per second.',
    website: 'https://ton.org',
    whitepaper: 'https://ton.org/whitepaper.pdf'
  },
  'GOLD': { 
    coingecko_id: 'gold',
    binance_symbol: null, // Not available on Binance
    launch_date: 'Ancient times',
    description: 'Gold is a precious metal that has been used as a store of value and medium of exchange for thousands of years.',
    website: 'https://www.gold.org',
    whitepaper: null
  }
};

// Fetch detailed asset information from CoinGecko
async function fetchAssetDetails(symbol) {
  const config = ASSET_CONFIG[symbol];
  if (!config) return null;

  try {
    console.log(`Fetching detailed information for ${symbol}...`);
    
    // Fetch from CoinGecko
    const response = await axios.get(`${COINGECKO_API}/coins/${config.coingecko_id}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Trading-Notification-App/1.0'
      }
    });

    const data = response.data;
    
    return {
      asset_symbol: symbol,
      asset_name: data.name,
      market_cap: data.market_data?.market_cap?.usd || null,
      volume_24h: data.market_data?.total_volume?.usd || null,
      circulating_supply: data.market_data?.circulating_supply || null,
      total_supply: data.market_data?.total_supply || null,
      max_supply: data.market_data?.max_supply || null,
      launch_date: config.launch_date,
      description: config.description,
      website: config.website,
      whitepaper: config.whitepaper,
      github: data.links?.repos_url?.github?.[0] || null,
      twitter: data.links?.twitter_screen_name ? `https://twitter.com/${data.links.twitter_screen_name}` : null,
      reddit: data.links?.subreddit_url || null
    };
  } catch (error) {
    console.error(`Error fetching details for ${symbol}:`, error.message);
    
    // Return fallback data if API fails
    const fallbackData = {
      'BTC': { market_cap: 850000000000, volume_24h: 25000000000, circulating_supply: 19500000, total_supply: 21000000, max_supply: 21000000 },
      'ETH': { market_cap: 280000000000, volume_24h: 15000000000, circulating_supply: 120000000, total_supply: null, max_supply: null },
      'XRP': { market_cap: 35000000000, volume_24h: 2000000000, circulating_supply: 100000000000, total_supply: 100000000000, max_supply: 100000000000 },
      'ADA': { market_cap: 15000000000, volume_24h: 800000000, circulating_supply: 35000000000, total_supply: 45000000000, max_supply: 45000000000 },
      'DOT': { market_cap: 8000000000, volume_24h: 400000000, circulating_supply: 1200000000, total_supply: null, max_supply: null },
      'LINK': { market_cap: 8000000000, volume_24h: 500000000, circulating_supply: 1000000000, total_supply: 1000000000, max_supply: 1000000000 },
      'LTC': { market_cap: 6000000000, volume_24h: 300000000, circulating_supply: 74000000, total_supply: 84000000, max_supply: 84000000 },
      'BCH': { market_cap: 4000000000, volume_24h: 200000000, circulating_supply: 19500000, total_supply: 21000000, max_supply: 21000000 },
      'TON': { market_cap: 685000000, volume_24h: 5000000, circulating_supply: 500000000, total_supply: 500000000, max_supply: 500000000 },
      'GOLD': { market_cap: 15000000000000, volume_24h: 50000000000, circulating_supply: null, total_supply: null, max_supply: null }
    };
    
    const fallback = fallbackData[symbol];
    if (fallback) {
      return {
        asset_symbol: symbol,
        asset_name: config.name || symbol,
        market_cap: fallback.market_cap,
        volume_24h: fallback.volume_24h,
        circulating_supply: fallback.circulating_supply,
        total_supply: fallback.total_supply,
        max_supply: fallback.max_supply,
        launch_date: config.launch_date,
        description: config.description,
        website: config.website,
        whitepaper: config.whitepaper,
        github: null,
        twitter: null,
        reddit: null
      };
    }
    
    return null;
  }
}

// Save asset details to database
async function saveAssetDetails(details) {
  if (!details) return;

  const db = getDatabase();
  
  try {
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR REPLACE INTO asset_details 
        (asset_symbol, asset_name, market_cap, volume_24h, circulating_supply, 
         total_supply, max_supply, launch_date, description, website, 
         whitepaper, github, twitter, reddit, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        details.asset_symbol,
        details.asset_name,
        details.market_cap,
        details.volume_24h,
        details.circulating_supply,
        details.total_supply,
        details.max_supply,
        details.launch_date,
        details.description,
        details.website,
        details.whitepaper,
        details.github,
        details.twitter,
        details.reddit
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log(`Saved asset details for ${details.asset_symbol}`);
  } catch (error) {
    console.error(`Error saving asset details for ${details.asset_symbol}:`, error.message);
  }
}

// Get asset details from database
async function getAssetDetails(symbol) {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM asset_details WHERE asset_symbol = ?',
      [symbol],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(row);
        } else {
          // Fallback: return basic asset info if not in database
          const config = ASSET_CONFIG[symbol];
          if (config) {
            resolve({
              asset_symbol: symbol,
              asset_name: SUPPORTED_ASSETS[symbol]?.name || symbol,
              market_cap: null,
              volume_24h: null,
              circulating_supply: null,
              total_supply: null,
              max_supply: null,
              launch_date: config.launch_date,
              description: config.description,
              website: config.website,
              whitepaper: config.whitepaper,
              github: null,
              twitter: null,
              reddit: null,
              last_updated: new Date().toISOString()
            });
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

// Fetch and save detailed price history
async function fetchDetailedPriceHistory(symbol) {
  const config = ASSET_CONFIG[symbol];
  if (!config || !config.binance_symbol) return;

  try {
    console.log(`Fetching detailed price history for ${symbol}...`);
    
    // Fetch 24h ticker from Binance
    const response = await axios.get(`${BINANCE_API}/ticker/24hr`, {
      params: { symbol: config.binance_symbol },
      timeout: 10000
    });

    const data = response.data;
    
    // Save to hourly history table
    const db = getDatabase();
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO price_history_hourly 
        (asset_symbol, asset_name, currency, price, volume_24h, market_cap, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        symbol,
        symbol, // We'll update this with proper name later
        'USD',
        parseFloat(data.lastPrice),
        parseFloat(data.volume),
        null // Market cap not available from Binance ticker
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log(`Saved detailed price history for ${symbol}`);
  } catch (error) {
    console.error(`Error fetching detailed price history for ${symbol}:`, error.message);
  }
}

// Get price history for different time periods
async function getPriceHistory(symbol, period = '24h') {
  const db = getDatabase();
  
  let timeFilter;
  switch (period) {
    case '24h':
      timeFilter = "datetime('now', '-1 day')";
      break;
    case '7d':
      timeFilter = "datetime('now', '-7 days')";
      break;
    case '1m':
      timeFilter = "datetime('now', '-1 month')";
      break;
    case '3m':
      timeFilter = "datetime('now', '-3 months')";
      break;
    default:
      timeFilter = "datetime('now', '-1 day')";
  }
  
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT price, timestamp 
      FROM price_history 
      WHERE asset_symbol = ? 
      AND timestamp >= ${timeFilter}
      ORDER BY timestamp ASC
    `, [symbol], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Update all asset details
async function updateAllAssetDetails() {
  console.log('Updating all asset details...');
  
  for (const symbol of Object.keys(ASSET_CONFIG)) {
    try {
      const details = await fetchAssetDetails(symbol);
      if (details) {
        await saveAssetDetails(details);
      }
      
      // Add longer delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error updating details for ${symbol}:`, error.message);
    }
  }
  
  console.log('Asset details update completed');
}

module.exports = {
  fetchAssetDetails,
  saveAssetDetails,
  getAssetDetails,
  fetchDetailedPriceHistory,
  getPriceHistory,
  updateAllAssetDetails,
  ASSET_CONFIG
}; 