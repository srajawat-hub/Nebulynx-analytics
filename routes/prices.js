const express = require('express');
const { getDatabase } = require('../database/database');
const { fetchAllPrices, SUPPORTED_ASSETS } = require('../services/priceMonitor');

const router = express.Router();

// Get current prices for all supported assets
router.get('/current', async (req, res) => {
  try {
    const prices = await fetchAllPrices();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching current prices:', error);
    res.status(500).json({ error: 'Failed to fetch current prices' });
  }
});

// Get current price for a specific asset
router.get('/current/:symbol', async (req, res) => {
  const { symbol } = req.params;
  
  if (!SUPPORTED_ASSETS[symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  try {
    const prices = await fetchAllPrices();
    const assetPrice = prices[symbol];
    
    if (!assetPrice) {
      return res.status(404).json({ error: `Price not available for ${symbol}` });
    }
    
    res.json(assetPrice);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    res.status(500).json({ error: `Failed to fetch price for ${symbol}` });
  }
});

// Get price history for an asset
router.get('/history/:symbol', (req, res) => {
  const { symbol } = req.params;
  const { limit = 100, days = 7 } = req.query;
  
  if (!SUPPORTED_ASSETS[symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  const db = getDatabase();
  
  db.all(
    `SELECT * FROM price_history 
     WHERE asset_symbol = ? 
     AND timestamp >= datetime('now', '-${days} days')
     ORDER BY timestamp DESC 
     LIMIT ?`,
    [symbol, parseInt(limit)],
    (err, history) => {
      if (err) {
        console.error('Error fetching price history:', err);
        return res.status(500).json({ error: 'Failed to fetch price history' });
      }
      res.json(history);
    }
  );
});

// Get price history for all assets
router.get('/history', (req, res) => {
  const { limit = 50, days = 1 } = req.query;
  const db = getDatabase();
  
  db.all(
    `SELECT * FROM price_history 
     WHERE timestamp >= datetime('now', '-${days} days')
     ORDER BY timestamp DESC, asset_symbol ASC 
     LIMIT ?`,
    [parseInt(limit)],
    (err, history) => {
      if (err) {
        console.error('Error fetching price history:', err);
        return res.status(500).json({ error: 'Failed to fetch price history' });
      }
      res.json(history);
    }
  );
});

// Get price statistics for an asset
router.get('/stats/:symbol', (req, res) => {
  const { symbol } = req.params;
  const { days = 7 } = req.query;
  
  if (!SUPPORTED_ASSETS[symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  const db = getDatabase();
  
  db.get(
    `SELECT 
       MIN(price) as min_price,
       MAX(price) as max_price,
       AVG(price) as avg_price,
       COUNT(*) as data_points,
       MIN(timestamp) as first_record,
       MAX(timestamp) as last_record
     FROM price_history 
     WHERE asset_symbol = ? 
     AND timestamp >= datetime('now', '-${days} days')`,
    [symbol],
    (err, stats) => {
      if (err) {
        console.error('Error fetching price statistics:', err);
        return res.status(500).json({ error: 'Failed to fetch price statistics' });
      }
      
      if (!stats.data_points) {
        return res.status(404).json({ error: 'No price data available for the specified period' });
      }
      
      res.json({
        asset_symbol: symbol,
        asset_name: SUPPORTED_ASSETS[symbol].name,
        currency: SUPPORTED_ASSETS[symbol].currency,
        period_days: parseInt(days),
        ...stats,
        min_price: parseFloat(stats.min_price),
        max_price: parseFloat(stats.max_price),
        avg_price: parseFloat(stats.avg_price),
        price_change: parseFloat(stats.max_price) - parseFloat(stats.min_price),
        price_change_percent: ((parseFloat(stats.max_price) - parseFloat(stats.min_price)) / parseFloat(stats.min_price)) * 100
      });
    }
  );
});

// Get supported assets
router.get('/supported-assets', (req, res) => {
  res.json(SUPPORTED_ASSETS);
});

module.exports = router; 