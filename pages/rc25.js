// pages/rc25.js

// Global config state (Defaults set immediately to prevent loading stuck)
window.rc25Config = {
  enabled: true,
  link: 'https://dupload.net/rovsuelnyeth' // Default link if DB fails
};
window.rc25ConfigLoaded = false;

// Background Fetch (Doesn't block UI)
window.fetchRc25ConfigBackground = function () {
  if (window.rc25ConfigLoaded || !window.db) {
    if (!window.db) setTimeout(window.fetchRc25ConfigBackground, 500); // Retry if DB not ready
    return;
  }

  window.db.collection('gameConfig').doc('rc25').get()
    .then(doc => {
      if (doc.exists) {
        window.rc25Config = doc.data();
        // If link changed or disabled, update UI live without refresh
        const btn = document.getElementById('main-download-btn');
        const statusBadge = document.getElementById('status-badge');
        
        if (btn && window.rc25Config.enabled === false) {
            btn.href = "javascript:void(0)";
            btn.innerHTML = `<span class="material-icons">lock</span> Temporarily Disabled`;
            btn.classList.add('grayscale', 'cursor-not-allowed');
        } else if (btn) {
            btn.href = window.rc25Config.link;
        }
      }
      window.rc25ConfigLoaded = true;
    })
    .catch(err => console.warn('Config fetch error, using defaults', err));
};

function Rc25Page() {
  // Trigger background fetch
  window.fetchRc25ConfigBackground();

  const isAdmin = !!window.isAdmin;
  const youtubeVideoId = 'K9xpbC-Po6o'; // Your v7+ Video ID
  const channelLink = 'https://youtube.com/@starkmodsofficial18';

  // Admin Controls HTML
  const adminControls = isAdmin ? `
    <div class="mt-8 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md">
      <div class="flex justify-between items-center mb-3">
        <span class="text-xs font-black uppercase tracking-widest text-slate-500">Admin Controls</span>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button onclick="window.toggleRc25Download()" class="btn bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs py-2 shadow-sm border border-slate-200 dark:border-slate-600">
          Toggle Status
        </button>
        <button onclick="window.editRc25DownloadLink()" class="btn bg-blue-600 text-white text-xs py-2 shadow-blue-500/30">
          Update Link
        </button>
      </div>
    </div>` : '';

  return `
  <div class="max-w-5xl mx-auto animate-fade-in pb-32 px-3 sm:px-6 relative">
    
    <nav class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 bg-white/40 dark:bg-black/20 backdrop-blur-md py-2 px-4 rounded-full w-fit border border-white/20">
      <a href="/" class="hover:text-blue-600 transition flex items-center gap-1"><span class="material-icons text-sm">home</span> Home</a>
      <span class="material-icons text-[10px] opacity-50">chevron_right</span>
      <span class="text-slate-900 dark:text-white">RC25 Patch</span>
    </nav>

    <div class="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 group border border-white/30 dark:border-slate-700/50">
      
      <div class="absolute inset-0">
        <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-[2s]" onerror="this.src='https://placehold.co/800x600?text=RC25+v7+'">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div class="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div> </div>
      
      <div class="relative z-10 p-6 sm:p-12 flex flex-col items-center text-center justify-end min-h-[450px]">
        
        <div id="status-badge" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-xl border border-white/30 shadow-lg">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]"></span> v7+ Live Now
        </div>

        <h1 class="text-4xl sm:text-7xl font-black text-white mb-3 tracking-tight drop-shadow-lg leading-none">
          RC25 <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">REBORN</span>
        </h1>
        
        <p class="text-slate-200 max-w-lg mb-8 text-sm sm:text-lg font-medium drop-shadow-md opacity-90">
          Experience the biggest update yet. Updated Squads, New Jerseys, and 4K Textures.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
           <a id="main-download-btn" href="${window.rc25Config.link}" target="_blank" class="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-slate-100 transition shadow-xl flex items-center justify-center gap-2 transform active:scale-95">
             <span class="material-icons">download</span> Download Patch
           </a>
           <a href="#video-guide" class="w-full sm:w-auto px-8 py-4 bg-white/20 text-white border border-white/30 rounded-2xl font-bold backdrop-blur-md hover:bg-white/30 transition flex items-center justify-center gap-2">
             <span class="material-icons">play_circle</span> Watch Trailer
           </a>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 space-y-6">
        
        <div class="grid grid-cols-3 gap-3">
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-2xl p-4 text-center shadow-sm">
                <div class="text-2xl font-black text-blue-600">30+</div>
                <div class="text-[9px] uppercase font-bold text-slate-500">New Shots</div>
            </div>
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-2xl p-4 text-center shadow-sm">
                <div class="text-2xl font-black text-purple-600">4K</div>
                <div class="text-[9px] uppercase font-bold text-slate-500">Graphics</div>
            </div>
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-2xl p-4 text-center shadow-sm">
                <div class="text-2xl font-black text-green-600">100%</div>
                <div class="text-[9px] uppercase font-bold text-slate-500">Safe</div>
            </div>
        </div>

        <div id="video-guide" class="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-700 rounded-[2rem] p-2 shadow-xl">
          <div class="relative w-full aspect-video rounded-[1.5rem] overflow-hidden bg-black shadow-inner">
            <iframe class="absolute inset-0 w-full h-full" 
                    src="https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1" 
                    title="RC25 Installation" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
          </div>
          <div class="p-4 flex justify-between items-center">
             <div>
                <h3 class="font-bold text-slate-900 dark:text-white">Installation Guide</h3>
                <p class="text-xs text-slate-500">Watch carefully to avoid errors.</p>
             </div>
             <a href="${channelLink}" target="_blank" class="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/30 hover:bg-red-700 transition">
               Subscribe
             </a>
          </div>
        </div>

        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
           <h3 class="text-lg font-bold mb-6 text-slate-900 dark:text-white px-2">Update Log</h3>
           <div class="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
              <div class="relative pl-8">
                 <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800 animate-pulse shadow-lg shadow-blue-500/50"></div>
                 <h4 class="font-bold text-blue-600 dark:text-blue-400 text-sm">Version 8.0 (Coming Soon)</h4>
                 <p class="text-xs text-slate-500 mt-1 leading-relaxed">Auction 2025 Roster, New Commentary packs & Career Mode crash fix.</p>
              </div>
              <div class="relative pl-8">
                 <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400"></div>
                 <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">Version 7+ (Current)</h4>
                 <p class="text-xs text-slate-500 mt-1 leading-relaxed">Added The Hundred, Realistic Lighting, and fixed texture bugs.</p>
              </div>
           </div>
        </div>

      </div>

      <div class="space-y-6">
        
        <div class="relative rounded-3xl p-6 overflow-hidden shadow-2xl text-center group cursor-pointer" onclick="window.router.navigateTo('/rc20')">
           <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-90 transition group-hover:scale-105 duration-700"></div>
           <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
           
           <div class="relative z-10">
             <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md text-white border border-white/20">
                <span class="material-icons">diamond</span>
             </div>
             <h3 class="text-xl font-bold text-white mb-2">Go Premium</h3>
             <p class="text-indigo-100 text-xs mb-6 leading-relaxed">
               Unlock Unlimited Coins, Tickets & All Tournaments in our <strong>RC20 VIP Menu</strong>.
             </p>
             <button class="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm">
               View RC20 Mod
             </button>
           </div>
        </div>

        ${adminControls}

      </div>

    </div>
  </div>`;
}

// Admin Helpers
window.toggleRc25Download = function () {
  const db = window.db;
  const cfg = window.rc25Config || {};
  db.collection('gameConfig').doc('rc25').set({ enabled: !cfg.enabled, link: cfg.link }, { merge: true })
    .then(() => { 
        window.rc25Config.enabled = !cfg.enabled; 
        window.Rc25Page && (document.getElementById('app-content').innerHTML = window.Rc25Page()); 
    });
};

window.editRc25DownloadLink = function () {
  const link = prompt("New Download Link:", window.rc25Config?.link || "");
  if(link) {
    window.db.collection('gameConfig').doc('rc25').set({ link }, { merge: true })
      .then(() => { 
          window.rc25Config.link = link; 
          window.Rc25Page && (document.getElementById('app-content').innerHTML = window.Rc25Page()); 
      });
  }
};

window.Rc25Page = Rc25Page;
