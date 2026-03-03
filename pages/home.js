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

  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    const label = hidden ? 'Show' : 'Hide';
    const icon  = hidden ? 'visibility' : 'visibility_off';
    const hiddenNote = hidden
      ? `<div class="mb-2 text-[10px] text-red-500 font-bold uppercase border border-red-200 bg-red-50 px-2 py-1 rounded-lg inline-block">Hidden</div>`
      : '';

    return `
      <div class="flex justify-between items-center mb-2">
        ${hiddenNote}
        <button onclick="window.toggleHomeCard('${id}')"
                class="ml-auto text-slate-500 hover:text-red-500 text-[10px] flex items-center gap-1 bg-white/60 px-2 py-1 rounded-full backdrop-blur-sm transition shadow-sm border border-slate-200/50">
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
      <article class="app-card relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/40 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${extraClasses}"
               data-card-id="${id}">
        ${adminControls(id)}
        <div class="relative">
            ${innerHtml}
        </div>
      </article>
    `;
  };

  // Inject the hello-style animation CSS only once
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

      @keyframes helloFadeUp {
        0% {
          opacity: 0;
          transform: translateY(12px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
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
          filter: blur(4px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      }

      @keyframes badgePop {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes socialSlideUp {
        0% {
          opacity: 0;
          transform: translateY(16px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
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
        will-change: opacity, transform;
      }

      .stark-badge {
        animation: badgePop 0.5s ease-out forwards;
        opacity: 0;
        will-change: opacity, transform;
      }

      .stark-social-btn {
        animation: socialSlideUp 0.5s ease-out forwards;
        opacity: 0;
        will-change: opacity, transform;
      }

      .stark-card-enter {
        animation: helloFadeUp 0.5s ease-out forwards;
        opacity: 0;
        will-change: opacity, transform;
      }

      /* iOS-style frosted glass */
      .ios-glass {
        background: rgba(255,255,255,0.72);
        -webkit-backdrop-filter: saturate(180%) blur(20px);
        backdrop-filter: saturate(180%) blur(20px);
      }
      .dark .ios-glass {
        background: rgba(30,30,30,0.72);
      }

      .ios-glass-light {
        background: rgba(255,255,255,0.55);
        -webkit-backdrop-filter: saturate(150%) blur(16px);
        backdrop-filter: saturate(150%) blur(16px);
      }
      .dark .ios-glass-light {
        background: rgba(40,40,40,0.55);
      }

      /* Smooth tap feedback for mobile */
      .ios-tap {
        -webkit-tap-highlight-color: transparent;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      .ios-tap:active {
        transform: scale(0.97);
        opacity: 0.85;
      }

      /* Social button hover */
      .social-pill {
        transition: all 0.25s ease;
      }
      .social-pill:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      }
      .social-pill:active {
        transform: scale(0.96);
      }

      /* Subtle separator */
      .ios-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent);
      }
      .dark .ios-divider {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
      }
    `;
    document.head.appendChild(styleEl);
  }

  return `
  <div class="max-w-lg mx-auto pb-28 relative px-4">

    <!-- ===== HERO: iOS Hello Style ===== -->
    <section class="relative pt-16 pb-10 text-center">
      
      <!-- Ambient glow (lightweight, no heavy blur on mobile) -->
      <div class="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400/20 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Cursive Hello-style title -->
      <h1 class="stark-hello-text text-6xl sm:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent pb-2 select-none">
        Stark Mods
      </h1>

      <!-- Subtitle -->
      <p class="stark-subtitle text-sm text-slate-500 dark:text-slate-400 font-medium mt-3 tracking-wide">
        Premium Mods · Safe & Secure
      </p>

      <!-- Live badge -->
      <div class="flex justify-center mt-5">
        <div class="stark-badge inline-flex items-center gap-2 py-1.5 px-4 rounded-full ios-glass-light border border-slate-200/50 dark:border-slate-600/30 shadow-sm" style="animation-delay: 1.8s;">
          <span class="relative flex h-1.5 w-1.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300">
            v7+ Live
          </span>
        </div>
      </div>

      <!-- Social Media Buttons - iOS Pill Style -->
      <div class="flex items-center justify-center gap-3 mt-8">
        
        <button onclick="window.open('https://t.me/starkrc20', '_blank')" 
                class="stark-social-btn social-pill ios-tap inline-flex items-center gap-2 px-5 py-2.5 rounded-full ios-glass border border-slate-200/60 dark:border-slate-600/40 shadow-sm"
                style="animation-delay: 2.0s;">
          <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Telegram</span>
        </button>

        <button onclick="window.open('https://discord.gg/KaeHESH9n', '_blank')" 
                class="stark-social-btn social-pill ios-tap inline-flex items-center gap-2 px-5 py-2.5 rounded-full ios-glass border border-slate-200/60 dark:border-slate-600/40 shadow-sm"
                style="animation-delay: 2.2s;">
          <svg class="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
          </svg>
          <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Discord</span>
        </button>

      </div>
    </section>

    <!-- ===== Stats Row ===== -->
    <div class="stark-card-enter grid grid-cols-4 gap-2 mb-6" style="animation-delay: 2.4s;">
      <div class="ios-glass-light ios-tap rounded-2xl p-3 text-center border border-slate-200/40 dark:border-slate-700/30">
        <div class="text-base font-bold text-slate-900 dark:text-white">5+</div>
        <div class="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Mods</div>
      </div>
      <div class="ios-glass-light ios-tap rounded-2xl p-3 text-center border border-slate-200/40 dark:border-slate-700/30">
        <div class="text-base font-bold text-slate-900 dark:text-white">40k</div>
        <div class="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Users</div>
      </div>
      <div class="ios-glass-light ios-tap rounded-2xl p-3 text-center border border-slate-200/40 dark:border-slate-700/30">
        <div class="text-base font-bold text-slate-900 dark:text-white">24/7</div>
        <div class="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Help</div>
      </div>
      <div class="ios-glass-light ios-tap rounded-2xl p-3 text-center border border-slate-200/40 dark:border-slate-700/30">
        <div class="text-base font-bold text-slate-900 dark:text-white">100%</div>
        <div class="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Safe</div>
      </div>
    </div>

    <!-- ===== Search Bar - iOS Style ===== -->
    <div class="stark-card-enter sticky top-20 z-30 mb-6" style="animation-delay: 2.5s;">
      <div class="flex gap-2 p-1.5 rounded-2xl ios-glass border border-slate-200/50 dark:border-slate-700/40 shadow-sm">
         
        <div class="relative flex-1 group">
          <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-blue-500 transition">search</span>
          <input type="text" id="search-mods" onkeyup="window.filterMods()" 
                 placeholder="Search mods..."
                 class="w-full pl-10 pr-3 py-2.5 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 font-medium">
        </div>
         
        <div class="border-l border-slate-200/60 dark:border-slate-700 my-2"></div>

        <select id="filter-category" onchange="window.filterMods()" 
                class="px-3 py-2 bg-transparent border-none outline-none text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer rounded-xl transition appearance-none min-w-[52px] text-center">
          <option value="all">All</option>
          <option value="free">Free</option>
          <option value="premium">Paid</option>
        </select>
      </div>
    </div>

    <!-- ===== Mods Grid ===== -->
    <section class="flex flex-col gap-4" id="mods-grid">

      ${renderCard('rc25', `
        <div class="stark-card-enter p-4" style="animation-delay: 2.6s;">
          <div class="flex gap-3.5 mb-3.5">
            <img src="assets/icons/icon_rc25.jpg" class="h-14 w-14 rounded-[0.875rem] shadow-sm object-cover ring-1 ring-black/5 dark:ring-white/10 flex-shrink-0" onerror="this.src='https://placehold.co/56?text=RC25'" />
            <div class="min-w-0 flex-1">
              <div class="text-[15px] font-bold text-slate-900 dark:text-white leading-snug">RC25 Fan-Made</div>
              <div class="text-[11px] text-slate-400 font-medium mb-2">Patch Update of RC20</div>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">v7+</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500 text-white">Free</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-500 text-white">New</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-40 relative group cursor-pointer mb-3.5 ios-tap" onclick="window.router.navigateTo('/rc25')">
            <img src="assets/img/img_rc25_1.jpg" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC25'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
              <span class="material-icons text-sm text-slate-700 dark:text-slate-200">play_arrow</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            The ultimate RC25 Patch. Enhanced graphics, updated squads, and optimized gameplay.
          </p>

          <button onclick="window.router.navigateTo('/rc25')" class="ios-tap w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2">
            <span class="material-icons text-sm">download</span>
            <span>Download</span>
          </button>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="stark-card-enter p-4" style="animation-delay: 2.7s;">
          <div class="flex gap-3.5 mb-3.5">
            <img src="assets/icons/icon_rc24.png" class="h-14 w-14 rounded-[0.875rem] shadow-sm object-cover ring-1 ring-black/5 dark:ring-white/10 flex-shrink-0" onerror="this.src='https://placehold.co/56?text=RC24'" />
            <div class="min-w-0 flex-1">
              <div class="text-[15px] font-bold text-slate-900 dark:text-white leading-snug">RC Realistic V3</div>
              <div class="text-[11px] text-slate-400 font-medium mb-2">Patch makes game better</div>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">v4.6</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500 text-white">T20 WC 2026</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500 text-white">Free</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-40 relative group cursor-pointer mb-3.5 ios-tap" onclick="window.router.navigateTo('/rc24')">
            <img src="assets/img/img_rc24_1.jpg" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC24'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
              <span class="material-icons text-sm text-slate-700 dark:text-slate-200">play_arrow</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            New T20 World Cup 2026 Jerseys, realistic patch with enhanced textures & updated player faces.
          </p>

          <button onclick="window.router.navigateTo('/rc24')" class="ios-tap w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2">
            <span class="material-icons text-sm">download</span>
            <span>Download</span>
          </button>
        </div>
      `)}

      <!-- iOS Divider -->
      <div class="ios-divider mx-4"></div>

      <!-- Premium Section Label -->
      <div class="stark-card-enter px-1 mt-2" style="animation-delay: 2.8s;">
        <div class="flex items-center gap-2">
          <span class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Premium</span>
          <div class="flex-1 ios-divider"></div>
        </div>
      </div>

      ${renderCard('rc20', `
        <div class="stark-card-enter p-4" style="animation-delay: 2.9s;">
          <div class="flex gap-3.5 mb-3.5">
            <div class="relative flex-shrink-0">
              <img src="assets/icons/icon_rc20.jpg" class="h-14 w-14 rounded-[0.875rem] shadow-sm object-cover ring-1 ring-black/5 dark:ring-white/10" onerror="this.src='https://placehold.co/56?text=RC20'" />
              <div class="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-md flex items-center justify-center shadow-sm">
                <span class="material-icons text-[10px] text-amber-900">star</span>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[15px] font-bold text-slate-900 dark:text-white leading-snug">RC20 Mod Menu</div>
              <div class="text-[11px] text-slate-400 font-medium mb-2">VIP Cheats</div>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">v6.1</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900">PRO</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-40 relative group cursor-pointer mb-3.5 ios-tap" onclick="window.router.navigateTo('/rc20')">
            <img src="assets/img/img_rc20_1.jpg" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=RC20'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-3 left-3 flex items-center gap-1.5 bg-amber-400/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
              <span class="material-icons text-[11px] text-amber-900">lock</span>
              <span class="text-[10px] font-bold text-amber-900">PREMIUM</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            VIP Mod Menu. Timing Hack, Unlimited Coins/Tickets, All Tournaments Unlocked.
          </p>

          <button onclick="window.router.navigateTo('/rc20')" class="ios-tap w-full bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2">
            <span class="material-icons text-sm">visibility</span>
            <span>View Details</span>
          </button>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="stark-card-enter p-4" style="animation-delay: 3.0s;">
          <div class="flex gap-3.5 mb-3.5">
            <div class="relative flex-shrink-0">
              <img src="assets/icons/icon_wcc3.png" class="h-14 w-14 rounded-[0.875rem] shadow-sm object-cover ring-1 ring-black/5 dark:ring-white/10" onerror="this.src='https://placehold.co/56?text=WCC3'" />
              <div class="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-md flex items-center justify-center shadow-sm">
                <span class="material-icons text-[10px] text-amber-900">star</span>
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[15px] font-bold text-slate-900 dark:text-white leading-snug">WCC3 Mod Menu</div>
              <div class="text-[11px] text-slate-400 font-medium mb-2">VIP Injector Safe</div>
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900">v3.2.3</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900">PRO</span>
              </div>
            </div>
          </div>

          <div class="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-40 relative group cursor-pointer mb-3.5 ios-tap" onclick="window.router.navigateTo('/wcc3')">
            <img src="assets/img/img_wcc3_1.jpg" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105" onerror="this.src='https://placehold.co/320x180?text=WCC3'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-3 left-3 flex items-center gap-1.5 bg-amber-400/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
              <span class="material-icons text-[11px] text-amber-900">lock</span>
              <span class="text-[10px] font-bold text-amber-900">PREMIUM</span>
            </div>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            VIP Mod Menu with Career Mode Unlock, Unlimited Platinum, NPL Auction & more.
          </p>

          <button onclick="window.router.navigateTo('/wcc3')" class="ios-tap w-full bg-slate-900 dark:bg-white hover:bg-black dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2">
            <span class="material-icons text-sm">visibility</span>
            <span>View Details</span>
          </button>
        </div>
      `)}

    </section>

    <!-- ===== Footer Note ===== -->
    <div class="stark-card-enter text-center mt-10 mb-4" style="animation-delay: 3.2s;">
      <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        Made with ♥ by Stark Mods Team
      </p>
    </div>

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
      const isPremium = text.includes('premium') || text.includes('pro') || text.includes('paid');
      
      let matchesSearch = text.includes(query);
      let matchesFilter = true;

      if (filter === 'free' && !isFree) matchesFilter = false;
      if (filter === 'premium' && !isPremium) matchesFilter = false;

      if (matchesSearch && matchesFilter) {
         card.style.display = 'block';
         card.style.opacity = '0';
         requestAnimationFrame(() => { card.style.opacity = '1'; });
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
           noResultEl.className = 'text-center py-16 text-slate-400 ios-glass-light rounded-2xl border border-slate-200/40 dark:border-slate-700/30';
           noResultEl.innerHTML = `
             <div class="flex flex-col items-center">
                <span class="material-icons text-3xl mb-2 text-slate-300">search_off</span>
                <p class="font-semibold text-sm">No mods found</p>
                <p class="text-xs mt-1 text-slate-400">Try "RC24" or "WCC3"</p>
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
