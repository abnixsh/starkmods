// pages/orderDetails.js

// --- CONFIGURATION ---
const GAME_CONFIG = {
  // --- RC20 CONFIGURATION (VPhone Process) ---
  'rc20': {
    videoId: 'fgJeFQKsZCs', // Your YouTube Short ID
    isShort: true, // Optimize player for vertical video
    
    // Tools Links
    vPhoneLink: 'https://play.google.com/store/apps/details?id=com.yoyo.snake.rush',
    // Converted to direct download link (changed 'tag' to 'download')
    modLink: 'https://github.com/abnixsh/starkmods/releases/download/cr20v6.1/RC20.VIP.v6.1.Mod.apk',
    
    steps: [
      '<b>Download VPhoneGaGa</b> from the Play Store button above.',
      '<b>Download the Injector</b> (Mod APK) from the blue button.',
      'Open VPhoneGaGa and create an <b>Android 7 (64-bit or 32-bit)</b> ROM.',
      'Inside VPhoneGaGa, click "Import" and select the <b>RC20 Injector</b> you just downloaded.',
      'Open the Injector inside VPhoneGaGa.',
      'Copy your <b>License Key</b> from above and paste it into the app.',
      'Enjoy the mod!'
    ]
  },

  // --- WCC3 CONFIGURATION (Simple Process) ---
  'wcc3': {
    videoId: 'dQw4w9WgXcQ', // Replace with WCC3 video if you have one
    isShort: false,
    modLink: '#', // Will use Admin link if set, otherwise this
    steps: [
      'Download the Mod APK.',
      'Install it on your device.',
      'Open the game and paste the key.',
      'Enjoy VIP features!'
    ]
  },

  // --- DEFAULT FALLBACK ---
  'default': {
    videoId: '',
    steps: ['Download APK.', 'Install.', 'Paste Key.']
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
      <div class="max-w-md mx-auto text-center py-20 animate-fade-in">
        <span class="material-icons text-4xl text-slate-300 mb-4">error_outline</span>
        <p class="text-slate-500 mb-6">No order selected.</p>
        <button onclick="window.router.navigateTo('/profile')" class="bg-slate-200 dark:bg-slate-700 px-6 py-2 rounded-lg font-bold text-sm">
          Go Back
        </button>
      </div>`;
  }

  // Render Skeleton & Load
  setTimeout(() => window.loadOrderDetails(orderId), 100);

  return `
    <div class="max-w-3xl mx-auto px-4 pb-24 animate-fade-in">
      <!-- Navbar -->
      <div class="flex items-center gap-4 py-6 mb-4">
        <button onclick="window.router.navigateTo('/profile')" 
                class="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition shadow-sm">
          <span class="material-icons text-slate-600 dark:text-slate-300">arrow_back</span>
        </button>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white">Order Details</h1>
      </div>

      <div id="order-detail-container">
        <div class="py-20 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-slate-500 text-sm">Fetching details...</p>
        </div>
      </div>
    </div>
  `;
}

window.loadOrderDetails = function(orderId) {
  const container = document.getElementById('order-detail-container');
  if (!container || !window.db) return;

  window.db.collection('orders').doc(orderId).onSnapshot(doc => {
    if (!doc.exists) {
      container.innerHTML = `<div class="text-center text-red-500">Order not found.</div>`;
      return;
    }
    renderOrderContent(container, doc.data(), doc.id);
  });
};

function renderOrderContent(container, order, docId) {
  const gameId = order.item?.gameId || 'default';
  const config = GAME_CONFIG[gameId] || GAME_CONFIG['default'];
  const isSub = String(gameId).startsWith('sub_');

  // --- 1. STATUS HEADER ---
  let statusHTML = '';
  
  if (order.status === 'pending') {
    statusHTML = `
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-2xl p-6 text-center mb-8">
        <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span class="material-icons text-3xl text-yellow-600 dark:text-yellow-400">hourglass_empty</span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Verifying Payment</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Checking ID: <span class="font-mono bg-yellow-100 dark:bg-yellow-900 px-1 rounded">${order.transId}</span></p>
        <p class="text-xs text-slate-400 mt-2">Please wait 10-30 minutes.</p>
      </div>`;
  } 
  else if (order.status === 'rejected') {
    statusHTML = `
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center mb-8">
        <span class="material-icons text-4xl text-red-500 mb-2">block</span>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Order Rejected</h2>
        <p class="text-slate-500 text-sm mt-2 mb-4">Transaction Invalid.</p>
        <button onclick="window.contactSupportWithId('${docId}')" class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm">Contact Support</button>
      </div>`;
  }
  else if (order.status === 'approved') {
    // --- APPROVED LOGIC ---
    
    // 1. Determine Links
    // Use Admin link if set, otherwise use Config link
    const finalModLink = order.downloadUrl || config.modLink || '#';
    const vPhoneLink = config.vPhoneLink; 

    // 2. Build Downloads Section
    let downloadsHTML = '';
    
    if (gameId === 'rc20') {
      // RC20 SPECIAL: Two buttons
      downloadsHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <!-- Button 1: VPhone -->
          <a href="${vPhoneLink}" target="_blank"
             class="group flex flex-col items-center justify-center bg-white dark:bg-slate-800 border border-green-200 dark:border-green-900/50 p-4 rounded-2xl shadow-sm hover:shadow-green-500/20 hover:border-green-500 transition-all">
             <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span class="material-icons text-green-600">android</span>
             </div>
             <span class="font-bold text-slate-800 dark:text-white text-sm">1. VPhoneGaGa</span>
             <span class="text-[10px] text-slate-400">Play Store</span>
          </a>

          <!-- Button 2: Mod Injector -->
          <a href="${finalModLink}" target="_blank"
             class="group flex flex-col items-center justify-center bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
             <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <span class="material-icons">download</span>
             </div>
             <span class="font-bold text-white text-sm">2. Download Injector</span>
             <span class="text-[10px] text-blue-200">Auto-Start Download</span>
          </a>
        </div>
      `;
    } else {
      // STANDARD (WCC3/Other): Single Button
      downloadsHTML = `
        <a href="${finalModLink}" target="_blank"
           class="group block w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl text-center shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 mb-8">
          <div class="flex items-center justify-center gap-2">
            <span class="material-icons text-2xl group-hover:animate-bounce">download</span>
            <span class="text-lg font-black uppercase tracking-wide">Download Mod APK</span>
          </div>
        </a>
      `;
    }

    // 3. Assemble Approved UI
    if (!isSub) {
      statusHTML = `
        <!-- Success Badge -->
        <div class="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-xl mb-6 border border-green-200 dark:border-green-900/50">
          <span class="material-icons">check_circle</span>
          <span class="font-bold text-sm">Approved successfully</span>
        </div>

        <!-- KEY CARD -->
        <div class="bg-slate-900 dark:bg-black rounded-3xl p-6 shadow-2xl mb-8 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full blur-[60px] opacity-20"></div>
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your License Key</h3>
          <div class="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <code class="font-mono text-xl text-yellow-400 tracking-wide flex-grow break-all select-all">
              ${order.key || 'Generating key...'}
            </code>
            <button onclick="window.copyKey('${order.key}')" 
                    class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white">
              <span class="material-icons text-sm">content_copy</span>
            </button>
          </div>
        </div>

        <!-- DOWNLOADS -->
        <h3 class="font-bold text-slate-900 dark:text-white mb-3 px-1">Required Downloads</h3>
        ${downloadsHTML}

        <!-- TUTORIAL -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div class="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-icons text-red-500">smart_display</span> Applying Process
            </h3>
          </div>
          
          <div class="p-6">
            ${config.videoId ? `
            <div class="flex justify-center mb-8 bg-black rounded-2xl overflow-hidden py-4">
               <!-- Responsive Container for Shorts (Vertical) or Landscape -->
               <div class="${config.isShort ? 'w-[200px] aspect-[9/16]' : 'w-full aspect-video'} relative shadow-2xl rounded-lg overflow-hidden border border-slate-700">
                  <iframe class="w-full h-full" 
                          src="https://www.youtube.com/embed/${config.videoId}" 
                          title="Tutorial" frameborder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowfullscreen></iframe>
               </div>
            </div>` : ''}

            <div class="space-y-5">
              ${config.steps.map((step, i) => `
                <div class="flex gap-4 items-start">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
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
        <div class="bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 p-8 rounded-3xl text-center mb-8 border border-purple-200 dark:border-purple-800">
          <span class="material-icons text-5xl mb-4">verified</span>
          <h3 class="font-bold text-xl mb-2">Creator Plan Active</h3>
          <p class="text-sm mb-6 opacity-80">You now have access to premium creator tools.</p>
          <button onclick="window.router.navigateTo('/creator')" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg">
            Open Creator Studio
          </button>
        </div>`;
    }
  }

  // --- RENDER FULL PAGE ---
  container.innerHTML = `
    <!-- Item Header -->
    <div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      <img src="${order.item?.image || 'assets/icons/icon_wcc3.png'}" class="w-16 h-16 rounded-xl object-cover bg-slate-100" onerror="this.src='https://placehold.co/64'">
      <div>
        <h2 class="font-bold text-slate-900 dark:text-white text-lg">${order.item?.gameName}</h2>
        <div class="text-xs text-slate-500 font-mono mt-1">Order #${docId}</div>
      </div>
    </div>

    ${statusHTML}

    <!-- Support Footer -->
    <div class="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
      <p class="text-xs text-slate-400 mb-3 uppercase tracking-wider font-bold">Having Issues?</p>
      <button onclick="window.contactSupportWithId('${docId}')" 
              class="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-full text-sm font-bold transition">
        
