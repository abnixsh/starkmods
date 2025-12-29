// pages/admin.js

// --- CONFIG ---
const INR_PER_USD = 90;
const COMMISSION_RATE = 0.10; // 10%

// Optional: Pre-fill links to save time for common games
const STANDARD_LINKS = {
  'rc24': 'https://drive.google.com/your-rc24-link',
  'rc20': 'https://drive.google.com/your-rc20-link',
  'wcc3': 'https://drive.google.com/your-wcc3-link',
  // add others here...
};

// State variables
window.ordersSummaryByUser = {};
window.adminSelectedOrderUserId = null;
window.adminSelectedOrderUserEmail = null;
window.ordersUnsub = null;
window.currentUserOrdersUnsub = null;

/* ------------------------------------------------------------
   1. MAIN DASHBOARD (AdminPage)
------------------------------------------------------------ */
function AdminPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      <h1 class="text-2xl font-bold mb-2">Admin Dashboard</h1>

      <!-- QUICK NAV -->
      <section>
        <h2 class="text-lg font-bold mb-3">Quick Navigation</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button onclick="window.router.navigateTo('/admin-orders')"
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-blue-600">receipt_long</span>
              <span class="font-bold text-sm">Orders (Normal)</span>
            </div>
            <div class="text-[11px] text-slate-500">
              View normal game / plan orders by user.
            </div>
          </button>

          <button onclick="window.router.navigateTo('/admin-sub-orders')"
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-purple-600">workspace_premium</span>
              <span class="font-bold text-sm">Subscription Orders</span>
            </div>
            <div class="text-[11px] text-slate-500">
              Mod Creator subscription payments.
            </div>
          </button>

          <button onclick="window.router.navigateTo('/admin-elite-wallets')"
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-emerald-600">account_balance_wallet</span>
              <span class="font-bold text-sm">Elite Wallets</span>
            </div>
            <div class="text-[11px] text-slate-500">
              Manage team commissions & withdrawals.
            </div>
          </button>

          <button onclick="window.router.navigateTo('/creator-admin')"
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-amber-500">build</span>
              <span class="font-bold text-sm">Creator Admin</span>
            </div>
            <div class="text-[11px] text-slate-500">
              Approve Creator Plans & Mod Requests.
            </div>
          </button>

        </div>
      </section>
    </div>
  `;
}

/* ------------------------------------------------------------
   2. ORDERS LIST PAGES
------------------------------------------------------------ */

function AdminOrdersPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => window.loadOrdersSummary(false), 100); // false = normal orders
  return renderOrderListTemplate("Orders (Normal)");
}

function AdminSubOrdersPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => window.loadOrdersSummary(true), 100); // true = sub orders
  return renderOrderListTemplate("Subscription Orders");
}

function renderOrderListTemplate(title) {
  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">${title}</h1>
        <button onclick="window.router.navigateTo('/admin')"
                class="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 px-3 py-1 rounded font-bold">
          Back
        </button>
      </div>
      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-3">User</th>
              <th class="p-3">Total</th>
              <th class="p-3">Approved</th>
              <th class="p-3">Pending</th>
              <th class="p-3">Rejected</th>
              <th class="p-3">Last Order</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody id="orders-users-list">
            <tr><td colspan="7" class="p-6 text-center text-slate-400">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Logic to load user summary
window.loadOrdersSummary = function (subOnly) {
  const list = document.getElementById('orders-users-list');
  if (!list || !window.db) return;

  if (window.ordersUnsub) { window.ordersUnsub(); window.ordersUnsub = null; }

  window.ordersUnsub = db.collection('orders')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders found.</td></tr>`;
        return;
      }

      const byUser = {};

      snapshot.forEach(doc => {
        const o = doc.data();
        const uid = o.userId || 'unknown';
        const isSubOrder = o.gameId && String(o.gameId).startsWith('sub_');

        if (subOnly && !isSubOrder) return;
        if (!subOnly && isSubOrder) return;

        if (!byUser[uid]) {
          byUser[uid] = { userId: uid, email: o.email || 'Unknown', total: 0, approved: 0, pending: 0, rejected: 0, lastTimestamp: 0 };
        }
        const u = byUser[uid];
        u.total++;
        if (o.status === 'approved') u.approved++;
        else if (o.status === 'rejected') u.rejected++;
        else u.pending++;

        const ts = o.timestamp && o.timestamp.toDate ? o.timestamp.toDate().getTime() : 0;
        if (ts > u.lastTimestamp) u.lastTimestamp = ts;
      });

      const usersArr = Object.values(byUser).sort((a, b) => b.lastTimestamp - a.lastTimestamp);

      if (!usersArr.length) {
        list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders found.</td></tr>`;
        return;
      }

      let html = '';
      usersArr.forEach(u => {
        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition">
            <td class="p-3 font-bold">${u.email} <div class="text-[10px] text-slate-400 font-normal">${u.userId}</div></td>
            <td class="p-3">${u.total}</td>
            <td class="p-3 text-green-600">${u.approved}</td>
            <td class="p-3 text-amber-600 font-bold">${u.pending}</td>
            <td class="p-3 text-red-600">${u.rejected}</td>
            <td class="p-3 text-slate-500 text-xs">${new Date(u.lastTimestamp).toLocaleDateString()}</td>
            <td class="p-3">
              <button onclick="window.viewUserOrders('${u.userId}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">View</button>
            </td>
          </tr>`;
      });
      list.innerHTML = html;
    });
};

window.viewUserOrders = function (userId) {
  window.adminSelectedOrderUserId = userId;
  if (window.router) window.router.navigateTo('/admin-user-orders');
};

/* ------------------------------------------------------------
   3. SINGLE USER ORDERS PAGE
------------------------------------------------------------ */

function AdminUserOrdersPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  if (!window.adminSelectedOrderUserId) { window.router.navigateTo('/admin-orders'); return ''; }

  setTimeout(window.loadAdminUserOrders, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">User Orders</h1>
        <button onclick="window.history.back()" class="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded font-bold">Back</button>
      </div>
      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-3">Item</th>
              <th class="p-3">UTR / Trans ID</th>
              <th class="p-3">Amount</th>
              <th class="p-3">Status</th>
              <th class="p-3">Link/Key</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-user-orders-list">
            <tr><td colspan="6" class="p-6 text-center text-slate-400">Loading...</td></tr>
          </tbody>
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

  window.currentUserOrdersUnsub = db.collection('orders')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No orders.</td></tr>`;
        return;
      }
      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();
        const id = doc.id;
        const itemTitle = o.item?.gameName || 'Unknown';
        
        let linkStatus = o.downloadUrl ? '<span class="text-green-500 text-xs">Link Set</span>' : '<span class="text-red-400 text-xs">No Link</span>';
        if(o.status !== 'approved') linkStatus = '';

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition">
            <td class="p-3 font-bold">${itemTitle} <div class="text-[10px] text-slate-400">${o.gameId || '-'}</div></td>
            <td class="p-3 font-mono text-xs select-all">${o.transId || '-'}</td>
            <td class="p-3 font-bold text-blue-600">₹${o.amount}</td>
            <td class="p-3"><span class="badge text-xs uppercase font-bold px-2 py-1 rounded bg-slate-100">${o.status}</span></td>
            <td class="p-3 text-xs">
                ${linkStatus} <br>
                ${o.key ? '<span class="text-green-500">Key Set</span>' : '<span class="text-slate-400">No Key</span>'}
            </td>
            <td class="p-3 flex gap-2">
              ${o.status === 'pending' ? `
                <button onclick="window.updateStatus('${id}', 'approved')" class="bg-green-600 text-white p-2 rounded hover:bg-green-700"><span class="material-icons text-sm">check</span></button>
                <button onclick="window.updateStatus('${id}', 'rejected')" class="bg-red-500 text-white p-2 rounded hover:bg-red-600"><span class="material-icons text-sm">close</span></button>
              ` : `
                <button onclick="window.setKey('${id}')" class="bg-slate-200 text-xs px-2 py-1 rounded">Edit Key</button>
              `}
            </td>
          </tr>`;
      });
      list.innerHTML = html;
    });
};

/* ------------------------------------------------------------
   4. STATUS UPDATE LOGIC (CRITICAL SECURE VERSION)
------------------------------------------------------------ */

window.updateStatus = async function (docId, status) {
  if (!confirm(`Mark order as ${status}?`)) return;

  try {
    const orderRef = db.collection('orders').doc(docId);
    const snap = await orderRef.get();
    if (!snap.exists) throw new Error('Order not found');
    const order = snap.data();

    let updateData = { status };

    // --- SECURE: ASK FOR LINK ON APPROVAL ---
    if (status === 'approved') {
      const suggested = (order.gameId && STANDARD_LINKS[order.gameId]) || '';
      const link = prompt("Enter Download Link for this user:", suggested);
      
      if (link) {
        updateData.downloadUrl = link; 
      } else {
        if(!confirm("No link entered. User won't be able to download. Continue anyway?")) return;
      }
    }
    // ----------------------------------------

    await orderRef.update(updateData);

    // Credit Elite Wallet logic
    if (status === 'approved' && window.isElite && window.currentUser) {
      await window.creditEliteWallet(window.currentUser, order, docId);
    }

    alert('Status updated.');
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};

window.setKey = function (docId) {
  const key = prompt('Enter / update key for this order:');
  if (!key) return;
  db.collection('orders').doc(docId).update({ key })
    .then(() => alert('Key saved.'))
    .catch(e => alert(e.message));
};

/* ------------------------------------------------------------
   5. ELITE WALLET LOGIC
------------------------------------------------------------ */

function AdminEliteWalletsPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  setTimeout(() => { window.loadEliteWallets(); window.loadWithdrawRequests(); }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold">Elite Wallets</h1>
        <button onclick="window.router.navigateTo('/admin')" class="text-xs bg-slate-200 px-3 py-1 rounded font-bold">Back</button>
      </div>

      <!-- WALLETS -->
      <section>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-4">User</th><th class="p-4">Balance</th><th class="p-4">Earned</th><th class="p-4">Action</th></tr>
            </thead>
            <tbody id="elite-list"><tr><td colspan="4" class="p-8 text-center">Loading...</td></tr></tbody>
          </table>
        </div>
      </section>

      <!-- WITHDRAWALS -->
      <section>
        <h2 class="text-lg font-bold mb-3">Withdrawal Requests</h2>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-4">User</th><th class="p-4">Amount</th><th class="p-4">Method</th><th class="p-4">Status</th><th class="p-4">Action</th></tr>
            </thead>
            <tbody id="withdraw-list"><tr><td colspan="5" class="p-8 text-center">Loading...</td></tr></tbody>
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
        html += `<tr class="border-b border-slate-100 dark:border-slate-700"><td class="p-4 font-bold">${w.email}</td><td class="p-4 text-blue-600 font-bold">$${(w.balanceUSD||0).toFixed(2)}</td><td class="p-4">$${(w.totalEarnedUSD||0).toFixed(2)}</td><td class="p-4"><button onclick="window.manualCredit('${w.userId}','${w.email}')" class="bg-emerald-600 text-white px-3 py-1 rounded text-xs">Credit</button></td></tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="4" class="p-8 text-center text-slate-400">No wallets.</td></tr>`;
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
      html += `<tr class="border-b border-slate-100 dark:border-slate-700"><td class="p-4 font-bold">${w.email}</td><td class="p-4 font-bold text-blue-600">$${w.amountUSD}</td><td class="p-4 text-xs">${w.paymentMethod}</td><td class="p-4"><span class="badge text-xs uppercase font-bold bg-slate-100 px-2 py-1 rounded">${w.status}</span></td><td class="p-4 flex gap-2">${w.status === 'pending' ? `<button onclick="window.handleWithdrawStatus('${id}','paid')" class="bg-green-600 text-white p-2 rounded"><span class="material-icons text-sm">check</span></button>` : ''}</td></tr>`;
    });
    list.innerHTML = html || `<tr><td colspan="5" class="p-8 text-center text-slate-400">No requests.</td></tr>`;
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

/* ------------------------------------------------------------
   6. EXPORTS
------------------------------------------------------------ */
window.AdminPage = AdminPage;
window.AdminOrdersPage = AdminOrdersPage;
window.AdminSubOrdersPage = AdminSubOrdersPage;
window.AdminUserOrdersPage = AdminUserOrdersPage;
window.AdminEliteWalletsPage = AdminEliteWalletsPage;
