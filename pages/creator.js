// pages/creator.js

/* =========================================
   1. CONFIGURATION & DATA
   ========================================= */

const CREATOR_PLANS = {
  P100: { code: 'P100', name: 'Starter', priceINR: 100, maxRequests: 20, periodDays: 30 },
  P300: { code: 'P300', name: 'Pro', priceINR: 300, maxRequests: 70, periodDays: 30 },
  P1000: { code: 'P1000', name: 'Elite', priceINR: 1000, maxRequests: null, periodDays: 60 }
};

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
window.teamBuilder = { mode: 'new', teamName: '', players: [] };
window.tempCustomFaceBase64 = null;

function resetTeamBuilder() {
  window.teamBuilder = { mode: 'new', teamName: '', players: [] };
}

/* =========================================
   2. HELPER FUNCTIONS (TEXT GENERATOR)
   ========================================= */

// This function creates the EXACT text for the bot
function generateBotSummary(p, index) {
    // Basic Info
    let txt = `${index}) ${p.name} (${p.role})\n` +
              `Jersey No- ${p.jersey}\n` +
              `Batting hand - ${p.batHand}\n` +
              `Bowling hand - ${p.bowlHand}\n` +
              `face - ${p.face}\n`;

    // Batting Skills
    txt += `Type - ${p.batStyle}\n` +
           `Timing - ${p.batTiming}\n` +
           `Technique - ${p.batTechnique}\n` +
           `Aggression - ${p.batAggression}`;

    // Bowling Skills (Only if relevant)
    if (p.role === 'Bowler' || p.role === 'All-Rounder') {
        txt += `\nAction - ${p.bowlAction}\n` +
               `Skill - ${p.bowlSkill}\n` +
               `Movement - ${p.bowlMovement}\n` +
               `Type - ${p.bowlStyle}`;
    }
    
    return txt;
}

window.readFileAsBase64 = function(file) {
  return new Promise((resolve, reject) => {
    if(!file) { reject(new Error("No file selected")); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
};

/* =========================================
   3. ROUTER & MENU
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
  if (!window.currentUser) return `<div class="p-10 text-center"><h1 class="text-2xl font-bold">Login Required</h1><button onclick="window.googleLogin()" class="btn mt-4">Login</button></div>`;
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">Mod Creator</h1>
        <button onclick="window.router.navigateTo('/creator-history')" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-bold text-xs">History</button>
      </div>
      <div id="creator-sub-status" class="mb-6"></div>
      <div class="grid sm:grid-cols-3 gap-6">
        <button class="app-card p-6 text-left hover:scale-[1.02] transition" onclick="window.router.navigateTo('/creator-player')">
           <div class="text-4xl mb-2">👤</div><div class="font-bold text-lg">Custom Player</div><div class="text-xs text-slate-500">Create single player</div>
        </button>
        <button class="app-card p-6 text-left hover:scale-[1.02] transition" onclick="window.goToCreatorTeam()">
           <div class="text-4xl mb-2">👥</div><div class="font-bold text-lg">Custom Team</div><div class="text-xs text-slate-500">Build full squads</div>
        </button>
        <button class="app-card p-6 text-left hover:scale-[1.02] transition" onclick="window.goToCreatorJersey()">
           <div class="text-4xl mb-2">👕</div><div class="font-bold text-lg">Custom Jersey</div><div class="text-xs text-slate-500">Upload textures</div>
        </button>
      </div>
    </div>`;
}

/* =========================================
   4. UI HELPERS
   ========================================= */

function renderTeamSelectorHTML(idPrefix) {
  const categories = Object.keys(TEAMS_DATA);
  let content = categories.map(cat => {
      if(Array.isArray(TEAMS_DATA[cat])) {
          return `<div class="border-b border-slate-100 dark:border-slate-700 last:border-0"><div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase text-slate-500 sticky top-0">${cat}</div>${TEAMS_DATA[cat].map(t => `<div onclick="window.selectTeam('${idPrefix}', '${t}')" class="px-4 py-2 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700">${t}</div>`).join('')}</div>`;
      } else {
          return Object.keys(TEAMS_DATA[cat]).map(sub => `<div class="border-b border-slate-100 dark:border-slate-700 last:border-0"><div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase text-slate-500 sticky top-0">${sub}</div>${TEAMS_DATA[cat][sub].map(t => `<div onclick="window.selectTeam('${idPrefix}', '${t}')" class="px-4 py-2 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700">${t}</div>`).join('')}</div>`).join('');
      }
  }).join('');
  return `<div class="relative group"><input id="${idPrefix}-team" type="text" readonly placeholder="Select Team" class="form-input w-full h-12" onclick="document.getElementById('${idPrefix}-team-dropdown').classList.toggle('hidden')"><div id="${idPrefix}-team-dropdown" class="hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">${content}</div></div>`;
}
window.selectTeam = function(p, t) { document.getElementById(`${p}-team`).value = t; document.getElementById(`${p}-team-dropdown`).classList.add('hidden'); };

function renderFaceSelectorHTML(idPrefix) {
  return `<div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700"><div class="flex gap-2 mb-3"><button type="button" onclick="window.switchFaceTab('${idPrefix}', 'preset')" id="${idPrefix}-btn-preset" class="flex-1 py-1.5 text-[10px] font-bold rounded bg-blue-600 text-white">Preset</button><button type="button" onclick="window.switchFaceTab('${idPrefix}', 'custom')" id="${idPrefix}-btn-custom" class="flex-1 py-1.5 text-[10px] font-bold rounded text-slate-500">Custom</button></div><div id="${idPrefix}-view-preset"><input id="${idPrefix}-face-display" type="text" readonly placeholder="Select Face" class="form-input w-full text-xs mb-2"><div class="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto custom-scrollbar">${Array.from({length: 80}, (_, i) => i + 1).map(i => `<div onclick="window.selectFace('${idPrefix}', ${i})" class="cursor-pointer border border-transparent hover:border-blue-500 rounded overflow-hidden bg-slate-200"><img src="assets/faces/face_${i}.png" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/50?text=${i}'"></div>`).join('')}</div></div><div id="${idPrefix}-view-custom" class="hidden text-center py-4"><label class="cursor-pointer text-xs font-bold text-blue-500 underline">Upload Photo<input id="${idPrefix}-face-file" type="file" accept="image/*" class="hidden" onchange="window.handleCustomFaceUpload('${idPrefix}', this)"></label><div id="${idPrefix}-custom-preview" class="text-[10px] text-slate-500 mt-2 truncate">No file</div></div></div>`;
}
window.switchFaceTab = function(p, t) { const pre = document.getElementById(`${p}-view-preset`), cus = document.getElementById(`${p}-view-custom`), btnP = document.getElementById(`${p}-btn-preset`), btnC = document.getElementById(`${p}-btn-custom`); if(t === 'preset') { pre.classList.remove('hidden'); cus.classList.add('hidden'); btnP.classList.add('bg-blue-600','text-white'); btnP.classList.remove('text-slate-500'); btnC.classList.remove('bg-blue-600','text-white'); document.getElementById(`${p}-face-display`).dataset.isCustom="false"; } else { cus.classList.remove('hidden'); pre.classList.add('hidden'); btnC.classList.add('bg-blue-600','text-white'); btnC.classList.remove('text-slate-500'); btnP.classList.remove('bg-blue-600','text-white'); document.getElementById(`${p}-face-display`).dataset.isCustom="true"; } };
window.selectFace = function(p, id) { const d = document.getElementById(`${p}-face-display`); d.value = `${id}`; d.dataset.faceId = id; };
window.handleCustomFaceUpload = async function(p, inp) { if(inp.files[0]) { try { const b64 = await window.readFileAsBase64(inp.files[0]); document.getElementById(`${p}-custom-preview`).innerText = inp.files[0].name; document.getElementById(`${p}-face-display`).value = "Custom Upload"; if(p === 'cp') window.tempCustomFaceBase64 = b64; else inp.dataset.tempB64 = b64; } catch(e) { alert(e.message); } } };

window.updateBowlingOptions = function(p) { const r = document.getElementById(`${p}-type`).value; const s = document.getElementById(`${p}-bowling-section`); if(['Bowler','All-Rounder'].includes(r)) { s.classList.remove('hidden'); window.updateBowlingActions(p); } else { s.classList.add('hidden'); } };
window.updateBowlingActions = function(p) { const s = document.getElementById(`${p}-bowl-type`).value; const sel = document.getElementById(`${p}-bowl-action`); const k = s === 'Fast' ? 'fast' : (s === 'Spin' ? 'spin' : 'medium'); sel.innerHTML = (BOWLING_ACTIONS[k]||[]).map(a => `<option value="${a}">${a}</option>`).join(''); };

// --- INPUT FIELD (0-100) ---
const numInput = (id, label) => `<div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">${label}</label><input id="${id}" type="number" min="0" max="100" class="form-input w-full h-10 text-xs font-bold" placeholder="99"></div>`;

/* =========================================
   5. CUSTOM PLAYER PAGE
   ========================================= */

function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'rc25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `<button onclick="window.setPlayerGame('${id}')" class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${g === id ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}">${label}</button>`;

  return `
    <div class="max-w-3xl mx-auto pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-black">Custom Player</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 px-3 py-1 rounded">Back</button></div>
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">${gameBtn('rc25', 'RC25')}${gameBtn('rc24', 'RC24')}${gameBtn('rcswipe', 'RC Swipe')}</div>
      <div class="app-card p-6 sm:p-8">
        <form onsubmit="window.submitCustomPlayer(event)" class="space-y-6">
          <div class="grid sm:grid-cols-2 gap-5"><div><label class="block text-xs font-bold mb-1 uppercase">Team</label>${renderTeamSelectorHTML('cp')}</div><div><label class="block text-xs font-bold mb-1 uppercase">Name</label><input id="cp-name" type="text" class="form-input w-full h-12" placeholder="Enter Name"></div></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6"><div><label class="block text-xs font-bold mb-1 uppercase">Role</label><select id="cp-type" class="form-input w-full h-12 font-bold" onchange="window.updateBowlingOptions('cp')"><option value="Batsman">Batsman</option><option value="Bowler">Bowler</option><option value="All-Rounder">All-Rounder</option><option value="Keeper">Wicket Keeper</option></select><div class="mt-6"><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Hands</label><div class="flex gap-3"><select id="cp-bat-hand" class="form-input w-full text-xs h-10"><option value="Right">Bat Right</option><option value="Left">Bat Left</option></select><select id="cp-bowl-hand" class="form-input w-full text-xs h-10"><option value="Right">Bowl Right</option><option value="Left">Bowl Left</option></select></div></div></div><div><label class="block text-xs font-bold mb-1 uppercase">Face</label>${renderFaceSelectorHTML('cp')}</div></div>
          <div class="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700"><h3 class="text-xs font-black uppercase text-blue-500 mb-4">Batting Skill</h3><div class="mb-4"><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Style</label><select id="cp-bat-type" class="form-input w-full text-xs font-bold h-10"><option value="Balanced">Balanced</option><option value="Radical">Radical</option><option value="Brute">Brute</option><option value="Defensive">Defensive</option></select></div><div class="grid grid-cols-3 gap-3">${numInput('cp-timing','Timing')}${numInput('cp-aggression','Aggression')}${numInput('cp-technique','Technique')}</div></div>
          <div id="cp-bowling-section" class="hidden bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700"><h3 class="text-xs font-black uppercase text-green-500 mb-4">Bowling Skill</h3><div class="grid grid-cols-2 gap-4 mb-4"><div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Style</label><select id="cp-bowl-type" class="form-input w-full text-xs h-10" onchange="window.updateBowlingActions('cp')"><option value="Fast">Fast</option><option value="Medium">Medium</option><option value="Spin">Spin</option></select></div><div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Action</label><select id="cp-bowl-action" class="form-input w-full text-xs font-bold h-10"></select></div></div><div class="grid grid-cols-2 gap-3">${numInput('cp-bowl-move','Movement')}${numInput('cp-bowl-skill','Accuracy')}</div></div>
          <div><label class="block text-[10px] font-bold mb-1 text-slate-400 uppercase">Jersey Number</label><input id="cp-jersey" type="number" class="form-input w-full text-xs h-10" placeholder="18"></div>
          <button type="submit" class="btn w-full py-4 shadow-lg shadow-blue-500/20 text-sm">Submit Request</button>
        </form>
      </div>
    </div>`;
}

/* =========================================
   5. CUSTOM TEAM PAGE (FULL MOBILE MODAL)
   ========================================= */

function CreatorTeamPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  if (!window.teamBuilder) resetTeamBuilder();
  
  const numInputCompact = (id, label) => `<div><label class="text-[9px] font-bold text-slate-500 uppercase mb-1 block">${label}</label><input id="${id}" type="number" min="0" max="100" class="form-input w-full h-10 text-xs font-bold" placeholder="99"></div>`;

  return `
    <div class="max-w-4xl mx-auto pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-black">Team Builder</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 px-3 py-1 rounded">Back</button></div>
      <div class="app-card p-6 mb-6">
        <h2 class="text-sm font-bold uppercase text-slate-400 mb-4">Step 1: Details</h2>
        <div class="grid sm:grid-cols-2 gap-5 mb-4"><div><label class="block text-xs font-bold mb-2">Team Name</label><input id="ct-team-name" type="text" class="form-input w-full h-12" placeholder="e.g. Stark XI"></div><div><label class="block text-xs font-bold mb-2">Short Name</label><input id="ct-team-short" type="text" maxlength="3" class="form-input w-full h-12 uppercase" placeholder="STK"></div></div>
        <div class="grid sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold mb-2">Jersey</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full h-12 pt-3"></div><div><label class="block text-xs font-bold mb-2">Logo</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full h-12 pt-3"></div></div>
      </div>
      <div class="app-card p-6 mb-8">
        <div class="flex justify-between items-center mb-4"><h2 class="text-sm font-bold uppercase text-slate-400">Step 2: Squad</h2><span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 px-2 py-1 rounded font-bold" id="squad-count">0/15</span></div>
        <button onclick="window.openPlayerModal()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg mb-4 flex items-center justify-center gap-2"><span class="material-icons">person_add</span> Add Player</button>
        <div id="ct-players-list" class="space-y-2 max-h-60 overflow-y-auto"><div class="text-center text-slate-400 text-xs py-4">Squad is empty.</div></div>
      </div>
      <button onclick="window.submitCustomTeam()" class="btn w-full py-4 shadow-xl text-sm font-black bg-gradient-to-r from-purple-600 to-purple-800 text-white">SUBMIT TEAM REQUEST</button>
    </div>

    <div id="player-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-0 sm:p-4">
       <div class="absolute inset-0 bg-black/90 backdrop-blur-sm" onclick="window.closePlayerModal()"></div>
       <div class="relative bg-white dark:bg-slate-900 w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"><h3 class="font-black text-lg">Add Player</h3><button onclick="window.closePlayerModal()" class="bg-slate-100 p-2 rounded-full"><span class="material-icons text-black">close</span></button></div>
          <div class="p-5 overflow-y-auto custom-scrollbar space-y-6 pb-20">
             <div class="grid grid-cols-2 gap-4"><input id="tp-name" class="form-input w-full font-bold h-12" placeholder="Player Name"><input id="tp-jersey" type="number" class="form-input w-full h-12" placeholder="Jersey No."></div>
             <select id="tp-type" class="form-input w-full font-bold h-12" onchange="window.updateBowlingOptions('tp')"><option value="Batsman">Batsman</option><option value="Bowler">Bowler</option><option value="All-Rounder">All-Rounder</option><option value="Keeper">Wicket Keeper</option></select>
             <div class="grid grid-cols-2 gap-4"><select id="tp-bat-hand" class="form-input h-10 text-xs"><option value="Right">Right Bat</option><option value="Left">Left Bat</option></select><select id="tp-bowl-hand" class="form-input h-10 text-xs"><option value="Right">Right Bowl</option><option value="Left">Left Bowl</option></select></div>
             <div><label class="text-xs font-bold uppercase text-slate-400 mb-1 block">Face</label>${renderFaceSelectorHTML('tp')}</div>
             <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl"><div class="flex justify-between mb-4"><span class="font-bold text-blue-600">BATTING</span><select id="tp-bat-type" class="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded font-bold"><option value="Balanced">Balanced</option><option value="Radical">Radical</option><option value="Brute">Brute</option><option value="Defensive">Defensive</option></select></div><div class="grid grid-cols-3 gap-2">${numInputCompact('tp-timing','Timing')}${numInputCompact('tp-aggression','Aggr')}${numInputCompact('tp-technique','Technique')}</div></div>
             <div id="tp-bowling-section" class="hidden bg-slate-50 dark:bg-slate-800 p-4 rounded-xl"><div class="flex justify-between mb-4"><span class="font-bold text-green-600">BOWLING</span><div class="flex gap-1"><select id="tp-bowl-type" class="text-xs bg-white dark:bg-slate-700 px-1 py-1" onchange="window.updateBowlingActions('tp')"><option value="Fast">Fast</option><option value="Medium">Medium</option><option value="Spin">Spin</option></select><select id="tp-bowl-action" class="text-xs bg-white dark:bg-slate-700 px-1 py-1 w-20"></select></div></div><div class="grid grid-cols-2 gap-2">${numInputCompact('tp-bowl-move','Movement')}${numInputCompact('tp-bowl-skill','Skill')}</div></div>
          </div>
          <div class="p-4 border-t border-slate-100 dark:border-slate-800 absolute bottom-0 w-full bg-white dark:bg-slate-900"><button onclick="window.addTeamPlayer()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg">Confirm & Add</button></div>
       </div>
    </div>`;
}

window.openPlayerModal = function() { document.getElementById('player-modal').classList.remove('hidden'); };
window.closePlayerModal = function() { document.getElementById('player-modal').classList.add('hidden'); };

// --- TEAM ADD PLAYER ---
window.addTeamPlayer = function() {
    if (!window.teamBuilder) resetTeamBuilder();
    if (window.teamBuilder.players.length >= 15) { alert('Squad full.'); return; }
    
    const name = document.getElementById('tp-name').value.trim();
    if (!name) { alert('Enter Name'); return; }
    
    const role = document.getElementById('tp-type').value;
    const isBowler = ['Bowler', 'All-Rounder'].includes(role);
    const faceDisplay = document.getElementById('tp-face-display');
    const customFaceB64 = document.getElementById('tp-face-file').dataset.tempB64 || null;
    
    if (!faceDisplay.value && !customFaceB64) { alert("Select Face"); return; }

    const p = {
        name: name, role: role, 
        jersey: document.getElementById('tp-jersey').value || '0',
        face: faceDisplay.dataset.isCustom === "true" ? "Custom Upload" : `Face ${faceDisplay.dataset.faceId || 'Random'}`,
        batHand: document.getElementById('tp-bat-hand').value,
        bowlHand: document.getElementById('tp-bowl-hand').value,
        batStyle: document.getElementById('tp-bat-type').value,
        batTiming: document.getElementById('tp-timing').value || '80',
        batAggression: document.getElementById('tp-aggression').value || '80',
        batTechnique: document.getElementById('tp-technique').value || '80',
        bowlStyle: isBowler ? document.getElementById('tp-bowl-type').value : 'N/A',
        bowlAction: isBowler ? document.getElementById('tp-bowl-action').value : 'N/A',
        bowlMovement: isBowler ? document.getElementById('tp-bowl-move').value || '0' : '0',
        bowlSkill: isBowler ? document.getElementById('tp-bowl-skill').value || '0' : '0'
    };
    
    if(customFaceB64) p.fullCustomFaceB64 = customFaceB64;
    
    window.teamBuilder.players.push(p);
    
    // Clear inputs
    document.getElementById('tp-name').value = '';
    document.getElementById('tp-face-display').value = '';
    delete document.getElementById('tp-face-file').dataset.tempB64;
    window.closePlayerModal();
    window.renderTeamPlayersList();
};

window.renderTeamPlayersList = function() {
    const list = document.getElementById('ct-players-list');
    document.getElementById('squad-count').innerText = `${window.teamBuilder.players.length}/15`;
    list.innerHTML = window.teamBuilder.players.map((p, i) => `
        <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded mb-1 border border-slate-200 dark:border-slate-700">
           <div><span class="font-bold text-sm">${i+1}. ${p.name} <span class="text-slate-500 text-xs">(${p.role})</span></span></div>
           <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 font-bold px-2">X</button>
        </div>`).join('');
};
window.removeTeamPlayer = function(i) { window.teamBuilder.players.splice(i, 1); window.renderTeamPlayersList(); };

// --- SUBMIT TEAM (TEXT GENERATION) ---
window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    const tName = document.getElementById('ct-team-name').value.trim();
    if(!tName || !window.teamBuilder.players.length) { alert("Missing Details"); return; }
    
    try {
        const j = document.getElementById('ct-jersey-file').files[0];
        const l = document.getElementById('ct-logo-file').files[0];
        const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]'); if(btn) btn.disabled = true;
        let jB = null, lB = null;
        if(j) jB = await window.readFileAsBase64(j);
        if(l) lB = await window.readFileAsBase64(l);
        
        // --- THIS TEXT BLOCK IS SENT TO BOT ---
        const summary = window.teamBuilder.players.map((p, i) => generateBotSummary(p, i+1)).join('\n\n----------------\n\n');
        
        const data = {
            type: 'team', userId: window.currentUser.uid, email: window.currentUser.email, userName: window.currentUser.displayName,
            teamName: tName, teamShortName: document.getElementById('ct-team-short').value,
            mode: 'new', players: window.teamBuilder.players, 
            squadSummary: summary, // FOR BOT
            createdAt: new Date().toISOString()
        };
        
        await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        await window.incrementCreatorUsage();
        try { await fetch('/api/custom-team', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...data, jerseyBase64: jB, logoBase64: lB}) }); } catch(err){}
        alert("✅ Request Sent!"); window.router.navigateTo('/creator-history');
    } catch(e) { alert(e.message); const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]'); if(btn) btn.disabled = false; }
};

// --- SUBMIT PLAYER ---
window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  try {
      const isBowler = ['Bowler', 'All-Rounder'].includes(document.getElementById('cp-type').value);
      const faceDisplay = document.getElementById('cp-face-display');
      
      const p = {
          name: document.getElementById('cp-name').value, role: document.getElementById('cp-type').value,
          face: faceDisplay.dataset.isCustom === "true" ? "Custom" : `Face ${faceDisplay.dataset.faceId || 'Random'}`,
          jersey: document.getElementById('cp-jersey').value || '0',
          batHand: document.getElementById('cp-bat-hand').value, bowlHand: document.getElementById('cp-bowl-hand').value,
          batStyle: document.getElementById('cp-bat-type').value, 
          batTiming: document.getElementById('cp-timing').value || '80',
          batAggression: document.getElementById('cp-aggression').value || '80',
          batTechnique: document.getElementById('cp-technique').value || '80',
          bowlStyle: isBowler ? document.getElementById('cp-bowl-type').value : 'N/A',
          bowlAction: isBowler ? document.getElementById('cp-bowl-action').value : 'N/A',
          bowlMovement: isBowler ? document.getElementById('cp-bowl-move').value || '0' : '0',
          bowlSkill: isBowler ? document.getElementById('cp-bowl-skill').value || '0' : '0'
      };

      const summary = generateBotSummary(p, 1); // Generate Text

      const data = {
        type: 'player', gameId: window.currentPlayerGame, userId: window.currentUser.uid, email: window.currentUser.email,
        userName: window.currentUser.displayName, createdAt: new Date().toISOString(),
        teamName: document.getElementById('cp-team').value || "Custom", playerName: p.name,
        playerDetails: p, 
        playerSummary: summary, // FOR BOT
        customFaceBase64: faceDisplay.dataset.isCustom === "true" ? window.tempCustomFaceBase64 : null
      };

      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      try { await fetch('/api/custom-player', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }); } catch(err){}
      alert("✅ Request Sent!"); window.router.navigateTo('/creator-history');
  } catch(e) { alert(e.message); }
};

window.submitCustomJersey = async function(e){ e.preventDefault(); try{ const f=document.getElementById('cj-file').files[0]; if(!f) throw new Error("File?"); const b64=await window.readFileAsBase64(f); const d={type:'jersey',userId:window.currentUser.uid,teamName:document.getElementById('cj-team').value,createdAt:new Date().toISOString()}; await db.collection('modRequests').add({...d, status:'pending'}); await fetch('/api/custom-jersey', {method:'POST',body:JSON.stringify({...d, jerseyBase64:b64})}); alert("Sent!"); window.router.navigateTo('/creator-history'); }catch(x){alert(x.message);} };

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
