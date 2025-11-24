function ProfilePage() {
    if (!window.currentUser) {
        window.router.navigateTo('/');
        return '';
    }

    setTimeout(() => loadUserOrders(), 100);

    return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
        
        <!-- Header -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
            <img src="${window.currentUser.photoURL || 'https://ui-avatars.com/api/?name='+window.currentUser.displayName}" class="w-16 h-16 rounded-full border-2 border-blue-600">
            <div class="text-center sm:text-left">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">${window.currentUser.displayName}</h1>
                <p class="text-slate-500 text-sm">${window.currentUser.email}</p>
                <button onclick="window.logout()" class="text-red-500 text-xs font-bold hover:underline mt-2 block mx-auto sm:mx-0">Logout</button>
            </div>
            ${window.isAdmin ? `<button onclick="window.router.navigateTo('/admin')" class="mt-4 sm:mt-0 sm:ml-auto bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg">Admin Panel</button>` : ''}
        </div>

        <h2 class="text-xl font-bold mb-4 px-1 text-slate-800 dark:text-white">My Orders</h2>
        
        <div id="order-list" class="space-y-4 min-h-[200px]">
            <div class="text-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
        </div>
    </div>
    `;
}

window.loadUserOrders = function() {
    const list = document.getElementById('order-list');
    
    if(!db) {
        list.innerHTML = `<div class="text-center py-10 text-red-500">Firebase Database Error</div>`;
        return;
    }

    db.collection('orders')
      .where('userId', '==', window.currentUser.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
          if(snapshot.empty) {
              list.innerHTML = `<div class="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">No orders found.</div>`;
              return;
          }

          let html = '';
          snapshot.forEach(doc => {
              const o = doc.data();
              
              // Status Badge Logic
              let statusBadge = '';
              if(o.status === 'approved') {
                  statusBadge = `<span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><span class="material-icons text-[14px]">check_circle</span> Confirmed</span>`;
              } else if (o.status === 'rejected') {
                  statusBadge = `<span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><span class="material-icons text-[14px]">cancel</span> Rejected</span>`;
              } else {
                  statusBadge = `<span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><span class="material-icons text-[14px]">schedule</span> Pending</span>`;
              }

              // Fallback image if product logic changed
              const itemImg = o.item.image || 'assets/icons/icon_site.jpg';

              html += `
              <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition hover:border-blue-300">
                  <div class="flex items-center gap-4">
                      <div class="bg-slate-100 dark:bg-slate-900 p-2 rounded-lg">
                          <img src="${itemImg}" class="w-12 h-12 object-cover rounded" onerror="this.src='assets/icons/icon_site.jpg'">
                      </div>
                      <div>
                          <div class="font-bold text-lg text-slate-900 dark:text-white">${o.item.gameName}</div>
                          <div class="text-xs text-slate-500">${o.item.planName} • <span class="font-mono text-blue-600 font-bold">₹${o.amount}</span></div>
                          <div class="text-[10px] text-slate-400 mt-1 font-mono">ID: #${o.orderId} | UTR: ${o.transId}</div>
                      </div>
                  </div>
                  
                  <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
                      ${statusBadge}
                      ${o.status === 'approved' ? `<button onclick="window.open('https://t.me/AbnixSH', '_blank')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg hover:bg-blue-700 transition">Get Key</button>` : ''}
                  </div>
              </div>`;
          });
          list.innerHTML = html;
      });
};

// Register for Router
window.ProfilePage = ProfilePage;
