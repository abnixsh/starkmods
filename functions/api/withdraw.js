// functions/api/withdraw.js
// Cloudflare Pages Function – route: /api/withdraw

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const { userId, email, amountUSD, paymentMethod } = await request.json() || {};

    if (!userId || !email || amountUSD == null || !paymentMethod) {
      return jsonResponse({ error: 'Missing withdrawal fields' }, 400);
    }

    const amountNum = Number(amountUSD);
    if (isNaN(amountNum) || amountNum <= 0) {
      return jsonResponse({ error: 'Invalid amountUSD' }, 400);
    }

    const BOT_TOKEN = env.TG_BOT_TOKEN || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';

    if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
      return jsonResponse({ error: 'Bot config missing. Set TG_BOT_TOKEN and TG_CHAT_ID.' }, 500);
    }

    const message = `
💸 <b>NEW WITHDRAWAL REQUEST</b>
-----------------------------
👤 <b>User:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
💰 <b>Amount:</b> $${amountNum.toFixed(2)}
🏦 <b>Payment Method:</b>
${paymentMethod}
-----------------------------
<i>Process this in Admin Panel and mark as Paid / Rejected.</i>
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
    console.error('Telegram withdraw error:', error);
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
