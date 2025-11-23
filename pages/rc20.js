function Rc20Page() {
    // Selection reset jab page load ho
    window.selectedPlan = null;

    return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      
      <!-- Back Button -->
      <div class="mb-6">
        <a href="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium" data-link>
          <span class="material-icons text-sm">arrow_back</span> Back to Home
        </a>
      </div>

      <!-- Title Section -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold mb-4">RC20 Mod Menu</h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Dominate the cricket field with Stark Mods. Unlock every feature and play like a pro.
        </p>
      </div>

      <!-- MAIN APP CARD (Old Dark Design) -->
      <div class="app-card p-6 rounded-2xl mb-8 bg-slate-900 text-white shadow-xl">
        <div class="flex flex-col md:flex-row items-center gap-6">
           <img src="assets/icons/icon_rc20.jpg" class="w-24 h-24 rounded-2xl shadow-lg border-2 border-slate-700" alt="RC20 Logo" onerror="this.src='https://placehold.co/100?text=RC20'">
           <div class="flex-1 text-center md:text-left">
             <h2 class="text-2xl font-bold text-white">RC20 Ultimate</h2>
             <div class="text-slate-400 mb-3 text-sm font-mono">com.stark.rc20</div>
             <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
               <span class="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">Version 2.5</span>
               <span class="px-3 py-1 rounded-full bg-green-900/50 text-green-400 border border-green-800 text-xs font-bold">Undetected</span>
             </div>
           </div>
        </div>

        <!-- SCREENSHOTS SLIDER (Added Here) -->
        <!-- Note: data-autoplay="false" lagaya hai taaki ye apne aap na hile -->
        <div class="mt-8">
             <div class="screenshot-carousel rounded-xl overflow-hidden shadow-lg border border-slate-700 bg-black aspect-video relative group" data-autoplay="false">
                  <div class="screenshot-carousel-track h-full flex transition-transform duration-300">
                    <!-- Image 1 -->
                    <div class="screenshot-carousel-slide min-w-full h-full">
                      <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover opacity-90" loading="lazy" alt="Screenshot 1" />
                    </div>
                    <!-- Image 2 -->
                    <div class="screenshot-carousel-slide min-w-full h-full">
                      <img src="assets/img/img_rc20_2.jpg" class="w-full h-full object-cover opacity-90" loading="lazy" alt="Screenshot 2" />
                    </div>
                  </div>

                  <!-- Navigation Arrows -->
                  <button class="screenshot-carousel-nav prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 text-white p-2 rounded-full cursor-pointer z-10 border border-white/10">
                    <span class="material-icons">chevron_left</span>
                  </button>
                  <button class="screenshot-carousel-nav next absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-white/20 text-white p-2 rounded-full cursor-pointer z-10 border border-white/10">
                    <span class="material-icons">chevron_right</span>
                  </button>
             </div>
        </div>

        <!-- PLAN SELECTION (Integrated into Old Card) -->
        <div class="mt-8 pt-6 border-t border-slate-800">
            <h3 class="font-bold text-lg mb-4 text-white">Select a Plan</h3>
            
            <div class="grid sm:grid-cols-2 gap-4 mb-6">
                <!-- Monthly Plan -->
                <div id="plan-1month" onclick="window.selectPlan('rc20', '1month', 250, '1 Month Plan')" 
                     class="plan-option cursor-pointer bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 hover:bg-slate-800/80 transition flex flex-col items-center text-center gap-1 group">
                    <div class="font-bold text-slate-200">1 Month</div>
                    <div class="text-2xl font-bold text-blue-400">₹250</div>
                </div>

                <!-- Lifetime Plan -->
                <div id="plan-lifetime" onclick="window.selectPlan('rc20', 'lifetime', 1500, 'Lifetime Plan')" 
                     class="plan-option cursor-pointer bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-purple-500 hover:bg-slate-800/80 transition flex flex-col items-center text-center gap-1 group relative overflow-hidden">
                    <div class="absolute top-0 right-0 bg-purple-600 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg text-white">VIP</div>
                    <div class="font-bold text-slate-200">Lifetime</div>
                    <div class="text-2xl font-bold text-purple-400">₹1500</div>
                </div>
            </div>

            <!-- Add to Cart Button -->
            <button id="add-to-cart-btn" onclick="window.addToCart()" disabled
               class="w-full py-4 bg-slate-700 text-slate-400 rounded-xl font-bold text-lg cursor-not-allowed transition flex items-center justify-center gap-2">
               Select a Plan First
            </button>
        </div>
      </div>

      <!-- Features List (Old Style) -->
      <div class="app-card p-6 rounded-2xl mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h3 class="text-xl font-bold mb-4">Mod Features</h3>
        <ul class="space-y-3 text-slate-600 dark:text-slate-300">
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Auto Play (Perfect Timing)</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlimited Coins & Tickets</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Unlock All Tournaments</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Custom Jerseys & Bats</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Anti-Ban Protection System</span></li>
        </ul>
      </div>
    </div>
    `;
}

// Ye line zaroori hai taaki Router isse padh sake
window.Rc20Page = Rc20Page;
