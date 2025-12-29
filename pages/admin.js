// pages/admin.js

// --- CONFIG ---
const INR_PER_USD = 90;
const COMMISSION_RATE = 0.10; // 10%
const STANDARD_LINKS = {
  'rc24': 'https://drive.google.com/your-rc24-link',
  'rc20': 'https://drive.google.com/your-rc20-link',
  'wcc3': 'https://drive.google.com/your-wcc3-link',
};

// State variables
window.ordersSummaryByUser = {};
window.adminSelectedOrderUserId = null;
window.adminSelectedOrderUserEmail = null;
window.ordersUnsub = null;
window.currentUserOrdersUnsub = null;

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
          <button onclick="window.router.navigateTo('/admin-orders')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition">
            <span class="font-bold text-sm block mb-1">Orders (Normal)</span>
            <span class="text-[10px] text-slate-500">Manage game sales</span>
          </button>
          <button onclick="window.router.navigateTo('/admin-sub-orders')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition">
            <span class="font-bold text-sm block mb-1">Subscription Orders</span>
            <span class="text-[10px] text-slate-500">Creator plan payments</span>
          </button>
          <button onclick="window.router.navigateTo('/admin-elite-wallets')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition">
            <span class="font-bold text-sm block mb-1">Elite Wallets</span>
            <span class="text-[10px] text-slate-500">Team earnings</span>
          </button>
          <button onclick="window.router.navigateTo('/creator-admin')" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left hover:bg-slate-50 transition">
            <span class="font-bold text-sm block mb-1">Creator Admin</span>
            <span class="text-[10px] text-slate-500">Requests & Plans</span>
          </button>
        </div>
      </section>
    </div>
  `;
}

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
        <h1 class="text-2xl font-bold">${title}</h1>
        <button onclick="window.router.navigateTo('/admin')" class="text-xs bg-slate-200 px-3 py-1 rounded font-bold">Back</button>
      </div>
      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-3">User</th><th class="p-3">Total</th><th class="p-3">Approved</th>
              <th class="p-3">Pending</th><th class="p-3">Rejected</th><th class="p-3">Last</th><th class="p-3">Actions</th>
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
      if (snapshot.empty) { list.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders.</td></tr>`; return; }
      const byUser = {};
      snapshot.forEach(doc => {
        const o = doc.data();
        const uid = o.userId || 'unknown';
        const isSub = o.gameId && String(o.gameId).startsWith('sub_');
        if (subOnly && !isSub) return;
        if (!subOnly && isSub) return;
        
        if (!byUser[uid]) byUser[uid] = { userId: uid, email: o.email, total: 0, approved: 0, pending: 0, rejected: 0, last: 0 };
        const u = byUser[uid];
        u.total++;
        if (o.status === 'approved') u.approved++; else if (o.status === 'rejected') u.rejected++; else u.pending++;
        const ts = o.timestamp ? o.timestamp.toDate().getTime() : 0;
        if (ts > u.last) u.last = ts;
      });

      const usersArr = Object.values(byUser).sort((a, b) => b.last - a.last);
      let html = '';
      usersArr.forEach(u => {
        html += `<tr class="border-b border-slate-100 hover:bg-slate-50 transition">
          <td class="p-3 font-bold">${u.email}</td><td class="p-3">${u.total}</td><td class="p-3 text-green-600">${u.approved}</td>
          <td class="p-3 text-amber-600 font-bold">${u.pending}</td><td class="p-3 text-red-600">${u.rejected}</td>
          <td class="p-3 text-xs">${new Date(u.last).toLocaleDateString()}</td>
          <td class="p-3"><button onclick="window.viewUserOrders('${u.userId}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs">View</button></td>
        </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="7" class="p-6 text-center text-slate-400">No orders.</td></tr>`;
  });
};

window.viewUserOrders = function (userId) {
  window.adminSelectedOrderUserId = userId;
  if (window.router) window.router.navigateTo('/admin-user-orders');
};

function AdminUserOrdersPage() {
  if (!window.isAdmin) { window.router.navigateTo('/'); return ''; }
  if (!window.adminSelectedOrderUserId) { window.router.navigateTo('/admin-orders'); return ''; }
  setTimeout(window.loadAdminUserOrders, 100);
  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">User Orders</h1>
        <button onclick="window.history.back()" class="text-xs bg-slate-200 px-3 py-1 rounded font-bold">Back</button>
      </div>
      <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr><th class="p-3">Item</th><th class="p-3">UTR</th><th class="p-3">Amount</th><th class="p-3">Status</th><th class="p-3">Key</th><th class="p-3">Actions</th></tr>
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
        let actions = '';
        
        if(o.status === 'pending') {
            actions = `
              <button onclick="window.updateStatus('${id}', 'approved')" class="bg-green-600 text-white p-2 rounded mr-1"><span class="material-icons text-sm">check</span></button>
              <button onclick="window.updateStatus('${id}', 'rejected')" class="bg-red-500 text-white p-2 rounded"><span class="material-icons text-sm">close</span></button>
            `;
        } else {
            actions = `<button onclick="window.setKey('${id}')" class="bg-slate-200 text-xs px-2 py-1 rounded mr-1">Edit Key</button>`;
            
            // NEW: Delete button if rejected
            if(o.status === 'rejected') {
                actions += `<button onclick="window.deleteOrder('${id}')" class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded border border-red-200">Delete</button>`;
            }
        }

        html += `<tr class="border-b border-slate-100 hover:bg-slate-50 transition">
          <td class="p-3 font-bold">${o.item?.gameName}</td>
          <td class="p-3 font-mono text-xs">${o.transId}</td>
          <td class="p-3 font-bold text-blue-600">₹${o.amount}</td>
          <td class="p-3"><span class="badge text-xs uppercase font-bold px-2 py-1 rounded bg-slate-100">${o.status}</span></td>
          <td class="p-3 text-xs">${o.key ? 'Key Set' : 'No Key'}</td>
          <td class="p-3">${actions}</td>
        </tr>`;
      });
      list.innerHTML = html || `<tr><td colspan="6" class="p-6 text-center text-slate-400">No orders.</td></tr>`;
  });
};

window.updateStatus = async function (docId, status) {
  if (!confirm(`Mark order as ${status}?`)) return;
  try {
    const orderRef = db.collection('orders').doc(docId);
    let updateData = { status };
    if (status === 'approved') {
      const link = prompt("Enter Download Link:");
      if (link) updateData.downloadUrl = link;
    }
    await orderRef.update(updateData);
    alert('Updated.');
  } catch (e) { alert(e.message); }
};

window.deleteOrder = function(docId) {
    if(!confirm("Permanently delete this rejected order?")) return;
    db.collection('orders').doc(docId).delete().then(() => alert("Deleted.")).catch(e => alert(e.message));
};

window.setKey = function (docId) {
  const key = prompt('Enter key:');
  if (key) db.collection('orders').doc(docId).update({ key });
};

// ... (Keep AdminEliteWalletsPage and exports as is) ...
window.AdminPage = AdminPage;
window.AdminOrdersPage = AdminOrdersPage;
window.AdminSubOrdersPage = AdminSubOrdersPage;
window.AdminUserOrdersPage = AdminUserOrdersPage;
// window.AdminEliteWalletsPage = AdminEliteWalletsPage; (Make sure to include Elite logic if you used it)
