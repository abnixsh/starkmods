// pages/wcc3.js
function Wcc3Page() {
    return `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <a href="/" class="flex items-center gap-2 text-blue-600 hover:underline" data-link>
          <span class="material-icons text-sm">arrow_back</span> Back to Home
        </a>
      </div>

      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold mb-4">Wcc3 VIP Mod</h1>
        <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Dominate the cricket field with Stark Mods. Unlock every feature and play like a pro.
        </p>
      </div>

      <div class="app-card p-6 rounded-2xl mb-8 bg-slate-900 text-white">
        <div class="flex flex-col md:flex-row items-center gap-6">
           <img src="assets/icons/icon_wcc3.png" class="w-24 h-24 rounded-2xl shadow-lg" alt="WCC3 Logo">
           <div class="flex-1 text-center md:text-left">
             <h2 class="text-2xl font-bold">WCC3 Ultimate</h2>
             <div class="text-slate-400 mb-3">com.netwave.wcc3</div>
             <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
               <span class="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">Version 3.2.3</span>
               <span class="px-3 py-1 rounded-full bg-green-900 text-green-400 border border-green-800 text-xs">Undetected</span>
             </div>
           </div>
        </div>

        <div class="grid gap-3 mt-6">
           <button onclick="window.router.navigateTo('/plans')" class="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold flex items-center justify-center gap-2 transition">
              <span class="material-icons">diamond</span> Get Premium Access
           </button>
        </div>
      </div>

      <div class="app-card p-6 rounded-2xl mb-8">
        <h3 class="text-xl font-bold mb-4">Mod Features</h3>
        <ul class="space-y-3 text-slate-600 dark:text-slate-300">
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check</span><span>Auto Play (Perfect Timing)</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check</span><span>Unlimited Coins & Tickets</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check</span><span>Unlock All Tournaments</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check</span><span>Custom Jerseys & Bats</span></li>
           <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check</span><span>Anti-Ban Protection System</span></li>
        </ul>
      </div>
    </div>
    `;
}
