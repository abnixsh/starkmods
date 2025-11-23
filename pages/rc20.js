function Rc20Page() {
    // Reset selection when page loads
    window.selectedPlan = null;

    return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-20">
      
      <!-- Back Nav -->
      <div class="mb-6">
        <a href="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium" data-link>
          <span class="material-icons text-sm">arrow_back</span> Back to Mods
        </a>
      </div>

      <div class="grid lg:grid-cols-12 gap-8">
          
          <!-- LEFT: Images & Info (Cols 7) -->
          <div class="lg:col-span-7 space-y-6">
              
              <!-- Header -->
              <div class="flex items-center gap-4">
                 <img src="assets/icons/icon_rc20.jpg" class="w-20 h-20 rounded-2xl shadow-lg" alt="RC20">
                 <div>
                     <h1 class="text-3xl font-bold">RC20 Mod Menu</h1>
                     <div class="flex gap-2 mt-2">
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">v2.5</span>
                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">Safe</span>
                     </div>
                 </div>
              </div>

              <!-- Screenshots Slider -->
              <div class="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-black aspect-video relative group">
                  <img src="assets/img/img_rc20_1.jpg" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition">
                  <div class="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">Gameplay Preview</div>
              </div>

              <!-- Features -->
              <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <h3 class="font-bold text-lg mb-4">Mod Features</h3>
                <div class="grid sm:grid-cols-2 gap-3">
                    <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><span class="material-icons text-green-500 text-sm">check_circle</span> Auto Play Mode</div>
                    <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><span class="material-icons text-green-500 text-sm">check_circle</span> Unlimited Coins</div>
                    <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><span class="material-icons text-green-500 text-sm">check_circle</span> All Tournaments</div>
                    <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><span class="material-icons text-green-500 text-sm">check_circle</span> Anti-Ban System</div>
                </div>
              </div>
          </div>

          <!-- RIGHT: Selection & Cart (Cols 5) -->
          <div class="lg:col-span-5">
              <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 sticky top-24 shadow-xl">
                
                <h3 class="text-xl font-bold mb-2">Select Plan</h3>
                <p class="text-sm text-slate-500 mb-6">Choose a subscription to continue.</p>

                <!-- Plan Options -->
                <div class="space-y-3 mb-8">
                    
                    <!-- Option 1: Monthly -->
                    <div id="plan-1month" onclick="window.selectPlan('rc20', '1month', 250, '1 Month Plan')" 
                         class="plan-option cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-400 transition flex justify-between items-center group">
                        <div class="flex items-center gap-3">
                            <div class="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center">
                                <div class="w-2.5 h-2.5 rounded-full bg-blue-600 hidden group-[.ring-2]:block"></div>
                            </div>
                            <div>
                                <div class="font-bold">1 Month Access</div>
                                <div class="text-xs text-slate-500">Billed monthly</div>
                            </div>
                        </div>
                        <div class="font-bold text-lg">₹250</div>
                    </div>

                    <!-- Option 2: Lifetime -->
                    <div id="plan-lifetime" onclick="window.selectPlan('rc20', 'lifetime', 1500, 'Lifetime Plan')" 
                         class="plan-option cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-purple-400 transition flex justify-between items-center group relative overflow-hidden">
                        <div class="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">BEST VALUE</div>
                        <div class="flex items-center gap-3">
                             <div class="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-purple-500 flex items-center justify-center">
                                <div class="w-2.5 h-2.5 rounded-full bg-blue-600 hidden group-[.ring-2]:block"></div>
                            </div>
                            <div>
                                <div class="font-bold">Lifetime Access</div>
                                <div class="text-xs text-slate-500">One-time payment</div>
                            </div>
                        </div>
                        <div class="font-bold text-lg">₹1500</div>
                    </div>

                </div>

                <!-- Add to Cart Button (Disabled by default) -->
                <button id="add-to-cart-btn" onclick="window.addToCart()" disabled
                    class="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg opacity-50 cursor-not-allowed transition hover:scale-[1.02] flex items-center justify-center gap-2">
                    Select a Plan
                </button>
                
                <p class="text-center text-xs text-slate-400 mt-4">
                    <span class="material-icons text-[14px] align-middle">lock</span> Secure Checkout via Telegram
                </p>

              </div>
          </div>

      </div>
    </div>
    `;
}
