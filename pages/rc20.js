// pages/rc20.js
function Rc20Page() {
    return `
    <div class="max-w-4xl mx-auto animate-fade-in">
      
      <div class="mb-6">
        <a href="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition" data-link>
          <span class="material-icons text-sm">arrow_back</span> Back to Home
        </a>
      </div>

      <div class="flex items-center gap-4 mb-8">
         <img src="assets/icons/icon_rc20.jpg" class="w-20 h-20 rounded-2xl shadow-lg" alt="RC20 Logo">
         <div>
             <h1 class="text-3xl font-bold">RC20 Mod Menu</h1>
             <div class="flex gap-2 mt-2">
                <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">v6.1</span>
                <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">no root</span>
                <span class="px-2 py-0.5 bg-blue-100 dark:bg-red-900 text-white-700 dark:text-blue-300 text-xs font-bold rounded">Anti-ban</span>
             </div>
         </div>
      </div>

      <div class="app-card p-4 rounded-2xl mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
         <h3 class="font-bold text-lg mb-4 px-2">Gameplay Screenshots</h3>
         
         <div class="screenshot-carousel rounded-xl overflow-hidden shadow-lg aspect-video relative">
              <div class="screenshot-carousel-track h-full flex transition-transform duration-500">
                <div class="screenshot-carousel-slide min-w-full h-full">
                  <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 1" />
                </div>
                <div class="screenshot-carousel-slide min-w-full h-full">
                  <img src="assets/img/img_rc20_2.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 2" />
                </div>
              </div>

              <button class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer z-10">
                <span class="material-icons">chevron_left</span>
              </button>
              <button class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer z-10">
                <span class="material-icons">chevron_right</span>
              </button>
         </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
          
          <div class="app-card p-6 rounded-2xl">
            <h3 class="text-xl font-bold mb-4">Mod Features</h3>
            <ul class="space-y-3 text-slate-600 dark:text-slate-300">
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Perfect Timing)</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Always No ball</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Always Wide ball</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlimited Runs</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Anti-pause</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlimited Coins & Tickets</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlock All Tournaments</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlimed Mps/Mcs</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>All Stadiums Unlock</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>No Ads</span></li>

            </ul>
          </div>

          <div class="app-card p-6 rounded-2xl flex flex-col justify-between">
            <div>
                <h3 class="text-xl font-bold mb-4">Description</h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    Get the ultimate advantage in Real Cricket 20. Our mod menu is safe, secure, and easy to use. No root required.
                </p>
            </div>
            
            <button onclick="window.router.navigateTo('/plans')" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer">
                <span class="material-icons">shopping_cart</span> Buy Premium Plan
            </button>
          </div>
      </div>
    </div>
    `;
}
