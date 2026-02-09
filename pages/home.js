// pages/home.js

// Global state for hidden cards
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

// One-time load of hidden cards from Firestore
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
      const arr = Array.isArray(data.hidden) ? data.hidden : [];
      window.homeHiddenCards = arr;
      window.homeConfigLoaded = true;

      if (window.router &&
          typeof window.router.handleRoute === 'function' &&
          location.pathname.replace(/\/$/, '') === '/') {
        window.router.handleRoute('/');
      }
    })
    .catch(err => {
      console.error('loadHomeHiddenCardsOnce error:', err);
      window.homeHiddenCards = [];
      window.homeConfigLoaded = true;
    });
};

function HomePage() {
  window.loadHomeHiddenCardsOnce();

  const isAdmin = !!window.isAdmin;
  const hiddenCards = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards : [];
  const isHidden = (id) => hiddenCards.includes(id);

  // Admin Toggle Button
  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    const label = hidden ? 'Show' : 'Hide';
    const icon  = hidden ? 'visibility' : 'visibility_off';
    const hiddenNote = hidden
      ? `<div class="mb-2 text-[10px] text-red-500 font-bold uppercase border border-red-200 bg-red-50 px-2 py-1 rounded inline-block">Hidden</div>`
      : '';

    return `
      <div class="flex justify-between items-center mb-2">
        ${hiddenNote}
        <button onclick="window.toggleHomeCard('${id}')"
                class="ml-auto text-slate-500 hover:text-red-500 text-[10px] flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full backdrop-blur-sm transition shadow-sm border border-slate-200/50">
          <span class="material-icons text-xs">${icon}</span>
          <span class="uppercase font-bold">${label}</span>
        </button>
      </div>
    `;
  };

  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50 grayscale' : '';

    return `
      <article class="app-card relative p-5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/40 dark:border-slate-700/50 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ${extraClasses}"
               data-card-id="${id}">
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
        ${adminControls(id)}
        <div class="relative z-10">
            ${innerHtml}
        </div>
      </article>
    `;
  };

  return `
  <div class="max-w-6xl mx-auto pb-24 animate-fade-in relative px-3 sm:px-6">

    <section class="relative rounded-[2rem] p-6 sm:p-12 mb-8 text-center overflow-hidden border border-white/30 dark:border-slate-700/50 shadow-2xl isolate group">
       
       <div class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl -z-10 transition duration-700"></div>
       <div class="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] -z-20 animate-pulse"></div>
       <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px] -z-20 animate-pulse" style="animation-delay: 1s;"></div>

       <div class="relative z-10 flex flex-col items-center">
          <div class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/40 dark:bg-black/30 border border-white/30 dark:border-slate-600/30 backdrop-blur-md mb-5 shadow-sm cursor-pointer hover:scale-105 transition">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
              Update v7.0 Live
            </span>
          </div>

          <h1 class="text-4xl sm:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">
            Stark Mods
          </h1>
          
          <p class="text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed font-medium opacity-90">
            Premium, Secure & Anti-Ban Mod Menus.<br class="hidden sm:block"> Unlock the ultimate gaming experience.
          </p>
          
          <div class="grid grid-cols-3 gap-3 w-full sm:w-auto">
             <button onclick="document.getElementById('search-mods').focus()" 
                     class="btn bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black py-3.5 rounded-2xl font-bold shadow-lg transition transform active:scale-95 flex flex-col sm:flex-row items-center justify-center gap-1 sm:px-8">
               <span class="material-icons text-lg sm:text-base">search</span> 
               <span class="text-[11px] sm:text-sm">Browse</span>
             </button>
             
             <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                     class="group py-3.5 rounded-2xl font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition active:scale-95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-1 sm:px-8">
               <span class="material-icons text-lg sm:text-base group-hover:-rotate-12 transition">telegram</span> 
               <span class="text-[11px] sm:text-sm">Channel</span>
             </button>

             <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                     class="group py-3.5 rounded-2xl font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition active:scale-95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-1 sm:px-8">
               <svg class="w-5 h-5 sm:w-4 sm:h-4 fill-current group-hover:scale-110 transition" viewBox="0 0 24 24">
                 <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
               </svg>
               <span class="text-[11px] sm:text-sm">Discord</span>
             </button>
          </div>
       </div>
    </section>

    <div class="grid grid-cols-4 gap-3 mb-8 px-1">
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-blue-600">5+</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Mods</div>
       </div>
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-green-600">40k</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Users</div>
       </div>
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-purple-600">24/7</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Help</div>
       </div>
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-amber-500">100%</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Safe</div>
       </div>
    </div>

    <div class="sticky top-20 z-30 mb-8 mx-auto max-w-4xl">
      <div class="flex gap-2 p-2 rounded-[1.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-lg ring-1 ring-black/5">
         
         <div class="relative flex-1 group">
            <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">search</span>
            <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                   placeholder="Search..."
                   class="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium">
         </div>
         
         <div class="relative border-l border-slate-200 dark:border-slate-700 my-1"></div>

         <select id="filter-category" onchange="window.filterMods()" 
                 class="px-4 py-2 bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition appearance-none">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="premium">Paid</option>
         </select>
      </div>
    </div>

    <section class="grid md:grid-cols-3 gap-6" id="mods-grid">

      ${renderCard('rc25', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc25.jpg" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=RC25'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC25 Fan-Made</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">com.nautilus.RC3D</div>
              <div class="flex gap-1.5">
                <span class="badge bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v7+</span>
                <span class="badge bg-green-100/80 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/rc25')">
             <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC25'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
             <div class="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg text-[10px] text-white font-bold flex items-center gap-1 shadow-lg">
               <span class="material-icons text-[10px]">visibility</span> Preview
             </div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            The ultimate RC25 Patch. Enhanced graphics, updated squads, and optimized gameplay for Real Cricket fans.
          </p>

          <button onclick="window.router.navigateTo('/rc25')" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>Download</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc24.png" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=RC24'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC Realistic V3</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">com.nautilus.RealCricket</div>
              <div class="flex gap-1.5">
                <span class="badge bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v4.6</span>
                <span class="badge bg-purple-600 text-white border border-purple-700 dark:bg-purple-500 dark:border-purple-400">T20 WC 2026</span>
                <span class="badge bg-green-100/80 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/rc24')">
             <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC24'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            New T20 World Cup 2026 Jerseys, Realistic patch with enhanced textures, realistic stadiums, and updated player faces.
          </p>

          <button onclick="window.router.navigateTo('/rc24')" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>Download</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc20', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc20.jpg" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=RC20'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC20 Mod Menu</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">com.nautilus.RC3D</div>
              <div class="flex gap-1.5">
                <span class="badge bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v6.1</span>
                <span class="badge bg-amber-100/80 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/rc20')">
             <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC20'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            VIP Mod Menu. Features include Timing Hack, Unlimited Coins/Tickets, All Tournaments Unlocked.
          </p>

          <button onclick="window.router.navigateTo('/rc20')" class="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white py-3.5 rounded-2xl font-bold shadow-lg transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>View Details</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">visibility</span>
          </button>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_wcc3.png" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=WCC3'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">WCC3 Mod Menu</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">com.nextwave.wcc3</div>
              <div class="flex gap-1.5">
                <span class="badge bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v3.2</span>
                <span class="badge bg-amber-100/80 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/wcc3')">
             <img src="assets/img/img_wcc3_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            VIP Mod Menu with Career Mode Unlock, Unlimited Platinum, NPL Auction & more.
          </p>

          <button onclick="window.router.navigateTo('/wcc3')" class="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white py-3.5 rounded-2xl font-bold shadow-lg transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>View Details</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">visibility</span>
          </button>
        </div>
      `)}

    </section>
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
         card.style.opacity = '0';
         setTimeout(() => card.style.opacity = '1', 50);
         foundCount++;
      } else {
         card.style.display = 'none';
      }
   });

   // Show "No results" message if needed
   const grid = document.getElementById('mods-grid');
   const noResultId = 'no-results-msg';
   let noResultEl = document.getElementById(noResultId);

   if(foundCount === 0) {
       if(!noResultEl) {
           noResultEl = document.createElement('div');
           noResultEl.id = noResultId;
           noResultEl.className = 'col-span-1 md:col-span-3 text-center py-20 text-slate-400 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 backdrop-blur-sm';
           noResultEl.innerHTML = `
             <div class="flex flex-col items-center">
                <span class="material-icons text-4xl mb-2 text-slate-300">search_off</span>
                <p class="font-bold text-lg">No mods found</p>
                <p class="text-sm">Try searching for "RC24" or "WCC3"</p>
             </div>
           `;
           grid.appendChild(noResultEl);
       }
   } else {
       if(noResultEl) noResultEl.remove();
   }
};

// Admin hide/show – global (Firestore)
window.toggleHomeCard = function (id) {
  if (!window.isAdmin) {
    alert('Only admin can hide/show cards.');
    return;
  }
  if (!window.db) {
    alert('Database not ready.');
    return;
  }

  let arr = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards.slice() : [];
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);   // hide
  else arr.splice(idx, 1);        // show

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
      alert('Failed to update visibility: ' + err.message);
    });
};

window.HomePage = HomePage;
