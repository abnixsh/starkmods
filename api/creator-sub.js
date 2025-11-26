// api/creator-sub.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, planCode, planName, priceINR } = req.body || {};

  if (!userId || !email || !planCode) {
    return res.status(400).json({ error: 'Missing subscription fields.' });
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
  const CHAT_ID   = process.env.TG_CHAT_ID   || '6879169726';

  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
    return res.status(500).json({ error: 'Bot config missing.' });
  }

  const message = `
🧾 <b>NEW MOD CREATOR SUBSCRIPTION REQUEST</b>
-----------------------------
👤 <b>User:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
📦 <b>Plan:</b> ${planName || planCode}
💰 <b>Price:</b> ₹${priceINR || '-'}
-----------------------------
<i>Approve this in Creator Admin → Subscriptions after verifying payment.</i>
`;

  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      throw new Error(data.description || 'Telegram send failed');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('creator-sub error:', err);
    return res.status(500).json({ error: err.message });
  }
}
