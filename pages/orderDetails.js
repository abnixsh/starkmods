// pages/orderDetails.js

(function() {
  'use strict';

  // --- 1. CONFIGURATION ---
  const COMMON_VIDEO_ID = 'fgJeFQKsZCs'; // The Applying Process Video (Short)
  const VPHONE_LINK = 'https://play.google.com/store/apps/details?id=com.yoyo.snake.rush';

  const GAME_CONFIG = {
    // --- RC20 CONFIGURATION ---
    'rc20': {
      videoId: COMMON_VIDEO_ID,
      isShort: true,
      vPhoneLink: VPHONE_LINK,
      // Hardcoded Mod Link for RC20
      modLink: 'https://github.com/abnixsh/starkmods/releases/download/cr20v6.1/RC20.VIP.v6.1.Mod.apk',
      steps: [
        '<b>Step 1:</b> Download <b>VPhoneGaGa</b> from the Play Store button below.',
        '<b>Step 2:</b> Download the <b>RC20 Mod Injector</b> from the blue button.',
        '<b>Step 3:</b> Open VPhoneGaGa. Create an <b>Android 7 (64-bit)</b> ROM.',
        '<b>Step 4:</b> Inside VPhone, import the Injector via "File Transfer".',
        '<b>Step 5:</b> Open Injector, Paste Key, and Start Game.'
      ]
    },

    // --- WCC3 CONFIGURATION (Same Process) ---
    'wcc3': {
      videoId: COMMON_VIDEO_ID, // Same video as RC20
      isShort: true,
      vPhoneLink: VPHONE_LINK,
      // WCC3 Mod Link: Will use Admin Panel link first. If empty, uses this placeholder.
      modLink: '#', 
      steps: [
        '<b>Step 1:</b> Download <b>VPhoneGaGa</b> from the Play Store button below.',
        '<b>Step 2:</b> Download the <b>WCC3 Mod</b> from the blue button.',
        '<b>Step 3:</b> Open VPhoneGaGa. Create an <b>Android 7</b> ROM.',
        '<b>Step 4:</b> Import the WCC3 Mod into VPhoneGaGa.',
        '<b>Step 5:</b> Open Mod, Paste Key, and Login.'
      ]
    },

    // --- FALLBACK ---
    'default': {
      videoId: '',
      steps: ['Download APK.', 'Install.', 'Enter Key.']
    }
  };

  // --- 2. MAIN PAGE FUNCTION ---
  function OrderDetailsPage() {
    const orderId = window.currentViewingOrderId;

    // Auth Check
    if (!window.currentUser) {
      setTimeout(() => window.router.navigateTo('/'), 100);
      return '';
    }

    if (!orderId) {
      return `
        <div class="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
          <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span class="material-icons text-slate-400">search_off</span>
          </div>
          <p class="text-slate-500 font-medium mb-6">No order selected.</p>
          <button onclick="window.router.navigateTo('/profile')" 
                  class="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">
            Go Back
          </button>
        </div>`;
    }

    // Load Data
    setTimeout(() => loadOrderDetails(orderId), 50);

    // Skeleton / Initial Layout
    return `
      <div class="max-w-3xl mx-auto px-4 pb-32 animate-fade-in">
        
        <!-- Navbar -->
        <div class="flex items-center gap-4 py-6 sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md -mx-4 px-4 mb-6 border-b border-slate-100 dark:border-white/5">
          <button onclick="window.router.navigateTo('/profile')" 
                  class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors">
            <span class="material-icons text-slate-900 dark:text-white text-sm">arrow_back_ios_new</span>
          </button>
          <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Order Details</h1>
        </div>

        <!-- Content Container -->
        <div id="order-detail-container">
          <div class="py-24 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p class="text-slate-400 font-medium text-sm animate-pulse">Retrieving order data...</p>
          </div>
        </div>
      </div>
    `;
  }

  // --- 3. DATA LOADING ---
  function loadOrderDetails(orderId) {
    const container = document.getElementById('order-detail-container');
    if (!container || !window.db) return;

    window.db.collection('orders').doc(orderId).onSnapshot(doc => {
      if (!doc.exists) {
        container.innerHTML = `<div class="text-center text-red-500 font-bold py-10">Order not found in database.</div>`;
        return;
      }
      renderOrderContent(container, doc.data(), doc.id);
    });
  }

  // --- 4. RENDER CONTENT ---
  function renderOrderContent(container, order, docId) {
    const gameId = order.item?.gameId || 'default';
    const config = GAME_CONFIG[gameId] || GAME_CONFIG['default'];
    const isSub = String(gameId).startsWith('sub_');

    // -- A. STATUS LOGIC --
    let statusUI = '';
    
    if (order.status === 'pending') {
      statusUI = `
        <div class="relative overflow-hidden rounded-[2rem] bg-amber-500 text-white p-8 shadow-2xl shadow-amber-500/20 mb-8">
           <div class="absolute top-0 right-0 p-16 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
           <div class="relative z-10 text-center">
             <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
               <span class="material-icons text-3xl">hourglass_top</span>
             </div>
             <h2 class="text-2xl font-bold mb-2">Verifying Payment</h2>
             <p class="opacity-90 text-sm font-medium mb-4">Transaction ID: ${order.transId}</p>
             <div class="inline-block bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold">
               Est. time: 10-30 Mins
             </div>
           </div>
        </div>`;
    } 
    else if (order.status === 'rejected') {
      statusUI = `
        <div class="rounded-[2rem] bg-red-500 text-white p-8 shadow-2xl shadow-red-500/20 text-center mb-8">
           <span class="material-icons text-5xl mb-3 opacity-90">cancel</span>
           <h2 class="text-2xl font-bold mb-2">Order Rejected</h2>
           <p class="opacity-90 text-sm mb-6">We couldn't verify your payment details.</p>
           <button onclick="window.contactSupportWithId('${docId}')" 
                   class="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">
             Contact Support
           </button>
        </div>`;
    } 
    else if (order.status === 'approved') {
      
      // -- B. DOWNLOADS LOGIC (Unified for WCC3 & RC20) --
      let downloadsHTML = '';
      
      // Determine Mod Link: Admin DB Link > Config Link > #
      let finalModLink = order.downloadUrl || config.modLink;
      if (!finalModLink || finalModLink === '#') finalModLink = '#';
      else if (!finalModLink.startsWith('http')) finalModLink = 'https://' + finalModLink;

      if (!isSub) {
        downloadsHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <!-- 1. VPhoneGaGa Card -->
            <a href="${config.vPhoneLink}" target="_blank"
               class="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
               <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
               <div class="relative z-10 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 text-white">
                     <span class="material-icons text-2xl">android</span>
                  </div>
                  <div>
                     <div class="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-0.5">Required App</div>
                     <div class="text-lg font-black text-slate-900 dark:text-white">VPhoneGaGa</div>
                     <div class="text-xs text-slate-400 mt-0.5">Get from Play Store</div>
                  </div>
               </div>
               <div class="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="material-icons text-slate-300">arrow_forward_ios</span>
               </div>
            </a>

            <!-- 2. Mod Injector Card -->
            <a href="${finalModLink}" target="_blank"
               class="group relative overflow-hidden rounded-3xl bg-blue-600 p-5 shadow-xl shadow-blue-600/30 transition-all active:scale-[0.98]">
               <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
               <div class="relative z-10 flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/20">
                     <span class="material-icons text-2xl group-hover:animate-bounce">download</span>
                  </div>
                  <div>
                     <div class="text-[10px] font-bold text-blue-100 uppercase tracking-wider mb-0.5">Step 2</div>
                     <div class="text-lg font-black text-white">Download Mod</div>
                     <div class="text-xs text-blue-100/80 mt-0.5">Direct Link</div>
                  </div>
               </div>
            </a>
          </div>`;

        statusUI = `
          <!-- SUCCESS HEADER -->
          <div class="flex items-center gap-3 mb-6 px-2">
            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Order Active</span>
          </div>

          <!-- LICENSE KEY CARD (Glassmorphism) -->
          <div class="relative overflow-hidden rounded-[2rem] bg-slate-900 dark:bg-black text-white p-6 shadow-2xl mb-10 group">
             <!-- Background Effects -->
             <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-40 -mr-20 -mt-20 group-hover:opacity-50 transition-opacity"></div>
             <div class="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-[60px] opacity-30 -ml-10 -mb-10"></div>
             
             <div class="relative z-10">
               <div class="flex justify-between items-start mb-6">
                 <div>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">License Key</p>
                   <p class="text-xs text-slate-500">Single Device Access</p>
                 </div>
                 <span class="material-icons text-white/20 text-4xl">vpn_key</span>
               </div>

               <div class="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-3 transition-all hover:bg-white/15">
                 <code class="font-mono text-xl text-yellow-300 tracking-wide flex-grow break-all select-all shadow-black drop-shadow-md">
                   ${order.key || 'Generating...'}
                 </code>
                 <button onclick="window.copyKey('${order.key}')" 
                         class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/30 flex items-center justify-center transition-colors">
                   <span class="material-icons text-sm">content_copy</span>
                 </button>
               </div>
             </div>
          </div>

          <!-- DOWNLOADS SECTION -->
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4 px-2">Installation Files</h3>
          ${downloadsHTML}

          <!-- TUTORIAL SECTION (iOS Style List) -->
          <div class="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-2 mb-10 border border-slate-200 dark:border-slate-800">
             
             <!-- VIDEO PLAYER (Vertical / Short) -->
             ${config.videoId ? `
             <div class="bg-black rounded-[2rem] overflow-hidden shadow-2xl relative aspect-[9/16] max-w-[280px] mx-auto my-6 border-4 border-slate-900 dark:border-slate-700">
                <iframe class="w-full h-full absolute inset-0" 
                        src="https://www.youtube.com/embed/${config.videoId}?rel=0&modestbranding=1" 
                        title="Tutorial" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
             </div>` : ''}

             <!-- STEPS -->
             <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 class="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                   <span class="material-icons text-blue-500">format_list_numbered</span> Setup Instructions
                </h3>
                <div class="space-y-6 relative">
                   <!-- Vertical Line -->
                   <div class="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
                   
                   ${config.steps.map((step, i) => `
                   <div class="relative flex gap-4">
                      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30 z-10 border-4 border-white dark:border-slate-800">
                         ${i + 1}
                      </div>
                      <div class="pt-1 pb-2">
                         <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                           ${step}
                         </p>
                      </div>
                   </div>`).join('')}
                </div>
             </div>
          </div>
        `;
      } else {
        // SUBSCRIPTION SUCCESS
        statusUI = `
          <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-10 text-center shadow-2xl shadow-purple-600/30 mb-8">
             <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
               <span class="material-icons text-4xl">verified</span>
             </div>
             <h2 class="text-3xl font-black mb-2">Creator Plan Active</h2>
             <p class="text-purple-100 mb-8 font-medium">You now have unlimited access to all premium modding tools.</p>
             <button onclick="window.router.navigateTo('/creator')" 
                     class="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-sm shadow-xl hover:scale-105 transition-transform">
               Launch Creator Studio
             </button>
          </div>`;
      }
    }

    // -- C. FULL PAGE ASSEMBLY --
    container.innerHTML = `
      <!-- ITEM HEADER (Compact) -->
      <div class="flex items-center gap-5 p-5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none mb-10 border border-slate-100 dark:border-slate-800">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
           <img src="${order.item?.image || 'assets/icons/icon_wcc3.png'}" class="w-full h-full object-cover rounded-xl">
        </div>
        <div>
           <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purchased Item</div>
           <h2 class="text-xl font-black text-slate-900 dark:text-white leading-tight">${order.item?.gameName}</h2>
           <p class="text-xs text-slate-500 font-bold mt-1">₹${order.amount} • <span class="uppercase">${order.item?.planName || 'Plan'}</span></p>
        </div>
      </div>

      ${statusUI}

      <!-- FOOTER -->
      <div class="text-center mt-12 mb-8">
        <button onclick="window.contactSupportWithId('${docId}')" 
                class="group inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-full text-sm font-bold transition-all">
          <span>Need Help?</span>
          <span class="w-1 h-1 bg-slate-400 rounded-full"></span>
          <span class="text-blue-500 group-hover:underline">Contact Support</span>
        </button>
      </div>
    `;
  }

  // --- 5. HELPERS ---
  window.copyKey = function(key) {
    if(!key || key === 'Generating...') return;
    navigator.clipboard.writeText(key).then(() => {
      // iOS Style Toast could be added here, for now using Alert
      const btn = document.activeElement;
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="material-icons text-green-400">check</span>';
      setTimeout(() => btn.innerHTML = originalHTML, 2000);
    }).catch(() => {
      prompt("Copy your key:", key);
    });
  };

  window.contactSupportWithId = function(oid) {
    window.open(`https://t.me/imsergiomoreio`, '_blank');
  };

  // Export to Global Scope
  window.OrderDetailsPage = OrderDetailsPage;

})();
