const nodemailer = require('nodemailer');
const { getDatabase } = require('../database/database');

// Gmail SMTP configuration (FREE, no domain required, can send to any email)
let transporter = null;

// Initialize Gmail SMTP transporter
function initializeEmailService() {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    console.log('✅ Gmail SMTP configured successfully');
    return true;
  } else {
    console.log('⚠️ Gmail credentials not configured, using demo mode');
    return false;
  }
}

async function sendEmailNotification(alert, currentPriceData) {
  const { asset_name, asset_symbol, currency, threshold_price, condition_type, notification_email } = alert;
  const { price: currentPrice } = currentPriceData;
  
  // If Gmail is not configured, use demo notification
  if (!transporter) {
    return sendDemoNotification(alert, currentPriceData);
  }
  
  const subject = `🚨 Price Alert: ${asset_name} (${asset_symbol})`;
  
  const conditionText = condition_type === 'above' ? 'above' : 'below';
  const direction = condition_type === 'above' ? '📈' : '📉';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #e74c3c; margin: 0; font-size: 24px;">${direction} Price Alert Triggered!</h2>
        <p style="color: #7f8c8d; margin: 5px 0;">Nebulynx Research Trading Alerts</p>
      </div>
      
      <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #2c3e50; font-size: 20px; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          ${asset_name} (${asset_symbol})
        </h3>
        
        <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
          <span style="font-weight: bold; color: #2c3e50;">Current Price:</span>
          <span style="color: #e74c3c; font-weight: bold; font-size: 18px;">
            ${currency} ${currentPrice.toLocaleString()}
          </span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
          <span style="font-weight: bold; color: #2c3e50;">Alert Threshold:</span>
          <span style="color: #3498db; font-weight: bold;">
            ${currency} ${threshold_price.toLocaleString()}
          </span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 15px 0; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">
          <span style="font-weight: bold; color: #2c3e50;">Condition:</span>
          <span style="color: #27ae60; font-weight: bold;">
            ${condition_type.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #ecf0f1; border-radius: 8px;">
        <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">
          This alert was triggered because ${asset_name} price is now ${conditionText} your threshold of ${currency} ${threshold_price.toLocaleString()}.
        </p>
        
        <p style="color: #7f8c8d; font-size: 14px; margin: 5px 0;">
          <strong>Time:</strong> ${new Date().toLocaleString()}
        </p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #bdc3c7; text-align: center;">
        <p style="color: #95a5a6; font-size: 12px; margin: 5px 0;">
          <strong>Nebulynx Research</strong><br>
          Real-time cryptocurrency and commodity price monitoring
        </p>
        <p style="color: #95a5a6; font-size: 11px; margin: 5px 0;">
          Stay informed about market movements with our advanced alert system
        </p>
      </div>
    </div>
  `;
  
  const mailOptions = {
    from: `"Nebulynx Research" <${process.env.GMAIL_USER}>`,
    to: notification_email,
    subject: subject,
    html: html
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email notification sent to ${notification_email} for ${asset_symbol}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    return false;
  }
}

async function sendNotification(alertData) {
  try {
    const { symbol, currentPrice, threshold, condition, email } = alertData;
    
    // Send email notification
    const emailSent = await sendEmailNotification({
      asset_symbol: symbol,
      asset_name: symbol,
      currency: symbol === 'GOLD' ? 'INR' : 'USD',
      threshold_price: threshold,
      condition_type: condition,
      notification_email: email
    }, { price: currentPrice });
    
    // Log notification to database
    const db = getDatabase();
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO notifications 
         (alert_id, user_id, asset_symbol, asset_name, currency, threshold_price, current_price, condition_type, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          null, // alert_id
          null, // user_id
          symbol,
          symbol,
          symbol === 'GOLD' ? 'INR' : 'USD',
          threshold,
          currentPrice,
          condition,
          emailSent ? 'sent' : 'failed'
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
    
    return emailSent;
  } catch (error) {
    console.error('Error in sendNotification:', error);
    return false;
  }
}

// For demo purposes, if email is not configured, we'll just log to console
function sendDemoNotification(alert, currentPriceData) {
  const { asset_name, asset_symbol, currency, threshold_price, condition_type } = alert;
  const { price: currentPrice } = currentPriceData;
  
  console.log('\n' + '='.repeat(60));
  console.log('🚨 PRICE ALERT TRIGGERED! 🚨');
  console.log('='.repeat(60));
  console.log(`Asset: ${asset_name} (${asset_symbol})`);
  console.log(`Current Price: ${currency} ${currentPrice.toLocaleString()}`);
  console.log(`Threshold: ${currency} ${threshold_price.toLocaleString()}`);
  console.log(`Condition: ${condition_type.toUpperCase()}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));
  console.log('💡 To enable real email notifications:');
  console.log('   1. Enable 2FA on your Gmail account');
  console.log('   2. Generate an App Password');
  console.log('   3. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env file');
  console.log('='.repeat(60) + '\n');
  
  return true;
}

// Initialize email service when module loads
initializeEmailService();

module.exports = {
  sendNotification,
  sendDemoNotification,
  initializeEmailService
}; 