// api/order.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId, userName, email, item, amount, method, transId } = req.body;

  // Use environment variables on Vercel (Settings → Environment Variables)
  const BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Bot config missing' });
  }

  const message = `
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
`;

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Telegram send failed: ${text}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
