// pages/home.js

// Global state for hidden cards (from Firestore)
window.homeHiddenCards = window.homeHiddenCards || [];
window.homeConfigLoaded = window.homeConfigLoaded || false;
window._homeConfigFetchStarted = window._homeConfigFetchStarted || false;

// One-time load of hidden cards from Firestore
window.loadHomeHiddenCardsOnce = function () {
  if (window.homeConfigLoaded || window._homeConfigFetchStarted) return;
  if (!window.db) {
    // DB not ready yet, try a bit later
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

      // Re-render home so new visibility applies
      if (window.router && typeof window.router.handleRoute === 'function') {
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
  // Firestore se config load karne ke liye try karo (non-blocking)
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
    // Non-admin ke liye hidden card bilkul render nahi hoga
    if (!isAdmin && isHidden(id)) return '';
    const extraClasses = isHidden(id) ? 'opacity-50' : '';

    return `
      <article class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm transition ${extraClasses}"
               data-card-id="${id}">
        ${adminControls(id)}
        ${innerHtml}
      </article>
    `;
  };

  return `
  <div class="max-w-6xl mx-auto pb-20 animate-fade-in">

    <!-- HERO -->
    <section class="hero-section mb-10 text-center">
      <h1 class="hero-title mb-2">Stark Mods</h1>
      <p class="hero-description">
        Premium Mod Menus for games and more. Secure, Anti-Ban, and Feature-rich.
      </p>
    </section>

    <!-- MOD CARDS GRID -->
    <section class="grid md:grid-cols-3 gap-6">

      ${renderCard('rc25', `
        <!-- RC25 CARD -->
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc25.jpg" alt="RC25 Mod" class="h-16 w-16 rounded-lg"
                   onerror="this.src='https://placehold.co/64?text=RC25'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">RC25 Fan-Made</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">com.nautilus.RealCricket3D</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 px-2 py-1 rounded text-xs">v7</span>
                <span class="badge bg-green-100 px-2 py-1 rounded text-xs text-green-800">Free</span>
              </div>
            </div>
          </div>

          <!-- CAROUSEL -->
          <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden bg-black screenshot-carousel relative h-40">
            <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
              ${[1,2,3,4,5].map(i => `
                <div class="screenshot-carousel-slide min-w-full h-full">
                  <img src="assets/img/img_rc25_${i}.jpg" class="w-full h-full object-cover opacity-90"
                       alt="RC25 screenshot ${i}"
                       onerror="this.src='https://placehold.co/320x180?text=RC25-${i}'">
                </div>
              `).join('')}
            </div>
            <button type="button"
                    class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full cursor-pointer z-10">
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button type="button"
                    class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full cursor-pointer z-10">
              <span class="material-icons text-sm">chevron_right</span>
            </button>
            <div class="screenshot-carousel-indicators absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate RC25 Patch. Upgraded Enhanced version of RC20 for the fans of Real Cricket.
          </p>

          <div class="app-card-footer">
            <button onclick="window.router.navigateTo('/rc25')" class="btn w-full bg-blue-600 text-white py-2 rounded-lg">
              Download Now
            </button>
          </div>
        </div>
      `)}

      <!-- RC24, RCSWIPE, RC20, WCC3, WCC2 cards – same as pehle wale version → yahan short kiya hai
           Tum apna latest cards markup jo pehle use kar rahe the wahi yahan renderCard('rc24', ...),
           renderCard('rcswipe', ...), etc me paste kar do. -->

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
