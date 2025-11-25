function AdminPage() {
  if (!window.isAdmin) {
    window.router.navigateTo('/');
    return '';
  }

  setTimeout(() => window.loadAllOrders(), 100);

  return `
    <div class="max-w-6xl mx-auto animate-fade-in pb-20">
      <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

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
    </div>
  `;
}

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
              <div class="text-[10px] text-slate-400">ID: ${o.userId || '-'}</div>
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

window.updateStatus = function (docId, status) {
  if (!confirm(`Mark order as ${status}?`)) return;

  db.collection('orders').doc(docId).update({ status })
    .then(() => alert("Status updated. User will see it in Profile."))
    .catch(e => alert(e.message));
};

window.setKey = function (docId) {
  const key = prompt('Enter / update key for this order:');
  if (!key) return;

  db.collection('orders').doc(docId).update({ key })
    .then(() => alert('Key saved. User will see it in Profile.'))
    .catch(e => alert(e.message));
};

window.AdminPage = AdminPage;
