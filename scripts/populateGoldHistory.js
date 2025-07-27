const { getDatabase } = require('../database/database');
const { fetchHistoricalGoldPrices } = require('../services/priceMonitor');

// MetalpriceAPI configuration
const METALPRICEAPI_BASE_URL = 'https://api.metalpriceapi.com/v1';
const METALPRICEAPI_KEY = process.env.METALPRICEAPI_KEY || '080cdd4a9c1c116fbb3b4efc1328c314';

async function populateGoldHistory() {
  const db = getDatabase();
  
  try {
    console.log('🚀 Starting to populate gold price history with MetalpriceAPI...');
    
    // Clear existing gold price history
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM price_history WHERE asset_symbol = ?', ['GOLD'], (err) => {
        if (err) reject(err);
        else {
          console.log('✅ Cleared existing gold price history');
          resolve();
        }
      });
    });

    // Fetch historical data from MetalpriceAPI
    const historicalPrices = await fetchHistoricalGoldPrices();
    
    if (historicalPrices.length > 0) {
      console.log(`📊 Inserting ${historicalPrices.length} historical gold prices...`);
      
      for (const priceData of historicalPrices) {
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT OR REPLACE INTO price_history
            (asset_symbol, asset_name, price, currency, timestamp)
            VALUES (?, ?, ?, ?, ?)
          `, [
            'GOLD',
            'Gold',
            priceData.price,
            'INR',
            priceData.date + 'T00:00:00.000Z'
          ], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      
      console.log('✅ Successfully populated gold price history with real data');
    } else {
      console.log('⚠️ No historical data fetched, generating simulated data...');
      
      // Generate simulated historical data as fallback
      const today = new Date();
      const basePrice = 100885; // Current market price estimate for 10 grams (Mumbai 24K gold)
      
      for (let i = 90; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate realistic price variation (±5%)
        const variation = (Math.random() - 0.5) * 0.1; // ±5%
        const price = Math.round(basePrice * (1 + variation));
        
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT OR REPLACE INTO price_history
            (asset_symbol, asset_name, price, currency, timestamp)
            VALUES (?, ?, ?, ?, ?)
          `, [
            'GOLD',
            'Gold',
            price,
            'INR',
            date.toISOString()
          ], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      
      console.log('✅ Successfully populated gold price history with simulated data');
    }
    
  } catch (error) {
    console.error('❌ Error populating gold history:', error);
  } finally {
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('✅ Database connection closed');
      }
    });
  }
}

// Run the script
populateGoldHistory(); 