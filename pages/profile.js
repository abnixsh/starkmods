// pages/profile.js

// ---------- CONFIG ----------
window.downloadLinks = {
  rc20:   'https://your-download-link.com/rc20.apk',
  rc24:   'https://your-download-link.com/rc24.apk',
  rcswipe:'https://your-download-link.com/rcswipe.apk',
  wcc3:   'https://your-download-link.com/wcc3.apk',
  wcc2:   'https://your-download-link.com/wcc2.apk',
  rc25:   'https://your-download-link.com/rc25.apk'
};

const SUPPORT_TELEGRAM_URL = 'https://t.me/imsergiomoreio'; // CHANGE
const MIN_WITHDRAW_USD = 5;
// -----------------------------------------

function ProfilePage() {
  if (!window.authReady) {
    return `
      <div class="max-w-4xl mx-auto py-20 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-slate-500">Checking login...</p>
      </div>`;
  }

  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/'), 50);
    return '';
  }

  // load data after render
  setTimeout(() => {
    window.loadUserOrders();
    if (window.isElite) {
      window.loadWalletInfo();
      window.loadWithdrawHistory();
    }
    if (window.loadCreatorSubForProfile) window.loadCreatorSubForProfile();
  }, 300);

  const isAdmin = !!window.isAdmin;
  const isElite = !!window.isElite;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img src="${window.currentUser.photoURL || '/assets/icons/default_user.png'}"
               class="w-16 h-16 rounded-full border-2 border-blue-600">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white" id="profile-name-line">
              ${window.currentUser.displayName}
            </h1>
            <p class="text-slate-500 text-sm">${window.currentUser.email}</p>
            <button onclick="window.logout()" class="text-red-500 text-xs font-bold hover:underline mt-1">
              Logout
            </button>
          </div>
        </div>

        ${isAdmin ? `
          <div class="flex flex-col gap-2 items-end">
            <button onclick="window.router.navigateTo('/admin')"
                    class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow w-full">
              Orders Admin
            </button>
            <button onclick="window.router.navigateTo('/creator-admin')"
                    class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow w-full">
              Mod Creator Admin
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Elite wallet -->
      ${isElite ? `
     <div class="glass p-6 mb-8" id="wallet-card">
        <h2 class="text-lg font-bold mb-1">Team Wallet</h2>
        <p class="text-xs text-slate-500 mb-4">
          You earn 10% of each approved order you handle. Minimum withdrawal $${MIN_WITHDRAW_USD}.
        </p>

        <div class="flex flex-wrap gap-6 mb-4">
          <div>
            <div class="text-xs text-slate-500 uppercase">Available Balance</div>
            <div class="text-2xl font-bold text-blue-600" id="wallet-balance">$0.00</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase">Total Earned</div>
            <div class="text-lg font-semibold text-slate-800 dark:text-slate-100" id="wallet-earned">$0.00</div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">
            Payment Method (How you get paid)
          </label>
          <textarea id="wallet-method-input" rows="3"
                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition text-slate-800 dark:text-slate-100"
                    placeholder="Example: EasyPaisa 0304..., Bank details, Binance ID, etc."></textarea>
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-4">
          <button onclick="window.savePaymentMethod()"
                  class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg text-xs font-bold">
            Save Payment Method
          </button>
          <button onclick="window.requestWithdrawal()"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold">
            Request Withdrawal
          </button>
          <span id="wallet-status-msg" class="text-xs text-slate-500"></span>
        </div>

        <div class="mt-4 text-[11px] text-slate-400">
          After you request withdrawal, it can take <span class="font-semibold text-slate-500">24–48 hours</span> to process.
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-bold mb-2">Withdrawal History</h3>
          <div id="withdraw-history" class="space-y-2 text-xs text-slate-500">
            <div class="text-slate-400 text-xs">Loading...</div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Orders -->
      <h2 class="text-xl font-bold mb-4 px-1 text-slate-900 dark:text-white">Order History</h2>
      <div id="order-list" class="space-y-4 min-h-[200px]">
        <div class="text-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>`;
}

/* ---------- Wallet functions (elite only) ---------- */

window.loadWalletInfo = function () {
  const uid = window.currentUser.uid;
  const card = document.getElementById('wallet-card');
  if (!card || !window.db) return;

  db.collection('wallets').doc(uid).onSnapshot(snap => {
    const data = snap.exists ? snap.data() : {};
    const bal = data.balanceUSD || 0;
    const earned = data.totalEarnedUSD || 0;
    const method = data.paymentMethod || '';

    const balEl = document.getElementById('wallet-balance');
    const earnEl = document.getElementById('wallet-earned');
    const methodEl = document.getElementById('wallet-method-input');

    if (balEl) balEl.textContent = `$${bal.toFixed(2)}`;
    if (earnEl) earnEl.textContent = `$${earned.toFixed(2)}`;
    if (methodEl && !methodEl.dataset.loaded) {
      methodEl.value = method;
      methodEl.dataset.loaded = '1';
    }
  });
};

window.savePaymentMethod = async function () {
  const uid = window.currentUser.uid;
  const method = document.getElementById('wallet-method-input').value.trim();
  const msgEl = document.getElementById('wallet-status-msg');

  if (!method) {
    alert('Please enter a payment method.');
    return;
  }

  try {
    await db.collection('wallets').doc(uid).set({
      userId: uid,
      email: window.currentUser.email,
      paymentMethod: method,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    if (msgEl) {
      msgEl.textContent = 'Payment method saved.';
      setTimeout(() => (msgEl.textContent = ''), 2000);
    }
  } catch (e) {
    alert(e.message);
  }
};

window.requestWithdrawal = async function () {
  if (!window.isElite) return;

  const uid = window.currentUser.uid;
  const walletRef = db.collection('wallets').doc(uid);
  const msgEl = document.getElementById('wallet-status-msg');

  let amountUSD = 0;
  let method = '';

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(walletRef);
      if (!snap.exists) throw new Error('No wallet yet.');
      const data = snap.data();
      const balance = data.balanceUSD || 0;
      method = data.paymentMethod || '';

      if (balance < MIN_WITHDRAW_USD) {
        throw new Error(`Minimum withdrawal is $${MIN_WITHDRAW_USD.toFixed(2)}. You have $${balance.toFixed(2)}.`);
      }
      if (!method) {
        throw new Error('Please set your payment method first.');
      }

      amountUSD = Math.floor(balance * 100) / 100;

      const reqRef = db.collection('withdrawRequests').doc();
      tx.set(reqRef, {
        userId: uid,
        email: window.currentUser.email,
        amountUSD,
        paymentMethod: method,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      tx.update(walletRef, {
        balanceUSD: balance - amountUSD,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    // Notify Telegram
    try {
      await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: window.currentUser.uid,
          email: window.currentUser.email,
          amountUSD,
          paymentMethod: method
        })
      });
    } catch (e) {
      console.warn('Telegram withdraw notify failed:', e);
    }

    alert('Your withdrawal request has been sent.\nIt will take 24–48 hours to process.');
    if (msgEl) {
      msgEl.textContent = 'Withdrawal requested (24–48 hrs).';
      setTimeout(() => (msgEl.textContent = ''), 4000);
    }
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
};

/* ---------- Withdrawal history for elite ---------- */

window.loadWithdrawHistory = function () {
  const uid = window.currentUser.uid;
  const container = document.getElementById('withdraw-history');
  if (!container || !window.db) return;

  db.collection('withdrawRequests')
    .where('userId', '==', uid)
    .orderBy('createdAt', 'desc') // may require index: userId asc, createdAt desc
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = `<div class="text-slate-400 text-xs">No withdrawals yet.</div>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const w = doc.data();
        const t = w.createdAt && w.createdAt.toDate ? w.createdAt.toDate() : null;
        const dateStr = t ? t.toLocaleString() : '';

        let badgeClass = 'bg-yellow-100 text-yellow-700';
        if (w.status === 'paid') badgeClass = 'bg-green-100 text-green-700';
        if (w.status === 'rejected') badgeClass = 'bg-red-100 text-red-700';

        html += `
          <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
            <div>
              <div class="font-semibold text-slate-800 dark:text-slate-100">$${w.amountUSD.toFixed(2)}</div>
              <div class="text-[11px] text-slate-400">${dateStr}</div>
            </div>
            <span class="badge ${badgeClass} text-[10px] uppercase font-bold">
              ${w.status}
            </span>
          </div>`;
      });

      container.innerHTML = html;
    }, error => {
      console.error('Withdraw history error:', error);
      container.innerHTML = `<div class="text-red-500 text-xs">Error loading withdrawals.</div>`;
    });
};

/* ---------- Creator sub crown on profile ---------- */

window.loadCreatorSubForProfile = function () {
  if (!window.currentUser || !window.db) return;

  const uid = window.currentUser.uid;
  const nameEl = document.getElementById('profile-name-line');
  if (!nameEl) return;

  db.collection('creatorSubs').doc(uid)
    .onSnapshot(snap => {
      const data = snap.exists ? snap.data() : null;
      let hasActive = false;

      if (data && data.status === 'active' && data.expiresAt && data.expiresAt.toDate) {
        const t = data.expiresAt.toDate().getTime();
        hasActive = t > Date.now();
      }

      if (hasActive) {
        nameEl.innerHTML = `
          ${window.currentUser.displayName}
          <span class="material-icons text-amber-400 text-base align-middle ml-1">workspace_premium</span>
        `;
      } else {
        nameEl.textContent = window.currentUser.displayName;
      }
    });
};

/* ---------- Orders (with download + key) ---------- */

window.loadUserOrders = function () {
  const list = document.getElementById('order-list');
  if (!window.db) {
    list.innerHTML = `<div class="text-center text-red-500">Database not connected. Please refresh.</div>`;
    return;
  }

  window.db.collection('orders')
    .where('userId', '==', window.currentUser.uid)
    .orderBy('timestamp', 'desc') // index: userId asc, timestamp desc
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<div class="text-center py-10 text-slate-400">No orders found.</div>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();

        // Status badge
        let statusBadge =
          o.status === 'approved'
            ? `<span class="text-green-600 font-bold flex items-center justify-end gap-1"><span class="material-icons text-sm">check_circle</span> Approved</span>`
            : o.status === 'rejected'
            ? `<span class="text-red-600 font-bold flex items-center justify-end gap-1"><span class="material-icons text-sm">cancel</span> Rejected</span>`
            : `<span class="text-yellow-600 font-bold flex items-center justify-end gap-1"><span class="material-icons text-sm">schedule</span> Pending</span>`;

        const isSub = o.gameId && String(o.gameId).startsWith('sub_');
        const title = isSub ? (o.item?.gameName || 'Subscription') : (o.item?.gameName || 'Unknown Item');
        const planLabel = o.item?.planName || (isSub ? 'Subscription Plan' : '-');

        // ACTION BUTTONS (download + key) for approved normal orders
        let actionsHtml = '';
        if (!isSub && o.status === 'approved') {
          const gameId = o.gameId || '';          // e.g. 'rc20'
          const baseLink = window.downloadLinks && window.downloadLinks[gameId];

          if (baseLink) {
            actionsHtml += `
              <button onclick="window.downloadMod('${gameId}')"
                      class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1">
                <span class="material-icons text-xs">download</span> Download
              </button>`;
          }

          if (o.key) {
            const safeKey = String(o.key).replace(/'/g, "\\'");
            actionsHtml += `
              <button onclick="window.showKey('${safeKey}')"
                      class="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-1">
                <span class="material-icons text-xs">vpn_key</span> Show Key
              </button>`;
          }

          if (!actionsHtml) {
            actionsHtml = `<span class="text-[10px] text-slate-400 mt-1 block">No download link/key configured for this order.</span>`;
          } else {
            actionsHtml = `<div class="mt-2 flex flex-wrap justify-end gap-2">${actionsHtml}</div>`;
          }
        }

        html += `
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-start gap-4">
            <div>
              <div class="font-bold text-slate-900 dark:text-white">${title}</div>
              <div class="text-xs text-slate-500">
                Plan: ${planLabel} | ₹${o.amount}
              </div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">
                Order: ${o.orderId || '-'} · UTR: ${o.transId || '-'}
              </div>
            </div>
            <div class="text-right">
              ${statusBadge}
              ${actionsHtml}
            </div>
          </div>`;
      });

      list.innerHTML = html;
    }, error => {
      console.error("DB Error:", error);
      list.innerHTML = `<div class="text-center text-red-500">Error loading orders.</div>`;
    });
};

/* ---------- Helpers ---------- */

window.downloadMod = function (gameId) {
  const link = window.downloadLinks[gameId];
  if (!link) {
    alert('Download link not configured for this game. Please contact support.');
    return;
  }
  window.open(link, '_blank');
};

window.showKey = function (key) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(key).catch(() => {});
  }
  alert('Your key: ' + key + '\n\n(If allowed, it was copied to your clipboard.)');
};

window.contactSupport = function () {
  window.open(SUPPORT_TELEGRAM_URL, '_blank');
};

window.ProfilePage = ProfilePage;
