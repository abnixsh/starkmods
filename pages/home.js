function HomePage() {
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

      <!-- RC25 CARD -->
      <article class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm transition">
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
                <span class="badge bg-slate-100 px-2 py-1 rounded text-xs">v6.1</span>
                <span class="badge bg-green-100 px-2 py-1 rounded text-xs text-green-800">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden h-40 bg-black">
            <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover opacity-90"
                 onerror="this.src='https://placehold.co/320x180?text=RC25'" />
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate RC25 Mod Menu. Enhanced version of RC20 for the fans.
          </p>

          <div class="app-card-footer">
            <button onclick="window.router.navigateTo('/rc25')" class="btn w-full bg-blue-600 text-white py-2 rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </article>

      <!-- RC20 CARD with CAROUSEL -->
      <article class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm transition">
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc20.jpg" alt="RC20 Mod" class="h-16 w-16 rounded-lg"
                   onerror="this.src='https://placehold.co/64?text=RC20'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">RC20 Mod Menu</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">com.stark.rc20</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 px-2 py-1 rounded text-xs">v6.1</span>
                <span class="badge bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-800">Premium</span>
              </div>
            </div>
          </div>

          <!-- CAROUSEL AREA -->
          <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden bg-black screenshot-carousel relative">
            <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
              <div class="screenshot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover opacity-90"
                     alt="RC20 screenshot 1"
                     onerror="this.src='https://placehold.co/320x180?text=RC20-1'">
              </div>
              <div class="screenshot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_2.jpg" class="w-full h-full object-cover opacity-90"
                     alt="RC20 screenshot 2"
                     onerror="this.src='https://placehold.co/320x180?text=RC20-2'">
              </div>
              <div class="screenshot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_3.jpg" class="w-full h-full object-cover opacity-90"
                     alt="RC20 screenshot 3"
                     onerror="this.src='https://placehold.co/320x180?text=RC20-3'">
              </div>
              <div class="screenshot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_4.jpg" class="w-full h-full object-cover opacity-90"
                     alt="RC20 screenshot 4"
                     onerror="this.src='https://placehold.co/320x180?text=RC20-4'">
              </div>
            </div>

            <!-- arrows -->
            <button type="button"
                    class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full cursor-pointer z-10">
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button type="button"
                    class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full cursor-pointer z-10">
              <span class="material-icons text-sm">chevron_right</span>
            </button>

            <!-- dots -->
            <div class="screenshot-carousel-indicators absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate RC20 Mod Menu. Features include Auto Play, Unlimited Currency, All Tournaments Unlocked.
          </p>

          <div class="app-card-footer">
            <button onclick="window.router.navigateTo('/rc20')" class="btn w-full bg-blue-600 text-white py-2 rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </article>

      <!-- WCC3 CARD with CAROUSEL -->
      <article class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm transition">
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc20.jpg" alt="WCC3 Mod" class="h-16 w-16 rounded-lg"
                   onerror="this.src='https://placehold.co/64?text=WCC3'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">WCC3 Mod Menu</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">com.stark.wcc3</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 px-2 py-1 rounded text-xs">v6.1</span>
                <span class="badge bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-800">Premium</span>
              </div>
            </div>
          </div>

          <!-- CAROUSEL AREA -->
          <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden bg-black screenshot-carousel relative">
            <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
              <div class="screenshot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover opacity-90"
                     alt="WCC3 screenshot 1"
                     onerror="this.src='https://placehold.co/320x180?text=WCC3-1'">
              </div>
              <div class="screensWCC3hot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_2.jpg" class="w-full h-full object-cover opacity-90"
                     alt="WCC3 screenshot 2"
                     onerror="this.src='https://placehold.co/320x180?text=WCC3-2'">
              </div>
              <div class="screenshot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_3.jpg" class="w-full h-full object-cover opacity-90"
                     alt="WCC3 screenshot 3"
                     onerror="this.src='https://placehold.co/320x180?text=WCC3-3'">
              </div>
              <div class="screenshot-carousel-slide min-w-full h-full">
                <img src="assets/img/img_rc20_4.jpg" class="w-full h-full object-cover opacity-90"
                     alt="WCC3 screenshot 4"
                     onerror="this.src='https://placehold.co/320x180?text=WCC3-4'">
              </div>
            </div>

            <!-- arrows -->
            <button type="button"
                    class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full cursor-pointer z-10">
              <span class="material-icons text-sm">chevron_left</span>
            </button>
            <button type="button"
                    class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full cursor-pointer z-10">
              <span class="material-icons text-sm">chevron_right</span>
            </button>

            <!-- dots -->
            <div class="screenshot-carousel-indicators absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate WCC3 Mod Menu. Features include Auto Play, Unlimited Currency, All Tournaments Unlocked.
          </p>

          <div class="app-card-footer">
            <button onclick="window.router.navigateTo('/wcc3')" class="btn w-full bg-blue-600 text-white py-2 rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </article>

    </section>
  </div>
  `;
}

window.HomePage = HomePage;
