// functions/api/request.js

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const data = await request.json();

    // 1. Validate Data
    if (!data.userId || !data.type) {
      return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 });
    }

    // 2. Config (Set these in Cloudflare Dashboard or use defaults for testing)
    const BOT_TOKEN = env.TG_BOT_TOKEN || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE'; // Replace with yours if needed
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726'; // Replace with yours if needed

    // 3. Format Message based on Type
    let details = "";
    
    if (data.type === 'team') {
      details = `
🏏 <b>Team Request</b>
---------------------------
🏆 <b>Team Name:</b> ${data.teamName}
👥 <b>Players:</b> ${data.playerCount}
🔄 <b>Mode:</b> ${data.mode}
`;
    } else if (data.type === 'jersey') {
      details = `
👕 <b>Jersey Request</b>
---------------------------
🏆 <b>Team:</b> ${data.teamName}
`;
    } else {
      // Player
      details = `
cricket <b>Player Request</b>
---------------------------
👤 <b>Name:</b> ${data.playerName}
🏏 <b>Batting:</b> ${data.battingHand}
⚾ <b>Bowling:</b> ${data.bowlingHand}
`;
    }

    const message = `
🚨 <b>NEW MOD REQUEST</b>
---------------------------
👤 <b>User:</b> ${data.email}
🆔 <b>UID:</b> <code>${data.userId}</code>
---------------------------
${details}
---------------------------
<i>Check Creator Admin to approve/reject.</i>
`;

    // 4. Send to Telegram
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const tgResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    return new Response(JSON.stringify({ success: true }), { 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
