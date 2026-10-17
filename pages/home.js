// pages/home.js

// Global state for hidden cards
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) {
    setTimeout(window.loadHomeHiddenCardsOnce, 300);
    return;
  }
  window._homeConfigFetchStarted = true;
  db.collection('siteConfig').doc('homeCards')
    .get()
    .then(doc => {
      const data = doc.exists ? (doc.data() || {}) : {};
      const newHidden = Array.isArray(data.hidden) ? data.hidden : [];
      const hasChanged = JSON.stringify(newHidden) !== JSON.stringify(window.homeHiddenCards);
      window.homeHiddenCards = newHidden;
      window.homeConfigLoaded = true;

      // Only re-render if hidden cards actually changed and user is currently on home
      if (hasChanged && window.router && location.pathname.replace(/\/$/, '') === '') {
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
      ? `<div class="mb-2 text-[10px] text-red-500 font-bold uppercase border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full inline-block">Hidden from Public</div>`
      : '';
    return `
      <div class="flex justify-between items-center mb-3 z-20 relative">
        ${hiddenNote}
        <button onclick="window.toggleHomeCard('${id}')"
                class="ml-auto text-slate-500 hover:text-red-500 text-[11px] font-bold flex items-center gap-1.5 bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-full transition active:scale-95 border border-black/5 dark:border-white/10">
          <span class="material-icons text-xs">${icon}</span>
          <span>${label}</span>
        </button>
      </div>`;
  };

  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-40 grayscale' : '';

    return `
      <article class="apple-glass-card group p-5 sm:p-6 transition-all duration-300 ${extraClasses}"
               data-card-id="${id}">
        ${adminControls(id)}
        <div class="relative z-10 h-full flex flex-col justify-between">
            ${innerHtml}
        </div>
      </article>`;
  };

  return `
  <div class="max-w-6xl mx-auto pb-24 relative px-3 sm:px-6 pt-2">

    <!-- ===== 1. MINIMAL APPLE ANNOUNCEMENT TICKER ===== -->
    <div class="flex justify-center mb-8">
      <div class="apple-glass-pill py-1.5 px-4 sm:px-5 flex items-center gap-2.5 shadow-sm hover:border-blue-500/40 transition-colors">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span class="text-[11px] sm:text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
          <span class="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[10px] mr-1">New</span>
          RC25 v8 Beta Live &bull; 50% Off VIP Mods &bull; Anti-Ban Safe
        </span>
      </div>
    </div>

    <!-- ===== 2. MINIMALIST HERO SECTION ===== -->
    <section class="mb-12 text-center px-4 relative z-10 max-w-3xl mx-auto">
      
      <!-- Brand Logo / Emblem -->
      <div class="mb-6 inline-block transform hover:scale-105 transition-transform duration-300">
        <img src="assets/icons/starkmodslogo.png" 
             alt="Stark Mods" 
             class="h-12 sm:h-14 w-auto mx-auto object-contain header-logo drop-shadow-sm"
             onerror="this.style.display='none'">
      </div>

      <!-- Main Headline -->
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
        Next-Level Cricket Modding<span class="text-blue-500">.</span>
      </h1>

      <!-- Minimal Subtitle -->
      <p class="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-normal leading-relaxed mb-8">
        Precision-crafted mods, unlocked career features, high-fidelity textures & zero-ban security for iOS and Android.
      </p>

      <!-- Minimal Hero Actions -->
      <div class="flex flex-wrap items-center justify-center gap-3.5 mb-10">
        
        <!-- Primary Action: Explore Mods -->
        <button onclick="document.getElementById('mods-grid').scrollIntoView({ behavior: 'smooth' })"
                class="apple-btn-primary px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2">
          <span class="material-icons text-base">sports_cricket</span>
          <span>Explore All Mods</span>
        </button>

        <!-- Telegram Glass Pill -->
        <a href="https://t.me/starkrc20" target="_blank" rel="noopener noreferrer"
           class="apple-glass-pill py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-400 transition-all flex items-center gap-2 active:scale-95 shadow-sm">
          <span class="material-icons text-sm text-[#229ED9]">telegram</span>
          <span>Telegram</span>
          <span class="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-bold">25k</span>
        </a>

        <!-- Discord Glass Pill -->
        <a href="https://discord.gg/KaeHESH9n" target="_blank" rel="noopener noreferrer"
           class="apple-glass-pill py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all flex items-center gap-2 active:scale-95 shadow-sm">
          <svg class="w-3.5 h-3.5 fill-[#5865F2]" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          <span>Discord</span>
          <span class="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full font-bold">15k</span>
        </a>

      </div>

      <!-- Minimal Metrics Pills -->
      <div class="grid grid-cols-3 gap-3 max-w-lg mx-auto">
        <div class="apple-glass p-3 text-center">
          <div class="text-lg sm:text-xl font-extrabold text-blue-600 dark:text-blue-400">5+</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Verified Mods</div>
        </div>
        <div class="apple-glass p-3 text-center">
          <div class="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">40k+</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Active Users</div>
        </div>
        <div class="apple-glass p-3 text-center">
          <div class="text-lg sm:text-xl font-extrabold text-amber-500">100%</div>
          <div class="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Anti-Ban Safe</div>
        </div>
      </div>

    </section>

    <!-- ===== 3. APPLE SPOTLIGHT SEARCH & FILTER BAR ===== -->
    <div class="relative z-30 mb-8 mx-auto max-w-2xl px-1">
      <div class="apple-glass p-1.5 flex items-center gap-2 shadow-lg">
        
        <!-- Search Input -->
        <div class="relative flex-1 flex items-center pl-3">
          <span class="material-icons text-slate-400 text-lg pointer-events-none">search</span>
          <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                 placeholder="Search mods, games, features..."
                 class="w-full pl-2.5 pr-3 py-2 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium text-xs sm:text-sm !shadow-none !border-0 focus:!ring-0">
        </div>

        <!-- Filter Segmented Tabs -->
        <div class="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/5 flex-shrink-0">
          <button type="button" onclick="window.setFilter('all', this)" class="mod-filter-pill active px-3 py-1 rounded-full text-[11px] font-bold transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm">
            All
          </button>
          <button type="button" onclick="window.setFilter('free', this)" class="mod-filter-pill px-3 py-1 rounded-full text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all">
            Free
          </button>
          <button type="button" onclick="window.setFilter('premium', this)" class="mod-filter-pill px-3 py-1 rounded-full text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all">
            VIP
          </button>
        </div>

      </div>
    </div>

    <!-- Hidden input to maintain existing filterMods state -->
    <input type="hidden" id="filter-category" value="all">

    <!-- ===== 4. MODS GRID (Apple Glass Cards) ===== -->
    <section class="grid sm:grid-cols-2 md:grid-cols-3 gap-6" id="mods-grid">

      <!-- RC25 Mod Card -->
      ${renderCard('rc25', `
        <div class="flex items-center gap-3.5 mb-4">
          <div class="relative flex-shrink-0">
            <img src="assets/icons/logo_rc25_v8_beta.png" 
                 class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700" 
                 onerror="this.src='/assets/icons/stark-32.png'"
                 loading="lazy" decoding="async" />
          </div>
          <div class="overflow-hidden">
            <div class="text-base font-bold text-slate-900 dark:text-white truncate">RC25 Fan-Made</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Patch Update &bull; Project Reborn</div>
          </div>
        </div>
        
        <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" 
             onclick="window.router.navigateTo('/rc25')">
          <img src="assets/img/img_rc25_V8_1.jpg" 
               loading="lazy" decoding="async"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
               onerror="this.src='https://placehold.co/320x180?text=RC25'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span class="text-white text-xs font-semibold flex items-center gap-1">View Details <span class="material-icons text-sm">arrow_forward</span></span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            v8 Beta
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Free Download
          </span>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
          Revolutionary graphics update, 35+ realistic signature shots, updated 2026 squads, and dynamic broadcast scorebars.
        </p>

        <button onclick="window.router.navigateTo('/rc25')" 
                class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5">
          <span class="material-icons text-sm">download</span>
          <span>Get v8 Beta</span>
        </button>
      `)}

      <!-- RC24 Mod Card -->
      ${renderCard('rc24', `
        <div class="flex items-center gap-3.5 mb-4">
          <div class="relative flex-shrink-0">
            <img src="assets/icons/icon_rc24.png" 
                 class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700" 
                 onerror="this.src='/assets/icons/stark-32.png'"
                 loading="lazy" decoding="async" />
          </div>
          <div class="overflow-hidden">
            <div class="text-base font-bold text-slate-900 dark:text-white truncate">RC Realistic V3</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Texture & Stadium Patch</div>
          </div>
        </div>

        <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" 
             onclick="window.router.navigateTo('/rc24')">
          <img src="assets/img/img_rc24_1.jpg" 
               loading="lazy" decoding="async"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
               onerror="this.src='https://placehold.co/320x180?text=RC24'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span class="text-white text-xs font-semibold flex items-center gap-1">View Details <span class="material-icons text-sm">arrow_forward</span></span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            v4.6 Patch
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Free
          </span>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
          Complete realistic HD textures, custom official kits, authentic player faces, and tournament overlays.
        </p>

        <button onclick="window.router.navigateTo('/rc24')" 
                class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5">
          <span class="material-icons text-sm">download</span>
          <span>Download Patch</span>
        </button>
      `)}

      <!-- RC20 Mod Menu Card -->
      ${renderCard('rc20', `
        <div class="flex items-center gap-3.5 mb-4">
          <div class="relative flex-shrink-0">
            <img src="assets/icons/icon_rc20.jpg" 
                 class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700" 
                 onerror="this.src='/assets/icons/stark-32.png'"
                 loading="lazy" decoding="async" />
          </div>
          <div class="overflow-hidden">
            <div class="text-base font-bold text-slate-900 dark:text-white truncate">RC20 Mod Menu</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">VIP Injector &bull; Pro Cheats</div>
          </div>
        </div>

        <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" 
             onclick="window.router.navigateTo('/rc20')">
          <img src="assets/img/img_rc20_1.jpg" 
               loading="lazy" decoding="async"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
               onerror="this.src='https://placehold.co/320x180?text=RC20'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span class="text-white text-xs font-semibold flex items-center gap-1">View Details <span class="material-icons text-sm">arrow_forward</span></span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Premium VIP
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            Anti-Ban
          </span>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
          Full VIP Mod Menu features: perfect timing assist, unlimited coins & tickets, unlocked player slots and tournament passes.
        </p>

        <button onclick="window.router.navigateTo('/rc20')" 
                class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
          <span>View Plans & Access</span>
        </button>
      `)}

      <!-- WCC3 Mod Menu Card -->
      ${renderCard('wcc3', `
        <div class="flex items-center gap-3.5 mb-4">
          <div class="relative flex-shrink-0">
            <img src="assets/icons/icon_wcc3.png" 
                 class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700" 
                 onerror="this.src='/assets/icons/stark-32.png'"
                 loading="lazy" decoding="async" />
          </div>
          <div class="overflow-hidden">
            <div class="text-base font-bold text-slate-900 dark:text-white truncate">WCC3 VIP Menu</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Career Unlock & Platinum</div>
          </div>
        </div>

        <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" 
             onclick="window.router.navigateTo('/wcc3')">
          <img src="assets/img/img_wcc3_1.jpg" 
               loading="lazy" decoding="async"
               class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
               onerror="this.src='https://placehold.co/320x180?text=WCC3'">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <span class="text-white text-xs font-semibold flex items-center gap-1">View Details <span class="material-icons text-sm">arrow_forward</span></span>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Premium VIP
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            Safe Injector
          </span>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
          VIP career mode unlocked, unlimited platinum & coins, NPL auction pack unlocked, and permanent anti-ban injector.
        </p>

        <button onclick="window.router.navigateTo('/wcc3')" 
                class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
          <span>View Plans & Access</span>
        </button>
      `)}

    </section>
  </div>
  `;
}

// ----------------------
// SEARCH & FILTER LOGIC
// ----------------------
window.setFilter = function(category, buttonEl) {
  const hiddenInput = document.getElementById('filter-category');
  if (hiddenInput) hiddenInput.value = category;

  document.querySelectorAll('.mod-filter-pill').forEach(pill => {
    pill.classList.remove('active', 'bg-white', 'dark:bg-slate-800', 'text-slate-900', 'dark:text-white', 'shadow-sm');
    pill.classList.add('text-slate-500', 'dark:text-slate-400');
  });

  if (buttonEl) {
    buttonEl.classList.add('active', 'bg-white', 'dark:bg-slate-800', 'text-slate-900', 'dark:text-white', 'shadow-sm');
    buttonEl.classList.remove('text-slate-500', 'dark:text-slate-400');
  }

  window.filterMods();
};

window.filterMods = function() {
  const queryEl = document.getElementById('search-mods');
  const query = queryEl ? queryEl.value.toLowerCase().trim() : '';
  const filterEl = document.getElementById('filter-category');
  const filter = filterEl ? filterEl.value : 'all';

  const cards = document.querySelectorAll('#mods-grid .apple-glass-card');
  let foundCount = 0;

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const isFree = text.includes('free');
    const isPremium = text.includes('premium') || text.includes('vip') || text.includes('paid');

    let matchesSearch = !query || text.includes(query);
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

  if (foundCount === 0 && grid) {
    if (!noResultEl) {
      noResultEl = document.createElement('div');
      noResultEl.id = noResultId;
      noResultEl.className = 'col-span-full apple-glass text-center py-16 px-4 text-slate-400';
      noResultEl.innerHTML = `
        <div class="flex flex-col items-center max-w-sm mx-auto">
          <span class="material-icons text-4xl mb-3 text-slate-300 dark:text-slate-600">search_off</span>
          <p class="font-bold text-base text-slate-700 dark:text-slate-300 mb-1">No mods match your search</p>
          <p class="text-xs text-slate-400 dark:text-slate-500">Try searching for "RC25", "RC24", or reset the filter.</p>
        </div>`;
      grid.appendChild(noResultEl);
    }
  } else {
    if (noResultEl) noResultEl.remove();
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
