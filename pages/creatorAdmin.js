// pages/creatorAdmin.js

const CREATOR_PLANS_ADMIN = {
  P100: { name: 'Starter', maxRequests: 20, periodDays: 30 },
  P300: { name: 'Pro', maxRequests: 70, periodDays: 30 },
  P1000: { name: 'Elite', maxRequests: null, periodDays: 60 }
};

// Global state for selection
window.selectedHistoryIds = new Set();
window.currentVisibleIds = []; // Tracks IDs currently shown on screen for "Select All"

function CreatorAdminPage() {
  if (!window.isAdmin) {
    if(window.router) window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => {
    // Default to 'pending' if no filter set
    if(!window.currentSubFilter) window.switchSubTab('pending');
    else window.loadCreatorSubs(window.currentSubFilter);
    
    window.loadModRequests(); 
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-8">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Mod Creator Admin</h1>
           <p class="text-sm text-slate-500">Manage subscriptions & custom requests</p>
        </div>
        <div>
            <button onclick="window.router.navigateTo('/admin')" class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 px-4 py-2 rounded-lg text-sm font-bold transition">
                Back to Dashboard
            </button>
        </div>
      </div>

      <!-- BULK ACTION BAR (Hidden by default) -->
      <div id="bulk-action-bar" class="hidden sticky top-4 z-50 bg-white dark:bg-slate-800 border-l-4 border-red-500 shadow-xl rounded-r-xl p-4 flex justify-between items-center animate-fade-in">
        <div class="flex items-center gap-3">
          <span class="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs" id="selected-count">0</span>
          <span class="text-slate-700 dark:text-slate-200 font-bold text-sm">Items Selected</span>
        </div>
        <button onclick="window.deleteSelectedHistory()" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg transition flex items-center gap-2">
          <span class="material-icons text-sm">delete</span> Delete Selected
        </button>
      </div>

      <!-- SUBSCRIPTIONS SECTION -->
      <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        
        <!-- TABS -->
        <div class="flex border-b border-slate-200 dark:border-slate-700">
          <button onclick="window.switchSubTab('pending')" id="tab-pending" class="flex-1 py-4 text-sm font-bold border-b-2 transition">🔔 Pending</button>
          <button onclick="window.switchSubTab('active')" id="tab-active" class="flex-1 py-4 text-sm font-bold border-b-2 transition">✅ Active</button>
          <button onclick="window.switchSubTab('history')" id="tab-history" class="flex-1 py-4 text-sm font-bold border-b-2 transition">📂 History</button>
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
              <tr>
                <!-- Checkbox Header (Only shows in history/active) -->
                <th class="p-4 w-10 text-center">
                   <input type="checkbox" id="select-all-checkbox" onclick="window.toggleSelectAll(this)" class="w-4 h-4 cursor-pointer hidden accent-blue-600">
                </th>
                <th class="p-4">User</th>
                <th class="p-4">Plan</th>
                <th class="p-4 w-1/4">Usage</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="creator-subs-list">
              <tr><td colspan="6" class="p-10 text-center text-slate-400">Loading data...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- MOD REQUESTS SECTION -->
      <section>
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Incoming Mod Requests</h2>
            <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-bold">Grouped By User</span>
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
            <tbody id="modreq-users-list"><tr><td colspan="5" class="p-10 text-center text-slate-400">Loading...</td></tr></tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

/* =========================================
   2. SUBSCRIPTION LOGIC & BULK DELETE
   ========================================= */

window.currentSubFilter = 'pending';

window.switchSubTab = function(tab) {
    window.currentSubFilter = tab;
    
    // Clear selections when switching tabs to avoid deleting wrong items
    window.selectedHistoryIds.clear(); 
    window.updateBulkActionBar();
    
    // Reset Select All Checkbox
    const headerCheck = document.getElementById('select-all-checkbox');
    if(headerCheck) {
        headerCheck.checked = false;
        // Show checkbox only in history and active tabs
        if (tab === 'history' || tab === 'active') {
            headerCheck.classList.remove('hidden');
        } else {
            headerCheck.classList.add('hidden');
        }
    }

    window.loadCreatorSubs(tab);
    
    // UI Updates (Active Tab Styling)
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
    if (snapshot.empty) { 
        list.innerHTML = `<tr><td colspan="6" class="p-10 text-center text-slate-400">No data found.</td></tr>`; 
        return; 
    }

    let html = '';
    let count = 0;
    const now = Date.now();

    // Reset visible IDs for "Select All" logic
    window.currentVisibleIds = [];

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

      // Apply Filter
      if (filter !== category) return;
      count++;

      // Usage Bar
      const used = s.usedRequests || 0;
      const max = s.maxRequests;
      let usagePercent = max ? Math.min(100, (used / max) * 100) : 0;
      let usageColor = usagePercent > 80 ? 'bg-red-500' : (usagePercent > 50 ? 'bg-yellow-500' : 'bg-blue-600');
      
      let statusText = '';
      let actions = '';
      let checkboxHtml = '';

      // --- RENDER LOGIC BASED ON TAB ---
      
      // 1. History or Active (Show Checkboxes)
      if(category === 'history' || category === 'active') {
          window.currentVisibleIds.push(uid);
          const isChecked = window.selectedHistoryIds.has(uid) ? 'checked' : '';
          checkboxHtml = `<input type="checkbox" class="w-4 h-4 cursor-pointer history-checkbox accent-blue-600" 
                           onclick="window.toggleSelection('${uid}')" ${isChecked}>`;
      }

      if(category === 'history') {
          statusText = `<span class="text-slate-400 font-bold uppercase text-xs">${s.status === 'active' ? 'Expired' : s.status}</span>`;
          // History actions: just delete
          actions = `<button onclick="window.deleteCreatorSub('${uid}')" class="text-red-500 hover:bg-red-50 p-2 rounded"><span class="material-icons text-sm">delete</span></button>`;
      } 
      else if (category === 'pending') {
          statusText = `<span class="text-amber-600 font-bold">Waiting Approval</span>`;
          actions = `
            <button onclick="window.approveCreatorSub('${uid}', '${s.planCode}')" class="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-xs font-bold mr-2 transition">Approve</button>
            <button onclick="window.rejectCreatorSub('${uid}')" class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs font-bold transition">Reject</button>
          `;
      } 
      else {
          // Active Tab
          const daysLeft = Math.ceil((expiresAt.getTime() - now) / 86400000);
          statusText = `<span class="text-green-600 font-bold">${daysLeft} days left</span>`;
          // Manage button
          actions = `<button onclick="window.manageUserSub('${uid}', '${s.maxRequests||0}')" class="bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ml-auto">
            <span class="material-icons text-xs">settings</span> Manage
          </button>`;
      }

      html += `
        <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
          <td class="p-4 text-center">${checkboxHtml}</td>
          <td class="p-4 font-bold text-xs">
            ${s.email}
            <div class="text-[9px] text-slate-400 font-mono mt-0.5">${uid}</div>
          </td>
          <td class="p-4">
            <span class="badge bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800 rounded px-2 py-0.5 text-xs font-bold">
              ${planName}
            </span>
          </td>
          <td class="p-4">
             <div class="w-24 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden mb-1">
               <div class="h-full ${usageColor}" style="width: ${usagePercent}%"></div>
             </div>
             <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">${used} / ${max || '∞'}</div>
          </td>
          <td class="p-4 text-xs">${statusText}</td>
          <td class="p-4 text-right">${actions}</td>
        </tr>`;
    });

    list.innerHTML = count === 0 ? `<tr><td colspan="6" class="p-10 text-center text-slate-400">No data found in ${filter}.</td></tr>` : html;
  });
};

/* --- BULK SELECT & DELETE LOGIC --- */

window.toggleSelection = function(uid) {
    if(window.selectedHistoryIds.has(uid)) {
        window.selectedHistoryIds.delete(uid);
    } else {
        window.selectedHistoryIds.add(uid);
    }
    
    // Uncheck "Select All" if we manually uncheck one
    if(!window.selectedHistoryIds.has(uid)) {
        const header = document.getElementById('select-all-checkbox');
        if(header) header.checked = false;
    }
    
    window.updateBulkActionBar();
};

window.toggleSelectAll = function(source) {
    const checkboxes = document.querySelectorAll('.history-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
    
    if(source.checked) {
        // Add all currently visible IDs
        window.currentVisibleIds.forEach(id => window.selectedHistoryIds.add(id));
    } else {
        // Clear all
        window.selectedHistoryIds.clear();
    }
    window.updateBulkActionBar();
};

window.updateBulkActionBar = function() {
    const bar = document.getElementById('bulk-action-bar');
    const countEl = document.getElementById('selected-count');
    const count = window.selectedHistoryIds.size;
    
    if(count > 0) {
        bar.classList.remove('hidden');
        bar.classList.add('flex'); // ensure flex display
        countEl.textContent = count;
    } else {
        bar.classList.add('hidden');
        bar.classList.remove('flex');
    }
};

window.deleteSelectedHistory = async function() {
    const ids = Array.from(window.selectedHistoryIds);
    if(!ids.length) return;
    
    const confirmMsg = `⚠️ Are you sure you want to PERMANENTLY DELETE ${ids.length} records?\n\nThis cannot be undone.`;
    if(!confirm(confirmMsg)) return;
    
    // Batch delete
    const promises = ids.map(id => db.collection('creatorSubs').doc(id).delete());
    
    try {
        await Promise.all(promises);
        window.selectedHistoryIds.clear();
        window.updateBulkActionBar();
        
        // Reset header checkbox
        const header = document.getElementById('select-all-checkbox');
        if(header) header.checked = false;
        
        alert("✅ Deleted successfully.");
    } catch(e) {
        alert("Error deleting: " + e.message);
    }
};

/* --- SINGLE ACTIONS --- */

window.approveCreatorSub = async function (uid, code) {
  const plan = CREATOR_PLANS_ADMIN[code] || { name: 'Custom', maxRequests: 20, periodDays: 30 };
  
  if (!confirm(`Approve ${plan.name} Plan for this user?`)) return;
  
  const expiresAt = new Date(Date.now() + plan.periodDays * 86400000);
  
  // Activate and Reset usage to 0
  await db.collection('creatorSubs').doc(uid).set({ 
      status: 'active', 
      maxRequests: plan.maxRequests, 
      usedRequests: 0, 
      expiresAt, 
      updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
  }, { merge: true });
  
  await window.markLatestSubOrderApproved(uid);
  alert('✅ Plan Activated!');
};

window.rejectCreatorSub = function (uid) {
  if (confirm('Reject this subscription request?')) {
      db.collection('creatorSubs').doc(uid).set({ 
          status: 'rejected', 
          updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
      }, { merge: true });
  }
};

window.deleteCreatorSub = function (uid) {
  if (confirm("Delete this record permanently?")) {
      db.collection('creatorSubs').doc(uid).delete();
  }
};

// --- NEW MANAGE FUNCTION WITH RESET OPTION ---
window.manageUserSub = async function(uid, currentMax) {
    const action = prompt(
      "Manage User Subscription:\n" +
      "------------------------\n" +
      "1. 🔄 Reset Usage to 0 (Renewal)\n" +
      "2. ➕ Add Bonus Requests (+10)\n" +
      "3. 📅 Extend Duration (+7 Days)\n" +
      "4. 🚫 Cancel Plan\n\n" +
      "Enter number (1-4):"
    );

    if (action === '1') {
        // RESET USAGE
        if(confirm("Confirm: Reset 'Used Requests' count to 0?")) {
            await db.collection('creatorSubs').doc(uid).update({ usedRequests: 0 });
            alert("✅ Usage reset to 0.");
        }
    } 
    else if (action === '2') {
        // ADD BONUS
        const amt = prompt("Enter amount to add (e.g., 10):", "10");
        if(amt && parseInt(amt) > 0) {
            await db.collection('creatorSubs').doc(uid).update({ 
                maxRequests: firebase.firestore.FieldValue.increment(parseInt(amt)) 
            });
            alert(`✅ Added ${amt} requests.`);
        }
    } 
    else if (action === '3') {
        // EXTEND TIME
        const days = prompt("Enter days to extend:", "7");
        if(days && parseInt(days) > 0) {
            // We need to fetch current expiry first to add correctly, 
            // but for simplicity, we can do a quick read or just update.
            // A safer way without reading is complex, so let's just do a quick read:
            const doc = await db.collection('creatorSubs').doc(uid).get();
            const data = doc.data();
            const currentExp = data.expiresAt ? data.expiresAt.toDate().getTime() : Date.now();
            const newDate = new Date(currentExp + (parseInt(days) * 86400000));
            
            await db.collection('creatorSubs').doc(uid).update({ expiresAt: newDate });
            alert(`✅ Extended by ${days} days.`);
        }
    } 
    else if (action === '4') {
        // CANCEL
        if(confirm("Are you sure you want to CANCEL this plan?")) {
            await db.collection('creatorSubs').doc(uid).update({ status: 'cancelled' });
            alert("🚫 Plan cancelled.");
        }
    }
};

window.markLatestSubOrderApproved = async function (uid) {
  try {
    const snap = await db.collection('orders')
        .where('userId', '==', uid)
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();
        
    let done = false;
    snap.forEach(doc => { 
        if(done) return; 
        const d=doc.data(); 
        // Find the most recent pending sub order
        if(d.gameId?.startsWith('sub_') && d.status==='pending') { 
            doc.ref.update({status:'approved'}); 
            done=true; 
        } 
    });
  } catch(e) {
      console.warn("Could not auto-update order status:", e);
  }
};

/* =========================================
   3. MOD REQUESTS (Logic unchanged)
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
          if(r.status==='approved') byUser[uid].approved++; 
          else if(r.status==='pending') byUser[uid].pending++;
          
          const t = r.timestamp ? r.timestamp.toDate().getTime() : 0;
          if(t > byUser[uid].last) byUser[uid].last = t;
      });
      
      let html = '';
      Object.entries(byUser).forEach(([uid, u]) => {
          html += `<tr class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="p-3 font-bold">${u.email}</td>
            <td class="p-3 text-center">${u.total}</td>
            <td class="p-3 text-xs">
                <span class="text-green-600 font-bold">${u.approved} Done</span> · 
                <span class="text-amber-600 font-bold">${u.pending} Pending</span>
            </td>
            <td class="p-3 text-xs text-slate-500">${new Date(u.last).toLocaleDateString()}</td>
            <td class="p-3 text-right">
                <button onclick="window.viewUserModRequests('${uid}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 transition">View</button>
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
   4. USER REQUESTS DETAILS
   ========================================= */

function CreatorAdminUserRequestsPage() {
  if (!window.isAdmin) { if(window.router) window.router.navigateTo('/'); return ''; }
  if (!window.adminSelectedUserId) { if(window.router) window.router.navigateTo('/creator-admin'); return ''; }
  setTimeout(() => window.loadAdminUserRequests(), 100);
  
  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">User Requests</h1>
        <button onclick="window.router.navigateTo('/creator-admin')" class="text-xs bg-slate-200 px-3 py-1 rounded font-bold hover:bg-slate-300">Back</button>
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
        const mainLabel = r.playerName || r.teamName || 'Custom';
        
        let statusBadge = `<span class="badge bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Pending</span>`;
        if(r.status === 'approved') statusBadge = `<span class="badge bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Approved</span>`;
        else if(r.status === 'rejected') statusBadge = `<span class="badge bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Rejected</span>`;

        let btns = '';
        if(r.status !== 'approved') btns += `<button onclick="window.setModDownloadLink('${id}')" class="bg-blue-600 text-white p-1.5 rounded mr-1"><span class="material-icons text-xs">link</span></button>`;
        if(r.status !== 'rejected') btns += `<button onclick="window.updateModStatus('${id}', 'rejected')" class="bg-red-500 text-white p-1.5 rounded mr-1"><span class="material-icons text-xs">close</span></button>`;
        btns += `<button onclick="window.deleteModRequest('${id}')" class="bg-slate-200 text-slate-600 p-1.5 rounded"><span class="material-icons text-xs">delete</span></button>`;

        html += `<tr class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="p-3 font-bold">
                ${mainLabel}
                <div class="text-[10px] text-slate-400">${r.type || 'player'}</div>
            </td>
            <td class="p-3 text-xs uppercase">${r.gameId || '-'}</td>
            <td class="p-3">${statusBadge}</td>
            <td class="p-3 text-xs">${r.downloadUrl ? '<a href="'+r.downloadUrl+'" target="_blank" class="text-blue-600 underline">Open</a>' : 'No Link'}</td>
            <td class="p-3 flex">${btns}</td>
        </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="5" class="p-6 text-center text-slate-400">No requests found for this user.</td></tr>`;
  });
};

window.setModDownloadLink = function (id) {
  const link = prompt("Paste Download Link:");
  if (link) {
      db.collection('modRequests').doc(id).update({ 
          downloadUrl: link, 
          status: 'approved', 
          hasDownload: true 
      });
  }
};
window.updateModStatus = function (id, status) { 
    if (confirm(`Mark request as ${status}?`)) {
        db.collection('modRequests').doc(id).update({ status }); 
    }
};
window.deleteModRequest = function (id) { 
    if (confirm("Delete this request?")) {
        db.collection('modRequests').doc(id).delete(); 
    }
};

window.CreatorAdminPage = CreatorAdminPage;
window.CreatorAdminUserRequestsPage = CreatorAdminUserRequestsPage;
