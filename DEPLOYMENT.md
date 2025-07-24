# Nebulynx Analytics - Deployment Guide

## 🚀 Quick Deploy to Render (Recommended)

### Step 1: Prepare Your Repository
1. Make sure your code is pushed to GitHub
2. Ensure all files are committed

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `nebulynx-analytics`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Environment Variables (Optional)
Add these in Render dashboard if needed:
- `NODE_ENV=production`
- `PORT=10000` (Render will set this automatically)

### Step 4: Deploy
Click "Create Web Service" and wait for deployment (5-10 minutes)

## 🌐 Alternative: Vercel + Railway (Better Performance)

### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Backend (Railway)
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Set root directory to project root
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

## 📋 Pre-deployment Checklist

- [ ] All code is committed to GitHub
- [ ] Database is properly configured
- [ ] Environment variables are set
- [ ] API keys are configured (if needed)
- [ ] CORS is properly configured
- [ ] Static files are being served correctly

## 🔧 Troubleshooting

### Common Issues:
1. **Build fails**: Check if all dependencies are in package.json
2. **Port issues**: Ensure server uses `process.env.PORT`
3. **Database errors**: Check database connection string
4. **CORS errors**: Verify CORS configuration

### Local Testing:
```bash
# Test production build locally
npm run build
npm start
```

## 🌍 After Deployment

1. **Test all features**: Navigation, search, alerts, notifications
2. **Check API endpoints**: Ensure all routes work
3. **Monitor logs**: Watch for any errors
4. **Share with friends**: Send them the live URL!

## 📱 Mobile Responsiveness

The app is already mobile-responsive, so it will work great on your friends' phones!

## 🔒 Security Notes

- API keys are not exposed in client-side code
- Database is properly secured
- HTTPS is automatically enabled on Render/Vercel

## 💰 Cost

- **Render**: Free (750 hours/month)
- **Vercel**: Free (unlimited)
- **Railway**: Free ($5 credit/month)

Your app will be completely free to host and share! 