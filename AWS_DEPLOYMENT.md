# 🚀 AWS + Vercel Deployment Guide

## 📋 Prerequisites
- AWS Account (Free tier eligible)
- Vercel Account (Free)
- GitHub Repository with your code

## 🎯 Deployment Architecture
- **Backend**: AWS EC2 (Ubuntu 22.04)
- **Frontend**: Vercel
- **Database**: SQLite (on EC2)
- **Process Manager**: PM2

---

## 🔧 Phase 1: AWS EC2 Setup

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS (Free tier)
3. **Instance Type**: t2.micro (Free tier)
4. **Storage**: 8 GB gp2 (Free tier)
5. **Security Group**: Create new with these rules:
   ```
   SSH (22): 0.0.0.0/0
   HTTP (80): 0.0.0.0/0
   HTTPS (443): 0.0.0.0/0
   Custom TCP (3004): 0.0.0.0/0
   ```
6. **Key Pair**: Create new key pair (download .pem file)
7. **Launch Instance**

### Step 2: Connect to EC2

```bash
# Make key file executable
chmod 400 your-key.pem

# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 3: Deploy Backend

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/Nebulynx-analytics.git
cd Nebulynx-analytics

# Make deploy script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

### Step 4: Set Environment Variables

```bash
# Create .env file
nano .env
```

Add these environment variables:
```env
NODE_ENV=production
PORT=3004
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
METALPRICEAPI_KEY=080cdd4a9c1c116fbb3b4efc1328c314
```

### Step 5: Restart Application

```bash
# Restart PM2
pm2 restart all

# Check status
pm2 status
pm2 logs
```

---

## 🌐 Phase 2: Vercel Frontend Deployment

### Step 1: Prepare Frontend

1. **Update API URL** in your React app
2. **Build the frontend** locally to test
3. **Push to GitHub**

### Step 2: Deploy to Vercel

1. **Go to Vercel.com** → New Project
2. **Import GitHub repository**
3. **Configure settings**:
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://YOUR_EC2_IP:3004
   ```
5. **Deploy**

---

## 🔒 Phase 3: Security & SSL

### Option 1: Domain with SSL (Recommended)

1. **Buy domain** (GoDaddy, Namecheap, etc.)
2. **Point DNS** to your EC2 IP
3. **Set up SSL** with Let's Encrypt

### Option 2: Free SSL with Cloudflare

1. **Sign up for Cloudflare** (Free)
2. **Add your domain**
3. **Update nameservers**
4. **Enable SSL**

---

## 📊 Monitoring & Maintenance

### PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart app
pm2 restart nebulynx-analytics

# Monitor resources
pm2 monit
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Restart app
pm2 restart all
```

---

## 🚨 Troubleshooting

### Common Issues

1. **Port 3004 not accessible**
   - Check security group rules
   - Verify PM2 is running: `pm2 status`

2. **Database errors**
   - Check file permissions: `ls -la database/`
   - Restart app: `pm2 restart all`

3. **API not responding**
   - Check logs: `pm2 logs`
   - Verify environment variables

### Useful Commands
```bash
# Check if port is listening
sudo netstat -tlnp | grep 3004

# Check disk space
df -h

# Check memory usage
free -h

# View system logs
sudo journalctl -u nginx
```

---

## 🎉 Success!

Your app should now be live at:
- **Backend API**: `http://YOUR_EC2_IP:3004`
- **Frontend**: `https://your-vercel-app.vercel.app`

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Verify security group settings
3. Test API endpoints directly
4. Check Vercel deployment logs 