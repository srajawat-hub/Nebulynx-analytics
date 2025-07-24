const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { initializeDatabase, populateInitialPriceHistory } = require('./database/database');
const alertRoutes = require('./routes/alerts');
const priceRoutes = require('./routes/prices');
const notificationRoutes = require('./routes/notifications');
const assetRoutes = require('./routes/assets');
const { startPriceMonitoring } = require('./services/priceMonitor');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/alerts', alertRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assets', assetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Trading Notification API is running' });
});

// Database health check endpoint
app.get('/api/health/db', async (req, res) => {
  try {
    const { getDatabase } = require('./database/database');
    const db = getDatabase();
    
    // Check if we can query the database
    const assetCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM asset_details", (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    const priceCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM price_history", (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    res.json({ 
      status: 'OK', 
      message: 'Database is working',
      asset_details_count: assetCount,
      price_history_count: priceCount
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database health check failed',
      error: error.message 
    });
  }
});

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    // Populate asset details if needed
    const { populateAssetDetails } = require('./scripts/populateAssetDetails');
    await populateAssetDetails();
    console.log('Asset details populated successfully');
    
    // Populate initial price history if needed
    await populateInitialPriceHistory();
    console.log('Initial price history populated successfully');
    
    // Start price monitoring service
    startPriceMonitoring();
    console.log('Price monitoring service started');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 