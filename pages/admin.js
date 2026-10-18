// pages/admin.js

// --- CONFIG ---
const INR_PER_USD = 90;
const COMMISSION_RATE = 0.10; // 10%
const STANDARD_LINKS = {
  'rc24': 'https:/t.me/imsergiomoreio',
  'rc20': 'https://github.com/abnixsh/starkmods/releases/download/cr20v6.1/RC20.VIP.v6.2.Mod.apk',
  'wcc3': 'https://github.com/abnixsh/starkmods/releases/download/wcc3/WCC3.VIP.v3.2.3.apk',
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
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Control Center</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage orders, game mod cards, payment QR codes & wallets</p>
        </div>
        <button onclick="window.router.navigateTo('/')" class="apple-glass-pill py-2 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:text-blue-500">
          <span class="material-icons text-sm">home</span> View Site
        </button>
      </div>

      <section>
        <h2 class="text-base font-bold mb-4 uppercase tracking-wider text-slate-400 text-xs">Quick Management</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button onclick="window.router.navigateTo('/admin-mods')" class="apple-glass-card p-5 text-left transition shadow-sm hover:border-blue-500/40 group">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition">
              <span class="material-icons">sports_esports</span>
            </div>
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Mod Pages & Game Cards</span>
            <span class="text-xs text-slate-500">Add free/paid cards, edit details & screenshot gallery</span>
          </button>

          <button onclick="window.router.navigateTo('/admin-payments')" class="apple-glass-card p-5 text-left transition shadow-sm hover:border-emerald-500/40 group">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-105 transition">
              <span class="material-icons">qr_code_scanner</span>
            </div>
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Payment Methods & QR Admin</span>
            <span class="text-xs text-slate-500">Modify UPI, NayaPay, Binance, PayPal & upload QR</span>
          </button>

          <button onclick="window.router.navigateTo('/admin-orders')" class="apple-glass-card p-5 text-left transition shadow-sm hover:border-amber-500/40 group">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-105 transition">
              <span class="material-icons">shopping_bag</span>
            </div>
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Mod Orders & Keys</span>
            <span class="text-xs text-slate-500">Approve payments & generate license keys</span>
          </button>

          <button onclick="window.router.navigateTo('/admin-sub-orders')" class="apple-glass-card p-5 text-left transition shadow-sm hover:border-purple-500/40 group">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-105 transition">
              <span class="material-icons">card_membership</span>
            </div>
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Subscription Orders</span>
            <span class="text-xs text-slate-500">Creator Plans & Auto-Activation</span>
          </button>

          <button onclick="window.router.navigateTo('/admin-elite-wallets')" class="apple-glass-card p-5 text-left transition shadow-sm hover:border-indigo-500/40 group">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-105 transition">
              <span class="material-icons">account_balance_wallet</span>
            </div>
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Elite Wallets & Payouts</span>
            <span class="text-xs text-slate-500">Withdrawal approvals & commissions</span>
          </button>

          <button onclick="window.router.navigateTo('/creator-admin')" class="apple-glass-card p-5 text-left transition shadow-sm hover:border-pink-500/40 group">
            <div class="w-10 h-10 rounded-xl bg-pink-500/10 dark:bg-pink-400/10 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3 group-hover:scale-105 transition">
              <span class="material-icons">auto_fix_high</span>
            </div>
            <span class="font-bold text-sm block mb-1 text-slate-800 dark:text-white">Creator Admin Studio</span>
            <span class="text-xs text-slate-500">Manage custom player, jersey & team requests</span>
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
        <table class="w-full text-left text-sm whitespace-nowrap min-w-[640px]">
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
        <table class="w-full text-left text-sm whitespace-nowrap min-w-[640px]">
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
          <td class="p-3 font-bold text-blue-600">${o.paidCurrency === 'PKR' ? 'Rs ' : (o.paidCurrency === 'USD' || o.paidCurrency === 'USDT' ? '$' : '₹')}${o.amount ?? o.paidAmount ?? o.basePriceINR ?? o.item?.price ?? '0'}</td>
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
   5. PAYMENT ADMIN PANEL (All 4 Methods + QR Upload)
   ========================================= */

function AdminPaymentsPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => window.loadAdminPaymentDetails(), 100);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Payment Methods & QR Admin</h1>
          <p class="text-xs text-slate-500">Configure UPI, NayaPay/EasyPaisa, Binance, and PayPal details & custom QR codes</p>
        </div>
        <button onclick="window.router.navigateTo('/admin')" class="apple-glass-pill py-1.5 px-4 text-xs font-bold hover:text-blue-500 transition">
          Back
        </button>
      </div>

      <div id="payment-admin-loading" class="text-center py-12">
        <div class="apple-spinner mx-auto mb-2"></div>
        <p class="text-xs text-slate-400">Loading current payment configuration...</p>
      </div>

      <div id="payment-admin-form" class="hidden space-y-6">
        
        <!-- 1. UPI / QR (India) -->
        <div class="apple-glass-card p-6">
          <div class="flex items-center gap-3 mb-4">
            <img src="assets/icons/pay_upi.png" class="h-6 object-contain">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">1. UPI (India)</h3>
          </div>
          <div class="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">UPI ID (VPA)</label>
              <input type="text" id="pay-upi-id" class="w-full text-sm font-mono font-bold" placeholder="username@upi">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Account Holder / Store Name</label>
              <input type="text" id="pay-upi-name" class="w-full text-sm font-semibold" placeholder="StarkStore">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Custom UPI QR Code Image (Upload replacement or paste image URL)</label>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <input type="file" id="pay-upi-file" accept="image/*" onchange="window.previewQRUpload(this, 'pay-upi-preview', 'pay-upi-qrurl')" class="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-600">
              <input type="text" id="pay-upi-qrurl" class="flex-1 text-xs font-mono" placeholder="Or enter direct image URL...">
              <div id="pay-upi-preview" class="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 border flex items-center justify-center overflow-hidden flex-shrink-0">
                <span class="material-icons text-slate-400 text-sm">qr_code</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. NayaPay / EasyPaisa (Pakistan) -->
        <div class="apple-glass-card p-6">
          <div class="flex items-center gap-3 mb-4">
            <img src="assets/icons/pay_nayapay.png" class="h-6 object-contain">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">2. NayaPay / EasyPaisa (Pakistan)</h3>
          </div>
          <div class="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Mobile / Account Number</label>
              <input type="text" id="pay-ep-number" class="w-full text-sm font-mono font-bold" placeholder="03041234567">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Account Holder Name</label>
              <input type="text" id="pay-ep-name" class="w-full text-sm font-semibold" placeholder="Muzammil Hasnain">
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Custom QR Code Image (Optional)</label>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <input type="file" id="pay-ep-file" accept="image/*" onchange="window.previewQRUpload(this, 'pay-ep-preview', 'pay-ep-qrurl')" class="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-green-50 dark:file:bg-green-900/40 file:text-green-600">
              <input type="text" id="pay-ep-qrurl" class="flex-1 text-xs font-mono" placeholder="Or paste image URL...">
              <div id="pay-ep-preview" class="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 border flex items-center justify-center overflow-hidden flex-shrink-0">
                <span class="material-icons text-slate-400 text-sm">qr_code</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Binance Pay (USDT) -->
        <div class="apple-glass-card p-6">
          <div class="flex items-center gap-3 mb-4">
            <img src="assets/icons/pay_binance.png" class="h-6 object-contain">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">3. Binance Pay (USDT)</h3>
          </div>
          <div class="mb-4">
            <label class="block text-xs font-bold text-slate-500 mb-1">Binance Pay ID</label>
            <input type="text" id="pay-binance-id" class="w-full text-sm font-mono font-bold" placeholder="998477777">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Binance Pay QR Code Image (Upload or paste URL)</label>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <input type="file" id="pay-binance-file" accept="image/*" onchange="window.previewQRUpload(this, 'pay-binance-preview', 'pay-binance-qrurl')" class="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-yellow-50 dark:file:bg-yellow-900/40 file:text-yellow-600">
              <input type="text" id="pay-binance-qrurl" class="flex-1 text-xs font-mono" placeholder="Or paste direct image URL...">
              <div id="pay-binance-preview" class="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 border flex items-center justify-center overflow-hidden flex-shrink-0">
                <span class="material-icons text-slate-400 text-sm">qr_code</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. PayPal (USD) -->
        <div class="apple-glass-card p-6">
          <div class="flex items-center gap-3 mb-4">
            <img src="assets/icons/pay_paypal.png" class="h-6 object-contain">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">4. PayPal (USD)</h3>
          </div>
          <div class="mb-4">
            <label class="block text-xs font-bold text-slate-500 mb-1">PayPal Email or me-link</label>
            <input type="text" id="pay-paypal-email" class="w-full text-sm font-semibold" placeholder="yourname@gmail.com or paypal.me/link">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">PayPal QR Image (Optional)</label>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <input type="file" id="pay-paypal-file" accept="image/*" onchange="window.previewQRUpload(this, 'pay-paypal-preview', 'pay-paypal-qrurl')" class="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-600">
              <input type="text" id="pay-paypal-qrurl" class="flex-1 text-xs font-mono" placeholder="Or paste direct image URL...">
              <div id="pay-paypal-preview" class="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 border flex items-center justify-center overflow-hidden flex-shrink-0">
                <span class="material-icons text-slate-400 text-sm">qr_code</span>
              </div>
            </div>
          </div>
        <!-- 5. Telegram Bot Order Alerts -->
        <div class="apple-glass-card p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-full bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center">
              <span class="material-icons text-base">send</span>
            </div>
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">5. Telegram Bot Order Alerts</h3>
              <p class="text-xs text-slate-400">Receive instant order notifications with UTR & customer details in Telegram</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Telegram Bot Token</label>
              <input type="text" id="pay-tg-token" class="w-full text-xs font-mono font-bold" placeholder="8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Telegram Chat ID (Admin or Group)</label>
              <input type="text" id="pay-tg-chatid" class="w-full text-xs font-mono font-bold" placeholder="6879169726">
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="window.testTelegramBotNotification()" class="apple-glass-pill py-2 px-4 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 hover:bg-blue-50 transition active:scale-95">
              <span class="material-icons text-sm">notifications_active</span>
              <span>Send Test Telegram Alert</span>
            </button>
            <span id="tg-test-status" class="text-xs font-semibold text-slate-400"></span>
          </div>
        </div>

        <!-- Save button -->
        <div class="pt-4 flex justify-end gap-3">
          <button onclick="window.saveAdminPaymentDetails()" class="apple-btn-primary px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2">
            <span class="material-icons text-sm">save</span>
            <span>Save All Payment Methods & Bot Config</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

window.loadAdminPaymentDetails = async function() {
  const loading = document.getElementById('payment-admin-loading');
  const form = document.getElementById('payment-admin-form');
  if (!loading || !form || !window.db) return;

  try {
    const doc = await db.collection('siteConfig').doc('paymentDetails').get();
    const data = doc.exists ? (doc.data() || {}) : {};

    const upi = data.upi || {};
    document.getElementById('pay-upi-id').value = upi.id || 'fucckkoffabhishekhop@fam';
    document.getElementById('pay-upi-name').value = upi.name || 'StarkStore';
    document.getElementById('pay-upi-qrurl').value = upi.qrUrl || '';
    if (upi.qrUrl) document.getElementById('pay-upi-preview').innerHTML = `<img src="${upi.qrUrl}" class="w-full h-full object-cover">`;

    const ep = data.ep || {};
    document.getElementById('pay-ep-number').value = ep.number || '03045381058';
    document.getElementById('pay-ep-name').value = ep.name || 'Muzammil Hasnain';
    document.getElementById('pay-ep-qrurl').value = ep.qrUrl || '';
    if (ep.qrUrl) document.getElementById('pay-ep-preview').innerHTML = `<img src="${ep.qrUrl}" class="w-full h-full object-cover">`;

    const binance = data.binance || {};
    document.getElementById('pay-binance-id').value = binance.payId || '998477777';
    document.getElementById('pay-binance-qrurl').value = binance.qrUrl || '';
    if (binance.qrUrl) document.getElementById('pay-binance-preview').innerHTML = `<img src="${binance.qrUrl}" class="w-full h-full object-cover">`;

    const paypal = data.paypal || {};
    document.getElementById('pay-paypal-email').value = paypal.email || 'starkmods@paypal.me';
    document.getElementById('pay-paypal-qrurl').value = paypal.qrUrl || '';
    if (paypal.qrUrl) document.getElementById('pay-paypal-preview').innerHTML = `<img src="${paypal.qrUrl}" class="w-full h-full object-cover">`;

    // Telegram Bot config
    document.getElementById('pay-tg-token').value = data.tgBotToken || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE';
    document.getElementById('pay-tg-chatid').value = data.tgChatId || '6879169726';

    loading.classList.add('hidden');
    form.classList.remove('hidden');
  } catch (e) {
    loading.innerHTML = `<div class="text-red-500 font-bold">Error loading payment data: ${e.message}</div>`;
  }
};

window.testTelegramBotNotification = async function() {
  const token = document.getElementById('pay-tg-token').value.trim() || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE';
  const chatId = document.getElementById('pay-tg-chatid').value.trim() || '6879169726';
  const statusEl = document.getElementById('tg-test-status');

  if (statusEl) statusEl.innerText = "Sending test message...";

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 <b>Test Notification from Stark Mods Admin</b>\nTelegram Bot is successfully connected! Order alerts are active.`,
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    if (data.ok) {
      if (statusEl) statusEl.innerHTML = `<span class="text-emerald-500 font-bold">✅ Sent successfully! Check your Telegram.</span>`;
    } else {
      if (statusEl) statusEl.innerHTML = `<span class="text-red-500 font-bold">❌ Error: ${data.description}</span>`;
    }
  } catch (e) {
    if (statusEl) statusEl.innerHTML = `<span class="text-red-500 font-bold">❌ Failed: ${e.message}</span>`;
  }
};

window.previewQRUpload = function(inputEl, previewId, urlInputId) {
  if (inputEl.files && inputEl.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUri = e.target.result;
      const preview = document.getElementById(previewId);
      const urlInput = document.getElementById(urlInputId);
      if (preview) preview.innerHTML = `<img src="${dataUri}" class="w-full h-full object-cover">`;
      if (urlInput) urlInput.value = dataUri;
    };
    reader.readAsDataURL(inputEl.files[0]);
  }
};

window.saveAdminPaymentDetails = async function() {
  if (!confirm("Save these payment details & QR codes? They will immediately apply to checkout.")) return;

  const paymentData = {
    upi: {
      id: document.getElementById('pay-upi-id').value.trim() || 'fucckkoffabhishekhop@fam',
      name: document.getElementById('pay-upi-name').value.trim() || 'StarkStore',
      qrUrl: document.getElementById('pay-upi-qrurl').value.trim()
    },
    ep: {
      number: document.getElementById('pay-ep-number').value.trim(),
      name: document.getElementById('pay-ep-name').value.trim(),
      qrUrl: document.getElementById('pay-ep-qrurl').value.trim()
    },
    binance: {
      payId: document.getElementById('pay-binance-id').value.trim(),
      qrUrl: document.getElementById('pay-binance-qrurl').value.trim()
    },
    paypal: {
      email: document.getElementById('pay-paypal-email').value.trim(),
      qrUrl: document.getElementById('pay-paypal-qrurl').value.trim()
    },
    tgBotToken: document.getElementById('pay-tg-token').value.trim() || '8491648554:AAHwIlmoD6jrIZlhMdSd0Pd8mNYJebkrWxE',
    tgChatId: document.getElementById('pay-tg-chatid').value.trim() || '6879169726',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('siteConfig').doc('paymentDetails').set(paymentData, { merge: true });
    window.paymentConfig = paymentData;
    alert("✅ Payment methods, FamPay details and Telegram Bot config successfully updated!");
  } catch (e) {
    alert("Failed to save: " + e.message);
  }
};

/* =========================================
   6. MODS & GAME CARDS ADMIN PANEL
   ========================================= */

function AdminModsPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => window.loadAdminModsList(), 100);

  return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-20 space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Mod Pages & Game Cards Admin</h1>
          <p class="text-xs text-slate-500">Create new mod cards (Free or Paid), edit download links, and manage screenshots</p>
        </div>
        <div class="flex gap-2">
          <button onclick="window.openAddModModal()" class="apple-btn-primary px-4 py-2 rounded-full text-xs font-bold shadow flex items-center gap-1.5">
            <span class="material-icons text-sm">add</span> Add New Mod
          </button>
          <button onclick="window.router.navigateTo('/admin')" class="apple-glass-pill py-2 px-4 text-xs font-bold hover:text-blue-500 transition">
            Back
          </button>
        </div>
      </div>

      <!-- SYSTEM MODS (RC25, RC24, RC20, WCC3) -->
      <section class="space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400">Core Mod Menus (Config & Download Links)</h2>
        <div class="grid md:grid-cols-2 gap-4">
          
          <!-- RC25 Config -->
          <div class="apple-glass-card p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="assets/icons/logo_rc25_v8_beta.png" class="w-12 h-12 rounded-xl object-cover border" onerror="this.src='/assets/icons/stark-32.png'">
                <div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">Real Cricket 25 Patch</h4>
                  <span class="text-[10px] font-bold uppercase text-emerald-500">Free Patch</span>
                </div>
              </div>
              <button onclick="window.openGameScreenshotsModal('rc25', 'Real Cricket 25')" class="apple-glass-pill text-[11px] font-bold py-1 px-3 flex items-center gap-1 hover:text-blue-500 transition">
                <span class="material-icons text-xs">photo_library</span> Screenshots
              </button>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">Download Link</label>
              <div class="flex gap-2">
                <input type="text" id="admin-rc25-link" class="w-full text-xs font-mono" placeholder="Download URL">
                <button onclick="window.saveGameModConfig('rc25', 'admin-rc25-link')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-xl text-xs font-bold transition">Save</button>
              </div>
            </div>
          </div>

          <!-- RC24 Config -->
          <div class="apple-glass-card p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="assets/icons/icon_rc24.png" class="w-12 h-12 rounded-xl object-cover border" onerror="this.src='/assets/icons/stark-32.png'">
                <div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">Real Cricket 24 Realistic V3</h4>
                  <span class="text-[10px] font-bold uppercase text-emerald-500">Free Patch</span>
                </div>
              </div>
              <button onclick="window.openGameScreenshotsModal('rc24', 'Real Cricket 24')" class="apple-glass-pill text-[11px] font-bold py-1 px-3 flex items-center gap-1 hover:text-blue-500 transition">
                <span class="material-icons text-xs">photo_library</span> Screenshots
              </button>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">Download Link</label>
              <div class="flex gap-2">
                <input type="text" id="admin-rc24-link" class="w-full text-xs font-mono" placeholder="Download URL">
                <button onclick="window.saveGameModConfig('rc24', 'admin-rc24-link')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-xl text-xs font-bold transition">Save</button>
              </div>
            </div>
          </div>

          <!-- RC20 Config -->
          <div class="apple-glass-card p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="assets/icons/icon_rc20.jpg" class="w-12 h-12 rounded-xl object-cover border" onerror="this.src='/assets/icons/stark-32.png'">
                <div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">Real Cricket 20 VIP Mod Menu</h4>
                  <span class="text-[10px] font-bold uppercase text-amber-500">Premium Mod</span>
                </div>
              </div>
              <button onclick="window.openGameScreenshotsModal('rc20', 'Real Cricket 20')" class="apple-glass-pill text-[11px] font-bold py-1 px-3 flex items-center gap-1 hover:text-blue-500 transition">
                <span class="material-icons text-xs">photo_library</span> Screenshots
              </button>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">Direct APK Link</label>
              <div class="flex gap-2">
                <input type="text" id="admin-rc20-link" class="w-full text-xs font-mono" placeholder="Download URL">
                <button onclick="window.saveGameModConfig('rc20', 'admin-rc20-link')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-xl text-xs font-bold transition">Save</button>
              </div>
            </div>
          </div>

          <!-- WCC3 Config -->
          <div class="apple-glass-card p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img src="assets/icons/icon_wcc3.png" class="w-12 h-12 rounded-xl object-cover border" onerror="this.src='/assets/icons/stark-32.png'">
                <div>
                  <h4 class="font-bold text-sm text-slate-900 dark:text-white">WCC3 VIP Menu</h4>
                  <span class="text-[10px] font-bold uppercase text-amber-500">Premium Mod</span>
                </div>
              </div>
              <button onclick="window.openGameScreenshotsModal('wcc3', 'WCC 3 VIP')" class="apple-glass-pill text-[11px] font-bold py-1 px-3 flex items-center gap-1 hover:text-blue-500 transition">
                <span class="material-icons text-xs">photo_library</span> Screenshots
              </button>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-400 mb-1">Direct APK Link</label>
              <div class="flex gap-2">
                <input type="text" id="admin-wcc3-link" class="w-full text-xs font-mono" placeholder="Download URL">
                <button onclick="window.saveGameModConfig('wcc3', 'admin-wcc3-link')" class="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-xl text-xs font-bold transition">Save</button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- CUSTOM GAME CARDS SECTION (Add / Edit / Delete cards) -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-400">Custom Home Cards & Games (Dynamic)</h2>
          <span class="text-xs text-slate-400" id="custom-mods-count">Loading...</span>
        </div>

        <div id="custom-mods-list" class="space-y-3">
          <div class="text-center py-8"><div class="apple-spinner mx-auto mb-2"></div></div>
        </div>
      </section>

      <!-- MODAL FOR ADDING / EDITING CUSTOM MOD -->
      <div id="mod-modal" class="hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-4 animate-fade-in">
        <div class="apple-glass-card w-full max-w-lg p-5 sm:p-6 space-y-4 max-h-[88vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-3">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white" id="modal-mod-title">Add / Edit Mod Card</h3>
              <p class="text-[11px] text-slate-400">Configure title, tags, pills, multi-plan pricing & YouTube video</p>
            </div>
            <button onclick="window.closeModModal()" class="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white active:scale-90 transition">
              <span class="material-icons text-base">close</span>
            </button>
          </div>

          <input type="hidden" id="modal-mod-id">

          <!-- 1. Basic Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Game / Mod Name *</label>
              <input type="text" id="modal-mod-name" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800" placeholder="e.g. RC 20 VIP Mod Menu">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Category / Tag</label>
              <input type="text" id="modal-mod-tag" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800" placeholder="e.g. VIP Injector &bull; Pro Cheats">
            </div>
          </div>

          <!-- 2. Status Pills & Colors -->
          <div class="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Status Pills & Badge Colors</span>
            
            <!-- Pill 1 -->
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Pill 1 Text</label>
                <input type="text" id="modal-mod-pill1-text" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="e.g. v8.2 LIVE">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Pill 1 Color</label>
                <select id="modal-mod-pill1-color" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option value="blue">Blue</option>
                  <option value="emerald">Emerald (Green)</option>
                  <option value="amber">Amber (Gold/Orange)</option>
                  <option value="purple">Purple</option>
                  <option value="rose">Rose (Red)</option>
                  <option value="slate">Slate (Gray)</option>
                </select>
              </div>
            </div>

            <!-- Pill 2 -->
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Pill 2 Text</label>
                <input type="text" id="modal-mod-pill2-text" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="e.g. Anti-Ban VIP">
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Pill 2 Color</label>
                <select id="modal-mod-pill2-color" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option value="amber">Amber (Gold/Orange)</option>
                  <option value="emerald">Emerald (Green)</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="rose">Rose (Red)</option>
                  <option value="slate">Slate (Gray)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 3. Pricing (1 Month, 1 Year, Lifetime) -->
          <div class="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pricing & License Plans</span>
              <select id="modal-mod-type" class="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold" onchange="window.togglePriceField(this.value)">
                <option value="free">Free Download</option>
                <option value="paid">Paid VIP (Multi-Plan)</option>
              </select>
            </div>

            <div id="modal-price-box" class="hidden space-y-2 pt-1 border-t border-black/5 dark:border-white/5">
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 mb-0.5">1 Month (₹)</label>
                  <input type="number" id="modal-mod-price-month" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold" placeholder="250">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 mb-0.5">1 Year (₹)</label>
                  <input type="number" id="modal-mod-price-year" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold" placeholder="600">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Lifetime (₹)</label>
                  <input type="number" id="modal-mod-price-lifetime" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold" placeholder="1000">
                </div>
              </div>
              <p class="text-[10px] text-slate-400">Users can choose 1 Month, 1 Year, or Lifetime directly from the card and checkout with FamPay UPI.</p>
            </div>
          </div>

          <!-- 4. YouTube Video Preview Feature -->
          <div class="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2">
            <div class="flex items-center gap-2">
              <input type="checkbox" id="modal-mod-video-enable" class="w-4 h-4 rounded text-blue-600">
              <label for="modal-mod-video-enable" class="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                Enable In-Page YouTube Video Preview
              </label>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">YouTube Video URL or Video ID</label>
              <input type="text" id="modal-mod-video-url" class="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono" placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/...">
              <p class="text-[10px] text-slate-400 mt-1">When enabled, users can click "Watch Preview" to play the video right inside the card/modal without leaving the site.</p>
            </div>
          </div>

          <!-- 5. Media & Links -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Icon URL</label>
              <input type="text" id="modal-mod-icon" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="assets/icons/icon_rc20.jpg">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Banner / Screenshot URL</label>
              <input type="text" id="modal-mod-banner" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="assets/img/img_rc20_1.jpg">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Download or Details Link *</label>
            <input type="text" id="modal-mod-link" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono" placeholder="https://mediafire.com/... or /rc20">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">Description *</label>
            <textarea id="modal-mod-desc" rows="2" class="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="Features and summary..."></textarea>
          </div>

          <div class="flex justify-end gap-2.5 pt-3 border-t border-black/5 dark:border-white/10">
            <button onclick="window.closeModModal()" class="apple-glass-pill py-2 px-5 text-xs font-bold">Cancel</button>
            <button onclick="window.saveCustomModCard()" class="apple-btn-primary px-7 py-2.5 rounded-full text-xs font-bold shadow-md">Save Card</button>
          </div>
        </div>
      </div>

      <!-- MODAL FOR GAME SCREENSHOTS -->
      <div id="screenshots-modal" class="hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
        <div class="apple-glass-card w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white" id="modal-screenshots-title">Game Screenshots</h3>
              <p class="text-xs text-slate-400" id="modal-screenshots-game">Manage preview gallery images for this mod</p>
            </div>
            <button onclick="window.closeScreenshotsModal()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <span class="material-icons">close</span>
            </button>
          </div>

          <input type="hidden" id="modal-screenshots-gameid">

          <!-- Current Screenshots Grid -->
          <div>
            <div class="text-xs font-bold text-slate-500 mb-2">Current Gallery Images:</div>
            <div id="modal-screenshots-list" class="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-[80px] p-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <div class="text-xs text-slate-400 col-span-full text-center py-4">No screenshots added yet.</div>
            </div>
          </div>

          <!-- Add New Screenshot -->
          <div class="space-y-3 pt-3 border-t border-slate-200/50 dark:border-slate-800">
            <div class="text-xs font-bold text-slate-500">Add New Screenshot Image:</div>
            <div class="flex gap-2">
              <input type="text" id="new-screenshot-url" class="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50" placeholder="https://... or assets/img/...">
              <button onclick="window.addScreenshotFromUrl()" class="apple-btn-primary px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap">Add URL</button>
            </div>
            <div class="flex items-center gap-2 pt-1">
              <span class="text-xs text-slate-400">Or upload:</span>
              <input type="file" id="screenshot-file-input" accept="image/*" class="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" onchange="window.uploadScreenshotFile(this)">
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-800">
            <button onclick="window.closeScreenshotsModal()" class="apple-glass-pill py-2 px-4 text-xs font-bold">Cancel</button>
            <button onclick="window.saveGameScreenshots()" class="apple-btn-primary px-6 py-2 rounded-full text-xs font-bold shadow">Save Screenshots</button>
          </div>
        </div>
      </div>

    </div>
  `;
}

window.loadAdminModsList = async function() {
  if (!window.db) return;

  // Load existing standard game links
  ['rc25', 'rc24', 'rc20', 'wcc3'].forEach(async (id) => {
    try {
      const doc = await db.collection('gameConfig').doc(id).get();
      if (doc.exists) {
        const d = doc.data();
        const input = document.getElementById(`admin-${id}-link`);
        if (input && d.link) input.value = d.link;
      }
    } catch (e) {}
  });

  // Load custom cards
  const list = document.getElementById('custom-mods-list');
  const countEl = document.getElementById('custom-mods-count');
  if (!list) return;

  db.collection('customCards').orderBy('createdAt', 'desc').onSnapshot(snap => {
    if (snap.empty) {
      list.innerHTML = `<div class="p-8 text-center text-slate-400 apple-glass-card text-xs">No custom game cards added yet. Click "+ Add New Mod" above to create one.</div>`;
      if (countEl) countEl.innerText = "0 Cards";
      return;
    }

    if (countEl) countEl.innerText = `${snap.size} Cards`;

    let html = '';
    snap.forEach(doc => {
      const c = doc.data();
        const id = doc.id;
        const isFree = c.type === 'free' || c.price === 0;
        const hasVideo = !!(c.enablePreview && c.videoUrl);

        html += `
          <div class="apple-glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <img src="${c.icon || 'assets/icons/stark-32.png'}" class="w-14 h-14 rounded-2xl object-cover border flex-shrink-0" onerror="this.src='/assets/icons/stark-32.png'">
              <div class="overflow-hidden flex-1">
                <div class="font-bold text-sm text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                  <span>${c.name}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isFree ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}">
                    ${isFree ? 'Free' : `₹${c.price1Month || c.price || 250}`}
                  </span>
                  ${hasVideo ? `<span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-0.5"><span class="material-icons text-[10px]">smart_display</span> Video Preview</span>` : ''}
                </div>
                
                <div class="flex flex-wrap items-center gap-1.5 mt-1">
                  ${c.pill1Text ? `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">${c.pill1Text}</span>` : ''}
                  ${c.pill2Text ? `<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">${c.pill2Text}</span>` : ''}
                  ${!isFree ? `<span class="text-[9px] text-slate-400 font-medium">1M: ₹${c.price1Month || c.price || 250} | 1Y: ₹${c.price1Year || 600} | Life: ₹${c.priceLifetime || 1000}</span>` : ''}
                </div>

                <p class="text-xs text-slate-500 truncate max-w-sm mt-1">${c.desc || '-'}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
              ${hasVideo ? `
                <button onclick="window.openVideoPreview('${encodeURIComponent(c.videoUrl)}', '${(c.name || '').replace(/'/g, "\\'")}')" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition" title="Preview Video">
                  <span class="material-icons text-sm">play_circle</span>
                </button>
              ` : ''}
              <button onclick="window.editCustomMod('${id}')" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-500 hover:bg-blue-50 transition" title="Edit">
                <span class="material-icons text-sm">edit</span>
              </button>
              <button onclick="window.deleteCustomMod('${id}')" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-red-500 hover:bg-red-50 transition" title="Delete">
                <span class="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        `;
      });
      list.innerHTML = html;
    });
  };

  window.saveGameModConfig = async function(gameId, inputId) {
    const link = document.getElementById(inputId).value.trim();
    if (!link) { alert("Please enter a valid link"); return; }
    try {
      await db.collection('gameConfig').doc(gameId).set({ link, enabled: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      alert("✅ Link saved for " + gameId.toUpperCase());
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  window.openAddModModal = function() {
    document.getElementById('modal-mod-id').value = '';
    document.getElementById('modal-mod-title').innerText = 'Add Game Card';
    document.getElementById('modal-mod-name').value = '';
    document.getElementById('modal-mod-tag').value = '';
    document.getElementById('modal-mod-pill1-text').value = '';
    document.getElementById('modal-mod-pill1-color').value = 'blue';
    document.getElementById('modal-mod-pill2-text').value = '';
    document.getElementById('modal-mod-pill2-color').value = 'amber';
    document.getElementById('modal-mod-type').value = 'free';
    document.getElementById('modal-mod-price-month').value = '250';
    document.getElementById('modal-mod-price-year').value = '600';
    document.getElementById('modal-mod-price-lifetime').value = '1000';
    document.getElementById('modal-mod-video-enable').checked = false;
    document.getElementById('modal-mod-video-url').value = '';
    document.getElementById('modal-mod-desc').value = '';
    document.getElementById('modal-mod-icon').value = '';
    document.getElementById('modal-mod-banner').value = '';
    document.getElementById('modal-mod-link').value = '';
    window.togglePriceField('free');
    document.getElementById('mod-modal').classList.remove('hidden');
  };

  window.closeModModal = function() {
    document.getElementById('mod-modal').classList.add('hidden');
  };

  window.togglePriceField = function(val) {
    const box = document.getElementById('modal-price-box');
    if (box) box.classList.toggle('hidden', val !== 'paid');
  };

  window.saveCustomModCard = async function() {
    const id = document.getElementById('modal-mod-id').value.trim();
    const name = document.getElementById('modal-mod-name').value.trim();
    const tag = document.getElementById('modal-mod-tag').value.trim();
    const pill1Text = document.getElementById('modal-mod-pill1-text').value.trim();
    const pill1Color = document.getElementById('modal-mod-pill1-color').value;
    const pill2Text = document.getElementById('modal-mod-pill2-text').value.trim();
    const pill2Color = document.getElementById('modal-mod-pill2-color').value;
    const type = document.getElementById('modal-mod-type').value;
    const price1Month = type === 'paid' ? parseInt(document.getElementById('modal-mod-price-month').value || 250) : 0;
    const price1Year = type === 'paid' ? parseInt(document.getElementById('modal-mod-price-year').value || 600) : 0;
    const priceLifetime = type === 'paid' ? parseInt(document.getElementById('modal-mod-price-lifetime').value || 1000) : 0;
    const enablePreview = document.getElementById('modal-mod-video-enable').checked;
    const videoUrl = document.getElementById('modal-mod-video-url').value.trim();
    const desc = document.getElementById('modal-mod-desc').value.trim();
    const icon = document.getElementById('modal-mod-icon').value.trim();
    const banner = document.getElementById('modal-mod-banner').value.trim();
    const link = document.getElementById('modal-mod-link').value.trim();

    if (!name || !desc) {
      alert("Please fill in Game Name and Description.");
      return;
    }

    const payload = {
      name, tag, pill1Text, pill1Color, pill2Text, pill2Color,
      type,
      price: price1Month, // Primary price for backward compatibility
      price1Month,
      price1Year,
      priceLifetime,
      enablePreview,
      videoUrl,
      desc, icon, banner, link,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      if (id) {
        await db.collection('customCards').doc(id).update(payload);
      } else {
        payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('customCards').add(payload);
      }
      window.closeModModal();
      alert("✅ Game Card Saved!");
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  window.editCustomMod = async function(id) {
    const doc = await db.collection('customCards').doc(id).get();
    if (!doc.exists) return;
    const d = doc.data();

    document.getElementById('modal-mod-id').value = id;
    document.getElementById('modal-mod-title').innerText = 'Edit Game Card';
    document.getElementById('modal-mod-name').value = d.name || '';
    document.getElementById('modal-mod-tag').value = d.tag || '';
    document.getElementById('modal-mod-pill1-text').value = d.pill1Text || '';
    document.getElementById('modal-mod-pill1-color').value = d.pill1Color || 'blue';
    document.getElementById('modal-mod-pill2-text').value = d.pill2Text || '';
    document.getElementById('modal-mod-pill2-color').value = d.pill2Color || 'amber';
    document.getElementById('modal-mod-type').value = d.type || 'free';
    document.getElementById('modal-mod-price-month').value = d.price1Month || d.price || '250';
    document.getElementById('modal-mod-price-year').value = d.price1Year || '600';
    document.getElementById('modal-mod-price-lifetime').value = d.priceLifetime || '1000';
    document.getElementById('modal-mod-video-enable').checked = !!d.enablePreview;
    document.getElementById('modal-mod-video-url').value = d.videoUrl || '';
    document.getElementById('modal-mod-desc').value = d.desc || '';
    document.getElementById('modal-mod-icon').value = d.icon || '';
    document.getElementById('modal-mod-banner').value = d.banner || '';
    document.getElementById('modal-mod-link').value = d.link || '';
    window.togglePriceField(d.type || 'free');
    document.getElementById('mod-modal').classList.remove('hidden');
  };

window.deleteCustomMod = async function(id) {
  if (!confirm("Are you sure you want to delete this game card?")) return;
  try {
    await db.collection('customCards').doc(id).delete();
  } catch (e) {
    alert("Error: " + e.message);
  }
};

/* --- GAME SCREENSHOTS MANAGEMENT --- */
window.currentGameScreenshots = [];

window.openGameScreenshotsModal = async function(gameId, gameTitle) {
  const modal = document.getElementById('screenshots-modal');
  const titleEl = document.getElementById('modal-screenshots-title');
  const gameSub = document.getElementById('modal-screenshots-game');
  const idInput = document.getElementById('modal-screenshots-gameid');
  const newUrlInput = document.getElementById('new-screenshot-url');
  const fileInput = document.getElementById('screenshot-file-input');

  if (!modal || !window.db) return;

  if (titleEl) titleEl.innerText = `${gameTitle} Screenshots`;
  if (gameSub) gameSub.innerText = `Manage preview gallery images for ${gameId.toUpperCase()}`;
  if (idInput) idInput.value = gameId;
  if (newUrlInput) newUrlInput.value = '';
  if (fileInput) fileInput.value = '';

  window.currentGameScreenshots = [];

  try {
    const doc = await db.collection('gameConfig').doc(gameId).get();
    if (doc.exists && doc.data().screenshots && Array.isArray(doc.data().screenshots)) {
      window.currentGameScreenshots = [...doc.data().screenshots];
    } else {
      // Defaults based on game
      if (gameId === 'rc25') {
        window.currentGameScreenshots = [1, 2, 3, 4, 5].map(i => `assets/img/img_rc25_V8_${i}.jpg`);
      } else if (gameId === 'rc24') {
        window.currentGameScreenshots = [1, 2, 3, 4].map(i => `assets/img/img_rc24_${i}.jpg`);
      } else if (gameId === 'rc20') {
        window.currentGameScreenshots = [1, 2, 3, 4].map(i => `assets/img/img_rc20_${i}.jpg`);
      } else if (gameId === 'wcc3') {
        window.currentGameScreenshots = [1, 2, 3, 4].map(i => `assets/img/img_wcc3_${i}.jpg`);
      }
    }
  } catch (e) {
    console.warn("Could not load screenshots:", e);
  }

  window.renderModalScreenshots();
  modal.classList.remove('hidden');
};

window.closeScreenshotsModal = function() {
  const modal = document.getElementById('screenshots-modal');
  if (modal) modal.classList.add('hidden');
  window.currentGameScreenshots = [];
};

window.renderModalScreenshots = function() {
  const list = document.getElementById('modal-screenshots-list');
  if (!list) return;

  if (!window.currentGameScreenshots.length) {
    list.innerHTML = `<div class="text-xs text-slate-400 col-span-full text-center py-4">No screenshots added yet.</div>`;
    return;
  }

  list.innerHTML = window.currentGameScreenshots.map((url, idx) => `
    <div class="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-black/40">
      <img src="${url}" class="w-full h-full object-cover select-none pointer-events-none" onerror="this.src='https://placehold.co/300x180?text=Invalid+Image'">
      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
        <button onclick="window.removeModalScreenshot(${idx})" class="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition" title="Delete">
          <span class="material-icons text-xs">delete</span>
        </button>
      </div>
      <div class="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1 rounded">#${idx + 1}</div>
    </div>
  `).join('');
};

window.addScreenshotFromUrl = function() {
  const input = document.getElementById('new-screenshot-url');
  const url = input ? input.value.trim() : '';
  if (!url) return;

  window.currentGameScreenshots.push(url);
  input.value = '';
  window.renderModalScreenshots();
};

window.uploadScreenshotFile = function(inputEl) {
  if (inputEl.files && inputEl.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.currentGameScreenshots.push(e.target.result);
      window.renderModalScreenshots();
    };
    reader.readAsDataURL(inputEl.files[0]);
  }
};

window.removeModalScreenshot = function(idx) {
  window.currentGameScreenshots.splice(idx, 1);
  window.renderModalScreenshots();
};

window.saveGameScreenshots = async function() {
  const gameId = document.getElementById('modal-screenshots-gameid').value;
  if (!gameId || !window.db) return;

  try {
    await db.collection('gameConfig').doc(gameId).set({
      screenshots: window.currentGameScreenshots,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    alert(`✅ Screenshots updated for ${gameId.toUpperCase()}!`);
    window.closeScreenshotsModal();
  } catch (e) {
    alert("Error saving: " + e.message);
  }
};

/* =========================================
   7. EXPORTS
   ========================================= */
window.AdminPage = AdminPage;
window.AdminOrdersPage = AdminOrdersPage;
window.AdminSubOrdersPage = AdminSubOrdersPage;
window.AdminUserOrdersPage = AdminUserOrdersPage;
window.AdminEliteWalletsPage = AdminEliteWalletsPage;
window.AdminPaymentsPage = AdminPaymentsPage;
window.AdminModsPage = AdminModsPage;

