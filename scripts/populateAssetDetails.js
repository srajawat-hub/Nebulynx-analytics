const { getDatabase } = require('../database/database');
const { SUPPORTED_ASSETS } = require('../services/priceMonitor');
const { ASSET_CONFIG } = require('../services/assetService');

async function populateAssetDetails() {
  const db = getDatabase();
  
  console.log('Populating asset details...');
  
  for (const [symbol, config] of Object.entries(ASSET_CONFIG)) {
    try {
      const assetInfo = SUPPORTED_ASSETS[symbol];
      if (!assetInfo) continue;
      
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR REPLACE INTO asset_details 
          (asset_symbol, asset_name, market_cap, volume_24h, circulating_supply, total_supply, max_supply, launch_date, description, website, whitepaper, github, twitter, reddit, last_updated)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [
          symbol,
          assetInfo.name,
          null, // market_cap
          null, // volume_24h
          null, // circulating_supply
          null, // total_supply
          null, // max_supply
          config.launch_date,
          config.description,
          config.website,
          config.whitepaper,
          null, // github
          null, // twitter
          null, // reddit
        ], (err) => {
          if (err) {
            console.error(`Error inserting ${symbol}:`, err);
            reject(err);
          } else {
            console.log(`✅ Added asset details for ${symbol}`);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(`Failed to populate ${symbol}:`, error);
    }
  }
  
  console.log('Asset details population completed!');
}

// Export the function for use in server.js
module.exports = { populateAssetDetails };

// Run directly if this script is executed
if (require.main === module) {
  populateAssetDetails().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
} 