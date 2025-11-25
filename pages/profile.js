oreio// Configure your download links per game ID
window.downloadLinks = {
  rc20: 'https://your-download-link.com/rc20.apk',
  wcc3: 'https://your-download-link.com/wcc3.apk',
  rc25: 'https://your-download-link.com/rc25.apk'
};

// Telegram or contact link for support
const SUPPORT_TELEGRAM_URL = 'https://t.me/imsergiomoreio'; // change to your username

function ProfilePage() {
  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/'), 100);
    return '';
  }

  // Load orders after render
  setTimeout(() => window.loadUserOrders(), 500);

  const isAdmin = !!window.isAdmin;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <img src="${window.currentUser.photoURL || '/assets/icons/default_user.png'}"
               class="w-16 h-16 rounded-full border-2 border-blue-600">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">${window.currentUser.displayName}</h1>
            <p class="text-slate-500 text-sm">${window.currentUser.email}</p>
            <button onclick="window.logout()" class="text-red-500 text-xs font-bold hover:underline mt-1">
              Logout
            </button>
          </div>
        </div>

        ${isAdmin ? `
          <button onclick="window.router.navigateTo('/admin')"
                  class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow">
            Admin Panel
          </button>
        ` : ''}
      </div>

      <h2 class="text-xl font-bold mb-4 px-1 text-slate-900 dark:text-white">Order History</h2>
      <div id="order-list" class="space-y-4 min-h-[200px]">
        <div class="text-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>`;
}

window.loadUserOrders = function () {
  const list = document.getElementById('order-list');
  if (!window.db) {
    list.innerHTML = `<div class="text-center text-red-500">Database not connected. Please refresh.</div>`;
    return;
  }

  window.db.collection('orders')
    .where('userId', '==', window.currentUser.uid)
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<div class="text-center py-10 text-slate-400">No orders found.</div>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();

        const statusBadge = o.status === 'approved'
          ? `<span class="text-green-600 font-bold flex items-center gap-1"><span class="material-icons text-sm">check_circle</span> Approved</span>`
          : o.status === 'rejected'
          ? `<span class="text-red-600 font-bold flex items-center gap-1"><span class="material-icons text-sm">cancel</span> Rejected</span>`
          : `<span class="text-yellow-600 font-bold flex items-center gap-1"><span class="material-icons text-sm">schedule</span> Pending</span>`;

        // Download button only when approved
        const dlLink = window.downloadLinks[o.item?.gameId];
        const downloadBtn = (o.status === 'approved' && dlLink)
          ? `<button onclick="window.downloadMod('${o.item.gameId}')"
                     class="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
               <span class="material-icons text-xs">download</span> Download Mod
             </button>`
          : '';

        // Key button (shows key if admin has set it)
        const keySection = (o.status === 'approved')
          ? (o.key
              ? `<button onclick="window.showKey('${o.key}')"
                        class="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                   <span class="material-icons text-xs">vpn_key</span> Get Key
                 </button>`
              : `<div class="mt-2 text-[11px] text-slate-400">Key will be added soon. Please wait or contact support.</div>`)
          : '';

        const contactBtn = `
          <button onclick="window.contactSupport('${o.transId || ''}')"
                  class="mt-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
            <span class="material-icons text-xs">support_agent</span> Contact Admin
          </button>`;

        html += `
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-start gap-4">
            <div>
              <div class="font-bold text-slate-900 dark:text-white">${o.item?.gameName || 'Unknown Item'}</div>
              <div class="text-xs text-slate-500">
                Plan: ${o.item?.planName || '-'} | ₹${o.amount}
              </div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">
                Order: ${o.orderId || '-'} · UTR: ${o.transId}
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                ${downloadBtn}
                ${keySection}
                ${contactBtn}
              </div>
            </div>
            <div class="text-right">
              ${statusBadge}
            </div>
          </div>`;
      });

      list.innerHTML = html;
    }, error => {
      console.error("DB Error:", error);
      list.innerHTML = `<div class="text-center text-red-500">Error loading orders.</div>`;
    });
};

// Helpers exposed globally

window.downloadMod = function (gameId) {
  const link = window.downloadLinks[gameId];
  if (!link) {
    alert('Download link not configured for this game. Please contact support.');
    return;
  }
  window.open(link, '_blank');
};

window.showKey = function (key) {
  // Simple alert + copy to clipboard
  navigator.clipboard?.writeText(key).catch(() => {});
  alert('Your key: ' + key + '\\n\\n(We copied it to your clipboard if permissions allowed.)');
};

window.contactSupport = function (utr) {
  // Open Telegram support – you can also add the UTR in the URL if you like
  window.open(https://t.me/imsergiomoreio, '_blank');
};

window.ProfilePage = ProfilePage;
