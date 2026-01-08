// pages/rc25.js

// Global config state
window.rc25Config = window.rc25Config || null;
window.rc25ConfigLoaded = window.rc25ConfigLoaded || false;
window._rc25ConfigLoading = window._rc25ConfigLoading || false;

// Load config from Firestore once
window.loadRc25ConfigOnce = function () {
  if (window.rc25ConfigLoaded || window._rc25ConfigLoading) return;
  if (!window.db) { setTimeout(window.loadRc25ConfigOnce, 200); return; }

  window._rc25ConfigLoading = true;
  window.db.collection('gameConfig').doc('rc25').get()
    .then(doc => {
      window._rc25ConfigLoading = false;
      window.rc25ConfigLoaded = true;
      window.rc25Config = doc.exists ? (doc.data() || {}) : {};
      if (window.router) window.router.handleRoute('/rc25');
    })
    .catch(() => { window._rc25ConfigLoading = false; window.rc25ConfigLoaded = true; });
};

function Rc25Page() {
  if (!window.rc25ConfigLoaded) {
    window.loadRc25ConfigOnce();
    return `<div class="max-w-4xl mx-auto py-20 text-center"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div></div>`;
  }

  const isAdmin = !!window.isAdmin;
  const cfg = window.rc25Config || {};
  const enabled = cfg.enabled !== false;
  const downloadLink = cfg.link || 'https://dupload.net/rovsuelnyeth';
  const youtubeVideoId = 'AyCpwTJWVKc'; // Replace with your actual Video ID (not full URL)

  // Download Button Logic
  const downloadBtn = enabled
    ? `<a href="${downloadLink}" target="_blank" class="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
         <span class="material-icons group-hover:animate-bounce">download</span> 
         <span>Download RC25 Patch v7+</span>
       </a>`
    : `<button disabled class="w-full py-4 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-2xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
         <span class="material-icons">lock_clock</span> Download Paused (Update Coming)
       </button>`;

  // Admin Controls
  const adminControls = isAdmin ? `
    <div class="mt-6 p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs">
      <div class="flex justify-between items-center mb-2">
        <span class="text-slate-300 font-bold">👑 Admin Panel</span>
        <span class="px-2 py-0.5 rounded ${enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} font-bold">
          ${enabled ? 'ACTIVE' : 'DISABLED'}
        </span>
      </div>
      <div class="flex gap-2">
        <button onclick="window.toggleRc25Download()" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold transition">
          ${enabled ? 'Disable' : 'Enable'}
        </button>
        <button onclick="window.editRc25DownloadLink()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition">
          Change Link
        </button>
      </div>
    </div>` : '';

  return `
  <div class="max-w-5xl mx-auto animate-fade-in pb-24 px-4">
    
    <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
      <a href="/" class="hover:text-blue-600 transition flex items-center gap-1"><span class="material-icons text-sm">home</span> Home</a>
      <span class="material-icons text-xs">chevron_right</span>
      <span class="text-slate-800 dark:text-white font-bold">RC25 Patch</span>
    </nav>

    <div class="relative rounded-3xl overflow-hidden bg-black shadow-2xl mb-8 group">
      <div class="absolute inset-0">
        <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" onerror="this.src='https://placehold.co/800x400?text=RC25+Banner'">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>
      
      <div class="relative z-10 p-8 sm:p-12 flex flex-col items-start justify-end h-[400px] sm:h-[500px]">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md border border-white/20">
          <span class="material-icons text-xs">verified</span> Official Patch
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-white mb-2 leading-tight">
          REAL CRICKET 25 <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">PROJECT REBORN</span>
        </h1>
        <p class="text-slate-300 max-w-lg mb-6 text-sm sm:text-base">
          Keeping the legacy alive. The most advanced community patch for RC20 with updated squads, jerseys, stadiums, and 30+ new shots.
        </p>
        <div class="flex flex-wrap gap-3">
           <a href="#download-area" class="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-2">
             <span class="material-icons">download</span> Get v7+
           </a>
           <a href="https://youtube.com/@YourChannel" target="_blank" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
             <span class="material-icons">play_arrow</span> Watch Trailer
           </a>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-8">
        
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <h3 class="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-blue-500">star</span> Key Features
          </h3>
          <div class="grid sm:grid-cols-2 gap-4">
            ${['Updated 2025 Squads', 'Realistic Faces', 'New Bowling Actions', 'The Hundred Tournament', '4K Stadium Textures', '30+ New Batting Shots', 'Updated Scoreboards', 'No Root Required'].map(f => `
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <span class="material-icons text-green-500 text-sm">check_circle</span>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">${f}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm overflow-hidden">
          <div class="flex justify-between items-center mb-4">
             <h3 class="text-xl font-bold text-slate-900 dark:text-white">Installation Guide</h3>
             <span class="text-xs font-bold text-red-500 flex items-center gap-1"><span class="material-icons text-sm">smart_display</span> Watch First</span>
          </div>
          <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
            <iframe class="absolute inset-0 w-full h-full" 
                    src="https://www.youtube.com/embed/${youtubeVideoId}?rel=0" 
                    title="Installation Guide" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
          </div>
          <p class="text-xs text-slate-500 mt-3 text-center">Follow the video carefully to avoid "OBB Error".</p>
        </div>

        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
           <h3 class="text-xl font-bold mb-6 text-slate-900 dark:text-white">Update Timeline</h3>
           <div class="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
              <div class="relative pl-8">
                 <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-800 animate-pulse"></div>
                 <h4 class="font-bold text-blue-600">Version 8.0 (Upcoming)</h4>
                 <p class="text-xs text-slate-500 mt-1">Mega update with Career Mode fixes, IPL 2025 Auction rosters, and new commentary.</p>
              </div>
              <div class="relative pl-8 opacity-70">
                 <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400"></div>
                 <h4 class="font-bold text-slate-800 dark:text-slate-200">Version 7+ (Current)</h4>
                 <p class="text-xs text-slate-500 mt-1">Added "The Hundred", Fixed crash issues, Enhanced lighting.</p>
              </div>
              <div class="relative pl-8 opacity-50">
                 <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400"></div>
                 <h4 class="font-bold text-slate-800 dark:text-slate-200">Version 1 - 6</h4>
                 <p class="text-xs text-slate-500 mt-1">The beginning of the legacy. Basic texture replacements.</p>
              </div>
           </div>
        </div>

      </div>

      <div class="space-y-6">
        
        <div id="download-area" class="sticky top-24 bg-white dark:bg-slate-800 border-2 border-blue-500/20 dark:border-blue-500/20 rounded-3xl p-6 shadow-xl text-center">
           <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mx-auto flex items-center justify-center mb-4 text-blue-600">
             <span class="material-icons text-3xl">cloud_download</span>
           </div>
           <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1">Ready to Play?</h3>
           <p class="text-xs text-slate-500 mb-6">100% Safe • No Virus • Password in Video</p>
           
           ${downloadButtonHtml}
           
           <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
             ${adminControls}
           </div>
        </div>

        <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
           <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           
           <div class="relative z-10">
             <h3 class="text-lg font-bold mb-2">Want More Power?</h3>
             <p class="text-xs text-indigo-100 mb-4">
               Check out our <strong>Premium RC20 Mod Menu</strong> with Unlimited Coins, Tickets & All Tournaments Unlocked.
             </p>
             <button onclick="window.router.navigateTo('/rc20')" class="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition flex items-center justify-center gap-2">
               <span>Check Premium Mod</span> <span class="material-icons text-sm">arrow_forward</span>
             </button>
           </div>
        </div>

      </div>

    </div>
  </div>`;
}

// Admin Helpers
window.toggleRc25Download = function () {
  const db = window.db;
  const cfg = window.rc25Config || {};
  db.collection('gameConfig').doc('rc25').set({ enabled: !cfg.enabled, link: cfg.link }, { merge: true })
    .then(() => { window.rc25Config.enabled = !cfg.enabled; window.router.handleRoute('/rc25'); });
};

window.editRc25DownloadLink = function () {
  const link = prompt("New Download Link:", window.rc25Config?.link || "");
  if(link) {
    window.db.collection('gameConfig').doc('rc25').set({ link }, { merge: true })
      .then(() => { window.rc25Config.link = link; window.router.handleRoute('/rc25'); });
  }
};

window.Rc25Page = Rc25Page;
