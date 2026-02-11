function Rc24Page() {
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
      .screenshot-carousel-track {
        display: flex;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
    </style>
  `;

  // Carousel Logic with Safety Check
  setTimeout(() => {
    const track = document.querySelector('.screenshot-carousel-track');
    if (!track) return; // Exit if page changed before timeout fired

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
      <a href="/" class="group inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors" data-link>
        <span class="material-icons text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
        <span class="font-medium">Back to Home</span>
      </a>
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 animate-entry" style="animation-delay: 0.1s">
      <div class="relative group">
        <div class="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20"></div>
        <img src="assets/icons/icon_rc24.png" class="relative w-24 h-24 rounded-2xl shadow-xl z-10" onerror="this.src='https://placehold.co/96?text=RC24'">
      </div>
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white">Real Cricket Realistic V3</h1>
        <div class="flex gap-2 mt-3">
          <span class="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 text-xs font-bold rounded-full border border-green-100 dark:border-green-800">v4.6</span>
          <span class="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">T20 WC 2026</span>
        </div>
      </div>
    </div>

    <div class="animate-entry mb-10" style="animation-delay: 0.2s">
      <div class="relative group rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-video">
        <div class="screenshot-carousel-track h-full">
           <div class="screenshot-carousel-slide min-w-full h-full"><img src="assets/img/img_rc24_1.jpg" class="w-full h-full object-cover"></div>
           <div class="screenshot-carousel-slide min-w-full h-full"><img src="assets/img/img_rc24_2.jpg" class="w-full h-full object-cover"></div>
           <div class="screenshot-carousel-slide min-w-full h-full"><img src="assets/img/img_rc24_3.jpg" class="w-full h-full object-cover"></div>
        </div>
        <button class="next absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full z-20">
          <span class="material-icons">chevron_right</span>
        </button>
        <button class="prev absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full z-20">
          <span class="material-icons">chevron_left</span>
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 animate-entry" style="animation-delay: 0.3s">
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-2"><span class="material-icons text-blue-500">auto_awesome</span> Mod Features</h3>
        <ul class="space-y-4">
          <li class="flex items-center gap-3"><span class="material-icons text-green-500 text-sm">check_circle</span> Realistic T20 WC 2026 Jerseys</li>
          <li class="flex items-center gap-3"><span class="material-icons text-green-500 text-sm">check_circle</span> Updated Squads & Rosters</li>
        </ul>
      </div>

      <div class="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <h3 class="text-xl font-bold mb-2">Download Patch</h3>
        <p class="text-sm text-slate-500 mb-6">Latest realistic graphics patch. Installation guide inside zip.</p>
        <button disabled class="w-full py-4 bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2">
          <span class="material-icons">hourglass_empty</span> Locked
        </button>
      </div>
    </div>
  </div>
  `;
}

window.Rc24Page = Rc24Page;
                <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                    Get the latest realistic graphics patch. Installation instructions are included in the zip file.
                </p>
            </div>
            
            <div class="space-y-4">
                <button disabled class="group w-full relative py-4 rounded-xl font-bold text-slate-400 dark:text-slate-500 flex items-center justify-center gap-3 
                               bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                               cursor-not-allowed transition-all duration-300">
                    <span class="material-icons text-xl animate-spin-slow">hourglass_empty</span>
                    <span>Download Locked</span>
                    <div class="absolute bottom-0 left-0 h-1 bg-blue-500/30 w-3/4 rounded-b-xl"></div>
                </button>
                <div class="flex items-center justify-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-lg">
                    <span class="material-icons text-[16px]">info</span>
                    Links available soon!
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function createFeatureItem(text) {
  return `
    <li class="flex items-start gap-3 group">
      <div class="mt-0.5 min-w-[24px] h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
        <span class="material-icons text-green-600 dark:text-green-400 text-[14px]">check</span>
      </div>
      <span class="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-sm font-medium pt-0.5">${text}</span>
    </li>
  `;
}

window.Rc24Page = Rc24Page;
      </div>
      <span class="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-sm font-medium pt-0.5">${text}</span>
    </li>
  `;
}

window.Rc24Page = Rc24Page;
