// pages/orderDetails.js

(function() {
  // --- CONFIGURATION ---
  const GAME_CONFIG = {
    // --- RC20 CONFIGURATION ---
    'rc20': {
      videoId: 'fgJeFQKsZCs', // YouTube Short ID
      isShort: true, // Vertical Layout
      
      // DIRECT LINKS (Hardcoded to prevent DB errors)
      vPhoneLink: 'https://play.google.com/store/apps/details?id=com.yoyo.snake.rush',
      modLink: 'https://github.com/abnixsh/starkmods/releases/download/cr20v6.1/RC20.VIP.v6.1.Mod.apk',
      
      steps: [
        '<b>Step 1:</b> Download <b>VPhoneGaGa</b> from the Play Store button.',
        '<b>Step 2:</b> Download the <b>RC20 Injector</b> from the blue button.',
        '<b>Step 3:</b> Open VPhoneGaGa, go to settings, and create an <b>Android 7 (64-bit)</b> ROM.',
        '<b>Step 4:</b> Inside VPhoneGaGa, click "File Transfer" > "Import" and select the <b>RC20 Injector</b>.',
        '<b>Step 5:</b> Open the Injector, paste your Key, and click Login.'
      ]
    },

    // --- WCC3 CONFIGURATION ---
    'wcc3': {
      videoId: 'dQw4w9WgXcQ', 
      isShort: false,
      modLink: '#', // Will use Admin DB link
      steps: [
        'Download the Mod APK.',
        'Install it on your device.',
        'Open the game, grant permissions, and paste the Key.'
      ]
    },

    // --- DEFAULT ---
    'default': {
      videoId: '',
      steps: ['Download APK.', 'Install.', 'Enter Key.']
    }
  };

  function OrderDetailsPage() {
    const orderId = window.currentViewingOrderId;

    // Security & State Checks
    if (!window.currentUser) {
      setTimeout(() => window.router.navigateTo('/'), 100);
      return '';
    }

    if (!orderId) {
      return `
        <div class="max-w-md mx-auto text-center py-20 animate-fade-in">
          <p class="text-slate-500 mb-4">No order selected.</p>
          <button onclick="window.router.navigateTo('/profile')" class="bg-slate-200 px-6 py-2 rounded-lg font-bold text-sm">Go Back</button>
        </div>`;
    }

    // Load Data
    setTimeout(() => loadOrderDetails(orderId), 100);

    return `
      <div class="max-w-3xl mx-auto px-4 pb-24 animate-fade-in">
        <!-- Header -->
        <div class="flex items-center gap-4 py-6 mb-4">
          <button onclick="window.router.navigateTo('/profile')" 
                  class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition">
            <span class="material-icons text-slate-600 dark:text-slate-300">arrow_back</span>
          </button>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Order Details</h1>
        </div>

        <!-- Content Loader -->
        <div id="order-detail-container">
          <div class="py-20 text-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-slate-500 text-sm">Loading order...</p>
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

    // 1. STATUS HEADER UI
    let statusHTML = '';

    if (order.status === 'pending') {
      statusHTML = `
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-2xl p-6 text-center mb-8">
          <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
             <span class="material-icons text-2xl text-yellow-600 dark:text-yellow-400">hourglass_empty</span>
          </div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Verifying Payment</h2>
          <p class="text-xs text-slate-500 mb-2">ID: ${order.transId}</p>
          <p class="text-xs text-slate-400">Please wait 10-30 minutes for approval.</p>
        </div>`;
    } 
    else if (order.status === 'rejected') {
      statusHTML = `
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center mb-8">
          <span class="material-icons text-3xl text-red-500 mb-2">block</span>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Order Rejected</h2>
          <p class="text-xs text-slate-500 mb-4">Transaction ID invalid.</p>
          <button onclick="window.contactSupportWithId('${docId}')" class="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Contact Support</button>
        </div>`;
    } 
    else if (order.status === 'approved') {
      
      // --- DOWNLOAD BUTTONS LOGIC ---
      let downloadsHTML = '';

      if (gameId === 'rc20') {
        // FORCE RC20 LINKS FROM CONFIG (Ignore Database URL to prevent errors)
        const vPhoneUrl = config.vPhoneLink;
        const modUrl = config.modLink; 

        downloadsHTML = `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <!-- 1. VPhoneGaGa -->
            <a href="${vPhoneUrl}" target="_blank"
               class="group flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-green-500/30 p-4 rounded-2xl hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10 transition-all">
               <div class="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span class="material-icons text-green-600 dark:text-green-400">android</span>
               </div>
               <span class="font-bold text-slate-900 dark:text-white text-sm">1. Get VPhoneGaGa</span>
               <span class="text-[10px] text-slate-500 mt-1">Play Store</span>
            </a>

            <!-- 2. Injector (GitHub) -->
            <a href="${modUrl}" target="_blank"
               class="group flex flex-col items-center justify-center bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
               <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span class="material-icons">download</span>
               </div>
               <span class="font-bold text-white text-sm">2. Download Injector</span>
               <span class="text-[10px] text-blue-100 mt-1">Auto-Start Download</span>
            </a>
          </div>
        `;
      } else {
        // STANDARD (WCC3, etc.) - Use DB link, fallback to Config
        let finalLink = order.downloadUrl || config.modLink || '#';
        // Fix relative link issue if Admin entered "t.me/..." without https
        if (finalLink && !finalLink.startsWith('http') && !finalLink.startsWith('#')) {
            finalLink = 'https://' + finalLink;
        }

        downloadsHTML = `
          <a href="${finalLink}" target="_blank"
             class="group block w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl text-center shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 mb-8">
            <div class="flex items-center justify-center gap-2">
              <span class="material-icons text-xl group-hover:animate-bounce">download</span>
              <span class="text-base font-bold uppercase tracking-wide">Download Mod APK</span>
            </div>
          </a>
        `;
      }

      // --- APPROVED UI ---
      if (!isSub) {
        statusHTML = `
          <!-- Approved Badge -->
          <div class="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6 border border-green-200 dark:border-green-900/50">
            <span class="material-icons text-lg">check_circle</span>
            <span class="font-bold text-sm">Order Approved Successfully</span>
          </div>

          <!-- KEY DISPLAY -->
          <div class="bg-slate-900 dark:bg-black rounded-3xl p-6 shadow-2xl mb-8 relative overflow-hidden group">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full blur-[60px] opacity-20"></div>
            
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your License Key</h3>
            
            <div class="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-md">
              <code class="font-mono text-xl text-yellow-400 tracking-wide flex-grow break-all select-all">
                ${order.key || 'Generating...'}
              </code>
              <button onclick="window.copyKey('${order.key}')" 
                      class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white" title="Copy">
                <span class="material-icons text-sm">content_copy</span>
              </button>
            </div>
            <p class="text-[10px] text-slate-500 mt-3">* Key works on 1 device only.</p>
          </div>

          <!-- DOWNLOADS -->
          <h3 class="font-bold text-slate-900 dark:text-white mb-3 px-1">Required Files</h3>
          ${downloadsHTML}

          <!-- TUTORIAL -->
          <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
            <div class="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-icons text-red-500">smart_display</span> Installation Guide
              </h3>
            </div>
            
            <div class="p-6">
              ${config.videoId ? `
              <div class="flex justify-center mb-6">
                 <!-- Video Container: Auto-adjusts size based on type -->
                 <div class="${config.isShort ? 'w-[200px] aspect-[9/16]' : 'w-full aspect-video'} bg-black rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 relative">
                    <iframe class="w-full h-full absolute inset-0" 
                            src="https://www.youtube.com/embed/${config.videoId}" 
                            title="Tutorial" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                 </div>
              </div>` : ''}

              <div class="space-y-4">
                ${config.steps.map((step, i) => `
                  <div class="flex gap-4 items-start">
                    <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center mt-0.5 border border-slate-200 dark:border-slate-600">
                      ${i + 1}
                    </span>
                    <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${step}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      } else {
        // SUBSCRIPTION SUCCESS
        statusHTML = `
          <div class="bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-200 p-8 rounded-3xl text-center mb-8 border border-purple-100 dark:border-purple-800">
            <span class="material-icons text-5xl mb-3 text-purple-500">verified</span>
            <h3 class="font-bold text-xl mb-1">Creator Plan Active</h3>
            <p class="text-sm mb-6 opacity-70">Access your tools in the Creator Studio.</p>
            <button onclick="window.router.navigateTo('/creator')" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg">
              Go to Creator Studio
            </button>
          </div>`;
      }
    }

    // --- RENDER FULL PAGE ---
    container.innerHTML = `
      <div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
        <img src="${order.item?.image || 'assets/icons/icon_wcc3.png'}" class="w-16 h-16 rounded-xl object-cover bg-slate-100">
        <div>
          <h2 class="font-bold text-slate-900 dark:text-white text-lg">${order.item?.gameName}</h2>
          <div class="text-xs text-slate-500 font-mono mt-1">Order #${docId} • ₹${order.amount}</div>
        </div>
      </div>

      ${statusHTML}

      <div class="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
        <p class="text-xs text-slate-400 mb-3 uppercase tracking-wider font-bold">Having Issues?</p>
        <button onclick="window.contactSupportWithId('${docId}')" 
                class="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-full text-sm font-bold transition">
          <span class="material-icons text-blue-500 text-base">telegram</span>
          Contact Admin
        </button>
      </div>
    `;
  }

  // --- HELPERS ---
  window.copyKey = function(key) {
    if(!key || key === 'Generating...') return;
    navigator.clipboard.writeText(key).then(() => {
      alert("Key Copied!");
    }).catch(() => {
      prompt("Copy this key:", key);
    });
  };

  window.contactSupportWithId = function(oid) {
    window.open(`https://t.me/imsergiomoreio`, '_blank');
  };

  // EXPORT
  window.OrderDetailsPage = OrderDetailsPage;

})();
