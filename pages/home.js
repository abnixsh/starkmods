// pages/home.js

// Global state for hidden cards (loaded from Firestore)
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

// One-time load of hidden cards from Firestore
window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) {
    // DB not ready yet, try again a bit later
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

      // Only re-render if we are currently on home route
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
  // Try loading hidden cards (non-blocking)
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
      ? `<div class="mb-1 text-[10px] text-red-500 font-semibold uppercase">Hidden (global)</div>`
      : '';

    return `
      <div class="flex justify-end mb-1">
        <button onclick="window.toggleHomeCard('${id}')"
                class="text-slate-400 hover:text-red-500 text-[11px] flex items-center gap-1">
          <span class="material-icons text-xs">${icon}</span>
          <span class="uppercase font-semibold">${label}</span>
        </button>
      </div>
      ${hiddenNote}
    `;
  };

  const renderCard = (id, innerHtml) => {
    // Non-admin: if card is hidden, do not render at all
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50' : '';

    return `
      <article class="app-card p-6 transition ${extraClasses}"
               data-card-id="${id}">
        ${adminControls(id)}
        ${innerHtml}
      </article>
    `;
  };

  return `
  <div class="max-w-6xl mx-auto pb-20 animate-fade-in">

    <section class="hero-section mb-12 text-center pt-8">
      <h1 class="hero-title mb-3">Stark Mods</h1>
      <p class="hero-description">
        Premium Mod Menus for games and more. Secure, Anti-Ban, and Feature-rich.
      </p>
    </section>

    <section class="grid md:grid-cols-3 gap-6">

      ${renderCard('rc25', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc25.jpg" alt="RC25 Mod" class="h-16 w-16 rounded-2xl shadow-sm"
                   onerror="this.src='https://placehold.co/64?text=RC25'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">RC25 Fan-Made</div>
              <div class="text-sm text-slate-500">com.nautilus.RealCricket3D</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 dark:bg-slate-700 px-2 py-1">v7+</span>
                <span class="badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black screenshot-carousel relative h-40">
            <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
              ${[1,2,3,4,5].map(i => `
                <div class="screenshot-carousel-slide min-w-full h-full">
                  <img src="assets/img/img_rc25_${i}.jpg" class="w-full h-full object-cover opacity-90"
                       alt="RC25 screenshot ${i}"
                       onerror="this.src='https://placehold.co/320x180?text=RC25-${i}'">
                </div>
              `).join('')}
            </div>
            <button type="button" class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button type="button" class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_right</span>
            </button>
            <div class="screenshot-carousel-indicators absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
            The ultimate RC25 Patch. Upgraded Enhanced version of RC20 for the fans of Real Cricket.
          </p>

          <div class="app-card-footer mt-auto">
            <button onclick="window.router.navigateTo('/rc25')" class="btn w-full py-2">
              Download Now
            </button>
          </div>
        </div>
      `)}

      ${renderCard('rc24', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc24.png" alt="RC Realistic V2" class="h-16 w-16 rounded-2xl shadow-sm"
                   onerror="this.src='https://placehold.co/64?text=RC24'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">RC Realistic V2</div>
              <div class="text-sm text-slate-500">com.nautilus.RealCricket</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 dark:bg-slate-700 px-2 py-1">v4.5</span>
                <span class="badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black screenshot-carousel relative h-40">
            <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
              ${[1,2,3,4,5].map(i => `
                <div class="screenshot-carousel-slide min-w-full h-full">
                  <img src="assets/img/img_rc24_${i}.jpg" class="w-full h-full object-cover opacity-90"
                       alt="RC24 screenshot ${i}"
                       onerror="this.src='https://placehold.co/320x180?text=RC24-${i}'">
                </div>
              `).join('')}
            </div>
            <button type="button" class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button type="button" class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_right</span>
            </button>
            <div class="screenshot-carousel-indicators absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
            The most realistic patch of RC24 till date!
          </p>

          <div class="app-card-footer mt-auto">
            <button onclick="window.router.navigateTo('/rc24')" class="btn w-full py-2">
              Download Now
            </button>
          </div>
        </div>
      `)}

      ${renderCard('rc20', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc20.jpg" alt="RC20 Mod" class="h-16 w-16 rounded-2xl shadow-sm"
                   onerror="this.src='https://placehold.co/64?text=RC20'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">RC20 Mod Menu</div>
              <div class="text-sm text-slate-500">com.nautilus.ReaCricket3D</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 dark:bg-slate-700 px-2 py-1">v6.1</span>
                <span class="badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black screenshot-carousel relative h-40">
            <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
              ${[1,2,3,4].map(i => `
                <div class="screenshot-carousel-slide min-w-full h-full">
                  <img src="assets/img/img_rc20_${i}.jpg" class="w-full h-full object-cover opacity-90"
                       alt="RC20 screenshot ${i}"
                       onerror="this.src='https://placehold.co/320x180?text=RC20-${i}'">
                </div>
              `).join('')}
            </div>
            <button type="button" class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button type="button" class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_right</span>
            </button>
            <div class="screenshot-carousel-indicators absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
            The ultimate RC20 VIP Mod Menu. Features include Timing Hack, Unlimited Coins/tickets, Mps&Mcs, All Tournaments Unlocked.
          </p>

          <div class="app-card-footer mt-auto">
            <button onclick="window.router.navigateTo('/rc20')" class="btn w-full py-2">
              View Details
            </button>
          </div>
        </div>
      `)}

      ${renderCard('wcc3', `
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_wcc3.png" alt="WCC3 Mod" class="h-16 w-16 rounded-2xl shadow-sm"
                   onerror="this.src='https://placehold.co/64?text=WCC3'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">WCC3 Mod Menu</div>
              <div class="text-sm text-slate-500">com.stark.wcc3</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 dark:bg-slate-700 px-2 py-1">v3.2.3</span>
                <span class="badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-xl overflow-hidden bg-black screenshot-carousel relative h-40">
            <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
              ${[1,2,3,4,5].map(i => `
                <div class="screenshot-carousel-slide min-w-full h-full">
                  <img src="assets/img/img_wcc3_${i}.jpg" class="w-full h-full object-cover opacity-90"
                       alt="WCC3 screenshot ${i}"
                       onerror="this.src='https://placehold.co/320x180?text=WCC3-${i}'">
                </div>
              `).join('')}
            </div>
            <button type="button" class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button type="button" class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer z-10 text-white">
              <span class="material-icons text-sm">chevron_right</span>
            </button>
            <div class="screenshot-carousel-indicators absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
            The ultimate WCC3 VIP Mod Menu. Features include Career Mode Unlock, Unlimited Energy, All Tournaments Unlocked..etc
          </p>

          <div class="app-card-footer mt-auto">
            <button onclick="window.router.navigateTo('/wcc3')" class="btn w-full py-2">
              View Details
            </button>
          </div>
        </div>
      `)}

    </section>
  </div>
  `;
}

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
