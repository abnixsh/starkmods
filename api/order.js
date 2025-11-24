export default async function handler(req, res) {
    // Sirf POST request allow karenge
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { orderId, userName, email, item, amount, method, transId } = req.body;

    // --- ⚠️ YAHAN APNA BOT TOKEN DALO (SECURE AREA) ---
    const BOT_TOKEN = "8553888606:AAHma2ngi2_rqb3hHpXDLKbBEbVs0MxKE5U"; // <--- Example: 123456:ABC-Def...
    const CHAT_ID = "6879169726";     // <--- Example: 123456789

    // Message Format (Jo aapko Telegram par dikhega)
    const message = 
🚨 <b>NEW ORDER RECEIVED</b>
-----------------------------
🆔 <b>Order ID:</b> <code>#${orderId}</code>
👤 <b>User:</b> ${userName}
📧 <b>Email:</b> ${email}
-----------------------------
🎮 <b>Game:</b> ${item.gameName}
📅 <b>Plan:</b> ${item.planName}
💰 <b>Amount:</b> ₹${amount}
💳 <b>Method:</b> ${method}
-----------------------------
🔢 <b>UTR/Trans ID:</b> <code>${transId}</code>
-----------------------------
<i>Please verify payment in bank and approve in Admin Panel.</i>
    ;

    try {
        const url = https://api.telegram.org/bot${BOT_TOKEN}/sendMessage;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            throw new Error('Telegram send failed');
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
