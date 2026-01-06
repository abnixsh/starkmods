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
                class="ml-auto text-slate-400 hover:text-red-500 text-[11px] flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded transition">
          <span class="material-icons text-xs">${icon}</span>
          <span class="uppercase font-semibold">${label}</span>
        </button>
      </div>
    `;
  };

  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50 grayscale' : '';

    return `
      <article class="app-card p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 ${extraClasses}"
               data-card-id="${id}">
        ${adminControls(id)}
        ${innerHtml}
      </article>
    `;
  };

  return `
  <div class="max-w-6xl mx-auto pb-20 animate-fade-in relative px-2 sm:px-4">

    <section class="relative rounded-3xl p-6 sm:p-12 mb-6 text-center overflow-hidden border border-white/20 dark:border-slate-700 shadow-2xl isolate">
       
       <div class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl -z-10"></div>
       <div class="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-20"></div>
       <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-20"></div>

       <div class="relative z-10 flex flex-col items-center">
          <div class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md mb-4 shadow-sm cursor-pointer hover:scale-105 transition">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
              New: RC25 Patch v7.0
            </span>
          </div>

          <h1 class="text-3xl sm:text-6xl font-black text-slate-900 dark:text-white mb-3 tracking-tight drop-shadow-sm">
            Stark Mods Store
          </h1>
          
          <p class="text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-xl mx-auto leading-relaxed font-medium opacity-80">
            Secure & Premium Mod Menus for your favorite cricket games.
          </p>
          
          <div class="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:gap-3">
             <button onclick="document.getElementById('search-mods').focus()" 
                     class="btn bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95 flex flex-col sm:flex-row items-center justify-center gap-1 sm:px-6">
               <span class="material-icons text-lg sm:text-sm">search</span> 
               <span class="text-[10px] sm:text-sm">Browse</span>
             </button>
             
             <button onclick="window.open('https://t.me/imsergiomoreio', '_blank')" 
                     class="group py-3 rounded-xl font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition active:scale-95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-1 sm:px-6">
               <span class="material-icons text-lg sm:text-sm group-hover:-rotate-12 transition">telegram</span> 
               <span class="text-[10px] sm:text-sm">Channel</span>
             </button>

             <button onclick="window.open('https://discord.gg/your-invite-link', '_blank')" 
                     class="group py-3 rounded-xl font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition active:scale-95 backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-1 sm:px-6">
               <svg class="w-5 h-5 sm:w-4 sm:h-4 fill-current group-hover:scale-110 transition" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
               </svg>
               <span class="text-[10px] sm:text-sm">Discord</span>
             </button>
          </div>
       </div>
    </section>

    <div class="grid grid-cols-4 gap-2 mb-6 px-1">
       <div class="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div class="text-lg sm:text-2xl font-black text-blue-600">5+</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold">Mods</div>
       </div>
       <div class="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div class="text-lg sm:text-2xl font-black text-green-600">10k</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold">Users</div>
       </div>
       <div class="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div class="text-lg sm:text-2xl font-black text-purple-600">24/7</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold">Help</div>
       </div>
       <div class="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
          <div class="text-lg sm:text-2xl font-black text-amber-500">100%</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold">Safe</div>
       </div>
    </div>

    <div class="sticky top-16 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl py-3 border-b border-slate-200 dark:border-slate-800 mb-6 -mx-2 px-2 sm:mx-0 sm:px-0 sm:rounded-xl shadow-sm">
      <div class="space-y-3">
         <div class="flex gap-2">
            <div class="relative flex-1 group">
               <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition text-lg">search</span>
               <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                      placeholder="Search (e.g. RC24)..."
                      class="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition text-sm font-medium">
            </div>
            <select id="filter-category" onchange="window.filterMods()" 
                    class="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
               <option value="all">All</option>
               <option value="free">Free</option>
               <option value="premium">Paid</option>
            </select>
         </div>

         <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button onclick="window.setSearch('')" class="chip-filter active whitespace-nowrap px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">All</button>
            <button onclick="window.setSearch('rc25')" class="chip-filter whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-500">RC25</button>
            <button onclick="window.setSearch('rc24')" class="chip-filter whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-500">RC24</button>
            <button onclick="window.setSearch('wcc3')" class="chip-filter whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-500">WCC3</button>
            <button onclick="window.setSearch('rc20')" class="chip-filter whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-500">RC20</button>
         </div>
      </div>
    </div>

    <section class="grid md:grid-cols-3 gap-5" id="mods-grid">

      ${renderCard('rc25', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc25.jpg" class="h-14 w-14 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC25'" />
            <div>
              <div class="text-base font-bold text-slate-900 dark:text-white">RC25 Fan-Made</div>
              <div class="text-[10px] text-slate-500 font-mono mb-1">com.nautilus.RC3D</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v7+</span>
                <span class="badge bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-36 relative group cursor-pointer" onclick="window.router.navigateTo('/rc25')">
             <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC25'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <div class="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-bold flex items-center gap-1">
               <span class="material-icons text-[10px]">image</span> Preview
             </div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-4 flex-1 line-clamp-2">
            The ultimate RC25 Patch. Upgraded Enhanced version of RC20 for the fans of Real Cricket.
          </p>

          <button onclick="window.router.navigateTo('/rc25')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group text-sm">
            <span>Download Now</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc24.png" class="h-14 w-14 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC24'" />
            <div>
              <div class="text-base font-bold text-slate-900 dark:text-white">RC Realistic V2</div>
              <div class="text-[10px] text-slate-500 font-mono mb-1">com.nautilus.RealCricket</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v4.5</span>
                <span class="badge bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-36 relative group cursor-pointer" onclick="window.router.navigateTo('/rc24')">
             <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC24'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-4 flex-1 line-clamp-2">
            The most realistic patch of RC24 till date! Enhanced graphics and gameplay.
          </p>

          <button onclick="window.router.navigateTo('/rc24')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group text-sm">
            <span>Download Now</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc20', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc20.jpg" class="h-14 w-14 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC20'" />
            <div>
              <div class="text-base font-bold text-slate-900 dark:text-white">RC20 Mod Menu</div>
              <div class="text-[10px] text-slate-500 font-mono mb-1">com.nautilus.RC3D</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v6.1</span>
                <span class="badge bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-36 relative group cursor-pointer" onclick="window.router.navigateTo('/rc20')">
             <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC20'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-4 flex-1 line-clamp-2">
            VIP Mod Menu. Timing Hack, Unlimited Coins/Tickets, All Tournaments Unlocked.
          </p>

          <button onclick="window.router.navigateTo('/rc20')" class="w-full bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-2.5 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group text-sm">
            <span>View Details</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">visibility</span>
          </button>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_wcc3.png" class="h-14 w-14 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=WCC3'" />
            <div>
              <div class="text-base font-bold text-slate-900 dark:text-white">WCC3 Mod Menu</div>
              <div class="text-[10px] text-slate-500 font-mono mb-1">com.nextwave.wcc3</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">v3.2</span>
                <span class="badge bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-36 relative group cursor-pointer" onclick="window.router.navigateTo('/wcc3')">
             <img src="assets/img/img_wcc3_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-4 flex-1 line-clamp-2">
            VIP Mod Menu with Career Mode Unlock, Unlimited Platinum, NPL Auction & more.
          </p>

          <button onclick="window.router.navigateTo('/wcc3')" class="w-full bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-2.5 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group text-sm">
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
window.setSearch = function(val) {
    document.getElementById('search-mods').value = val;
    window.filterMods();
    
    // Highlight Active Chip
    document.querySelectorAll('.chip-filter').forEach(btn => {
        btn.classList.remove('bg-slate-200', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        btn.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-500');
        if(btn.innerText.toLowerCase() === (val || 'all')) {
            btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-500');
            btn.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-slate-700', 'dark:text-slate-200');
        }
    });
};

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
           noResultEl.className = 'col-span-1 md:col-span-3 text-center py-20 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700';
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
