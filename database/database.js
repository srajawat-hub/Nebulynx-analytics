const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'trading_notifications.db');
const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create alerts table
      db.run(`
        CREATE TABLE IF NOT EXISTS alerts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          asset_symbol TEXT NOT NULL,
          asset_name TEXT NOT NULL,
          currency TEXT NOT NULL,
          threshold_price REAL NOT NULL,
          condition_type TEXT NOT NULL CHECK(condition_type IN ('above', 'below')),
          is_active BOOLEAN DEFAULT 1,
          notification_email TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_triggered DATETIME
        )
      `);

      // Create price_history table
      db.run(`
        CREATE TABLE IF NOT EXISTS price_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset_symbol TEXT NOT NULL,
          asset_name TEXT NOT NULL,
          currency TEXT NOT NULL,
          price REAL NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create notifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          alert_id INTEGER,
          user_id INTEGER,
          asset_symbol TEXT NOT NULL,
          asset_name TEXT NOT NULL,
          currency TEXT NOT NULL,
          threshold_price REAL NOT NULL,
          current_price REAL NOT NULL,
          condition_type TEXT NOT NULL,
          sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'sent'
        )
      `);

      // Create asset_details table for additional asset information
      db.run(`
        CREATE TABLE IF NOT EXISTS asset_details (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset_symbol TEXT UNIQUE NOT NULL,
          asset_name TEXT NOT NULL,
          market_cap REAL,
          volume_24h REAL,
          circulating_supply REAL,
          total_supply REAL,
          max_supply REAL,
          launch_date TEXT,
          description TEXT,
          website TEXT,
          whitepaper TEXT,
          github TEXT,
          twitter TEXT,
          reddit TEXT,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create price_history_hourly table for detailed price tracking
      db.run(`
        CREATE TABLE IF NOT EXISTS price_history_hourly (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset_symbol TEXT NOT NULL,
          asset_name TEXT NOT NULL,
          currency TEXT NOT NULL,
          price REAL NOT NULL,
          volume_24h REAL,
          market_cap REAL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create favorites table for user favorite assets
      db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          asset_symbol TEXT NOT NULL,
          asset_name TEXT NOT NULL,
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, asset_symbol)
        )
      `);

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_price_history_symbol_timestamp ON price_history(asset_symbol, timestamp)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_price_history_hourly_symbol_timestamp ON price_history_hourly(asset_symbol, timestamp)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_alerts_symbol ON alerts(asset_symbol)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_notifications_symbol ON notifications(asset_symbol)`);

      db.run("PRAGMA foreign_keys = ON", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

// Function to populate initial price history data
function populateInitialPriceHistory() {
  return new Promise((resolve, reject) => {
    const { SUPPORTED_ASSETS } = require('../services/priceMonitor');
    
    // Check if we already have price history data
    db.get("SELECT COUNT(*) as count FROM price_history", (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      // If we have data, don't populate
      if (row.count > 0) {
        console.log('Price history data already exists, skipping initial population');
        resolve();
        return;
      }
      
      console.log('Populating initial price history data...');
      
      const now = new Date();
      const assets = Object.keys(SUPPORTED_ASSETS);
      
      // Create sample price history for the last 24 hours
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
        
        assets.forEach(symbol => {
          const asset = SUPPORTED_ASSETS[symbol];
          if (!asset) return;
          
          // Generate a realistic price with some variation
          let basePrice;
          switch (symbol) {
            case 'BTC': basePrice = 118000 + (Math.random() - 0.5) * 2000; break;
            case 'ETH': basePrice = 3700 + (Math.random() - 0.5) * 100; break;
            case 'XRP': basePrice = 3.2 + (Math.random() - 0.5) * 0.1; break;
            case 'ADA': basePrice = 0.82 + (Math.random() - 0.5) * 0.02; break;
            case 'DOT': basePrice = 4.0 + (Math.random() - 0.5) * 0.1; break;
            case 'LINK': basePrice = 18.0 + (Math.random() - 0.5) * 0.5; break;
            case 'LTC': basePrice = 114 + (Math.random() - 0.5) * 2; break;
            case 'BCH': basePrice = 518 + (Math.random() - 0.5) * 4; break;
            case 'TON': basePrice = 1.37 + (Math.random() - 0.5) * 0.02; break;
            case 'GOLD': basePrice = 55568 + (Math.random() - 0.5) * 100; break;
            default: basePrice = 100 + (Math.random() - 0.5) * 10;
          }
          
          db.run(`
            INSERT INTO price_history (asset_symbol, asset_name, currency, price, timestamp)
            VALUES (?, ?, ?, ?, ?)
          `, [
            symbol,
            asset.name,
            asset.currency,
            basePrice,
            timestamp.toISOString()
          ]);
        });
      }
      
      console.log('Initial price history data populated successfully');
      resolve();
    });
  });
}

function getDatabase() {
  return db;
}

module.exports = {
  initializeDatabase,
  populateInitialPriceHistory,
  getDatabase
}; 