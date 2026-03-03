// pages/home.js

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
  db.collection('siteConfig').doc('homeCards').get()
    .then(doc => {
      const data = doc.exists ? (doc.data() || {}) : {};
      window.homeHiddenCards = Array.isArray(data.hidden) ? data.hidden : [];
      window.homeConfigLoaded = true;
      if (window.router && location.pathname.replace(/\/$/, '') === '/') {
        window.router.handleRoute('/');
      }
    })
    .catch(err => {
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
    return `
      <div class="flex justify-between items-center mb-3">
        ${hidden ? '<span class="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Hidden</span>' : ''}
        <button onclick="window.toggleHomeCard('${id}')" 
                class="ml-auto p-1.5 rounded-full bg-white/10 dark:bg-black/10 border border-black/5 dark:border-white/10 hover:bg-red-500/10 transition group">
          <span class="material-icons text-[14px] text-slate-400 group-hover:text-red-500">${hidden ? 'visibility' : 'visibility_off'}</span>
        </button>
      </div>`;
  };

  const renderCard = (id, title, subtitle, badges, icon, bgImg, desc, route) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-40 scale-[0.98]' : '';

    return `
      <div class="group relative overflow-hidden rounded-[2.5rem] bg-[#FBFBFD] dark:bg-[#1C1C1E] border border-black/[0.03] dark:border-white/[0.03] shadow-sm hover:shadow-2xl transition-all duration-500 ${extraClasses}">
        <div class="p-6">
          ${adminControls(id)}
          <div class="flex items-center gap-4 mb-5">
            <img src="${icon}" class="w-14 h-14 rounded-2xl shadow-lg ring-1 ring-black/5" onerror="this.src='https://placehold.co/64'">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">${title}</h3>
              <p class="text-[11px] text-[#86868B] font-medium tracking-wide uppercase">${subtitle}</p>
            </div>
          </div>
          <div class="relative h-40 rounded-2xl overflow-hidden mb-5 bg-black cursor-pointer" onclick="window.router.navigateTo('${route}')">
             <img src="${bgImg}" class="w-full h-full object-cover transition duration-1000 group-hover:scale-105" onerror="this.src='https://placehold.co/400x200'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
             <div class="absolute bottom-3 left-3 flex gap-1.5">${badges}</div>
          </div>
          <p class="text-[13px] text-[#48484A] dark:text-[#A1A1A6] leading-relaxed mb-6 line-clamp-2">${desc}</p>
          <button onclick="window.router.navigateTo('${route}')" 
                  class="w-full py-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-semibold transition transform active:scale-95">
             Explore Mod
          </button>
        </div>
      </div>
    `;
  };

  return `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
    
    .cursive-ios {
      font-family: 'Dancing+Script', cursive;
      background: linear-gradient(135deg, #1D1D1F 0%, #434343 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .dark .cursive-ios {
      background: linear-gradient(135deg, #FFFFFF 0%, #A1A1A6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* iOS "Hello" Stroke Animation */
    .ios-draw-text {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: iosDraw 3s cubic-bezier(0.45, 0, 0.55, 1) forwards;
    }

    @keyframes iosDraw {
      to { stroke-dashoffset: 0; }
    }

    .glass-search {
       background: rgba(255, 255, 255, 0.7);
       backdrop-filter: blur(20px) saturate(180%);
       -webkit-backdrop-filter: blur(20px) saturate(180%);
    }
    .dark .glass-search {
       background: rgba(28, 28, 30, 0.7);
    }
  </style>

  <div class="max-w-6xl mx-auto pb-32 pt-10 px-4 sm:px-6 animate-fade-in">
    
    <header class="flex flex-col items-center justify-center text-center mb-16 pt-8">
      <div class="relative mb-4">
        <h1 class="cursive-ios text-6xl sm:text-8xl py-2 tracking-tight">Stark Mods</h1>
        <div class="h-1 w-24 bg-blue-500 mx-auto rounded-full mt-2 opacity-50 blur-[2px]"></div>
      </div>
      
      <p class="text-lg sm:text-xl text-[#86868B] font-medium tracking-tight mb-10 max-w-lg">
        The gold standard in gaming security. <br> Seamless. Secure. Sovereign.
      </p>

      <div class="flex flex-wrap justify-center gap-4">
        <a href="https://t.me/starkrc20" target="_blank" class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 transition-all font-semibold text-sm">
           <i class="fab fa-telegram"></i> Telegram
        </a>
        <a href="https://discord.gg/KaeHESH9n" target="_blank" class="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20 hover:bg-[#5865F2]/20 transition-all font-semibold text-sm">
           <i class="fab fa-discord"></i> Discord
        </a>
      </div>
    </header>

    <div class="sticky top-6 z-40 mb-16 mx-auto max-w-2xl">
      <div class="glass-search flex items-center p-2 rounded-[2rem] border border-black/[0.05] dark:border-white/[0.05] shadow-2xl shadow-black/5 ring-1 ring-black/5">
         <span class="material-icons ml-4 text-[#86868B]">search</span>
         <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                placeholder="Search mods..."
                class="flex-1 px-4 py-3 bg-transparent border-none outline-none text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
         <select id="filter-category" onchange="window.filterMods()" 
                 class="mr-2 px-4 py-2 bg-black/5 dark:bg-white/5 border-none outline-none text-xs font-bold rounded-full cursor-pointer appearance-none">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
         </select>
      </div>
    </div>

    <section class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="mods-grid">
      ${renderCard('rc25', 'RC25 Fan-Made', 'Patch Update', 
        '<span class="bg-red-500/80 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">V7+</span><span class="bg-sky-500/80 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">FREE</span>',
        'assets/icons/icon_rc25.jpg', 'assets/img/img_rc25_1.jpg', 
        'The ultimate RC25 Patch. Enhanced graphics and updated squads for the best cricket experience.', '/rc25')}

      ${renderCard('rc24', 'RC Realistic V3', 'v4.6 Patch', 
        '<span class="bg-purple-500/80 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">T20 WC</span><span class="bg-sky-500/80 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">FREE</span>',
        'assets/icons/icon_rc24.png', 'assets/img/img_rc24_1.jpg', 
        'New 2026 World Cup Jerseys and realistic stadiums. Updated player faces and high-definition textures.', '/rc24')}

      ${renderCard('rc20', 'RC20 Mod Menu', 'VIP Cheats', 
        '<span class="bg-amber-500 text-black text-[9px] px-2 py-0.5 rounded-full font-bold">PREMIUM</span>',
        'assets/icons/icon_rc20.jpg', 'assets/img/img_rc20_1.jpg', 
        'Timing Hacks, Unlimited Coins/Tickets, and all Tournaments unlocked with VIP security.', '/rc20')}

      ${renderCard('wcc3', 'WCC3 Mod Menu', 'ViP Injector', 
        '<span class="bg-amber-500 text-black text-[9px] px-2 py-0.5 rounded-full font-bold">PREMIUM</span>',
        'assets/icons/icon_wcc3.png', 'assets/img/img_wcc3_1.jpg', 
        'Unlock Career Mode and Unlimited Platinum. NPL Auction ready and fully safe for online play.', '/wcc3')}
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
   const cards = document.querySelectorAll('.group.relative');

   cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const isFree = text.includes('free');
      const isPremium = text.includes('premium');
      let matches = text.includes(query);
      if (filter === 'free' && !isFree) matches = false;
      if (filter === 'premium' && !isPremium) matches = false;
      card.style.display = matches ? 'block' : 'none';
   });
};

window.toggleHomeCard = function (id) {
  if (!window.isAdmin || !window.db) return;
  let arr = Array.isArray(window.homeHiddenCards) ? [...window.homeHiddenCards] : [];
  const idx = arr.indexOf(id);
  idx === -1 ? arr.push(id) : arr.splice(idx, 1);

  db.collection('siteConfig').doc('homeCards').set({ hidden: arr }, { merge: true })
    .then(() => {
      window.homeHiddenCards = arr;
      if (window.router) window.router.handleRoute('/');
    });
};

window.HomePage = HomePage;
