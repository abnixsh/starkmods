function HomePage() {
    return `
    <div class="hero-section text-center py-10">
      <h1 class="hero-title text-4xl font-bold mb-4">Stark Mods</h1>
      <p class="hero-description text-slate-500">
        Premium Mod Menus for games and more. Secure, Anti-Ban, and Feature-rich.
      </p>
    </div>
    
    <section class="grid gap-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">

<!-- RC25 CARD (Click Link Added) -->
      <article onclick="window.router.navigateTo('/rc25')" class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition">
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc25.jpg" alt="RC25 Mod" class="h-16 w-16 rounded-lg" onerror="this.src='https://placehold.co/64?text=RC20'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">RC25 Fan-Made</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">com.nautilus.RealCricket3D</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 px-2 py-1 rounded text-xs">v6.1</span>
                <span class="badge bg-yellow-100 px-2 py-1 rounded text-xs text-yellow-800">Free</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden h-40 bg-black">
             <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover opacity-90" />
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate RC25 Mod Menu. enhanced version of rc20 for the fans.
          </p>

          <div class="app-card-footer">
            <button class="btn w-full bg-blue-600 text-white py-2 rounded-lg">
              Download Now
            </button>
          </div>
        </div>
      </article>



	  
      <!-- RC20 CARD (Click Link Added) -->
      <article onclick="window.router.navigateTo('/rc20')" class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition">
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_rc20.jpg" alt="RC20 Mod" class="h-16 w-16 rounded-lg" onerror="this.src='https://placehold.co/64?text=RC20'" />
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

          <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden h-40 bg-black">
             <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover opacity-90" />
			 <img src="assets/img/img_rc20_2.jpg" class="w-full h-full object-cover opacity-90" />
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate RC20 Mod Menu. Features include Auto Play, Unlimited Currency, All Tournaments Unlocked.
          </p>

          <div class="app-card-footer">
            <button class="btn w-full bg-blue-600 text-white py-2 rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </article>
	  
      <!-- WCC3 CARD -->
      <article onclick="window.router.navigateTo('/wcc3')" class="app-card p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition">
        <div class="app-card-content">
          <div class="app-card-header flex gap-3 mb-4">
            <div class="app-icon-container">
              <img src="assets/icons/icon_wcc3.png" alt="WCC3 Mod" class="h-16 w-16 rounded-lg" onerror="this.src='https://placehold.co/64?text=WCC3'" />
            </div>
            <div class="flex-1">
              <div class="text-xl font-semibold">WCC3 Mod Menu</div>
              <div class="text-sm text-slate-500 dark:text-slate-400">com.stark.wcc3</div>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span class="badge bg-slate-100 px-2 py-1 rounded text-xs">v3.2</span>
                <span class="badge bg-green-100 px-2 py-1 rounded text-xs text-green-800">Anti-ban</span>
              </div>
            </div>
          </div>

          <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden h-40 bg-black">
             <img src="assets/img/img_wcc3_1.jpg" class="w-full h-full object-cover opacity-90" />
          </div>

		  <div class="app-card-screenshots mb-4 rounded-lg overflow-hidden h-40 bg-black">
             <img src="assets/img/img_wcc3_2.jpg" class="w-full h-full object-cover opacity-90" />
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
            The ultimate WCC3 Mod Menu. Unlock everything and play like a pro.
          </p>

          <div class="app-card-footer">
            <button class="btn w-full bg-blue-600 text-white py-2 rounded-lg">
              View Details
            </button>
          </div>
        </div>
      </article>

    </section>
  `;
}

// IMPORTANT
window.HomePage = HomePage;
