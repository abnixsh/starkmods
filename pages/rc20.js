function Rc20Page() {
  return `
  <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      
    <!-- Back Link -->
    <div class="mb-6">
      <a href="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition" data-link>
        <span class="material-icons text-sm">arrow_back</span> Back to Home
      </a>
    </div>

    <!-- Header Info -->
    <div class="flex items-center gap-4 mb-8">
      <img src="assets/icons/icon_rc20.jpg"
           class="w-20 h-20 rounded-2xl shadow-lg"
           onerror="this.src='https://placehold.co/80?text=RC20'">
      <div>
        <h1 class="text-3xl font-bold">RC20 Mod Menu</h1>
        <div class="flex gap-2 mt-2">
          <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">v6.1</span>
          <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">No Root</span>
          <span class="px-2 py-0.5 bg-blue-100 dark:bg-red-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">Anti-ban</span>
        </div>
      </div>
    </div>

    <!-- SCREENSHOTS -->
    <div class="app-card p-4 rounded-2xl mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <h3 class="font-bold text-lg mb-4 px-2">Gameplay Screenshots</h3>
      
      <div class="screenshot-carousel rounded-xl overflow-hidden shadow-lg aspect-video relative group">
        <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 1" />
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

        <button class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer z-10">
          <span class="material-icons">chevron_left</span>
        </button>
        <button class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer z-10">
          <span class="material-icons">chevron_right</span>
        </button>

        <!-- dots will be injected by JS -->
        <div class="screenshot-carousel-indicators"></div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
        
      <!-- Features -->
      <div class="app-card p-6 rounded-2xl">
        <h3 class="text-xl font-bold mb-4">Mod Features</h3>
        <ul class="space-y-3 text-slate-600 dark:text-slate-300">
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Always Six Vip</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Show Ball Variation</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Always No ball</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Always Wide ball</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlimited Runs</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Anti-pause</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlimited Coins & Tickets</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlock All Tournaments</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlimited MPs/MCs</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Everything Unlock</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>No Ads</span></li>
        </ul>
      </div>

      <!-- Buy Section -->
      <div class="app-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-bold mb-4">Select Plan</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Get the ultimate advantage in Real Cricket 20. Safe, secure, and anti-ban.
          </p>
        </div>
        
        <div class="space-y-3">
          <button onclick="window.addToCart('rc20', '1month')" class="w-full py-3 px-4 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-center justify-between">
            <span>1 Month Access</span>
            <span>₹250</span>
          </button>

          <button onclick="window.addToCart('rc20', 'lifetime')" class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center justify-between">
            <span class="flex items-center gap-2"><span class="material-icons text-sm">diamond</span> Lifetime Access</span>
            <span>₹1000</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
}

window.Rc20Page = Rc20Page;
