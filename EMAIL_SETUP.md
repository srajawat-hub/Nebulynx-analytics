# 📧 Email Setup Guide - Gmail SMTP (FREE)

## 🎉 **NEW: Gmail SMTP Integration**

We've switched from Resend to **Gmail SMTP** which offers:
- ✅ **Completely FREE** - no email limits
- ✅ **No domain required** - uses your Gmail address
- ✅ **Can send to ANY email address** - no restrictions
- ✅ **High deliverability** - Gmail is trusted worldwide
- ✅ **Professional email templates**

## 🚀 **Setup Steps:**

### 1. Enable 2-Factor Authentication on Gmail
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Under "Signing in to Google," click **2-Step Verification**
4. Follow the steps to turn on 2-Step Verification

### 2. Generate App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** from the dropdown
3. Click **Generate**
4. Copy the **16-character password** (e.g., `abcd efgh ijkl mnop`)

### 3. Configure Environment Variables
Create a `.env` file in your project root:

```bash
# Email Configuration (Gmail SMTP)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password
```

**Example:**
```bash
GMAIL_USER=shailendra@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 4. Test Email Service
1. Restart your server: `npm start`
2. Create a price alert with any email address
3. Wait for the price condition to trigger
4. Check the recipient's inbox (and spam folder)

## 🎯 **Benefits of Gmail SMTP:**

### **vs Resend:**
- ✅ **No domain verification required**
- ✅ **No email limits** (vs 100/day on Resend free tier)
- ✅ **Can send to any email address** (vs only verified emails on Resend)
- ✅ **Completely free forever**

### **vs Other Services:**
- ✅ **No credit card required**
- ✅ **No monthly limits**
- ✅ **Professional appearance**
- ✅ **High deliverability**

## 📧 **Email Template Features:**

Your emails will include:
- 🚨 **Alert header** with emoji and direction
- 📊 **Current price vs threshold** comparison
- 🎯 **Clear condition explanation**
- 📅 **Timestamp**
- 🎨 **Professional styling** with Nebulynx branding
- 📱 **Mobile-responsive design**

## 🔧 **Troubleshooting:**

### **If emails don't send:**
1. **Check Gmail credentials** in `.env` file
2. **Verify 2FA is enabled** on your Gmail account
3. **Ensure App Password is correct** (16 characters)
4. **Check server logs** for error messages
5. **Look in spam folder** of recipient

### **Common Issues:**
- **"Invalid credentials"**: Check App Password format
- **"Less secure app"**: Use App Password, not regular password
- **"Rate limit exceeded"**: Gmail has very high limits, rarely an issue

## 🚀 **Alternative Services (if needed):**

### **SendGrid** (100 emails/day free)
```bash
npm install @sendgrid/mail
```
- Requires credit card for verification
- Eventually needs domain for production

### **Mailgun** (5,000 emails/month free)
```bash
npm install mailgun.js
```
- Requires credit card for verification
- Domain required after 3 months

### **Gmail SMTP** (RECOMMENDED) ✅
- **No limits**
- **No domain required**
- **Completely free**
- **High deliverability**

## 📊 **Current Status:**
- ✅ **Gmail SMTP integration implemented**
- ✅ **Professional email templates**
- ✅ **No email limits**
- ✅ **Can send to any email address**
- ⏳ **Waiting for Gmail credentials configuration**

## 🎉 **Ready to Use!**

Once you add your Gmail credentials to the `.env` file, you'll receive real email notifications when price alerts are triggered - **to any email address you want!**

**No more domain verification, no more email limits, no more restrictions!** 🚀 