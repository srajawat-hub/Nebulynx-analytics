const { getDatabase } = require('../database/database');
const { initializeDatabase } = require('../database/database');

// Generate realistic price variations
function generatePriceVariation(basePrice, volatility = 0.05) {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return basePrice * (1 + change);
}

// Generate historical data for the past 3 months
async function generateHistoricalData() {
  console.log('Generating historical price data...');
  
  const db = getDatabase();
  
  // Base prices for each asset
  const basePrices = {
    'BTC': 120000,
    'ETH': 3700,
    'XRP': 3.2,
    'ADA': 0.82,
    'DOT': 4.1,
    'LINK': 18.5,
    'LTC': 114,
    'BCH': 524,
    'TON': 1.38,
    'GOLD': 55568
  };
  
  const assetNames = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'XRP': 'Ripple',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
    'LINK': 'Chainlink',
    'LTC': 'Litecoin',
    'BCH': 'Bitcoin Cash',
    'TON': 'Tokamak Network',
    'GOLD': 'Gold'
  };
  
  const currencies = {
    'BTC': 'USD', 'ETH': 'USD', 'XRP': 'USD', 'ADA': 'USD', 'DOT': 'USD',
    'LINK': 'USD', 'LTC': 'USD', 'BCH': 'USD', 'TON': 'USD', 'GOLD': 'INR'
  };
  
  // Generate data for the past 3 months (90 days)
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
  
  console.log(`Generating data from ${threeMonthsAgo.toISOString()} to ${now.toISOString()}`);
  
  // Generate data points every hour for the past 3 months
  const totalHours = 90 * 24; // 90 days * 24 hours
  let currentPrice = { ...basePrices };
  
  for (let i = 0; i < totalHours; i++) {
    const timestamp = new Date(threeMonthsAgo.getTime() + (i * 60 * 60 * 1000));
    
    // Update prices with realistic variations
    for (const [symbol, basePrice] of Object.entries(basePrices)) {
      currentPrice[symbol] = generatePriceVariation(currentPrice[symbol], 0.02); // 2% volatility per hour
      
      // Ensure prices stay within reasonable bounds
      if (symbol === 'BTC') currentPrice[symbol] = Math.max(80000, Math.min(150000, currentPrice[symbol]));
      else if (symbol === 'ETH') currentPrice[symbol] = Math.max(2500, Math.min(5000, currentPrice[symbol]));
      else if (symbol === 'XRP') currentPrice[symbol] = Math.max(2, Math.min(5, currentPrice[symbol]));
      else if (symbol === 'ADA') currentPrice[symbol] = Math.max(0.5, Math.min(1.2, currentPrice[symbol]));
      else if (symbol === 'DOT') currentPrice[symbol] = Math.max(3, Math.min(6, currentPrice[symbol]));
      else if (symbol === 'LINK') currentPrice[symbol] = Math.max(15, Math.min(25, currentPrice[symbol]));
      else if (symbol === 'LTC') currentPrice[symbol] = Math.max(100, Math.min(130, currentPrice[symbol]));
      else if (symbol === 'BCH') currentPrice[symbol] = Math.max(400, Math.min(600, currentPrice[symbol]));
      else if (symbol === 'TON') currentPrice[symbol] = Math.max(1, Math.min(2, currentPrice[symbol]));
      else if (symbol === 'GOLD') currentPrice[symbol] = Math.max(50000, Math.min(60000, currentPrice[symbol]));
      
      // Insert into database
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO price_history (asset_symbol, asset_name, currency, price, timestamp) VALUES (?, ?, ?, ?, ?)',
          [symbol, assetNames[symbol], currencies[symbol], currentPrice[symbol], timestamp.toISOString()],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    // Progress indicator
    if (i % 1000 === 0) {
      console.log(`Generated ${i}/${totalHours} hours of data...`);
    }
  }
  
  console.log('Historical data generation completed!');
  console.log(`Generated ${totalHours * Object.keys(basePrices).length} price records`);
}

// Run the script
async function main() {
  try {
    await initializeDatabase();
    await generateHistoricalData();
    process.exit(0);
  } catch (error) {
    console.error('Error generating historical data:', error);
    process.exit(1);
  }
}

main(); 