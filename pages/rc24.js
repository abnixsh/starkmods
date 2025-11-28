function Rc24Page() {
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
      <img src="assets/icons/icon_rc24.png"
           class="w-20 h-20 rounded-2xl shadow-lg"
           onerror="this.src='https://placehold.co/80?text=RC24'">
      <div>
        <h1 class="text-3xl font-bold">RC24 Realistic V1</h1>
        <div class="flex gap-2 mt-2">
          <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">v3.3</span>
          <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">Free</span>
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
            <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 1" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc24_2.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 2" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc24_3.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 3" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc24_4.jpg" class="w-full h-full object-cover" loading="lazy" alt="Screenshot 4" />
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
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic ODI Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic IPL Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic TEST Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic T20 Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic PSL Jerseys</span></li>
        </ul>
      </div>

     <div class="app-card p-6 rounded-2xl flex flex-col justify-between bg-slate-900 text-white shadow-xl">
            <div>
                <h3 class="text-xl font-bold mb-2 text-white">Free Download</h3>
                <p class="text-slate-400 text-sm mb-6">
                    This mod is completely free. Click below to download directly.
                </p>
            </div>
            
            <div class="space-y-3">
                <a href="https://dupload.net/o9cxh6xht397" target="_blank" class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    <span class="material-icons">download</span> Download Patch
                </a>
            </div>
          </div>
      </div>
    </div>
    `;
}

// Router ke liye
window.Rc24Page = Rc24Page;
