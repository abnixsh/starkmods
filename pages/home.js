// pages/home.js

// Global state for hidden cards
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

// --- 1. LOGIC: FETCH CONFIG ---
window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) {
    setTimeout(window.loadHomeHiddenCardsOnce, 200);
    return;
  }
  window._homeConfigFetchStarted = true;

  db.collection('siteConfig').doc('homeCards')
    .get()
    .then(doc => {
      const data = doc.exists ? (doc.data() || {}) : {};
      window.homeHiddenCards = Array.isArray(data.hidden) ? data.hidden : [];
      window.homeConfigLoaded = true;
      if (window.router && location.pathname.replace(/\/$/, '') === '/') {
        window.router.handleRoute('/');
      }
    })
    .catch(err => {
      console.error('loadHomeHiddenCardsOnce error:', err);
      window.homeHiddenCards = [];
      window.homeConfigLoaded = true;
    });
};

// --- 2. MAIN COMPONENT ---
function HomePage() {
  window.loadHomeHiddenCardsOnce();

  const isAdmin = !!window.isAdmin;
  const hiddenCards = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards : [];
  const isHidden = (id) => hiddenCards.includes(id);

  // --- STYLES: FONTS & ANIMATIONS ---
  const customStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Oleo+Script:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
      
      .font-cursive { font-family: 'Oleo Script', cursive; }
      .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }

      @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        33% { transform: translate(30px, -50px) rotate(10deg); }
        66% { transform: translate(-20px, 20px) rotate(-5deg); }
      }
      .animate-float { animation: float 15s infinite ease-in-out; }
      .delay-2000 { animation-delay: 2s; }
      .delay-4000 { animation-delay: 4s; }

      .glass-panel {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .dark .glass-panel {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
    </style>
  `;

  // --- ADMIN CONTROLS HTML ---
  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    const label = hidden ? 'Show' : 'Hide';
    const icon  = hidden ? 'visibility' : 'visibility_off';
    const bgClass = hidden ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';

    return `
      <div class="absolute top-4 right-4 z-20 flex items-center gap-2">
        ${hidden ? '<span class="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">HIDDEN</span>' : ''}
        <button onclick="window.toggleHomeCard('${id}')"
                class="${bgClass} text-[10px] flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition">
          <span class="material-icons text-xs">${icon}</span> ${label}
        </button>
      </div>
    `;
  };

  // --- CARD RENDERER ---
  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return '';
    const visibilityClass = isHidden(id) ? 'opacity-60 grayscale' : '';

    return `
      <article class="app-card relative rounded-[2rem] overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 ${visibilityClass}" data-card-id="${id}">
        <!-- Card Glass Background -->
        <div class="absolute inset-0 glass-panel z-0"></div>
        
        ${adminControls(id)}

        <!-- Content -->
        <div class="relative z-10 h-full flex flex-col">
            ${innerHtml}
        </div>
      </article>
    `;
  };

  return `
  ${customStyles}
  <div class="font-body min-h-screen w-full relative overflow-hidden pb-24">
    
    <!-- BACKGROUND ANIMATION (The "Overwhelming" Cool Factor) -->
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
       <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-float"></div>
       <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-float delay-2000"></div>
       <div class="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-emerald-500/20 rounded-full blur-[100px] animate-float delay-4000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

      <!-- HERO SECTION -->
      <section class="text-center mb-12 relative">
         
         <!-- Badge -->
         <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-md border border-slate-200 dark:border-white/10 mb-6 shadow-sm">
           <span class="relative flex h-2.5 w-2.5">
             <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
             <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
           </span>
           <span class="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">System Online</span>
         </div>

         <!-- TITLE (Bold Cursive) -->
         <h1 class="font-cursive text-6xl sm:text-8xl md:text-9xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-2 drop-shadow-sm py-2">
           Stark Mods
         </h1>
         
         <p class="text-slate-600 dark:text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
           The premium destination for secure, high-performance game modifications.
         </p>

         <!-- SOCIAL DOCK -->
         <div class="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
            <button onclick="document.getElementById('search-mods').focus()" 
                    class="h-12 px-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform">
               <span class="material-icons text-sm">search</span> Browse
            </button>
            
            <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                    class="h-12 w-12 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center border border-[#0088cc]/20 hover:bg-[#0088cc] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg">
               <span class="material-icons">telegram</span>
            </button>
            
            <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                    class="h-12 w-12 rounded-full bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center border border-[#5865F2]/20 hover:bg-[#5865F2] hover:text-white transition-all duration-300 hover:scale-110 shadow-lg">
               <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            </button>
         </div>

      </section>

      <!-- SEARCH BAR (Sticky & IOS Style) -->
      <div class="sticky top-24 z-30 mb-10 max-w-2xl mx-auto">
        <div class="glass-panel p-2 rounded-[1.5rem] flex gap-2 shadow-xl ring-1 ring-black/5 dark:ring-white/5">
           <div class="relative flex-1 group">
              <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">search</span>
              <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                     placeholder="Search games..."
                     class="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-bold text-sm">
           </div>
           <div class="w-px bg-slate-200 dark:bg-slate-700 my-2"></div>
           <select id="filter-category" onchange="window.filterMods()" 
                   class="px-6 py-2 bg-transparent border-none outline-none text-sm font-bold text-slate-600 dark:text-slate-300 cursor-pointer rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition appearance-none text-center">
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="premium">Paid</option>
           </select>
        </div>
      </div>

      <!-- MODS GRID -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="mods-grid">

        ${renderCard('rc25', `
          <!-- Card Header (Image + Title) -->
          <div class="p-6 pb-0">
             <div class="flex items-start justify-between mb-4">
                <img src="assets/icons/icon_rc25.jpg" class="h-20 w-20 rounded-[1.2rem] shadow-lg object-cover bg-slate-200" onerror="this.src='https://placehold.co/80'" />
                <button onclick="window.router.navigateTo('/rc25')" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors">
                   <span class="material-icons -rotate-45 text-sm">arrow_forward</span>
                </button>
             </div>
             
             <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-1">RC25 Fan-Made</h2>
             <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Patch Update</p>

             <!-- Badges (Pill Design) -->
             <div class="flex flex-wrap gap-2 mb-6">
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">v7+</span>
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20 whitespace-nowrap">Free</span>
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20 whitespace-nowrap">New Update</span>
             </div>
          </div>

          <!-- Feature Image -->
          <div class="mt-auto relative h-48 w-full cursor-pointer group" onclick="window.router.navigateTo('/rc25')">
             <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
             <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://placehold.co/400x200'">
             <div class="absolute bottom-4 left-6 z-20">
                <span class="text-white text-sm font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                   Download Now <span class="material-icons text-xs">chevron_right</span>
                </span>
             </div>
          </div>
        `)}

        ${renderCard('rc24', `
          <div class="p-6 pb-0">
             <div class="flex items-start justify-between mb-4">
                <img src="assets/icons/icon_rc24.png" class="h-20 w-20 rounded-[1.2rem] shadow-lg object-cover bg-slate-200" onerror="this.src='https://placehold.co/80'" />
                <button onclick="window.router.navigateTo('/rc24')" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors">
                   <span class="material-icons -rotate-45 text-sm">arrow_forward</span>
                </button>
             </div>
             
             <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-1">RC Realistic V3</h2>
             <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Graphic Patch</p>

             <div class="flex flex-wrap gap-2 mb-6">
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">v4.6</span>
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20 whitespace-nowrap">T20 WC 2026</span>
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20 whitespace-nowrap">Free</span>
             </div>
          </div>

          <div class="mt-auto relative h-48 w-full cursor-pointer group" onclick="window.router.navigateTo('/rc24')">
             <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
             <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://placehold.co/400x200'">
             <div class="absolute bottom-4 left-6 z-20">
                <span class="text-white text-sm font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                   View Patch <span class="material-icons text-xs">chevron_right</span>
                </span>
             </div>
          </div>
        `)}

        ${renderCard('rc20', `
          <div class="p-6 pb-0">
             <div class="flex items-start justify-between mb-4">
                <img src="assets/icons/icon_rc20.jpg" class="h-20 w-20 rounded-[1.2rem] shadow-lg object-cover bg-slate-200" onerror="this.src='https://placehold.co/80'" />
                <button onclick="window.router.navigateTo('/rc20')" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors">
                   <span class="material-icons -rotate-45 text-sm">arrow_forward</span>
                </button>
             </div>
             
             <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-1">RC20 Mod Menu</h2>
             <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">VIP Injector</p>

             <div class="flex flex-wrap gap-2 mb-6">
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">v6.1</span>
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">PREMIUM</span>
             </div>
          </div>

          <div class="mt-auto relative h-48 w-full cursor-pointer group" onclick="window.router.navigateTo('/rc20')">
             <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
             <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://placehold.co/400x200'">
             <div class="absolute bottom-4 left-6 z-20">
                <span class="text-white text-sm font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                   Get Mod <span class="material-icons text-xs">chevron_right</span>
                </span>
             </div>
          </div>
        `)}

        ${renderCard('wcc3', `
          <div class="p-6 pb-0">
             <div class="flex items-start justify-between mb-4">
                <img src="assets/icons/icon_wcc3.png" class="h-20 w-20 rounded-[1.2rem] shadow-lg object-cover bg-slate-200" onerror="this.src='https://placehold.co/80'" />
                <button onclick="window.router.navigateTo('/wcc3')" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-green-500 hover:text-white flex items-center justify-center transition-colors">
                   <span class="material-icons -rotate-45 text-sm">arrow_forward</span>
                </button>
             </div>
             
             <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-1">WCC3 Mod Menu</h2>
             <p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">Career Unlocked</p>

             <div class="flex flex-wrap gap-2 mb-6">
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">v3.2.3</span>
               <span class="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">PREMIUM</span>
             </div>
          </div>

          <div class="mt-auto relative h-48 w-full cursor-pointer group" onclick="window.router.navigateTo('/wcc3')">
             <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
             <img src="assets/img/img_wcc3_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://placehold.co/400x200'">
             <div class="absolute bottom-4 left-6 z-20">
                <span class="text-white text-sm font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                   Get Mod <span class="material-icons text-xs">chevron_right</span>
                </span>
             </div>
          </div>
        `)}

      </section>

    </div>
  </div>
  `;
}

// ----------------------
// SEARCH & FILTER FUNCTION
// ----------------------
window.filterMods = function() {
   const query = document.getElementById('search-mods').value.toLowerCase();
   const filter = document.getElementById('filter-category').value;
   const cards = document.querySelectorAll('.app-card');

   let foundCount = 0;

   cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const isFree = text.includes('free');
      const isPremium = text.includes('premium') || text.includes('paid');
      
      let matchesSearch = text.includes(query);
      let matchesFilter = true;

      if (filter === 'free' && !isFree) matchesFilter = false;
      if (filter === 'premium' && !isPremium) matchesFilter = false;

      if (matchesSearch && matchesFilter) {
         card.style.display = 'block';
         // Animation reset for re-appearing cards
         card.style.opacity = '0';
         card.style.transform = 'translateY(10px)';
         setTimeout(() => {
             card.style.opacity = '1';
             card.style.transform = 'translateY(0)';
         }, 50);
         foundCount++;
      } else {
         card.style.display = 'none';
      }
   });

   // No Results Message
   const grid = document.getElementById('mods-grid');
   const noResultId = 'no-results-msg';
   let noResultEl = document.getElementById(noResultId);

   if(foundCount === 0) {
       if(!noResultEl) {
           noResultEl = document.createElement('div');
           noResultEl.id = noResultId;
           noResultEl.className = 'col-span-1 md:col-span-3 lg:col-span-3 text-center py-20 text-slate-400 glass-panel rounded-[2rem]';
           noResultEl.innerHTML = `
             <div class="flex flex-col items-center">
                <span class="material-icons text-5xl mb-3 text-slate-300">search_off</span>
                <p class="font-bold text-xl text-slate-600 dark:text-slate-300">No mods found</p>
                <p class="text-sm">Try adjusting your filters.</p>
             </div>
           `;
           grid.appendChild(noResultEl);
       }
   } else {
       if(noResultEl) noResultEl.remove();
   }
};

// Admin Toggle
window.toggleHomeCard = function (id) {
  if (!window.isAdmin) { alert('Only admin can hide/show cards.'); return; }
  if (!window.db) { alert('Database not ready.'); return; }

  let arr = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards.slice() : [];
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);
  else arr.splice(idx, 1);

  db.collection('siteConfig').doc('homeCards')
    .set({ hidden: arr }, { merge: true })
    .then(() => {
      window.homeHiddenCards = arr;
      if (window.router && typeof window.router.handleRoute === 'function') {
        window.router.handleRoute('/');
      }
    })
    .catch(err => {
      console.error('toggleHomeCard error:', err);
      alert('Failed: ' + err.message);
    });
};

window.HomePage = HomePage;
