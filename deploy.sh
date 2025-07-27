#!/bin/bash

echo "🚀 Starting Nebulynx Analytics Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install nginx (optional, for reverse proxy)
echo "📦 Installing nginx..."
sudo apt-get install -y nginx

# Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /var/www/nebulynx-analytics
sudo chown $USER:$USER /var/www/nebulynx-analytics

# Navigate to app directory
cd /var/www/nebulynx-analytics

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install --production

# Create logs directory
mkdir -p logs

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

echo "✅ Deployment completed successfully!"
echo "🌐 Your app should be running on: http://YOUR_EC2_IP:3004"
echo "📊 PM2 Status: pm2 status"
echo "📋 PM2 Logs: pm2 logs" 