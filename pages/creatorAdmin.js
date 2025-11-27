// pages/creatorAdmin.js

const CREATOR_PLANS_ADMIN = {
  P100: { name: 'Starter', maxRequests: 20, periodDays: 30 },
  P300: { name: 'Pro', maxRequests: 70, periodDays: 30 },
  P1000: { name: 'Elite', maxRequests: null, periodDays: 60 }
};

function CreatorAdminPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => {
    window.loadCreatorSubs();
    window.loadModRequests(); // loads per-user summary
  }, 200);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      <h1 class="text-2xl font-bold mb-2">Mod Creator Admin</h1>

      <!-- SUBSCRIPTIONS -->
      <section>
        <h2 class="text-lg font-bold mb-3">Creator Subscriptions</h2>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3">User</th>
                <th class="p-3">Plan</th>
                <th class="p-3">Usage</th>
                <th class="p-3">Status</th>
                <th class="p-3">Expires</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody id="creator-subs-list">
              <tr><td colspan="6" class="p-6 text-center text-slate-400">Loading subscriptions...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- MOD REQUESTS (USER SUMMARY + PER-USER DETAILS) -->
      <section>
        <h2 class="text-lg font-bold mb-3">Mod Requests (by User)</h2>

        <!-- USER SUMMARY TABLE -->
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3">User</th>
                <th class="p-3">Total</th>
                <th class="p-3">Approved</th>
                <th class="p-3">Pending</th>
                <th class="p-3">Rejected</th>
                <th class="p-3">Last Request</th>
                <th class="p-3">Actions</th>
              </tr>
            </thead>
            <tbody id="modreq-users-list">
              <tr><td colspan="7" class="p-6 text-center text-slate-400">Loading requests...</td></tr>
            </tbody>
          </table>
        </div>

        <!-- PER-USER REQUEST DETAILS PANEL -->
        <div id="user-requests-panel" class="mt-6 hidden">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-md font-bold">
              Requests for <span id="user-requests-email" class="font-mono text-xs"></span>
            </h3>
            <button onclick="window.closeUserRequestsPanel()"
                    class="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-3 py-1 rounded flex items-center gap-1">
              <span class="material-icons text-xs">close</span> Close
            </button>
          </div>

          <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="p-3">Player / Team</th>
                  <th class="p-3">Game</th>
                  <th class="p-3">Details</th>
                  <th class="p-3">Status</th>
                  <th class="p-3">Download</th>
                  <th class="p-3">Actions</th>
                </tr>
              </thead>
              <tbody id="user-requests-list">
                <tr><td colspan="6" class="p-6 text-center text-slate-400">Select a user to view requests.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `;
}

/* ---------- SUBSCRIPTIONS TABLE ---------- */

window.loadCreatorSubs = function () {
  const list = document.getElementById('creator-subs-list');
  if (!list || !window.db) return;

  db.collection('creatorSubs')
    .orderBy('requestedAt', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No subscriptions yet.</td></tr>`;
        return;
      }

      let html = '';
      const now = Date.now();

      snapshot.forEach(doc => {
        const s = doc.data();
        const uid = s.userId || doc.id;
        const planCfg = CREATOR_PLANS_ADMIN[s.planCode] || null;
        const used = s.usedRequests || 0;
        const max = s.maxRequests || null;
        const expiresAt = s.expiresAt && s.expiresAt.toDate ? s.expiresAt.toDate() : null;
        const expired = expiresAt ? expiresAt.getTime() < now : false;

        let statusText = s.status || 'pending';
        let statusClass = 'bg-yellow-100 text-yellow-700';
        if (statusText === 'active' && !expired) {
          statusClass = 'bg-green-100 text-green-700';
        } else if (statusText === 'rejected') {
          statusClass = 'bg-red-100 text-red-700';
        }

        const planLabel = planCfg ? planCfg.name : (s.planName || s.planCode || '-');
        const usageText = max ? `${used}/${max}` : `${used} / ∞`;

        const expText = expiresAt ? expiresAt.toLocaleDateString() : '-';

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-3 align-top">
              <div class="font-bold">${s.email || 'Unknown'}</div>
              <div class="text-[11px] text-slate-400">UID: ${uid}</div>
            </td>
            <td class="p-3 align-top">
              <div class="font-semibold">${planLabel}</div>
              <div class="text-[11px] text-slate-500">Code: ${s.planCode || '-'}</div>
            </td>
            <td class="p-3 align-top text-[11px] text-slate-500">
              Used: ${usageText}
            </td>
            <td class="p-3 align-top">
              <span class="badge ${statusClass} text-[10px] uppercase font-bold">
                ${statusText}
              </span>
            </td>
            <td class="p-3 align-top text-[11px] text-slate-500">
              ${expText}
            </td>
            <td class="p-3 align-top flex gap-2">
  ${s.status === 'pending' ? `
    <button onclick="window.approveCreatorSub('${uid}', '${s.planCode || ''}')"
            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
      <span class="material-icons text-xs">check</span> Approve
    </button>
    <button onclick="window.rejectCreatorSub('${uid}')"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
      <span class="material-icons text-xs">close</span> Reject
    </button>
  ` : ''}

  ${s.status === 'active' ? `
    <button onclick="window.cancelCreatorSub('${uid}')"
            class="bg-slate-300 hover:bg-slate-400 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100 px-3 py-1 rounded text-xs flex items-center gap-1">
      <span class="material-icons text-xs">block</span> Cancel
    </button>
  ` : ''}
            </td>
          </tr>`;
      });

      list.innerHTML = html;
    }, err => {
      console.error(err);
      list.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500">Error loading subscriptions.</td></tr>`;
    });
};

window.approveCreatorSub = async function (userId, planCode) {
  const plan = CREATOR_PLANS_ADMIN[planCode];
  if (!plan) {
    alert('Unknown plan code: ' + planCode);
    return;
  }

  if (!confirm(`Approve ${plan.name} plan for this user?`)) return;

  const expiresAt = new Date(Date.now() + plan.periodDays * 24 * 60 * 60 * 1000);

  try {
    await db.collection('creatorSubs').doc(userId).set({
      status: 'active',
      maxRequests: plan.maxRequests || null,
      usedRequests: 0,
      expiresAt,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await window.markLatestSubOrderApproved(userId);

    alert('Subscription approved.');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

window.markLatestSubOrderApproved = async function (userId) {
  try {
    const snap = await db.collection('orders')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    let updated = false;
    snap.forEach(doc => {
      if (updated) return;
      const o = doc.data();
      if (o.gameId && o.gameId.startsWith('sub_') && o.status === 'pending') {
        doc.ref.update({ status: 'approved' });
        updated = true;
      }
    });
  } catch (e) {
    console.error('markLatestSubOrderApproved error:', e);
  }
};

window.rejectCreatorSub = function (userId) {
  if (!confirm('Reject this subscription request?')) return;

  db.collection('creatorSubs').doc(userId).set({
    status: 'rejected',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true }).then(() => {
    alert('Subscription rejected.');
  }).catch(err => {
    console.error(err);
    alert(err.message);
  });
};

window.cancelCreatorSub = function (userId) {
  if (!confirm('Cancel this subscription?')) return;

  db.collection('creatorSubs').doc(userId).set({
    status: 'cancelled',
    expiresAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true })
  .then(() => {
    alert('Subscription cancelled.');
  })
  .catch(err => {
    console.error(err);
    alert(err.message);
  });
};

/* ---------- MOD REQUESTS: USER SUMMARY + PER-USER DETAIL ---------- */

// Will store aggregated info so we can show email when opening detail panel
window.modRequestsByUser = {};
window.currentUserRequestsUnsub = null;

window.loadModRequests = function () {
  const list = document.getElementById('modreq-users-list');
  if (!list || !window.db) return;

  db.collection('modRequests')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No mod creator requests yet.</td></tr>`;
        window.modRequestsByUser = {};
        return;
      }

      const byUser = {};
      snapshot.forEach(doc => {
        const r = doc.data();
        const uid = r.userId || 'unknown';
        if (!byUser[uid]) {
          byUser[uid] = {
            userId: uid,
            email: r.email || 'Unknown',
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            lastTimestamp: 0
          };
        }
        const u = byUser[uid];
        u.total += 1;
        const status = r.status || 'pending';
        if (status === 'approved') u.approved += 1;
        else if (status === 'rejected') u.rejected += 1;
        else u.pending += 1;

        const ts = r.timestamp && r.timestamp.toDate ? r.timestamp.toDate().getTime() : 0;
        if (ts > u.lastTimestamp) u.lastTimestamp = ts;
      });

      window.modRequestsByUser = byUser;

      const usersArr = Object.values(byUser).sort((a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0));

      if (!usersArr.length) {
        list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No mod creator requests yet.</td></tr>`;
        return;
      }

      let html = '';
      usersArr.forEach(u => {
        const lastDate = u.lastTimestamp
          ? new Date(u.lastTimestamp).toLocaleString()
          : '-';

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-3 align-top">
              <div class="font-bold">${u.email}</div>
              <div class="text-[11px] text-slate-400">UID: ${u.userId}</div>
            </td>
            <td class="p-3 align-top text-[11px] text-slate-500">
              ${u.total}
            </td>
            <td class="p-3 align-top text-[11px] text-green-600">
              ${u.approved}
            </td>
            <td class="p-3 align-top text-[11px] text-amber-600">
              ${u.pending}
            </td>
            <td class="p-3 align-top text-[11px] text-red-600">
              ${u.rejected}
            </td>
            <td class="p-3 align-top text-[11px] text-slate-500">
              ${lastDate}
            </td>
            <td class="p-3 align-top">
              <button onclick="window.viewUserModRequests('${u.userId}')"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                <span class="material-icons text-xs">visibility</span> View Requests
              </button>
            </td>
          </tr>`;
      });

      list.innerHTML = html;
    }, err => {
      console.error(err);
      list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-red-500">Error loading requests.</td></tr>`;
    });
};

window.viewUserModRequests = function (userId) {
  const panel = document.getElementById('user-requests-panel');
  const emailSpan = document.getElementById('user-requests-email');
  const list = document.getElementById('user-requests-list');
  if (!panel || !emailSpan || !list || !window.db) return;

  const info = window.modRequestsByUser && window.modRequestsByUser[userId];
  const email = info ? info.email : 'Unknown';

  emailSpan.textContent = `${email} (UID: ${userId})`;

  panel.classList.remove('hidden');

  // Unsubscribe previous user listener if any
  if (window.currentUserRequestsUnsub) {
    window.currentUserRequestsUnsub();
    window.currentUserRequestsUnsub = null;
  }

  // Listen to this user's requests
  window.currentUserRequestsUnsub = db.collection('modRequests')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No requests for this user.</td></tr>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const r = doc.data();
        const id = doc.id;

        let badgeClass = 'bg-yellow-100 text-yellow-700';
        if (r.status === 'approved') badgeClass = 'bg-green-100 text-green-700';
        if (r.status === 'rejected') badgeClass = 'bg-red-100 text-red-700';

        const downloadCell = r.downloadUrl
          ? `<a href="${r.downloadUrl}" target="_blank"
                class="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
               <span class="material-icons text-xs">download</span> Open
             </a>`
          : `<span class="text-xs text-slate-400">Not set</span>`;

        const gameLabel = r.gameId ? r.gameId.toUpperCase() : '-';

        // Build details line depending on type
        let detailsHtml = '';
        if (r.type === 'jersey') {
          detailsHtml =
            `Type: Jersey<br>` +
            `Team: ${r.teamName || '-'}<br>`;
        } else if (r.type === 'team') {
          const modeText = r.mode === 'replace'
            ? `Replace: ${r.replaceTeamName || '-'}`
            : 'New team';
          detailsHtml =
            `Type: Team (${modeText})<br>` +
            `Players: ${(r.players || []).length}<br>`;
        } else {
          detailsHtml =
            `Type: ${r.playerType || '-'}<br>` +
            `Bat: ${r.battingHand || '-'} · Bowl: ${r.bowlingHand || '-'}<br>` +
            `Jersey: ${r.jerseyNumber || '-'}<br>` +
            `Face: ${r.useCustomFace ? 'Custom Texture' : (r.faceId ? 'Face ' + r.faceId : '-')}`;
        }

        const mainLabel = r.playerName || r.teamName || (r.type === 'jersey' ? 'Custom Jersey' : 'Request');

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-3 align-top">
              <div class="font-semibold">${mainLabel}</div>
              <div class="text-[11px] text-slate-500">${r.type || 'player'}</div>
            </td>
            <td class="p-3 align-top text-[11px] text-slate-500">
              ${gameLabel}
            </td>
            <td class="p-3 align-top text-[11px] text-slate-500">
              ${detailsHtml}
            </td>
            <td class="p-3 align-top">
              <span class="badge ${badgeClass} text-[10px] uppercase font-bold">
                ${r.status || 'pending'}
              </span>
            </td>
            <td class="p-3 align-top">
              ${downloadCell}
            </td>
            <td class="p-3 align-top flex gap-2">
  <button onclick="window.setModDownloadLink('${id}', '${(r.playerName || r.teamName || 'this request').replace(/'/g, "\\'")}')"
          class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded text-xs flex items-center gap-1">
    <span class="material-icons text-xs">link</span>
  </button>

  ${r.status !== 'approved' ? `
    <button onclick="window.updateModStatus('${id}', 'approved')"
            class="bg-green-600 hover:bg-green-700 text-white p-2 rounded text-xs flex items-center gap-1">
      <span class="material-icons text-xs">check</span>
    </button>
  ` : ''}

  ${r.status !== 'rejected' ? `
    <button onclick="window.updateModStatus('${id}', 'rejected')"
            class="bg-red-500 hover:bg-red-600 text-white p-2 rounded text-xs flex items-center gap-1">
      <span class="material-icons text-xs">close</span>
    </button>
  ` : ''}

  ${r.status !== 'pending' ? `
    <button onclick="window.deleteModRequest('${id}')"
            class="bg-slate-300 hover:bg-slate-400 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100 p-2 rounded text-xs flex items-center gap-1">
      <span class="material-icons text-xs">delete</span>
    </button>
  ` : ''}
            </td>
          </tr>`;
      });

      list.innerHTML = html;
    }, err => {
      console.error(err);
      list.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-red-500">Error loading user requests.</td></tr>`;
    });
};

window.closeUserRequestsPanel = function () {
  const panel = document.getElementById('user-requests-panel');
  const list = document.getElementById('user-requests-list');
  const emailSpan = document.getElementById('user-requests-email');
  if (panel) panel.classList.add('hidden');
  if (list) {
    list.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">Select a user to view requests.</td></tr>`;
  }
  if (emailSpan) emailSpan.textContent = '';
  if (window.currentUserRequestsUnsub) {
    window.currentUserRequestsUnsub();
    window.currentUserRequestsUnsub = null;
  }
};

/* ---------- REQUEST ACTIONS (unchanged logic) ---------- */

window.updateModStatus = function (id, status) {
  if (!confirm(`Mark this request as ${status}?`)) return;

  db.collection('modRequests').doc(id).update({
    status
  }).then(() => {
    alert('Status updated.');
  }).catch(err => {
    console.error(err);
    alert(err.message);
  });
};

window.deleteModRequest = function (id) {
  if (!confirm('Delete this mod creator request? This cannot be undone.')) return;

  db.collection('modRequests').doc(id).delete()
    .then(() => {
      alert('Request deleted.');
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
};

window.setModDownloadLink = function (id, playerName) {
  const link = prompt(`Paste download link for ${playerName || 'this request'}:`);
  if (!link) return;

  db.collection('modRequests').doc(id).update({
    downloadUrl: link,
    status: 'approved',
    hasDownload: true
  }).then(() => {
    alert('Download link saved. User will see it in their Mod Creator history.');
  }).catch(err => {
    console.error(err);
    alert(err.message);
  });
};

window.CreatorAdminPage = CreatorAdminPage;
