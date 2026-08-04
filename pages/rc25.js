// pages/rc25.js

// Global config state (Defaults set immediately to prevent loading stuck)
window.rc25Config = {
  enabled: true,
  link: 'https://dupload.net/iznn1jwit3m4' // Updated v8 Beta Release Link
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

    <div class="relative rounded-[2rem] overflow-hidden shadow-2xl mb-8 group border border-white/30 dark:border-slate-700/50 bg-white/10 dark:bg-black/30 backdrop-blur-xl">
      
      <div class="p-6 sm:p-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left relative z-10">
         <img src="assets/icons/logo_rc25_v8_beta.png" class="w-32 h-32 rounded-[1.5rem] shadow-2xl border border-white/20 dark:border-slate-700 object-cover transform group-hover:scale-105 transition duration-500" onerror="this.src='https://placehold.co/128?text=RC25'">
         
         <div class="flex-1">
            <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight leading-none">
              Real Cricket 25 Patch
            </h1>
            <p class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
              Project Reborn v8 Beta • Revolutionary Update
            </p>
            
            <div class="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
               <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide border border-blue-200 dark:border-blue-800">
                 #1 Sports Mod
               </span>
               <span class="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wide border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                 <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> v8 Beta Live
               </span>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
               <a id="main-download-btn" href="${window.rc25Config.link}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition transform active:scale-95 text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                 <span class="material-icons text-sm">download</span> Download Beta
               </a>
            </div>
         </div>
      </div>
      
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
    </div>

    <!-- PREVIEW SECTION - WORKING SCREENSHOTS -->
    <section class="mb-10">
       <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 px-2">Preview</h2>
       <div class="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory no-scrollbar px-2" style="scroll-padding-left: 0;">
          ${[1, 2, 3, 4, 5].map(i => `
            <div class="snap-center shrink-0 first:pl-0 last:pr-4 group">
               <img src="assets/img/img_rc25_V8_${i}.jpg" 
                    class="h-48 sm:h-64 w-auto rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 object-cover select-none pointer-events-none transition transform group-hover:scale-[1.02]"
                    onerror="this.src='https://placehold.co/600x300?text=Screenshot+${i}'">
            </div>
          `).join('')}
       </div>
    </section>

    <div class="grid lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 space-y-6">
        
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
           <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">About This Update</h3>
           <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
             Version 8 Beta is our most ambitious release yet, bringing revolutionary changes to mobile cricket gaming. Experience next-level realism with advanced graphics, mechanics, and entirely new assets.
           </p>
           
           <div class="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
             <span class="material-icons text-amber-500 shrink-0">warning</span>
             <p class="text-xs text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
               <strong>Beta Testing Version:</strong> Please note that this is a beta testing version and it may contain bugs. Enjoy this until the mega update releases this month, featuring a major update of cutscenes and an upcoming mod creator!
             </p>
           </div>
        </div>

        <!-- APPLYING PROCESS VIDEO -->
        <div class="bg-slate-900 rounded-[2rem] p-1.5 shadow-2xl overflow-hidden ring-1 ring-white/10">
          <div class="relative w-full aspect-video rounded-[1.5rem] overflow-hidden bg-black">
            <iframe class="absolute inset-0 w-full h-full" 
                    src="https://www.youtube.com/embed/${installationVideoId}?rel=0&modestbranding=1" 
                    title="RC25 Installation" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
            </iframe>
          </div>
          <div class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
             <div>
                <h3 class="font-bold text-white text-sm">Applying Process</h3>
                <p class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Watch for smooth installation & avoid errors</p>
             </div>
             <a href="${channelLink}" target="_blank" class="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/30 hover:bg-red-700 transition flex items-center gap-1 whitespace-nowrap">
               <span class="material-icons text-sm">subscriptions</span> Subscribe
             </a>
          </div>
        </div>

        <!-- CHANGELOG -->
        <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
           <h3 class="text-lg font-bold mb-6 text-slate-900 dark:text-white">What's New</h3>
           <div class="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
              <div class="relative pl-8">
                 <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800 animate-pulse shadow-lg shadow-blue-500/50"></div>
                 <h4 class="font-bold text-blue-600 dark:text-blue-400 text-sm">v8 Beta (Current)</h4>
                 <ul class="mt-2 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>2 New Scorebars</strong> for enhanced broadcast realism</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>35+ New Shots & Bowling Actions</strong> added</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>Updated Squads</strong> for all international and domestic teams</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>New Teams Added</strong> in PSL, CPL, and BPL tournaments</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>Current Team Jerseys</strong> fully updated across the board</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>Major Graphics Improvement</strong> covering stadiums and lighting</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>New Commentary</strong> featuring Irfan Pathan</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>Enhanced Audio:</strong> All game sounds improved and fixed</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span><strong>New Camera Angles & Improved AI</strong> for challenging gameplay</span></li>
                     <li class="flex items-start gap-2"><span class="text-blue-500 font-black">•</span> <span>And many more tweaks and additions!</span></li>
                 </ul>
              </div>
              <div class="relative pl-8">
                 <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-400"></div>
                 <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">Version 7+ (Previous)</h4>
                 <p class="text-xs text-slate-500 mt-1 leading-relaxed">Added The Hundred, realistic lighting, and fixed texture bugs.</p>
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
  </style>`;
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
