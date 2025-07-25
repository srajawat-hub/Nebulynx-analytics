#!/usr/bin/env node

const { populateAssetDetails } = require('./populateAssetDetails');

console.log('🔄 Starting asset data update...');
console.log('This will fetch real market data from CoinGecko API for all supported assets.\n');

populateAssetDetails()
  .then(() => {
    console.log('\n✅ Asset data update completed successfully!');
    console.log('All assets now have real market cap, volume, and supply data.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Asset data update failed:', error);
    process.exit(1);
  }); 