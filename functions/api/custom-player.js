export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // 1. Parse JSON Body
    const body = await request.json().catch(() => ({}));
    
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
      customFaceMime,
      gameId
    } = body;

    // 2. Validation
    if (!userId || !email || !playerName || !teamName) {
      return jsonResponse({ error: 'Missing required fields.' }, 400);
    }

    // 3. Environment Variables (Cloudflare style)
    // NOTE: Set these in Cloudflare Dashboard > Settings > Environment Variables
    const BOT_TOKEN = env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';

    if (!BOT_TOKEN || !CHAT_ID) {
      return jsonResponse({ error: 'Bot config missing.' }, 500);
    }

    const gameName = gameId ? gameId.toUpperCase() : '-';

    // 4. Construct Message
    const message = `
🎨 <b>NEW CUSTOM PLAYER REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'} 
📧 <b>Email:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
🎮 <b>Game:</b> ${gameName}
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

    // 5. Send Text Message to Telegram
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

    // 6. Send Custom Face Image (if exists)
    if (useCustomFace && customFaceBase64) {
      try {
        // Convert Base64 string to Uint8Array (Buffer replacement for Cloudflare)
        const imageBytes = base64ToUint8Array(customFaceBase64);
        
        // Create Blob
        const imageBlob = new Blob([imageBytes], { type: customFaceMime || 'image/png' });

        // Create FormData
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        // 'document' field requires a filename as the 3rd argument
        formData.append('document', imageBlob, 'custom-face.png');

        const docUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
        const docResp = await fetch(docUrl, {
          method: 'POST',
          body: formData // fetch automatically sets Content-Type to multipart/form-data
        });
        
        const docData = await docResp.json();
        if (!docResp.ok || !docData.ok) {
          console.warn('sendDocument failed:', docData.description);
        }
      } catch (imgErr) {
        console.error('Image upload error:', imgErr);
        // We don't fail the whole request if just the image fails, but logging it is good
      }
    }

    return jsonResponse({ success: true }, 200);

  } catch (err) {
    console.error('Custom player error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

// --- HELPERS ---

// Helper to return JSON responses easily
function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Helper to convert Base64 to Uint8Array (Replacing Node.js Buffer)
function base64ToUint8Array(base64String) {
  // Decode base64 (remove data URI prefix if present, though usually client sends raw base64)
  const cleanBase64 = base64String.replace(/^data:image\/\w+;base64,/, "");
  
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
