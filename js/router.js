// pages/admin.js

// Approx rate for INR -> USD
const INR_PER_USD = 90;
const COMMISSION_RATE = 0.10; // 10%

// State for orders summary & per-user orders
window.ordersSummaryByUser = {};
window.adminSelectedOrderUserId = null;
window.adminSelectedOrderUserEmail = null;
window.ordersUnsub = null;
window.currentUserOrdersUnsub = null;

// Pending badges listeners
window.ordersPendingUnsub = null;
window.withdrawPendingUnsub = null;

function AdminPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => {
    // Only withdrawals on main page to keep it light
    if (window.loadWithdrawRequests) window.loadWithdrawRequests();
    if (window.initAdminBadges) window.initAdminBadges(); // start badge listeners
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      <h1 class="text-2xl font-bold mb-2">Admin Dashboard</h1>

      <!-- QUICK NAV -->
      <section>
        <h2 class="text-lg font-bold mb-3">Quick Navigation</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Orders (Normal) -->
          <button onclick="window.router.navigateTo('/admin-orders')"
                  class="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <span id="badge-orders-normal"
                  class="hidden absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-blue-600">receipt_long</span>
              <span class="font-bold text-sm">Orders (Normal)</span>
            </div>
            <div class="text-[11px] text-slate-500">
              View normal game / plan orders by user.
            </div>
          </button>

          <!-- Subscription Orders -->
          <button onclick="window.router.navigateTo('/admin-sub-orders')"
                  class="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <span id="badge-orders-sub"
                  class="hidden absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-purple-600">workspace_premium</span>
              <span class="font-bold text-sm">Subscription Orders</span>
            </div>
            <div class="text-[11px] text-slate-500">
              Only Mod Creator subscription & upgrade payments.
            </div>
          </button>

          <!-- Elite Wallets -->
          <button onclick="window.router.navigateTo('/admin-elite-wallets')"
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-emerald-600">account_balance_wallet</span>
              <span class="font-bold text-sm">Elite Wallets</span>
            </div>
            <div class="text-[11px] text-slate-500">
              View and manually credit Elite wallets.
            </div>
          </button>

          <!-- Creator Admin -->
          <button onclick="window.router.navigateTo('/creator-admin')"
                  class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div class="flex items-center gap-2 mb-1">
              <span class="material-icons text-amber-500">build</span>
              <span class="font-bold text-sm">Creator Admin</span>
            </div>
            <div class="text-[11px] text-slate-500">
              Approve Mod Creator subscriptions & mod requests.
            </div>
          </button>
        </div>
      </section>

      <!-- WITHDRAWALS -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold">Withdrawal Requests</h2>
            <span id="badge-withdraw"
                  class="hidden w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <span class="text-[11px] text-slate-500">From Elite wallets</span>
        </div>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-4">User</th>
                <th class="p-4">Amount (USD)</th>
                <th class="p-4">Payment Method</th>
                <th class="p-4">Status</th>
                <th class="p-4">Actions</th>
              </tr>
            </thead>
            <tbody id="withdraw-list">
              <tr><td colspan="5" class="p-8 text-center">Loading withdraw requests...</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

/* ---------- PENDING BADGES ---------- */

window.initAdminBadges = function () {
  if (!window.db) return;

  // Orders pending: split normal vs subscription
  if (!window.ordersPendingUnsub) {
    window.ordersPendingUnsub = db.collection('orders')
      .where('status', '==', 'pending')
      .onSnapshot(snapshot => {
        let hasNormal = false;
        let hasSub = false;

        snapshot.forEach(doc => {
          const o = doc.data();
          const isSub = o.gameId && o.gameId.startsWith('sub_'); // sub_, sub_UP_...
          if (isSub) hasSub = true;
          else hasNormal = true;
        });

        const elNormal = document.getElementById('badge-orders-normal');
        const elSub    = document.getElementById('badge-orders-sub');

        if (elNormal) elNormal.classList.toggle('hidden', !hasNormal);
        if (elSub)    elSub.classList.toggle('hidden', !hasSub);
      }, err => {
        console.error('ordersPendingUnsub error:', err);
      });
  }

  // Withdraw pending
  if (!window.withdrawPendingUnsub) {
    window.withdrawPendingUnsub = db.collection('withdrawRequests')
      .where('status', '==', 'pending')
      .onSnapshot(snapshot => {
        const hasPending = !snapshot.empty;
        const el = document.getElementById('badge-withdraw');
        if (el) el.classList.toggle('hidden', !hasPending);
      }, err => {
        console.error('withdrawPendingUnsub error:', err);
      });
  }
};

/* ---------- ORDERS: SUMMARY BY USER (NORMAL / SUBS) ---------- */

window.loadOrdersSummary = function (subOnly = false) {
  const list = document.getElementById('orders-users-list');
  if (!list || !window.db) return;

  // Unsubscribe previous listener if any
  if (window.ordersUnsub) {
    window.ordersUnsub();
    window.ordersUnsub = null;
  }

  window.ordersUnsub = db.collection('orders')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders yet.</td></tr>`;
        window.ordersSummaryByUser = {};
        return;
      }

      const byUser = {};

      snapshot.forEach(doc => {
        const o = doc.data();
        const uid = o.userId || 'unknown';
        const isSubOrder = o.gameId && o.gameId.startsWith('sub_'); // sub_ or sub_UP_

        // Filter by type
        if (subOnly && !isSubOrder) return;
        if (!subOnly && isSubOrder) return;

        if (!byUser[uid]) {
          byUser[uid] = {
            userId: uid,
            email: o.email || 'Unknown',
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            lastTimestamp: 0
          };
        }

        const u = byUser[uid];
        u.total += 1;
        const status = o.status || 'pending';
        if (status === 'approved') u.approved += 1;
        else if (status === 'rejected') u.rejected += 1;
        else u.pending += 1;

        const ts = o.timestamp && o.timestamp.toDate ? o.timestamp.toDate().getTime() : 0;
        if (ts > u.lastTimestamp) u.lastTimestamp = ts;
      });

      window.ordersSummaryByUser = byUser;

      const usersArr = Object.values(byUser).sort(
        (a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0)
      );

      if (!usersArr.length) {
        list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders for this filter.</td></tr>`;
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
              <button onclick="window.viewUserOrders('${u.userId}')"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                <span class="material-icons text-xs">visibility</span> View Orders
              </button>
            </td>
          </tr>`;
      });

      list.innerHTML = html;
    }, err => {
      console.error(err);
      list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-red-500">Error loading orders.</td></tr>`;
    });
};

window.viewUserOrders = function (userId) {
  const info = window.ordersSummaryByUser && window.ordersSummaryByUser[userId];
  window.adminSelectedOrderUserId = userId;
  window.adminSelectedOrderUserEmail = info ? info.email : 'Unknown';

  if (window.router) {
    window.router.navigateTo('/admin-user-orders');
  }
};

/* ---------- PAGES: ORDERS SUMMARY ---------- */

function AdminOrdersPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => {
    window.loadOrdersSummary(false); // normal orders only
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Orders (Normal)</h1>
        <div class="flex gap-2">
          <button onclick="window.router.navigateTo('/admin-sub-orders')"
                  class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200">
            Subscription Orders
          </button>
          <button onclick="window.router.navigateTo('/admin')"
                  class="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-3 py-1 rounded flex items-center gap-1">
            <span class="material-icons text-xs">arrow_back</span> Back
          </button>
        </div>
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

function AdminSubOrdersPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => {
    window.loadOrdersSummary(true); // subscription orders only
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">Subscription Orders (Mod Creator)</h1>
        <div class="flex gap-2">
          <button onclick="window.router.navigateTo('/admin-orders')"
                  class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
            Normal Orders
          </button>
          <button onclick="window.router.navigateTo('/admin')"
                  class="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-3 py-1 rounded flex items-center gap-1">
            <span class="material-icons text-xs">arrow_back</span> Back
          </button>
        </div>
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

/* ---------- PER-USER ORDERS PAGE ---------- */

function AdminUserOrdersPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  if (!window.adminSelectedOrderUserId) {
    if (window.router) window.router.navigateTo('/admin-orders');
    return '';
  }

  const email = window.adminSelectedOrderUserEmail || 'Unknown';
  const uid = window.adminSelectedOrderUserId;

  setTimeout(() => {
    window.loadAdminUserOrders();
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-1">User Orders</h1>
          <div class="text-xs text-slate-500">
            ${email} · UID: <span class="font-mono">${uid}</span>
          </div>
        </div>
        <button onclick="window.router.navigateTo('/admin-orders')"
                class="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-3 py-1 rounded flex items-center gap-1">
          <span class="material-icons text-xs">arrow_back</span> Back
        </button>
      </div>

      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-3">Type</th>
              <th class="p-3">Item</th>
              <th class="p-3">UTR</th>
              <th class="p-3">Amount</th>
              <th class="p-3">Status</th>
              <th class="p-3">Key</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody id="admin-user-orders-list">
            <tr><td colspan="7" class="p-6 text-center text-slate-400">Loading orders...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.loadAdminUserOrders = function () {
  const list = document.getElementById('admin-user-orders-list');
  if (!list || !window.db || !window.adminSelectedOrderUserId) return;

  const userId = window.adminSelectedOrderUserId;

  // Unsubscribe old listener if any
  if (window.currentUserOrdersUnsub) {
    window.currentUserOrdersUnsub();
    window.currentUserOrdersUnsub = null;
  }

  window.currentUserOrdersUnsub = db.collection('orders')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders for this user.</td></tr>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();
        const id = doc.id;
        const isSubOrder = o.gameId && o.gameId.startsWith('sub_');
        const userName = o.userName || o.email || 'Unknown';

        const statusBadgeClass =
          o.status === 'pending'
            ? 'bg-yellow-100 text-yellow-700'
            : o.status === 'approved'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';

        const typeLabel = isSubOrder ? 'Subscription' : 'Normal';

        const itemTitle = o.item?.gameName || '-';
        const planName  = o.item?.planName || '';

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-3 align-top">
              <div class="font-semibold">${typeLabel}</div>
              <div class="text-[11px] text-slate-500">${o.gameId || ''}</div>
            </td>
            <td class="p-3 align-top">
              <div class="font-bold">${itemTitle}</div>
              <div class="text-xs text-slate-500">${planName}</div>
              <div class="text-[10px] text-slate-400">${userName}</div>
            </td>
            <td class="p-3 align-top font-mono text-xs select-all">
              ${o.transId || '-'}
            </td>
            <td class="p-3 align-top font-bold text-blue-600">
              ₹${o.amount}
            </td>
            <td class="p-3 align-top">
              <span class="badge text-xs uppercase font-bold px-2 py-1 rounded ${statusBadgeClass}">
                ${o.status || 'pending'}
              </span>
            </td>
            <td class="p-3 align-top">
              ${o.key
                ? `<div class="font-mono text-xs mb-1">${o.key}</div>`
                : `<div class="text-xs text-slate-400 mb-1">Not set</div>`}
              <button onclick="window.setKey('${id}')"
                      class="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600">
                Set / Edit Key
              </button>
            </td>
            <td class="p-3 align-top flex gap-1 flex-wrap">
              ${o.status === 'pending' ? `
                <button onclick="window.updateStatus('${id}', 'approved')" class="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                  <span class="material-icons text-sm">check</span>
                </button>
                <button onclick="window.updateStatus('${id}', 'rejected')" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                  <span class="material-icons text-sm">close</span>
                </button>
              ` : `
                <span class="text-slate-400 text-xs px-2 py-1">Done</span>
              `}
              <button onclick="window.deleteOrder('${id}')"
                      class="bg-slate-300 hover:bg-slate-400 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100 p-2 rounded text-xs flex items-center gap-1">
                <span class="material-icons text-xs">delete</span>
              </button>
            </td>
          </tr>`;
      });

      list.innerHTML = html;
    }, err => {
      console.error(err);
      list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-red-500">Error loading user orders.</td></tr>`;
    });
};

/* ---------- ORDERS: KEY & STATUS + ELITE CREDIT + DELETE ---------- */

window.setKey = function (docId) {
  const key = prompt('Enter / update key for this order:');
  if (!key) return;

  db.collection('orders').doc(docId).update({ key })
    .then(() => alert('Key saved. User will see it in Profile.'))
    .catch(e => alert(e.message));
};

window.updateStatus = async function (docId, status) {
  if (!confirm(`Mark order as ${status}?`)) return;

  try {
    const orderRef = db.collection('orders').doc(docId);
    const snap = await orderRef.get();
    if (!snap.exists) throw new Error('Order not found');
    const order = snap.data();

    await orderRef.update({ status });

    if (status === 'approved' && window.isElite && window.currentUser) {
      await window.creditEliteWallet(window.currentUser, order, docId);
    }

    alert('Status updated. User will see it.');
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};

window.deleteOrder = function (docId) {
  if (!confirm('Delete this order? This cannot be undone.')) return;

  db.collection('orders').doc(docId).delete()
    .then(() => {
      alert('Order deleted.');
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
};

window.creditEliteWallet = async function (adminUser, order, orderDocId) {
  const usd = (order.amount / INR_PER_USD) * COMMISSION_RATE;
  const commissionUSD = Math.round(usd * 100) / 100;

  const walletRef = db.collection('wallets').doc(adminUser.uid);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const data = snap.exists ? snap.data() : {};

    const balanceUSD = (data.balanceUSD || 0) + commissionUSD;
    const totalEarnedUSD = (data.totalEarnedUSD || 0) + commissionUSD;

    tx.set(walletRef, {
      userId: adminUser.uid,
      email: adminUser.email,
      balanceUSD,
      totalEarnedUSD,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: data.createdAt || firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    const txRef = walletRef.collection('transactions').doc();
    tx.set(txRef, {
      type: 'earning',
      orderId: order.orderId || null,
      orderDocId,
      gameName: order.item?.gameName || '',
      amountUSD: commissionUSD,
      sourceAmountINR: order.amount,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  });
};

/* ---------- WITHDRAWAL REQUESTS ---------- */

window.loadWithdrawRequests = function () {
  const list = document.getElementById('withdraw-list');
  if (!list || !window.db) return;

  db.collection('withdrawRequests')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      let html = '';
      snapshot.forEach(doc => {
        const w = doc.data();
        const id = doc.id;

        const statusBadgeClass =
          w.status === 'pending'
            ? 'bg-yellow-100 text-yellow-700'
            : w.status === 'paid'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-4">
              <div class="font-bold">${w.email}</div>
              <div class="text-[11px] text-slate-400">ID: ${w.userId}</div>
            </td>
            <td class="p-4 font-bold text-blue-600">$${w.amountUSD.toFixed(2)}</td>
            <td class="p-4 text-xs whitespace-pre-line max-w-xs">${w.paymentMethod || '-'}</td>
            <td class="p-4">
              <span class="badge text-xs uppercase font-bold px-2 py-1 rounded ${statusBadgeClass}">
                ${w.status}
              </span>
            </td>
            <td class="p-4 flex gap-1 flex-wrap">
              ${w.status === 'pending' ? `
                <button onclick="window.handleWithdrawStatus('${id}', 'paid')" class="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                  <span class="material-icons text-sm">check</span>
                </button>
                <button onclick="window.handleWithdrawStatus('${id}', 'rejected')" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                  <span class="material-icons text-sm">close</span>
                </button>
              ` : `
                <span class="text-slate-400 text-xs px-2 py-1">Done</span>
              `}
              <button onclick="window.deleteWithdrawRequest('${id}')"
                      class="bg-slate-300 hover:bg-slate-400 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-100 p-2 rounded text-xs flex items-center gap-1">
                <span class="material-icons text-xs">delete</span>
              </button>
            </td>
          </tr>`;
      });

      list.innerHTML = html || `<tr><td colspan="5" class="p-8 text-center text-slate-400">No withdrawal requests.</td></tr>`;
    });
};

window.handleWithdrawStatus = async function (requestId, newStatus) {
  if (!confirm(`Mark withdrawal as ${newStatus}?`)) return;

  const reqRef = db.collection('withdrawRequests').doc(requestId);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(reqRef);
    if (!snap.exists) throw new Error('Request not found');

    const w = snap.data();
    if (w.status !== 'pending') throw new Error('Already processed');

    tx.update(reqRef, {
      status: newStatus,
      processedBy: window.currentUser.email,
      processedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // If rejected, refund back to wallet
    if (newStatus === 'rejected') {
      const walletRef = db.collection('wallets').doc(w.userId);
      const wSnap = await tx.get(walletRef);
      const wData = wSnap.exists ? wSnap.data() : {};
      const newBalance = (wData.balanceUSD || 0) + w.amountUSD;

      tx.set(walletRef, {
        balanceUSD: newBalance,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      const txRef = walletRef.collection('transactions').doc();
      tx.set(txRef, {
        type: 'refund',
        amountUSD: w.amountUSD,
        withdrawRequestId: requestId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  });

  alert('Withdrawal updated.');
};

window.deleteWithdrawRequest = function (requestId) {
  if (!confirm('Delete this withdrawal request? This cannot be undone.')) return;

  db.collection('withdrawRequests').doc(requestId).delete()
    .then(() => {
      alert('Withdrawal request deleted.');
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
};

/* ---------- ELITE WALLETS PAGE + LOADER ---------- */

function AdminEliteWalletsPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => {
    window.loadEliteWallets();
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold">Elite Wallets</h1>
        <button onclick="window.router.navigateTo('/admin')"
                class="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-3 py-1 rounded flex items-center gap-1">
          <span class="material-icons text-xs">arrow_back</span> Back
        </button>
      </div>

      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-4">User</th>
              <th class="p-4">Balance</th>
              <th class="p-4">Total Earned</th>
              <th class="p-4">Payment Method</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody id="elite-list">
            <tr><td colspan="5" class="p-8 text-center">Loading wallets...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.loadEliteWallets = function () {
  const list = document.getElementById('elite-list');
  if (!list || !window.db) return;

  db.collection('wallets')
    .orderBy('email')
    .onSnapshot(snapshot => {
      let html = '';
      snapshot.forEach(doc => {
        const w = doc.data();
        const uid = w.userId || doc.id;
        const balance = w.balanceUSD || 0;
        const earned  = w.totalEarnedUSD || 0;
        const method  = (w.paymentMethod || '').replace(/\n/g, '<br>');

        const safeEmail = (w.email || '').replace(/"/g, '&quot;').replace(/'/g, "\\'");

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-4">
              <div class="font-bold">${w.email || 'Unknown'}</div>
              <div class="text-[11px] text-slate-400">UID: ${uid}</div>
            </td>
            <td class="p-4 font-bold text-blue-600">$${balance.toFixed(2)}</td>
            <td class="p-4 text-sm text-slate-700 dark:text-slate-200">$${earned.toFixed(2)}</td>
            <td class="p-4 text-xs whitespace-pre-line max-w-xs">${method || '<span class="text-slate-400">Not set</span>'}</td>
            <td class="p-4">
              <button onclick="window.manualCredit('${uid}', '${safeEmail}')"
                      class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold">
                Add Funds
              </button>
            </td>
          </tr>`;
      });

      list.innerHTML = html || `<tr><td colspan="5" class="p-8 text-center text-slate-400">No elite wallets yet.</td></tr>`;
    });
};

window.manualCredit = function (userId, email) {
  const amountStr = prompt(`Enter USD amount to credit to ${email}:`);
  if (!amountStr) return;

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert('Invalid amount.');
    return;
  }

  const walletRef = db.collection('wallets').doc(userId);

  db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const data = snap.exists ? snap.data() : {};

    const newBalance = (data.balanceUSD || 0) + amount;
    const newEarned  = (data.totalEarnedUSD || 0) + amount;

    tx.set(walletRef, {
      userId,
      email,
      balanceUSD: newBalance,
      totalEarnedUSD: newEarned,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: data.createdAt || firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    const txRef = walletRef.collection('transactions').doc();
    tx.set(txRef, {
      type: 'manual',
      amountUSD: amount,
      note: `Manual credit by ${window.currentUser?.email || 'admin'}`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }).then(() => {
    alert('Wallet updated.');
  }).catch((e) => {
    console.error(e);
    alert(e.message);
  });
};

/* ---------- EXPORT PAGES ---------- */

window.AdminPage = AdminPage;
window.AdminOrdersPage = AdminOrdersPage;
window.AdminSubOrdersPage = AdminSubOrdersPage;
window.AdminUserOrdersPage = AdminUserOrdersPage;
window.AdminEliteWalletsPage = AdminEliteWalletsPage;
