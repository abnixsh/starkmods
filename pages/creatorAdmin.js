// pages/creatorAdmin.js

const CREATOR_PLANS_ADMIN = {
  P100: { name: 'Starter', maxRequests: 20, periodDays: 30 },
  P300: { name: 'Pro', maxRequests: 70, periodDays: 30 },
  P1000: { name: 'Elite', maxRequests: null, periodDays: 60 }
};

/* =========================================
   1. MAIN DASHBOARD
   ========================================= */

function CreatorAdminPage() {
  if (!window.isAdmin) {
    if(window.router) window.router.navigateTo('/');
    return '';
  }

  // Load data
  setTimeout(() => {
    // Load tabs (default to pending if not set)
    if(!window.currentSubFilter) window.switchSubTab('pending');
    else window.loadCreatorSubs(window.currentSubFilter);
    
    window.loadModRequests(); 
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Mod Creator Admin</h1>
           <p class="text-sm text-slate-500">Manage subscriptions & custom requests</p>
        </div>
        <div class="flex gap-2">
            <button onclick="window.router.navigateTo('/admin')" class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 px-4 py-2 rounded-lg text-sm font-bold">
                Back to Dashboard
            </button>
        </div>
      </div>

      <!-- SECTION 1: SUBSCRIPTIONS -->
      <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="flex border-b border-slate-200 dark:border-slate-700">
          <button onclick="window.switchSubTab('pending')" id="tab-pending" class="flex-1 py-4 text-sm font-bold border-b-2 transition">🔔 Pending</button>
          <button onclick="window.switchSubTab('active')" id="tab-active" class="flex-1 py-4 text-sm font-bold border-b-2 transition">✅ Active</button>
          <button onclick="window.switchSubTab('history')" id="tab-history" class="flex-1 py-4 text-sm font-bold border-b-2 transition">📂 History</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
              <tr>
                <th class="p-4">User</th>
                <th class="p-4">Plan</th>
                <th class="p-4 w-1/4">Usage</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="creator-subs-list">
              <tr><td colspan="5" class="p-10 text-center text-slate-400">Loading data...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- SECTION 2: MOD REQUESTS SUMMARY -->
      <section>
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold">Incoming Mod Requests</h2>
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">By User</span>
        </div>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-3">User</th>
                <th class="p-3 text-center">Total Requests</th>
                <th class="p-3">Status Breakdown</th>
                <th class="p-3">Last Activity</th>
                <th class="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody id="modreq-users-list">
              <tr><td colspan="5" class="p-10 text-center text-slate-400">Loading requests...</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

/* =========================================
   2. SUBSCRIPTION LOGIC
   ========================================= */

window.currentSubFilter = 'pending';

window.switchSubTab = function(tab) {
    window.currentSubFilter = tab;
    window.loadCreatorSubs(tab);
    ['pending', 'active', 'history'].forEach(t => {
        const el = document.getElementById('tab-'+t);
        if(!el) return;
        if(t === tab) el.className = "flex-1 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-slate-700/50 transition";
        else el.className = "flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-transparent transition";
    });
};

window.loadCreatorSubs = function (filter) {
  const list = document.getElementById('creator-subs-list');
  if (!list || !window.db) return;

  db.collection('creatorSubs').orderBy('requestedAt', 'desc').onSnapshot(snapshot => {
    if (snapshot.empty) { list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No data found.</td></tr>`; return; }

    let html = '';
    let count = 0;
    const now = Date.now();

    snapshot.forEach(doc => {
      const s = doc.data();
      const uid = s.userId || doc.id;
      const planCfg = CREATOR_PLANS_ADMIN[s.planCode] || null;
      const planName = planCfg ? planCfg.name : (s.planName || s.planCode || 'Custom');
      const expiresAt = s.expiresAt && s.expiresAt.toDate ? s.expiresAt.toDate() : null;
      const isExpired = expiresAt ? expiresAt.getTime() < now : false;
      
      let category = 'history';
      if (s.status === 'pending') category = 'pending';
      else if (s.status === 'active' && !isExpired) category = 'active';

      if (filter !== category) return;
      count++;

      // UI Helpers
      const used = s.usedRequests || 0;
      const max = s.maxRequests;
      let usagePercent = max ? Math.min(100, (used / max) * 100) : 0;
      let usageColor = usagePercent > 80 ? 'bg-red-500' : (usagePercent > 50 ? 'bg-yellow-500' : 'bg-blue-600');
      let statusText = '';
      let actions = '';

      if(category === 'pending') {
          statusText = `<span class="text-amber-600 font-bold">Waiting Approval</span>`;
          actions = `
            <button onclick="window.approveCreatorSub('${uid}', '${s.planCode}')" class="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold mr-1">Approve</button>
            <button onclick="window.rejectCreatorSub('${uid}')" class="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold">Reject</button>
          `;
      } else if (category === 'active') {
          const daysLeft = Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));
          statusText = `<span class="text-green-600 font-bold">Expires in ${daysLeft} days</span>`;
          actions = `
             <button onclick="window.manageUserSub('${uid}', '${s.maxRequests||0}', '${expiresAt?expiresAt.getTime():0}')" class="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold ml-auto flex items-center gap-1">
                <span class="material-icons text-xs">settings</span> Manage
            </button>`;
      } else {
          statusText = `<span class="text-slate-400 font-bold uppercase text-xs">${s.status === 'active' ? 'Expired' : s.status}</span>`;
          actions = `
            <button onclick="window.deleteCreatorSub('${uid}')" class="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded text-xs font-bold ml-auto flex items-center gap-1">
               <span class="material-icons text-xs">delete</span> Delete
            </button>`;
      }

      html += `
        <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition">
          <td class="p-4 font-bold">${s.email}<div class="text-[10px] text-slate-400 font-mono">${uid}</div></td>
          <td class="p-4"><span class="badge bg-blue-50 text-blue-600 border border-blue-100 rounded px-2 py-0.5 text-xs font-bold">${planName}</span></td>
          <td class="p-4">
            <div class="text-xs mb-1 flex justify-between"><span>Used</span><span>${used} / ${max || '∞'}</span></div>
            <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div class="h-full ${usageColor}" style="width: ${usagePercent}%"></div></div>
          </td>
          <td class="p-4 text-xs">${statusText}</td>
          <td class="p-4 text-right"><div class="flex justify-end">${actions}</div></td>
        </tr>`;
    });
    list.innerHTML = count === 0 ? `<tr><td colspan="5" class="p-10 text-center text-slate-400">No ${filter} items.</td></tr>` : html;
  });
};

/* --- SUB ACTIONS --- */
window.approveCreatorSub = async function (uid, code) {
  const plan = CREATOR_PLANS_ADMIN[code] || { name: 'Custom', maxRequests: 20, periodDays: 30 };
  if (!confirm(`Approve ${plan.name}?`)) return;
  const expiresAt = new Date(Date.now() + plan.periodDays * 86400000);
  await db.collection('creatorSubs').doc(uid).set({ status: 'active', maxRequests: plan.maxRequests, usedRequests: 0, expiresAt, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
  await window.markLatestSubOrderApproved(uid);
  alert('Activated!');
};

window.rejectCreatorSub = function (uid) {
  if (confirm('Reject?')) db.collection('creatorSubs').doc(uid).set({ status: 'rejected', updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
};

window.deleteCreatorSub = function (uid) {
  if (confirm("Permanently delete this record?")) db.collection('creatorSubs').doc(uid).delete().then(() => alert("Deleted."));
};

window.manageUserSub = async function(uid, max, expTime) {
    const act = prompt("1. Add Bonus (+10)\n2. Extend (+7 Days)\n3. Cancel Plan");
    if(act === '1') {
        const amt = parseInt(prompt("Amount?", "10"));
        if(amt) await db.collection('creatorSubs').doc(uid).update({ maxRequests: parseInt(max)+amt });
    } else if (act === '2') {
        const days = parseInt(prompt("Days?", "7"));
        if(days) {
            const newDate = new Date(parseInt(expTime) + (days * 86400000));
            await db.collection('creatorSubs').doc(uid).update({ expiresAt: newDate });
        }
    } else if (act === '3') {
        if(confirm("Cancel plan?")) await db.collection('creatorSubs').doc(uid).update({ status: 'cancelled' });
    }
};

window.markLatestSubOrderApproved = async function (uid) {
  try {
    const snap = await db.collection('orders').where('userId', '==', uid).orderBy('timestamp', 'desc').limit(5).get();
    let done = false;
    snap.forEach(doc => { if(done) return; const d=doc.data(); if(d.gameId?.startsWith('sub_') && d.status==='pending') { doc.ref.update({status:'approved'}); done=true; } });
  } catch(e) {}
};

/* =========================================
   3. MOD REQUESTS SUMMARY
   ========================================= */

window.loadModRequests = function () {
  const list = document.getElementById('modreq-users-list');
  if (!list || !window.db) return;
  db.collection('modRequests').orderBy('timestamp', 'desc').onSnapshot(snap => {
      if (snap.empty) { list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No requests.</td></tr>`; return; }
      const byUser = {};
      snap.forEach(doc => {
          const r = doc.data();
          const uid = r.userId;
          if(!byUser[uid]) byUser[uid] = { email: r.email, total: 0, approved: 0, pending: 0, last: 0 };
          byUser[uid].total++;
          if(r.status==='approved') byUser[uid].approved++; else if(r.status==='pending') byUser[uid].pending++;
          const t = r.timestamp ? r.timestamp.toDate().getTime() : 0;
          if(t > byUser[uid].last) byUser[uid].last = t;
      });

      let html = '';
      Object.entries(byUser).forEach(([uid, u]) => {
          html += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
                <td class="p-3 font-bold">${u.email}</td>
                <td class="p-3 text-center">${u.total}</td>
                <td class="p-3 text-xs"><span class="text-green-600 font-bold">${u.approved} Done</span> · <span class="text-amber-600 font-bold">${u.pending} Pending</span></td>
                <td class="p-3 text-xs text-slate-500">${new Date(u.last).toLocaleDateString()}</td>
                <td class="p-3 text-right">
                    <button onclick="window.viewUserModRequests('${uid}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold shadow hover:bg-blue-700">View</button>
                </td>
            </tr>`;
      });
      list.innerHTML = html;
  });
};

window.viewUserModRequests = function (userId) {
  window.adminSelectedUserId = userId;
  if (window.router) window.router.navigateTo('/creator-admin-user');
};

/* =========================================
   4. USER REQUESTS DETAILS PAGE (MISSING IN PREVIOUS VERSION)
   ========================================= */

function CreatorAdminUserRequestsPage() {
  if (!window.isAdmin) { if(window.router) window.router.navigateTo('/'); return ''; }
  if (!window.adminSelectedUserId) { if(window.router) window.router.navigateTo('/creator-admin'); return ''; }

  setTimeout(() => window.loadAdminUserRequests(), 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">User Requests</h1>
        <button onclick="window.router.navigateTo('/creator-admin')" class="text-xs bg-slate-200 px-3 py-1 rounded font-bold">Back</button>
      </div>
      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr><th class="p-3">Request</th><th class="p-3">Game</th><th class="p-3">Status</th><th class="p-3">Link</th><th class="p-3">Actions</th></tr>
          </thead>
          <tbody id="admin-user-requests-list"><tr><td colspan="5" class="p-6 text-center text-slate-400">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
}

window.loadAdminUserRequests = function () {
  const list = document.getElementById('admin-user-requests-list');
  const uid = window.adminSelectedUserId;
  if (!list || !uid) return;

  db.collection('modRequests').where('userId', '==', uid).orderBy('timestamp', 'desc').onSnapshot(snap => {
      let html = '';
      snap.forEach(doc => {
        const r = doc.data();
        const id = doc.id;
        const mainLabel = r.playerName || r.teamName || 'Custom Request';
        
        // Status Badge
        let statusBadge = `<span class="badge bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Pending</span>`;
        if(r.status === 'approved') statusBadge = `<span class="badge bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Approved</span>`;
        else if(r.status === 'rejected') statusBadge = `<span class="badge bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Rejected</span>`;

        // Link Status
        const linkHtml = r.downloadUrl ? `<a href="${r.downloadUrl}" target="_blank" class="text-blue-600 underline text-xs">Open Link</a>` : `<span class="text-slate-400 text-xs">No Link</span>`;

        // Actions
        let btns = '';
        if(r.status !== 'approved') {
            btns += `<button onclick="window.setModDownloadLink('${id}')" class="bg-blue-600 text-white p-1.5 rounded mr-1" title="Approve & Link"><span class="material-icons text-xs">link</span></button>`;
        }
        if(r.status !== 'rejected') {
            btns += `<button onclick="window.updateModStatus('${id}', 'rejected')" class="bg-red-500 text-white p-1.5 rounded mr-1" title="Reject"><span class="material-icons text-xs">close</span></button>`;
        }
        // DELETE BUTTON
        btns += `<button onclick="window.deleteModRequest('${id}')" class="bg-slate-200 text-slate-600 p-1.5 rounded hover:bg-red-100 hover:text-red-600 transition" title="Delete"><span class="material-icons text-xs">delete</span></button>`;

        html += `<tr class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="p-3 font-bold">${mainLabel}<div class="text-[10px] text-slate-400">${r.type || 'player'}</div></td>
            <td class="p-3 text-xs uppercase">${r.gameId || '-'}</td>
            <td class="p-3">${statusBadge}</td>
            <td class="p-3">${linkHtml}</td>
            <td class="p-3 flex">${btns}</td>
        </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="5" class="p-6 text-center text-slate-400">No requests found.</td></tr>`;
  });
};

window.setModDownloadLink = function (id) {
  const link = prompt("Paste download link (Approve):");
  if (link) db.collection('modRequests').doc(id).update({ downloadUrl: link, status: 'approved', hasDownload: true });
};

window.updateModStatus = function (id, status) {
  if (confirm(`Mark as ${status}?`)) db.collection('modRequests').doc(id).update({ status });
};

window.deleteModRequest = function (id) {
  if (confirm("Permanently delete this request?")) db.collection('modRequests').doc(id).delete();
};

// EXPORTS
window.CreatorAdminPage = CreatorAdminPage;
window.CreatorAdminUserRequestsPage = CreatorAdminUserRequestsPage;
