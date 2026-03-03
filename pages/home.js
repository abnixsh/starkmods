// pages/home.js

// Global state for hidden cards
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

  const adminControls = (id) => {
    if (!isAdmin) return '';
    const hidden = isHidden(id);
    return `
      <div class="flex items-center gap-2 mb-3 px-1">
        ${hidden ? '<span class="text-[10px] text-red-500 font-bold uppercase bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">Hidden</span>' : ''}
        <button onclick="window.toggleHomeCard('${id}')"
                class="ml-auto text-[10px] font-bold uppercase text-slate-400 hover:text-red-500 flex items-center gap-1 transition">
          <span class="material-icons text-xs">${hidden ? 'visibility' : 'visibility_off'}</span>
          ${hidden ? 'Show' : 'Hide'}
        </button>
      </div>`;
  };

  const renderCard = (id, html) => {
    if (!isAdmin && isHidden(id)) return '';
    return `
      <div class="app-card ${isHidden(id) ? 'opacity-40 grayscale' : ''}" data-card-id="${id}">
        ${adminControls(id)}
        ${html}
      </div>`;
  };

  // Inject styles once
  if (!document.getElementById('home-ios-styles')) {
    const s = document.createElement('style');
    s.id = 'home-ios-styles';
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

      /* Hello write animation */
      @keyframes iosHelloWrite {
        0% { stroke-dashoffset: 600; opacity: 0; }
        5% { opacity: 1; }
        100% { stroke-dashoffset: 0; opacity: 1; }
      }
      @keyframes iosHelloFill {
        0% { fill-opacity: 0; }
        100% { fill-opacity: 1; }
      }
      @keyframes iosFadeUp {
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes iosPulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }

      .hello-cursive {
        font-family: 'Dancing Script', cursive;
      }

      .hello-reveal {
        opacity: 0;
        transform: translateY(10px);
        animation: iosFadeUp 0.6s ease forwards;
      }

      /* iOS native card style - NO backdrop-filter for performance */
      .ios-card {
        background: #fff;
        border: 0.5px solid rgba(0,0,0,0.08);
        border-radius: 16px;
        overflow: hidden;
        transition: transform 0.15s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .ios-card:active {
        transform: scale(0.98);
      }
      .dark .ios-card {
        background: #1c1c1e;
        border-color: rgba(255,255,255,0.08);
      }

      /* iOS grouped card container */
      .ios-card-group {
        background: #fff;
        border-radius: 16px;
        border: 0.5px solid rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .dark .ios-card-group {
        background: #1c1c1e;
        border-color: rgba(255,255,255,0.08);
      }
      .ios-card-group > *:not(:last-child) {
        border-bottom: 0.5px solid rgba(0,0,0,0.06);
      }
      .dark .ios-card-group > *:not(:last-child) {
        border-bottom-color: rgba(255,255,255,0.06);
      }

      /* iOS search bar */
      .ios-search {
        background: #e5e5ea;
        border-radius: 12px;
        border: none;
        transition: background 0.2s ease;
      }
      .ios-search:focus-within {
        background: #d1d1d6;
      }
      .dark .ios-search {
        background: #2c2c2e;
      }
      .dark .ios-search:focus-within {
        background: #3a3a3c;
      }

      /* iOS section header */
      .ios-section-title {
        font-size: 22px;
        font-weight: 700;
        color: #000;
        letter-spacing: -0.3px;
      }
      .dark .ios-section-title {
        color: #fff;
      }

      /* iOS small label */
      .ios-label {
        font-size: 13px;
        font-weight: 600;
        color: #8e8e93;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* iOS blue link/button */
      .ios-blue-btn {
        background: #007aff;
        color: #fff;
        border: none;
        border-radius: 14px;
        font-weight: 600;
        font-size: 15px;
        padding: 12px 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: background 0.15s ease, transform 0.1s ease;
        -webkit-tap-highlight-color: transparent;
        cursor: pointer;
      }
      .ios-blue-btn:active {
        background: #0056b3;
        transform: scale(0.97);
      }

      .ios-dark-btn {
        background: #1c1c1e;
        color: #fff;
        border: none;
        border-radius: 14px;
        font-weight: 600;
        font-size: 15px;
        padding: 12px 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: background 0.15s ease, transform 0.1s ease;
        -webkit-tap-highlight-color: transparent;
        cursor: pointer;
      }
      .ios-dark-btn:active {
        background: #000;
        transform: scale(0.97);
      }
      .dark .ios-dark-btn {
        background: #f5f5f7;
        color: #1c1c1e;
      }
      .dark .ios-dark-btn:active {
        background: #e5e5e7;
      }

      /* Stats pill */
      .ios-stat {
        background: #f2f2f7;
        border-radius: 14px;
        padding: 14px 8px;
        text-align: center;
        -webkit-tap-highlight-color: transparent;
      }
      .dark .ios-stat {
        background: #2c2c2e;
      }

      /* Social buttons */
      .ios-social {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 100px;
        font-size: 13px;
        font-weight: 600;
        transition: transform 0.1s ease, opacity 0.1s ease;
        -webkit-tap-highlight-color: transparent;
        cursor: pointer;
        border: none;
      }
      .ios-social:active {
        transform: scale(0.95);
        opacity: 0.7;
      }
      .ios-social-tg {
        background: #007aff;
        color: #fff;
      }
      .ios-social-dc {
        background: #5856d6;
        color: #fff;
      }

      /* Page bg */
      .ios-page-bg {
        background: #f2f2f7;
        min-height: 100vh;
      }
      .dark .ios-page-bg {
        background: #000;
      }

      /* Badge */
      .ios-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2px;
      }

      /* Screenshot container */
      .ios-screenshot {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        height: 160px;
        background: #e5e5ea;
        -webkit-tap-highlight-color: transparent;
      }
      .dark .ios-screenshot {
        background: #2c2c2e;
      }
      .ios-screenshot img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      .ios-screenshot:active img {
        transform: scale(1.03);
      }

      /* Separator */
      .ios-sep {
        height: 0.5px;
        background: rgba(0,0,0,0.06);
        margin: 0 16px;
      }
      .dark .ios-sep {
        background: rgba(255,255,255,0.06);
      }

      /* Filter chip */
      .ios-chip {
        padding: 6px 14px;
        border-radius: 100px;
        font-size: 13px;
        font-weight: 600;
        background: #e5e5ea;
        color: #3a3a3c;
        border: none;
        cursor: pointer;
        transition: all 0.15s ease;
        -webkit-tap-highlight-color: transparent;
      }
      .ios-chip:active {
        transform: scale(0.95);
      }
      .ios-chip.active {
        background: #007aff;
        color: #fff;
      }
      .dark .ios-chip {
        background: #2c2c2e;
        color: #e5e5ea;
      }
      .dark .ios-chip.active {
        background: #0a84ff;
        color: #fff;
      }

      /* Premium gold accent */
      .ios-gold {
        background: linear-gradient(135deg, #f5c842, #e6a817);
      }

      /* No scrollbar jank */
      * {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(s);
  }

  return `
  <div class="ios-page-bg min-h-screen">
    <div class="max-w-lg mx-auto pb-28 px-4">

      <!-- ===== HERO ===== -->
      <section class="pt-14 pb-6 text-center">
        
        <div class="hello-reveal" style="animation-delay: 0.1s">
          <h1 class="hello-cursive text-6xl sm:text-7xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight pb-1 select-none">
            Stark Mods
          </h1>
        </div>

        <div class="hello-reveal mt-3" style="animation-delay: 0.4s">
          <p class="text-sm text-[#8e8e93] font-medium">
            Premium Mods · Safe · Anti-Ban
          </p>
        </div>

        <div class="hello-reveal mt-4 flex justify-center" style="animation-delay: 0.6s">
          <div class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e]">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-green-500" style="animation: iosPulse 2s infinite"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span class="text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider">v7+ Live</span>
          </div>
        </div>

        <!-- Social -->
        <div class="hello-reveal mt-6 flex justify-center gap-3" style="animation-delay: 0.8s">
          <button onclick="window.open('https://t.me/starkrc20','_blank')" class="ios-social ios-social-tg">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </button>
          <button onclick="window.open('https://discord.gg/KaeHESH9n','_blank')" class="ios-social ios-social-dc">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
            Discord
          </button>
        </div>
      </section>

      <!-- ===== STATS ===== -->
      <section class="hello-reveal grid grid-cols-4 gap-2 mb-6" style="animation-delay: 0.9s">
        <div class="ios-stat">
          <div class="text-base font-bold text-black dark:text-white">5+</div>
          <div class="text-[10px] text-[#8e8e93] font-semibold mt-0.5">Mods</div>
        </div>
        <div class="ios-stat">
          <div class="text-base font-bold text-black dark:text-white">40k</div>
          <div class="text-[10px] text-[#8e8e93] font-semibold mt-0.5">Users</div>
        </div>
        <div class="ios-stat">
          <div class="text-base font-bold text-black dark:text-white">24/7</div>
          <div class="text-[10px] text-[#8e8e93] font-semibold mt-0.5">Help</div>
        </div>
        <div class="ios-stat">
          <div class="text-base font-bold text-black dark:text-white">100%</div>
          <div class="text-[10px] text-[#8e8e93] font-semibold mt-0.5">Safe</div>
        </div>
      </section>

      <!-- ===== SEARCH ===== -->
      <section class="hello-reveal sticky top-20 z-30 mb-5" style="animation-delay: 1s">
        <div class="ios-search flex items-center px-3 py-2.5">
          <span class="material-icons text-[#8e8e93] text-lg mr-2">search</span>
          <input type="text" id="search-mods" onkeyup="window.filterMods()"
                 placeholder="Search mods"
                 class="flex-1 bg-transparent outline-none text-[15px] text-black dark:text-white placeholder-[#8e8e93] font-normal">
          <div class="flex items-center gap-1 ml-2" id="filter-chips">
            <button class="ios-chip active" data-filter="all" onclick="window.setFilter('all')">All</button>
            <button class="ios-chip" data-filter="free" onclick="window.setFilter('free')">Free</button>
            <button class="ios-chip" data-filter="premium" onclick="window.setFilter('premium')">Paid</button>
          </div>
        </div>
        <!-- Hidden select to keep filterMods working -->
        <select id="filter-category" class="hidden">
          <option value="all">All</option>
          <option value="free">Free</option>
          <option value="premium">Paid</option>
        </select>
      </section>

      <!-- ===== FREE MODS ===== -->
      <section class="hello-reveal mb-6" style="animation-delay: 1.1s">
        <div class="px-1 mb-3 flex items-center justify-between">
          <span class="ios-section-title">Free Mods</span>
          <span class="text-[13px] font-semibold text-[#007aff] cursor-pointer" onclick="window.setFilter('free')">See All</span>
        </div>

        <div class="ios-card-group" id="free-mods-group">

          ${renderCard('rc25', `
            <div class="p-4 cursor-pointer" onclick="window.router.navigateTo('/rc25')">
              <div class="flex gap-3 mb-3">
                <img src="assets/icons/icon_rc25.jpg" loading="lazy" class="h-[52px] w-[52px] rounded-[13px] object-cover flex-shrink-0" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)" onerror="this.src='https://placehold.co/52?text=RC25'">
                <div class="flex-1 min-w-0">
                  <div class="text-[15px] font-semibold text-black dark:text-white leading-tight">RC25 Fan-Made</div>
                  <div class="text-[13px] text-[#8e8e93] mt-0.5">Patch Update of RC20</div>
                  <div class="flex gap-1.5 mt-2">
                    <span class="ios-badge bg-black dark:bg-white text-white dark:text-black">v7+</span>
                    <span class="ios-badge bg-[#007aff] text-white">Free</span>
                    <span class="ios-badge bg-[#ff9500] text-white">New</span>
                  </div>
                </div>
              </div>

              <div class="ios-screenshot mb-3">
                <img src="assets/img/img_rc25_1.jpg" loading="lazy" onerror="this.src='https://placehold.co/320x160?text=RC25'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              <p class="text-[13px] text-[#8e8e93] leading-relaxed mb-3">
                Ultimate RC25 patch — enhanced graphics, updated squads & optimized gameplay.
              </p>

              <button onclick="event.stopPropagation(); window.router.navigateTo('/rc25')" class="ios-blue-btn">
                <span class="material-icons text-[16px]">download</span>
                Download
              </button>
            </div>
          `)}

          ${renderCard('rc24', `
            <div class="p-4 cursor-pointer" onclick="window.router.navigateTo('/rc24')">
              <div class="flex gap-3 mb-3">
                <img src="assets/icons/icon_rc24.png" loading="lazy" class="h-[52px] w-[52px] rounded-[13px] object-cover flex-shrink-0" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)" onerror="this.src='https://placehold.co/52?text=RC24'">
                <div class="flex-1 min-w-0">
                  <div class="text-[15px] font-semibold text-black dark:text-white leading-tight">RC Realistic V3</div>
                  <div class="text-[13px] text-[#8e8e93] mt-0.5">Enhanced realistic patch</div>
                  <div class="flex gap-1.5 mt-2">
                    <span class="ios-badge bg-black dark:bg-white text-white dark:text-black">v4.6</span>
                    <span class="ios-badge bg-[#af52de] text-white">T20 WC 2026</span>
                    <span class="ios-badge bg-[#007aff] text-white">Free</span>
                  </div>
                </div>
              </div>

              <div class="ios-screenshot mb-3">
                <img src="assets/img/img_rc24_1.jpg" loading="lazy" onerror="this.src='https://placehold.co/320x160?text=RC24'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              <p class="text-[13px] text-[#8e8e93] leading-relaxed mb-3">
                T20 World Cup 2026 Jerseys, realistic textures & updated player faces.
              </p>

              <button onclick="event.stopPropagation(); window.router.navigateTo('/rc24')" class="ios-blue-btn">
                <span class="material-icons text-[16px]">download</span>
                Download
              </button>
            </div>
          `)}

        </div>
      </section>

      <!-- ===== PREMIUM MODS ===== -->
      <section class="hello-reveal mb-6" style="animation-delay: 1.2s">
        <div class="px-1 mb-3 flex items-center justify-between">
          <span class="ios-section-title">Premium</span>
          <div class="flex items-center gap-1 text-[13px] font-semibold text-[#ff9500]">
            <span class="material-icons text-sm">star</span>
            VIP
          </div>
        </div>

        <div class="ios-card-group" id="premium-mods-group">

          ${renderCard('rc20', `
            <div class="p-4 cursor-pointer" onclick="window.router.navigateTo('/rc20')">
              <div class="flex gap-3 mb-3">
                <div class="relative flex-shrink-0">
                  <img src="assets/icons/icon_rc20.jpg" loading="lazy" class="h-[52px] w-[52px] rounded-[13px] object-cover" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)" onerror="this.src='https://placehold.co/52?text=RC20'">
                  <div class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md ios-gold flex items-center justify-center" style="box-shadow: 0 1px 3px rgba(0,0,0,0.15)">
                    <span class="material-icons text-white text-[11px]">star</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[15px] font-semibold text-black dark:text-white leading-tight">RC20 Mod Menu</div>
                  <div class="text-[13px] text-[#8e8e93] mt-0.5">VIP Cheats</div>
                  <div class="flex gap-1.5 mt-2">
                    <span class="ios-badge bg-black dark:bg-white text-white dark:text-black">v6.1</span>
                    <span class="ios-badge ios-gold text-white">PREMIUM</span>
                  </div>
                </div>
              </div>

              <div class="ios-screenshot mb-3">
                <img src="assets/img/img_rc20_1.jpg" loading="lazy" onerror="this.src='https://placehold.co/320x160?text=RC20'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 rounded-lg px-2.5 py-1">
                  <span class="material-icons text-[11px] text-[#ffd60a]">lock</span>
                  <span class="text-[10px] font-bold text-white uppercase">Premium</span>
                </div>
              </div>

              <p class="text-[13px] text-[#8e8e93] leading-relaxed mb-3">
                Timing Hack, Unlimited Coins/Tickets, All Tournaments Unlocked.
              </p>

              <button onclick="event.stopPropagation(); window.router.navigateTo('/rc20')" class="ios-dark-btn">
                <span class="material-icons text-[16px]">visibility</span>
                View Details
              </button>
            </div>
          `)}

          ${renderCard('wcc3', `
            <div class="p-4 cursor-pointer" onclick="window.router.navigateTo('/wcc3')">
              <div class="flex gap-3 mb-3">
                <div class="relative flex-shrink-0">
                  <img src="assets/icons/icon_wcc3.png" loading="lazy" class="h-[52px] w-[52px] rounded-[13px] object-cover" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1)" onerror="this.src='https://placehold.co/52?text=WCC3'">
                  <div class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md ios-gold flex items-center justify-center" style="box-shadow: 0 1px 3px rgba(0,0,0,0.15)">
                    <span class="material-icons text-white text-[11px]">star</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[15px] font-semibold text-black dark:text-white leading-tight">WCC3 Mod Menu</div>
                  <div class="text-[13px] text-[#8e8e93] mt-0.5">VIP Injector Safe</div>
                  <div class="flex gap-1.5 mt-2">
                    <span class="ios-badge bg-black dark:bg-white text-white dark:text-black">v3.2.3</span>
                    <span class="ios-badge ios-gold text-white">PREMIUM</span>
                  </div>
                </div>
              </div>

              <div class="ios-screenshot mb-3">
                <img src="assets/img/img_wcc3_1.jpg" loading="lazy" onerror="this.src='https://placehold.co/320x160?text=WCC3'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div class="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/60 rounded-lg px-2.5 py-1">
                  <span class="material-icons text-[11px] text-[#ffd60a]">lock</span>
                  <span class="text-[10px] font-bold text-white uppercase">Premium</span>
                </div>
              </div>

              <p class="text-[13px] text-[#8e8e93] leading-relaxed mb-3">
                Career Mode Unlock, Unlimited Platinum, NPL Auction & more.
              </p>

              <button onclick="event.stopPropagation(); window.router.navigateTo('/wcc3')" class="ios-dark-btn">
                <span class="material-icons text-[16px]">visibility</span>
                View Details
              </button>
            </div>
          `)}

        </div>
      </section>

      <!-- Footer -->
      <div class="hello-reveal text-center py-6" style="animation-delay: 1.3s">
        <p class="text-[12px] text-[#c7c7cc] font-medium">Made with ♥ by Stark Mods</p>
      </div>

    </div>
  </div>
  `;
}

// ----------------------
// FILTER CHIP HANDLER
// ----------------------
window.setFilter = function(val) {
  const select = document.getElementById('filter-category');
  if (select) select.value = val;

  document.querySelectorAll('#filter-chips .ios-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === val);
  });

  window.filterMods();
};

// ----------------------
// SEARCH & FILTER
// ----------------------
window.filterMods = function() {
  const query = (document.getElementById('search-mods')?.value || '').toLowerCase();
  const filter = document.getElementById('filter-category')?.value || 'all';
  const cards = document.querySelectorAll('.app-card');

  let foundCount = 0;

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const isFree = text.includes('free');
    const isPremium = text.includes('premium') || text.includes('pro') || text.includes('paid');

    const matchesSearch = text.includes(query);
    let matchesFilter = true;
    if (filter === 'free' && !isFree) matchesFilter = false;
    if (filter === 'premium' && !isPremium) matchesFilter = false;

    if (matchesSearch && matchesFilter) {
      card.style.display = '';
      foundCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const grid = document.getElementById('mods-grid');
  if (!grid) return;
  let noEl = document.getElementById('no-results-msg');

  if (foundCount === 0) {
    if (!noEl) {
      noEl = document.createElement('div');
      noEl.id = 'no-results-msg';
      noEl.className = 'text-center py-16';
      noEl.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="material-icons text-3xl mb-2 text-[#c7c7cc]">search_off</span>
          <p class="text-[15px] font-semibold text-[#8e8e93]">No mods found</p>
          <p class="text-[13px] text-[#c7c7cc] mt-1">Try "RC24" or "WCC3"</p>
        </div>`;
      grid.appendChild(noEl);
    }
  } else {
    noEl?.remove();
  }
};

// ----------------------
// ADMIN TOGGLE
// ----------------------
window.toggleHomeCard = function (id) {
  if (!window.isAdmin) return alert('Only admin can hide/show cards.');
  if (!window.db) return alert('Database not ready.');

  let arr = (window.homeHiddenCards || []).slice();
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);
  else arr.splice(idx, 1);

  db.collection('siteConfig').doc('homeCards')
    .set({ hidden: arr }, { merge: true })
    .then(() => {
      window.homeHiddenCards = arr;
      if (window.router?.handleRoute) window.router.handleRoute('/');
    })
    .catch(err => alert('Failed: ' + err.message));
};

window.HomePage = HomePage;
