function ProfilePage() {
    if (!window.currentUser) {
        window.router.navigateTo('/');
        return '';
    }

    setTimeout(() => loadUserOrders(), 100);

    return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
        
        <!-- User Info -->
        <div class="flex items-center gap-4 mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <img src="${window.currentUser.photoURL}" class="w-16 h-16 rounded-full border-2 border-blue-600">
            <div>
                <h1 class="text-2xl font-bold">${window.currentUser.displayName}</h1>
                <p class="text-slate-500 text-sm">${window.currentUser.email}</p>
                <button onclick="window.logout()" class="text-red-500 text-xs font-bold hover:underline mt-1">Logout</button>
            </div>
            ${window.isAdmin ? '<button onclick="window.router.navigateTo(\'/admin\')" class="ml-auto bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold">Admin Panel</button>' : ''}
        </div>

        <h2 class="text-xl font-bold mb-4 px-2">Order History</h2>
        <div id="order-list" class="space-y-4">
            <!-- Orders will load here -->
            <div class="text-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
        </div>
    </div>
    `;
}

window.loadUserOrders = function() {
    const list = document.getElementById('order-list');
    
    db.collection('orders')
      .where('userId', '==', window.currentUser.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
          if(snapshot.empty) {
              list.innerHTML = `<div class="text-center py-10 text-slate-400">No orders found.</div>`;
              return;
          }

          let html = '';
          snapshot.forEach(doc => {
              const order = doc.data();
              const statusColor = order.status === 'approved' ? 'bg-green-100 text-green-700' : (order.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700');
              const statusIcon = order.status === 'approved' ? 'check_circle' : (order.status === 'rejected' ? 'cancel' : 'schedule');

              html += `
              <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                      <div class="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
                          <img src="${order.item.image}" class="w-10 h-10 object-cover rounded">
                      </div>
                      <div>
                          <div class="font-bold text-lg">${order.item.gameName}</div>
                          <div class="text-xs text-slate-500">Plan: ${order.item.planName} • ₹${order.amount}</div>
                          <div class="text-[10px] font-mono text-slate-400 mt-1">UTR: ${order.transId}</div>
                      </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                      <span class="px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 ${statusColor}">
                          <span class="material-icons text-[14px]">${statusIcon}</span> ${order.status}
                      </span>
                      ${order.status === 'approved' ? `<button onclick="alert('Your Key: STARK-KEY-1234')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">Get Key</button>` : ''}
                  </div>
              </div>`;
          });
          list.innerHTML = html;
      });
};