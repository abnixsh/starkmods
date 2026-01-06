// functions/api/custom-player.js

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));
    
    const {
      userId, email, userName,
      teamName, playerName, playerType,
      battingHand, bowlingHand, jerseyNumber,
      // Extended Skills
      batsmanType, timing, aggression, technique,
      bowlerType, bowlingAction, bowlingSkill,
      // Face
      faceId, useCustomFace, customFaceBase64, customFaceMime,
      gameId
    } = body;

    if (!userId || !email || !playerName || !teamName) {
      return jsonResponse({ error: 'Missing required fields.' }, 400);
    }

    const BOT_TOKEN = env.TG_BOT_TOKEN;
    const CHAT_ID   = env.TG_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return jsonResponse({ error: 'Bot config missing.' }, 500);
    }

    const gameName = gameId ? gameId.toUpperCase() : '-';

    // Format the skill section based on player type
    let skillDetails = '';
    
    if (['batsman', 'keeper', 'all-rounder'].includes(playerType)) {
      skillDetails += `
🏏 <b>Batting Skills:</b>
   • Style: ${batsmanType || '-'}
   • Timing: ${timing || '-'}
   • Aggression: ${aggression || '-'}
   • Technique: ${technique || '-'}`;
    }

    if (['bowler', 'all-rounder'].includes(playerType)) {
      skillDetails += `
⚾ <b>Bowling Skills:</b>
   • Style: ${bowlerType || '-'}
   • Action: ${bowlingAction || '-'}
   • Skill: ${bowlingSkill || '-'}`;
    }

    const message = `
🎨 <b>NEW CUSTOM PLAYER REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'} 
📧 <b>Email:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
🎮 <b>Game:</b> ${gameName}
🏟 <b>Team:</b> ${teamName}
⭐ <b>Player:</b> ${playerName}
🎽 <b>Jersey:</b> #${jerseyNumber}
🎭 <b>Type:</b> ${playerType}
-----------------------------
🖐 <b>Hands:</b> ${battingHand} Bat / ${bowlingHand} Bowl
${skillDetails}
-----------------------------
🙂 <b>Face:</b> ${useCustomFace ? 'Custom Texture (Attached)' : (faceId ? 'Face ' + faceId : 'Default')}
`;

    // 1. Send Text
    const msgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const msgResp = await fetch(msgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
    });

    const msgData = await msgResp.json();
    if (!msgResp.ok || !msgData.ok) {
      throw new Error(msgData.description || 'sendMessage failed');
    }

    // 2. Send Custom Face (if any)
    if (useCustomFace && customFaceBase64) {
      try {
        const imageBytes = base64ToUint8Array(customFaceBase64);
        const imageBlob = new Blob([imageBytes], { type: customFaceMime || 'image/png' });
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('document', imageBlob, `${playerName}_face.png`);

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: formData
        });
      } catch (imgErr) {
        console.error('Image upload error:', imgErr);
      }
    }

    return jsonResponse({ success: true }, 200);

  } catch (err) {
    console.error('Custom player error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

function base64ToUint8Array(base64String) {
  const cleanBase64 = base64String.replace(/^data:image\/\w+;base64,/, "");
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}
