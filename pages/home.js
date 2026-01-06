// pages/home.js

// Global state for hidden cards (loaded from Firestore)
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
      ? `<div class="mb-2 text-[10px] text-red-500 font-bold uppercase border border-red-200 bg-red-50 px-2 py-1 rounded inline-block">Hidden from users</div>`
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

  // Card Renderer
  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50 grayscale' : '';

    return `
      <article class="app-card p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition duration-300 ${extraClasses}"
               data-card-id="${id}">
        ${adminControls(id)}
        ${innerHtml}
      </article>
    `;
  };

  return `
  <div class="max-w-6xl mx-auto pb-20 animate-fade-in">

    <section class="relative rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
       <div class="relative z-10">
          <span class="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
            Premium & Secure
          </span>
          <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Stark Mods Store
          </h1>
          <p class="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get the best Mod Menus for RC25, WCC3, and more. <br class="hidden sm:block"> 
            <span class="font-semibold text-slate-700 dark:text-slate-300">Anti-Ban protections, regular updates, and 24/7 support.</span>
          </p>
          <div class="flex flex-wrap justify-center gap-4">
             <button onclick="document.getElementById('search-mods').focus()" class="btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2">
               <span class="material-icons text-sm">search</span> Browse Mods
             </button>
             <button onclick="window.open('https://t.me/imsergiomoreio', '_blank')" class="px-8 py-3 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2">
               <span class="material-icons text-blue-500 text-sm">telegram</span> Join Telegram
             </button>
          </div>
       </div>
    </section>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
       <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:border-blue-500/30 transition">
          <div class="text-2xl font-black text-blue-600">5+</div>
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Mods</div>
       </div>
       <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:border-green-500/30 transition">
          <div class="text-2xl font-black text-green-600">10k+</div>
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Happy Users</div>
       </div>
       <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:border-purple-500/30 transition">
          <div class="text-2xl font-black text-purple-600">24/7</div>
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Support</div>
       </div>
       <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm hover:border-amber-500/30 transition">
          <div class="text-2xl font-black text-amber-500">100%</div>
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Secure</div>
       </div>
    </div>

    <div class="sticky top-20 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md py-4 mb-8 border-b border-slate-200 dark:border-slate-800 transition-all rounded-b-2xl">
      <div class="flex flex-col sm:flex-row gap-4 px-2">
         <div class="relative flex-1">
            <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                   placeholder="Search games (e.g. RC24, WCC3)..."
                   class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition shadow-sm text-slate-700 dark:text-slate-200 placeholder-slate-400">
         </div>
         <select id="filter-category" onchange="window.filterMods()" 
                 class="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200 font-bold cursor-pointer shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            <option value="all">All Mods</option>
            <option value="free">Free Only</option>
            <option value="premium">Premium Only</option>
         </select>
      </div>
    </div>

    <section class="grid md:grid-cols-3 gap-6" id="mods-grid">

      ${renderCard('rc25', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc25.jpg" class="h-16 w-16 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC25'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">RC25 Fan-Made</div>
              <div class="text-xs text-slate-500 font-mono mb-1">com.nautilus.RC3D</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">v7+</span>
                <span class="badge bg-green-100 text-green-700 border-green-200">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-40 relative group">
             <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC25'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
            The ultimate RC25 Patch. Upgraded Enhanced version of RC20 for the fans of Real Cricket.
          </p>

          <button onclick="window.router.navigateTo('/rc25')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group">
            <span>Download Now</span> <span class="material-icons text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc24.png" class="h-16 w-16 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC24'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">RC Realistic V2</div>
              <div class="text-xs text-slate-500 font-mono mb-1">com.nautilus.RealCricket</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">v4.5</span>
                <span class="badge bg-green-100 text-green-700 border-green-200">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-40 relative group">
             <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC24'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
            The most realistic patch of RC24 till date! Enhanced graphics and gameplay.
          </p>

          <button onclick="window.router.navigateTo('/rc24')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group">
            <span>Download Now</span> <span class="material-icons text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc20', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc20.jpg" class="h-16 w-16 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=RC20'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">RC20 Mod Menu</div>
              <div class="text-xs text-slate-500 font-mono mb-1">com.nautilus.RC3D</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">v6.1</span>
                <span class="badge bg-yellow-100 text-yellow-800 border-yellow-200">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-40 relative group">
             <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC20'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
            VIP Mod Menu. Timing Hack, Unlimited Coins/Tickets, All Tournaments Unlocked.
          </p>

          <button onclick="window.router.navigateTo('/rc20')" class="w-full bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group">
            <span>View Details</span> <span class="material-icons text-sm transition-transform group-hover:translate-x-1">visibility</span>
          </button>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_wcc3.png" class="h-16 w-16 rounded-xl shadow-md object-cover" onerror="this.src='https://placehold.co/64?text=WCC3'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">WCC3 Mod Menu</div>
              <div class="text-xs text-slate-500 font-mono mb-1">com.nextwave.wcc3</div>
              <div class="flex gap-2">
                <span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">v3.2</span>
                <span class="badge bg-yellow-100 text-yellow-800 border-yellow-200">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black h-40 relative group">
             <img src="assets/img/img_wcc3_1.jpg" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1">
            VIP Mod Menu with Career Mode Unlock, Unlimited Platinum, NPL Auction & more.
          </p>

          <button onclick="window.router.navigateTo('/wcc3')" class="w-full bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 group">
            <span>View Details</span> <span class="material-icons text-sm transition-transform group-hover:translate-x-1">visibility</span>
          </button>
        </div>
      `)}

    </section>
  </div>
  `;
}

// ----------------------
// NEW SEARCH FUNCTION
// ----------------------
window.filterMods = function() {
   const query = document.getElementById('search-mods').value.toLowerCase();
   const filter = document.getElementById('filter-category').value;
   const cards = document.querySelectorAll('.app-card');

   let foundCount = 0;

   cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      // Simple logic: if text contains 'free', treat as free; otherwise assume premium if it has premium badge
      // or check for 'premium' explicitly.
      const isFree = text.includes('free');
      const isPremium = text.includes('premium') || text.includes('paid');
      
      let matchesSearch = text.includes(query);
      let matchesFilter = true;

      if (filter === 'free' && !isFree) matchesFilter = false;
      if (filter === 'premium' && !isPremium) matchesFilter = false;

      if (matchesSearch && matchesFilter) {
         card.style.display = 'block';
         // Trigger a tiny fade animation
         card.style.opacity = '0';
         setTimeout(() => card.style.opacity = '1', 50);
         foundCount++;
      } else {
         card.style.display = 'none';
      }
   });

   // Optional: Show "No results" message if needed
   const grid = document.getElementById('mods-grid');
   const noResultId = 'no-results-msg';
   let noResultEl = document.getElementById(noResultId);

   if(foundCount === 0) {
       if(!noResultEl) {
           noResultEl = document.createElement('div');
           noResultEl.id = noResultId;
           noResultEl.className = 'col-span-3 text-center py-20 text-slate-400';
           noResultEl.innerHTML = `<span class="material-icons text-4xl mb-2">search_off</span><p>No mods found matching your criteria.</p>`;
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
