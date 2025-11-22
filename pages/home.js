// pages/home.js
function HomePage() {
    return `
    <div class="hero-section">
      <h1 class="hero-title">Stark Mods</h1>
      <p class="hero-description">
        Premium Mod Menus for games and more. Secure, Anti-Ban, and Feature-rich.
      </p>
    </div>
    
    <section class="grid gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      
      <article id="rc20-card" class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm cursor-pointer">
        <div class="app-card-content">
          <div class="app-card-header">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc20.jpg" alt="RC20 Mod" class="h-16 w-16 rounded-lg" loading="lazy" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">RC20 Mod Menu</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">com.stark.rc20</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge">v2.5</span>
                <span class="badge">Premium</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots">
            <div class="screenshot-carousel">
              <div class="screenshot-carousel-track">
                <div class="screenshot-carousel-slide"><img src="assets/img/img_rc20_1.jpg" loading="lazy" /></div>
                <div class="screenshot-carousel-slide"><img src="assets/img/img_rc20_2.jpg" loading="lazy" /></div>
              </div>
              <button class="screenshot-carousel-nav prev"><span class="material-icons">chevron_left</span></button>
              <button class="screenshot-carousel-nav next"><span class="material-icons">chevron_right</span></button>
            </div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate RC20 Mod Menu. Features include Auto Play, Unlimited Currency, All Tournaments Unlocked, and Custom Jerseys.
          </p>

          <div class="app-card-footer">
            <button class="btn download-btn" data-app="rc20">
              <span class="material-icons">shopping_cart</span> Buy Plan
            </button>
          </div>
        </div>
      </article>
	  
<article id="wcc3-card" class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm cursor-pointer">
        <div class="app-card-content">
          <div class="app-card-header">
            <div class="app-icon-container">
              <img src="assets/icons/icon_wcc3.png" alt="WCC3 Mod" class="h-16 w-16 rounded-lg" loading="lazy" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">WCC3 Mod Menu</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">com.stark.wcc3</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge">v3.2.3</span>
                <span class="badge">Premium</span>
				<span class="badge">Anti-ban</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots">
            <div class="screenshot-carousel">
              <div class="screenshot-carousel-track">
                <div class="screenshot-carousel-slide"><img src="assets/img/img_wcc3_1.jpg" loading="lazy" /></div>
                <div class="screenshot-carousel-slide"><img src="assets/img/img_wcc3_2.jpg" loading="lazy" /></div>
              </div>
              <button class="screenshot-carousel-nav prev"><span class="material-icons">chevron_left</span></button>
              <button class="screenshot-carousel-nav next"><span class="material-icons">chevron_right</span></button>
            </div>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate wcc3 Mod Menu. Features include Auto Play, Unlimited Currency, All Tournaments Unlocked, and Custom Jerseys.
          </p>

          <div class="app-card-footer">
            <button class="btn download-btn" data-app="wcc3">
              <span class="material-icons">shopping_cart</span> Buy Plan
            </button>
          </div>
        </div>
      </article>

    </section>
  `;
}
