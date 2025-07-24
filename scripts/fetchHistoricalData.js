const axios = require('axios');
const { getDatabase } = require('../database/database');
const { initializeDatabase } = require('../database/database');

const BINANCE_API = 'https://api.binance.com/api/v3';

// Assets that are available on Binance
const BINANCE_ASSETS = {
  'BTC': { symbol: 'BTCUSDT', name: 'Bitcoin', currency: 'USD' },
  'ETH': { symbol: 'ETHUSDT', name: 'Ethereum', currency: 'USD' },
  'XRP': { symbol: 'XRPUSDT', name: 'Ripple', currency: 'USD' },
  'ADA': { symbol: 'ADAUSDT', name: 'Cardano', currency: 'USD' },
  'DOT': { symbol: 'DOTUSDT', name: 'Polkadot', currency: 'USD' },
  'LINK': { symbol: 'LINKUSDT', name: 'Chainlink', currency: 'USD' },
  'LTC': { symbol: 'LTCUSDT', name: 'Litecoin', currency: 'USD' },
  'BCH': { symbol: 'BCHUSDT', name: 'Bitcoin Cash', currency: 'USD' }
};

// Fetch historical kline data from Binance
async function fetchBinanceHistoricalData(symbol, interval = '1h', limit = 1000) {
  try {
    console.log(`Fetching ${interval} data for ${symbol}...`);
    
    const response = await axios.get(`${BINANCE_API}/klines`, {
      params: {
        symbol: symbol,
        interval: interval,
        limit: limit
      },
      timeout: 30000
    });

    return response.data.map(kline => ({
      timestamp: new Date(kline[0]).toISOString(),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5])
    }));
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error.message);
    return [];
  }
}

// Save historical data to database
async function saveHistoricalData(assetSymbol, data) {
  const db = getDatabase();
  const asset = BINANCE_ASSETS[assetSymbol];
  
  if (!asset) return;
  
  console.log(`Saving ${data.length} records for ${assetSymbol}...`);
  
  for (const record of data) {
    try {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT OR REPLACE INTO price_history (asset_symbol, asset_name, currency, price, timestamp) VALUES (?, ?, ?, ?, ?)',
          [assetSymbol, asset.name, asset.currency, record.close, record.timestamp],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    } catch (error) {
      console.error(`Error saving record for ${assetSymbol}:`, error.message);
    }
  }
}

// Clean up old data (keep only last 90 days)
async function cleanupOldData() {
  const db = getDatabase();
  const ninetyDaysAgo = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000)).toISOString();
  
  console.log('Cleaning up data older than 90 days...');
  
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM price_history WHERE timestamp < ?',
        [ninetyDaysAgo],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    console.log('Old data cleanup completed');
  } catch (error) {
    console.error('Error cleaning up old data:', error.message);
  }
}

// Fetch historical data for all assets
async function fetchAllHistoricalData() {
  console.log('Starting historical data fetch...');
  
  // Calculate time ranges for different intervals
  const now = Date.now();
  const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
  
  console.log(`Fetching data from ${new Date(ninetyDaysAgo).toISOString()} to ${new Date(now).toISOString()}`);
  
  for (const [assetSymbol, asset] of Object.entries(BINANCE_ASSETS)) {
    try {
      console.log(`\nProcessing ${assetSymbol}...`);
      
      // Fetch hourly data for the past 90 days
      // Binance allows max 1000 klines per request, so we need multiple requests
      const hoursNeeded = 90 * 24; // 90 days * 24 hours
      const requestsNeeded = Math.ceil(hoursNeeded / 1000);
      
      let allData = [];
      
      for (let i = 0; i < requestsNeeded; i++) {
        const startTime = ninetyDaysAgo + (i * 1000 * 60 * 60 * 1000); // Add hours
        const endTime = Math.min(startTime + (1000 * 60 * 60 * 1000), now);
        
        console.log(`  Request ${i + 1}/${requestsNeeded}: ${new Date(startTime).toISOString()} to ${new Date(endTime).toISOString()}`);
        
        try {
          const response = await axios.get(`${BINANCE_API}/klines`, {
            params: {
              symbol: asset.symbol,
              interval: '1h',
              startTime: startTime,
              endTime: endTime,
              limit: 1000
            },
            timeout: 30000
          });

          const data = response.data.map(kline => ({
            timestamp: new Date(kline[0]).toISOString(),
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            close: parseFloat(kline[4]),
            volume: parseFloat(kline[5])
          }));
          
          allData = allData.concat(data);
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`  Error in request ${i + 1} for ${assetSymbol}:`, error.message);
        }
      }
      
      if (allData.length > 0) {
        await saveHistoricalData(assetSymbol, allData);
        console.log(`✅ Saved ${allData.length} records for ${assetSymbol}`);
      } else {
        console.log(`❌ No data fetched for ${assetSymbol}`);
      }
      
      // Add delay between assets
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error processing ${assetSymbol}:`, error.message);
    }
  }
  
  console.log('\nHistorical data fetch completed!');
}

// Main function
async function main() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Cleaning up old data...');
    await cleanupOldData();
    
    console.log('Fetching historical data...');
    await fetchAllHistoricalData();
    
    console.log('✅ Historical data fetch completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main(); 