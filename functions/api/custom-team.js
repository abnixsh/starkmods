// functions/api/custom-team.js

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));

    const {
      userId, email, userName,
      mode, teamName, teamShortName, replaceTeamName,
      players,
      jerseyBase64, jerseyMime,
      logoBase64, logoMime
    } = body;

    if (!userId || !teamName || !Array.isArray(players)) {
      return jsonResponse({ error: 'Missing team fields.' }, 400);
    }

    // 1. BOT CONFIG (Hardcoded)
    const BOT_TOKEN = env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
    const CHAT_ID   = env.TG_CHAT_ID   || '6879169726';

    const modeText = mode === 'replace' ? `Replace: ${replaceTeamName}` : 'New Custom Team';

    // Format Player List
    const playersSummary = players.map((p, i) => {
        let skills = '';
        if(['batsman','keeper','all-rounder'].includes(p.playerType)) {
            skills += `   [BAT] ${p.batsmanType||'-'} | T:${p.timing||'-'} A:${p.aggression||'-'} Tec:${p.technique||'-'}\n`;
        }
        if(['bowler','all-rounder'].includes(p.playerType)) {
            skills += `   [BWL] ${p.bowlerType||'-'} | Act:${p.bowlingAction||'-'} Skl:${p.bowlingSkill||'-'}`;
        }
        return `${i + 1}. <b>${p.name}</b> (${p.playerType})\n   Jer: ${p.jerseyNumber} | ${p.battingHand} Bat | ${p.bowlingHand} Bowl\n${skills}`;
      }).join('\n');

    const message = `
👥 <b>NEW CUSTOM TEAM REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'}
📧 <b>Email:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
🏏 <b>Team:</b> ${teamName} (${teamShortName})
📌 <b>Mode:</b> ${modeText}
-----------------------------
📋 <b>SQUAD LIST (${players.length}):</b>
${playersSummary}
-----------------------------
<i>Jersey & Logo attached below.</i>
`;

    // 2. Send Text
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
    });
    
    // 3. Send Jersey & Logo
    if (jerseyBase64) await sendImage(BOT_TOKEN, CHAT_ID, jerseyBase64, jerseyMime, 'jersey.png');
    if (logoBase64) await sendImage(BOT_TOKEN, CHAT_ID, logoBase64, logoMime, 'logo.png');

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('custom-team error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
}

async function sendImage(token, chatId, base64, mime, filename) {
  try {
    const buffer = base64ToUint8Array(base64);
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('document', new Blob([buffer], { type: mime || 'image/png' }), filename);
    await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: 'POST', body: form });
  } catch (e) { console.warn(`Failed to send ${filename}:`, e); }
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
