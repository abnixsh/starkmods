// pages/rc25.js

// Global config state for RC25 download
window.rc25Config = window.rc25Config || null;
window.rc25ConfigLoaded = window.rc25ConfigLoaded || false;
window._rc25ConfigLoading = window._rc25ConfigLoading || false;

// Load config from Firestore once
window.loadRc25ConfigOnce = function () {
  if (window.rc25ConfigLoaded || window._rc25ConfigLoading) return;

  if (!window.db) {
    // DB not ready yet, try again shortly
    setTimeout(window.loadRc25ConfigOnce, 200);
    return;
  }

  window._rc25ConfigLoading = true;

  window.db.collection('gameConfig').doc('rc25')
    .get()
    .then(doc => {
      window._rc25ConfigLoading = false;
      window.rc25ConfigLoaded = true;
      window.rc25Config = doc.exists ? (doc.data() || {}) : {};
      // Re-render page so config is applied
      if (window.router && typeof window.router.handleRoute === 'function') {
        window.router.handleRoute('/rc25');
      }
    })
    .catch(err => {
      console.error('loadRc25ConfigOnce error:', err);
      window._rc25ConfigLoading = false;
      window.rc25ConfigLoaded = true;
      window.rc25Config = {};
    });
};

function Rc25Page() {
  // Ensure config is loaded once
  if (!window.rc25ConfigLoaded) {
    window.loadRc25ConfigOnce();
    return `
      <div class="max-w-4xl mx-auto py-20 text-center animate-fade-in">
        <div class="animate-pulse space-y-3">
          <div class="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
          <div class="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
        </div>
      </div>
    `;
  }

  const isAdmin = !!window.isAdmin;

  const defaultLink = 'https://dupload.net/o9cxh6xht397';
  const cfg = window.rc25Config || {};
  const enabled = cfg.enabled !== false;          // default true if not set
  const downloadLink = cfg.link || defaultLink;

  const downloadButtonHtml = enabled
    ? `
      <a href="${downloadLink}" target="_blank"
         class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
        <span class="material-icons">download</span> Download APK
      </a>
      <p class="text-center text-xs text-slate-500 mt-2">
        File Size: 700+ MB | Version: v7+
      </p>
    `
    : `
      <button disabled
              class="w-full py-4 bg-slate-500 text-white rounded-xl font-bold shadow-lg cursor-not-allowed flex items-center justify-center gap-2">
        <span class="material-icons">block</span> Download Temporarily Disabled
      </button>
      <p class="text-center text-xs text-red-500 mt-2">
        Admin has disabled downloads for this mod temporarily.
      </p>
    `;

  const adminControlsHtml = isAdmin ? `
    <div class="mt-4 p-3 rounded-lg bg-slate-800/80 text-xs border border-slate-600 space-y-2">
      <div class="flex items-center justify-between">
        <span class="font-semibold text-slate-200">Admin Controls</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
          enabled
            ? 'bg-green-200 text-green-800'
            : 'bg-red-200 text-red-800'
        }">
          ${enabled ? 'ENABLED' : 'DISABLED'}
        </span>
      </div>
      <div class="text-slate-300 break-all">
        <span class="font-semibold">Link:</span>
        <span class="ml-1">${downloadLink}</span>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        <button onclick="window.toggleRc25Download()"
                class="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-1">
          <span class="material-icons text-xs">${enabled ? 'visibility_off' : 'visibility'}</span>
          ${enabled ? 'Disable Download' : 'Enable Download'}
        </button>
        <button onclick="window.editRc25DownloadLink()"
                class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1">
          <span class="material-icons text-xs">link</span>
          Update Link
        </button>
      </div>
    </div>
  ` : '';

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      
      <!-- Back Button -->
      <div class="mb-6">
        <a href="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium" data-link>
          <span class="material-icons text-sm">arrow_back</span> Back to Home
        </a>
      </div>

      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
         <img src="assets/icons/icon_rc25.jpg" class="w-20 h-20 rounded-2xl shadow-lg" onerror="this.src='https://placehold.co/80?text=RC25'">
         <div>
             <h1 class="text-3xl font-bold">RC25 V7 Patch</h1>
             <div class="flex gap-2 mt-2">
                <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold rounded">New Release</span>
                <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">Free</span>
                <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold rounded">V7</span>
             </div>
         </div>
      </div>

      <!-- SCREENSHOTS -->
      <div class="app-card p-4 rounded-2xl mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
         <h3 class="font-bold text-lg mb-4 px-2">Gameplay Screenshots</h3>
         <div class="screenshot-carousel rounded-xl overflow-hidden shadow-lg aspect-video relative bg-black">
              <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/600x400?text=RC25+Gameplay'" />
         </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
          
          <!-- Features -->
          <div class="app-card p-6 rounded-2xl">
            <h3 class="text-xl font-bold mb-4">Mod Features</h3>
            <ul class="space-y-3 text-slate-600 dark:text-slate-300">
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Latest Jerseys of All teams</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Updated Sounds</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Updated Stadiums</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>All teams squads updated</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>New Shots</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>New Bowling Actions</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>New Teams (The Hundred)</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>All bugs fixed</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Ai Enhanced</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Updated Tournaments</span></li>
            </ul>
          </div>

          <!-- DOWNLOAD SECTION -->
          <div class="app-card p-6 rounded-2xl flex flex-col justify-between bg-slate-900 text-white shadow-xl">
            <div>
                <h3 class="text-xl font-bold mb-2 text-white">Free Download</h3>
                <p class="text-slate-400 text-sm mb-6">
                    This mod is completely free. Click below to download directly.
                </p>
            </div>
            
            <div class="space-y-3">
              ${downloadButtonHtml}
              ${adminControlsHtml}
            </div>
          </div>
      </div>
    </div>
    `;
}

// Admin: toggle enabled/disabled
window.toggleRc25Download = function () {
  if (!window.isAdmin) {
    alert('Only admin can change download status.');
    return;
  }
  if (!window.db) {
    alert('Database not ready.');
    return;
  }

  const defaultLink = 'https://dupload.net/o9cxh6xht397';
  const cfg = window.rc25Config || {};
  const currentEnabled = cfg.enabled !== false;
  const newEnabled = !currentEnabled;

  window.db.collection('gameConfig').doc('rc25')
    .set({ enabled: newEnabled, link: cfg.link || defaultLink }, { merge: true })
    .then(() => {
      window.rc25Config = { ...cfg, enabled: newEnabled };
      if (window.router && typeof window.router.handleRoute === 'function') {
        window.router.handleRoute('/rc25');
      }
    })
    .catch(err => {
      console.error('toggleRc25Download error:', err);
      alert('Failed to update status: ' + err.message);
    });
};

// Admin: update link
window.editRc25DownloadLink = function () {
  if (!window.isAdmin) {
    alert('Only admin can change download link.');
    return;
  }
  if (!window.db) {
    alert('Database not ready.');
    return;
  }

  const defaultLink = 'https://dupload.net/o9cxh6xht397';
  const cfg = window.rc25Config || {};
  const currentLink = cfg.link || defaultLink;

  const newLink = prompt('Enter new download link for RC25:', currentLink);
  if (!newLink) return;

  window.db.collection('gameConfig').doc('rc25')
    .set({ link: newLink }, { merge: true })
    .then(() => {
      window.rc25Config = { ...cfg, link: newLink };
      if (window.router && typeof window.router.handleRoute === 'function') {
        window.router.handleRoute('/rc25');
      }
    })
    .catch(err => {
      console.error('editRc25DownloadLink error:', err);
      alert('Failed to update link: ' + err.message);
    });
};

// Router ke liye
window.Rc25Page = Rc25Page;
