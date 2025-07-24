const { updateAllAssetDetails } = require('../services/assetService');
const { initializeDatabase } = require('../database/database');

async function populateAssetDetails() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Populating asset details...');
    await updateAllAssetDetails();
    
    console.log('Asset details populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error populating asset details:', error);
    process.exit(1);
  }
}

populateAssetDetails(); 