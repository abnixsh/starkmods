// pages/admin.js

// Approx rate for INR -> USD
const INR_PER_USD = 90;
const COMMISSION_RATE = 0.10; // 10%

function AdminPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => {
    window.loadAllOrders();
    window.loadWithdrawRequests();
    window.loadEliteWallets();
  }, 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-10">
      <h1 class="text-2xl font-bold">Admin Dashboard</h1>

      <!-- ORDERS -->
      <section>
        <h2 class="text-lg font-bold mb-3">Orders</h2>
        <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th class="p-4">User</th>
                <th class="p-4">Item</th>
                <th class="p-4">UTR</th>
                <th class="p-4">Amount</th>
                <th class="p-4">Status</th>
                <th class="p-4">Key</th>
                <th class="p-4">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-list">
              <tr><td colspan="7" class="p-8 text-center">Loading orders...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- WITHDRAWALS -->
      <section>
        <h2 class="text-lg font-bold mb-3">Withdrawal Requests</h2>
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

      <!-- ELITE WALLETS -->
      <section>
        <h2 class="text-lg font-bold mb-3">Elite Wallets (Manual Credit)</h2>
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
      </section>
    </div>
  `;
}

/* ---------- ORDERS ---------- */

window.loadAllOrders = function () {
  const list = document.getElementById('admin-list');

  db.collection('orders')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();
        const id = doc.id;
        const userName = o.userName || o.email || 'Unknown';

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-4">
              <div class="font-bold">${userName}</div>
              <div class="text-xs text-slate-500">${o.email || ''}</div>
              <div class="text-[10px] text-slate-400">UID: ${o.userId || '-'}</div>
            </td>
            <td class="p-4">
              ${o.item?.gameName || '-'}<br>
              <span class="text-xs text-slate-500">${o.item?.planName || ''}</span>
            </td>
            <td class="p-4 font-mono select-all">${o.transId}</td>
            <td class="p-4 font-bold text-blue-600">₹${o.amount}</td>
            <td class="p-4">
              <span class="badge text-xs uppercase font-bold px-2 py-1 rounded ${
                o.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : o.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }">
                ${o.status}
              </span>
            </td>
            <td class="p-4">
              ${o.key
                ? `<div class="font-mono text-xs mb-1">${o.key}</div>`
                : `<div class="text-xs text-slate-400 mb-1">Not set</div>`}
              <button onclick="window.setKey('${id}')"
                      class="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600">
                Set / Edit Key
              </button>
            </td>
            <td class="p-4 flex gap-2">
              ${o.status === 'pending' ? `
                <button onclick="window.updateStatus('${id}', 'approved')" class="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                  <span class="material-icons text-sm">check</span>
                </button>
                <button onclick="window.updateStatus('${id}', 'rejected')" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                  <span class="material-icons text-sm">close</span>
                </button>
              ` : `<span class="text-slate-400 text-xs">Done</span>`}
            </td>
          </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="7" class="p-8 text-center text-slate-400">No orders.</td></tr>`;
    });
};

window.setKey = function (docId) {
  const key = prompt('Enter / update key for this order:');
  if (!key) return;

  db.collection('orders').doc(docId).update({ key })
    .then(() => alert('Key saved. User will see it in Profile.'))
    .catch(e => alert(e.message));
};

/* ---------- Update order status + 10% elite credit ---------- */

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

    alert("Status updated. User will see it.");
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
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

  db.collection('withdrawRequests')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      let html = '';
      snapshot.forEach(doc => {
        const w = doc.data();
        const id = doc.id;

        html += `
          <tr class="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <td class="p-4">
              <div class="font-bold">${w.email}</div>
              <div class="text-[11px] text-slate-400">ID: ${w.userId}</div>
            </td>
            <td class="p-4 font-bold text-blue-600">$${w.amountUSD.toFixed(2)}</td>
            <td class="p-4 text-xs whitespace-pre-line max-w-xs">${w.paymentMethod || '-'}</td>
            <td class="p-4">
              <span class="badge text-xs uppercase font-bold px-2 py-1 rounded ${
                w.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : w.status === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }">
                ${w.status}
              </span>
            </td>
            <td class="p-4 flex gap-2">
              ${w.status === 'pending' ? `
                <button onclick="window.handleWithdrawStatus('${id}', 'paid')" class="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                  <span class="material-icons text-sm">check</span>
                </button>
                <button onclick="window.handleWithdrawStatus('${id}', 'rejected')" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">
                  <span class="material-icons text-sm">close</span>
                </button>
              ` : `<span class="text-slate-400 text-xs">Done</span>`}
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

/* ---------- ELITE WALLETS (MANUAL CREDIT) ---------- */

window.loadEliteWallets = function () {
  const list = document.getElementById('elite-list');

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

window.AdminPage = AdminPage;
