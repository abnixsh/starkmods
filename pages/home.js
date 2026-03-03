// pages/home.js

// Global state for hidden cards
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
      ? `<div class="mb-2 text-[10px] text-red-500 font-bold uppercase border border-red-200 bg-red-50 px-2 py-1 rounded inline-block">Hidden</div>`
      : '';

    return `
      <div class="flex justify-between items-center mb-2">
        ${hiddenNote}
        <button onclick="window.toggleHomeCard('${id}')"
                class="ml-auto text-slate-500 hover:text-red-500 text-[10px] flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full transition shadow-sm border border-slate-200/50">
          <span class="material-icons text-xs">${icon}</span>
          <span class="uppercase font-bold">${label}</span>
        </button>
      </div>
    `;
  };

  const renderCard = (id, innerHtml) => {
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50 grayscale' : '';

    return `
      <article class="app-card relative p-5 bg-white/70 dark:bg-slate-900/60 border border-white/40 dark:border-slate-700/50 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ${extraClasses}"
               data-card-id="${id}">
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
        ${adminControls(id)}
        <div class="relative z-10">
            ${innerHtml}
        </div>
      </article>
    `;
  };

  // Inject hero styles once
  if (!document.getElementById('stark-hello-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'stark-hello-styles';
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

      @keyframes helloWrite {
        0% {
          clip-path: inset(0 100% 0 0);
          opacity: 0;
        }
        15% {
          opacity: 1;
        }
        100% {
          clip-path: inset(0 0% 0 0);
          opacity: 1;
        }
      }

      @keyframes helloPulseGlow {
        0%, 100% {
          text-shadow: 0 0 20px rgba(59,130,246,0.3), 0 0 60px rgba(59,130,246,0.1);
        }
        50% {
          text-shadow: 0 0 30px rgba(59,130,246,0.5), 0 0 80px rgba(59,130,246,0.2);
        }
      }

      @keyframes subtitleReveal {
        0% {
          opacity: 0;
          transform: translateY(8px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes badgePop {
        0% { opacity: 0; transform: scale(0.8); }
        50% { transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }

      @keyframes socialSlideUp {
        0% { opacity: 0; transform: translateY(16px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      .stark-hello-text {
        font-family: 'Dancing Script', cursive;
        animation: helloWrite 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
                   helloPulseGlow 3s ease-in-out 2s infinite;
        clip-path: inset(0 100% 0 0);
        opacity: 0;
        will-change: clip-path, opacity;
      }

      .stark-subtitle {
        animation: subtitleReveal 0.8s ease-out 1.4s forwards;
        opacity: 0;
      }

      .stark-badge {
        animation: badgePop 0.5s ease-out forwards;
        opacity: 0;
      }

      .stark-social-btn {
        animation: socialSlideUp 0.5s ease-out forwards;
        opacity: 0;
      }

      .social-pill {
        transition: all 0.25s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .social-pill:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      }
      .social-pill:active {
        transform: scale(0.96);
      }
    `;
    document.head.appendChild(styleEl);
  }

  return `
  <div class="max-w-6xl mx-auto pb-24 animate-fade-in relative px-3 sm:px-6">

    <!-- ===== HERO SECTION ===== -->
    <section class="relative rounded-[2rem] p-6 sm:p-12 mb-8 text-center overflow-hidden border border-white/30 dark:border-slate-700/50 shadow-2xl isolate group">
       
       <div class="absolute inset-0 bg-white/60 dark:bg-slate-900/60 -z-10 transition duration-700"></div>
       <div class="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] -z-20 animate-pulse"></div>
       <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px] -z-20 animate-pulse" style="animation-delay: 1s;"></div>

       <div class="relative z-10 flex flex-col items-center">
          
          <!-- Live Badge -->
          <div class="stark-badge inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/40 dark:bg-black/30 border border-white/30 dark:border-slate-600/30 backdrop-blur-md mb-5 shadow-sm cursor-pointer hover:scale-105 transition" style="animation-delay: 1.8s;">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
              Update v7+ Live
            </span>
          </div>

          <!-- Cursive Hello Title -->
          <h1 class="stark-hello-text text-6xl sm:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent pb-2 select-none">
            Stark Mods
          </h1>
          
          <!-- Subtitle -->
          <p class="stark-subtitle text-sm sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed font-medium opacity-90">
            Premium, Secure & Anti-Ban Mod Menus.<br class="hidden sm:block"> Unlock the ultimate gaming experience.
          </p>
          
          <!-- Social + Browse Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3">
            
            <button onclick="document.getElementById('search-mods').focus()" 
                    class="stark-social-btn social-pill inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg hover:shadow-xl transition" style="animation-delay: 2.0s;">
              <span class="material-icons text-base">search</span>
              <span>Browse Mods</span>
            </button>

            <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                    class="stark-social-btn social-pill inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-600/40 shadow-sm font-semibold text-sm text-slate-700 dark:text-slate-200" style="animation-delay: 2.2s;">
              <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Telegram</span>
            </button>

            <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                    class="stark-social-btn social-pill inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-600/40 shadow-sm font-semibold text-sm text-slate-700 dark:text-slate-200" style="animation-delay: 2.4s;">
              <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
              </svg>
              <span>Discord</span>
            </button>

          </div>
       </div>
    </section>

    <!-- ===== STATS ===== -->
    <div class="grid grid-cols-4 gap-3 mb-8 px-1">
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-blue-600">5+</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Mods</div>
       </div>
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-green-600">40k</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Users</div>
       </div>
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-purple-600">24/7</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Help</div>
       </div>
       <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-3 rounded-2xl border border-white/40 dark:border-slate-700/50 text-center shadow-sm hover:scale-105 transition cursor-default">
          <div class="text-lg sm:text-2xl font-black text-amber-500">100%</div>
          <div class="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Safe</div>
       </div>
    </div>

    <!-- ===== SEARCH ===== -->
    <div class="sticky top-20 z-30 mb-8 mx-auto max-w-4xl">
      <div class="flex gap-2 p-2 rounded-[1.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-lg ring-1 ring-black/5">
         
         <div class="relative flex-1 group">
            <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition">search</span>
            <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                   placeholder="Search..."
                   class="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium">
         </div>
         
         <div class="relative border-l border-slate-200 dark:border-slate-700 my-1"></div>

         <select id="filter-category" onchange="window.filterMods()" 
                 class="px-4 py-2 bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition appearance-none">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="premium">Paid</option>
         </select>
      </div>
    </div>

    <!-- ===== MODS GRID ===== -->
    <section class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" id="mods-grid">

      ${renderCard('rc25', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc25.jpg" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=RC25'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC25 Fan-Made</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">Patch Update of RC20</div>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-800 text-white border border-red-900 shadow-sm whitespace-nowrap">v7+</span>
                <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-sky-500 text-white border border-sky-600 shadow-sm whitespace-nowrap">Free</span>
                <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-orange-500 text-white border border-orange-600 shadow-sm whitespace-nowrap">New Update</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/rc25')">
             <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC25'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            The ultimate RC25 Patch. Enhanced graphics, updated squads, and optimized gameplay for Real Cricket fans.
          </p>

          <button onclick="window.router.navigateTo('/rc25')" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>Download</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc24.png" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=RC24'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC Realistic V3</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">Patch makes game better</div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-800 text-white border border-red-900 shadow-sm whitespace-nowrap">v4.6</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-purple-600 dark:bg-purple-500 text-white border border-purple-700 dark:border-purple-400 shadow-sm whitespace-nowrap">T20 WC 2026</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-sky-500 text-white border border-sky-600 shadow-sm whitespace-nowrap">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/rc24')">
             <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC24'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            New T20 World Cup 2026 Jerseys, Realistic patch with enhanced textures, realistic stadiums, and updated player faces.
          </p>

          <button onclick="window.router.navigateTo('/rc24')" class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>Download</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      `)}

      ${renderCard('rc20', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_rc20.jpg" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=RC20'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">RC20 Mod Menu</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">VIP Cheats</div>
              <div class="flex gap-1.5">
                <span class="badge bg-red-800 text-white border border-red-900 px-3 py-1 rounded-full text-xs font-medium">v6.1</span>
                <span class="badge bg-amber-400 text-black border border-amber-500 px-3 py-1 rounded-full text-xs font-bold">PREMIUM</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/rc20')">
             <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=RC20'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            VIP Mod Menu. Features include Timing Hack, Unlimited Coins/Tickets, All Tournaments Unlocked.
          </p>

          <button onclick="window.router.navigateTo('/rc20')" class="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white py-3.5 rounded-2xl font-bold shadow-lg transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>View Details</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">visibility</span>
          </button>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="app-card-content h-full flex flex-col">
          <div class="app-card-header flex gap-4 mb-4">
            <img src="assets/icons/icon_wcc3.png" class="h-16 w-16 rounded-[1rem] shadow-lg object-cover ring-2 ring-white/50 dark:ring-white/10" onerror="this.src='https://placehold.co/64?text=WCC3'" />
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white leading-tight">WCC3 Mod Menu</div>
              <div class="text-[10px] text-slate-500 font-mono mb-2">ViP Injector Safe</div>
              <div class="flex gap-1.5">
                 <span class="badge bg-red-800 text-white border border-red-900 px-3 py-1 rounded-full text-xs font-medium">v3.2.3</span>
               <span class="badge bg-amber-400 text-black border border-amber-500 px-3 py-1 rounded-full text-xs font-bold">PREMIUM</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-5 rounded-2xl overflow-hidden bg-black h-40 relative group cursor-pointer shadow-inner" onclick="window.router.navigateTo('/wcc3')">
             <img src="assets/img/img_wcc3_1.jpg" class="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed px-1">
            VIP Mod Menu with Career Mode Unlock, Unlimited Platinum, NPL Auction & more.
          </p>

          <button onclick="window.router.navigateTo('/wcc3')" class="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white py-3.5 rounded-2xl font-bold shadow-lg transition transform active:scale-[0.98] flex items-center justify-center gap-2 group">
            <span>View Details</span> <span class="material-icons text-xs transition-transform group-hover:translate-x-1">visibility</span>
          </button>
        </div>
      `)}

    </section>
  </div>
  `;
}

// ----------------------
// SEARCH & FILTER FUNCTION
// ----------------------
window.filterMods = function() {
   const query = document.getElementById('search-mods').value.toLowerCase();
   const filter = document.getElementById('filter-category').value;
   const cards = document.querySelectorAll('.app-card');

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
         card.style.opacity = '0';
         setTimeout(() => card.style.opacity = '1', 50);
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
           noResultEl.className = 'col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-slate-400 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 backdrop-blur-sm';
           noResultEl.innerHTML = `
             <div class="flex flex-col items-center">
                <span class="material-icons text-4xl mb-2 text-slate-300">search_off</span>
                <p class="font-bold text-lg">No mods found</p>
                <p class="text-sm">Try searching for "RC24" or "WCC3"</p>
             </div>
           `;
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
