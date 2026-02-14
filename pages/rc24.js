function Rc24Page() {
  // Styles for animations and carousel behavior
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
      
      .screenshot-carousel-track {
        display: flex;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
    </style>
  `;

  // Carousel Logic (Executes after the HTML is rendered)
  setTimeout(() => {
    const track = document.querySelector('.screenshot-carousel-track');
    const slides = document.querySelectorAll('.screenshot-carousel-slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    let index = 0;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    nextBtn?.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      updateCarousel();
    });

    prevBtn?.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  }, 100);

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
        <div class="absolute inset-0 bg-yellow-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <img src="assets/icons/icon_rc24.png"
             class="relative w-24 h-24 rounded-2xl shadow-xl z-10 transform transition-transform duration-500 group-hover:scale-105"
             onerror="this.src='https://placehold.co/96?text=rc24'">
      </div>
      
      <div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          RC Realistic V3
        </h1>
        <div class="flex flex-wrap gap-2 mt-3">
        <span class="badge bg-purple-600 text-white border border-purple-700 dark:bg-purple-500 dark:border-purple-400">T20 WC 2026</span>
          <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800">v4.6</span>
          <span class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <span class="material-icons text-[12px]">security</span> Anti-ban
          </span>
          <span class="px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-600 text-black text-xs font-black rounded-full shadow-md flex items-center gap-1">
            <span class="material-icons text-[14px]">stars</span> FREE
          </span>
        </div>
      </div>
    </div>

    <div class="animate-entry delay-200 mb-10">
      <div class="flex items-center justify-between mb-4 px-1">
        <h3 class="font-bold text-lg text-slate-800 dark:text-slate-200">Gameplay Preview</h3>
        <span class="text-xs text-slate-400 font-medium">Click arrows to navigate</span>
      </div>
      
      <div class="relative group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 bg-slate-900 aspect-video">
        <div class="screenshot-carousel-track h-full">
          <div class="screenshot-carousel-slide min-w-full h-full relative">
            <img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc24_2.jpg" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc24_3.jpg" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="screenshot-carousel-slide min-w-full h-full">
            <img src="assets/img/img_rc24_4.jpg" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>

        <button class="screenshot-carousel-nav prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/60 text-white p-3 rounded-full cursor-pointer z-20 transition-all opacity-0 group-hover:opacity-100">
          <span class="material-icons">chevron_left</span>
        </button>
        <button class="screenshot-carousel-nav next absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/60 text-white p-3 rounded-full cursor-pointer z-20 transition-all opacity-0 group-hover:opacity-100">
          <span class="material-icons">chevron_right</span>
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 animate-entry delay-300">
        
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
        <h3 class="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          <span class="material-icons text-amber-500">verified</span> VIP Features
        </h3>
        <ul class="grid grid-cols-1 gap-y-3">
          ${createFeatureItem('T20 WORLD CUP 2026 Jerseys')}
          ${createFeatureItem('Latest Test Jerseys')}
          ${createFeatureItem('Latest T20 Jerseys')}
          ${createFeatureItem('Latest ODI Jerseys')}
          ${createFeatureItem('Latest BBL Jerseys')}
         
        </ul>
      </div>

     <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden">
    <div>
      <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">Download Real Cricket New Patch</h3>
      <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
        Get the latest version with updated T20WC jerseys, sponsors, and enhanced graphics directly to your device.
      </p>
    </div>
    
    <div class="space-y-4 relative z-10">
      <a href="https://dupload.net/4578qs5o0vlg" target="_blank" rel="noopener noreferrer"
         class="w-full block relative overflow-hidden p-4 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group transform hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div class="relative flex items-center justify-center gap-2 text-white">
            <span class="material-icons text-white">download</span>
            <span class="text-xl font-bold">Download Now</span>
        </div>
      </a>
    </div>
  </div>
  `;
}

// Helper for checkmarks
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

window.Rc24Page = Rc24Page;
