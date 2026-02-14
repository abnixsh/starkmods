function Rc24Page() {
  // Styles for custom animations and scrollbar hiding
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
      
      /* Hide scrollbar for carousel but allow functionality */
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
        <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <img src="assets/icons/icon_rc24.png"
             class="relative w-24 h-24 rounded-2xl shadow-xl z-10 transform transition-transform duration-500 group-hover:scale-105"
             onerror="this.src='https://placehold.co/96?text=RC24'">
      </div>
      
      <div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Real Cricket Realistic V3
        </h1>
        <div class="flex flex-wrap gap-2 mt-3">
          <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">v4.6</span>
          <span class="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-100 dark:border-green-800">Free</span>
          <span class="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-[0_2px_10px_rgba(147,51,234,0.3)]">
            T20 WC 2026
          </span>
        </div>
      </div>
    </div>

    <div class="animate-entry delay-200 mb-10">
      <div class="flex items-center justify-between mb-4 px-1">
        <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200">Preview</h3>
        <span class="text-xs text-slate-400 font-medium">Swipe to view</span>
      </div>
      
      <div class="relative group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 bg-slate-900 aspect-video">
        <div class="screenshot-carousel-track h-full flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing">
          <div class="screenshot-carousel-slide min-w-full h-full relative">
            <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover" loading="lazy" alt="Gameplay 1" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full relative">
            <img src="assets/img/img_rc24_2.jpg" class="w-full h-full object-cover" loading="lazy" alt="Gameplay 2" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full relative">
            <img src="assets/img/img_rc24_3.jpg" class="w-full h-full object-cover" loading="lazy" alt="Gameplay 3" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full relative">
            <img src="assets/img/img_rc24_4.jpg" class="w-full h-full object-cover" loading="lazy" alt="Gameplay 4" />
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
        
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 class="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          <span class="material-icons text-blue-500">auto_awesome</span> Mod Features
        </h3>
        <ul class="space-y-4">
          ${createFeatureItem('Realistic T20 WC 2026 Jerseys')}
          ${createFeatureItem('Realistic ODI & Test Kits')}
          ${createFeatureItem('Updated Squads & Rosters')}
          ${createFeatureItem('Enhanced Stadium Textures')}
          ${createFeatureItem('New Broadcast Graphics')}
        </ul>
      </div>

      <div class="relative overflow-hidden p-1 rounded-3xl bg-gradient-to-br from-blue-500/10 via-slate-100 to-slate-50 dark:from-blue-500/20 dark:via-slate-800 dark:to-slate-900 shadow-xl">
        <div class="h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[20px] p-6 flex flex-col justify-between border border-white/50 dark:border-slate-700/50">


