// api/order.js

// Runs on Vercel serverless
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    orderId,
    userId,
    userName,
    contact,
    email,
    item,
    amount,
    method,
    transId
  } = req.body || {};

  if (!orderId || !userId || !email || !item || !amount || !method || !transId) {
    return res.status(400).json({ error: 'Missing order fields' });
  }

  // Use environment variables in Vercel dashboard
  const BOT_TOKEN = process.env.TG_BOT_TOKEN || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE';
  const CHAT_ID   = process.env.TG_CHAT_ID   || '6879169726';

  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
    return res.status(500).json({ error: 'Bot config missing. Set TG_BOT_TOKEN and TG_CHAT_ID.' });
  }

  const message = `
🚨 <b>NEW ORDER RECEIVED</b>
-----------------------------
🆔 <b>Order ID:</b> <code>#${orderId}</code>
👤 <b>User:</b> ${userName || '-'}
📧 <b>Email:</b> ${email}
📱 <b>Contact:</b> ${contact || '-'}
-----------------------------
🎮 <b>Game:</b> ${item.gameName}
📅 <b>Plan:</b> ${item.planName}
💰 <b>Amount:</b> ₹${amount}
💳 <b>Method:</b> ${method}
-----------------------------
🔢 <b>UTR/Trans ID:</b> <code>${transId}</code>
-----------------------------
<i>Verify payment in bank and approve / set key in Admin Panel.</i>
`;

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.description || 'Telegram send failed');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Telegram error:', error);
    return res.status(500).json({ error: error.message });
  }
}
