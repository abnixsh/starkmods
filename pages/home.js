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

// --- 2. MAIN COMPONENT ---
function HomePage() {
  window.loadHomeHiddenCardsOnce();

  const isAdmin = !!window.isAdmin;
  const hiddenCards = Array.isArray(window.homeHiddenCards) ? window.homeHiddenCards : [];
  const isHidden = (id) => hiddenCards.includes(id);

  // --- STYLES ---
  const customStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Lobster&family=Outfit:wght@300;500;700;900&display=swap');
      
      .font-cursive { font-family: 'Lobster', cursive; }
      .font-ios { font-family: 'Outfit', sans-serif; }

      /* Animated Background Blobs */
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
      .animate-blob {
        animation: blob 10s infinite ease-in-out;
      }
      .animation-delay-2000 { animation-delay: 2s; }
      .animation-delay-4000 { animation-delay: 4s; }

      /* Premium Glassmorphism */
      .glass-card {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      
      /* Card Hover Effect */
      .game-card {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .game-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.2);
      }
      
      .game-card:hover .card-img {
        transform: scale(1.1);
      }
    </style>
  `;

  // --- ADMIN CONTROLS ---
  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    return `
      <button onclick="window.toggleHomeCard('${id}')"
              class="absolute top-4 right-4 z-40 ${hidden ? 'bg-red-500' : 'bg-green-500'} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-md">
         ${hidden ? 'HIDDEN' : 'VISIBLE'}
      </button>
    `;
  };

  // --- RENDER CARD (Poster Style) ---
  const renderCard = (id, image, title, subtitle, badges, link) => {
    if (!isAdmin && isHidden(id)) return '';
    const opacity = isHidden(id) ? 'opacity-50 grayscale' : '';

    return `
      <div class="game-card group relative h-[28rem] rounded-[2.5rem] overflow-hidden cursor-pointer ${opacity}"
           onclick="window.router.navigateTo('${link}')" data-card-id="${id}">
        
        ${adminControls(id)}

        <!-- 1. Background Image (Full height) -->
        <div class="absolute inset-0 z-0 overflow-hidden bg-slate-900">
           <img src="${image}" 
                class="card-img w-full h-full object-cover transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100" 
                onerror="this.src='https://placehold.co/400x600/1e293b/ffffff?text=GAME'">
           <!-- Dark Gradient Overlay for text readability -->
           <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
        </div>

        <!-- 2. Content (Bottom Aligned) -->
        <div class="relative z-10 h-full flex flex-col justify-end p-8">
           
           <!-- Floating Icon (Top Left) -->
           <div class="absolute top-6 left-6">
              <div class="w-12 h-12 rounded-2xl glass-card flex items-center justify-center shadow-lg group-hover:bg-white/10 transition-colors">
                 <span class="material-icons text-white/80">gamepad</span>
              </div>
           </div>

           <!-- Text Content -->
           <div class="transform transition-transform duration-500 group-hover:-translate-y-2">
              <h3 class="text-3xl font-black text-white mb-2 leading-tight tracking-tight">${title}</h3>
              <p class="text-slate-300 text-sm font-medium mb-4 line-clamp-2">${subtitle}</p>
              
              <!-- Badges -->
              <div class="flex flex-wrap gap-2 mb-6">
                 ${badges}
              </div>
           </div>

           <!-- Action Button -->
           <button class="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 flex items-center justify-center gap-2">
              Get Mod <span class="material-icons text-sm">arrow_forward</span>
           </button>
        </div>
      </div>
    `;
  };

  return `
  ${customStyles}
  <div class="font-ios min-h-screen w-full bg-[#050505] relative overflow-x-hidden text-white pb-32 selection:bg-blue-500 selection:text-white">
    
    <!-- 1. AMBIENT BACKGROUND -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
       <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob"></div>
       <div class="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
       <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>
       <!-- Noise Texture -->
       <div class="absolute inset-0 opacity-[0.05]" style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+');"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-16 relative z-10">

      <!-- 2. HERO SECTION -->
      <section class="text-center mb-20">
         
         <!-- Status Pill -->
         <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-white/5 mb-8 hover:bg-white/5 transition cursor-default">
           <span class="relative flex h-2 w-2">
             <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
             <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
           </span>
           <span class="text-[11px] font-bold uppercase tracking-widest text-slate-300">System Operational</span>
         </div>

         <!-- BIG CURSIVE TITLE -->
         <h1 class="font-cursive text-[4rem] sm:text-[6rem] md:text-[8rem] leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-500 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-6 py-2">
           Stark Mods
         </h1>
         
         <p class="text-slate-400 text-lg sm:text-xl font-normal max-w-xl mx-auto mb-10 leading-relaxed">
           Premium cheats, unlocked features, and enhanced gameplay. <br><span class="text-white font-medium">Safe. Secure. Undetected.</span>
         </p>

         <!-- 3. GLASS SOCIAL DOCK -->
         <div class="inline-flex p-2 rounded-full glass-card gap-2 shadow-2xl shadow-blue-900/10">
            <button onclick="document.getElementById('search-mods').focus()" 
                    class="h-12 px-6 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
               <span class="material-icons text-lg">search</span> Browse
            </button>
            
            <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                    class="w-12 h-12 rounded-full bg-[#2AABEE] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
               <span class="material-icons">telegram</span>
            </button>
            
            <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                    class="w-12 h-12 rounded-full bg-[#5865F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
               <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            </button>
         </div>

      </section>

      <!-- 4. SEARCH BAR -->
      <div class="sticky top-24 z-30 mb-12 max-w-xl mx-auto">
        <div class="glass-card p-2 rounded-full flex gap-2 shadow-2xl backdrop-blur-xl">
           <div class="pl-4 pr-2 flex items-center text-slate-400"><span class="material-icons">search</span></div>
           <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                  placeholder="Find your game..."
                  class="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 font-medium h-10">
           
           <div class="h-8 w-px bg-white/10 my-auto mx-1"></div>
           
           <select id="filter-category" onchange="window.filterMods()" 
                   class="bg-white/5 text-slate-300 text-xs font-bold rounded-full px-4 h-10 border-none outline-none cursor-pointer hover:bg-white/10 transition">
              <option value="all" class="bg-slate-900">All</option>
              <option value="free" class="bg-slate-900">Free</option>
              <option value="premium" class="bg-slate-900">Paid</option>
           </select>
        </div>
      </div>

      <!-- 5. IMMERSIVE CARDS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10" id="mods-grid">

        ${renderCard('rc25', 
          'assets/img/img_rc25_1.jpg',
          'RC25 Fan-Made',
          'The Ultimate Patch Update',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">v7+</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 whitespace-nowrap">Free</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 whitespace-nowrap">New Update</span>
          `,
          '/rc25'
        )}

        ${renderCard('rc24', 
          'assets/img/img_rc24_1.jpg',
          'RC Realistic V3',
          'Graphics & Texture Patch',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">v4.6</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 whitespace-nowrap">T20 WC 2026</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 whitespace-nowrap">Free</span>
          `,
          '/rc24'
        )}

        ${renderCard('rc20', 
          'assets/img/img_rc20_1.jpg',
          'RC20 Mod Menu',
          'VIP Injector & Cheats',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">v6.1</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap">PREMIUM</span>
          `,
          '/rc20'
        )}

        ${renderCard('wcc3', 
          'assets/img/img_wcc3_1.jpg',
          'WCC3 Mod Menu',
          'Career & NPL Unlocked',
          `
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">v3.2.3</span>
          <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap">PREMIUM</span>
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
   const cards = document.querySelectorAll('.game-card');

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
         card.style.display = 'block'; // Block for div based card
         // Reset animation
         card.style.opacity = '0';
         card.style.transform = 'translateY(10px) scale(0.98)';
         setTimeout(() => {
             card.style.opacity = '1';
             card.style.transform = 'translateY(0) scale(1)';
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
           noResultEl.className = 'col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 opacity-50 glass-card rounded-[2rem]';
           noResultEl.innerHTML = `
             <div class="flex flex-col items-center">
                <span class="material-icons text-6xl mb-4 text-slate-500">search_off</span>
                <p class="font-bold text-xl text-slate-300">No matches found</p>
                <p class="text-sm text-slate-500">Try adjusting filters.</p>
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
