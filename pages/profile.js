// pages/profile.js

// --- CONFIG ---
const MIN_WITHDRAW_USD = 5;
const SUPPORT_TELEGRAM_URL = 'https://t.me/imsergiomoreio';

function ProfilePage() {
  // 1. Auth Check - If neither cache nor Firebase is ready yet
  if (!window.authReady && !window.currentUser) {
    return `
      <div class="max-w-md mx-auto py-24 text-center animate-fade-in">
        <div class="apple-glass-card p-10">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Verifying your session...</p>
        </div>
      </div>`;
  }

  // 2. Not Logged In - Present clean Apple Glass Google Sign-In Card (No abrupt kick to home)
  if (!window.currentUser) {
    return `
      <div class="max-w-md mx-auto py-16 px-4 animate-fade-in text-center">
        <div class="apple-glass-card p-8 sm:p-10 border border-white/40 dark:border-white/10 shadow-2xl">
          <div class="w-18 h-18 mx-auto rounded-3xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center mb-6 border border-blue-500/20 p-4">
            <span class="material-icons text-4xl text-blue-600 dark:text-blue-400">person</span>
          </div>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Sign in to Stark Mods</h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Access your purchased mod keys, lifetime licenses, downloads, and custom orders in one place.
          </p>
          <button onclick="window.googleLogin()"
                  class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    `;
  }

  // 3. Load Data
  setTimeout(() => {
    window.loadUserOrders();
    if (window.isElite) {
      window.loadWalletInfo();
      window.loadWithdrawHistory();
    }
    if (window.loadCreatorSubForProfile) window.loadCreatorSubForProfile();
  }, 100);

  const isAdmin = !!window.isAdmin;
  const isElite = !!window.isElite;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20 px-4">
      <!-- HEADER -->
      <div class="apple-glass-card p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mt-4">
        <div class="flex items-center gap-4">
          <div class="relative">
            <img src="${window.currentUser.photoURL || 'assets/icons/default_user.png'}"
                 class="w-16 h-16 rounded-full border-2 border-white/60 dark:border-slate-700 object-cover shadow-sm"
                 onerror="this.src='/assets/icons/stark-32.png'">
            ${isElite ? '<div class="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm"><span class="material-icons text-[10px] block">verified</span></div>' : ''}
          </div>
          <div class="text-center sm:text-left">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start" id="profile-name-line">
              ${window.currentUser.displayName || 'Stark Member'}
            </h1>
            <p class="text-slate-500 text-sm">${window.currentUser.email}</p>
          </div>
        </div>

        <div class="flex flex-col gap-2 w-full sm:w-auto">
          <button onclick="window.logout()" class="text-red-500 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2 rounded-xl transition border border-red-200/50 dark:border-red-900/30">
            Logout
          </button>
          ${isAdmin ? `
            <div class="flex flex-col gap-1">
              <button onclick="window.router.navigateTo('/admin')" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow w-full">
                Orders Admin
              </button>
              <button onclick="window.router.navigateTo('/creator-admin')" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow w-full">
                Creator Admin
              </button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- ELITE WALLET (Hidden for normal users) -->
      ${isElite ? renderEliteWalletHTML() : ''}

      <!-- ORDERS SECTION -->
      <div class="flex items-center justify-between mb-4 px-1">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Order History</h2>
        <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tap to View Details</span>
      </div>
      
      <div id="order-list" class="space-y-4 min-h-[160px]">
        <div class="text-center py-10">
          <div class="apple-spinner mx-auto mb-2"></div>
          <p class="text-xs text-slate-400 font-medium">Loading orders...</p>
        </div>
      </div>
    </div>`;
}

// --- ORDER LOGIC ---

window.loadUserOrders = function () {
  const list = document.getElementById('order-list');
  if (!window.db || !list) return;

  window.db.collection('orders')
    .where('userId', '==', window.currentUser.uid)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `
          <div class="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <span class="material-icons text-4xl text-slate-300 mb-2">shopping_bag</span>
            <p class="text-slate-400 text-sm">No orders found.</p>
          </div>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();
        const docId = doc.id;
        const isSub = o.gameId && String(o.gameId).startsWith('sub_');
        
        // Dynamic Title & Image based on Game (WCC3, RC20, etc.)
        const title = isSub ? (o.item?.gameName || 'Subscription') : (o.item?.gameName || 'Unknown Item');
        const image = o.item?.image || 'assets/icons/icon_wcc3.png'; // Fallback image

        // Robust Price Calculation
        const priceVal = o.amount !== undefined ? o.amount : (o.paidAmount !== undefined ? o.paidAmount : (o.basePriceINR !== undefined ? o.basePriceINR : (o.item?.price !== undefined ? o.item.price : 0)));
        const currSymbol = o.paidCurrency === 'PKR' ? 'Rs ' : (o.paidCurrency === 'USD' || o.paidCurrency === 'USDT' ? '$' : '₹');

        // Status Styling
        let statusBadge = '';
        if (o.status === 'approved') {
          statusBadge = `<span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit"><span class="material-icons text-[10px]">check_circle</span> Active</span>`;
        } else if (o.status === 'rejected') {
          statusBadge = `<span class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit"><span class="material-icons text-[10px]">cancel</span> Rejected</span>`;
        } else {
          statusBadge = `<span class="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit"><span class="material-icons text-[10px]">hourglass_empty</span> Processing</span>`;
        }

        html += `
          <div onclick="window.openOrderDetails('${docId}')"
               class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all group">
            
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-600">
                 <img src="${image}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/56'">
              </div>
              <div>
                <div class="font-bold text-slate-900 dark:text-white text-sm sm:text-base">${title}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  ${o.item?.planName || 'Standard'} • ${currSymbol}${priceVal}
                </div>
                ${statusBadge}
              </div>
            </div>

            <div class="text-right">
              <span class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span class="material-icons text-lg">chevron_right</span>
              </span>
            </div>
          </div>`;
      });

      list.innerHTML = html;
    }, error => {
      console.error("DB Error:", error);
      list.innerHTML = `<div class="text-center text-red-500 py-4">Error loading orders.</div>`;
    });
};

// --- NEW NAVIGATION HELPER ---
window.openOrderDetails = function(orderId) {
  // Store ID for the next page to read
  window.currentViewingOrderId = orderId;
  window.router.navigateTo('/order-details');
};


// --- ELITE WALLET LOGIC (Unchanged) ---
function renderEliteWalletHTML() {
  return `
     <div class="glass p-6 mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700" id="wallet-card">
        <h2 class="text-lg font-bold mb-1 text-slate-900 dark:text-white">Team Wallet</h2>
        <p class="text-xs text-slate-500 mb-4">
          You earn 10% of each approved order. Min withdraw $${MIN_WITHDRAW_USD}.
        </p>

        <div class="flex flex-wrap gap-6 mb-4">
          <div>
            <div class="text-xs text-slate-500 uppercase">Available</div>
            <div class="text-2xl font-bold text-blue-600" id="wallet-balance">$0.00</div>
          </div>
          <div>
            <div class="text-xs text-slate-500 uppercase">Total Earned</div>
            <div class="text-lg font-semibold text-slate-800 dark:text-slate-100" id="wallet-earned">$0.00</div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Withdrawal Method</label>
          <textarea id="wallet-method-input" rows="2"
                    class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition text-slate-800 dark:text-slate-100"
                    placeholder="e.g. EasyPaisa 030..., Binance ID..."></textarea>
        </div>

        <div class="flex flex-wrap gap-3 items-center mb-4">
          <button onclick="window.savePaymentMethod()" class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg text-xs font-bold transition">
            Save Method
          </button>
          <button onclick="window.requestWithdrawal()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition">
            Request Withdraw
          </button>
          <span id="wallet-status-msg" class="text-xs text-slate-500"></span>
        </div>

        <div class="mt-6">
          <h3 class="text-sm font-bold mb-2 text-slate-800 dark:text-white">Withdrawal History</h3>
          <div id="withdraw-history" class="space-y-2 text-xs text-slate-500">
            <div class="text-slate-400 text-xs">Loading...</div>
          </div>
        </div>
      </div>
  `;
}

// Keep existing Wallet Helpers
window.loadWalletInfo = function () {
  const uid = window.currentUser.uid;
  if (!window.db) return;
  db.collection('wallets').doc(uid).onSnapshot(snap => {
    const data = snap.exists ? snap.data() : {};
    const balEl = document.getElementById('wallet-balance');
    const earnEl = document.getElementById('wallet-earned');
    const methodEl = document.getElementById('wallet-method-input');
    if (balEl) balEl.textContent = `$${(data.balanceUSD || 0).toFixed(2)}`;
    if (earnEl) earnEl.textContent = `$${(data.totalEarnedUSD || 0).toFixed(2)}`;
    if (methodEl && !methodEl.dataset.loaded) {
      methodEl.value = data.paymentMethod || '';
      methodEl.dataset.loaded = '1';
    }
  });
};

window.savePaymentMethod = async function () {
  const uid = window.currentUser.uid;
  const method = document.getElementById('wallet-method-input').value.trim();
  const msgEl = document.getElementById('wallet-status-msg');
  if (!method) { alert('Enter payment method.'); return; }
  try {
    await db.collection('wallets').doc(uid).set({
      userId: uid, email: window.currentUser.email, paymentMethod: method, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    if (msgEl) { msgEl.textContent = 'Saved.'; setTimeout(() => (msgEl.textContent = ''), 2000); }
  } catch (e) { alert(e.message); }
};

window.requestWithdrawal = async function () {
  const uid = window.currentUser.uid;
  const walletRef = db.collection('wallets').doc(uid);
  const msgEl = document.getElementById('wallet-status-msg');
  let amountUSD = 0, method = '';
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(walletRef);
      if (!snap.exists) throw new Error('No wallet.');
      const data = snap.data();
      const balance = data.balanceUSD || 0;
      method = data.paymentMethod || '';
      if (balance < MIN_WITHDRAW_USD) throw new Error(`Min withdraw $${MIN_WITHDRAW_USD}.`);
      if (!method) throw new Error('Set payment method.');
      amountUSD = Math.floor(balance * 100) / 100;
      const reqRef = db.collection('withdrawRequests').doc();
      tx.set(reqRef, {
        userId: uid, email: window.currentUser.email, amountUSD, paymentMethod: method, status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      tx.update(walletRef, { balanceUSD: balance - amountUSD, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    });
    if (msgEl) { msgEl.textContent = 'Requested.'; setTimeout(() => (msgEl.textContent = ''), 2000); }
  } catch (e) { alert(e.message); }
};

window.loadWithdrawHistory = function () {
  const uid = window.currentUser.uid;
  const container = document.getElementById('withdraw-history');
  if (!container || !window.db) return;
  db.collection('withdrawRequests').where('userId', '==', uid).orderBy('createdAt', 'desc').onSnapshot(snap => {
      if (snap.empty) { container.innerHTML = 'No withdrawals.'; return; }
      let html = '';
      snap.forEach(doc => {
        const w = doc.data();
        let color = w.status === 'paid' ? 'text-green-600' : (w.status === 'rejected' ? 'text-red-600' : 'text-yellow-600');
        html += `<div class="flex justify-between border-b border-slate-100 dark:border-slate-700 py-1"><span>$${w.amountUSD.toFixed(2)}</span><span class="${color} font-bold uppercase">${w.status}</span></div>`;
      });
      container.innerHTML = html;
    });
};

// Creator Sub Helper
window.loadCreatorSubForProfile = function () {
  if (!window.currentUser || !window.db) return;
  const uid = window.currentUser.uid;
  const nameEl = document.getElementById('profile-name-line');
  if (!nameEl) return;
  db.collection('creatorSubs').doc(uid).onSnapshot(snap => {
      const data = snap.exists ? snap.data() : null;
      let hasActive = false;
      if (data && data.status === 'active' && data.expiresAt && data.expiresAt.toDate) {
        hasActive = data.expiresAt.toDate().getTime() > Date.now();
      }
      if (hasActive && !nameEl.innerHTML.includes('workspace_premium')) {
        nameEl.innerHTML += ` <span class="material-icons text-purple-500 text-lg align-middle ml-1">workspace_premium</span>`;
      }
  });
};

window.ProfilePage = ProfilePage;
