// pages/home.js

// Global state for hidden cards
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

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
      if (window.router && typeof window.router.handleRoute === 'function' && location.pathname.replace(/\/$/, '') === '/') {
        window.router.handleRoute('/');
      }
    })
    .catch(() => {
      window.homeHiddenCards = [];
      window.homeConfigLoaded = true;
    });
};

function HomePage() {
  window.loadHomeHiddenCardsOnce();

  const isAdmin = !!window.isAdmin;
  const hiddenCards = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards : [];
  const isHidden = (id) => hiddenCards.includes(id);

  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    const label = hidden ? 'Show' : 'Hide';
    const icon  = hidden ? 'visibility' : 'visibility_off';
    const hiddenNote = hidden
      ? `<div class="mb-2 text-[10px] text-red-500 font-bold uppercase border border-red-200 bg-red-50 px-2 py-1 rounded inline-block">Hidden</div>`
      : '';
    return `
      <div class="flex justify-between items-center mb-2 z-20 relative">
        ${hiddenNote}
        <button onclick="window.toggleHomeCard('${id}')"
                class="ml-auto text-slate-500 hover:text-red-500 text-[10px] flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full transition shadow-sm border border-slate-200/50">
          <span class="material-icons text-xs">${icon}</span>
          <span class="uppercase font-bold">${label}</span>
        </button>
      </div>`;
  };

  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50 grayscale' : '';
    
    // iOS Glass Card Class
    return `
      <article class="app-card ios-glass-card group p-5 hover:-translate-y-1 transition-all duration-300 ${extraClasses}"
               data-card-id="${id}">
        ${adminControls(id)}
        <div class="relative z-10 h-full">
            ${innerHtml}
        </div>
      </article>`;
  };

  // Inject styles once
  if (!document.getElementById('stark-hero-v6')) {
    const s = document.createElement('style');
    s.id = 'stark-hero-v6';
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        overflow-x: hidden; /* Prevent horizontal scroll from marquee */
      }

      /* The Script Font */
      .stark-script-font {
        font-family: 'Great Vibes', cursive;
        font-weight: 400 !important;
        font-style: normal;
      }

      /* --- MARQUEE (Scrolling Text) --- */
      .stark-marquee-wrapper {
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        background: #000;
        color: #fff;
        padding: 8px 0;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        z-index: 50;
        margin-bottom: 2rem;
      }
      
      .stark-marquee-content {
        display: inline-block;
        animation: marquee 15s linear infinite;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }

      /* --- BUTTONS (Colored Circles from Image) --- */
      .stark-btn-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 4px 14px rgba(0,0,0,0.1);
      }
      .stark-btn-circle:active { transform: scale(0.92); }

      /* Specific Button Colors */
      .btn-search { background: #fff; color: #334155; }
      .dark .btn-search { background: #1e293b; color: #fff; }
      
      .btn-telegram { background: #229ED9; color: #fff; } /* Telegram Blue */
      .btn-discord { background: #5865F2; color: #fff; }  /* Discord Blurple */

      /* --- iOS GLASS MORPHISM CSS --- */
      .ios-glass-card, .ios-glass-panel {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 
          0 8px 32px rgba(0, 0, 0, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.6),
          inset 0 -1px 0 rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
      }
      .dark .ios-glass-card, .dark .ios-glass-panel {
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      
      /* Simple Fade In */
      .stark-in { 
        opacity: 0; 
        transform: translateY(16px); 
        animation: starkElIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
      }
      @keyframes starkElIn { 
        to { opacity: 1; transform: translateY(0); } 
      }
    `;
    document.head.appendChild(s);
  }

  return `
  <div class="max-w-6xl mx-auto pb-24 animate-fade-in relative px-3 sm:px-6">

    <!-- ===== 1. SCROLLING BLACK BAR ===== -->
    <div class="stark-marquee-wrapper">
       <div class="stark-marquee-content">
          50% off on new mods - cricket x coming soon - 50% off on new mods - cricket x coming soon -
       </div>
    </div>

    <!-- ===== HERO SECTION ===== -->
    <section class="mb-8 text-center px-4 relative z-10">
       
       <div class="flex flex-col items-center">

          <!-- 2. TITLE: Solid Blue, Script Font (No SVG, No Gradient) -->
          <h1 class="stark-in stark-script-font text-7xl sm:text-8xl text-blue-700 dark:text-blue-400 select-none leading-none pb-6 drop-shadow-sm" 
              style="animation-delay: 0.1s; text-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            Stark Mods
          </h1>
          
          <!-- 3. LIVE BADGE (Below Title) -->
          <div class="stark-in inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 mb-6" style="animation-delay: 0.2s">
            <span class="relative flex h-2.5 w-2.5">
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span class="text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
              Update v7+ Live
            </span>
          </div>

          <!-- 4. TAGLINE -->
          <p class="stark-in text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg mx-auto font-medium leading-relaxed" style="animation-delay: 0.3s">
            Premium, Secure & Anti-Ban Mod Menus <br/> for iOS & Android.
          </p>
          
          <!-- 5. COLORED CIRCLE BUTTONS -->
          <div class="stark-in flex flex-row justify-center gap-5 w-full" style="animation-delay: 0.4s">
             
             <!-- Search (White) -->
             <button onclick="document.getElementById('search-mods').focus()" 
                     class="stark-btn-circle btn-search group" title="Search">
                <span class="material-icons text-xl group-hover:scale-110 transition-transform">search</span>
             </button>
             
             <!-- Telegram (Blue) -->
             <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                     class="stark-btn-circle btn-telegram group" title="Telegram">
                <span class="material-icons text-xl group-hover:-rotate-12 transition-transform">telegram</span>
             </button>

             <!-- Discord (Indigo) -->
             <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                     class="stark-btn-circle btn-discord group" title="Discord">
                <svg class="w-6 h-6 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
             </button>
          </div>
       </div>
    </section>

    <!-- ===== STATS ===== -->
    <div class="grid grid-cols-4 gap-3 mb-8 px-1">
       <div class="ios-glass-panel p-3 text-center flex flex-col items-center justify-center">
          <div class="text-xl sm:text-2xl font-black text-blue-600">5+</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">Mods</div>
       </div>
       <div class="ios-glass-panel p-3 text-center flex flex-col items-center justify-center">
          <div class="text-xl sm:text-2xl font-black text-green-600">40k</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">Users</div>
       </div>
       <div class="ios-glass-panel p-3 text-center flex flex-col items-center justify-center">
          <div class="text-xl sm:text-2xl font-black text-purple-600">24/7</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">Help</div>
       </div>
       <div class="ios-glass-panel p-3 text-center flex flex-col items-center justify-center">
          <div class="text-xl sm:text-2xl font-black text-amber-500">100%</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-1">Safe</div>
       </div>
    </div>

    <!-- ===== SEARCH BAR (Functional, Not Sticky) ===== -->
    <div class="relative z-40 mb-8 mx-auto max-w-4xl">
      <div class="ios-glass-panel flex items-center p-1.5 ring-1 ring-black/5">
         <div class="relative flex-1 group pl-2">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition text-lg">search</span>
            <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                   placeholder="Search games, mods..."
                   class="w-full pl-10 pr-4 py-3 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium text-sm">
         </div>
         <div class="h-6 w-[1px] bg-slate-300 dark:bg-slate-600 mx-1"></div>
         <div class="relative pr-1">
             <select id="filter-category" onchange="window.filterMods()" 
                     class="pl-3 pr-8 py-2 bg-slate-100/50 dark:bg-slate-800/50 border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition appearance-none">
                <option value="all">All</option>
                <option value="free">Free</option>
                <option value="premium">Paid</option>
             </select>
             <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">expand_more</span>
         </div>
      </div>
    </div>

    <!-- ===== MODS GRID (Glass Cards) ===== -->
    <section class="grid md:grid-cols-3 gap-6" id="mods-grid">

      ${renderCard('rc25', `
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center gap-4 mb-4">
            <div class="relative group-hover:scale-105 transition-transform duration-300">
                <img src="assets/icons/icon_rc25.jpg" class="h-16 w-16 rounded-[14px] shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC25'" />
                <div class="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
            </div>
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC25 Fan-Made</div>
              <div class="text-[11px] text-slate-500 font-medium">Patch Update</div>
            </div>
          </div>
          
          <!-- Image -->
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm" onclick="window.router.navigateTo('/rc25')">
             <img src="assets/img/img_rc25_1.jpg" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC25'">
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">v7+</span>
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300">Free</span>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 flex-1 leading-relaxed">
            The ultimate RC25 Patch. Enhanced graphics, updated squads, and optimized gameplay.
          </p>

          <!-- Button -->
          <button onclick="window.router.navigateTo('/rc25')" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1">
            <span>Download</span>
          </button>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="flex flex-col h-full">
          <div class="flex items-center gap-4 mb-4">
             <div class="relative group-hover:scale-105 transition-transform duration-300">
                <img src="assets/icons/icon_rc24.png" class="h-16 w-16 rounded-[14px] shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC24'" />
                <div class="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
             </div>
             <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC Realistic V3</div>
              <div class="text-[11px] text-slate-500 font-medium">Texture Patch</div>
            </div>
          </div>
          
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm" onclick="window.router.navigateTo('/rc24')">
             <img src="assets/img/img_rc24_1.jpg" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC24'">
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-3">
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">v4.6</span>
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300">Free</span>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 flex-1 leading-relaxed">
            New T20 World Cup 2026 Jerseys, Realistic patch with enhanced textures & faces.
          </p>

          <button onclick="window.router.navigateTo('/rc24')" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1">
            <span>Download</span>
          </button>
        </div>
      `)}

      ${renderCard('rc20', `
        <div class="flex flex-col h-full">
          <div class="flex items-center gap-4 mb-4">
             <div class="relative group-hover:scale-105 transition-transform duration-300">
                <img src="assets/icons/icon_rc20.jpg" class="h-16 w-16 rounded-[14px] shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC20'" />
                <div class="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
             </div>
             <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC20 Mod Menu</div>
              <div class="text-[11px] text-slate-500 font-medium">VIP Cheats</div>
            </div>
          </div>
          
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm" onclick="window.router.navigateTo('/rc20')">
             <img src="assets/img/img_rc20_1.jpg" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC20'">
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-3">
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300">Premium</span>
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">Safe</span>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 flex-1 leading-relaxed">
            VIP Mod Menu. Features include Timing Hack, Unlimited Coins/Tickets & more.
          </p>

          <button onclick="window.router.navigateTo('/rc20')" class="w-full bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-1">
            <span>View Details</span>
          </button>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="flex flex-col h-full">
          <div class="flex items-center gap-4 mb-4">
             <div class="relative group-hover:scale-105 transition-transform duration-300">
                <img src="assets/icons/icon_wcc3.png" class="h-16 w-16 rounded-[14px] shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=WCC3'" />
                <div class="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
             </div>
             <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">WCC3 Mod Menu</div>
              <div class="text-[11px] text-slate-500 font-medium">VIP Injector</div>
            </div>
          </div>
          
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm" onclick="window.router.navigateTo('/wcc3')">
             <img src="assets/img/img_wcc3_1.jpg" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-3">
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300">Premium</span>
             <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">Safe</span>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 flex-1 leading-relaxed">
            VIP Mod Menu with Career Mode Unlock, Unlimited Platinum, NPL Auction & more.
          </p>

          <button onclick="window.router.navigateTo('/wcc3')" class="w-full bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-1">
            <span>View Details</span>
          </button>
        </div>
      `)}

    </section>
  </div>
  `;
}

// ----------------------
// SEARCH & FILTER 
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
         foundCount++;
      } else {
         card.style.display = 'none';
      }
   });

   const grid = document.getElementById('mods-grid');
   const noResultId = 'no-results-msg';
   let noResultEl = document.getElementById(noResultId);

   if(foundCount === 0) {
       if(!noResultEl) {
           noResultEl = document.createElement('div');
           noResultEl.id = noResultId;
           noResultEl.className = 'col-span-1 md:col-span-3 ios-glass-panel text-center py-20 text-slate-400';
           noResultEl.innerHTML = `
             <div class="flex flex-col items-center">
                <span class="material-icons text-4xl mb-2 text-slate-300">search_off</span>
                <p class="font-bold text-lg">No mods found</p>
                <p class="text-sm opacity-60">Try searching for "RC24" or "WCC3"</p>
             </div>`;
           grid.appendChild(noResultEl);
       }
   } else {
       if(noResultEl) noResultEl.remove();
   }
};

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
      alert('Failed to update visibility: ' + err.message);
    });
};

window.HomePage = HomePage;
