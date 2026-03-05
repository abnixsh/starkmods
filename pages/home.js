// pages/home.js

// --- 1. DATA LOGIC (UNCHANGED) ---
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
    const label = hidden ? 'SHOW' : 'HIDE';
    const icon  = hidden ? 'visibility' : 'visibility_off';
    return `
      <div class="absolute top-0 right-0 z-30">
        <button onclick="window.toggleHomeCard('${id}')"
                class="bg-red-600 text-white px-3 py-1 text-[10px] font-mono border-l border-b border-black hover:bg-red-700">
          ${label}
        </button>
      </div>`;
  };

  // --- 3. RENDER CARD (Cyberpunk Style) ---
  const renderCard = (id, data) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50 grayscale' : '';
    const { title, subtitle, icon, image, version, tags, link } = data;

    return `
      <div class="cyber-card group relative bg-[#0a0a0a] border border-[#333] hover:border-cyan-500 transition-all duration-300 ${extraClasses}" data-card-id="${id}">
        ${adminControls(id)}
        
        <!-- Image Area with Cut Corner -->
        <div class="relative h-40 overflow-hidden cursor-pointer cyber-image-mask" onclick="window.router.navigateTo('${link}')">
            <img src="${image}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
            
            <!-- Version Badge (Tech Tag) -->
            <div class="absolute top-2 left-2 bg-cyan-900/80 border border-cyan-500/50 px-2 py-0.5 text-[10px] text-cyan-100 font-mono">
                VER: ${version}
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 relative">
            <div class="absolute -top-6 right-4 w-12 h-12 bg-[#0a0a0a] border border-[#333] p-1 shadow-lg group-hover:border-cyan-500 transition-colors">
                <img src="${icon}" class="w-full h-full object-cover">
            </div>

            <h3 class="text-xl font-bold text-white font-rajdhani uppercase tracking-wide group-hover:text-cyan-400 transition-colors">${title}</h3>
            <p class="text-xs text-gray-500 font-mono mb-4">_TARGET: ${subtitle}</p>

            <div class="flex items-center justify-between mt-4 border-t border-[#222] pt-3">
                <div class="flex gap-2">
                    ${tags.map(tag => `<span class="text-[9px] text-gray-400 border border-gray-700 px-1 uppercase">${tag}</span>`).join('')}
                </div>
                <button onclick="window.router.navigateTo('${link}')" 
                   class="cyber-button text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-black px-4 py-1 clip-button transition-all">
                   INITIALIZE >
                </button>
            </div>
        </div>
      </div>
    `;
  };

  // --- 4. CSS INJECTION (Futuristic Theme) ---
  if (!document.getElementById('stark-cyber-v1')) {
    const s = document.createElement('style');
    s.id = 'stark-cyber-v1';
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

      :root {
        --c-bg: #050505;
        --c-accent: #00f0ff; /* Cyber Cyan */
        --c-accent-dim: rgba(0, 240, 255, 0.1);
        --c-purple: #bc13fe;
      }

      body {
        font-family: 'Rajdhani', sans-serif;
        background-color: var(--c-bg);
        background-image: 
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 40px 40px;
        color: #e2e8f0;
      }

      .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }

      /* GLITCH TEXT EFFECT */
      .glitch-text {
        position: relative;
        color: white;
      }
      .glitch-text::before, .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
      }
      .glitch-text::before {
        left: 2px; text-shadow: -1px 0 #ff00c1; clip: rect(44px, 450px, 56px, 0);
        animation: glitch-anim 5s infinite linear alternate-reverse;
      }
      .glitch-text::after {
        left: -2px; text-shadow: -1px 0 #00fff9; clip: rect(44px, 450px, 56px, 0);
        animation: glitch-anim2 5s infinite linear alternate-reverse;
      }
      @keyframes glitch-anim {
        0% { clip: rect(12px, 9999px, 56px, 0); }
        5% { clip: rect(68px, 9999px, 9px, 0); }
        100% { clip: rect(10px, 9999px, 86px, 0); }
      }
      @keyframes glitch-anim2 {
        0% { clip: rect(85px, 9999px, 18px, 0); }
        5% { clip: rect(10px, 9999px, 4px, 0); }
        100% { clip: rect(32px, 9999px, 88px, 0); }
      }

      /* Cyber Card Styling */
      .cyber-card {
        clip-path: polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%);
      }
      .cyber-image-mask {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }
      .clip-button {
        clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 40%);
      }

      /* HUD Stats */
      .hud-box {
        background: rgba(0,0,0,0.6);
        border: 1px solid #333;
        border-left: 3px solid var(--c-accent);
        padding: 10px;
        position: relative;
      }
      .hud-box::after {
        content: ''; position: absolute; top: 0; right: 0; width: 8px; height: 8px;
        border-top: 1px solid var(--c-accent); border-right: 1px solid var(--c-accent);
      }

      /* Marquee */
      .cyber-marquee {
        background: var(--c-accent);
        color: black;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
        letter-spacing: 2px;
      }

      /* Search Input */
      .cyber-input {
        background: rgba(0,0,0,0.8);
        border: 1px solid #333;
        font-family: 'JetBrains Mono', monospace;
      }
      .cyber-input:focus {
        border-color: var(--c-accent);
        box-shadow: 0 0 15px var(--c-accent-dim);
      }

      /* Button Hover Glow */
      .glow-hover:hover {
        box-shadow: 0 0 10px var(--c-accent);
        text-shadow: 0 0 5px white;
      }
    `;
    document.head.appendChild(s);
  }

  // --- 5. RENDER HTML ---
  return `
  <!-- Scrolling Tech Line -->
  <div class="w-full overflow-hidden cyber-marquee py-1 -mt-6 mb-8 relative z-20">
    <div class="whitespace-nowrap animate-[marquee_20s_linear_infinite] inline-block">
       // SYSTEM UPDATE: V7.0 LIVE // ANTI-BAN PROTOCOLS: ACTIVE // 50% DISCOUNT INITIALIZED // SYSTEM UPDATE: V7.0 LIVE // ANTI-BAN PROTOCOLS: ACTIVE //
    </div>
  </div>

  <div class="max-w-6xl mx-auto pb-24 px-4 relative z-10">

    <!-- HERO SECTION -->
    <div class="flex flex-col items-center justify-center text-center mb-16">
        
        <!-- Tech Badge -->
        <div class="mb-6 flex items-center gap-2 border border-cyan-500/30 bg-cyan-950/20 px-4 py-1 rounded-sm">
            <div class="w-2 h-2 bg-cyan-400 animate-pulse"></div>
            <span class="text-cyan-400 text-xs font-mono tracking-widest">SYSTEM ONLINE</span>
        </div>

        <!-- Glitch Title -->
        <div class="relative mb-6">
            <h1 class="text-6xl sm:text-8xl font-black uppercase text-white tracking-tighter glitch-text" data-text="STARK MODS">
                STARK MODS
            </h1>
        </div>

        <p class="text-gray-400 max-w-lg mx-auto font-mono text-sm leading-relaxed mb-8">
            > Access granted.<br>
            > Injecting premium cheats for iOS & Android.<br>
            > Status: Undetected.
        </p>

        <!-- Hexagon/Tech Buttons -->
        <div class="flex gap-4">
             <button onclick="document.getElementById('search-mods').focus()" 
                class="border border-white/20 hover:border-cyan-400 text-white p-3 hover:bg-white/5 transition-all clip-button">
                <span class="material-icons">search</span>
             </button>
             <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                class="border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 p-3 transition-all clip-button">
                <span class="material-icons">telegram</span>
             </button>
             <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                class="border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 p-3 transition-all clip-button">
                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
             </button>
        </div>
    </div>

    <!-- HUD STATS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div class="hud-box">
            <h4 class="text-2xl font-bold text-white">5+</h4>
            <span class="text-[10px] text-cyan-500 uppercase">Modules Active</span>
        </div>
        <div class="hud-box" style="border-left-color: var(--c-purple)">
            <h4 class="text-2xl font-bold text-white">40K</h4>
            <span class="text-[10px] text-purple-500 uppercase">Users Connected</span>
        </div>
        <div class="hud-box">
            <h4 class="text-2xl font-bold text-white">24/7</h4>
            <span class="text-[10px] text-cyan-500 uppercase">Uptime</span>
        </div>
        <div class="hud-box" style="border-left-color: #22c55e">
            <h4 class="text-2xl font-bold text-white">100%</h4>
            <span class="text-[10px] text-green-500 uppercase">Secure</span>
        </div>
    </div>

    <!-- COMMAND LINE SEARCH -->
    <div class="mb-10 relative">
        <div class="cyber-input flex items-center p-3">
            <span class="text-cyan-500 mr-2 font-mono">root@stark:~#</span>
            <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                   placeholder="grep 'game_name'" 
                   class="w-full bg-transparent border-none outline-none text-white font-mono text-sm placeholder-gray-600">
            
            <select id="filter-category" onchange="window.filterMods()" 
                   class="bg-black text-xs font-mono text-gray-400 border border-gray-800 ml-2 px-2 py-1 outline-none">
              <option value="all">ALL</option>
              <option value="free">FREE</option>
              <option value="premium">PAID</option>
           </select>
        </div>
    </div>

    <!-- GRID -->
    <h2 class="text-xl text-white font-bold mb-6 flex items-center gap-2">
        <span class="w-2 h-2 bg-cyan-500"></span> AVAILABLE INJECTIONS
    </h2>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6" id="mods-grid">
       
       ${renderCard('rc25', {
          title: 'RC25 PATCH',
          subtitle: 'GRAPHICS_OVERHAUL',
          icon: 'assets/icons/icon_rc25.jpg',
          image: 'assets/img/img_rc25_1.jpg',
          version: '7.0.1',
          tags: ['FREE', 'VISUALS'],
          link: '/rc25'
       })}

       ${renderCard('rc24', {
          title: 'RC REALISTIC',
          subtitle: 'TEXTURE_PACK_V3',
          icon: 'assets/icons/icon_rc24.png',
          image: 'assets/img/img_rc24_1.jpg',
          version: '4.6',
          tags: ['FREE', 'TEXTURES'],
          link: '/rc24'
       })}

       ${renderCard('rc20', {
          title: 'RC20 GOD MODE',
          subtitle: 'VIP_MENU_ACCESS',
          icon: 'assets/icons/icon_rc20.jpg',
          image: 'assets/img/img_rc20_1.jpg',
          version: '6.1',
          tags: ['PREMIUM', 'HACK'],
          link: '/rc20'
       })}

       ${renderCard('wcc3', {
          title: 'WCC3 INJECTOR',
          subtitle: 'CURRENCY_UNLOCKER',
          icon: 'assets/icons/icon_wcc3.png',
          image: 'assets/img/img_wcc3_1.jpg',
          version: '3.2',
          tags: ['PREMIUM', 'CAREER'],
          link: '/wcc3'
       })}

    </section>

  </div>
  `;
}

// --- 6. UTILITY FUNCTIONS (Standard Logic) ---
window.filterMods = function() {
   const query = document.getElementById('search-mods').value.toLowerCase();
   const filter = document.getElementById('filter-category').value;
   const cards = document.querySelectorAll('.cyber-card'); // Updated selector
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
           noResultEl.className = 'col-span-1 md:col-span-3 py-20 text-center font-mono text-gray-600';
           noResultEl.innerHTML = `> ERROR: NO_DATA_FOUND <`;
           grid.appendChild(noResultEl);
       }
   } else {
       if(noResultEl) noResultEl.remove();
   }
};

window.toggleHomeCard = function (id) {
  if (!window.isAdmin) { alert('DENIED: Admin Access Required.'); return; }
  if (!window.db) { alert('System Offline.'); return; }

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
    });
};

window.HomePage = HomePage;
