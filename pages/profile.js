// pages/profile.js

function ProfilePage() {
  // If not logged in, send to home
  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/'), 100);
    return '';
  }

  // Load orders
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
            <button onclick="window.logout()"
                    class="text-red-500 text-xs font-bold hover:underline mt-1">
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
    .orderBy('timestamp', 'desc')        // or 'createdAt' if you used that
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        list.innerHTML = `<div class="text-center py-10 text-slate-400">No orders found.</div>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const o = doc.data();

        let statusBadge = o.status === 'approved'
          ? `<span class="text-green-600 font-bold flex items-center gap-1"><span class="material-icons text-sm">check_circle</span> Approved</span>`
          : `<span class="text-yellow-600 font-bold flex items-center gap-1"><span class="material-icons text-sm">schedule</span> Pending</span>`;

        html += `
          <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <div class="font-bold text-slate-900 dark:text-white">${o.item.gameName}</div>
              <div class="text-xs text-slate-500">Plan: ${o.item.planName} | ₹${o.amount}</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">UTR: ${o.transId}</div>
            </div>
            <div class="text-right">
              ${statusBadge}
              ${o.status === 'approved'
                ? `<button onclick="window.open('https://t.me/AbnixSH')" class="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs">Get Key</button>`
                : ''}
            </div>
          </div>`;
      });
      list.innerHTML = html;
    }, error => {
      console.error("DB Error:", error);
      list.innerHTML = `<div class="text-center text-red-500">Error loading orders.</div>`;
    });
};

// Router registration
window.ProfilePage = ProfilePage;
