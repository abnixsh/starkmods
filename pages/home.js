// pages/home.js

// --- 1. DATA LOGIC (DO NOT TOUCH) ---
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

  // --- 2. ADMIN CONTROLS ---
  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    const label = hidden ? 'Show' : 'Hide';
    const icon  = hidden ? 'visibility' : 'visibility_off';
    // Small floating admin pill
    return `
      <div class="absolute top-3 right-3 z-30">
        <button onclick="window.toggleHomeCard('${id}')"
                class="flex items-center gap-1 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg">
          <span class="material-icons text-[12px]">${icon}</span>
          <span>${label}</span>
        </button>
      </div>`;
  };

  // --- 3. COMPONENT: RENDER CARD (App Store Style) ---
  const renderCard = (id, data) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50 grayscale' : '';
    
    // Destructuring data for cleaner HTML
    const { title, subtitle, icon, image, version, tags, link } = data;

    return `
      <article class="ios-card-wrapper group relative flex flex-col ${extraClasses}" data-card-id="${id}">
        ${adminControls(id)}
        
        <!-- Large Cover Image -->
        <div class="relative w-full aspect-video sm:aspect-[4/3] overflow-hidden rounded-t-[28px] cursor-pointer" onclick="window.router.navigateTo('${link}')">
            <div class="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <img src="${image}" alt="${title}" 
                 class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                 onload="this.previousElementSibling.remove()"
                 onerror="this.src='https://placehold.co/600x400/1e293b/FFF?text=${title}'">
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            
            <!-- Floating Version Badge -->
            <div class="absolute bottom-3 left-4">
               <span class="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase">
                 ${version}
               </span>
            </div>
        </div>

        <!-- Content Section (Glass) -->
        <div class="ios-card-body flex-1 p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-x border-b border-white/50 dark:border-white/5 rounded-b-[28px] flex flex-col relative z-10">
            
            <div class="flex items-start justify-between mb-4">
                <div class="flex gap-4">
                    <img src="${icon}" class="w-14 h-14 rounded-[14px] shadow-sm border border-black/5 dark:border-white/10" onerror="this.src='https://placehold.co/64'">
                    <div class="flex flex-col justify-center">
                        <h3 class="text-[17px] font-semibold text-slate-900 dark:text-white leading-tight -mt-0.5">${title}</h3>
                        <p class="text-[13px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1">${subtitle}</p>
                    </div>
                </div>
            </div>

            <!-- Tags & Action -->
            <div class="mt-auto flex items-center justify-between">
                <div class="flex gap-1.5">
                   ${tags.map(tag => `
                     <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${tag === 'Free' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}">
                       ${tag}
                     </span>
                   `).join('')}
                </div>
                
                <button onclick="window.router.navigateTo('${link}')" 
                        class="ios-get-btn bg-slate-100 hover:bg-slate-200 text-blue-600 dark:bg-slate-800 dark:text-blue-400 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all active:scale-95">
                  GET
                </button>
            </div>
        </div>
      </article>`;
  };

  // --- 4. CSS INJECTION (Premium Styling) ---
  if (!document.getElementById('stark-ios-v2')) {
    const s = document.createElement('style');
    s.id = 'stark-ios-v2';
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

      :root {
        --ios-blue: #007AFF;
        --ios-bg-light: #F5F5F7;
        --ios-bg-dark: #000000;
      }

      body {
        font-family: 'Inter', -apple-system, sans-serif;
        background-color: var(--ios-bg-light);
      }
      .dark body {
        background-color: var(--ios-bg-dark);
      }

      /* Marquee Animation */
      .marquee-container {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        background: #111;
        color: white;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        padding: 10px 0;
        position: relative;
        z-index: 10;
      }
      .marquee-content {
        display: inline-block;
        animation: scrollText 30s linear infinite;
      }
      @keyframes scrollText {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      /* iOS Glass Effects */
      .ios-glass {
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .dark .ios-glass {
        background: rgba(28, 28, 30, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* Bento Grid Widget */
      .bento-widget {
        background: #fff;
        border-radius: 22px;
        padding: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.03);
        border: 1px solid rgba(0,0,0,0.04);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
      }
      .dark .bento-widget {
        background: #1c1c1e;
        border: 1px solid rgba(255,255,255,0.05);
      }
      .bento-widget:hover {
        transform: scale(1.02);
      }

      /* Card Shadows */
      .ios-card-wrapper {
        border-radius: 28px;
        box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
        transition: transform 0.3s ease;
      }
      .ios-card-wrapper:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 50px -10px rgba(0,0,0,0.12);
      }

      /* Animations */
      .fade-up {
        animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: translateY(20px);
      }
      @keyframes fadeUp {
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(s);
  }

  // --- 5. RENDER HTML ---
  return `
  <!-- Top Marquee (Full Width) -->
  <div class="marquee-container -mt-10 mb-8 shadow-sm">
    <div class="marquee-content">
      Premium iOS Mods • Update v7+ Available • Join Telegram for Support • 100% Anti-Ban Guarantee • Premium iOS Mods • Update v7+ Available • Join Telegram for Support • 100% Anti-Ban Guarantee •
    </div>
  </div>

  <div class="max-w-5xl mx-auto pb-32 px-4 sm:px-6">

    <!-- HERO SECTION -->
    <header class="flex flex-col items-center text-center mb-12 fade-up" style="animation-delay: 0.1s">
       
       <!-- Logo Image -->
       <div class="mb-6 relative group">
          <div class="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          <img src="assets/icons/starkimage.png" alt="Stark Mods" 
               class="relative w-64 sm:w-80 h-auto object-contain drop-shadow-lg"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<h1 class=\'text-6xl font-black tracking-tighter text-slate-900 dark:text-white\'>Stark Mods</h1>'">
       </div>

       <!-- Tagline -->
       <h2 class="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mb-8">
         Unlock the ultimate gaming experience.<br class="hidden sm:block"> Premium & Secure Mod Menus.
       </h2>

       <!-- Quick Actions Pill (Glass) -->
       <div class="ios-glass inline-flex items-center p-1.5 rounded-full shadow-lg gap-2">
          
          <button onclick="document.getElementById('search-mods').focus()" 
                  class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all" title="Search">
            <span class="material-icons text-[20px]">search</span>
          </button>

          <div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

          <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                  class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-500/30" title="Telegram">
             <span class="material-icons text-[20px] -ml-0.5 mt-0.5 -rotate-12">telegram</span>
          </button>

          <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                  class="w-12 h-12 flex items-center justify-center rounded-full bg-[#5865F2] text-white hover:bg-[#4752c4] active:scale-95 transition-all shadow-md shadow-indigo-500/30" title="Discord">
             <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
          </button>
       </div>

    </header>

    <!-- BENTO STATS -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 fade-up" style="animation-delay: 0.2s">
        <div class="bento-widget">
            <span class="text-3xl font-bold text-blue-600 mb-1">5+</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Mods</span>
        </div>
        <div class="bento-widget">
            <span class="text-3xl font-bold text-green-500 mb-1">40k</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Downloads</span>
        </div>
        <div class="bento-widget">
            <span class="material-icons text-3xl text-purple-500 mb-1">support_agent</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">24/7 Support</span>
        </div>
        <div class="bento-widget">
            <span class="material-icons text-3xl text-amber-500 mb-1">verified_user</span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">100% Safe</span>
        </div>
    </section>

    <!-- SEARCH & FILTER -->
    <div class="fade-up mb-8 sticky top-4 z-40" style="animation-delay: 0.3s">
       <div class="ios-glass rounded-2xl flex items-center p-2 shadow-sm">
           <span class="material-icons text-slate-400 ml-3">search</span>
           <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                  placeholder="Search Apps & Games" 
                  class="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-900 dark:text-white px-3 py-2 placeholder-slate-400">
           
           <div class="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
           
           <select id="filter-category" onchange="window.filterMods()" 
                   class="bg-transparent text-xs font-bold text-slate-500 dark:text-slate-400 border-none outline-none mr-2 cursor-pointer">
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="premium">Paid</option>
           </select>
       </div>
    </div>

    <!-- MAIN GRID -->
    <div class="flex items-center justify-between mb-6 px-1 fade-up" style="animation-delay: 0.35s">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Featured Mods</h2>
        <span class="text-xs font-medium text-blue-500 cursor-pointer">See All</span>
    </div>

    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-up" id="mods-grid" style="animation-delay: 0.4s">
       
       ${renderCard('rc25', {
          title: 'RC25 Fan-Made',
          subtitle: 'Ultimate Patch Update v7+',
          icon: 'assets/icons/icon_rc25.jpg',
          image: 'assets/img/img_rc25_1.jpg',
          version: 'v7.0',
          tags: ['Free', 'Sports'],
          link: '/rc25'
       })}

       ${renderCard('rc24', {
          title: 'RC Realistic V3',
          subtitle: 'High-Res Textures & Jerseys',
          icon: 'assets/icons/icon_rc24.png',
          image: 'assets/img/img_rc24_1.jpg',
          version: 'v4.6',
          tags: ['Free', 'Graphics'],
          link: '/rc24'
       })}

       ${renderCard('rc20', {
          title: 'RC20 Mod Menu',
          subtitle: 'VIP Cheats & Unlocks',
          icon: 'assets/icons/icon_rc20.jpg',
          image: 'assets/img/img_rc20_1.jpg',
          version: 'v6.1',
          tags: ['Premium', 'Mod Menu'],
          link: '/rc20'
       })}

       ${renderCard('wcc3', {
          title: 'WCC3 VIP Injector',
          subtitle: 'Career Unlock & Platinum',
          icon: 'assets/icons/icon_wcc3.png',
          image: 'assets/img/img_wcc3_1.jpg',
          version: 'v3.2',
          tags: ['Premium', 'Career'],
          link: '/wcc3'
       })}

    </section>

  </div>
  `;
}

// --- 6. UTILITY FUNCTIONS (Unchanged logic) ---
window.filterMods = function() {
   const query = document.getElementById('search-mods').value.toLowerCase();
   const filter = document.getElementById('filter-category').value;
   const cards = document.querySelectorAll('.ios-card-wrapper');
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
         card.style.display = 'flex';
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
           noResultEl.className = 'col-span-1 md:col-span-3 py-20 text-center';
           noResultEl.innerHTML = `
             <div class="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <span class="material-icons text-3xl text-slate-400">search_off</span>
             </div>
             <p class="font-semibold text-slate-500">No results found.</p>
           `;
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
