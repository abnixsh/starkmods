// pages/admin.js

// --- CONFIG ---
const INR_PER_USD = 90;
const COMMISSION_RATE = 0.10; // 10%
const STANDARD_LINKS = {
  'rc24': 'https:/t.me/imsergiomoreio',
  'rc20': 'https:/t.me/imsergiomoreio',
  'wcc3': 'https:/t.me/imsergiomoreio',
};

// Fallback Plan Config (if missing from order data)
const ADMIN_PLAN_DEFAULTS = {
  'P100': { days: 30, reqs: 20 },
  'P300': { days: 30, reqs: 70 },
  'P1000': { days: 60, reqs: 9999 }
};

// State variables
window.ordersSummaryByUser = {};
window.adminSelectedOrderUserId = null;
window.adminSelectedOrderUserEmail = null;
window.ordersUnsub = null;
window.currentUserOrdersUnsub = null;

/* =========================================
   1. DASHBOARD
   ========================================= */

function AdminPage() {
  if (!window.isAdmin) {
    if(window.router) window.router.navigateTo('/');
    return '';
  }
  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      <h1 class="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <section>
        <h2 class="text-lg font-bold mb-3">Quick Navigation</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onclick="window.router.navigateTo('/admin-orders')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition shadow-sm">
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Orders (Normal)</span>
            <span class="text-[10px] text-slate-500">Game Mods & Keys</span>
          </button>
          <button onclick="window.router.navigateTo('/admin-sub-orders')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition shadow-sm">
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Subscription Orders</span>
            <span class="text-[10px] text-slate-500">Creator Plans (Auto-Activate)</span>
          </button>
          <button onclick="window.router.navigateTo('/admin-elite-wallets')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition shadow-sm">
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Elite Wallets</span>
            <span class="text-[10px] text-slate-500">Manage Team Earnings</span>
          </button>
          <button onclick="window.router.navigateTo('/creator-admin')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition shadow-sm">
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Creator Requests</span>
            <span class="text-[10px] text-slate-500">Approve Players/Teams</span>
          </button>
        </div>
      </section>
    </div>
  `;
}

/* =========================================
   2. ORDER LISTS
   ========================================= */

function AdminOrdersPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => window.loadOrdersSummary(false), 100); 
  return renderOrderListTemplate("Orders (Normal)");
}

function AdminSubOrdersPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => window.loadOrdersSummary(true), 100);
  return renderOrderListTemplate("Subscription Orders");
}

function renderOrderListTemplate(title) {
  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">${title}</h1>
        <button onclick="window.router.navigateTo('/admin')" class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1 rounded font-bold hover:bg-slate-300 transition">Back</button>
      </div>
      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
            <tr>
              <th class="p-3">User Email</th><th class="p-3">Total</th><th class="p-3">Approved</th>
              <th class="p-3">Pending</th><th class="p-3">Rejected</th><th class="p-3">Last Active</th><th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody id="orders-users-list"><tr><td colspan="7" class="p-6 text-center text-slate-400">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
}

window.loadOrdersSummary = function (subOnly) {
  const list = document.getElementById('orders-users-list');
  if (!list || !window.db) return;
  if (window.ordersUnsub) { window.ordersUnsub(); window.ordersUnsub = null; }

  window.ordersUnsub = db.collection('orders').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      if (snapshot.empty) { list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders found.</td></tr>`; return; }
      
      const byUser = {};
      
      snapshot.forEach(doc => {
        const o = doc.data();
        const uid = o.userId || 'unknown';
        
        // FIX: Check nested item.gameId for separation
        const gameId = o.item?.gameId || '';
        const isSub = gameId.startsWith('sub_');
        
        // Filter based on page type
        if (subOnly && !isSub) return;
        if (!subOnly && isSub) return;
        
        if (!byUser[uid]) byUser[uid] = { userId: uid, email: o.email, total: 0, approved: 0, pending: 0, rejected: 0, last: 0 };
        const u = byUser[uid];
        u.total++;
        
        if (o.status === 'approved') u.approved++; 
        else if (o.status === 'rejected') u.rejected++; 
        else u.pending++;
        
        const ts = o.timestamp ? o.timestamp.toDate().getTime() : 0;
        if (ts > u.last) u.last = ts;
      });

      const usersArr = Object.values(byUser).sort((a, b) => b.last - a.last);
      let html = '';
      
      usersArr.forEach(u => {
        html += `<tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
          <td class="p-3 font-bold text-slate-800 dark:text-slate-200">${u.email}</td>
          <td class="p-3 font-mono">${u.total}</td>
          <td class="p-3 text-green-600 font-bold">${u.approved}</td>
          <td class="p-3 text-amber-500 font-bold">${u.pending}</td>
          <td class="p-3 text-red-500 font-bold">${u.rejected}</td>
          <td class="p-3 text-xs text-slate-500">${new Date(u.last).toLocaleDateString()}</td>
          <td class="p-3"><button onclick="window.viewUserOrders('${u.userId}')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold transition">View</button></td>
        </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders matching criteria.</td></tr>`;
  });
};

window.viewUserOrders = function (userId) {
  window.adminSelectedOrderUserId = userId;
  if (window.router) window.router.navigateTo('/admin-user-orders');
};

/* =========================================
   3. ORDER DETAILS & ACTIONS
   ========================================= */

function AdminUserOrdersPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  if (!window.adminSelectedOrderUserId) { window.router.navigateTo('/admin-orders'); return ''; }
  setTimeout(window.loadAdminUserOrders, 100);
  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">User Orders</h1>
        <button onclick="window.history.back()" class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1 rounded font-bold hover:bg-slate-300 transition">Back</button>
      </div>
      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
            <tr><th class="p-3">Item</th><th class="p-3">UTR / Trans ID</th><th class="p-3">Amount</th><th class="p-3">Status</th><th class="p-3">Key</th><th class="p-3">Actions</th></tr>
          </thead>
          <tbody id="admin-user-orders-list"><tr><td colspan="6" class="p-6 text-center text-slate-400">Loading...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;
}

window.loadAdminUserOrders = function () {
  const list = document.getElementById('admin-user-orders-list');
  const userId = window.adminSelectedOrderUserId;
  if (!list || !window.db || !userId) return;
  if (window.currentUserOrdersUnsub) { window.currentUserOrdersUnsub(); window.currentUserOrdersUnsub = null; }

  window.currentUserOrdersUnsub = db.collection('orders').where('userId', '==', userId).orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();
        const id = doc.id;
        const gameId = o.item?.gameId || '';
        const isSub = gameId.startsWith('sub_');
        
        let statusBadge = o.status;
        if(o.status === 'approved') statusBadge = '<span class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">Approved</span>';
        if(o.status === 'rejected') statusBadge = '<span class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase">Rejected</span>';
        if(o.status === 'pending') statusBadge = '<span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold uppercase">Pending</span>';

        let actions = '';
        if(o.status === 'pending') {
            actions = `
              <button onclick="window.updateStatus('${id}', 'approved')" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded mr-1 transition" title="Approve"><span class="material-icons text-sm">check</span></button>
              <button onclick="window.updateStatus('${id}', 'rejected')" class="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition" title="Reject"><span class="material-icons text-sm">close</span></button>
            `;
        } else {
            // Only show "Edit Key" for normal mods, not subscriptions
            if (!isSub && o.status === 'approved') {
               actions = `<button onclick="window.setKey('${id}')" class="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-1 rounded mr-1 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold">Edit Key</button>`;
            }
            if(o.status === 'rejected') {
                actions += `<button onclick="window.deleteOrder('${id}')" class="bg-red-100 hover:bg-red-200 text-red-600 text-xs px-2 py-1 rounded border border-red-200 font-bold transition">Delete</button>`;
            }
        }

        html += `<tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
          <td class="p-3 font-bold text-slate-800 dark:text-slate-200">
             ${o.item?.gameName}
             ${isSub ? '<div class="text-[10px] text-purple-500 font-bold uppercase mt-1">Creator Plan</div>' : ''}
          </td>
          <td class="p-3 font-mono text-xs text-slate-600 dark:text-slate-400 select-all">${o.transId}</td>
          <td class="p-3 font-bold text-blue-600">₹${o.amount}</td>
          <td class="p-3">${statusBadge}</td>
          <td class="p-3 text-xs text-slate-500">${isSub ? 'Auto-Active' : (o.key ? '<span class="bg-slate-100 px-1 rounded select-all text-slate-800 font-mono">'+o.key+'</span>' : 'No Key')}</td>
          <td class="p-3">${actions}</td>
        </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="6" class="p-6 text-center text-slate-400">No orders found.</td></tr>`;
  });
};

window.updateStatus = async function (docId, status) {
  if (!confirm(`Mark order as ${status}?`)) return;
  try {
    const orderRef = db.collection('orders').doc(docId);
    let updateData = { status };
    
    // Fetch order details
    const snap = await orderRef.get();
    const order = snap.data();
    const gameId = order.item?.gameId || '';
    const isSub = gameId.startsWith('sub_');

    // 1. Handle Approval Logic
    if (status === 'approved') {
      
      if (isSub) {
        // --- AUTO ACTIVATE SUBSCRIPTION ---
        // Get plan details from order item or fallback
        const planCode = order.item?.subPlanCode || gameId.replace('sub_', '') || 'P100';
        const defaultCfg = ADMIN_PLAN_DEFAULTS[planCode] || ADMIN_PLAN_DEFAULTS['P100'];
        
        const days = order.item?.subPeriodDays || defaultCfg.days;
        const maxReq = order.item?.subMaxRequests || defaultCfg.reqs;
        
        // Calculate expiry
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(days));
        
        // Activate in creatorSubs collection
        await db.collection('creatorSubs').doc(order.userId).set({
            userId: order.userId,
            email: order.email,
            status: 'active',
            planCode: planCode,
            planName: order.item?.planName || 'Plan',
            maxRequests: maxReq,
            usedRequests: 0,
            expiresAt: expiresAt,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        alert(`✅ Subscription Activated for ${days} days!`);
        
      } else {
        // --- NORMAL MOD APPROVAL ---
        const suggested = STANDARD_LINKS[gameId] || '';
        const link = prompt("Enter Download Link (optional):", suggested);
        if (link) updateData.downloadUrl = link;
        
        // Handle commission for normal orders
        if (window.isElite && window.currentUser) {
           await window.creditEliteWallet(window.currentUser, order, docId);
        }
      }
    }
    
    await orderRef.update(updateData);
    // Don't alert "Updated" again if we already alerted sub activation
    if(!isSub || status !== 'approved') alert('Updated.');
    
  } catch (e) { alert(e.message); }
};

window.deleteOrder = function(docId) {
    if(!confirm("Permanently delete this rejected order?")) return;
    db.collection('orders').doc(docId).delete().then(() => alert("Deleted.")).catch(e => alert(e.message));
};

window.setKey = function (docId) {
  const key = prompt('Enter/Update Key:');
  if (key) db.collection('orders').doc(docId).update({ key });
};

/* =========================================
   4. ELITE WALLETS
   ========================================= */

function AdminEliteWalletsPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => { window.loadEliteWallets(); window.loadWithdrawRequests(); }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Elite Wallets</h1>
        <button onclick="window.router.navigateTo('/admin')" class="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1 rounded font-bold hover:bg-slate-300 transition">Back</button>
      </div>

      <section>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <tr><th class="p-4">User</th><th class="p-4">Balance</th><th class="p-4">Earned</th><th class="p-4">Action</th></tr>
            </thead>
            <tbody id="elite-list"><tr><td colspan="4" class="p-8 text-center text-slate-400">Loading...</td></tr></tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="text-lg font-bold mb-3 text-slate-900 dark:text-white">Withdrawal Requests</h2>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <tr><th class="p-4">User</th><th class="p-4">Amount</th><th class="p-4">Method</th><th class="p-4">Status</th><th class="p-4">Action</th></tr>
            </thead>
            <tbody id="withdraw-list"><tr><td colspan="5" class="p-8 text-center text-slate-400">Loading...</td></tr></tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

window.loadEliteWallets = function () {
  const list = document.getElementById('elite-list');
  if (!list || !window.db) return;
  db.collection('wallets').orderBy('email').onSnapshot(snapshot => {
      let html = '';
      snapshot.forEach(doc => {
        const w = doc.data();
        html += `<tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <td class="p-4 font-bold text-slate-800 dark:text-slate-200">${w.email}</td>
            <td class="p-4 text-blue-600 font-bold">$${(w.balanceUSD||0).toFixed(2)}</td>
            <td class="p-4 text-slate-500">$${(w.totalEarnedUSD||0).toFixed(2)}</td>
            <td class="p-4"><button onclick="window.manualCredit('${w.userId}','${w.email}')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold transition">Credit</button></td>
        </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="4" class="p-8 text-center text-slate-400">No wallets found.</td></tr>`;
  });
};

window.manualCredit = function (userId, email) {
  const amount = parseFloat(prompt(`Enter USD to credit to ${email}:`));
  if (!amount) return;
  const walletRef = db.collection('wallets').doc(userId);
  db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const data = snap.exists ? snap.data() : {};
    tx.set(walletRef, {
      userId, email,
      balanceUSD: (data.balanceUSD || 0) + amount,
      totalEarnedUSD: (data.totalEarnedUSD || 0) + amount,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }).then(() => alert('Credited.')).catch(e => alert(e.message));
};

window.loadWithdrawRequests = function () {
  const list = document.getElementById('withdraw-list');
  if (!list) return;
  db.collection('withdrawRequests').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    let html = '';
    snapshot.forEach(doc => {
      const w = doc.data();
      const id = doc.id;
      html += `<tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
        <td class="p-4 font-bold text-slate-800 dark:text-slate-200">${w.email}</td>
        <td class="p-4 font-bold text-blue-600">$${w.amountUSD}</td>
        <td class="p-4 text-xs text-slate-500">${w.paymentMethod}</td>
        <td class="p-4"><span class="badge text-xs uppercase font-bold bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded">${w.status}</span></td>
        <td class="p-4 flex gap-2">${w.status === 'pending' ? `<button onclick="window.handleWithdrawStatus('${id}','paid')" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition" title="Mark Paid"><span class="material-icons text-sm">check</span></button>` : ''}</td>
      </tr>`;
    });
    list.innerHTML = html || `<tr><td colspan="5" class="p-8 text-center text-slate-400">No pending requests.</td></tr>`;
  });
};

window.handleWithdrawStatus = async function (id, status) {
  if(!confirm(`Mark as ${status}?`)) return;
  await db.collection('withdrawRequests').doc(id).update({ status });
  alert('Updated.');
};

window.creditEliteWallet = async function (adminUser, order, orderDocId) {
  const usd = (order.amount / INR_PER_USD) * COMMISSION_RATE;
  const commissionUSD = Math.round(usd * 100) / 100;
  const walletRef = db.collection('wallets').doc(adminUser.uid);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const data = snap.exists ? snap.data() : {};
    tx.set(walletRef, {
      userId: adminUser.uid, email: adminUser.email,
      balanceUSD: (data.balanceUSD || 0) + commissionUSD,
      totalEarnedUSD: (data.totalEarnedUSD || 0) + commissionUSD,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
};

/* =========================================
   5. EXPORTS
   ========================================= */
window.AdminPage = AdminPage;
window.AdminOrdersPage = AdminOrdersPage;
window.AdminSubOrdersPage = AdminSubOrdersPage;
window.AdminUserOrdersPage = AdminUserOrdersPage;
window.AdminEliteWalletsPage = AdminEliteWalletsPage;
