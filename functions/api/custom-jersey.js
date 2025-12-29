// functions/api/custom-jersey.js
// Cloudflare Pages Function – route: /api/custom-jersey

export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const {
      userId,
      email,
      userName,
      teamName,
      jerseyBase64,
      jerseyMime,
      gameId
    } = await request.json() || {};

    if (!userId || !email || !teamName || !jerseyBase64) {
      return jsonResponse({ error: 'Missing fields.' }, 400);
    }

    const BOT_TOKEN = env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';

    if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
      return jsonResponse({ error: 'Bot config missing.' }, 500);
    }

    const gameName = gameId ? gameId.toUpperCase() : '-';

    const message = `
🎽 <b>NEW CUSTOM JERSEY REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'}
📧 <b>Email:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
🎮 <b>Game:</b> ${gameName}
🏏 <b>Team:</b> ${teamName}
🎨 <b>Type:</b> Jersey Texture
-----------------------------
<i>Please create jersey mod for this texture and set download link in modRequests when ready.</i>
`;

    // 1) Send text
    const txtUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const txtResp = await fetch(txtUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const txtData = await txtResp.json();
    if (!txtResp.ok || !txtData.ok) {
      throw new Error(txtData.description || 'sendMessage failed');
    }

    // 2) Send jersey texture as document
    try {
      const buffer = base64ToUint8Array(jerseyBase64);
      const form = new FormData();
      form.append('chat_id', CHAT_ID);
      form.append(
        'document',
        new Blob([buffer], { type: jerseyMime || 'image/png' }),
        'custom-jersey.png'
      );

      const docUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
      const docResp = await fetch(docUrl, {
        method: 'POST',
        body: form
      });
      const docData = await docResp.json();
      if (!docResp.ok || !docData.ok) {
        console.warn('sendDocument failed:', docData.description);
      }
    } catch (e) {
      console.warn('Error sending jersey file to Telegram:', e);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('custom-jersey error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

// Helper: JSON Response
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Helper: base64 string -> Uint8Array (Cloudflare env)
function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
