// --- CONFIGURATION FOR TUTORIALS ---
const GAME_TUTORIALS = {
  'wcc3': {
    videoId: 'dQw4w9WgXcQ', // Replace with your actual YouTube Video ID
    steps: [
      'Download the APK from the button above.',
      'Install the APK (Allow unknown sources if asked).',
      'Open the game and paste your License Key.',
      'Enjoy VIP features!'
    ]
  },
  'rc24': {
    videoId: 'YOUR_VIDEO_ID_HERE', 
    steps: [
      'Uninstall original Play Store version.',
      'Install the Mod APK.',
      'Login with Key.'
    ]
  },
  // Default fallback
  'default': {
    videoId: '', 
    steps: ['Install APK.', 'Paste Key.', 'Play.']
  }
};

function OrderDetailsPage() {
  // 1. Get the Order ID stored in window state
  const orderId = window.currentViewingOrderId;

  if (!window.currentUser) {
    window.router.navigateTo('/');
    return '';
  }

  if (!orderId) {
    return `
      <div class="text-center py-20">
        <p class="text-red-500">No order selected.</p>
        <button onclick="window.router.navigateTo('/profile')" class="mt-4 bg-slate-200 px-4 py-2 rounded">Go Back</button>
      </div>`;
  }

  // 2. Fetch Order Details (Real-time)
  setTimeout(() => {
    const container = document.getElementById('order-details-content');
    if (!container || !window.db) return;

    db.collection('orders').doc(orderId).onSnapshot(doc => {
      if (!doc.exists) {
        container.innerHTML = '<p class="text-center text-red-500">Order not found.</p>';
        return;
      }
      renderOrderContent(doc.data(), doc.id);
    });
  }, 100);

  return `
    <div class="max-w-3xl mx-auto pb-24 animate-fade-in">
      <!-- Nav -->
      <div class="flex items-center gap-2 mb-6 pt-6 px-4">
        <button onclick="window.router.navigateTo('/profile')" 
                class="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition">
          <span class="material-icons text-sm">arrow_back</span>
        </button>
        <span class="font-bold text-slate-900 dark:text-white">Order Details</span>
      </div>

      <!-- Dynamic Content -->
      <div id="order-details-content" class="px-4">
        <div class="py-20 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-slate-500 mt-4 text-sm">Loading order details...</p>
        </div>
      </div>
    </div>
  `;
}

// --- RENDER LOGIC ---
function renderOrderContent(order, docId) {
  const container = document.getElementById('order-details-content');
  const gameId = order.item?.gameId || 'default';
  const isSub = String(gameId).startsWith('sub_');
  
  // 1. Status Logic
  let statusColor = 'bg-yellow-500';
  let statusIcon = 'hourglass_empty';
  let statusText = 'Processing Payment';
  let statusDesc = 'Admin is verifying your transaction ID. This usually takes 10-30 minutes.';

  if (order.status === 'approved') {
    statusColor = 'bg-green-500';
    statusIcon = 'check_circle';
    statusText = 'Order Completed';
    statusDesc = 'Your order is approved. Access your content below.';
  } else if (order.status === 'rejected') {
    statusColor = 'bg-red-500';
    statusIcon = 'cancel';
    statusText = 'Order Rejected';
    statusDesc = 'Your payment could not be verified. Please contact support.';
  }

  // 2. Determine Download Link (Admin specific > Global Config)
  let downloadLink = order.downloadUrl || (window.downloadLinks ? window.downloadLinks[gameId] : '#');
  
  // 3. Tutorial Data
  const tutorial = GAME_TUTORIALS[gameId] || GAME_TUTORIALS['default'];

  // 4. HTML Construction
  container.innerHTML = `
    <!-- STATUS CARD -->
    <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl mb-8">
      <div class="absolute top-0 left-0 w-full h-2 ${statusColor}"></div>
      <div class="p-8 text-center">
        <div class="w-16 h-16 ${statusColor} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-icons text-3xl ${statusColor.replace('bg-', 'text-')}">${statusIcon}</span>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">${statusText}</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">${statusDesc}</p>
        <div class="mt-4 inline-block bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded text-xs font-mono text-slate-500">
          ID: ${order.orderId || docId}
        </div>
      </div>
    </div>

    <!-- PRODUCT INFO -->
    <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8">
      <img src="${order.item?.image || 'https://placehold.co/60'}" class="w-14 h-14 rounded-xl object-cover">
      <div>
        <h3 class="font-bold text-slate-900 dark:text-white">${order.item?.gameName}</h3>
        <p class="text-xs text-slate-500">${order.item?.planName} • ₹${order.amount}</p>
      </div>
    </div>

    ${order.status === 'approved' && !isSub ? `
      <!-- APPROVED CONTENT (MODS) -->
      <div class="space-y-6 animate-entry">
        
        <!-- 1. KEY SECTION -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
          
          <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Your License Key</h3>
          <div class="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <code class="font-mono text-xl text-yellow-400 tracking-wide flex-grow select-all" id="license-key-display">${order.key || 'Waiting for admin to set key...'}</code>
            <button onclick="window.copyToClipboard('${order.key || ''}')" class="p-2 hover:bg-white/10 rounded-lg transition">
              <span class="material-icons text-white">content_copy</span>
            </button>
          </div>
          <p class="text-[10px] text-slate-400 mt-3 opacity-70">
            *This key is linked to your device ID. Do not share it.
          </p>
        </div>

        <!-- 2. DOWNLOAD & ACTION -->
        <a href="${downloadLink}" target="_blank" 
           class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-1">
          <span class="flex items-center justify-center gap-2">
            <span class="material-icons">download</span> Download Mod APK
          </span>
        </a>

        <!-- 3. TUTORIAL & GUIDE -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-icons text-red-500">play_circle</span> Installation Guide
            </h3>
          </div>
          
          <div class="p-6">
            ${tutorial.videoId ? `
            <div class="aspect-video rounded-xl overflow-hidden bg-black mb-6 relative group">
              <iframe class="w-full h-full" src="https://www.youtube.com/embed/${tutorial.videoId}" frameborder="0" allowfullscreen></iframe>
            </div>` : ''}

            <ol class="space-y-4">
              ${tutorial.steps.map((step, i) => `
                <li class="flex gap-3">
                  <span class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">${i+1}</span>
                  <span class="text-sm text-slate-600 dark:text-slate-300">${step}</span>
                </li>
              `).join('')}
            </ol>
          </div>
        </div>

      </div>
    ` : ''}

    ${order.status === 'approved' && isSub ? `
      <div class="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-2xl text-center">
        <h3 class="font-bold mb-2">Subscription Active</h3>
        <p class="text-sm">Your Creator Plan is now active. Go to the "Mod Creator" tab to start using your features.</p>
        <button onclick="window.router.navigateTo('/creator')" class="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Go to Creator Dashboard</button>
      </div>
    ` : ''}

    <!-- SUPPORT BUTTON -->
    <div class="mt-10 text-center">
      <p class="text-xs text-slate-400 mb-3">Having trouble with this order?</p>
      <button onclick="window.contactSupportWithId('${order.orderId || docId}')" 
              class="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-bold text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg transition">
        <span class="material-icons text-sm">telegram</span> Contact Admin
      </button>
    </div>
  `;
}

// --- HELPERS ---
window.copyToClipboard = function(text) {
  if(!text) return;
  navigator.clipboard.writeText(text);
  alert("Key Copied!");
}

window.contactSupportWithId = function(oid) {
  const url = `https://t.me/imsergiomoreio?start=Help_Order_${oid}`; 
  // Note: Telegram 'start' param only works for bots. For user link, use simple text:
  // const url = `https://t.me/imsergiomoreio`;
  window.open(url, '_blank');
}

window.OrderDetailsPage = OrderDetailsPage;
