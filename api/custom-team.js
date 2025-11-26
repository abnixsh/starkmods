// api/custom-team.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    userId,
    email,
    userName,
    mode,
    teamName,
    teamShortName,
    replaceTeamName,
    players,
    jerseyBase64,
    jerseyMime,
    logoBase64,
    logoMime
  } = req.body || {};

  if (!userId || !email || !teamName || !players || !Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: 'Missing team fields.' });
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN || '8155057782:AAGyehmgDEQL1XYsEoiisiputUqj0kIbios';
  const CHAT_ID   = process.env.TG_CHAT_ID   || '6879169726';

  if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN.includes('PASTE_')) {
    return res.status(500).json({ error: 'Bot config missing.' });
  }

  const modeText = mode === 'replace'
    ? `Replace team: ${replaceTeamName || '-'}`
    : 'New custom team';

  const playersSummary = players
  .map((p, i) =>
    `${i + 1}. ${p.name}
   Type: ${p.playerType}, Jersey: #${p.jerseyNumber}
   Bat: ${p.battingHand}, Bowl: ${p.bowlingHand}
   BatType: ${p.batsmanType}, BowlType: ${p.bowlerType}`
  )
  .join('\n\n');

  const message = `
👥 <b>NEW CUSTOM TEAM REQUEST</b>
-----------------------------
👤 <b>User:</b> ${userName || '-'}
📧 <b>Email:</b> ${email}
🆔 <b>User ID:</b> <code>${userId}</code>
-----------------------------
🏏 <b>Team:</b> ${teamName} (${teamShortName || '-'})
📌 <b>Mode:</b> ${modeText}
👥 <b>Players:</b> ${players.length}
<pre>${playersSummary}</pre>
-----------------------------
<i>Please create team mod with these details and set download link in modRequests when ready.</i>
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

    // 2) Send jersey texture
    if (jerseyBase64) {
      try {
        const jerseyBuf = Buffer.from(jerseyBase64, 'base64');
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append(
          'document',
          new Blob([jerseyBuf], { type: jerseyMime || 'image/png' }),
          'team-jersey.png'
        );

        const docUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
        const docResp = await fetch(docUrl, {
          method: 'POST',
          body: form
        });
        const docData = await docResp.json();
        if (!docResp.ok || !docData.ok) {
          console.warn('sendDocument (jersey) failed:', docData.description);
        }
      } catch (e) {
        console.warn('Error sending jersey image to Telegram:', e);
      }
    }

    // 3) Send logo
    if (logoBase64) {
      try {
        const logoBuf = Buffer.from(logoBase64, 'base64');
        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append(
          'document',
          new Blob([logoBuf], { type: logoMime || 'image/png' }),
          'team-logo.png'
        );

        const docUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
        const docResp = await fetch(docUrl, {
          method: 'POST',
          body: form
        });
        const docData = await docResp.json();
        if (!docResp.ok || !docData.ok) {
          console.warn('sendDocument (logo) failed:', docData.description);
        }
      } catch (e) {
        console.warn('Error sending logo image to Telegram:', e);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('custom-team error:', err);
    return res.status(500).json({ error: err.message });
  }
}
