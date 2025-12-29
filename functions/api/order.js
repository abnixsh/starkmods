// functions/api/order.js
// Cloudflare Pages Function – route: /api/order

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

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
    } = await request.json() || {};

    if (!orderId || !userId || !email || !item || !amount || !method || !transId) {
      return jsonResponse({ error: 'Missing order fields' }, 400);
    }

    // Use environment variables set in Cloudflare dashboard
    const BOT_TOKEN = env.TG_BOT_TOKEN || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';

    if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
      return jsonResponse({ error: 'Bot config missing. Set TG_BOT_TOKEN and TG_CHAT_ID.' }, 500);
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

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error('Telegram order error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// Helper: JSON response
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
