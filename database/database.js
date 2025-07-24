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

function getDatabase() {
  return db;
}

module.exports = {
  initializeDatabase,
  getDatabase
}; 