// pages/home.js

// Global state
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

// --- 1. CONFIG LOADER ---
window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) { setTimeout(window.loadHomeHiddenCardsOnce, 200); return; }
  window._homeConfigFetchStarted = true;

  db.collection('siteConfig').doc('homeCards')
    .get()
    .then(doc => {
      const data = doc.exists ? (doc.data() || {}) : {};
      window.homeHiddenCards = Array.isArray(data.hidden) ? data.hidden : [];
      window.homeConfigLoaded = true;
      if (window.router && location.pathname.replace(/\/$/, '') === '/') {
        window.router.handleRoute('/');
      }
    })
    .catch(err => {
      console.error('loadHomeHiddenCardsOnce error:', err);
      window.homeHiddenCards = [];
      window.homeConfigLoaded = true;
    });
};

// --- 2. MAIN PAGE ---
function HomePage() {
  window.loadHomeHiddenCardsOnce();

  const isAdmin = !!window.isAdmin;
  const hiddenCards = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards : [];
  const isHidden = (id) => hiddenCards.includes(id);

  // --- STYLES ---
  const customStyles = `
    <style>
      /* Load "Sacramento" for the specific cursive look you wanted */
      @import url('https://fonts.googleapis.com/css2?family=Sacramento&family=Outfit:wght@400;500;700;900&display=swap');
      
      .font-script { font-family: 'Sacramento', cursive; }
      .font-sans-ios { font-family: 'Outfit', sans-serif; }

      /* Aurora Animation */
      @keyframes aurora {
        0% { background-position: 50% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 50% 50%; }
      }
      .bg-aurora {
        background: radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.4), rgba(15, 23, 42, 0)), 
                    radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.4), rgba(15, 23, 42, 0));
        filter: blur(60px);
        opacity: 0.6;
        animation: aurora 15s ease infinite;
      }

      /* iOS Glass Effect */
      .ios-glass {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.4);
      }
      .dark .ios-glass {
        background: rgba(30, 41, 59, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Card Hover Lift */
      .ios-card {
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
      }
      .ios-card:hover {
        transform: scale(1.02) translateY(-4px);
        box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.2);
      }
    </style>
  `;

  // --- ADMIN BTN ---
  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    const label = hidden ? 'Hidden' : 'Visible';
    const bg = hidden ? 'bg-red-500' : 'bg-green-500';
    return `
      <button onclick="window.toggleHomeCard('${id}')"
              class="absolute top-3 right-3 z-30 ${bg} text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-lg">
         ${label}
      </button>
    `;
  };

  // --- CARD RENDERER (App Store Style) ---
  const renderCard = (id, image, title, subtitle, badges, link) => {
    if (!isAdmin && isHidden(id)) return '';
    const opacity = isHidden(id) ? 'opacity-50 grayscale' : '';

    return `
      <div class="ios-card relative flex flex-col rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-xl cursor-pointer group ${opacity}"
           onclick="window.router.navigateTo('${link}')" data-card-id="${id}">
        
        ${adminControls(id)}

        <!-- Image Area (Top 60%) -->
        <div class="h-64 sm:h-72 w-full relative overflow-hidden">
           <img src="${image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                onerror="this.src='https://placehold.co/400x300?text=GAME'">
           <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           
           <!-- Floating Title on Image -->
           <div class="absolute bottom-0 left-0 p-6 w-full">
              <h3 class="text-3xl font-bold text-white leading-none mb-1 drop-shadow-md tracking-tight">${title}</h3>
              <p class="text-white/90 text-sm font-medium drop-shadow-sm">${subtitle}</p>
           </div>
        </div>

        <!-- Content Area (Bottom 40% - Glassy) -->
        <div class="flex-1 ios-glass p-5 flex flex-col justify-between relative z-10 -mt-4 rounded-t-[2rem]">
           
           <!-- Badges -->
           <div class="flex flex-wrap gap-2 mb-4">
              ${badges}
           </div>

           <!-- Action Row -->
           <div class="flex items-center justify-between mt-auto">
              <div class="flex flex-col">
                 <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stark Mods</span>
                 <span class="text-xs font-bold text-blue-500">Verified Safe</span>
              </div>
              
              <!-- iOS "GET" Button -->
              <button class="bg-slate-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-colors rounded-full px-6 py-2 font-bold text-sm tracking-wide shadow-sm">
                 GET
              </button>
           </div>
        </div>
      </div>
    `;
  };

  // --- PAGE HTML ---
  return `
  ${customStyles}
  <div class="font-sans-ios min-h-screen w-full relative overflow-x-hidden pb-32">
    
    <!-- DYNAMIC BACKGROUND -->
    <div class="fixed inset-0 -z-10 bg-slate-50 dark:bg-black">
       <div class="absolute inset-0 bg-aurora"></div>
       <!-- Mesh Grid Overlay -->
       <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-8 pt-12">

      <!-- 1. HERO HEADER -->
      <section class="text-center relative mb-16 z-10">
         
         <!-- The Font You Wanted -->
         <h1 class="font-script text-[5rem] sm:text-[7rem] md:text-[9rem] leading-[0.8] text-slate-900 dark:text-white drop-shadow-2xl mb-4 select-none">
           Stark Mods
         </h1>
         
         <p class="text-slate-600 dark:text-slate-400 font-medium text-lg sm:text-xl max-w-lg mx-auto mb-10 tracking-tight">
           Premium Game Modifications.<br>Redefining your gameplay.
         </p>

         <!-- 2. SOCIAL DOCK (Floating Glass) -->
         <div class="inline-flex items-center gap-4 p-3 rounded-full ios-glass shadow-2xl shadow-blue-900/10">
            <button onclick="document.getElementById('search-mods').focus()" 
                    class="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
               <span class="material-icons">search</span>
            </button>
            <div class="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
            <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                    class="w-12 h-12 rounded-full bg-[#0088cc] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
               <span class="material-icons">telegram</span>
            </button>
            <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                    class="w-12 h-12 rounded-full bg-[#5865F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
               <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            </button>
         </div>
      </section>

      <!-- 3. SEARCH BAR (Sticky & Minimal) -->
      <div class="sticky top-20 z-40 mb-12 max-w-xl mx-auto">
        <div class="ios-glass p-1.5 rounded-full flex items-center shadow-xl ring-1 ring-black/5">
           <div class="pl-4 pr-2 text-slate-400"><span class="material-icons">search</span></div>
           <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                  placeholder="Search Games..."
                  class="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium h-10">
           <select id="filter-category" onchange="window.filterMods()" 
                   class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full px-4 h-9 border-none outline-none cursor-pointer hover:bg-slate-200 transition mr-1">
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="premium">Paid</option>
           </select>
        </div>
      </div>

      <!-- 4. MODS GRID (App Store Style) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10" id="mods-grid">

        ${renderCard('rc25', 
          'assets/img/img_rc25_1.jpg',
          'RC25 Fan-Made',
          'The Ultimate Patch Update',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 whitespace-nowrap border border-red-200 dark:border-red-800">v7+</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 whitespace-nowrap border border-sky-200 dark:border-sky-800">Free</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 whitespace-nowrap border border-orange-200 dark:border-orange-800">New Update</span>
          `,
          '/rc25'
        )}

        ${renderCard('rc24', 
          'assets/img/img_rc24_1.jpg',
          'RC Realistic V3',
          'Graphics & Texture Patch',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 whitespace-nowrap border border-red-200 dark:border-red-800">v4.6</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 whitespace-nowrap border border-purple-200 dark:border-purple-800">T20 WC 2026</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 whitespace-nowrap border border-sky-200 dark:border-sky-800">Free</span>
          `,
          '/rc24'
        )}

        ${renderCard('rc20', 
          'assets/img/img_rc20_1.jpg',
          'RC20 Mod Menu',
          'VIP Injector & Cheats',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 whitespace-nowrap border border-red-200 dark:border-red-800">v6.1</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 whitespace-nowrap border border-amber-200 dark:border-amber-800">PREMIUM</span>
          `,
          '/rc20'
        )}

        ${renderCard('wcc3', 
          'assets/img/img_wcc3_1.jpg',
          'WCC3 Mod Menu',
          'Career & NPL Unlocked',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 whitespace-nowrap border border-red-200 dark:border-red-800">v3.2.3</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 whitespace-nowrap border border-amber-200 dark:border-amber-800">PREMIUM</span>
          `,
          '/wcc3'
        )}

      </div>
    </div>
  </div>
  `;
}

// --- SEARCH LOGIC ---
window.filterMods = function() {
   const query = document.getElementById('search-mods').value.toLowerCase();
   const filter = document.getElementById('filter-category').value;
   const cards = document.querySelectorAll('.ios-card');

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
         // Reset fade in
         card.style.opacity = '0';
         card.style.transform = 'scale(0.95)';
         setTimeout(() => {
             card.style.opacity = '1';
             card.style.transform = 'scale(1)';
         }, 50);
         foundCount++;
      } else {
         card.style.display = 'none';
      }
   });

   // No Results UI
   const grid = document.getElementById('mods-grid');
   const noResultId = 'no-results-msg';
   let noResultEl = document.getElementById(noResultId);

   if(foundCount === 0) {
       if(!noResultEl) {
           noResultEl = document.createElement('div');
           noResultEl.id = noResultId;
           noResultEl.className = 'col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 opacity-50';
           noResultEl.innerHTML = `
             <div class="flex flex-col items-center">
                <span class="material-icons text-6xl mb-4 text-slate-300">sentiment_dissatisfied</span>
                <p class="font-bold text-xl text-slate-500">No matches found</p>
             </div>
           `;
           grid.appendChild(noResultEl);
       }
   } else {
       if(noResultEl) noResultEl.remove();
   }
};

// Admin Visibility Toggle
window.toggleHomeCard = function (id) {
  if (!window.isAdmin) { alert('Admin only.'); return; }
  if (!window.db) { alert('DB not ready.'); return; }

  let arr = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards.slice() : [];
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);
  else arr.splice(idx, 1);

  db.collection('siteConfig').doc('homeCards')
    .set({ hidden: arr }, { merge: true })
    .then(() => {
      window.homeHiddenCards = arr;
      if (window.router) window.router.handleRoute('/');
    })
    .catch(err => alert(err.message));
};

window.HomePage = HomePage;
