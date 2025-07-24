const axios = require('axios');

async function getCurrentGoldPrice() {
  console.log('🔍 Fetching current gold prices from multiple sources...\n');
  
  const sources = [
    {
      name: 'GoldAPI.io',
      url: 'https://api.goldapi.io/api/XAU/INR',
      extract: (data) => data.rate
    },
    {
      name: 'Metals.live',
      url: 'https://api.metals.live/v1/spot/gold',
      extract: (data) => data[0]?.price * 83.0 // Convert USD to INR
    },
    {
      name: 'Gold Price.org',
      url: 'https://goldprice.org/gold-price-india.html',
      extract: (data) => {
        // This would require HTML parsing, simplified for demo
        return null;
      }
    }
  ];

  for (const source of sources) {
    try {
      console.log(`📡 Trying ${source.name}...`);
      const response = await axios.get(source.url, { 
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      });
      
      const price = source.extract(response.data);
      if (price) {
        console.log(`✅ ${source.name}: ₹${price.toLocaleString()} per 10 grams`);
        return price;
      }
    } catch (error) {
      console.log(`❌ ${source.name}: ${error.message}`);
    }
  }
  
  console.log('\n⚠️  All APIs failed, using fallback price');
  return 103000; // Current market price as fallback
}

// Run the function
getCurrentGoldPrice().then(price => {
  console.log(`\n💰 Current Gold Price: ₹${price.toLocaleString()} per 10 grams`);
  console.log('\n📊 Price Comparison:');
  console.log(`   • 1 gram: ₹${(price/10).toLocaleString()}`);
  console.log(`   • 1 kg: ₹${(price*100).toLocaleString()}`);
  console.log(`   • 1 tola: ₹${(price*1.2).toLocaleString()}`);
}); 