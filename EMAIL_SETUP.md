# 📧 Email Setup Guide

## Free Email Service: Resend

We're using **Resend** as our email service provider, which offers:
- **100 free emails per day** (perfect for testing and small-scale use)
- **No credit card required** for signup
- **Simple API integration**

## Setup Steps:

### 1. Sign up for Resend
1. Go to [resend.com](https://resend.com)
2. Click "Sign up" and create a free account
3. Verify your email address

### 2. Get your API Key
1. After signing in, go to the **API Keys** section
2. Click "Create API Key"
3. Give it a name like "Trading Alerts"
4. Copy the API key (starts with `re_`)

### 3. Configure the Environment
Add your API key to your environment:

```bash
export RESEND_API_KEY="re_your_actual_api_key_here"
```

Or create a `.env` file in the project root:
```
RESEND_API_KEY=re_your_actual_api_key_here
```

### 4. Test the Email Service
Once configured, create an alert and the system will send real email notifications instead of just console logs.

## Alternative Free Email Services:

If you prefer other options:

### 1. **SendGrid** (100 emails/day free)
- Sign up at [sendgrid.com](https://sendgrid.com)
- Get API key and configure

### 2. **Mailgun** (5,000 emails/month free)
- Sign up at [mailgun.com](https://mailgun.com)
- Get API key and configure

### 3. **Gmail SMTP** (Free but requires app password)
- Enable 2-factor authentication on Gmail
- Generate app password
- Configure with Gmail SMTP settings

## Current Status:
- ✅ **Resend integration implemented**
- ✅ **Free tier: 100 emails/day**
- ✅ **Professional email templates**
- ⏳ **Waiting for API key configuration**

Once you add your Resend API key, you'll receive real email notifications when price alerts are triggered! 