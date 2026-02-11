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
        <h1 class="text-3xl font-bold">Real Cricket Realistic V3</h1>
        <div class="flex gap-2 mt-2">
          <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">v4.6</span>
          <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">Free</span>
          <span class="badge bg-purple-600 text-white border border-purple-700 dark:bg-purple-500 dark:border-purple-400">T20 WC 2026</span>
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
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic T20 WC 2026 Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic ODI Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic IPL Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic TEST Jerseys</span></li>
          <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Realistic T20 Jerseys</span></li>
        </ul>
      </div>

    <!-- Card Container: Adapts to White in Light mode, Dark Slate in Dark mode -->
<div class="app-card p-6 rounded-2xl flex flex-col justify-between shadow-xl 
            bg-white text-slate-900 
            dark:bg-slate-900 dark:text-white">
            
    <div>
        <!-- Heading: Dark text in light mode, White in dark mode -->
        <h3 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">
            Free Download
        </h3>
        
        <!-- Description: Grey text adapted for visibility -->
        <p class="text-slate-600 dark:text-slate-400 text-sm mb-6">
            This mod is completely free. Click below to download directly.
        </p>
    </div>
    
    <div class="space-y-3">
        <!-- Button:
             - bg-blue-600: Solid blue for visibility in Light Mode
             - dark:bg-blue-600/20: Transparent glass in Dark Mode
             - text-white: Always white
             - Shadow: Blue glow added
        -->
        <button class="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 
                       bg-blue-600 border border-blue-400/50
                       dark:bg-blue-600/20 dark:backdrop-blur-md 
                       shadow-[0_0_15px_rgba(37,99,235,0.6)] 
                       hover:shadow-[0_0_25px_rgba(37,99,235,0.8)] 
                       hover:bg-blue-500 dark:hover:bg-blue-600/40
                       transition-all duration-300 ease-in-out cursor-not-allowed">
            <span class="material-icons">download</span> Download Patch
        </button>
        
        <!-- Helper Text: Dark grey in light mode, Light blueish-grey in dark mode -->
        <p class="text-center text-xs font-medium 
                  text-slate-500 dark:text-blue-200/60">
            Download will available very soon!
        </p>
    </div>
</div>
      </div>
    </div>
    `;
}

// Router ke liye
window.Rc24Page = Rc24Page;
