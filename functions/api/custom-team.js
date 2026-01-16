// functions/api/custom-team.js

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));

    const {
      userId, email, userName,
      mode, teamName, teamShortName,
      squadSummary, // <--- This is the pre-formatted text from the website
      jerseyBase64, jerseyMime,
      logoBase64, logoMime
    } = body;

    // BOT CONFIG
    const BOT_TOKEN = env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';


    // Fallback if squadSummary is missing (should not happen with new frontend)
    const finalText = squadSummary || "No squad details provided.";

    const message = `
🆕 <b>NEW TEAM REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'}
📧 <b>Email:</b> ${email}
🆔 <b>ID:</b> <code>${userId}</code>
-----------------------------
🏏 <b>Team:</b> ${teamName} (${teamShortName})
-----------------------------
📋 <b>SQUAD DETAILS:</b>
${finalText}
-----------------------------
<i>Jersey & Logo attached below.</i>
`;

    // 1. Send Text Message
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
    });
    
    // 2. Send Images
    if (jerseyBase64) await sendImage(BOT_TOKEN, CHAT_ID, jerseyBase64, jerseyMime, 'jersey.png');
    if (logoBase64) await sendImage(BOT_TOKEN, CHAT_ID, logoBase64, logoMime, 'logo.png');

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: {'Content-Type': 'application/json'} });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

async function sendImage(token, chatId, base64, mime, filename) {
  try {
    // Convert Base64 to Blob
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime || 'image/png' });

    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('document', blob, filename);

    await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: 'POST', body: form });
  } catch (e) { console.warn(`Failed to send ${filename}:`, e); }
}
