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
    window.loadCreatorSubs('pending'); // Load pending by default
    window.loadModRequests(); 
  }, 200);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Mod Creator Admin</h1>
           <p class="text-sm text-slate-500">Manage subscriptions and custom requests</p>
        </div>
        <div class="flex gap-2">
            <button onclick="window.router.navigateTo('/admin')" class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 px-4 py-2 rounded-lg text-sm font-bold">
                Back to Dashboard
            </button>
        </div>
      </div>

      <!-- SECTION 1: SUBSCRIPTIONS -->
      <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        
        <!-- Tabs -->
        <div class="flex border-b border-slate-200 dark:border-slate-700">
          <button onclick="window.switchSubTab('pending')" id="tab-pending" 
                  class="flex-1 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-slate-700/50">
             🔔 Pending Approvals
          </button>
          <button onclick="window.switchSubTab('active')" id="tab-active" 
                  class="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
             ✅ Active Users
          </button>
          <button onclick="window.switchSubTab('all')" id="tab-all" 
                  class="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
             📂 History / All
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
              <tr>
                <th class="p-4">User</th>
                <th class="p-4">Plan Details</th>
                <th class="p-4 w-1/4">Usage Quota</th>
                <th class="p-4">Expiry</th>
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

/* ---------- SUBSCRIPTION LOGIC ---------- */

window.currentSubFilter = 'pending';

window.switchSubTab = function(tab) {
    window.currentSubFilter = tab;
    
    // Update visual tabs
    ['pending', 'active', 'all'].forEach(t => {
        const el = document.getElementById('tab-'+t);
        if(t === tab) {
            el.className = "flex-1 py-4 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-slate-700/50 transition";
        } else {
            el.className = "flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition";
        }
    });

    window.loadCreatorSubs(tab);
}

window.loadCreatorSubs = function (filter) {
  const list = document.getElementById('creator-subs-list');
  if (!list || !window.db) return;

  let query = db.collection('creatorSubs').orderBy('requestedAt', 'desc');

  // Basic client-side filtering (Firestore limitation on complex OR queries)
  // We fetch recently updated ones
  
  query.onSnapshot(snapshot => {
    if (snapshot.empty) {
      list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No subscriptions found.</td></tr>`;
      return;
    }

    let html = '';
    const now = Date.now();
    let count = 0;

    snapshot.forEach(doc => {
      const s = doc.data();
      const uid = s.userId || doc.id;
      
      // --- FILTER LOGIC ---
      const expiresAt = s.expiresAt && s.expiresAt.toDate ? s.expiresAt.toDate() : null;
      const isExpired = expiresAt ? expiresAt.getTime() < now : false;
      const isPending = s.status === 'pending';
      const isActive = s.status === 'active' && !isExpired;

      if (filter === 'pending' && !isPending) return;
      if (filter === 'active' && !isActive) return;
      // 'all' shows everything
      
      count++;
      
      // Plan Info
      const planCfg = CREATOR_PLANS_ADMIN[s.planCode] || null;
      const planName = planCfg ? planCfg.name : (s.planName || s.planCode || 'Custom');
      
      // Usage Bar Logic
      const used = s.usedRequests || 0;
      const max = s.maxRequests; // null means infinity
      let usagePercent = 0;
      let usageColor = 'bg-blue-600';
      let usageText = `${used} / ∞`;
      
      if (max) {
        usagePercent = Math.min(100, (used / max) * 100);
        usageText = `${used} / ${max}`;
        if(usagePercent > 80) usageColor = 'bg-red-500';
        else if(usagePercent > 50) usageColor = 'bg-yellow-500';
      }

      // Expiry Text
      let dateText = '-';
      let dateClass = 'text-slate-500';
      if(isPending) {
        dateText = "Waiting for approval";
        dateClass = "text-amber-600 font-bold";
      } else if (expiresAt) {
         const daysLeft = Math.ceil((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));
         if(daysLeft < 0) {
             dateText = `Expired ${Math.abs(daysLeft)} days ago`;
             dateClass = "text-red-500 font-bold";
         } else {
             dateText = `Expires in ${daysLeft} days`;
             dateClass = "text-green-600 font-bold";
         }
      }

      // Action Buttons
      let actions = '';
      if(isPending) {
          actions = `
            <button onclick="window.approveCreatorSub('${uid}', '${s.planCode}')" 
                class="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs font-bold transition">
                Approve
            </button>
            <button onclick="window.rejectCreatorSub('${uid}')" 
                class="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-bold transition">
                Reject
            </button>
          `;
      } else if (isActive) {
          actions = `
             <button onclick="window.manageUserSub('${uid}', '${s.maxRequests || 0}', '${expiresAt ? expiresAt.getTime() : 0}')" 
                class="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ml-auto">
                <span class="material-icons text-xs">settings</span> Manage
            </button>
          `;
      } else {
          actions = `<span class="text-xs text-slate-400">Archived</span>`;
      }

      html += `
        <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
          <td class="p-4 align-top">
            <div class="font-bold text-slate-900 dark:text-white">${s.email}</div>
            <div class="text-[10px] text-slate-400 font-mono">${uid}</div>
          </td>
          <td class="p-4 align-top">
            <span class="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                ${planName}
            </span>
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
          <td class="p-4 align-top text-xs ${dateClass}">
            ${dateText}
          </td>
          <td class="p-4 align-top text-right">
             <div class="flex justify-end gap-2">${actions}</div>
          </td>
        </tr>`;
    });

    if(count === 0) {
        list.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-slate-400">No ${filter} subscriptions found.</td></tr>`;
    } else {
        list.innerHTML = html;
    }
  });
};

/* ---------- APPROVAL & EDIT LOGIC ---------- */

window.approveCreatorSub = async function (userId, planCode) {
  const plan = CREATOR_PLANS_ADMIN[planCode] || { name: 'Custom', maxRequests: 20, periodDays: 30 };
  
  if (!confirm(`Confirm Approval?\n\nPlan: ${plan.name}\nDuration: ${plan.periodDays} Days`)) return;

  const expiresAt = new Date(Date.now() + plan.periodDays * 24 * 60 * 60 * 1000);

  try {
    // 1. Activate Sub
    await db.collection('creatorSubs').doc(userId).set({
      status: 'active',
      maxRequests: plan.maxRequests || null,
      usedRequests: 0,
      expiresAt,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // 2. Mark the Order as Approved too (Auto-sync)
    await window.markLatestSubOrderApproved(userId);

    alert('✅ Subscription Activated!');
  } catch (err) {
    alert("Error: " + err.message);
  }
};

// NEW: Manage Active User (Bonus / Extend)
window.manageUserSub = async function(userId, currentMax, currentExpiryTime) {
    const action = prompt(
        "MANAGE USER\n\n" +
        "1. Add Bonus Requests (+10)\n" +
        "2. Extend Validity (+7 Days)\n" +
        "3. Cancel Subscription\n\n" +
        "Enter number (1, 2, or 3):"
    );

    if(action === '1') {
        const amount = parseInt(prompt("How many extra requests?", "10"));
        if(!amount) return;
        // Logic: We increase maxRequests
        const newMax = parseInt(currentMax) + amount;
        await db.collection('creatorSubs').doc(userId).update({ maxRequests: newMax });
        alert(`Quota increased to ${newMax}`);
    } 
    else if (action === '2') {
        const days = parseInt(prompt("How many days to extend?", "7"));
        if(!days) return;
        const oldDate = new Date(parseInt(currentExpiryTime));
        const newDate = new Date(oldDate.getTime() + (days * 24 * 60 * 60 * 1000));
        await db.collection('creatorSubs').doc(userId).update({ expiresAt: newDate });
        alert(`Extended until ${newDate.toLocaleDateString()}`);
    }
    else if (action === '3') {
        if(confirm("Are you sure you want to CANCEL this user's plan immediately?")) {
            await db.collection('creatorSubs').doc(userId).update({ status: 'cancelled' });
        }
    }
};

window.rejectCreatorSub = function (userId) {
  if (!confirm('Reject this request?')) return;
  db.collection('creatorSubs').doc(userId).set({
    status: 'rejected',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
};

// ... Keep markLatestSubOrderApproved logic from previous code ...
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
  } catch (e) { console.error(e); }
};

/* ---------- MOD REQUESTS SECTION (Unchanged but cleaned up) ---------- */
// ... (Your existing mod request logic is fine, just ensure it uses the table ID 'modreq-users-list') ...

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

// ... Ensure viewUserModRequests and CreatorAdminUserRequestsPage are kept ...
// (The previous code you sent for 'CreatorAdminUserRequestsPage' is perfect, keep it)

window.CreatorAdminPage = CreatorAdminPage;
// ... export other functions ...
