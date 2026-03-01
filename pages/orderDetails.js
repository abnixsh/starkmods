// pages/orderDetails.js

// --- CONFIGURATION: TUTORIALS & FALLBACK LINKS ---
// You can change the YouTube IDs and Steps here for each game
const GAME_CONFIG = {
  'wcc3': {
    videoId: 'dQw4w9WgXcQ', // Example ID. Replace with your video ID (e.g. from YouTube URL)
    steps: [
      'Download the WCC3 Mod APK from the button above.',
      'Install the APK (Allow "Unknown Sources" if asked).',
      'Open the game. You will see a Login Dialog.',
      'Copy your License Key from above and paste it into the game.',
      'Press Login. Enjoy VIP features!'
    ],
    fallbackLink: 'https://your-default-wcc3-link.com/apk'
  },
  'rc24': {
    videoId: 'YOUR_VIDEO_ID',
    steps: [
      'Uninstall the Play Store version of Real Cricket 24.',
      'Download our Modded APK.',
      'Login with Google is NOT supported. Use Guest or Facebook.',
      'Paste the key when prompted.'
    ],
    fallbackLink: 'https://your-default-rc24-link.com/apk'
  },
  // Default for unknown games
  'default': {
    videoId: '', // Leave empty if no video
    steps: [
      'Download the APK.',
      'Install on your device.',
      'Enter the provided key to activate.'
    ],
    fallbackLink: '#'
  }
};

function OrderDetailsPage() {
  // 1. Get the Order ID passed from Profile Page
  const orderId = window.currentViewingOrderId;

  // 2. Security Check
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
          Go Back to Profile
        </button>
      </div>`;
  }

  // 3. Render Skeleton immediately, then fetch data
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

      <!-- Dynamic Content Area -->
      <div id="order-detail-container">
        <div class="py-20 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-slate-500 text-sm">Fetching your order...</p>
        </div>
      </div>

    </div>
  `;
}

window.loadOrderDetails = function(orderId) {
  const container = document.getElementById('order-detail-container');
  if (!container || !window.db) return;

  // Real-time listener
  window.db.collection('orders').doc(orderId).onSnapshot(doc => {
    if (!doc.exists) {
      container.innerHTML = `<div class="text-center text-red-500">Order not found in database.</div>`;
      return;
    }

    const order = doc.data();
    renderOrderContent(container, order, doc.id);
  }, err => {
    console.error(err);
    container.innerHTML = `<div class="text-center text-red-500">Error loading data.</div>`;
  });
};

function renderOrderContent(container, order, docId) {
  const gameId = order.item?.gameId || 'default';
  const config = GAME_CONFIG[gameId] || GAME_CONFIG['default'];
  const isSub = String(gameId).startsWith('sub_');

  // --- 1. Status Logic ---
  let statusHTML = '';
  if (order.status === 'pending') {
    statusHTML = `
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-2xl p-6 text-center mb-8">
        <div class="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span class="material-icons text-3xl text-yellow-600 dark:text-yellow-400">hourglass_empty</span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Verifying Payment</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
          We are checking your transaction ID (<code>${order.transId}</code>).<br>
          This usually takes 10–30 minutes. The page will auto-update once approved.
        </p>
      </div>`;
  } 
  else if (order.status === 'rejected') {
    statusHTML = `
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center mb-8">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-3xl text-red-600 dark:text-red-400">block</span>
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Order Rejected</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">
          The transaction ID could not be verified or was invalid.
        </p>
        <button onclick="window.contactSupportWithId('${docId}')" class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition">
          Contact Support
        </button>
      </div>`;
  }
  else if (order.status === 'approved') {
    // Determine link: Admin set link > Config Fallback > Hash
    const downloadLink = order.downloadUrl || config.fallbackLink || '#';
    
    // --- APPROVED UI ---
    statusHTML = `
      <!-- Success Banner -->
      <div class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-3 rounded-xl flex items-center gap-3 mb-6">
        <span class="material-icons">check_circle</span>
        <span class="font-bold text-sm">Order Approved & Ready</span>
      </div>

      <!-- KEY SECTION -->
      ${!isSub ? `
      <div class="bg-slate-900 dark:bg-black rounded-3xl p-6 shadow-2xl mb-6 relative overflow-hidden group">
        <!-- Glow Effect -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-[60px] opacity-30"></div>
        
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your License Key</h3>
        
        <div class="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
          <code class="font-mono text-xl text-yellow-400 tracking-wide flex-grow break-all select-all">
            ${order.key || 'Waiting for key...'}
          </code>
          <button onclick="window.copyKey('${order.key}')" 
                  class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white">
            <span class="material-icons text-sm">content_copy</span>
          </button>
        </div>
        <p class="text-[10px] text-slate-500 mt-3">* One key works on one device only.</p>
      </div>

      <!-- DOWNLOAD BUTTON -->
      <a href="${downloadLink}" target="_blank"
         class="group block w-full bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl text-center shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1 mb-10">
        <div class="flex items-center justify-center gap-2">
          <span class="material-icons text-2xl group-hover:animate-bounce">download</span>
          <span class="text-lg font-black uppercase tracking-wide">Download Mod APK</span>
        </div>
        <div class="text-[10px] text-blue-200 mt-1">Latest Version • Secure Download</div>
      </a>

      <!-- TUTORIAL SECTION -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
        <div class="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-red-500">smart_display</span> How to Install
          </h3>
        </div>
        
        <div class="p-6">
          ${config.videoId ? `
          <div class="aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-lg">
             <iframe class="w-full h-full" src="https://www.youtube.com/embed/${config.videoId}" title="Tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>` : ''}

          <div class="space-y-4">
            ${config.steps.map((step, i) => `
              <div class="flex gap-4">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center border border-slate-200 dark:border-slate-600">
                  ${i + 1}
                </span>
                <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${step}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      ` : `
      <!-- SUBSCRIPTION SUCCESS -->
      <div class="bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-200 p-6 rounded-2xl text-center mb-8 border border-purple-200 dark:border-purple-800">
        <h3 class="font-bold text-lg mb-2">Creator Plan Active!</h3>
        <p class="text-sm mb-4">Your subscription has been activated automatically. You can now access all premium creator tools.</p>
        <button onclick="window.router.navigateTo('/creator')" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold text-sm">
          Open Creator Studio
        </button>
      </div>
      `}
    `;
  }

  // --- 2. Render Full Page ---
  container.innerHTML = `
    <!-- HEADER INFO -->
    <div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      <img src="${order.item?.image || 'assets/icons/icon_wcc3.png'}" class="w-16 h-16 rounded-xl object-cover bg-slate-100">
      <div>
        <h2 class="font-bold text-slate-900 dark:text-white">${order.item?.gameName || 'Game Mod'}</h2>
        <div class="text-xs text-slate-500 mt-1">Order #${docId} • ₹${order.amount}</div>
      </div>
    </div>

    ${statusHTML}

    <!-- SUPPORT FOOTER -->
    <div class="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
      <p class="text-xs text-slate-400 mb-3 uppercase tracking-wider font-bold">Need Help?</p>
      <button onclick="window.contactSupportWithId('${docId}')" 
              class="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-full text-sm font-bold transition">
        <span class="material-icons text-blue-500 text-base">telegram</span>
        Contact Admin on Telegram
      </button>
    </div>
  `;
}

// Helpers
window.copyKey = function(key) {
  if(!key) return;
  navigator.clipboard.writeText(key).then(() => {
    alert("Key Copied to Clipboard!");
  }).catch(() => {
    alert("Key: " + key);
  });
};

window.contactSupportWithId = function(oid) {
  // Telegram direct link
  window.open(`https://t.me/imsergiomoreio`, '_blank');
};

window.OrderDetailsPage = OrderDetailsPage;
