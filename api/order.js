export default async function handler(req, res) {
    // Sirf POST request allow karenge
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user, cart, payment, transId, orderId } = req.body;

    // 1. Validation (Backend par check)
    if (!user || !cart || !payment || !transId) {
        return res.status(400).json({ error: 'Missing details' });
    }

    // --- CONFIGURATION (Yahan apna asli Token dalo) ---
    // Security Tip: Asli projects me ise Environment Variables (.env) me rakhte hain
    const BOT_TOKEN = "8553888606:AAHma2ngi2_rqb3hHpXDLKbBEbVs0MxKE5U"; 
    const CHAT_ID = "6879169726"; // Apni Chat ID yahan dalo

    // 2. Message Format Karna
    const message = `
🚨 <b>NEW ORDER RECEIVED</b> 🚨
--------------------------------
<b>🆔 Order ID:</b> <code>#${orderId}</code>
<b>👤 Name:</b> ${user.name}
<b>📱 Contact:</b> ${user.contact}
--------------------------------
<b>🎮 Product:</b> ${cart.gameName}
<b>📅 Plan:</b> ${cart.planName}
<b>💰 Amount:</b> ₹${cart.price}
--------------------------------
<b>💳 Method:</b> ${payment.method}
<b>🔢 Transaction ID:</b> <code>${transId}</code>
--------------------------------
<i>Please verify payment and send key.</i>
    `;

    try {
        // 3. Telegram API ko call karna
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();

        if (result.ok) {
            return res.status(200).json({ success: true, message: 'Order sent to admin' });
        } else {
            throw new Error('Telegram API Error');
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send order' });
    }
}