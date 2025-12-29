// pages/creatorAdmin.js

const CREATOR_PLANS_ADMIN = {
  P100: { name: 'Starter', maxRequests: 20, periodDays: 30 },
  P300: { name: 'Pro', maxRequests: 70, periodDays: 30 },
  P1000: { name: 'Elite', maxRequests: null, periodDays: 60 }
};

function CreatorAdminPage() {
  if (!window.isAdmin) {
    if(window.router) window.router.navigateTo('/');
    return '';
  }

  // Load data immediately
  setTimeout(() => {
    // Default to 'pending' tab logic setup
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

      <!-- SECTION 1: SUBSCRIPTIONS (V2 Layout) -->
      <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        
        <!-- TABS -->
        <div class="flex border-b border-slate-200 dark:border-slate-700">
          <button onclick="window.switchSubTab('pending')" id="tab-pending" 
                  class="flex-1 py-4 text-sm font-bold border-b-2 transition">
             🔔 Pending
          </button>
          <button onclick="window.switchSubTab('active')" id="tab-active" 
                  class="flex-1 py-4 text-sm font-bold border-b-2 transition">
             ✅ Active
          </button>
          <button onclick="window.switchSubTab('history')" id="tab-history" 
                  class="flex-1 py-4 text-sm font-bold border-b-2 transition">
             📂 History / Rejected
          </button>
        </div>

        <!-- TABLE -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
              <tr>
                <th class="p-4">User</th>
                <th class="p-4">Plan</th>
                <th class="p-4 w-1/4">Usage Quota</th>
                <th class="p-4">Expiry / Status</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="creator-subs-list">
              <tr><td colspan="5" class="p-10 text-center text-slate-400">Loading data...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- SECTION 2: MOD REQUESTS -->
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
                <th class="p-3">Total Requests</th>
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

/* ---------- SUBSCRIPTION TABS LOGIC ---------- */

window.currentSubFilter = 'pending';

window.switchSubTab = function(tab) {
    window.currentSubFilter = tab;
    window.loadCreatorSubs(tab);
    
    // Update visual styles
    ['pending', 'active', 'history'].forEach(t => {
        const el = document.getElementById('tab-'+t);
        if(!el) return;
        if(t === tab) {
            el.className = "flex-1 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-slate-700/50 transition";
        } else {
            el.className = "flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-transparent transition";
        }
    });
};

window.loadCreatorSubs = function (filter) {
  const list = document.getElementById('creator-subs-list');
  if (!list || !window.db) return;

  // Real-time listener
  db.collection('creatorSubs').orderBy('requestedAt', 'desc').onSnapshot(snapshot => {
    if (snapshot.empty) {
      list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No data found.</td></tr>`;
      return;
    }

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
      
      // Determine logical category
      let category = 'history';
      if (s.status === 'pending') category = 'pending';
      else if (s.status === 'active' && !isExpired) category = 'active';

      // Filter Logic
      if (filter !== category) return;
      
      count++;

      // Usage Bar
      const used = s.usedRequests || 0;
      const max = s.maxRequests; 
      let usagePercent = 5;
      let usageColor = 'bg-blue-600';
      let usageText = `${used} / ∞`;
      
      if (max) {
        usagePercent = Math.min(100, (used / max) * 100);
        usageText = `${used} / ${max}`;
        if(usagePercent > 80) usageColor = 'bg-red-500';
        else if(usagePercent > 50) usageColor = 'bg-yellow-500';
      }

      // Status/Date Text
      let dateText = '';
      if(category === 'pending') {
          dateText = `<span class="text-amber-600 font-bold">Waiting Approval</span>`;
      } else if (category === 'active') {
          const daysLeft = Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));
          dateText = `<span class="text-green-600 font-bold">Expires in ${daysLeft} days</span>`;
      } else {
          // History/Rejected
          if(s.status === 'rejected') dateText = `<span class="text-red-600 font-bold">Rejected</span>`;
          else if(s.status === 'cancelled') dateText = `<span class="text-slate-500 font-bold">Cancelled</span>`;
          else if(isExpired) dateText = `<span class="text-slate-400">Expired</span>`;
          else dateText = s.status;
      }

      // Actions
      let actions = '';
      if(category === 'pending') {
          actions = `
            <button onclick="window.approveCreatorSub('${uid}', '${s.planCode}')" class="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs font-bold transition">Approve</button>
            <button onclick="window.rejectCreatorSub('${uid}')" class="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold transition">Reject</button>
          `;
      } else if (category === 'active') {
          actions = `
             <button onclick="window.manageUserSub('${uid}', '${s.maxRequests || 0}', '${expiresAt ? expiresAt.getTime() : 0}')" 
                class="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ml-auto">
                <span class="material-icons text-xs">settings</span> Manage
            </button>
          `;
      } else {
          // HISTORY TAB: Show DELETE button
          actions = `
            <button onclick="window.deleteCreatorSub('${uid}')" class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ml-auto border border-red-100">
               <span class="material-icons text-xs">delete</span> Delete
            </button>
          `;
      }

      html += `
        <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
          <td class="p-4 align-top">
            <div class="font-bold text-slate-900 dark:text-white">${s.email}</div>
            <div class="text-[10px] text-slate-400 font-mono">UID: ${uid}</div>
          </td>
          <td class="p-4 align-top">
            <span class="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">${planName}</span>
            ${s.priceINR ? `<div class="text-xs text-slate-500 mt-1">Paid: ₹${s.priceINR}</div>` : ''}
          </td>
          <td class="p-4 align-top">
            <div class="flex justify-between text-xs mb-1 font-semibold text-slate-700 dark:text-slate-300">
                <span>Used</span>
                <span>${usageText}</span>
            </div>
            <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full ${usageColor}" style="width: ${max ? usagePercent : 5}%;"></div>
            </div>
          </td>
          <td class="p-4 align-top text-xs">${dateText}</td>
          <td class="p-4 align-top text-right">
             <div class="flex justify-end gap-2">${actions}</div>
          </td>
        </tr>`;
    });

    if(count === 0) {
        list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No ${filter} items found.</td></tr>`;
    } else {
        list.innerHTML = html;
    }
  });
};

/* ---------- ACTIONS ---------- */

window.approveCreatorSub = async function (userId, planCode) {
  const plan = CREATOR_PLANS_ADMIN[planCode] || { name: 'Custom', maxRequests: 20, periodDays: 30 };
  if (!confirm(`Confirm Approval?\n\nPlan: ${plan.name}\nDuration: ${plan.periodDays} Days`)) return;

  const expiresAt = new Date(Date.now() + plan.periodDays * 24 * 60 * 60 * 1000);
  try {
    await db.collection('creatorSubs').doc(userId).set({
      status: 'active',
      maxRequests: plan.maxRequests || null,
      usedRequests: 0,
      expiresAt,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    // Auto-approve the order entry too
    await window.markLatestSubOrderApproved(userId);
    alert('✅ Activated!');
  } catch (err) { alert("Error: " + err.message); }
};

window.rejectCreatorSub = function (userId) {
  if (!confirm('Reject this request?')) return;
  db.collection('creatorSubs').doc(userId).set({
    status: 'rejected',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
};

// NEW: Delete button for history
window.deleteCreatorSub = function (userId) {
    if(!confirm("⚠️ PERMANENTLY DELETE this subscription record?\n\nThis will remove it from history completely.")) return;
    
    db.collection('creatorSubs').doc(userId).delete()
    .then(() => alert("Deleted."))
    .catch(e => alert(e.message));
};

window.manageUserSub = async function(userId, currentMax, currentExpiryTime) {
    const action = prompt("MANAGE USER\n\n1. Add Bonus Requests (+10)\n2. Extend Validity (+7 Days)\n3. Cancel Plan\n\nEnter number:");
    if(action === '1') {
        const amount = parseInt(prompt("How many extra requests?", "10"));
        if(!amount) return;
        const newMax = parseInt(currentMax) + amount;
        await db.collection('creatorSubs').doc(userId).update({ maxRequests: newMax });
        alert(`Quota increased.`);
    } 
    else if (action === '2') {
        const days = parseInt(prompt("Days to extend?", "7"));
        if(!days) return;
        const oldDate = new Date(parseInt(currentExpiryTime));
        const newDate = new Date(oldDate.getTime() + (days * 24 * 60 * 60 * 1000));
        await db.collection('creatorSubs').doc(userId).update({ expiresAt: newDate });
        alert(`Extended.`);
    }
    else if (action === '3') {
        if(confirm("Cancel plan?")) {
            await db.collection('creatorSubs').doc(userId).update({ status: 'cancelled' });
        }
    }
};

window.markLatestSubOrderApproved = async function (userId) {
  try {
    const snap = await db.collection('orders').where('userId', '==', userId).orderBy('timestamp', 'desc').limit(10).get();
    let updated = false;
    snap.forEach(doc => {
      if (updated) return;
      const o = doc.data();
      if (o.gameId && String(o.gameId).startsWith('sub_') && o.status === 'pending') {
        doc.ref.update({ status: 'approved' });
        updated = true;
      }
    });
  } catch (e) { console.error(e); }
};

/* ---------- MOD REQUESTS SECTION ---------- */
// Same as before, but ensure ID matches html

window.loadModRequests = function () {
  const list = document.getElementById('modreq-users-list');
  if (!list || !window.db) return;

  db.collection('modRequests').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No requests yet.</td></tr>`;
        return;
      }
      
      const byUser = {};
      snapshot.forEach(doc => {
          const r = doc.data();
          const uid = r.userId;
          if(!byUser[uid]) byUser[uid] = { email: r.email, total: 0, approved: 0, pending: 0, last: 0 };
          
          byUser[uid].total++;
          if(r.status === 'approved') byUser[uid].approved++;
          else if(r.status === 'pending') byUser[uid].pending++;
          
          const t = r.timestamp ? r.timestamp.toDate().getTime() : 0;
          if(t > byUser[uid].last) byUser[uid].last = t;
      });

      let html = '';
      Object.entries(byUser).forEach(([uid, u]) => {
          const lastActive = new Date(u.last).toLocaleDateString();
          html += `
            <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                <td class="p-3 font-bold">${u.email}</td>
                <td class="p-3 text-center">${u.total}</td>
                <td class="p-3 text-xs">
                    <span class="text-green-600 font-bold">${u.approved} Done</span> · 
                    <span class="text-amber-600 font-bold">${u.pending} Pending</span>
                </td>
                <td class="p-3 text-xs text-slate-500">${lastActive}</td>
                <td class="p-3 text-right">
                    <button onclick="window.viewUserModRequests('${uid}')" 
                        class="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow hover:bg-blue-700">
                        View
                    </button>
                </td>
            </tr>
          `;
      });
      list.innerHTML = html;
  });
};

window.viewUserModRequests = function (userId) {
  window.adminSelectedUserId = userId;
  if (window.router) window.router.navigateTo('/creator-admin-user');
};

window.CreatorAdminPage = CreatorAdminPage;
// Note: CreatorAdminUserRequestsPage is in a separate block or same file? 
// If it was in the same file previously, add it below. Assuming you kept it.
// If not, ask me to paste that too.
