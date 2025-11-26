// api/custom-jersey.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    userId,
    email,
    userName,
    teamName,
    jerseyBase64,
    jerseyMime
  } = req.body || {};

  if (!userId || !email || !teamName || !jerseyBase64) {
    return res.status(400).json({ error: 'Missing fields.' });
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
  const CHAT_ID   = process.env.TG_CHAT_ID   || '6879169726';

  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
    return res.status(500).json({ error: 'Bot config missing.' });
  }

  const message = `
🎽 <b>NEW CUSTOM JERSEY REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'}
📧 <b>Email:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
🏏 <b>Team:</b> ${teamName}
🎨 <b>Type:</b> Jersey Texture
-----------------------------
<i>Please create jersey mod for this texture and set download link in modRequests when ready.</i>
`;

  try {
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
      const buffer = Buffer.from(jerseyBase64, 'base64');
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

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('custom-jersey error:', err);
    return res.status(500).json({ error: err.message });
  }
}
