function Rc20Page() {
    // Selection reset
    window.selectedPlan = null;

    return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-20">
      
      <div class="mb-6">
        <a href="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium" data-link>
          <span class="material-icons text-sm">arrow_back</span> Back to Mods
        </a>
      </div>

      <div class="grid lg:grid-cols-12 gap-8">
          
          <!-- LEFT SIDE -->
          <div class="lg:col-span-7 space-y-6">
              <div class="flex items-center gap-4">
                 <img src="assets/icons/icon_rc20.jpg" class="w-20 h-20 rounded-2xl shadow-lg" onerror="this.src='https://placehold.co/80?text=RC20'">
                 <div>
                     <h1 class="text-3xl font-bold">RC20 Mod Menu</h1>
                     <div class="flex gap-2 mt-2">
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">v2.5</span>
                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">Safe</span>
                     </div>
                 </div>
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

          <!-- RIGHT SIDE (Selection) -->
          <div class="lg:col-span-5">
              <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 sticky top-24 shadow-xl">
                
                <h3 class="text-xl font-bold mb-2">Select Plan</h3>
                <p class="text-sm text-slate-500 mb-6">Choose a subscription.</p>

                <div class="space-y-3 mb-8">
                    <!-- Plan 1 -->
                    <div id="plan-1month" onclick="window.selectPlan('rc20', '1month', 250, '1 Month Plan')" 
                         class="plan-option cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-400 transition flex justify-between items-center">
                        <div class="font-bold">1 Month Access</div>
                        <div class="font-bold text-lg">₹250</div>
                    </div>

                    <!-- Plan 2 -->
                    <div id="plan-lifetime" onclick="window.selectPlan('rc20', 'lifetime', 1500, 'Lifetime Plan')" 
                         class="plan-option cursor-pointer border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-purple-400 transition flex justify-between items-center bg-purple-50 dark:bg-purple-900/10">
                        <div class="font-bold">Lifetime Access</div>
                        <div class="font-bold text-lg">₹1500</div>
                    </div>
                </div>

                <button id="add-to-cart-btn" onclick="window.addToCart()" disabled
                    class="w-full py-4 bg-slate-300 dark:bg-slate-700 text-white rounded-xl font-bold text-lg cursor-not-allowed transition flex items-center justify-center gap-2">
                    Select a Plan First
                </button>

              </div>
          </div>

      </div>
    </div>
    `;
}

// IMPORTANT FIX: Ye line add karo taaki Router isse dhoondh paye
window.Rc20Page = Rc20Page;
