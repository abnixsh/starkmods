// api/withdraw.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, amountUSD, paymentMethod } = req.body || {};

  if (!userId || !email || !amountUSD || !paymentMethod) {
    return res.status(400).json({ error: 'Missing withdrawal fields' });
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE';
  const CHAT_ID   = process.env.TG_CHAT_ID   || '6879169726';

  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
    return res.status(500).json({ error: 'Bot config missing. Set TG_BOT_TOKEN and TG_CHAT_ID.' });
  }

  const message = `
💸 <b>NEW WITHDRAWAL REQUEST</b>
-----------------------------
👤 <b>User:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
💰 <b>Amount:</b> $${amountUSD.toFixed(2)}
🏦 <b>Payment Method:</b>
${paymentMethod}
-----------------------------
<i>Process this in Admin Panel and mark as Paid / Rejected.</i>
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
    console.error('Telegram withdraw error:', error);
    return res.status(500).json({ error: error.message });
  }
}
