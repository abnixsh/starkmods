// pages/creator.js

/* =========================================
   1. CONFIGURATION & DATA
   ========================================= */

const CREATOR_PLANS = {
  P100: { code: 'P100', name: 'Starter', priceINR: 100, maxRequests: 20, periodDays: 30 },
  P300: { code: 'P300', name: 'Pro', priceINR: 300, maxRequests: 70, periodDays: 30 },
  P1000: { code: 'P1000', name: 'Elite', priceINR: 1000, maxRequests: null, periodDays: 60 }
};

const JERSEY_TESTER_LINK = 'https://www.mediafire.com/'; 

const BOWLING_ACTIONS = {
  fast: ['Shaheen Afridi', 'Adam Milne', 'Mark Wood', 'Pat Cummins', 'Haris Rauf', 'Mitchell Starc', 'Jasprit Bumrah', 'Jofra Archer', 'Kagiso Rabada', 'Lasith Malinga'],
  medium: ['Arshdeep Singh', 'Hardik Pandya', 'Paul Collingwood', 'Bhuvneshwar Kumar', 'Shane Watson'],
  spin: ['Glenn Maxwell', 'Ravindra Jadeja', 'Axar Patel', 'Keshav Maharaj', 'Maheesh Theekshana', 'Shadab Khan', 'Kuldeep Yadav', 'Ish Sodhi', 'Yuzvendra Chahal', 'Wanindu Hasaranga', 'Shane Warne', 'Adam Zampa']
};

const TEAMS_DATA = {
  International: ["India", "Australia", "England", "West Indies", "Pakistan", "New Zealand", "Sri Lanka", "South Africa", "Bangladesh", "Afghanistan", "Scotland", "Namibia", "Netherlands", "PNG", "UAE", "USA", "Japan"],
  Masters: ["India Legends", "Australia Legends", "England Legends", "Zimbabwe Legends", "Pakistan Legends", "NZ Legends", "West Indies Legends", "South Africa Legends"],
  Leagues: {
    IPL: ["CSK", "Mumbai Indians", "RCB", "KKR", "SRH", "Rajasthan Royals", "Delhi Capitals", "Punjab Kings", "Lucknow Super Giants", "Gujarat Titans"],
    PSL: ["Islamabad United", "Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Quetta Gladiators"],
    BBL: ["Adelaide Strikers", "Brisbane Heat", "Hobart Hurricanes", "Melbourne Renegades", "Melbourne Stars", "Perth Scorchers", "Sydney Sixers", "Sydney Thunder"],
    BPL: ["Comilla Victorians", "Rangpur Riders", "Sylhet Strikers", "Fortune Barishal", "Dhaka Dominators", "Chattogram Challengers", "Khulna Tigers"],
    CPL: ["Barbados Royals", "Guyana Amazon Warriors", "Jamaica Tallawahs", "St Kitts & Nevis Patriots", "Saint Lucia Kings", "Trinbago Knight Riders"],
    SA20: ["Durban's Super Giants", "Joburg Super Kings", "MI Cape Town", "Paarl Royals", "Pretoria Capitals", "Sunrisers Eastern Cape"],
    ILT20: ["Abu Dhabi Knight Riders", "Desert Vipers", "Dubai Capitals", "Gulf Giants", "MI Emirates", "Sharjah Warriors"],
    MLC: ["L.A. Knight Riders", "MI New York", "San Francisco Unicorns", "Seattle Orcas", "Texas Super Kings", "Washington Freedom"],
    TheHundred: ["Birmingham Phoenix", "London Spirit", "Manchester Originals", "Northern Superchargers", "Oval Invincibles", "Southern Brave", "Trent Rockets", "Welsh Fire"],
    IFL: ["India Invincibles", "Australia Avengers", "England Eagles", "NewZeland Nightmares", "Pakistan Panthers", "South Africa SuperNovas", "WestIndies Warriors"]
  }
};

// --- GLOBAL STATE ---
window.creatorSub = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.teamBuilder = null;
window.tempCustomFaceBase64 = null;

function resetTeamBuilder() {
  window.teamBuilder = { 
      mode: 'new', 
      teamName: '', 
      teamShortName: '', 
      players: [] 
  };
}

/* =========================================
   2. MAIN ROUTER & MENU
   ========================================= */

function CreatorPage() {
  const path = window.location.pathname;
  if (path === '/creator-player') return CreatorPlayerPage();
  if (path === '/creator-jersey') return CreatorJerseyPage();
  if (path === '/creator-team')   return CreatorTeamPage();
  if (path === '/creator-history') return CreatorHistoryPage();
  if (path === '/creator-plans')  return CreatorPlansPage();
  return CreatorMenuUI();
}

function CreatorMenuUI() {
  if (!window.currentUser) {
    return `
      <div class="max-w-4xl mx-auto py-24 text-center animate-fade-in px-4">
        <div class="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
          <span class="material-icons text-5xl text-blue-600 dark:text-blue-400">build_circle</span>
        </div>
        <h1 class="text-3xl font-black mb-3 text-slate-900 dark:text-white">Login Required</h1>
        <button onclick="window.googleLogin()" class="btn px-8 py-3 shadow-lg hover:scale-105 transition transform">Login with Google</button>
      </div>`;
  }

  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-2">Mod Creator</h1>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Design Players, Jerseys & Teams.</p>
        </div>
        <button onclick="window.router.navigateTo('/creator-history')" class="px-5 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md font-bold text-sm shadow-sm flex items-center gap-2">
          <span class="material-icons text-sm">history</span> History
        </button>
      </div>

      <div id="creator-sub-status" class="app-card p-6 mb-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <div class="flex items-center gap-3"><div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div> Loading...</div>
      </div>

      <div class="grid sm:grid-cols-3 gap-6">
        <button class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden" onclick="window.router.navigateTo('/creator-player')">
          <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 shadow-sm"><span class="material-icons text-3xl">person</span></div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Player</div>
          <p class="text-xs text-slate-500 dark:text-slate-400">Attributes, Faces & Actions.</p>
        </button>

        <button id="btn-feature-jersey" class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden" onclick="window.goToCreatorJersey()">
          <div class="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400 shadow-sm"><span class="material-icons text-3xl">checkroom</span></div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Jersey</div>
          <p class="text-xs text-slate-500 dark:text-slate-400">Upload textures for any team.</p>
          <div class="feature-lock-overlay hidden absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl cursor-not-allowed">
             <span class="bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><span class="material-icons text-xs">lock</span> Locked</span>
          </div>
        </button>

        <button id="btn-feature-team" class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden" onclick="window.goToCreatorTeam()">
          <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 shadow-sm"><span class="material-icons text-3xl">groups</span></div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Team</div>
          <p class="text-xs text-slate-500 dark:text-slate-400">Build full squads (Pro/Elite).</p>
          <div class="feature-lock-overlay hidden absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl cursor-not-allowed">
             <span class="bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1"><span class="material-icons text-xs">lock</span> Pro Only</span>
          </div>
        </button>
      </div>
    </div>`;
}

/* =========================================
   3. UI HELPER FUNCTIONS
   ========================================= */

// --- Team Selector (Collapsible) ---
function renderTeamSelectorHTML(idPrefix) {
  const categories = Object.keys(TEAMS_DATA);
  let dropdownContent = '';
  
  categories.forEach(cat => {
      if(Array.isArray(TEAMS_DATA[cat])) {
          dropdownContent += `
            <div class="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase text-slate-500 sticky top-0">${cat}</div>
                ${TEAMS_DATA[cat].map(t => `<div onclick="window.selectTeam('${idPrefix}', '${t}')" class="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition">${t}</div>`).join('')}
            </div>`;
      } else {
          Object.keys(TEAMS_DATA[cat]).forEach(subCat => {
              dropdownContent += `
                <div class="border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase text-slate-500 sticky top-0">${subCat}</div>
                    ${TEAMS_DATA[cat][subCat].map(t => `<div onclick="window.selectTeam('${idPrefix}', '${t}')" class="px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition">${t}</div>`).join('')}
                </div>`;
          });
      }
  });

  return `
    <div class="relative group">
      <input id="${idPrefix}-team" type="text" readonly placeholder="Select Team" 
             class="form-input w-full cursor-pointer bg-white/50 dark:bg-black/20"
             onclick="document.getElementById('${idPrefix}-team-dropdown').classList.toggle('hidden')">
      <span class="material-icons absolute right-3 top-3 text-slate-400 pointer-events-none">arrow_drop_down</span>
      <div id="${idPrefix}-team-dropdown" class="hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 mt-2 max-h-60 overflow-y-auto">
        ${dropdownContent}
      </div>
    </div>`;
}

window.selectTeam = function(prefix, team) {
  document.getElementById(`${prefix}-team`).value = team;
  document.getElementById(`${prefix}-team-dropdown`).classList.add('hidden');
};

// --- Face Selector (Visual + Mobile Friendly) ---
function renderFaceSelectorHTML(idPrefix) {
  return `
    <div class="bg-white/50 dark:bg-black/20 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-2 mb-3">
         <label class="text-[10px] font-bold text-slate-500 uppercase flex-1">Face Type</label>
         <div class="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
            <button type="button" onclick="window.switchFaceTab('${idPrefix}', 'preset')" id="${idPrefix}-btn-preset" class="px-4 py-1.5 text-[10px] font-bold rounded-md bg-white dark:bg-slate-600 shadow-sm transition">Preset</button>
            <button type="button" onclick="window.switchFaceTab('${idPrefix}', 'custom')" id="${idPrefix}-btn-custom" class="px-4 py-1.5 text-[10px] font-bold rounded-md text-slate-500 transition">Custom</button>
         </div>
      </div>

      <div id="${idPrefix}-view-preset">
         <input id="${idPrefix}-face-display" type="text" readonly placeholder="Select Below" class="form-input w-full text-xs mb-3 cursor-not-allowed opacity-70">
         <div class="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            ${Array.from({length: 80}, (_, i) => i + 1).map(i => `
               <div onclick="window.selectFace('${idPrefix}', ${i})" class="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden transition bg-slate-100 dark:bg-slate-800">
                  <img src="assets/faces/face_${i}.png" class="w-full aspect-square object-cover" onerror="this.src='https://placehold.co/50?text=${i}'">
               </div>
            `).join('')}
         </div>
      </div>

      <div id="${idPrefix}-view-custom" class="hidden text-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
         <label for="${idPrefix}-face-file" class="cursor-pointer block">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600">
               <span class="material-icons">cloud_upload</span>
            </div>
            <span class="text-xs font-bold text-blue-500 underline">Tap to Upload Photo</span>
         </label>
         <input id="${idPrefix}-face-file" type="file" accept="image/*" class="hidden" onchange="window.handleCustomFaceUpload('${idPrefix}', this)">
         <div id="${idPrefix}-custom-preview" class="text-[10px] text-slate-500 mt-2 font-mono truncate px-2">No file selected</div>
      </div>
    </div>`;
}

window.switchFaceTab = function(prefix, tab) {
    const presetBtn = document.getElementById(`${prefix}-btn-preset`);
    const customBtn = document.getElementById(`${prefix}-btn-custom`);
    const presetView = document.getElementById(`${prefix}-view-preset`);
    const customView = document.getElementById(`${prefix}-view-custom`);
    const displayInput = document.getElementById(`${prefix}-face-display`);

    if(tab === 'preset') {
        presetBtn.classList.add('bg-white', 'dark:bg-slate-600', 'shadow-sm', 'text-black', 'dark:text-white');
        presetBtn.classList.remove('text-slate-500');
        customBtn.classList.remove('bg-white', 'dark:bg-slate-600', 'shadow-sm', 'text-black', 'dark:text-white');
        customBtn.classList.add('text-slate-500');
        
        presetView.classList.remove('hidden');
        customView.classList.add('hidden');
        displayInput.dataset.isCustom = "false";
    } else {
        customBtn.classList.add('bg-white', 'dark:bg-slate-600', 'shadow-sm', 'text-black', 'dark:text-white');
        customBtn.classList.remove('text-slate-500');
        presetBtn.classList.remove('bg-white', 'dark:bg-slate-600', 'shadow-sm', 'text-black', 'dark:text-white');
        presetBtn.classList.add('text-slate-500');
        
        customView.classList.remove('hidden');
        presetView.classList.add('hidden');
        displayInput.dataset.isCustom = "true";
        displayInput.value = "Custom Upload"; 
    }
};

window.selectFace = function(prefix, id) {
    const disp = document.getElementById(`${prefix}-face-display`);
    disp.value = `ID: ${id}`;
    disp.dataset.faceId = id; 
};

window.handleCustomFaceUpload = async function(prefix, input) {
    const preview = document.getElementById(`${prefix}-custom-preview`);
    if(input.files && input.files[0]) {
        try {
            preview.innerText = "Processing...";
            const b64 = await readFileAsBase64(input.files[0]);
            preview.innerText = input.files[0].name;
            
            if(prefix === 'cp') window.tempCustomFaceBase64 = b64; 
            else input.dataset.tempB64 = b64; 
            
            document.getElementById(`${prefix}-face-display`).value = "Custom Upload";
            
        } catch(e) {
            alert("Upload failed: " + e.message);
            preview.innerText = "Error";
        }
    }
};

/* =========================================
   4. CUSTOM PLAYER PAGE
   ========================================= */

function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'rc25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `
    <button onclick="window.setPlayerGame('${id}')" class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${g === id ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}">
      ${label}
    </button>`;

  const slider = (id, label, color) => `
    <div class="mb-4">
      <div class="flex justify-between mb-2"><label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">${label}</label><span id="val-${id}" class="text-[10px] font-bold text-${color}-500 bg-${color}-100 dark:bg-${color}-900 px-2 py-0.5 rounded">50</span></div>
      <input id="${id}" type="range" min="1" max="100" value="50" oninput="document.getElementById('val-${id}').innerText = this.value" class="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-${color}-500">
    </div>`;

  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Custom Player</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600 bg-white/50 px-3 py-2 rounded-lg">Back</button>
      </div>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">${gameBtn('rc25', 'RC25')}${gameBtn('rc24', 'RC24')}${gameBtn('rcswipe', 'RC Swipe')}</div>

      <div class="app-card p-6 sm:p-8">
        <form onsubmit="window.submitCustomPlayer(event)" class="space-y-6">
          <div class="grid sm:grid-cols-2 gap-5">
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Team</label>${renderTeamSelectorHTML('cp')}</div>
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Player Name</label><input id="cp-name" type="text" class="form-input w-full" placeholder="Enter Name"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                  <label class="block text-xs font-bold mb-2 text-blue-600 uppercase">Role</label>
                  <select id="cp-type" class="form-input w-full font-bold h-12" onchange="window.updateBowlingOptions('cp')">
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="all-rounder">All Rounder</option>
                    <option value="keeper">Wicket Keeper</option>
                  </select>
                  
                  <div class="mt-6">
                     <label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Hands</label>
                     <div class="flex gap-3">
                        <select id="cp-bat-hand" class="form-input w-full text-xs h-10"><option value="right">Bat Right</option><option value="left">Bat Left</option></select>
                        <select id="cp-bowl-hand" class="form-input w-full text-xs h-10"><option value="right">Bowl Right</option><option value="left">Bowl Left</option></select>
                     </div>
                  </div>
              </div>
              <div>
                  <label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Face</label>
                  ${renderFaceSelectorHTML('cp')}
              </div>
          </div>

          <div class="bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-md">
              <h3 class="text-xs font-black uppercase text-blue-500 mb-4 flex items-center gap-1"><span class="material-icons text-sm">sports_cricket</span> Batting Skill</h3>
              <div class="mb-4"><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Style</label><select id="cp-bat-type" class="form-input w-full text-xs font-bold"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select></div>
              ${slider('cp-timing', 'Timing', 'blue')}${slider('cp-aggression', 'Aggression', 'red')}${slider('cp-technique', 'Technique', 'purple')}
          </div>

          <div id="cp-bowling-section" class="hidden bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-md">
              <h3 class="text-xs font-black uppercase text-green-500 mb-4 flex items-center gap-1"><span class="material-icons text-sm">sports_baseball</span> Bowling Skill</h3>
              <div class="grid grid-cols-2 gap-4 mb-4">
                  <div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Style</label><select id="cp-bowl-type" class="form-input w-full text-xs" onchange="window.updateBowlingActions('cp')"><option value="fast">Fast</option><option value="medium">Medium</option><option value="spin">Spin</option></select></div>
                  <div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Action</label><select id="cp-bowl-action" class="form-input w-full text-xs font-bold text-slate-700 dark:text-white"></select></div>
              </div>
              ${slider('cp-bowl-move', 'Movement', 'green')}${slider('cp-bowl-skill', 'Accuracy', 'orange')}
          </div>

          <div><label class="block text-[10px] font-bold mb-1 text-slate-400 uppercase">Jersey Number</label><input id="cp-jersey" type="number" class="form-input w-full text-xs h-10" placeholder="18"></div>
          <button type="submit" class="btn w-full py-4 shadow-lg text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">Submit Request</button>
        </form>
      </div>
    </div>`;
}

/* =========================================
   5. CUSTOM TEAM PAGE (FIXED)
   ========================================= */

function CreatorTeamPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  if (!window.teamBuilder) resetTeamBuilder();
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const sliderCompact = (id, label, color) => `
    <div class="mb-3">
       <div class="flex justify-between mb-1"><span class="text-[9px] font-bold w-12 text-slate-500 uppercase">${label}</span> <span id="val-${id}" class="text-[9px] font-bold text-${color}-600">70</span></div>
       <input id="${id}" type="range" min="1" max="100" value="70" oninput="document.getElementById('val-${id}').innerText = this.value" class="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-${color}-500">
    </div>`;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Team Builder</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600 bg-white/50 px-3 py-2 rounded-lg">Back</button>
      </div>

      <div class="app-card p-6 mb-6">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Step 1: Details</h2>
        <div class="grid sm:grid-cols-2 gap-5 mb-4">
           <div><label class="block text-xs font-bold mb-2 text-slate-500">Team Name</label><input id="ct-team-name" type="text" class="form-input w-full" placeholder="e.g. Stark XI"></div>
           <div><label class="block text-xs font-bold mb-2 text-slate-500">Short Name</label><input id="ct-team-short" type="text" maxlength="3" class="form-input w-full uppercase" placeholder="STK"></div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="block text-xs font-bold mb-2 text-slate-500">Jersey</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full"></div>
          <div><label class="block text-xs font-bold mb-2 text-slate-500">Logo</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full"></div>
        </div>
      </div>

      <div class="app-card p-6 mb-8">
        <div class="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
             <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400">Step 2: Squad</h2>
             <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 px-2 py-1 rounded font-bold" id="squad-count">0/15</span>
        </div>
        
        <div class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
             <div class="col-span-2 sm:col-span-1"><input id="tp-name" type="text" class="form-input w-full text-xs font-bold h-10" placeholder="Player Name *"></div>
             <div><input id="tp-jersey" type="number" class="form-input w-full text-xs h-10" placeholder="No."></div>
             <div class="col-span-2 sm:col-span-1"><select id="tp-type" class="form-input w-full text-xs font-bold h-10" onchange="window.updateBowlingOptions('tp')"><option value="batsman">Batsman</option><option value="bowler">Bowler</option><option value="all-rounder">All-Rd</option><option value="keeper">Keeper</option></select></div>
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
              <select id="tp-bat-hand" class="form-input w-full text-xs h-9"><option value="right">Bat Right</option><option value="left">Bat Left</option></select>
              <select id="tp-bowl-hand" class="form-input w-full text-xs h-9"><option value="right">Bowl Right</option><option value="left">Bowl Left</option></select>
          </div>
          <div class="mb-4">
             <label class="text-[9px] font-bold uppercase text-slate-400 mb-1 block">Face</label>
             ${renderFaceSelectorHTML('tp')}
          </div>

          <div class="bg-white/70 dark:bg-black/40 p-4 rounded-xl border border-slate-200 dark:border-slate-600 mb-4">
             <div class="mb-3">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-black text-blue-600 uppercase">Batting</span>
                    <select id="tp-bat-type" class="text-[9px] bg-slate-200 dark:bg-slate-700 rounded px-2 py-1 font-bold border-0"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select>
                </div>
                ${sliderCompact('tp-timing', 'Time', 'blue')}
                ${sliderCompact('tp-aggression', 'Aggr', 'red')}
                ${sliderCompact('tp-technique', 'Tech', 'purple')}
             </div>
             
             <div id="tp-bowling-section" class="hidden pt-3 border-t border-slate-200 dark:border-slate-600">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-black text-green-600 uppercase">Bowling</span>
                    <div class="flex gap-1">
                        <select id="tp-bowl-type" class="text-[9px] bg-slate-200 dark:bg-slate-700 rounded px-1 py-1 w-12" onchange="window.updateBowlingActions('tp')"><option value="fast">Fast</option><option value="medium">Med</option><option value="spin">Spin</option></select>
                        <select id="tp-bowl-action" class="text-[9px] bg-slate-200 dark:bg-slate-700 rounded px-1 py-1 w-16"></select>
                    </div>
                </div>
                ${sliderCompact('tp-bowl-move', 'Move', 'green')}
                ${sliderCompact('tp-bowl-skill', 'Skill', 'orange')}
             </div>
          </div>

          <button type="button" onclick="window.addTeamPlayer()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 shadow-lg shadow-blue-500/20 active:scale-95 transition"><span class="material-icons text-sm">add_circle</span> Add Player to Squad</button>
        </div>

        <div id="ct-players-list" class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty.</div>
        </div>
      </div>

      <button onclick="window.submitCustomTeam()" class="btn w-full py-4 shadow-xl shadow-purple-500/20 text-sm font-black tracking-wide bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl">SUBMIT TEAM REQUEST</button>
    </div>`;
}

// ==========================================
// 6. JERSEY, HISTORY & PLANS
// ==========================================

function CreatorJerseyPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex items-center justify-between mb-6">
         <h1 class="text-2xl font-black text-slate-900 dark:text-white">Custom Jersey</h1>
         <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600 bg-white/50 px-3 py-2 rounded-lg">Back</button>
      </div>
      <div class="app-card p-6 sm:p-8">
        <form onsubmit="window.submitCustomJersey(event)" class="space-y-6">
          <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Team Name</label>${renderTeamSelectorHTML('cj')}</div>
          <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Jersey Texture (PNG)</label><input id="cj-file" type="file" accept="image/*" class="text-xs w-full"></div>
          <button type="submit" class="btn w-full py-4 shadow-lg text-sm bg-gradient-to-r from-green-600 to-green-700">Submit Jersey</button>
        </form>
      </div>
    </div>`;
}

function CreatorHistoryPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/'), 50); return ''; }
  if (window.historyUnsubscribe) window.historyUnsubscribe();
  
  setTimeout(() => {
    const container = document.getElementById('creator-history');
    if(!container) return;
    window.historyUnsubscribe = db.collection('modRequests').where('userId', '==', window.currentUser.uid).onSnapshot(snap => {
         if(snap.empty) { container.innerHTML = '<div class="text-center py-8 text-slate-400">No requests yet.</div>'; return; }
         const docs = []; snap.forEach(d => docs.push(d.data())); docs.sort((a,b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
         container.innerHTML = docs.map(r => {
            let status = r.status === 'approved' ? 'text-green-500' : r.status === 'rejected' ? 'text-red-500' : 'text-amber-500';
            return `<div class="app-card p-4 flex justify-between items-center"><div class="text-sm font-bold">${r.type === 'team' ? r.teamName : r.playerName || r.teamName}</div><div class="text-xs font-bold ${status}">${r.status === 'pending' ? 'Wait 24h' : r.status}</div></div>`;
         }).join('');
      });
  }, 100);
  return `<div class="max-w-4xl mx-auto animate-fade-in pb-24 px-4 pt-6"><h1 class="text-2xl font-black mb-6">History</h1><div id="creator-history" class="space-y-4"></div></div>`;
}

function CreatorPlansPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/'), 50); return ''; }
  const renderCard = (code) => {
      const p = CREATOR_PLANS[code];
      return `<div class="app-card p-6 flex flex-col hover:scale-105 transition"><h3 class="text-xl font-black">${p.name}</h3><div class="text-3xl font-black text-blue-600 mt-2 mb-6">₹${p.priceINR}</div><button onclick="window.buyCreatorPlan('${code}')" class="btn w-full py-3 text-sm">Select</button></div>`;
  };
  return `<div class="max-w-5xl mx-auto animate-fade-in pb-20 px-4 pt-6"><h1 class="text-3xl font-black text-center mb-10">Choose Plan</h1><div class="grid md:grid-cols-3 gap-6">${renderCard('P100')}${renderCard('P300')}${renderCard('P1000')}</div></div>`;
}

window.buyCreatorPlan = function(code) {
    const p = CREATOR_PLANS[code];
    window.cart = [{ gameId: `sub_${code}`, gameName: 'Creator Sub', planName: p.name, price: p.priceINR, image: 'assets/icons/icon_site.jpg', subPlanCode: code }];
    if(window.updateCartBadge) window.updateCartBadge();
    window.router.navigateTo('/checkout');
};

// ==========================================
// 8. LOGIC & SUBMISSION (BOT DATA FIXED)
// ==========================================

async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    if(!file) { reject(new Error("No file selected")); return; }
    if(file.size > 2 * 1024 * 1024) { reject(new Error("File too large (Max 2MB)")); return; }
    const reader = new FileReader();
    reader.onload = () => { if(reader.result) resolve(reader.result.split(',')[1]); else reject(new Error("Empty file")); };
    reader.onerror = () => reject(new Error("File error"));
    reader.readAsDataURL(file);
  });
}

window.updateBowlingOptions = function(prefix) {
    const role = document.getElementById(`${prefix}-type`).value;
    const section = document.getElementById(`${prefix}-bowling-section`);
    if(role === 'bowler' || role === 'all-rounder') {
        section.classList.remove('hidden'); if(prefix === 'tp') section.classList.add('block');
        window.updateBowlingActions(prefix);
    } else {
        section.classList.add('hidden'); if(prefix === 'tp') section.classList.remove('block');
    }
};

window.updateBowlingActions = function(prefix) {
    const style = document.getElementById(`${prefix}-bowl-type`).value;
    const select = document.getElementById(`${prefix}-bowl-action`);
    let key = style === 'fast' ? 'fast' : (style.includes('spin') ? 'spin' : 'medium');
    select.innerHTML = (BOWLING_ACTIONS[key]||[]).map(a => `<option value="${a}">${a}</option>`).join('');
};

// --- TEAM ADD PLAYER (FIXED) ---
window.addTeamPlayer = function () {
  if (!window.teamBuilder) resetTeamBuilder();
  if (window.teamBuilder.players.length >= 15) { alert('Squad full.'); return; }
  
  const role = document.getElementById('tp-type').value;
  const isBowler = role === 'bowler' || role === 'all-rounder';
  const name = document.getElementById('tp-name').value.trim();
  
  if (!name) { alert('Enter Player Name'); return; }

  // Face Validation
  const faceDisplay = document.getElementById('tp-face-display');
  const customFaceB64 = document.getElementById('tp-face-file').dataset.tempB64 || null;
  if (!faceDisplay.value && !customFaceB64) {
      alert("Please select a Face or Upload Custom Face.");
      return;
  }

  // OBJECT MAPPED TO SIMPLE KEYS FOR BOT COMPATIBILITY
  const p = {
      name: name,
      role: role,
      jersey: document.getElementById('tp-jersey').value || '0',
      face: faceDisplay.dataset.isCustom === "true" ? "Custom Upload" : (faceDisplay.dataset.faceId ? "Preset " + faceDisplay.dataset.faceId : "Random"),
      
      // Hands
      batHand: document.getElementById('tp-bat-hand').value,
      bowlHand: document.getElementById('tp-bowl-hand').value,
      
      // Batting
      batStyle: document.getElementById('tp-bat-type').value,
      batTiming: document.getElementById('tp-timing').value,
      batAggression: document.getElementById('tp-aggression').value,
      batTechnique: document.getElementById('tp-technique').value,
      
      // Bowling
      bowlStyle: isBowler ? document.getElementById('tp-bowl-type').value : 'None',
      bowlAction: isBowler ? document.getElementById('tp-bowl-action').value : 'None',
      bowlMovement: isBowler ? document.getElementById('tp-bowl-move').value : '0',
      bowlSkill: isBowler ? document.getElementById('tp-bowl-skill').value : '0'
  };
  
  if(customFaceB64) p.customFaceBase64 = customFaceB64;

  window.teamBuilder.players.push(p);
  
  // Clear inputs
  document.getElementById('tp-name').value = '';
  document.getElementById('tp-face-display').value = '';
  document.getElementById('tp-bowling-section').classList.add('hidden');
  
  window.renderTeamPlayersList();
};

window.renderTeamPlayersList = function () {
  const list = document.getElementById('ct-players-list');
  document.getElementById('squad-count').innerText = `${window.teamBuilder.players.length}/15`;
  
  list.innerHTML = window.teamBuilder.players.map((p, i) => `
      <div class="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs mb-1">
        <div>
           <span class="font-bold text-slate-800 dark:text-white">${i+1}. ${p.name}</span> 
           <span class="text-[10px] text-slate-500 uppercase ml-1">${p.role}</span>
           <div class="text-[9px] text-slate-400">Jer: ${p.jersey} | ${p.face}</div>
        </div>
        <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 font-bold px-2">X</button>
      </div>`).join('') || `<div class="text-center text-slate-400 text-xs py-4">Squad is empty.</div>`;
};
window.removeTeamPlayer = function(i) { window.teamBuilder.players.splice(i, 1); window.renderTeamPlayersList(); };

// --- GENERATE TEXT SUMMARY FOR BOT ---
function generateBotSummary(players) {
    return players.map((p, i) => 
        `${i+1}. ${p.name} (${p.role})\n` + 
        `   Jer: ${p.jersey} | ${p.face}\n` +
        `   Bat: ${p.batStyle} | ${p.batHand} | T:${p.batTiming}/A:${p.batAggression}/T:${p.batTechnique}\n` +
        (p.bowlStyle !== 'None' ? `   Bowl: ${p.bowlStyle} | ${p.bowlHand} | Act:${p.bowlAction} | M:${p.bowlMovement}/S:${p.bowlSkill}` : '   Bowling: N/A')
    ).join('\n\n');
}

// --- SUBMIT TEAM ---
window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    
    const tName = document.getElementById('ct-team-name').value.trim();
    if(!tName) { alert("Enter Team Name."); return; }
    if(!window.teamBuilder.players.length) { alert("Squad empty."); return; }
    
    try {
        const jFile = document.getElementById('ct-jersey-file').files[0]; 
        const lFile = document.getElementById('ct-logo-file').files[0];
        if(!jFile || !lFile) throw new Error("Upload Jersey & Logo.");
        
        const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]'); 
        if(btn) btn.disabled = true;
        
        const jB = await readFileAsBase64(jFile); 
        const lB = await readFileAsBase64(lFile);
        
        // Construct detailed text summary for the bot
        const squadText = generateBotSummary(window.teamBuilder.players);
        
        const data = {
            type: 'team', 
            userId: window.currentUser.uid, 
            email: window.currentUser.email, 
            userName: window.currentUser.displayName,
            teamName: tName,
            teamShortName: document.getElementById('ct-team-short').value,
            mode: 'new', 
            players: window.teamBuilder.players,
            squadSummary: squadText, // <--- THIS FIXES THE BOT UNDEFINED ISSUE
            createdAt: new Date().toISOString()
        };
        
        await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        await window.incrementCreatorUsage();
        try { await fetch('/api/custom-team', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ ...data, jerseyBase64: jB, logoBase64: lB }) }); } catch(err){}
        alert("✅ Request Sent!");
        window.router.navigateTo('/creator-history');
    } catch(e) { alert("Error: " + e.message); const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]'); if(btn) btn.disabled = false; }
};

window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  
  try {
      const faceDisplay = document.getElementById('cp-face-display');
      const isBowler = ['bowler', 'all-rounder'].includes(document.getElementById('cp-type').value);
      
      const p = {
          name: document.getElementById('cp-name').value,
          role: document.getElementById('cp-type').value,
          face: faceDisplay.dataset.isCustom === "true" ? "Custom Upload" : (faceDisplay.dataset.faceId ? "Preset " + faceDisplay.dataset.faceId : "Random"),
          jersey: document.getElementById('cp-jersey').value,
          batHand: document.getElementById('cp-bat-hand').value,
          bowlHand: document.getElementById('cp-bowl-hand').value,
          batStyle: document.getElementById('cp-bat-type').value,
          batTiming: document.getElementById('cp-timing').value,
          batAggression: document.getElementById('cp-aggression').value,
          batTechnique: document.getElementById('cp-technique').value,
          bowlStyle: isBowler ? document.getElementById('cp-bowl-type').value : 'None',
          bowlAction: isBowler ? document.getElementById('cp-bowl-action').value : 'None',
          bowlMovement: isBowler ? document.getElementById('cp-bowl-move').value : '0',
          bowlSkill: isBowler ? document.getElementById('cp-bowl-skill').value : '0'
      };

      const summary = `Player: ${p.name}\nRole: ${p.role}\nFace: ${p.face}\nJer: ${p.jersey}\nBat: ${p.batStyle} (${p.batHand})\nBowl: ${p.bowlStyle} (${p.bowlHand})\nStats: T-${p.batTiming} A-${p.batAggression} Tc-${p.batTechnique}`;

      const data = {
        type: 'player', 
        gameId: window.currentPlayerGame, 
        userId: window.currentUser.uid, 
        email: window.currentUser.email,
        userName: window.currentUser.displayName, 
        createdAt: new Date().toISOString(),
        teamName: document.getElementById('cp-team').value || "Custom", 
        playerName: p.name,
        playerDetails: p, // Flat object for bot
        playerSummary: summary, // Text block for bot
        customFaceBase64: faceDisplay.dataset.isCustom === "true" ? window.tempCustomFaceBase64 : null
      };

      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      try { await fetch('/api/custom-player', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }); } catch(err){}
      alert("✅ Request Sent!");
      window.router.navigateTo('/creator-history');
  } catch(e) { alert("Error: " + e.message); }
};

window.submitCustomJersey = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  try {
      const f = document.getElementById('cj-file').files[0]; if(!f) throw new Error("Select File");
      const b64 = await readFileAsBase64(f);
      const data = { type: 'jersey', gameId: window.currentJerseyGame, userId: window.currentUser.uid, email: window.currentUser.email, userName: window.currentUser.displayName, teamName: document.getElementById('cj-team').value, createdAt: new Date().toISOString() };
      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      try { await fetch('/api/custom-jersey', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...data, jerseyBase64: b64}) }); } catch(err){}
      alert("✅ Request Sent!");
      window.router.navigateTo('/creator-history');
  } catch(e) { alert("Error: " + e.message); }
};

// Utils & Subs
window.checkCreatorSubBeforeRequest = function() { if(!window.creatorSub || window.creatorSub.status !== 'active') { if(confirm("Plan Required.")) window.router.navigateTo('/creator-plans'); return false; } if(window.creatorSub.maxRequests && window.creatorSub.usedRequests >= window.creatorSub.maxRequests) { alert("Limit reached."); return false; } return true; };
window.checkCreatorSubForTeam = function() { if(!window.checkCreatorSubBeforeRequest()) return false; if(window.creatorSub.planCode === 'P100') { if(confirm("Upgrade to Pro?")) window.buyCreatorPlan('P300'); return false; } return true; };
window.loadCreatorSubscription = function() { if(!window.currentUser) return; db.collection('creatorSubs').doc(window.currentUser.uid).onSnapshot(snap => { window.creatorSub = snap.data(); const el = document.getElementById('creator-sub-status'); if(el && window.creatorSub) { el.innerHTML = `<div class="flex items-center gap-2"><span class="material-icons text-green-500">verified</span> <span class="font-bold text-slate-700 dark:text-white">${window.creatorSub.planCode} Plan</span> · ${window.creatorSub.usedRequests}/${window.creatorSub.maxRequests||'∞'} Requests</div>`; const jLock = document.querySelector('#btn-feature-jersey .feature-lock-overlay'); const tLock = document.querySelector('#btn-feature-team .feature-lock-overlay'); if(window.creatorSub.status === 'active') { if(jLock) jLock.classList.add('hidden'); } if(window.creatorSub.planCode !== 'P100') { if(tLock) tLock.classList.add('hidden'); } } }); };
window.incrementCreatorUsage = async function() { if(!window.currentUser) return; db.collection('creatorSubs').doc(window.currentUser.uid).update({ usedRequests: firebase.firestore.FieldValue.increment(1) }); };

window.goToCreatorJersey = function() { if(window.checkCreatorSubBeforeRequest()) window.router.navigateTo('/creator-jersey'); };
window.goToCreatorTeam = function() { if(window.checkCreatorSubForTeam()) window.router.navigateTo('/creator-team'); };
window.setPlayerGame = function(id) { window.currentPlayerGame = id; window.router.handleRoute('/creator-player'); };

// EXPORTS
window.CreatorPage = CreatorPage;
window.CreatorMenuUI = CreatorMenuUI;
window.CreatorPlayerPage = CreatorPlayerPage;
window.CreatorJerseyPage = CreatorJerseyPage;
window.CreatorTeamPage = CreatorTeamPage;
window.CreatorHistoryPage = CreatorHistoryPage;
window.CreatorPlansPage = CreatorPlansPage;
