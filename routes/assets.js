const express = require('express');
const { getAssetDetails, getPriceHistory, updateAllAssetDetails, ASSET_CONFIG } = require('../services/assetService');
const { SUPPORTED_ASSETS } = require('../services/priceMonitor');

const router = express.Router();

// Get asset details
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  
  if (!SUPPORTED_ASSETS[symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  try {
    const details = await getAssetDetails(symbol);
    
    if (!details) {
      return res.status(404).json({ error: `Asset details not found for ${symbol}` });
    }
    
    res.json(details);
  } catch (error) {
    console.error(`Error fetching asset details for ${symbol}:`, error);
    res.status(500).json({ error: `Failed to fetch asset details for ${symbol}` });
  }
});

// Get price history for different time periods
router.get('/:symbol/price-history', async (req, res) => {
  const { symbol } = req.params;
  const { period = '24h' } = req.query;
  
  if (!SUPPORTED_ASSETS[symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  const validPeriods = ['24h', '7d', '1m', '3m'];
  if (!validPeriods.includes(period)) {
    return res.status(400).json({ 
      error: `Invalid period. Valid periods: ${validPeriods.join(', ')}` 
    });
  }
  
  try {
    const history = await getPriceHistory(symbol, period);
    res.json({
      symbol,
      period,
      data: history
    });
  } catch (error) {
    console.error(`Error fetching price history for ${symbol}:`, error);
    res.status(500).json({ error: `Failed to fetch price history for ${symbol}` });
  }
});

// Get all supported assets with basic info
router.get('/', (req, res) => {
  const assets = Object.entries(SUPPORTED_ASSETS).map(([symbol, config]) => ({
    symbol,
    name: config.name,
    currency: config.currency,
    type: config.type
  }));
  
  res.json(assets);
});

// Update all asset details (admin endpoint)
router.post('/update-details', async (req, res) => {
  try {
    console.log('🔄 Updating all asset details from API...');
    await updateAllAssetDetails();
    res.json({ message: 'Asset details updated successfully' });
  } catch (error) {
    console.error('Error updating asset details:', error);
    res.status(500).json({ error: 'Failed to update asset details' });
  }
});

// Force refresh asset details with real data
router.post('/refresh-data', async (req, res) => {
  try {
    console.log('🔄 Force refreshing asset data with real market information...');
    const { populateAssetDetails } = require('../scripts/populateAssetDetails');
    await populateAssetDetails();
    res.json({ message: 'Asset data refreshed successfully with real market data' });
  } catch (error) {
    console.error('Error refreshing asset data:', error);
    res.status(500).json({ error: 'Failed to refresh asset data' });
  }
});

module.exports = router; 