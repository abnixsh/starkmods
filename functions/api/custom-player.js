// functions/api/custom-player.js

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const {
      userId, email, userName,
      playerName, playerSummary, // <--- THIS TEXT BLOCK IS KEY
      customFaceBase64
    } = body;

     // BOT CONFIG
    const BOT_TOKEN = env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';


    const message = `
🆕 <b>NEW PLAYER REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName}
-----------------------------
⭐ <b>Player:</b> ${playerName}
-----------------------------
${playerSummary}
-----------------------------
`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
    });

    // Send Face Image logic here...

    return new Response(JSON.stringify({ success: true }));
  } catch (e) { return new Response(JSON.stringify({ error: e.message }), { status: 500 }); }
}
