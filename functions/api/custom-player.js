// functions/api/custom-player.js

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));
    
    // 1. Validate Inputs
    if (!body.userId || !body.email || !body.playerName) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    // 2. Check Bot Config
    const BOT_TOKEN = env.TG_BOT_TOKEN;
    const CHAT_ID = env.TG_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Missing TG_BOT_TOKEN or TG_CHAT_ID in Cloudflare Env Variables");
      return jsonResponse({ error: 'Server misconfigured (Missing Bot Token)' }, 500);
    }

    // 3. Format Message
    const gameName = (body.gameId || 'RC25').toUpperCase();
    
    let skillDetails = '';
    if (['batsman', 'keeper', 'all-rounder'].includes(body.playerType)) {
      skillDetails += `
🏏 <b>Batting:</b> ${body.batsmanType || '-'}
   • Timing: ${body.timing || '-'} | Aggro: ${body.aggression || '-'} | Tech: ${body.technique || '-'}`;
    }
    if (['bowler', 'all-rounder'].includes(body.playerType)) {
      skillDetails += `
⚾ <b>Bowling:</b> ${body.bowlerType || '-'} (${body.bowlingAction || '-'})
   • Skill: ${body.bowlingSkill || '-'}`;
    }

    const message = `
🎨 <b>NEW CUSTOM PLAYER REQUEST</b>
-----------------------------
👤 <b>User:</b> ${body.userName || 'Unknown'} 
📧 <b>Email:</b> ${body.email}
🆔 <b>User ID:</b> <code>${body.userId}</code>
-----------------------------
🎮 <b>Game:</b> ${gameName}
🏟 <b>Team:</b> ${body.teamName}
⭐ <b>Player:</b> ${body.playerName}
🎽 <b>Jersey:</b> #${body.jerseyNumber}
-----------------------------
🖐 <b>Hand:</b> ${body.battingHand} Bat / ${body.bowlingHand} Bowl
${skillDetails}
-----------------------------
🙂 <b>Face:</b> ${body.useCustomFace ? 'Custom (See File)' : (body.faceId ? 'Face ' + body.faceId : 'Default')}
`;

    // 4. Send Text Message
    const textResp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!textResp.ok) {
      const err = await textResp.json();
      console.error("Telegram Text Error:", err);
      throw new Error(`Telegram Error: ${err.description}`);
    }

    // 5. Send Face Image (if exists)
    if (body.useCustomFace && body.customFaceBase64) {
      try {
        const imageBlob = base64ToBlob(body.customFaceBase64, body.customFaceMime);
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('document', imageBlob, 'custom_face.png');

        const imgResp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: formData
        });
        
        if (!imgResp.ok) console.warn("Telegram Image Error:", await imgResp.text());
      } catch (imgErr) {
        console.error('Image processing failed:', imgErr);
      }
    }

    return jsonResponse({ success: true }, 200);

  } catch (err) {
    console.error('API Error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function base64ToBlob(base64, type = 'image/png') {
  const bin = atob(base64.replace(/^data:image\/\w+;base64,/, ""));
  const len = bin.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type });
}
