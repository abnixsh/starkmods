// pages/home.js

// Global state
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

// Load hidden cards logic
window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) { setTimeout(window.loadHomeHiddenCardsOnce, 200); return; }
  
  window._homeConfigFetchStarted = true;
  db.collection('siteConfig').doc('homeCards').get()
    .then(doc => {
      const data = doc.exists ? (doc.data() || {}) : {};
      window.homeHiddenCards = Array.isArray(data.hidden) ? data.hidden : [];
      window.homeConfigLoaded = true;
      if (window.router && location.pathname.replace(/\/$/, '') === '/') window.router.handleRoute('/');
    })
    .catch(() => { window.homeHiddenCards = []; window.homeConfigLoaded = true; });
};

function HomePage() {
  window.loadHomeHiddenCardsOnce();
  const isAdmin = !!window.isAdmin;
  const isHidden = (id) => window.homeHiddenCards.includes(id);

  // Admin Controls (Show/Hide)
  const adminControls = (id) => {
    if (!isAdmin) return '';
    return `
      <div class="absolute top-4 right-4 z-20">
        <button onclick="window.toggleHomeCard('${id}')" 
                class="text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20 transition shadow-lg
                ${isHidden(id) ? 'bg-red-500/80 text-white' : 'bg-black/30 text-white'}">
          ${isHidden(id) ? 'HIDDEN' : 'VISIBLE'}
        </button>
      </div>`;
  };

  // Card Template
  const renderCard = (id, title, pkg, badge, badgeColor, imgPath, desc, link) => {
    if (!isAdmin && isHidden(id)) return '';
    const opacityClass = isHidden(id) ? 'opacity-60 grayscale' : '';

    return `
      <article class="app-card flex flex-col h-full p-5 ${opacityClass}" data-card-id="${id}">
        ${adminControls(id)}
        
        <div class="flex items-start gap-4 mb-4">
          <img src="${imgPath}" 
               class="w-16 h-16 rounded-2xl shadow-md object-cover bg-slate-100" 
               onerror="this.src='https://placehold.co/128/007AFF/ffffff?text=${title}'">
          <div>
            <h3 class="text-lg font-bold leading-tight">${title}</h3>
            <p class="text-[10px] text-muted font-mono mb-2">${pkg}</p>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-${badgeColor}-100 text-${badgeColor}-700 dark:bg-${badgeColor}-900/30 dark:text-${badgeColor}-300">
              ${badge}
            </span>
          </div>
        </div>

        <div class="relative h-40 mb-4 rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 group cursor-pointer"
             onclick="window.router.navigateTo('${link}')">
           <img src="assets/img/img_${id}_1.jpg" 
                class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                onerror="this.src='https://placehold.co/600x320/1e293b/ffffff?text=${title}+Gameplay'">
           
           <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
             <span class="text-white text-xs font-bold flex items-center gap-1">
               <span class="material-icons text-sm">visibility</span> Preview
             </span>
           </div>
        </div>

        <p class="text-sm text-muted mb-6 line-clamp-2 flex-1">
          ${desc}
        </p>

        <button onclick="window.router.navigateTo('${link}')" 
                class="btn w-full py-3.5 mt-auto flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20">
          <span>Download</span> 
          <span class="material-icons text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
      </article>
    `;
  };

  return `
  <div class="max-w-7xl mx-auto pb-24 animate-fade-in px-4 pt-6">

    <section class="relative rounded-[2.5rem] p-8 sm:p-14 mb-12 text-center overflow-hidden border border-white/20 shadow-2xl isolate">
       <div class="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl -z-10"></div>
       
       <div class="relative z-10 flex flex-col items-center">
          <span class="py-1 px-4 rounded-full bg-black/5 dark:bg-white/10 border border-white/10 backdrop-blur-md mb-6 text-[10px] font-bold uppercase tracking-widest">
            <span class="text-green-500">●</span> System Online
          </span>

          <h1 class="text-5xl sm:text-7xl font-black mb-4 tracking-tighter drop-shadow-sm text-gradient">
            Stark Mods
          </h1>
          
          <p class="text-lg text-muted mb-8 max-w-xl mx-auto font-medium">
            Next-Gen Mod Menus for RC25, WCC3 & more. Secure, Anti-Ban & Always Updated.
          </p>
          
          <div class="flex flex-wrap justify-center gap-3">
             <button onclick="document.getElementById('search-mods').focus()" class="btn px-8 py-3.5">
               Browse Mods
             </button>
             <button onclick="window.open('https://t.me/imsergiomoreio', '_blank')" 
                     class="px-8 py-3.5 rounded-2xl font-bold bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 text-blue-600 dark:text-blue-400 border border-white/20 backdrop-blur-md transition">
               Telegram
             </button>
          </div>
       </div>
    </section>

    <div class="sticky top-20 z-40 mb-10 max-w-2xl mx-auto">
      <div class="glass-bar p-2 rounded-full flex items-center shadow-xl border border-white/20">
         <span class="material-icons text-slate-400 ml-4">search</span>
         <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                placeholder="Search games..." 
                class="bg-transparent border-none outline-none w-full px-3 text-sm font-bold text-main placeholder-slate-400 h-10">
         <div class="pr-2">
            <select id="filter-category" onchange="window.filterMods()" class="bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-xs font-bold cursor-pointer outline-none">
               <option value="all">All</option>
               <option value="free">Free</option>
               <option value="premium">Premium</option>
            </select>
         </div>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6" id="mods-grid">
      
      ${renderCard('rc25', 'RC25 Fan-Made', 'com.nautilus.RC3D', 'v7.0', 'green', 'assets/icons/icon_rc25.jpg', 
        'The ultimate RC25 Patch. Upgraded Enhanced version of RC20 for the fans of Real Cricket.', '/rc25')}

      ${renderCard('rc24', 'RC Realistic V2', 'com.nautilus.RealCricket', 'v4.5', 'green', 'assets/icons/icon_rc24.png', 
        'Realistic textures, stadiums, and faces. The best graphical overhaul for RC24.', '/rc24')}

      ${renderCard('rc20', 'RC20 Mod Menu', 'com.nautilus.RC3D', 'Premium', 'amber', 'assets/icons/icon_rc20.jpg', 
        'VIP Menu: Unlimited Coins, Tickets, All Tournaments Unlocked & Timing Hack.', '/rc20')}

      ${renderCard('wcc3', 'WCC3 Mod Menu', 'com.nextwave.wcc3', 'Premium', 'amber', 'assets/icons/icon_wcc3.png', 
        'Unlock Career Mode, Unlimited Platinum, and NPL Auction instantly.', '/wcc3')}

    </div>

  </div>`;
}

// Logic
window.filterMods = function() {
   const query = document.getElementById('search-mods').value.toLowerCase();
   const filter = document.getElementById('filter-category').value;
   const cards = document.querySelectorAll('.app-card');
   let found = 0;

   cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const isFree = text.includes('free');
      const isPremium = text.includes('premium');
      
      let match = text.includes(query);
      if (filter === 'free' && !isFree) match = false;
      if (filter === 'premium' && !isPremium) match = false;

      if (match) {
         card.style.display = 'flex';
         found++;
      } else {
         card.style.display = 'none';
      }
   });
};

window.toggleHomeCard = function(id) {
  if(!window.isAdmin) return;
  let arr = window.homeHiddenCards.includes(id) 
    ? window.homeHiddenCards.filter(x => x !== id)
    : [...window.homeHiddenCards, id];
    
  db.collection('siteConfig').doc('homeCards').set({ hidden: arr }, { merge: true })
    .then(() => { window.homeHiddenCards = arr; window.router.handleRoute('/'); });
};

window.HomePage = HomePage;
