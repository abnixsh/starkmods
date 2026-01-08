// pages/rc25.js

// Global config state
window.rc25Config = {
  enabled: true,
  link: 'https://dupload.net/rovsuelnyeth' // Default Download Link
};
window.rc25ConfigLoaded = false;

// Background Fetch
window.fetchRc25ConfigBackground = function () {
  if (window.rc25ConfigLoaded || !window.db) {
    if (!window.db) setTimeout(window.fetchRc25ConfigBackground, 500);
    return;
  }

  window.db.collection('gameConfig').doc('rc25').get()
    .then(doc => {
      if (doc.exists) {
        window.rc25Config = doc.data();
        const btn = document.getElementById('main-download-btn');
        const stickyBtn = document.getElementById('sticky-download-btn');
        
        // Update Buttons Live
        if (window.rc25Config.enabled === false) {
            if(btn) {
                btn.href = "javascript:void(0)";
                btn.innerHTML = `<span class="material-icons">lock</span> Disabled`;
                btn.classList.add('grayscale', 'cursor-not-allowed');
            }
            if(stickyBtn) stickyBtn.style.display = 'none';
        } else {
            if(btn) btn.href = window.rc25Config.link;
            if(stickyBtn) stickyBtn.href = window.rc25Config.link;
        }
      }
      window.rc25ConfigLoaded = true;
    })
    .catch(err => console.warn('Config fetch error', err));
};

function Rc25Page() {
  window.fetchRc25ConfigBackground();

  const isAdmin = !!window.isAdmin;
  const v7TrailerLink = 'https://youtu.be/K9xpbC-Po6o'; // Your v7+ Trailer
  // 👇 REPLACE THIS with your actual "Applying Process" video ID
  const installationVideoId = 'AyCpwTJWVKc'; 
  const channelLink = 'https://youtube.com/@starkmodsofficial18';

  // Admin Controls
  const adminControls = isAdmin ? `
    <div class="mb-8 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md">
      <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Admin Tools</div>
      <div class="grid grid-cols-2 gap-3">
        <button onclick="window.toggleRc25Download()" class="btn bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs py-2 shadow-sm">Toggle Status</button>
        <button onclick="window.editRc25DownloadLink()" class="btn bg-blue-600 text-white text-xs py-2">Update Link</button>
      </div>
    </div>` : '';

  return `
  <div class="max-w-5xl mx-auto animate-fade-in pb-32 px-4 sm:px-6 relative">
    
    <nav class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 mt-4">
      <a href="/" class="hover:text-blue-600 transition flex items-center gap-1"><span class="material-icons text-sm">arrow_back_ios</span> Games</a>
      <span class="text-slate-900 dark:text-white">RC25 Patch</span>
    </nav>

    <header class="flex flex-col sm:flex-row gap-6 mb-10 relative z-10">
       <div class="mx-auto sm:mx-0 shrink-0">
          <img src="assets/icons/icon_rc25.jpg" class="w-32 h-32 rounded-[1.5rem] shadow-2xl border border-white/20 dark:border-slate-700 object-cover" onerror="this.src='https://placehold.co/128?text=RC25'">
       </div>
       
       <div class="flex flex-col justify-center text-center sm:text-left flex-1">
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">
            Real Cricket 25 Patch
          </h1>
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
            Project Reborn v7+ • Realistic Graphics
          </p>
          
          <div class="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
             <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide">
               #1 Sports Mod
             </span>
             <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
               4+ Years Old
             </span>
          </div>

          <div class="flex gap-3 justify-center sm:justify-start">
             <a id="main-download-btn" href="${window.rc25Config.link}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/30 transition transform active:scale-95 text-sm uppercase tracking-wide">
               GET
             </a>
             <a href="${v7TrailerLink}" target="_blank" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2.5 rounded-full font-bold transition flex items-center gap-1 text-sm">
               <span class="material-icons text-base">play_arrow</span> Trailer
             </a>
          </div>
       </div>
    </header>

    <hr class="border-slate-200 dark:border-slate-800 mb-10">

    <section class="mb-12">
       <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Preview</h2>
       
       <div class="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory no-scrollbar" style="scroll-padding-left: 0;">
          ${[1, 2, 3, 4, 5].map(i => `
            <div class="snap-center shrink-0 first:pl-0 last:pr-4">
               <img src="assets/img/img_rc25_${i}.jpg" 
                    class="h-64 sm:h-80 w-auto rounded-[1.5rem] shadow-xl border border-slate-200/50 dark:border-slate-700/50 object-cover select-none pointer-events-none"
                    onerror="this.src='https://placehold.co/600x300?text=Screenshot+${i}'">
            </div>
          `).join('')}
       </div>
    </section>

    <hr class="border-slate-200 dark:border-slate-800 mb-10">

    <div class="grid md:grid-cols-3 gap-8">
       <div class="md:col-span-2 space-y-8">
          
          <section>
             <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3">About This Patch</h2>
             <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
               The most advanced community patch for RC20. We have updated everything from Squads to Stadiums. 
               Experience realistic textures, new commentary, and updated gameplay mechanics.
               <br><br>
               <strong>Version 8.0 Coming Soon:</strong> Includes Career Mode crash fix and IPL 2025 Auction rosters.
             </p>
          </section>

          <section>
             <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">What's New</h2>
             <div class="grid sm:grid-cols-2 gap-3">
                ${['The Hundred Tournament', '4K Stadium Textures', 'Realistic Faces', 'New Bowling Actions', 'Updated Scoreboards', 'No Root Required'].map(f => `
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span class="material-icons text-blue-500 text-sm">star</span>
                    <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">${f}</span>
                  </div>
                `).join('')}
             </div>
          </section>

          <section id="install-guide" class="bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden">
             <div class="relative w-full aspect-video rounded-[1.2rem] overflow-hidden bg-black">
                <iframe class="absolute inset-0 w-full h-full" 
                        src="https://www.youtube.com/embed/${installationVideoId}?rel=0" 
                        title="Applying Process" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
             </div>
             <div class="p-4 text-center">
                <div class="text-white font-bold mb-1">Applying Process</div>
                <div class="text-slate-400 text-xs">Watch carefully to avoid OBB errors</div>
             </div>
          </section>

       </div>

       <div class="space-y-6">
          
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm">
             <div class="text-5xl font-black text-slate-900 dark:text-white mb-1">4.9</div>
             <div class="flex justify-center text-amber-400 mb-2">
                <span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span><span class="material-icons text-sm">star</span>
             </div>
             <div class="text-xs text-slate-400 font-bold uppercase tracking-widest">20K+ Ratings</div>
          </div>

          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-6 shadow-xl text-center cursor-pointer transition transform hover:scale-[1.02]" onclick="window.router.navigateTo('/rc20')">
             <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
             
             <h3 class="text-lg font-bold mb-2 relative z-10">Go Premium</h3>
             <p class="text-xs text-indigo-100 mb-4 relative z-10">
                Get Unlimited Coins & All Tournaments Unlocked in RC20.
             </p>
             <button class="bg-white text-indigo-600 w-full py-2.5 rounded-xl font-bold text-sm shadow-md">
                View RC20 Mod
             </button>
          </div>

          ${adminControls}

       </div>
    </div>

  </div>
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
