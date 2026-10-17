// pages/home.js

// Global state for hidden cards and dynamic custom cards
window.homeHiddenCards = window.homeHiddenCards || [];
window.customHomeCards = window.customHomeCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) {
    setTimeout(window.loadHomeHiddenCardsOnce, 300);
    return;
  }
  window._homeConfigFetchStarted = true;

  // 1. Load hidden card ids
  db.collection('siteConfig').doc('homeCards').get()
    .then(doc => {
      const data = doc.exists ? (doc.data() || {}) : {};
      window.homeHiddenCards = Array.isArray(data.hidden) ? data.hidden : [];
      window.homeConfigLoaded = true;
    })
    .catch(() => {
      window.homeHiddenCards = [];
      window.homeConfigLoaded = true;
    });

  // 2. Load dynamic custom mod cards created in admin
  db.collection('customCards').orderBy('createdAt', 'desc').onSnapshot(snap => {
    const list = [];
    snap.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() });
    });
    window.customHomeCards = list;
    // Silently refresh mods grid if user is currently on home
    const grid = document.getElementById('mods-grid');
    if (grid && location.pathname.replace(/\/$/, '') === '') {
      window.renderAllHomeCards();
    }
  }, () => {});
};

function HomePage() {
  window.loadHomeHiddenCardsOnce();

  return `
  <div class="max-w-6xl mx-auto pb-24 relative px-3 sm:px-6 pt-4">

    <!-- ===== 1. ULTRA-MINIMAL TOP ANNOUNCEMENT BADGE ===== -->
    <div class="flex justify-center mb-6">
      <div class="apple-glass-pill py-1.5 px-4 flex items-center gap-2 border border-black/5 dark:border-white/10 shadow-sm">
        <span class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
        <span class="text-xs font-semibold tracking-tight text-slate-700 dark:text-slate-300">
          <strong class="text-blue-600 dark:text-blue-400 font-bold mr-1">v8.2 LIVE</strong> Real Cricket 25 Patch & VIP Mod Menus
        </span>
      </div>
    </div>

    <!-- ===== 2. STATIC, LAG-FREE MINIMAL HERO ===== -->
    <section class="mb-10 text-center px-4 relative z-10 max-w-2xl mx-auto">
      
      <!-- Brand Logo / Wordmark -->
      <div class="mb-5 inline-block">
        <img src="assets/icons/starkmodslogo.png" 
             alt="Stark Mods" 
             class="h-11 sm:h-13 w-auto mx-auto object-contain header-logo"
             onerror="this.style.display='none'">
      </div>

      <!-- Clean, High-Contrast Typography (Zero lag animations) -->
      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
        Pro Cricket Mod Studio<span class="text-blue-500">.</span>
      </h1>

      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-normal leading-relaxed mb-7">
        Ultra HD graphics, realistic kits, unlocked shot animations & anti-ban protection for RC25, RC24, and WCC3.
      </p>

      <!-- Polished Community Buttons & Actions -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
        
        <!-- Primary Action -->
        <button onclick="document.getElementById('mods-grid').scrollIntoView({ behavior: 'smooth' })"
                class="apple-btn-primary px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md flex items-center gap-2">
          <span class="material-icons text-sm">grid_view</span>
          <span>Browse Mods</span>
        </button>

        <!-- Telegram Button (Branded, High Contrast) -->
        <a href="https://t.me/starkrc20" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#229ED9] hover:bg-[#1e8ec3] text-white text-xs font-bold transition shadow-sm active:scale-95">
          <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          <span>Telegram</span>
          <span class="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">25k</span>
        </a>

        <!-- Discord Button (Branded, High Contrast) -->
        <a href="https://discord.gg/KaeHESH9n" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition shadow-sm active:scale-95">
          <svg class="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          <span>Discord</span>
          <span class="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">15k</span>
        </a>

      </div>

      <!-- Compact Trust Metrics -->
      <div class="inline-flex items-center gap-4 sm:gap-6 px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <span class="flex items-center gap-1.5"><span class="material-icons text-blue-500 text-sm">verified</span> 100% Anti-Ban</span>
        <span class="h-3 w-px bg-slate-300 dark:bg-slate-700"></span>
        <span class="flex items-center gap-1.5"><span class="material-icons text-emerald-500 text-sm">bolt</span> Instant Download</span>
        <span class="h-3 w-px bg-slate-300 dark:bg-slate-700"></span>
        <span class="flex items-center gap-1.5"><span class="material-icons text-amber-500 text-sm">support_agent</span> 24/7 Verified</span>
      </div>

    </section>

    <!-- ===== 3. SEARCH & INSTANT FILTER ===== -->
    <div class="relative z-30 mb-8 mx-auto max-w-xl px-1">
      <div class="apple-glass p-1.5 flex items-center gap-2 shadow-sm">
        
        <div class="relative flex-1 flex items-center pl-3">
          <span class="material-icons text-slate-400 text-lg pointer-events-none">search</span>
          <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                 placeholder="Search mods, games, patches..."
                 class="w-full pl-2.5 pr-3 py-2 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium text-xs sm:text-sm !shadow-none !border-0 focus:!ring-0">
        </div>

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

    <input type="hidden" id="filter-category" value="all">

    <!-- ===== 4. MODS GRID ===== -->
    <section class="grid sm:grid-cols-2 md:grid-cols-3 gap-6" id="mods-grid">
      <!-- Injected by renderAllHomeCards() -->
    </section>

  </div>
  `;
}

// Render both static core cards and dynamic custom cards created in Admin
window.renderAllHomeCards = function() {
  const grid = document.getElementById('mods-grid');
  if (!grid) return;

  const isAdmin = !!window.isAdmin;
  const hiddenCards = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards : [];
  const isHidden = (id) => hiddenCards.includes(id);

  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    const label = hidden ? 'Show' : 'Hide';
    const icon  = hidden ? 'visibility' : 'visibility_off';
    const hiddenNote = hidden
      ? `<div class="mb-2 text-[10px] text-red-500 font-bold uppercase border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full inline-block">Hidden</div>`
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
      <article class="apple-glass-card group p-5 sm:p-6 transition-all duration-300 ${extraClasses}" data-card-id="${id}">
        ${adminControls(id)}
        <div class="relative z-10 h-full flex flex-col justify-between">
            ${innerHtml}
        </div>
      </article>`;
  };

  let cardsHtml = '';

  // 1. RC25
  cardsHtml += renderCard('rc25', `
    <div class="flex items-center gap-3.5 mb-4">
      <img src="assets/icons/logo_rc25_v8_beta.png" class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700 flex-shrink-0" onerror="this.src='/assets/icons/stark-32.png'" loading="lazy" decoding="async">
      <div class="overflow-hidden">
        <div class="text-base font-bold text-slate-900 dark:text-white truncate">RC25 Fan-Made</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Patch Update &bull; Project Reborn</div>
      </div>
    </div>
    <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" onclick="window.router.navigateTo('/rc25')">
      <img src="assets/img/img_rc25_V8_1.jpg" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC25'">
    </div>
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">v8.2 Beta</span>
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free Download</span>
    </div>
    <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
      Revolutionary graphics update, 35+ realistic signature shots, updated 2026 squads, and dynamic broadcast scorebars.
    </p>
    <button onclick="window.router.navigateTo('/rc25')" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5">
      <span class="material-icons text-sm">download</span>
      <span>Get v8.2 Beta</span>
    </button>
  `);

  // 2. RC24
  cardsHtml += renderCard('rc24', `
    <div class="flex items-center gap-3.5 mb-4">
      <img src="assets/icons/icon_rc24.png" class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700 flex-shrink-0" onerror="this.src='/assets/icons/stark-32.png'" loading="lazy" decoding="async">
      <div class="overflow-hidden">
        <div class="text-base font-bold text-slate-900 dark:text-white truncate">RC Realistic V3</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Texture & Stadium Patch</div>
      </div>
    </div>
    <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" onclick="window.router.navigateTo('/rc24')">
      <img src="assets/img/img_rc24_1.jpg" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC24'">
    </div>
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">v4.6 Patch</span>
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span>
    </div>
    <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
      Complete realistic HD textures, custom official kits, authentic player faces, and tournament overlays.
    </p>
    <button onclick="window.router.navigateTo('/rc24')" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5">
      <span class="material-icons text-sm">download</span>
      <span>Download Patch</span>
    </button>
  `);

  // 3. RC20
  cardsHtml += renderCard('rc20', `
    <div class="flex items-center gap-3.5 mb-4">
      <img src="assets/icons/icon_rc20.jpg" class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700 flex-shrink-0" onerror="this.src='/assets/icons/stark-32.png'" loading="lazy" decoding="async">
      <div class="overflow-hidden">
        <div class="text-base font-bold text-slate-900 dark:text-white truncate">RC20 Mod Menu</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">VIP Injector &bull; Pro Cheats</div>
      </div>
    </div>
    <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" onclick="window.router.navigateTo('/rc20')">
      <img src="assets/img/img_rc20_1.jpg" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC20'">
    </div>
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Premium VIP</span>
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">Anti-Ban</span>
    </div>
    <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
      Full VIP Mod Menu: perfect timing assist, unlimited coins & tickets, unlocked player slots and tournament passes.
    </p>
    <button onclick="window.router.navigateTo('/rc20')" class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
      <span>View Plans & Access</span>
    </button>
  `);

  // 4. WCC3
  cardsHtml += renderCard('wcc3', `
    <div class="flex items-center gap-3.5 mb-4">
      <img src="assets/icons/icon_wcc3.png" class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700 flex-shrink-0" onerror="this.src='/assets/icons/stark-32.png'" loading="lazy" decoding="async">
      <div class="overflow-hidden">
        <div class="text-base font-bold text-slate-900 dark:text-white truncate">WCC3 VIP Menu</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Career Unlock & Platinum</div>
      </div>
    </div>
    <div class="mb-4 rounded-xl overflow-hidden h-40 relative cursor-pointer shadow-sm group bg-black/10" onclick="window.router.navigateTo('/wcc3')">
      <img src="assets/img/img_wcc3_1.jpg" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
    </div>
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Premium VIP</span>
      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">Safe Injector</span>
    </div>
    <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
      VIP career mode unlocked, unlimited platinum & coins, NPL auction pack unlocked, and permanent anti-ban injector.
    </p>
    <button onclick="window.router.navigateTo('/wcc3')" class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm">
      <span>View Plans & Access</span>
    </button>
  `);

  // 5. Dynamic Custom Cards Added from Admin
  (window.customHomeCards || []).forEach(c => {
    const isFree = c.type === 'free' || c.price === 0;
    const actionBtn = isFree ? `
      <a href="${c.link}" target="_blank" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5">
        <span class="material-icons text-sm">download</span>
        <span>Download Free</span>
      </a>
    ` : `
      <a href="${c.link}" target="_blank" class="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm">
        <span>Get Access • ₹${c.price}</span>
      </a>
    `;

    cardsHtml += renderCard(c.id, `
      <div class="flex items-center gap-3.5 mb-4">
        <img src="${c.icon || 'assets/icons/stark-32.png'}" class="h-14 w-14 rounded-2xl shadow-md object-cover border border-white/20 dark:border-slate-700 flex-shrink-0" onerror="this.src='/assets/icons/stark-32.png'">
        <div class="overflow-hidden">
          <div class="text-base font-bold text-slate-900 dark:text-white truncate">${c.name}</div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">${c.tag || 'Game Mod'}</div>
        </div>
      </div>
      ${c.banner ? `
      <div class="mb-4 rounded-xl overflow-hidden h-40 relative shadow-sm bg-black/10">
        <img src="${c.banner}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/320x180?text=MOD'">
      </div>` : ''}
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isFree ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}">
          ${isFree ? 'Free' : `₹${c.price} VIP`}
        </span>
      </div>
      <p class="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed flex-grow">
        ${c.desc || ''}
      </p>
      ${actionBtn}
    `);
  });

  grid.innerHTML = cardsHtml;
};

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
      window.renderAllHomeCards();
    })
    .catch(err => {
      console.error('toggleHomeCard error:', err);
      alert('Failed to update visibility: ' + err.message);
    });
};

// Initialize render on page load
setTimeout(() => {
  if (document.getElementById('mods-grid')) {
    window.renderAllHomeCards();
  }
}, 50);

window.HomePage = HomePage;
