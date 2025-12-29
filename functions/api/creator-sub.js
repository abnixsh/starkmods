// functions/api/creator-sub.js
// Cloudflare Pages Function – route: /api/creator-sub

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const { userId, email, planCode, planName, priceINR } = await request.json() || {};

    if (!userId || !email || !planCode) {
      return jsonResponse({ error: 'Missing subscription fields.' }, 400);
    }

    const BOT_TOKEN = env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';

    if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
      return jsonResponse({ error: 'Bot config missing.' }, 500);
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

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('creator-sub error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

// Helper: JSON response
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
