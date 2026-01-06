// pages/home.js

// Global state for hidden cards
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

// Load hidden cards config
window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) { setTimeout(window.loadHomeHiddenCardsOnce, 200); return; }

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
      console.error(err);
      window.homeConfigLoaded = true;
    });
};

function HomePage() {
  window.loadHomeHiddenCardsOnce();
  const isAdmin = !!window.isAdmin;
  const isHidden = (id) => window.homeHiddenCards.includes(id);

  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    return `
      <div class="flex justify-end mb-1">
        <button onclick="window.toggleHomeCard('${id}')" class="text-slate-400 hover:text-red-500 text-[10px] uppercase font-bold flex items-center gap-1">
          <span class="material-icons text-xs">${hidden ? 'visibility' : 'visibility_off'}</span>
          ${hidden ? 'Show' : 'Hide'}
        </button>
      </div>`;
  };

  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return ''; // Hide for users
    const opacity = isHidden(id) ? 'opacity-50 grayscale' : '';
    return `<article class="app-card p-6 transition-all duration-300 ${opacity}" data-card-id="${id}">${adminControls(id)}${innerHtml}</article>`;
  };

  return `
  <div class="max-w-6xl mx-auto pb-20 animate-fade-in">

    <section class="relative bg-gradient-to-br from-[var(--accent)] to-black rounded-3xl p-8 sm:p-12 mb-8 text-white overflow-hidden shadow-2xl isolate">
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>

      <div class="relative z-10 text-center max-w-2xl mx-auto">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          System Online
        </div>
        
        <h1 class="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
          STARK MODS
        </h1>
        <p class="text-lg text-white/80 mb-8 font-light">
          Premium Mod Menus. Anti-Ban Security. <span class="font-bold text-white">Unleash Power.</span>
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button onclick="document.getElementById('mod-search').focus()" 
                  class="bg-white text-black px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-100 transition shadow-lg flex items-center justify-center gap-2">
            <span class="material-icons">search</span> Browse Mods
          </button>
          <button onclick="window.open('https://t.me/imsergiomoreio', '_blank')" 
                  class="bg-black/40 hover:bg-black/60 border border-white/20 text-white px-8 py-3.5 rounded-2xl font-bold backdrop-blur-md transition flex items-center justify-center gap-2">
            <span class="material-icons">telegram</span> Join Channel
          </button>
        </div>
      </div>
    </section>

    <div class="sticky top-20 z-40 bg-[var(--bg-color)]/80 backdrop-blur-xl py-2 mb-8 transition-colors duration-300 rounded-2xl">
      <div class="flex gap-3">
        <div class="relative flex-1">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input type="text" id="mod-search" onkeyup="window.filterMods()" 
                 placeholder="Search games (e.g. RC24)..." 
                 class="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-[var(--accent)] transition">
        </div>
        <select onchange="window.filterMods()" id="mod-category" 
                class="bg-white/50 dark:bg-black/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition">
          <option value="all">All</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div class="bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center backdrop-blur-sm">
        <div class="text-2xl font-black text-[var(--accent)]">5+</div>
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Mods</div>
      </div>
      <div class="bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center backdrop-blur-sm">
        <div class="text-2xl font-black text-green-500">15k+</div>
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Downloads</div>
      </div>
      <div class="bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center backdrop-blur-sm">
        <div class="text-2xl font-black text-purple-500">24/7</div>
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Support</div>
      </div>
      <div class="bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center backdrop-blur-sm">
        <div class="text-2xl font-black text-amber-500">100%</div>
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Secure</div>
      </div>
    </div>

    <section class="grid md:grid-cols-3 gap-6" id="mod-grid">

      ${renderCard('rc25', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <img src="assets/icons/icon_rc25.jpg" class="h-14 w-14 rounded-2xl shadow-md" onerror="this.src='https://placehold.co/64?text=RC25'" />
            <div class="flex-1">
              <div class="text-lg font-bold">RC25 Fan-Made</div>
              <div class="text-xs text-slate-500">com.nautilus.RealCricket3D</div>
              <div class="mt-1 flex gap-1"><span class="badge bg-green-100 text-green-800">Free</span></div>
            </div>
          </div>
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-32 relative">
             <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition" onerror="this.src='https://placehold.co/320x180?text=RC25'">
          </div>
          <button onclick="window.router.navigateTo('/rc25')" class="btn w-full py-3 text-sm">Download</button>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <img src="assets/icons/icon_rc24.png" class="h-14 w-14 rounded-2xl shadow-md" onerror="this.src='https://placehold.co/64?text=RC24'" />
            <div class="flex-1">
              <div class="text-lg font-bold">RC Realistic V2</div>
              <div class="text-xs text-slate-500">com.nautilus.RealCricket</div>
              <div class="mt-1 flex gap-1"><span class="badge bg-green-100 text-green-800">Free</span><span class="badge">Patch</span></div>
            </div>
          </div>
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-32 relative">
             <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition" onerror="this.src='https://placehold.co/320x180?text=RC24'">
          </div>
          <button onclick="window.router.navigateTo('/rc24')" class="btn w-full py-3 text-sm">Download</button>
        </div>
      `)}

      ${renderCard('rc20', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <img src="assets/icons/icon_rc20.jpg" class="h-14 w-14 rounded-2xl shadow-md" onerror="this.src='https://placehold.co/64?text=RC20'" />
            <div class="flex-1">
              <div class="text-lg font-bold">RC20 Mod Menu</div>
              <div class="text-xs text-slate-500">com.nautilus.RC3D</div>
              <div class="mt-1 flex gap-1"><span class="badge bg-amber-100 text-amber-800">Premium</span></div>
            </div>
          </div>
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-32 relative">
             <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition" onerror="this.src='https://placehold.co/320x180?text=RC20'">
          </div>
          <button onclick="window.router.navigateTo('/rc20')" class="btn w-full py-3 text-sm">View Details</button>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <img src="assets/icons/icon_wcc3.png" class="h-14 w-14 rounded-2xl shadow-md" onerror="this.src='https://placehold.co/64?text=WCC3'" />
            <div class="flex-1">
              <div class="text-lg font-bold">WCC3 Mod Menu</div>
              <div class="text-xs text-slate-500">com.nextwave.wcc3</div>
              <div class="mt-1 flex gap-1"><span class="badge bg-amber-100 text-amber-800">Premium</span></div>
            </div>
          </div>
          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-32 relative">
             <img src="assets/img/img_wcc3_1.jpg" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
          </div>
          <button onclick="window.router.navigateTo('/wcc3')" class="btn w-full py-3 text-sm">View Details</button>
        </div>
      `)}

    </section>
  </div>
  `;
}

// Search & Filter Logic
window.filterMods = function() {
  const query = document.getElementById('mod-search').value.toLowerCase();
  const cat = document.getElementById('mod-category').value.toLowerCase();
  const cards = document.querySelectorAll('.app-card');

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const isFree = text.includes('free');
    const isPremium = text.includes('premium') || text.includes('paid');
    
    let matchesCat = true;
    if (cat === 'free' && !isFree) matchesCat = false;
    if (cat === 'premium' && !isPremium) matchesCat = false;

    if (text.includes(query) && matchesCat) {
      card.style.display = 'block';
      card.classList.remove('animate-fade-in');
      void card.offsetWidth; 
      card.classList.add('animate-fade-in');
    } else {
      card.style.display = 'none';
    }
  });
};

// Admin hide/show
window.toggleHomeCard = function (id) {
  if (!window.isAdmin) return alert('Admin only');
  let arr = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards.slice() : [];
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id); else arr.splice(idx, 1);

  db.collection('siteConfig').doc('homeCards').set({ hidden: arr }, { merge: true })
    .then(() => {
      window.homeHiddenCards = arr;
      if (window.router) window.router.handleRoute('/');
    });
};

window.HomePage = HomePage;
