# Trading Notification System

A comprehensive web application for monitoring gold and cryptocurrency prices with real-time alerts and notifications.

## Features

### 🏆 Core Features
- **Real-time Price Monitoring**: Track gold prices in INR and cryptocurrency prices in USD
- **Price Alerts**: Set custom thresholds for price notifications
- **Email Notifications**: Receive instant email alerts when conditions are met
- **Multi-Asset Support**: Monitor Bitcoin, Ethereum, XRP, Gold, and more
- **Beautiful Dashboard**: Modern, responsive UI with real-time updates

### 📊 Supported Assets
- **Cryptocurrencies (USD)**: BTC, ETH, XRP, ADA, DOT, LINK, LTC, BCH
- **Commodities (INR)**: Gold (per 10 grams)

### 🔔 Alert Types
- **Above Threshold**: Get notified when price goes above a set value
- **Below Threshold**: Get notified when price goes below a set value

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data persistence
- **Cron Jobs** for automated price monitoring
- **Nodemailer** for email notifications
- **Axios** for API integrations

### Frontend
- **React.js** with modern hooks
- **React Router** for navigation
- **Axios** for API communication
- **React Icons** for beautiful icons
- **React Hot Toast** for notifications

### APIs
- **CoinGecko API** for cryptocurrency prices
- **Metals.live API** for gold prices

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trading-notification
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Start the development server**
   ```bash
   # Start backend
   npm run dev
   
   # In another terminal, start frontend
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Creating Price Alerts

1. **Navigate to Create Alert**
   - Click "Create Alert" button or go to `/alerts/create`

2. **Select Asset**
   - Choose from supported cryptocurrencies or gold
   - Each asset shows its currency (USD for crypto, INR for gold)

3. **Set Alert Conditions**
   - Choose "Above" or "Below" threshold
   - Enter your target price
   - Provide notification email

4. **Save Alert**
   - Click "Create Alert" to save
   - Alert will be active immediately

### Example Alerts

**Gold Alert (INR)**
```
Asset: Gold (GOLD)
Condition: Below ₹100,000
Email: your-email@example.com
```

**Bitcoin Alert (USD)**
```
Asset: Bitcoin (BTC)
Condition: Above $50,000
Email: your-email@example.com
```

**Ethereum Alert (USD)**
```
Asset: Ethereum (ETH)
Condition: Below $3,000
Email: your-email@example.com
```

## API Endpoints

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert
- `GET /api/alerts/supported-assets` - Get supported assets

### Prices
- `GET /api/prices/current` - Get current prices
- `GET /api/prices/current/:symbol` - Get specific asset price
- `GET /api/prices/history/:symbol` - Get price history
- `GET /api/prices/stats/:symbol` - Get price statistics

### Notifications
- `GET /api/notifications` - Get notification history
- `GET /api/notifications/stats` - Get notification statistics
- `DELETE /api/notifications/cleanup` - Cleanup old notifications

## Configuration

### Email Setup

For email notifications to work, you need to configure Gmail:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env file**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ```

### Price Monitoring

The system automatically:
- Fetches prices every 5 minutes
- Checks all active alerts
- Sends email notifications when conditions are met
- Logs all activities to the database

## Database Schema

### Tables
- **users**: User information
- **alerts**: Price alert configurations
- **price_history**: Historical price data
- **notifications**: Sent notification records

## Deployment

### Production Setup

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Set production environment**
   ```bash
   NODE_ENV=production npm start
   ```

3. **Database**: SQLite file will be created automatically

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `EMAIL_USER` | Gmail address | - |
| `EMAIL_PASS` | Gmail app password | - |
| `NODE_ENV` | Environment | development |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## Roadmap

- [ ] Add more cryptocurrencies
- [ ] SMS notifications
- [ ] Push notifications
- [ ] Price charts and graphs
- [ ] User authentication
- [ ] Mobile app
- [ ] WebSocket real-time updates
- [ ] Advanced alert conditions (percentage change, volume, etc.)

---

**Note**: This is a demo application. For production use, consider:
- Using a more robust database (PostgreSQL, MySQL)
- Implementing proper user authentication
- Adding rate limiting and security measures
- Using paid APIs for more reliable data
- Setting up proper monitoring and logging 