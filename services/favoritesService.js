const { getDatabase } = require('../database/database');
const { SUPPORTED_ASSETS } = require('./priceMonitor');

// Add an asset to user's favorites
async function addToFavorites(userId, assetSymbol) {
  const db = getDatabase();
  
  // Check if asset is supported
  if (!SUPPORTED_ASSETS[assetSymbol]) {
    throw new Error(`Unsupported asset: ${assetSymbol}`);
  }
  
  const assetName = SUPPORTED_ASSETS[assetSymbol].name;
  
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO favorites (user_id, asset_symbol, asset_name) VALUES (?, ?, ?)',
      [userId, assetSymbol, assetName],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            user_id: userId,
            asset_symbol: assetSymbol,
            asset_name: assetName,
            added_at: new Date().toISOString()
          });
        }
      }
    );
  });
}

// Remove an asset from user's favorites
async function removeFromFavorites(userId, assetSymbol) {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM favorites WHERE user_id = ? AND asset_symbol = ?',
      [userId, assetSymbol],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            deleted: this.changes > 0,
            user_id: userId,
            asset_symbol: assetSymbol
          });
        }
      }
    );
  });
}

// Get user's favorite assets
async function getFavorites(userId) {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

// Check if an asset is in user's favorites
async function isFavorite(userId, assetSymbol) {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM favorites WHERE user_id = ? AND asset_symbol = ?',
      [userId, assetSymbol],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      }
    );
  });
}

// Get favorite assets with current prices
async function getFavoritesWithPrices(userId) {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT f.*, ph.price as current_price, ph.currency
       FROM favorites f
       LEFT JOIN (
         SELECT asset_symbol, price, currency, timestamp
         FROM price_history
         WHERE id IN (
           SELECT MAX(id) FROM price_history GROUP BY asset_symbol
         )
       ) ph ON f.asset_symbol = ph.asset_symbol
       WHERE f.user_id = ?
       ORDER BY f.added_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

// Get favorite count for an asset
async function getFavoriteCount(assetSymbol) {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT COUNT(*) as count FROM favorites WHERE asset_symbol = ?',
      [assetSymbol],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.count : 0);
        }
      }
    );
  });
}

// Get most popular assets (most favorited)
async function getMostPopularAssets(limit = 10) {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT asset_symbol, asset_name, COUNT(*) as favorite_count
       FROM favorites
       GROUP BY asset_symbol, asset_name
       ORDER BY favorite_count DESC
       LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  isFavorite,
  getFavoritesWithPrices,
  getFavoriteCount,
  getMostPopularAssets
}; 