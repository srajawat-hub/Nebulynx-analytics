const { getDatabase } = require('../database/database');
const { initializeDatabase } = require('../database/database');

// Generate realistic price movements for Tokamak Network TON
function generateTONPriceMovement(currentPrice, hourIndex, totalHours) {
  // Create a realistic price trend for TON over 3 months
  const progress = hourIndex / totalHours;
  
  // Start from a lower price and trend upward with some volatility
  const baseTrend = 0.0001; // Slight upward trend
  const volatility = 0.03; // 3% volatility
  
  // Add some market cycles
  const cycle1 = Math.sin(progress * Math.PI * 2) * 0.1; // First cycle
  const cycle2 = Math.sin(progress * Math.PI * 4) * 0.05; // Second cycle
  
  const trend = baseTrend + cycle1 + cycle2;
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  
  return currentPrice * (1 + randomChange + trend);
}

// Regenerate TON price history with realistic data
async function regenerateTONHistory() {
  console.log('🔄 Regenerating Tokamak Network TON price history...');
  
  const db = getDatabase();
  
  // Clear existing TON price history
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM price_history WHERE asset_symbol = ?', ['TON'], (err) => {
      if (err) reject(err);
      else {
        console.log('✅ Cleared existing TON price history');
        resolve();
      }
    });
  });
  
  // Generate data for the past 3 months (90 days)
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
  
  console.log(`📅 Generating TON data from ${threeMonthsAgo.toISOString()} to ${now.toISOString()}`);
  
  // Generate data points every hour for the past 3 months
  const totalHours = 90 * 24; // 90 days * 24 hours
  let currentTONPrice = 1.15; // Start from $1.15 and grow to current $1.42
  
  console.log(`💰 Starting TON price: $${currentTONPrice}`);
  
  for (let i = 0; i < totalHours; i++) {
    const timestamp = new Date(threeMonthsAgo.getTime() + (i * 60 * 60 * 1000));
    
    // Generate realistic TON price movement
    currentTONPrice = generateTONPriceMovement(currentTONPrice, i, totalHours);
    
    // Ensure price stays within realistic bounds for Tokamak Network TON
    currentTONPrice = Math.max(1.0, Math.min(1.8, currentTONPrice));
    
    // Insert into database
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO price_history (asset_symbol, asset_name, currency, price, timestamp) VALUES (?, ?, ?, ?, ?)',
        ['TON', 'Tokamak Network', 'USD', currentTONPrice, timestamp.toISOString()],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    // Progress indicator
    if (i % 1000 === 0) {
      console.log(`📊 Generated ${i}/${totalHours} hours of TON data... Current price: $${currentTONPrice.toFixed(4)}`);
    }
  }
  
  console.log('✅ TON price history regeneration completed!');
  console.log(`📈 Generated ${totalHours} TON price records`);
  console.log(`💰 Final TON price: $${currentTONPrice.toFixed(4)}`);
  
  // Show some sample data points
  console.log('\n📊 Sample TON price data:');
  const sampleData = await new Promise((resolve, reject) => {
    db.all(
      'SELECT price, timestamp FROM price_history WHERE asset_symbol = ? ORDER BY timestamp DESC LIMIT 5',
      ['TON'],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
  
  sampleData.forEach((row, index) => {
    const date = new Date(row.timestamp).toLocaleDateString();
    console.log(`   ${date}: $${row.price.toFixed(4)}`);
  });
}

// Run the script
if (require.main === module) {
  regenerateTONHistory()
    .then(() => {
      console.log('🎉 TON price history regeneration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error regenerating TON price history:', error);
      process.exit(1);
    });
}

module.exports = { regenerateTONHistory }; 