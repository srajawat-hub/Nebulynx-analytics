const express = require('express');
const { getDatabase } = require('../database/database');
const { SUPPORTED_ASSETS } = require('../services/priceMonitor');

const router = express.Router();

// Get all alerts
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all(
    `SELECT a.*, u.name as user_name, u.email as user_email 
     FROM alerts a 
     LEFT JOIN users u ON a.user_id = u.id 
     ORDER BY a.created_at DESC`,
    [],
    (err, alerts) => {
      if (err) {
        console.error('Error fetching alerts:', err);
        return res.status(500).json({ error: 'Failed to fetch alerts' });
      }
      res.json(alerts);
    }
  );
});

// Get alerts by user ID
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const db = getDatabase();
  
  db.all(
    'SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, alerts) => {
      if (err) {
        console.error('Error fetching user alerts:', err);
        return res.status(500).json({ error: 'Failed to fetch user alerts' });
      }
      res.json(alerts);
    }
  );
});

// Create a new alert
router.post('/', (req, res) => {
  const {
    user_id,
    asset_symbol,
    threshold_price,
    condition_type,
    notification_email
  } = req.body;
  
  // Validation
  if (!asset_symbol || !threshold_price || !condition_type || !notification_email) {
    return res.status(400).json({ 
      error: 'Missing required fields: asset_symbol, threshold_price, condition_type, notification_email' 
    });
  }
  
  if (!SUPPORTED_ASSETS[asset_symbol]) {
    return res.status(400).json({ 
      error: `Unsupported asset: ${asset_symbol}. Supported assets: ${Object.keys(SUPPORTED_ASSETS).join(', ')}` 
    });
  }
  
  if (!['above', 'below'].includes(condition_type)) {
    return res.status(400).json({ 
      error: 'condition_type must be either "above" or "below"' 
    });
  }
  
  if (threshold_price <= 0) {
    return res.status(400).json({ 
      error: 'threshold_price must be greater than 0' 
    });
  }
  
  const asset = SUPPORTED_ASSETS[asset_symbol];
  const db = getDatabase();
  
  db.run(
    `INSERT INTO alerts 
     (user_id, asset_symbol, asset_name, currency, threshold_price, condition_type, notification_email) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user_id || null, asset_symbol, asset.name, asset.currency, threshold_price, condition_type, notification_email],
    function(err) {
      if (err) {
        console.error('Error creating alert:', err);
        return res.status(500).json({ error: 'Failed to create alert' });
      }
      
      // Return the created alert
      db.get(
        'SELECT * FROM alerts WHERE id = ?',
        [this.lastID],
        (err, alert) => {
          if (err) {
            console.error('Error fetching created alert:', err);
            return res.status(500).json({ error: 'Alert created but failed to fetch details' });
          }
          res.status(201).json(alert);
        }
      );
    }
  );
});

// Update an alert
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    threshold_price,
    condition_type,
    notification_email,
    is_active
  } = req.body;
  
  const db = getDatabase();
  
  // Build update query dynamically
  const updates = [];
  const values = [];
  
  if (threshold_price !== undefined) {
    if (threshold_price <= 0) {
      return res.status(400).json({ error: 'threshold_price must be greater than 0' });
    }
    updates.push('threshold_price = ?');
    values.push(threshold_price);
  }
  
  if (condition_type !== undefined) {
    if (!['above', 'below'].includes(condition_type)) {
      return res.status(400).json({ error: 'condition_type must be either "above" or "below"' });
    }
    updates.push('condition_type = ?');
    values.push(condition_type);
  }
  
  if (notification_email !== undefined) {
    updates.push('notification_email = ?');
    values.push(notification_email);
  }
  
  if (is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(is_active ? 1 : 0);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  
  values.push(id);
  
  db.run(
    `UPDATE alerts SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        console.error('Error updating alert:', err);
        return res.status(500).json({ error: 'Failed to update alert' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      
      // Return the updated alert
      db.get(
        'SELECT * FROM alerts WHERE id = ?',
        [id],
        (err, alert) => {
          if (err) {
            console.error('Error fetching updated alert:', err);
            return res.status(500).json({ error: 'Alert updated but failed to fetch details' });
          }
          res.json(alert);
        }
      );
    }
  );
});

// Delete an alert
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  db.run(
    'DELETE FROM alerts WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Error deleting alert:', err);
        return res.status(500).json({ error: 'Failed to delete alert' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      
      res.json({ message: 'Alert deleted successfully' });
    }
  );
});

// Get supported assets
router.get('/supported-assets', (req, res) => {
  res.json(SUPPORTED_ASSETS);
});



module.exports = router; 