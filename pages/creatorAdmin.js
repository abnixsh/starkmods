// pages/creatorAdmin.js
// Stark Mods - Minimalist Apple-Glass Mod Creator Admin Studio

const CREATOR_PLANS_ADMIN = {
  P100: { name: 'Starter', maxRequests: 20, periodDays: 30 },
  P300: { name: 'Pro', maxRequests: 70, periodDays: 30 },
  P1000: { name: 'Elite', maxRequests: null, periodDays: 60 }
};

// Global State
window.selectedHistoryIds = new Set();
window.currentVisibleIds = [];
window.creatorSubsUnsub = null;
window.modRequestsUnsub = null;
window.adminUserRequestsUnsub = null;
window.currentSubFilter = 'pending';
window.currentManagingUid = null;
window.currentEditingReqId = null;

function CreatorAdminPage() {
  if (!window.isAdmin) {
    if (window.router) window.router.navigateTo('/');
    return '';
  }

  // Cleanup old listeners when navigating
  if (window.creatorSubsUnsub) { window.creatorSubsUnsub(); window.creatorSubsUnsub = null; }
  if (window.modRequestsUnsub) { window.modRequestsUnsub(); window.modRequestsUnsub = null; }

  setTimeout(() => {
    window.switchSubTab(window.currentSubFilter || 'pending');
    window.loadModRequests();
    window.loadCreatorStats();
  }, 60);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-24 space-y-8 px-4 sm:px-6">
      
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-pink-500/10 text-pink-500">
              <span class="material-icons text-base">auto_fix_high</span>
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Creator Admin Studio</h1>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">Manage creator subscription plans, activations, and custom mod requests</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.router.navigateTo('/admin')" class="apple-glass-pill py-2 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-500 flex items-center gap-1.5 transition">
            <span class="material-icons text-sm">arrow_back</span> Dashboard
          </button>
        </div>
      </div>

      <!-- STATS OVERVIEW CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="apple-glass-card p-4 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Subs</span>
            <div class="text-2xl font-black text-amber-500 mt-0.5" id="stat-pending-subs">-</div>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <span class="material-icons text-xl">notifications_active</span>
          </div>
        </div>

        <div class="apple-glass-card p-4 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Creators</span>
            <div class="text-2xl font-black text-emerald-500 mt-0.5" id="stat-active-subs">-</div>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <span class="material-icons text-xl">verified</span>
          </div>
        </div>

        <div class="apple-glass-card p-4 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mod Requests</span>
            <div class="text-2xl font-black text-blue-500 mt-0.5" id="stat-total-requests">-</div>
          </div>
          <div class="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <span class="material-icons text-xl">view_in_ar</span>
          </div>
        </div>
      </div>

      <!-- BULK ACTION BAR (Floating Apple Glass Pill) -->
      <div id="bulk-action-bar" class="hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 apple-glass-card border border-red-500/30 shadow-2xl px-5 py-3 rounded-full flex items-center gap-4 animate-fade-in backdrop-blur-2xl">
        <div class="flex items-center gap-2">
          <span class="bg-red-500 text-white font-black px-2.5 py-0.5 rounded-full text-xs" id="selected-count">0</span>
          <span class="text-slate-800 dark:text-slate-200 font-bold text-xs">Selected</span>
        </div>
        <div class="h-4 w-[1px] bg-slate-300 dark:bg-slate-700"></div>
        <button onclick="window.deleteSelectedHistory()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg transition flex items-center gap-1.5 active:scale-95">
          <span class="material-icons text-xs">delete_forever</span> Delete Selected
        </button>
        <button onclick="window.clearSelection()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold">
          Clear
        </button>
      </div>

      <!-- SUBSCRIPTIONS SECTION -->
      <section class="apple-glass-card overflow-hidden">
        
        <!-- APPLE SEGMENTED CONTROL TABS -->
        <div class="p-3 sm:p-4 border-b border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="inline-flex p-1 rounded-2xl bg-slate-200/50 dark:bg-slate-800/60 backdrop-blur-md w-full sm:w-auto">
            <button onclick="window.switchSubTab('pending')" id="tab-pending" class="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition">
              🔔 Pending
            </button>
            <button onclick="window.switchSubTab('active')" id="tab-active" class="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition">
              ✅ Active
            </button>
            <button onclick="window.switchSubTab('history')" id="tab-history" class="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition">
              📂 History
            </button>
          </div>

          <div class="text-[11px] font-bold text-slate-400" id="subs-table-count">Loading...</div>
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">
              <tr>
                <th class="p-4 w-10 text-center">
                   <input type="checkbox" id="select-all-checkbox" onclick="window.toggleSelectAll(this)" class="w-4 h-4 cursor-pointer hidden accent-blue-600 rounded">
                </th>
                <th class="p-4">User</th>
                <th class="p-4">Plan</th>
                <th class="p-4 min-w-[140px]">Usage</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="creator-subs-list" class="divide-y divide-slate-100 dark:divide-slate-800/50">
              <tr><td colspan="6" class="p-10 text-center text-slate-400">Loading data...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- MOD REQUESTS SECTION -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/10 text-blue-500">
              <span class="material-icons text-sm">view_in_ar</span>
            </span>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Custom Mod Requests</h2>
          </div>
          <span class="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Grouped By Creator
          </span>
        </div>

        <div class="apple-glass-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">
                <tr>
                  <th class="p-4">Creator Email</th>
                  <th class="p-4 text-center">Total Requests</th>
                  <th class="p-4">Status Summary</th>
                  <th class="p-4">Last Activity</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="modreq-users-list" class="divide-y divide-slate-100 dark:divide-slate-800/50">
                <tr><td colspan="5" class="p-10 text-center text-slate-400">Loading mod requests...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- MODAL: MANAGE SUBSCRIPTION (Minimalist Apple Glass Modal) -->
      <div id="manage-sub-modal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <div class="apple-glass-card w-full max-w-md p-6 space-y-5 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700">
          <div class="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Manage Subscription</h3>
              <p class="text-xs text-slate-400 truncate max-w-[280px]" id="modal-sub-email">user@email.com</p>
            </div>
            <button onclick="window.closeManageSubModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition">
              <span class="material-icons text-lg">close</span>
            </button>
          </div>

          <div class="bg-slate-100/60 dark:bg-slate-900/60 p-4 rounded-2xl space-y-2 text-xs">
            <div class="flex justify-between text-slate-500">
              <span>Plan:</span>
              <span class="font-bold text-slate-900 dark:text-white" id="modal-sub-plan">-</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Used / Limit:</span>
              <span class="font-bold text-slate-900 dark:text-white" id="modal-sub-usage">-</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Expires:</span>
              <span class="font-bold text-slate-900 dark:text-white" id="modal-sub-expires">-</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions</div>
            
            <button onclick="window.subModalResetUsage()" class="w-full flex items-center justify-between p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-bold text-xs transition">
              <span class="flex items-center gap-2"><span class="material-icons text-sm">restart_alt</span> Reset Usage to 0 (Renewal)</span>
              <span class="material-icons text-xs">chevron_right</span>
            </button>

            <div class="flex gap-2">
              <button onclick="window.subModalAddRequests(10)" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                +10 Requests
              </button>
              <button onclick="window.subModalAddRequests(25)" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                +25 Requests
              </button>
              <button onclick="window.subModalAddDays(7)" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                +7 Days
              </button>
              <button onclick="window.subModalAddDays(30)" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                +30 Days
              </button>
            </div>

            <div class="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <button onclick="window.subModalToggleStatus()" id="modal-sub-toggle-btn" class="apple-glass-pill text-xs font-bold py-2 px-4 hover:text-amber-500 transition">
                Cancel Plan
              </button>
              <button onclick="window.subModalDelete()" class="text-red-500 hover:text-red-600 text-xs font-bold py-2 px-3 flex items-center gap-1 transition">
                <span class="material-icons text-xs">delete</span> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: SET DOWNLOAD LINK & APPROVE MOD (Minimalist Apple Glass Modal) -->
      <div id="mod-link-modal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <div class="apple-glass-card w-full max-w-md p-6 space-y-4 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700">
          <div class="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Provide Mod Download Link</h3>
              <p class="text-xs text-slate-400" id="link-modal-subtitle">Attach the finished mod file for this user</p>
            </div>
            <button onclick="window.closeModLinkModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full">
              <span class="material-icons text-lg">close</span>
            </button>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Download Link (MediaFire, Google Drive, Mega) *</label>
            <input type="text" id="link-modal-input" class="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50" placeholder="https://mediafire.com/file/...">
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800">
            <button onclick="window.closeModLinkModal()" class="apple-glass-pill py-2 px-4 text-xs font-bold">Cancel</button>
            <button onclick="window.saveModDownloadLink()" class="apple-btn-primary px-5 py-2 rounded-full text-xs font-bold shadow flex items-center gap-1.5">
              <span class="material-icons text-xs">cloud_done</span> Save & Approve
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

/* =========================================
   2. SUBSCRIPTION LOGIC & CLEAN LISTENERS
   ========================================= */

window.loadCreatorStats = async function() {
  if (!window.db) return;
  try {
    const subsSnap = await db.collection('creatorSubs').get();
    let pending = 0;
    let active = 0;
    const now = Date.now();

    subsSnap.forEach(d => {
      const s = d.data();
      const exp = s.expiresAt?.toDate ? s.expiresAt.toDate().getTime() : (s.expiresAt ? new Date(s.expiresAt).getTime() : 0);
      if (s.status === 'pending') pending++;
      else if (s.status === 'active' && exp > now) active++;
    });

    const pendingEl = document.getElementById('stat-pending-subs');
    const activeEl = document.getElementById('stat-active-subs');
    if (pendingEl) pendingEl.innerText = pending;
    if (activeEl) activeEl.innerText = active;

    const reqSnap = await db.collection('modRequests').get();
    const reqEl = document.getElementById('stat-total-requests');
    if (reqEl) reqEl.innerText = reqSnap.size;
  } catch (e) {
    console.warn("Stats load error:", e);
  }
};

window.switchSubTab = function(tab) {
  window.currentSubFilter = tab;
  window.selectedHistoryIds.clear();
  window.updateBulkActionBar();

  const headerCheck = document.getElementById('select-all-checkbox');
  if (headerCheck) {
    headerCheck.checked = false;
    headerCheck.classList.toggle('hidden', tab !== 'history' && tab !== 'active');
  }

  // Update Segmented Pill Tab UI
  ['pending', 'active', 'history'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (!el) return;
    if (t === tab) {
      el.className = "flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm transition";
    } else {
      el.className = "flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition";
    }
  });

  window.loadCreatorSubs(tab);
};

window.loadCreatorSubs = function(filter) {
  const list = document.getElementById('creator-subs-list');
  const countEl = document.getElementById('subs-table-count');
  if (!list || !window.db) return;

  // Unsubscribe previous to prevent duplicate listeners
  if (window.creatorSubsUnsub) {
    window.creatorSubsUnsub();
    window.creatorSubsUnsub = null;
  }

  window.creatorSubsUnsub = db.collection('creatorSubs').orderBy('requestedAt', 'desc').onSnapshot(snapshot => {
    if (snapshot.empty) {
      list.innerHTML = `<tr><td colspan="6" class="p-10 text-center text-slate-400">No subscriptions found.</td></tr>`;
      if (countEl) countEl.innerText = '0 records';
      return;
    }

    let html = '';
    let count = 0;
    const now = Date.now();
    window.currentVisibleIds = [];

    snapshot.forEach(doc => {
      const s = doc.data();
      const uid = s.userId || doc.id;
      const planCfg = CREATOR_PLANS_ADMIN[s.planCode] || null;
      const planName = planCfg ? planCfg.name : (s.planName || s.planCode || 'Custom');

      let expiresAt = null;
      if (s.expiresAt && typeof s.expiresAt.toDate === 'function') {
        expiresAt = s.expiresAt.toDate();
      } else if (s.expiresAt) {
        expiresAt = new Date(s.expiresAt);
      }

      const isExpired = expiresAt ? expiresAt.getTime() < now : false;

      let category = 'history';
      if (s.status === 'pending') category = 'pending';
      else if (s.status === 'active' && !isExpired) category = 'active';

      if (filter !== category) return;
      count++;

      // Usage bar
      const used = s.usedRequests || 0;
      const max = s.maxRequests;
      const usagePercent = max ? Math.min(100, Math.round((used / max) * 100)) : 0;
      const usageColor = usagePercent > 80 ? 'bg-red-500' : (usagePercent > 50 ? 'bg-amber-500' : 'bg-blue-600');

      let statusHtml = '';
      let actionsHtml = '';
      let checkboxHtml = '';

      if (category === 'history' || category === 'active') {
        window.currentVisibleIds.push(uid);
        const isChecked = window.selectedHistoryIds.has(uid) ? 'checked' : '';
        checkboxHtml = `<input type="checkbox" class="w-4 h-4 cursor-pointer history-checkbox accent-blue-600 rounded" 
                         onclick="window.toggleSelection('${uid}')" ${isChecked}>`;
      }

      if (category === 'history') {
        const displayStatus = s.status === 'active' ? 'Expired' : (s.status || 'Past');
        statusHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300/40 dark:border-slate-700">${displayStatus}</span>`;
        actionsHtml = `
          <button onclick="window.deleteCreatorSub('${uid}')" class="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition" title="Delete Record">
            <span class="material-icons text-sm">delete</span>
          </button>
        `;
      } else if (category === 'pending') {
        statusHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending</span>`;
        actionsHtml = `
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="window.approveCreatorSub('${uid}', '${s.planCode}')" class="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition">
              Approve
            </button>
            <button onclick="window.rejectCreatorSub('${uid}')" class="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition">
              Reject
            </button>
          </div>
        `;
      } else {
        // Active
        const daysLeft = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now) / 86400000)) : 0;
        statusHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${daysLeft}d left</span>`;
        actionsHtml = `
          <button onclick="window.openManageSubModal('${uid}')" class="apple-glass-pill px-3 py-1.5 text-xs font-bold flex items-center gap-1 ml-auto hover:text-blue-500 transition">
            <span class="material-icons text-xs">tune</span> Manage
          </button>
        `;
      }

      html += `
        <tr class="hover:bg-slate-500/5 transition">
          <td class="p-4 text-center">${checkboxHtml}</td>
          <td class="p-4 font-bold text-slate-900 dark:text-slate-100">
            ${s.email || 'No Email'}
            <div class="text-[9px] text-slate-400 font-mono mt-0.5">${uid}</div>
          </td>
          <td class="p-4">
            <span class="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-bold">
              ${planName}
            </span>
          </td>
          <td class="p-4">
            <div class="w-28 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
              <div class="h-full ${usageColor} transition-all duration-500" style="width: ${usagePercent}%"></div>
            </div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">${used} / ${max ?? '∞'} (${usagePercent}%)</div>
          </td>
          <td class="p-4">${statusHtml}</td>
          <td class="p-4 text-right">${actionsHtml}</td>
        </tr>
      `;
    });

    if (countEl) countEl.innerText = `${count} ${filter} records`;
    list.innerHTML = count === 0 ? `<tr><td colspan="6" class="p-10 text-center text-slate-400">No records found under ${filter}.</td></tr>` : html;
  });
};

/* --- BULK SELECT & DELETE --- */

window.toggleSelection = function(uid) {
  if (window.selectedHistoryIds.has(uid)) {
    window.selectedHistoryIds.delete(uid);
  } else {
    window.selectedHistoryIds.add(uid);
  }

  const header = document.getElementById('select-all-checkbox');
  if (header && !window.selectedHistoryIds.has(uid)) {
    header.checked = false;
  }
  window.updateBulkActionBar();
};

window.toggleSelectAll = function(source) {
  const checkboxes = document.querySelectorAll('.history-checkbox');
  checkboxes.forEach(cb => cb.checked = source.checked);

  if (source.checked) {
    window.currentVisibleIds.forEach(id => window.selectedHistoryIds.add(id));
  } else {
    window.selectedHistoryIds.clear();
  }
  window.updateBulkActionBar();
};

window.clearSelection = function() {
  window.selectedHistoryIds.clear();
  const checkboxes = document.querySelectorAll('.history-checkbox');
  checkboxes.forEach(cb => cb.checked = false);
  const header = document.getElementById('select-all-checkbox');
  if (header) header.checked = false;
  window.updateBulkActionBar();
};

window.updateBulkActionBar = function() {
  const bar = document.getElementById('bulk-action-bar');
  const countEl = document.getElementById('selected-count');
  if (!bar) return;
  const count = window.selectedHistoryIds.size;

  if (count > 0) {
    bar.classList.remove('hidden');
    if (countEl) countEl.textContent = count;
  } else {
    bar.classList.add('hidden');
  }
};

window.deleteSelectedHistory = async function() {
  const ids = Array.from(window.selectedHistoryIds);
  if (!ids.length) return;

  if (!confirm(`⚠️ Permanently delete ${ids.length} selected record(s)? This cannot be undone.`)) return;

  try {
    const promises = ids.map(id => db.collection('creatorSubs').doc(id).delete());
    await Promise.all(promises);
    window.clearSelection();
    alert("✅ Selected records deleted.");
    window.loadCreatorStats();
  } catch (e) {
    alert("Error deleting: " + e.message);
  }
};

/* --- SINGLE SUB ACTIONS --- */

window.approveCreatorSub = async function(uid, code) {
  const plan = CREATOR_PLANS_ADMIN[code] || { name: 'Starter', maxRequests: 20, periodDays: 30 };
  if (!confirm(`Approve ${plan.name} Plan for this user?`)) return;

  const expiresAt = new Date(Date.now() + plan.periodDays * 86400000);

  try {
    await db.collection('creatorSubs').doc(uid).set({
      status: 'active',
      maxRequests: plan.maxRequests,
      usedRequests: 0,
      expiresAt,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    await window.markLatestSubOrderApproved(uid);
    alert('✅ Creator Plan Activated!');
    window.loadCreatorStats();
  } catch (e) {
    alert("Approval error: " + e.message);
  }
};

window.rejectCreatorSub = async function(uid) {
  if (!confirm('Reject this subscription request?')) return;
  try {
    await db.collection('creatorSubs').doc(uid).set({
      status: 'rejected',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    window.loadCreatorStats();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.deleteCreatorSub = async function(uid) {
  if (!confirm("Delete this subscription record permanently?")) return;
  try {
    await db.collection('creatorSubs').doc(uid).delete();
    window.loadCreatorStats();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

/* --- MANAGE SUB MODAL (Clean Apple UI) --- */

window.openManageSubModal = async function(uid) {
  window.currentManagingUid = uid;
  const modal = document.getElementById('manage-sub-modal');
  if (!modal || !window.db) return;

  try {
    const doc = await db.collection('creatorSubs').doc(uid).get();
    if (!doc.exists) return;
    const s = doc.data();

    document.getElementById('modal-sub-email').innerText = s.email || uid;
    document.getElementById('modal-sub-plan').innerText = s.planName || s.planCode || 'Custom';
    document.getElementById('modal-sub-usage').innerText = `${s.usedRequests || 0} / ${s.maxRequests ?? '∞'}`;
    
    let expStr = 'No Expiry';
    if (s.expiresAt?.toDate) expStr = s.expiresAt.toDate().toLocaleDateString();
    else if (s.expiresAt) expStr = new Date(s.expiresAt).toLocaleDateString();
    document.getElementById('modal-sub-expires').innerText = expStr;

    const toggleBtn = document.getElementById('modal-sub-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerText = s.status === 'active' ? 'Cancel Plan' : 'Reactivate Plan';
    }

    modal.classList.remove('hidden');
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.closeManageSubModal = function() {
  const modal = document.getElementById('manage-sub-modal');
  if (modal) modal.classList.add('hidden');
  window.currentManagingUid = null;
};

window.subModalResetUsage = async function() {
  const uid = window.currentManagingUid;
  if (!uid) return;
  if (!confirm("Reset used requests count to 0?")) return;

  try {
    await db.collection('creatorSubs').doc(uid).update({ usedRequests: 0 });
    alert("✅ Usage reset to 0.");
    window.closeManageSubModal();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.subModalAddRequests = async function(amount) {
  const uid = window.currentManagingUid;
  if (!uid) return;

  try {
    await db.collection('creatorSubs').doc(uid).update({
      maxRequests: firebase.firestore.FieldValue.increment(amount)
    });
    alert(`✅ Added ${amount} bonus requests!`);
    window.closeManageSubModal();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.subModalAddDays = async function(days) {
  const uid = window.currentManagingUid;
  if (!uid) return;

  try {
    const doc = await db.collection('creatorSubs').doc(uid).get();
    const data = doc.data() || {};
    const currentExp = data.expiresAt?.toDate ? data.expiresAt.toDate().getTime() : Date.now();
    const newDate = new Date(Math.max(Date.now(), currentExp) + (days * 86400000));

    await db.collection('creatorSubs').doc(uid).update({ expiresAt: newDate });
    alert(`✅ Extended plan by ${days} days!`);
    window.closeManageSubModal();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.subModalToggleStatus = async function() {
  const uid = window.currentManagingUid;
  if (!uid) return;

  try {
    const doc = await db.collection('creatorSubs').doc(uid).get();
    const cur = doc.data()?.status || 'active';
    const nextStatus = cur === 'active' ? 'cancelled' : 'active';

    if (!confirm(`Change plan status to ${nextStatus.toUpperCase()}?`)) return;

    await db.collection('creatorSubs').doc(uid).update({
      status: nextStatus,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    window.closeManageSubModal();
    window.loadCreatorStats();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.subModalDelete = async function() {
  const uid = window.currentManagingUid;
  if (!uid) return;
  if (!confirm("⚠️ Delete this record permanently?")) return;

  try {
    await db.collection('creatorSubs').doc(uid).delete();
    window.closeManageSubModal();
    window.loadCreatorStats();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.markLatestSubOrderApproved = async function(uid) {
  try {
    const snap = await db.collection('orders')
      .where('userId', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    let done = false;
    snap.forEach(doc => {
      if (done) return;
      const d = doc.data();
      if ((d.gameId?.startsWith('sub_') || d.item?.gameId?.startsWith('sub_')) && d.status === 'pending') {
        doc.ref.update({ status: 'approved' });
        done = true;
      }
    });
  } catch (e) {
    console.warn("Could not auto-update order status:", e);
  }
};

/* =========================================
   3. MOD REQUESTS (Grouped by Creator)
   ========================================= */

window.loadModRequests = function() {
  const list = document.getElementById('modreq-users-list');
  if (!list || !window.db) return;

  if (window.modRequestsUnsub) {
    window.modRequestsUnsub();
    window.modRequestsUnsub = null;
  }

  window.modRequestsUnsub = db.collection('modRequests').orderBy('timestamp', 'desc').onSnapshot(snap => {
    if (snap.empty) {
      list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No mod requests submitted yet.</td></tr>`;
      return;
    }

    const byUser = {};
    snap.forEach(doc => {
      const r = doc.data();
      const uid = r.userId || 'unknown';
      if (!byUser[uid]) {
        byUser[uid] = { email: r.email || 'Anonymous', total: 0, approved: 0, pending: 0, last: 0 };
      }

      byUser[uid].total++;
      if (r.status === 'approved') byUser[uid].approved++;
      else if (r.status === 'pending' || !r.status) byUser[uid].pending++;

      let t = 0;
      if (r.timestamp?.toDate) t = r.timestamp.toDate().getTime();
      else if (r.timestamp) t = new Date(r.timestamp).getTime();

      if (t > byUser[uid].last) byUser[uid].last = t;
    });

    let html = '';
    Object.entries(byUser).forEach(([uid, u]) => {
      const dateStr = u.last ? new Date(u.last).toLocaleDateString() : '-';
      html += `
        <tr class="hover:bg-slate-500/5 transition">
          <td class="p-4 font-bold text-slate-900 dark:text-slate-100">
            ${u.email}
            <div class="text-[9px] text-slate-400 font-mono mt-0.5">${uid}</div>
          </td>
          <td class="p-4 text-center font-bold text-slate-700 dark:text-slate-300">${u.total}</td>
          <td class="p-4">
            <span class="inline-flex items-center gap-1.5">
              <span class="text-emerald-500 font-bold">${u.approved} Done</span>
              <span class="text-slate-400">·</span>
              <span class="text-amber-500 font-bold">${u.pending} Pending</span>
            </span>
          </td>
          <td class="p-4 text-slate-500 dark:text-slate-400 font-mono">${dateStr}</td>
          <td class="p-4 text-right">
            <button onclick="window.viewUserModRequests('${uid}')" class="apple-btn-primary px-4 py-1.5 rounded-full text-xs font-bold shadow flex items-center gap-1 ml-auto">
              Inspect <span class="material-icons text-xs">arrow_forward</span>
            </button>
          </td>
        </tr>
      `;
    });

    list.innerHTML = html;
  });
};

window.viewUserModRequests = function(userId) {
  window.adminSelectedUserId = userId;
  if (window.router) window.router.navigateTo('/creator-admin-user');
};

/* =========================================
   4. USER REQUESTS DETAILS PAGE
   ========================================= */

function CreatorAdminUserRequestsPage() {
  if (!window.isAdmin) {
    if (window.router) window.router.navigateTo('/');
    return '';
  }
  if (!window.adminSelectedUserId) {
    if (window.router) window.router.navigateTo('/creator-admin');
    return '';
  }

  setTimeout(() => window.loadAdminUserRequests(), 60);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-24 space-y-6 px-4 sm:px-6">
      <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">User Mod Requests</h1>
          <p class="text-xs text-slate-400 font-mono" id="user-requests-subtitle">${window.adminSelectedUserId}</p>
        </div>
        <button onclick="window.router.navigateTo('/creator-admin')" class="apple-glass-pill py-2 px-4 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-500 flex items-center gap-1 transition">
          <span class="material-icons text-sm">arrow_back</span> Back
        </button>
      </div>

      <div class="apple-glass-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">
              <tr>
                <th class="p-4">Request Item</th>
                <th class="p-4">Game</th>
                <th class="p-4">Status</th>
                <th class="p-4">Download Link</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-user-requests-list" class="divide-y divide-slate-100 dark:divide-slate-800/50">
              <tr><td colspan="5" class="p-8 text-center text-slate-400">Loading requests...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

window.loadAdminUserRequests = function() {
  const list = document.getElementById('admin-user-requests-list');
  const uid = window.adminSelectedUserId;
  if (!list || !uid || !window.db) return;

  if (window.adminUserRequestsUnsub) {
    window.adminUserRequestsUnsub();
    window.adminUserRequestsUnsub = null;
  }

  window.adminUserRequestsUnsub = db.collection('modRequests')
    .where('userId', '==', uid)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snap => {
      if (snap.empty) {
        list.innerHTML = `<tr><td colspan="5" class="p-8 text-center text-slate-400">No requests found for this user.</td></tr>`;
        return;
      }

      let html = '';
      snap.forEach(doc => {
        const r = doc.data();
        const id = doc.id;
        const mainLabel = r.playerName || r.teamName || r.jerseyName || 'Custom Request';

        let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">Pending</span>`;
        if (r.status === 'approved') {
          statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Approved</span>`;
        } else if (r.status === 'rejected') {
          statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20">Rejected</span>`;
        }

        const linkHtml = r.downloadUrl
          ? `<a href="${r.downloadUrl}" target="_blank" class="text-blue-500 hover:underline flex items-center gap-1 font-bold">
               <span class="material-icons text-xs">open_in_new</span> Download Link
             </a>`
          : `<span class="text-slate-400">No Link Set</span>`;

        html += `
          <tr class="hover:bg-slate-500/5 transition">
            <td class="p-4">
              <div class="font-bold text-slate-900 dark:text-slate-100">${mainLabel}</div>
              <div class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">${r.type || 'Custom'}</div>
              ${r.notes ? `<div class="text-[10px] text-slate-500 mt-1 italic">Note: ${r.notes}</div>` : ''}
            </td>
            <td class="p-4 uppercase font-bold text-slate-600 dark:text-slate-400">${r.gameId || 'RC25'}</td>
            <td class="p-4">${statusBadge}</td>
            <td class="p-4">${linkHtml}</td>
            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-1">
                <button onclick="window.openModLinkModal('${id}', '${mainLabel}')" class="p-2 rounded-xl text-blue-500 hover:bg-blue-500/10 transition" title="Attach Download Link">
                  <span class="material-icons text-sm">link</span>
                </button>
                <button onclick="window.updateModStatus('${id}', 'rejected')" class="p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 transition" title="Reject Request">
                  <span class="material-icons text-sm">block</span>
                </button>
                <button onclick="window.deleteModRequest('${id}')" class="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition" title="Delete Request">
                  <span class="material-icons text-sm">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      list.innerHTML = html;
    });
};

/* --- MOD LINK MODAL --- */

window.openModLinkModal = function(id, label) {
  window.currentEditingReqId = id;
  const modal = document.getElementById('mod-link-modal');
  const subtitle = document.getElementById('link-modal-subtitle');
  const input = document.getElementById('link-modal-input');
  if (subtitle) subtitle.innerText = `Attach finished mod file for: ${label || 'Request'}`;
  if (input) input.value = '';
  if (modal) modal.classList.remove('hidden');
};

window.closeModLinkModal = function() {
  const modal = document.getElementById('mod-link-modal');
  if (modal) modal.classList.add('hidden');
  window.currentEditingReqId = null;
};

window.saveModDownloadLink = async function() {
  const id = window.currentEditingReqId;
  const linkInput = document.getElementById('link-modal-input');
  const link = linkInput ? linkInput.value.trim() : '';

  if (!id) return;
  if (!link) {
    alert("Please enter a download link.");
    return;
  }

  try {
    await db.collection('modRequests').doc(id).update({
      downloadUrl: link,
      status: 'approved',
      hasDownload: true,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    window.closeModLinkModal();
    alert("✅ Mod download link saved and request approved!");
  } catch (e) {
    alert("Error saving: " + e.message);
  }
};

window.updateModStatus = async function(id, status) {
  if (!confirm(`Mark request as ${status.toUpperCase()}?`)) return;
  try {
    await db.collection('modRequests').doc(id).update({
      status,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    alert("Error: " + e.message);
  }
};

window.deleteModRequest = async function(id) {
  if (!confirm("Permanently delete this request?")) return;
  try {
    await db.collection('modRequests').doc(id).delete();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

// Export to window
window.CreatorAdminPage = CreatorAdminPage;
window.CreatorAdminUserRequestsPage = CreatorAdminUserRequestsPage;
