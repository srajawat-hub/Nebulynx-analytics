const express = require('express');
const favoritesService = require('../services/favoritesService');
const { SUPPORTED_ASSETS } = require('../services/priceMonitor');

const router = express.Router();

// For demo purposes, using a default user ID
// In a real app, this would come from authentication middleware
const DEFAULT_USER_ID = 1;

// Add asset to favorites
router.post('/add/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const userId = req.body.userId || DEFAULT_USER_ID;
  
  if (!SUPPORTED_ASSETS[symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  try {
    const result = await favoritesService.addToFavorites(userId, symbol);
    res.json({
      success: true,
      message: `${symbol} added to favorites`,
      data: result
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to add asset to favorites' 
    });
  }
});

// Remove asset from favorites
router.delete('/remove/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const userId = req.body.userId || DEFAULT_USER_ID;
  
  try {
    const result = await favoritesService.removeFromFavorites(userId, symbol);
    res.json({
      success: true,
      message: `${symbol} removed from favorites`,
      data: result
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to remove asset from favorites' 
    });
  }
});

// Get user's favorites
router.get('/', async (req, res) => {
  const userId = req.query.userId || DEFAULT_USER_ID;
  
  try {
    const favorites = await favoritesService.getFavorites(userId);
    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch favorites' 
    });
  }
});

// Get user's favorites with current prices
router.get('/with-prices', async (req, res) => {
  const userId = req.query.userId || DEFAULT_USER_ID;
  
  try {
    const favorites = await favoritesService.getFavoritesWithPrices(userId);
    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorites with prices:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch favorites with prices' 
    });
  }
});

// Check if asset is in favorites
router.get('/check/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const userId = req.query.userId || DEFAULT_USER_ID;
  
  try {
    const isFav = await favoritesService.isFavorite(userId, symbol);
    res.json({
      success: true,
      data: {
        asset_symbol: symbol,
        is_favorite: isFav
      }
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check favorite status' 
    });
  }
});

// Get favorite count for an asset
router.get('/count/:symbol', async (req, res) => {
  const { symbol } = req.params;
  
  try {
    const count = await favoritesService.getFavoriteCount(symbol);
    res.json({
      success: true,
      data: {
        asset_symbol: symbol,
        favorite_count: count
      }
    });
  } catch (error) {
    console.error('Error fetching favorite count:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch favorite count' 
    });
  }
});

// Get most popular assets
router.get('/popular', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const popularAssets = await favoritesService.getMostPopularAssets(limit);
    res.json({
      success: true,
      data: popularAssets
    });
  } catch (error) {
    console.error('Error fetching popular assets:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch popular assets' 
    });
  }
});

// Toggle favorite status
router.post('/toggle/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const userId = req.body.userId || DEFAULT_USER_ID;
  
  if (!SUPPORTED_ASSETS[symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  try {
    const isCurrentlyFavorite = await favoritesService.isFavorite(userId, symbol);
    
    if (isCurrentlyFavorite) {
      // Remove from favorites
      const result = await favoritesService.removeFromFavorites(userId, symbol);
      res.json({
        success: true,
        message: `${symbol} removed from favorites`,
        data: {
          ...result,
          is_favorite: false
        }
      });
    } else {
      // Add to favorites
      const result = await favoritesService.addToFavorites(userId, symbol);
      res.json({
        success: true,
        message: `${symbol} added to favorites`,
        data: {
          ...result,
          is_favorite: true
        }
      });
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to toggle favorite status' 
    });
  }
});

module.exports = router; 