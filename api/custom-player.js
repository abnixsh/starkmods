// api/custom-player.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    userId,
    email,
    userName,
    teamName,
    playerName,
    playerType,
    battingHand,
    bowlingHand,
    batsmanType,
    bowlerType,
    jerseyNumber,
    faceId,
    useCustomFace,
    customFaceBase64,
    customFaceMime
  } = req.body || {};

  if (!userId || !email || !playerName || !teamName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
  const CHAT_ID   = process.env.TG_CHAT_ID   || '6879169726';

  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
    return res.status(500).json({ error: 'Bot config missing. Set TG_BOT_TOKEN and TG_CHAT_ID.' });
  }

  const message = `
🎨 <b>NEW CUSTOM PLAYER REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'} 
📧 <b>Email:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
🏏 <b>Team:</b> ${teamName}
⭐ <b>Player:</b> ${playerName}
🎭 <b>Type:</b> ${playerType}
🖐 <b>Bat Hand:</b> ${battingHand}
🖐 <b>Bowl Hand:</b> ${bowlingHand}
🪄 <b>Batsman Style:</b> ${batsmanType}
🎯 <b>Bowler Style:</b> ${bowlerType}
🎽 <b>Jersey #:</b> ${jerseyNumber}
🙂 <b>Face:</b> ${useCustomFace ? 'Custom Texture' : (faceId ? 'Face ' + faceId : '-')}
-----------------------------
<i>Please create this player file and upload download link in modRequests (Firestore) when ready.</i>
`;

  try {
    // 1) Send text details
    const msgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const msgResp = await fetch(msgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const msgData = await msgResp.json();
    if (!msgResp.ok || !msgData.ok) {
      throw new Error(msgData.description || 'sendMessage failed');
    }

    // 2) If there's a custom face, send it as document
    if (useCustomFace && customFaceBase64) {
      const buffer = Buffer.from(customFaceBase64, 'base64');
      const form = new FormData();
      form.append('chat_id', CHAT_ID);
      form.append('document', new Blob([buffer], { type: customFaceMime || 'image/png' }), 'custom-face.png');

      const docUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
      const docResp = await fetch(docUrl, {
        method: 'POST',
        body: form
      });
      const docData = await docResp.json();
      if (!docResp.ok || !docData.ok) {
        console.warn('sendDocument failed:', docData.description);
      }
      // No storage; file only lives in memory and on Telegram.
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Custom player error:', err);
    return res.status(500).json({ error: err.message });
  }
}
