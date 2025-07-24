const { Resend } = require('resend');
const { getDatabase } = require('../database/database');

// Email configuration using Resend (free tier: 100 emails/day)
const resend = new Resend(process.env.RESEND_API_KEY || 're_1234567890');

async function sendEmailNotification(alert, currentPriceData) {
  const { asset_name, asset_symbol, currency, threshold_price, condition_type, notification_email } = alert;
  const { price: currentPrice } = currentPriceData;
  
  // If email is not configured, use demo notification
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_1234567890') {
    return sendDemoNotification(alert, currentPriceData);
  }
  
  const subject = `🚨 Price Alert: ${asset_name} (${asset_symbol})`;
  
  const conditionText = condition_type === 'above' ? 'above' : 'below';
  const direction = condition_type === 'above' ? '📈' : '📉';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #e74c3c; text-align: center;">${direction} Price Alert Triggered!</h2>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #2c3e50;">${asset_name} (${asset_symbol})</h3>
        
        <div style="display: flex; justify-content: space-between; margin: 15px 0;">
          <span style="font-weight: bold;">Current Price:</span>
          <span style="color: #e74c3c; font-weight: bold; font-size: 18px;">
            ${currency} ${currentPrice.toLocaleString()}
          </span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 15px 0;">
          <span style="font-weight: bold;">Alert Threshold:</span>
          <span style="color: #3498db; font-weight: bold;">
            ${currency} ${threshold_price.toLocaleString()}
          </span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin: 15px 0;">
          <span style="font-weight: bold;">Condition:</span>
          <span style="color: #27ae60; font-weight: bold;">
            ${condition_type.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #7f8c8d; font-size: 14px;">
          This alert was triggered because ${asset_name} price is now ${conditionText} your threshold of ${currency} ${threshold_price.toLocaleString()}.
        </p>
        
        <p style="color: #7f8c8d; font-size: 14px;">
          Time: ${new Date().toLocaleString()}
        </p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
        <p style="color: #95a5a6; font-size: 12px;">
          Trading Notification System<br>
          Stay informed about market movements
        </p>
      </div>
    </div>
  `;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Trading Alerts <onboarding@resend.dev>',
      to: [notification_email],
      subject: subject,
      html: html
    });
    
    if (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
    
    console.log(`Email notification sent to ${notification_email} for ${asset_symbol}`);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
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
  console.log('='.repeat(60) + '\n');
  
  return true;
}

module.exports = {
  sendNotification,
  sendDemoNotification
}; 