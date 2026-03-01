// pages/orderDetails.js

(function() {
  // --- CONFIGURATION ---
  const GAME_CONFIG = {
    // RC20 CONFIGURATION
    'rc20': {
      videoId: 'fgJeFQKsZCs', // YouTube Short ID
      isShort: true,
      vPhoneLink: 'https://play.google.com/store/apps/details?id=com.yoyo.snake.rush',
      modLink: 'https://github.com/abnixsh/starkmods/releases/download/cr20v6.1/RC20.VIP.v6.1.Mod.apk',
      steps: [
        '<b>Download VPhoneGaGa</b> from the Play Store button above.',
        '<b>Download the Injector</b> from the blue button.',
        'Open VPhoneGaGa and create an <b>Android 7</b> ROM.',
        'Import the RC20 Injector into VPhoneGaGa.',
        'Open Injector, paste your Key, and start.'
      ]
    },
    // WCC3 CONFIGURATION
    'wcc3': {
      videoId: 'dQw4w9WgXcQ', 
      isShort: false,
      modLink: '#', 
      steps: [
        'Download Mod APK.',
        'Install on device.',
        'Enter Key and Play.'
      ]
    },
    // DEFAULT
    'default': {
      videoId: '',
      steps: ['Download, Install, Play.']
    }
  };

  function OrderDetailsPage() {
    const orderId = window.currentViewingOrderId;

    if (!window.currentUser) {
      setTimeout(() => window.router.navigateTo('/'), 100);
      return '';
    }

    if (!orderId) {
      return `
        <div class="max-w-md mx-auto text-center py-20">
          <p class="text-slate-500 mb-4">No order selected.</p>
          <button onclick="window.router.navigateTo('/profile')" class="bg-blue-600 text-white px-6 py-2 rounded-lg">Go Back</button>
        </div>`;
    }

    setTimeout(() => loadOrderDetails(orderId), 100);

    return `
      <div class="max-w-3xl mx-auto px-4 pb-24 animate-fade-in">
        <div class="flex items-center gap-4 py-6 mb-4">
          <button onclick="window.router.navigateTo('/profile')" class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
            <span class="material-icons">arrow_back</span>
          </button>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Order Details</h1>
        </div>
        <div id="order-detail-container">
          <div class="py-20 text-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    `;
  }

  function loadOrderDetails(orderId) {
    const container = document.getElementById('order-detail-container');
    if (!container || !window.db) return;

    window.db.collection('orders').doc(orderId).onSnapshot(doc => {
      if (!doc.exists) {
        container.innerHTML = '<div class="text-center text-red-500">Order not found.</div>';
        return;
      }
      renderOrderContent(container, doc.data(), doc.id);
    });
  }

  function renderOrderContent(container, order, docId) {
    const gameId = order.item?.gameId || 'default';
    const config = GAME_CONFIG[gameId] || GAME_CONFIG['default'];
    const isSub = String(gameId).startsWith('sub_');

    // 1. STATUS UI
    let statusHTML = '';
    if (order.status === 'pending') {
      statusHTML = `
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl text-center mb-8 border border-yellow-200">
          <h2 class="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">Verifying Payment</h2>
          <p class="text-sm text-slate-500">Checking ID: ${order.transId}</p>
        </div>`;
    } else if (order.status === 'rejected') {
      statusHTML = `
        <div class="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl text-center mb-8 border border-red-200">
          <h2 class="text-xl font-bold text-red-600 mb-2">Order Rejected</h2>
          <button onclick="window.open('https://t.me/imsergiomoreio')" class="bg-red-600 text-white px-6 py-2 rounded-lg text-sm mt-2">Contact Admin</button>
        </div>`;
    } else if (order.status === 'approved') {
      
      // DOWNLOAD BUTTONS
      const finalModLink = order.downloadUrl || config.modLink || '#';
      let downloadsHTML = '';
      
      if (gameId === 'rc20') {
        downloadsHTML = `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <a href="${config.vPhoneLink}" target="_blank" class="flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-green-500 p-4 rounded-2xl">
               <span class="material-icons text-green-600 text-3xl mb-2">android</span>
               <span class="font-bold text-slate-800 dark:text-white text-sm">1. Get VPhoneGaGa</span>
            </a>
            <a href="${finalModLink}" target="_blank" class="flex flex-col items-center justify-center bg-blue-600 text-white p-4 rounded-2xl shadow-lg">
               <span class="material-icons text-3xl mb-2">download</span>
               <span class="font-bold text-sm">2. Download Injector</span>
            </a>
          </div>`;
      } else {
        downloadsHTML = `
          <a href="${finalModLink}" target="_blank" class="block w-full bg-blue-600 text-white p-4 rounded-2xl text-center font-bold mb-8 shadow-lg">
            Download Mod APK
          </a>`;
      }

      // KEY & TUTORIAL
      statusHTML = `
        <div class="bg-green-50 dark:bg-green-900/20 text-green-700 p-3 rounded-xl mb-6 flex items-center gap-2 font-bold text-sm">
          <span class="material-icons">check_circle</span> Order Approved
        </div>

        <div class="bg-slate-900 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <p class="text-xs text-slate-400 uppercase font-bold mb-2">Your License Key</p>
          <div class="flex gap-2 bg-white/10 p-3 rounded-lg">
            <code class="text-yellow-400 font-mono text-lg flex-grow break-all select-all">${order.key || 'Loading...'}</code>
            <button onclick="navigator.clipboard.writeText('${order.key}')" class="text-white"><span class="material-icons">content_copy</span></button>
          </div>
        </div>

        <h3 class="font-bold text-slate-900 dark:text-white mb-4">Downloads</h3>
        ${downloadsHTML}

        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 font-bold">
            Installation Process
          </div>
          <div class="p-6">
            ${config.videoId ? `
              <div class="flex justify-center mb-6">
                <div class="${config.isShort ? 'w-[200px] aspect-[9/16]' : 'w-full aspect-video'} bg-black rounded-lg overflow-hidden shadow-lg">
                  <iframe class="w-full h-full" src="https://www.youtube.com/embed/${config.videoId}" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
            ` : ''}
            <div class="space-y-4">
              ${config.steps.map((step, i) => `<div class="flex gap-3"><span class="font-bold text-blue-500">${i+1}.</span><p class="text-sm text-slate-600 dark:text-slate-300">${step}</p></div>`).join('')}
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
        <img src="${order.item?.image || 'assets/icons/icon_wcc3.png'}" class="w-16 h-16 rounded-xl object-cover">
        <div>
          <h2 class="font-bold text-slate-900 dark:text-white">${order.item?.gameName}</h2>
          <div class="text-xs text-slate-500">Order #${docId}</div>
        </div>
      </div>
      ${statusHTML}
      <div class="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
        <button onclick="window.open('https://t.me/imsergiomoreio')" class="text-blue-500 font-bold text-sm">Contact Support</button>
      </div>
    `;
  }

  // EXPOSE TO WINDOW
  window.OrderDetailsPage = OrderDetailsPage;

})();
