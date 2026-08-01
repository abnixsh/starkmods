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

// Show unavailable message
window.showUnavailableMessage = function() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
    <div class="relative bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 transform animate-scale-in">
      <div class="text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span class="material-icons text-white text-3xl">schedule</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-3">Not Available Yet!</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          RC25 v8.0 Beta is currently under final testing. Download will be available on <strong class="text-orange-600 dark:text-orange-400">August 2nd, 2026</strong>.
        </p>
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 mb-6 border border-orange-200 dark:border-orange-800">
          <p class="text-xs text-orange-800 dark:text-orange-300 font-semibold">
            ⏱️ Stay tuned! We're working hard to bring you the best experience.
          </p>
        </div>
        <button onclick="this.closest('.fixed').remove()" class="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]">
          Got it, Thanks!
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

function Rc25Page() {
  // Trigger background fetch
  window.fetchRc25ConfigBackground();

  const isAdmin = !!window.isAdmin;
  const v7TrailerLink = 'https://youtu.be/K9xpbC-Po6o'; // Your v7+ Trailer
  const installationVideoId = 'AyCpwTJWVKc'; 
  const channelLink = 'https://youtube.com/@starkofficial17';

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

    <!-- BETA ANNOUNCEMENT BANNER -->
    <div class="relative rounded-[2rem] overflow-hidden shadow-2xl mb-6 border border-orange-500/50 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 p-1">
      <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[1.7rem] p-6">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <span class="material-icons text-white text-xl">science</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            v8.0 BETA COMING SOON
          </h2>
        </div>
        <p class="text-center text-sm text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto">
          We're finalizing the biggest update yet! Beta testing is underway. Official release on <strong class="text-orange-600 dark:text-orange-400">August 2nd, 2026</strong>.
        </p>
        <div class="text-center">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-bold border border-orange-300 dark:border-orange-700">
            <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            Under Beta Testing • Releasing Anytime on Aug 2, 2026
          </span>
        </div>
      </div>
    </div>

    <div class="relative rounded-[2rem] overflow-hidden shadow-2xl mb-8 group border border-white/30 dark:border-slate-700/50 bg-white/10 dark:bg-black/30 backdrop-blur-xl">
      
      <div class="p-6 sm:p-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left relative z-10">
         <img src="assets/icons/icon_rc25.jpg" class="w-32 h-32 rounded-[1.5rem] shadow-2xl border border-white/20 dark:border-slate-700 object-cover transform group-hover:scale-105 transition duration-500" onerror="this.src='https://placehold.co/128?text=RC25'">
         
         <div class="flex-1">
            <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight leading-none">
              Real Cricket 25 Patch
            </h1>
            <p class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
              Project Reborn v8.0 Beta • Revolutionary Update
            </p>
            
            <div class="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
               <span class="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-[10px] font-bold uppercase tracking-wide border border-orange-200 dark:border-orange-800">
                 Beta Testing
               </span>
               <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide border border-blue-200 dark:border-blue-800">
                 #1 Sports Mod
               </span>
               <span class="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-[10px] font-bold uppercase tracking-wide border border-red-200 dark:border-red-800 flex items-center gap-1">
                 <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Aug 2, 2026
               </span>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
               <button onclick="window.showUnavailableMessage()" class="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition transform active:scale-95 text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-not-allowed opacity-75">
                 <span class="material-icons text-sm">lock</span> Download Locked
               </button>
               <button onclick="window.showUnavailableMessage()" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-2xl font-bold transition flex items-center justify-center gap-2 text-sm border border-slate-200 dark:border-slate-700 opacity-75 cursor-not-allowed">
                 <span class="material-icons text-base">play_arrow</span> Trailer Soon
               </button>
            </div>
         </div>
      </div>
      
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -z-10"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -z-10"></div>
    </div>

    <!-- HIDDEN PREVIEW SECTION (Blurred & Locked) -->
    <section class="mb-10 relative">
       <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 px-2 flex items-center gap-2">
         <span class="material-icons text-orange-500">visibility_off</span>
         Preview (Coming Aug 2nd)
       </h2>
       <div class="relative">
         <div class="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-md z-10 rounded-3xl flex items-center justify-center border-2 border-orange-500/50">
           <div class="text-center p-6">
             <div class="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-bounce">
               <span class="material-icons text-white text-3xl">lock</span>
             </div>
             <h3 class="text-2xl font-black text-white mb-2">Screenshots Locked</h3>
             <p class="text-orange-200 text-sm max-w-sm">Exclusive previews will be revealed on release day!</p>
           </div>
         </div>
         <div class="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory no-scrollbar px-2 blur-lg grayscale" style="scroll-padding-left: 0;">
            ${[1, 2, 3, 4, 5].map(i => `
              <div class="snap-center shrink-0 first:pl-0 last:pr-4">
                 <div class="h-48 sm:h-64 w-80 rounded-2xl bg-slate-300 dark:bg-slate-700"></div>
              </div>
            `).join('')}
         </div>
       </div>
    </section>

    <div class="grid lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
           <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
             <span class="material-icons text-orange-500">science</span>
             About v8.0 Beta
           </h3>
           <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
             The most ambitious update in RC25 history is under final testing! Version 8.0 brings revolutionary changes that will redefine mobile cricket gaming.
             <br><br>
             <span class="text-orange-600 dark:text-orange-400 font-bold">🔒 Features Under Wraps:</span> We're keeping everything secret until release day to surprise you with the biggest update ever!
             <br><br>
             <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-bold mt-3">
               <span class="material-icons text-sm">calendar_today</span>
               Releasing Anytime on August 2, 2026
             </span>
           </p>
        </div>

        <!-- INSTALLATION VIDEO (Keep for v7+) -->
        <div class="bg-slate-900 rounded-[2rem] p-1.5 shadow-2xl overflow-hidden ring-1 ring-white/10">
          <div class="relative w-full aspect-video rounded-[1.5rem] overflow-hidden bg-black">
            <iframe class="absolute inset-0 w-full h-full" 
                    src="https://www.youtube.com/embed/${installationVideoId}?rel=0&modestbranding=1" 
                    title="RC25 Installation" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
          </div>
          <div class="p-4 flex justify-between items-center">
             <div>
                <h3 class="font-bold text-white text-sm">Installation Guide (v7+)</h3>
                <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Watch for smooth installation</p>
             </div>
             <a href="${channelLink}" target="_blank" class="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/30 hover:bg-red-700 transition flex items-center gap-1">
               <span class="material-icons text-sm">subscriptions</span> Subscribe
             </a>
          </div>
        </div>

        <!-- UPDATED CHANGELOG -->
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
           <h3 class="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
             <span class="material-icons text-orange-500">new_releases</span>
             Version Timeline
           </h3>
           <div class="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
              <div class="relative pl-8">
                 <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 ring-4 ring-white dark:ring-slate-800 animate-pulse shadow-lg shadow-orange-500/50"></div>
                 <h4 class="font-bold text-orange-600 dark:text-orange-400 text-sm flex items-center gap-2">
                   Version 8.0 Beta <span class="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded text-[9px] uppercase font-black">Aug 2, 2026</span>
                 </h4>
                 <div class="mt-3 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                   <p class="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-2">🤫 Features Classified</p>
                   <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                     <li class="flex items-center gap-2"><span class="text-orange-500">▸</span> Major gameplay overhaul</li>
                     <li class="flex items-center gap-2"><span class="text-orange-500">▸</span> Next-gen graphics engine</li>
                     <li class="flex items-center gap-2"><span class="text-orange-500">▸</span> Revolutionary new features</li>
                     <li class="flex items-center gap-2"><span class="text-orange-500">▸</span> Complete squad updates</li>
                     <li class="flex items-center gap-2"><span class="text-orange-500">▸</span> And much more... 🔥</li>
                   </ul>
                   <div class="mt-3 text-center">
                     <span class="text-[10px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-wider">Full changelog releasing on Aug 2nd</span>
                   </div>
                 </div>
              </div>
              <div class="relative pl-8">
                 <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400"></div>
                 <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">Version 7+ (Previous)</h4>
                 <p class="text-xs text-slate-500 mt-1 leading-relaxed">Added The Hundred, Realistic Lighting, and fixed texture bugs.</p>
              </div>
           </div>
        </div>

      </div>

      <div class="space-y-6">
        
        <!-- PREMIUM CARD -->
        <div class="relative rounded-3xl p-6 overflow-hidden shadow-2xl text-center group cursor-pointer border border-white/10" onclick="window.router.navigateTo('/rc20')">
           <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-90 transition group-hover:scale-105 duration-700"></div>
           
           <div class="relative z-10">
             <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md text-white border border-white/20 shadow-inner">
                <span class="material-icons">diamond</span>
             </div>
             <h3 class="text-xl font-bold text-white mb-2">Go Premium</h3>
             <p class="text-indigo-100 text-xs mb-6 leading-relaxed px-4">
               Unlock Unlimited Coins, Tickets & All Tournaments in our <strong>RC20 VIP Menu</strong>.
             </p>
             <button class="w-full py-3 bg-white text-indigo-700 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm transition transform hover:scale-[1.02]">
               View RC20 Mod
             </button>
           </div>
        </div>

        <!-- NOTIFICATION CARD -->
        <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-2xl border border-white/20">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <span class="material-icons">notifications_active</span>
            </div>
            <h3 class="font-bold text-lg">Stay Updated</h3>
          </div>
          <p class="text-white/90 text-xs leading-relaxed mb-4">
            Subscribe to our YouTube channel to get notified the moment v8.0 Beta drops on August 2nd!
          </p>
          <a href="${channelLink}" target="_blank" class="w-full py-3 bg-white text-red-600 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm transition transform hover:scale-[1.02]">
            <span class="material-icons text-sm">subscriptions</span> Subscribe Now
          </a>
        </div>

        ${adminControls}

      </div>

    </div>
  </div>
  
  <style>
    @keyframes scale-in {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-scale-in {
      animation: scale-in 0.3s ease-out;
    }
  </style>
  `;
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
