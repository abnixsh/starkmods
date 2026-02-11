function Rc20Page() {
  // Shared styles for animations and scrollbars
  const styles = `
    <style>
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-entry {
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
      .delay-100 { animation-delay: 0.1s; }
      .delay-200 { animation-delay: 0.2s; }
      .delay-300 { animation-delay: 0.3s; }
      
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
  `;

  return `
  ${styles}
  <div class="max-w-4xl mx-auto px-4 pt-6 pb-24">
      
    <div class="mb-8 animate-entry">
      <a href="/" class="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors duration-300" data-link>
        <span class="material-icons text-sm transition-transform duration-300 group-hover:-translate-x-1">arrow_back</span>
        <span class="font-medium">Back to Home</span>
      </a>
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 animate-entry delay-100">
      <div class="relative group">
        <div class="absolute inset-0 bg-orange-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <img src="assets/icons/icon_rc20.jpg"
             class="relative w-24 h-24 rounded-2xl shadow-xl z-10 transform transition-transform duration-500 group-hover:scale-105"
             onerror="this.src='https://placehold.co/96?text=RC20'">
      </div>
      
      <div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          RC20 Mod Menu
        </h1>
        <div class="flex flex-wrap gap-2 mt-3">
          <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">v6.1</span>
          <span class="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-100 dark:border-green-800">No Root</span>
          <span class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs font-bold rounded-full border border-red-100 dark:border-red-800 flex items-center gap-1">
            <span class="material-icons text-[12px]">shield</span> Anti-ban
          </span>
        </div>
      </div>
    </div>

    <div class="animate-entry delay-200 mb-10">
      <div class="flex items-center justify-between mb-4 px-1">
        <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200">Gameplay Preview</h3>
        <span class="text-xs text-slate-400 font-medium">Swipe to view</span>
      </div>
      
      <div class="relative group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 bg-slate-900 aspect-video">
        <div class="screenshot-carousel-track h-full flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing">
          <div class="screenshot-carousel-slide min-w-full h-full relative">
            <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 1" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc20_2.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 2" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc20_3.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 3" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc20_4.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 4" />
          </div>
        </div>

        <button class="screenshot-carousel-nav prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white p-3 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 hover:scale-100">
          <span class="material-icons">chevron_left</span>
        </button>
        <button class="screenshot-carousel-nav next absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white p-3 rounded-full cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 hover:scale-100">
          <span class="material-icons">chevron_right</span>
        </button>

        <div class="screenshot-carousel-indicators absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"></div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 animate-entry delay-300">
        
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
        <h3 class="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          <span class="material-icons text-purple-500">settings_suggest</span> Mod Features
        </h3>
        
        <ul class="grid grid-cols-1 gap-y-3">
          ${createFeatureItem('Always Six Vip')}
          ${createFeatureItem('Show Ball Variation')}
          ${createFeatureItem('Always No ball & Wide ball')}
          ${createFeatureItem('Unlimited Runs & Coins')}
          ${createFeatureItem('Anti-pause Logic')}
          ${createFeatureItem('Unlock All Tournaments')}
          ${createFeatureItem('Unlimited MPs/MCs')}
          ${createFeatureItem('No Ads (Premium)')}
        </ul>
      </div>

      <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-full relative overflow-hidden">
        
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div>
          <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">Select Plan</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            Get the ultimate advantage in Real Cricket 20. Instant delivery and 24/7 support included.
          </p>
        </div>
        
        <div class="space-y-4 relative z-10">
          
          <button onclick="window.addToCart('rc20', '1month')" 
                  class="w-full group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 p-4 rounded-xl transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md">
            <div class="flex flex-col items-start">
                <span class="font-bold text-slate-700 dark:text-slate-200 text-sm">1 Month Access</span>
                <span class="text-xs text-slate-400">Standard License</span>
            </div>
            <span class="text-lg font-bold text-slate-900 dark:text-white">₹250</span>
          </button>

          <button onclick="window.addToCart('rc20', 'lifetime')" 
                  class="w-full relative overflow-hidden p-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group transform hover:-translate-y-1">
            
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-opacity"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div class="relative flex items-center justify-between text-white">
                <div class="flex flex-col items-start">
                    <div class="flex items-center gap-1">
                        <span class="material-icons text-sm text-yellow-300">diamond</span>
                        <span class="font-bold text-sm">Lifetime Access</span>
                    </div>
                    <span class="text-xs text-blue-100 opacity-90">Best Value • Permanent</span>
                </div>
                <span class="text-xl font-bold">₹1000</span>
            </div>
          </button>
          
          <p class="text-center text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1">
            <span class="material-icons text-[12px]">lock</span> Secure payment via UPI/Card
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
}

// Helper for clean list items
function createFeatureItem(text) {
  return `
    <li class="flex items-start gap-3 group">
      <div class="mt-0.5 min-w-[20px] h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
        <span class="material-icons text-green-600 dark:text-green-400 text-[12px]">check</span>
      </div>
      <span class="text-slate-600 dark:text-slate-300 text-sm font-medium pt-0.5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">${text}</span>
    </li>
  `;
}

window.Rc20Page = Rc20Page;
