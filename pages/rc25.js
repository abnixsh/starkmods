function Rc25Page() {
    return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      
      <!-- Back Button -->
      <div class="mb-6">
        <a href="/" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium" data-link>
          <span class="material-icons text-sm">arrow_back</span> Back to Home
        </a>
      </div>

      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
         <img src="assets/icons/icon_rc25.jpg" class="w-20 h-20 rounded-2xl shadow-lg" onerror="this.src='https://placehold.co/80?text=RC25'">
         <div>
             <h1 class="text-3xl font-bold">RC25 V7 Patch</h1>
             <div class="flex gap-2 mt-2">
                <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold rounded">New Release</span>
                <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">Free</span>
                  <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold rounded">V7</span>
             </div>
         </div>
      </div>

      <!-- SCREENSHOTS -->
      <div class="app-card p-4 rounded-2xl mb-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
         <h3 class="font-bold text-lg mb-4 px-2">Gameplay Screenshots</h3>
         <div class="screenshot-carousel rounded-xl overflow-hidden shadow-lg aspect-video relative bg-black">
              <img src="assets/img/img_rc25_1.jpg" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/600x400?text=RC25+Gameplay'" />
         </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
          
          <!-- Features -->
          <div class="app-card p-6 rounded-2xl">
            <h3 class="text-xl font-bold mb-4">Mod Features</h3>
            <ul class="space-y-3 text-slate-600 dark:text-slate-300">
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Latest Jerseys of All teams</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Updated Sounds</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Updated Stadiums</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>All teams squads updated</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>New Shots</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>New Bowling Actions</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>New Teams (The Hundred)</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>All bugs fixed</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Ai Enhanced</span></li>
               <li class="flex items-start gap-3"><span class="material-icons text-green-500 mt-1">check_circle</span><span>Updated Tournaments</span></li>
            </ul>
          </div>

          <!-- DOWNLOAD SECTION (Free) -->
          <div class="app-card p-6 rounded-2xl flex flex-col justify-between bg-slate-900 text-white shadow-xl">
            <div>
                <h3 class="text-xl font-bold mb-2 text-white">Free Download</h3>
                <p class="text-slate-400 text-sm mb-6">
                    This mod is completely free. Click below to download directly.
                </p>
            </div>
            
            <div class="space-y-3">
                <a href="https://dupload.net/o9cxh6xht397" target="_blank" class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    <span class="material-icons">download</span> Download APK
                </a>
                <p class="text-center text-xs text-slate-500 mt-2">
                    File Size: 700+ MB | Version: v7+
                </p>
            </div>
          </div>
      </div>
    </div>
    `;
}

// Router ke liye
window.Rc25Page = Rc25Page;
