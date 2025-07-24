const express = require('express');
const { getDatabase } = require('../database/database');

const router = express.Router();

// Get all notifications
router.get('/', (req, res) => {
  const { limit = 100, days = 30 } = req.query;
  const db = getDatabase();
  
  db.all(
    `SELECT n.*, a.asset_name, u.name as user_name, u.email as user_email
     FROM notifications n
     LEFT JOIN alerts a ON n.alert_id = a.id
     LEFT JOIN users u ON n.user_id = u.id
     WHERE n.sent_at >= datetime('now', '-${days} days')
     ORDER BY n.sent_at DESC
     LIMIT ?`,
    [parseInt(limit)],
    (err, notifications) => {
      if (err) {
        console.error('Error fetching notifications:', err);
        return res.status(500).json({ error: 'Failed to fetch notifications' });
      }
      res.json(notifications);
    }
  );
});

// Get notifications by user ID
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { limit = 50, days = 30 } = req.query;
  const db = getDatabase();
  
  db.all(
    `SELECT n.*, a.asset_name
     FROM notifications n
     LEFT JOIN alerts a ON n.alert_id = a.id
     WHERE n.user_id = ?
     AND n.sent_at >= datetime('now', '-${days} days')
     ORDER BY n.sent_at DESC
     LIMIT ?`,
    [userId, parseInt(limit)],
    (err, notifications) => {
      if (err) {
        console.error('Error fetching user notifications:', err);
        return res.status(500).json({ error: 'Failed to fetch user notifications' });
      }
      res.json(notifications);
    }
  );
});

// Get notifications by alert ID
router.get('/alert/:alertId', (req, res) => {
  const { alertId } = req.params;
  const { limit = 20 } = req.query;
  const db = getDatabase();
  
  db.all(
    `SELECT n.*, a.asset_name
     FROM notifications n
     LEFT JOIN alerts a ON n.alert_id = a.id
     WHERE n.alert_id = ?
     ORDER BY n.sent_at DESC
     LIMIT ?`,
    [alertId, parseInt(limit)],
    (err, notifications) => {
      if (err) {
        console.error('Error fetching alert notifications:', err);
        return res.status(500).json({ error: 'Failed to fetch alert notifications' });
      }
      res.json(notifications);
    }
  );
});

// Get notification statistics
router.get('/stats', (req, res) => {
  const { days = 7 } = req.query;
  const db = getDatabase();
  
  db.get(
    `SELECT 
       COUNT(*) as total_notifications,
       COUNT(CASE WHEN status = 'sent' THEN 1 END) as successful_notifications,
       COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_notifications,
       COUNT(DISTINCT user_id) as unique_users,
       COUNT(DISTINCT asset_symbol) as unique_assets,
       MIN(sent_at) as first_notification,
       MAX(sent_at) as last_notification
     FROM notifications 
     WHERE sent_at >= datetime('now', '-${days} days')`,
    [],
    (err, stats) => {
      if (err) {
        console.error('Error fetching notification statistics:', err);
        return res.status(500).json({ error: 'Failed to fetch notification statistics' });
      }
      
      res.json({
        period_days: parseInt(days),
        ...stats,
        success_rate: stats.total_notifications > 0 
          ? ((stats.successful_notifications / stats.total_notifications) * 100).toFixed(2)
          : 0
      });
    }
  );
});

// Get notifications by asset
router.get('/asset/:symbol', (req, res) => {
  const { symbol } = req.params;
  const { limit = 50, days = 30 } = req.query;
  const db = getDatabase();
  
  db.all(
    `SELECT n.*, a.asset_name, u.name as user_name
     FROM notifications n
     LEFT JOIN alerts a ON n.alert_id = a.id
     LEFT JOIN users u ON n.user_id = u.id
     WHERE n.asset_symbol = ?
     AND n.sent_at >= datetime('now', '-${days} days')
     ORDER BY n.sent_at DESC
     LIMIT ?`,
    [symbol, parseInt(limit)],
    (err, notifications) => {
      if (err) {
        console.error('Error fetching asset notifications:', err);
        return res.status(500).json({ error: 'Failed to fetch asset notifications' });
      }
      res.json(notifications);
    }
  );
});

// Delete old notifications (cleanup)
router.delete('/cleanup', (req, res) => {
  const { days = 90 } = req.query;
  const db = getDatabase();
  
  db.run(
    'DELETE FROM notifications WHERE sent_at < datetime("now", "-? days")',
    [parseInt(days)],
    function(err) {
      if (err) {
        console.error('Error cleaning up notifications:', err);
        return res.status(500).json({ error: 'Failed to cleanup notifications' });
      }
      
      res.json({ 
        message: `Deleted ${this.changes} notifications older than ${days} days` 
      });
    }
  );
});

module.exports = router; 