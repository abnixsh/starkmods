// pages/creator.js

/* =========================================
   1. CONFIGURATION & DATA
   ========================================= */

const ADMIN_TELEGRAM_LINK = "https://t.me/YourAdminUsername"; // CHANGE THIS

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
  International: ["India", "Australia", "England", "West Indies", "Pakistan", "New Zealand", "Sri Lanka", "South Africa", "Bangladesh", "Afghanistan"],
  Leagues: {
    IPL: ["CSK", "Mumbai Indians", "RCB", "KKR", "SRH", "Rajasthan Royals", "Delhi Capitals", "Punjab Kings", "LSG", "Gujarat Titans"],
    PSL: ["Islamabad United", "Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Quetta Gladiators"]
  },
  Masters: ["India Legends", "World Giants", "Asia Lions"]
};

// --- GLOBAL STATE ---
window.creatorSub = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.teamBuilder = { mode: 'new', teamName: '', players: [] };
window.tempCustomFaceBase64 = null;

// --- FILE READER ---
window.readFileAsBase64 = function(file) {
  return new Promise((resolve, reject) => {
    if(!file) { reject(new Error("No file selected")); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
};

function resetTeamBuilder() {
  window.teamBuilder = { mode: 'new', teamName: '', players: [] };
}

/* =========================================
   2. TEXT GENERATOR (FIXES BOT UNDEFINED)
   ========================================= */

function generatePlayerStatsText(p) {
    let text = `Name: ${p.name}\n` +
               `Role: ${p.role}\n` +
               `Jersey: ${p.jersey}\n` +
               `Face: ${p.face}\n` +
               `Bat Hand: ${p.batHand}\n` +
               `Bowl Hand: ${p.bowlHand}\n` +
               `Bat Style: ${p.batStyle}\n` +
               `Timing: ${p.batTiming} | Aggro: ${p.batAggression} | Tech: ${p.batTechnique}`;
    
    // Append Bowling only if applicable
    if (['Bowler', 'All-Rounder', 'bowler', 'all-rounder'].includes(p.role)) {
        text += `\nBowl Style: ${p.bowlStyle}\n` +
                `Action: ${p.bowlAction}\n` +
                `Skill: ${p.bowlSkill} | Move: ${p.bowlMovement}`;
    }
    return text;
}

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
        <button onclick="window.router.navigateTo('/creator-history')" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-bold text-xs shadow hover:scale-105 transition">Request History</button>
      </div>
      <div id="creator-sub-status" class="mb-6"></div>
      
      <div class="grid sm:grid-cols-3 gap-6">
        <button class="app-card p-6 text-left hover:scale-[1.02] transition bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700" onclick="window.router.navigateTo('/creator-player')">
           <div class="text-4xl mb-2">👤</div><div class="font-bold text-lg text-slate-900 dark:text-white">Custom Player</div><div class="text-xs text-slate-500">Create single player</div>
        </button>
        <button class="app-card p-6 text-left hover:scale-[1.02] transition bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700" onclick="window.goToCreatorTeam()">
           <div class="text-4xl mb-2">👥</div><div class="font-bold text-lg text-slate-900 dark:text-white">Custom Team</div><div class="text-xs text-slate-500">Build full squads</div>
        </button>
        <button class="app-card p-6 text-left hover:scale-[1.02] transition bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700" onclick="window.goToCreatorJersey()">
           <div class="text-4xl mb-2">👕</div><div class="font-bold text-lg text-slate-900 dark:text-white">Custom Jersey</div><div class="text-xs text-slate-500">Upload textures</div>
        </button>
      </div>
    </div>`;
}

/* =========================================
   4. UI COMPONENTS
   ========================================= */

function renderTeamSelectorHTML(idPrefix) {
  const categories = Object.keys(TEAMS_DATA);
  let content = categories.map(cat => {
      if(Array.isArray(TEAMS_DATA[cat])) {
          return `<div class="border-b border-slate-100 dark:border-slate-700 last:border-0"><div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase text-slate-500 sticky top-0">${cat}</div>${TEAMS_DATA[cat].map(t => `<div onclick="window.selectTeam('${idPrefix}', '${t}')" class="px-4 py-2 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 font-medium">${t}</div>`).join('')}</div>`;
      } else {
          return Object.keys(TEAMS_DATA[cat]).map(sub => `<div class="border-b border-slate-100 dark:border-slate-700 last:border-0"><div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase text-slate-500 sticky top-0">${sub}</div>${TEAMS_DATA[cat][sub].map(t => `<div onclick="window.selectTeam('${idPrefix}', '${t}')" class="px-4 py-2 text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 font-medium">${t}</div>`).join('')}</div>`).join('');
      }
  }).join('');
  return `<div class="relative group"><input id="${idPrefix}-team" type="text" readonly placeholder="Select Team" class="form-input w-full h-12 bg-slate-50 dark:bg-slate-900 border-none rounded-xl font-bold cursor-pointer" onclick="document.getElementById('${idPrefix}-team-dropdown').classList.toggle('hidden')"><div id="${idPrefix}-team-dropdown" class="hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 mt-1 max-h-60 overflow-y-auto">${content}</div></div>`;
}
window.selectTeam = function(p, t) { document.getElementById(`${p}-team`).value = t; document.getElementById(`${p}-team-dropdown`).classList.add('hidden'); };

function renderFaceSelectorHTML(idPrefix) {
  return `<div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700"><div class="flex gap-2 mb-3"><button type="button" onclick="window.switchFaceTab('${idPrefix}', 'preset')" id="${idPrefix}-btn-preset" class="flex-1 py-1.5 text-[10px] font-bold rounded bg-blue-600 text-white shadow-md">Preset</button><button type="button" onclick="window.switchFaceTab('${idPrefix}', 'custom')" id="${idPrefix}-btn-custom" class="flex-1 py-1.5 text-[10px] font-bold rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Custom</button></div><div id="${idPrefix}-view-preset"><input id="${idPrefix}-face-display" type="text" readonly placeholder="Select Face" class="form-input w-full text-xs mb-2 bg-white dark:bg-slate-900 border-none rounded-lg"><div class="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto custom-scrollbar">${Array.from({length: 80}, (_, i) => i + 1).map(i => `<div onclick="window.selectFace('${idPrefix}', ${i})" class="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden bg-slate-200 relative"><img src="assets/faces/face_${i}.png" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/50?text=${i}'"><div class="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 font-bold">${i}</div></div>`).join('')}</div></div><div id="${idPrefix}-view-custom" class="hidden text-center py-4"><label class="cursor-pointer text-xs font-bold text-blue-500 underline flex flex-col items-center"><span class="material-icons text-3xl">cloud_upload</span>Upload Photo<input id="${idPrefix}-face-file" type="file" accept="image/*" class="hidden" onchange="window.handleCustomFaceUpload('${idPrefix}', this)"></label><div id="${idPrefix}-custom-preview" class="text-[10px] text-slate-500 mt-2 truncate">No file</div></div></div>`;
}
window.switchFaceTab = function(p, t) { const pre = document.getElementById(`${p}-view-preset`), cus = document.getElementById(`${p}-view-custom`), btnP = document.getElementById(`${p}-btn-preset`), btnC = document.getElementById(`${p}-btn-custom`); if(t === 'preset') { pre.classList.remove('hidden'); cus.classList.add('hidden'); btnP.classList.add('bg-blue-600','text-white'); btnP.classList.remove('text-slate-500'); btnC.classList.remove('bg-blue-600','text-white'); document.getElementById(`${p}-face-display`).dataset.isCustom="false"; } else { cus.classList.remove('hidden'); pre.classList.add('hidden'); btnC.classList.add('bg-blue-600','text-white'); btnC.classList.remove('text-slate-500'); btnP.classList.remove('bg-blue-600','text-white'); document.getElementById(`${p}-face-display`).dataset.isCustom="true"; } };
window.selectFace = function(p, id) { const d = document.getElementById(`${p}-face-display`); d.value = `${id}`; d.dataset.faceId = id; };
window.handleCustomFaceUpload = async function(p, inp) { if(inp.files[0]) { try { const b64 = await window.readFileAsBase64(inp.files[0]); document.getElementById(`${p}-custom-preview`).innerText = inp.files[0].name; document.getElementById(`${p}-face-display`).value = "Custom Upload"; if(p === 'cp') window.tempCustomFaceBase64 = b64; else inp.dataset.tempB64 = b64; } catch(e) { alert(e.message); } } };

window.updateBowlingOptions = function(p) { const r = document.getElementById(`${p}-type`).value; const s = document.getElementById(`${p}-bowling-section`); if(['bowler','all-rounder'].includes(r)) { s.classList.remove('hidden'); window.updateBowlingActions(p); } else { s.classList.add('hidden'); } };
window.updateBowlingActions = function(p) { const s = document.getElementById(`${p}-bowl-type`).value; const sel = document.getElementById(`${p}-bowl-action`); const k = s === 'fast' ? 'fast' : (s === 'spin' ? 'spin' : 'medium'); sel.innerHTML = (BOWLING_ACTIONS[k]||[]).map(a => `<option value="${a}">${a}</option>`).join(''); };

// --- INPUT FIELD (0-100) ---
const numInput = (id, label) => `<div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">${label} (0-99)</label><input id="${id}" type="number" min="0" max="99" class="form-input w-full h-10 text-xs font-bold bg-white dark:bg-slate-900 border-none rounded-xl" placeholder="80"></div>`;

/* =========================================
   5. CUSTOM PLAYER PAGE
   ========================================= */

function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'rc25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `<button onclick="window.setPlayerGame('${id}')" class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${g === id ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white dark:bg-slate-800 dark:text-slate-300 text-slate-600 hover:bg-slate-100'}">${label}</button>`;

  return `
    <div class="max-w-3xl mx-auto pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-black text-slate-900 dark:text-white">Custom Player</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded hover:bg-slate-300 transition">Back</button></div>
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">${gameBtn('rc25', 'RC25')}${gameBtn('rc24', 'RC24')}${gameBtn('rcswipe', 'RC Swipe')}</div>
      <div class="app-card p-6 sm:p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl">
        <form onsubmit="window.submitCustomPlayer(event)" class="space-y-6">
          <div class="grid sm:grid-cols-2 gap-5"><div><label class="block text-xs font-bold mb-1 uppercase text-slate-500">Team</label>${renderTeamSelectorHTML('cp')}</div><div><label class="block text-xs font-bold mb-1 uppercase text-slate-500">Name</label><input id="cp-name" type="text" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold" placeholder="Enter Name"></div></div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div><label class="block text-xs font-bold mb-1 uppercase text-slate-500">Role</label><select id="cp-type" class="form-input w-full h-12 font-bold bg-white dark:bg-slate-900 border-none rounded-xl" onchange="window.updateBowlingOptions('cp')"><option value="batsman">Batsman</option><option value="bowler">Bowler</option><option value="all-rounder">All-Rounder</option><option value="keeper">Wicket Keeper</option></select><div class="mt-6"><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Hands</label><div class="flex gap-3"><select id="cp-bat-hand" class="form-input w-full text-xs h-10 bg-white dark:bg-slate-900 border-none rounded-xl"><option value="right">Right Bat</option><option value="left">Left Bat</option></select><select id="cp-bowl-hand" class="form-input w-full text-xs h-10 bg-white dark:bg-slate-900 border-none rounded-xl"><option value="right">Right Bowl</option><option value="left">Left Bowl</option></select></div></div></div>
             <div><label class="block text-xs font-bold mb-1 uppercase text-slate-500">Face</label>${renderFaceSelectorHTML('cp')}</div>
          </div>

          <div class="bg-slate-100/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700"><h3 class="text-xs font-black uppercase text-blue-500 mb-4">Batting Skill</h3><div class="mb-4"><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Style</label><select id="cp-bat-type" class="form-input w-full text-xs font-bold h-10 bg-white dark:bg-slate-800 border-none rounded-xl"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select></div><div class="grid grid-cols-3 gap-3">${numInput('cp-timing','Timing')}${numInput('cp-aggression','Aggression')}${numInput('cp-technique','Technique')}</div></div>
          <div id="cp-bowling-section" class="hidden bg-slate-100/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700"><h3 class="text-xs font-black uppercase text-green-500 mb-4">Bowling Skill</h3><div class="grid grid-cols-2 gap-4 mb-4"><div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Style</label><select id="cp-bowl-type" class="form-input w-full text-xs h-10 bg-white dark:bg-slate-800 border-none rounded-xl" onchange="window.updateBowlingActions('cp')"><option value="fast">Fast</option><option value="medium">Medium</option><option value="spin">Spin</option></select></div><div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Action</label><select id="cp-bowl-action" class="form-input w-full text-xs font-bold h-10 bg-white dark:bg-slate-800 border-none rounded-xl"></select></div></div><div class="grid grid-cols-2 gap-3">${numInput('cp-bowl-move','Movement')}${numInput('cp-bowl-skill','Accuracy')}</div></div>
          <div><label class="block text-[10px] font-bold mb-1 text-slate-400 uppercase">Jersey Number</label><input id="cp-jersey" type="number" class="form-input w-full text-xs h-10 bg-white dark:bg-slate-900 border-none rounded-xl" placeholder="18"></div>
          <button type="submit" class="btn w-full py-4 shadow-xl shadow-blue-500/20 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-2xl transform active:scale-95 transition">Submit Request</button>
        </form>
      </div>
    </div>`;
}

/* =========================================
   6. CUSTOM TEAM PAGE
   ========================================= */

function CreatorTeamPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  if (!window.teamBuilder) resetTeamBuilder();
  
  const numInputCompact = (id, label) => `<div><label class="text-[9px] font-bold text-slate-500 uppercase mb-1 block">${label}</label><input id="${id}" type="number" min="0" max="99" class="form-input w-full h-10 text-xs font-bold bg-white dark:bg-slate-800 border-none rounded-lg" placeholder="80"></div>`;

  return `
    <div class="max-w-4xl mx-auto pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-black text-slate-900 dark:text-white">Team Builder</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded hover:bg-slate-300 transition">Back</button></div>
      <div class="app-card p-6 mb-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl">
        <h2 class="text-sm font-bold uppercase text-slate-400 mb-4">Step 1: Details</h2>
        <div class="grid sm:grid-cols-2 gap-5 mb-4"><div><label class="block text-xs font-bold mb-2 text-slate-500">Team Name</label><input id="ct-team-name" type="text" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold" placeholder="e.g. Stark XI"></div><div><label class="block text-xs font-bold mb-2 text-slate-500">Short Name</label><input id="ct-team-short" type="text" maxlength="3" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold uppercase" placeholder="STK"></div></div>
        <div class="grid sm:grid-cols-2 gap-4"><div><label class="block text-xs font-bold mb-2 text-slate-500">Jersey</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full h-12 pt-3 bg-white dark:bg-slate-900 border-none rounded-xl"></div><div><label class="block text-xs font-bold mb-2 text-slate-500">Logo</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full h-12 pt-3 bg-white dark:bg-slate-900 border-none rounded-xl"></div></div>
      </div>
      <div class="app-card p-6 mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl">
        <div class="flex justify-between items-center mb-4"><h2 class="text-sm font-bold uppercase text-slate-400">Step 2: Squad</h2><span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 px-2 py-1 rounded font-bold" id="squad-count">0/15</span></div>
        <button onclick="window.openPlayerModal()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 mb-4 flex items-center justify-center gap-2 transition active:scale-95"><span class="material-icons">person_add</span> Add Player</button>
        <div id="ct-players-list" class="space-y-2 max-h-60 overflow-y-auto"><div class="text-center text-slate-400 text-xs py-4">Squad is empty.</div></div>
      </div>
      <button onclick="window.submitCustomTeam()" class="btn w-full py-4 shadow-xl text-sm font-black bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl transform active:scale-95 transition">SUBMIT TEAM REQUEST</button>
    </div>

    <div id="player-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-0 sm:p-4">
       <div class="absolute inset-0 bg-black/90 backdrop-blur-md" onclick="window.closePlayerModal()"></div>
       <div class="relative bg-slate-50 dark:bg-slate-950 w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col animate-fade-in">
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900"><h3 class="font-black text-lg text-slate-900 dark:text-white">Add Player</h3><button onclick="window.closePlayerModal()" class="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-500 transition"><span class="material-icons text-black dark:text-white">close</span></button></div>
          <div class="p-5 overflow-y-auto custom-scrollbar space-y-6 pb-24">
             <div class="grid grid-cols-2 gap-4"><input id="tp-name" class="form-input w-full font-bold h-12 bg-white dark:bg-slate-800 border-none rounded-xl" placeholder="Player Name"><input id="tp-jersey" type="number" class="form-input w-full h-12 bg-white dark:bg-slate-800 border-none rounded-xl" placeholder="Jersey No."></div>
             <select id="tp-type" class="form-input w-full font-bold h-12 bg-white dark:bg-slate-800 border-none rounded-xl" onchange="window.updateBowlingOptions('tp')"><option value="batsman">Batsman</option><option value="bowler">Bowler</option><option value="all-rounder">All-Rounder</option><option value="keeper">Wicket Keeper</option></select>
             <div class="grid grid-cols-2 gap-4"><select id="tp-bat-hand" class="form-input h-10 text-xs bg-white dark:bg-slate-800 border-none rounded-xl"><option value="right">Right Bat</option><option value="left">Left Bat</option></select><select id="tp-bowl-hand" class="form-input h-10 text-xs bg-white dark:bg-slate-800 border-none rounded-xl"><option value="right">Right Bowl</option><option value="left">Left Bowl</option></select></div>
             <div><label class="text-xs font-bold uppercase text-slate-400 mb-1 block">Face</label>${renderFaceSelectorHTML('tp')}</div>
             <div class="bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"><div class="flex justify-between mb-4"><span class="font-bold text-blue-600 uppercase text-xs">Batting Skill</span><select id="tp-bat-type" class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg font-bold"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select></div><div class="grid grid-cols-3 gap-2">${numInputCompact('tp-timing','Timing')}${numInputCompact('tp-aggression','Aggr')}${numInputCompact('tp-technique','Technique')}</div></div>
             <div id="tp-bowling-section" class="hidden bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"><div class="flex justify-between mb-4"><span class="font-bold text-green-600 uppercase text-xs">Bowling Skill</span><div class="flex gap-1"><select id="tp-bowl-type" class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg font-bold" onchange="window.updateBowlingActions('tp')"><option value="fast">Fast</option><option value="medium">Medium</option><option value="spin">Spin</option></select><select id="tp-bowl-action" class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg font-bold w-24"></select></div></div><div class="grid grid-cols-2 gap-2">${numInputCompact('tp-bowl-move','Movement')}${numInputCompact('tp-bowl-skill','Skill')}</div></div>
          </div>
          <div class="p-5 border-t border-slate-200 dark:border-slate-800 absolute bottom-0 w-full bg-white dark:bg-slate-900 rounded-b-3xl"><button onclick="window.addTeamPlayer()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition transform active:scale-95">Confirm & Add</button></div>
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
    const isBowler = ['bowler', 'all-rounder'].includes(role);
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
        bowlMovement: isBowler ? document.getElementById('tp-bowl-move').value || '80' : '0',
        bowlSkill: isBowler ? document.getElementById('tp-bowl-skill').value || '80' : '0'
    };
    
    if(customFaceB64) p.customFaceBase64 = customFaceB64;
    window.teamBuilder.players.push(p);
    
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
        <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl mb-2 border border-slate-200 dark:border-slate-700">
           <div><span class="font-bold text-sm text-slate-900 dark:text-white">${i+1}. ${p.name} <span class="text-slate-500 text-xs font-medium uppercase ml-1">(${p.role})</span></span></div>
           <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"><span class="material-icons text-sm">delete</span></button>
        </div>`).join('');
};
window.removeTeamPlayer = function(i) { window.teamBuilder.players.splice(i, 1); window.renderTeamPlayersList(); };

// --- SUBMIT TEAM ---
window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    const tName = document.getElementById('ct-team-name').value.trim();
    if(!tName || !window.teamBuilder.players.length) { alert("Missing Details"); return; }
    
    const selectTeam = document.getElementById('cp-team') ? document.getElementById('cp-team').value : null;
    if(!tName && !selectTeam) { alert("Enter Team Name"); return; }

    try {
        const j = document.getElementById('ct-jersey-file').files[0];
        const l = document.getElementById('ct-logo-file').files[0];
        const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]'); if(btn) btn.disabled = true;
        let jB = null, lB = null;
        if(j) jB = await window.readFileAsBase64(j); if(l) lB = await window.readFileAsBase64(l);
        
        const summary = window.teamBuilder.players.map((p, i) => generateSummaryText(p)).join('\n\n----------------\n\n');
        
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

// --- SUBMIT PLAYER (SINGLE) ---
window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  try {
      const isBowler = ['bowler', 'all-rounder'].includes(document.getElementById('cp-type').value);
      const faceDisplay = document.getElementById('cp-face-display');
      
      const teamInput = document.getElementById('cp-team').value;
      if (!teamInput) { alert("Please Select a Team"); return; }

      const p = {
          playerName: document.getElementById('cp-name').value, 
          name: document.getElementById('cp-name').value,
          role: document.getElementById('cp-type').value,
          teamName: teamInput,
          jersey: document.getElementById('cp-jersey').value || '0',
          jerseyNumber: document.getElementById('cp-jersey').value || '0',
          
          face: faceDisplay.dataset.isCustom === "true" ? "Custom" : `Face ${faceDisplay.dataset.faceId || 'Random'}`,
          
          batHand: document.getElementById('cp-bat-hand').value, battingHand: document.getElementById('cp-bat-hand').value,
          bowlHand: document.getElementById('cp-bowl-hand').value, bowlingHand: document.getElementById('cp-bowl-hand').value,
          
          batStyle: document.getElementById('cp-bat-type').value, batsmanType: document.getElementById('cp-bat-type').value,
          batTiming: document.getElementById('cp-timing').value || '80', timing: document.getElementById('cp-timing').value || '80',
          batAggression: document.getElementById('cp-aggression').value || '80', aggression: document.getElementById('cp-aggression').value || '80',
          batTechnique: document.getElementById('cp-technique').value || '80', technique: document.getElementById('cp-technique').value || '80',
          
          bowlStyle: isBowler ? document.getElementById('cp-bowl-type').value : 'N/A', bowlerType: isBowler ? document.getElementById('cp-bowl-type').value : 'N/A',
          bowlAction: isBowler ? document.getElementById('cp-bowl-action').value : 'N/A', bowlingAction: isBowler ? document.getElementById('cp-bowl-action').value : 'N/A',
          bowlMovement: isBowler ? document.getElementById('cp-bowl-move').value || '0' : '0', bowlingMovement: isBowler ? document.getElementById('cp-bowl-move').value || '0' : '0',
          bowlSkill: isBowler ? document.getElementById('cp-bowl-skill').value || '0' : '0', bowlingSkill: isBowler ? document.getElementById('cp-bowl-skill').value || '0' : '0'
      };

      const summary = generateSummaryText(p);

      const data = {
        type: 'player', gameId: window.currentPlayerGame, userId: window.currentUser.uid, email: window.currentUser.email,
        userName: window.currentUser.displayName, createdAt: new Date().toISOString(),
        ...p,
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

// --- HISTORY PAGE ---
function CreatorHistoryPage() { 
    if (!window.currentUser) { setTimeout(()=>window.router.navigateTo('/'),50); return ''; } 
    if (window.historyUnsubscribe) window.historyUnsubscribe(); 
    setTimeout(()=>{ const c=document.getElementById('creator-history'); if(!c) return; window.historyUnsubscribe = db.collection('modRequests').where('userId','==',window.currentUser.uid).onSnapshot(s=>{ 
        if(s.empty) { c.innerHTML='<div class="text-center py-8 text-slate-400">No requests.</div>'; return; } 
        const docs = []; s.forEach(d => docs.push(d.data())); docs.sort((a,b)=>(b.timestamp?.toMillis?.()||0)-(a.timestamp?.toMillis?.()||0)); 
        c.innerHTML=docs.map(r=>{
            let showDownload = r.status === 'approved' && r.downloadUrl;
            let statusText = r.status === 'pending' ? 'Pending (Wait < 24h)' : r.status;
            let statusColor = r.status === 'approved' ? 'text-green-600' : r.status === 'rejected' ? 'text-red-600' : 'text-amber-500';
            let buttons = '';
            
            if(showDownload) buttons += `<a href="${r.downloadUrl}" target="_blank" class="block w-full text-center bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md mt-2">Download Mod</a>`;
            if(r.status === 'pending') buttons += `<a href="${ADMIN_TELEGRAM_LINK}" target="_blank" class="block w-full text-center bg-slate-100 text-slate-600 font-bold py-2 rounded-lg mt-2 text-xs">Help / Contact Admin</a>`;

            return `<div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm mb-3">
                <div class="flex justify-between items-start mb-2">
                    <div><div class="font-bold text-slate-900 dark:text-white">${r.type==='team'?r.teamName:r.playerName||r.teamName}</div><div class="text-xs text-slate-500">${new Date(r.createdAt).toLocaleDateString()}</div></div>
                    <div class="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 ${statusColor}">${statusText}</div>
                </div>
                ${buttons}
            </div>`;
        }).join(''); 
    }); },100); 
    return `<div class="max-w-4xl mx-auto pb-24 px-4 pt-6"><h1 class="text-2xl font-black mb-6 text-slate-900 dark:text-white">History</h1><div id="creator-history" class="space-y-4"></div></div>`; 
}

function CreatorPlansPage() { if(!window.currentUser) return ''; return `<div class="max-w-5xl mx-auto pb-20 px-4 pt-6"><h1 class="text-3xl font-black text-center mb-10">Choose Plan</h1><div class="grid md:grid-cols-3 gap-6">${['P100','P300','P1000'].map(c=>{const p=CREATOR_PLANS[c]; return `<div class="app-card p-6"><h3 class="text-xl font-black">${p.name}</h3><div class="text-3xl font-black text-blue-600 mt-2 mb-6">₹${p.priceINR}</div><button onclick="window.buyCreatorPlan('${c}')" class="btn w-full py-3 text-sm">Select</button></div>`}).join('')}</div></div>`; }

window.buyCreatorPlan = function(code) { const p = CREATOR_PLANS[code]; window.cart = [{ gameId: `sub_${code}`, gameName: 'Creator Sub', planName: p.name, price: p.priceINR, image: 'assets/icons/icon_site.jpg', subPlanCode: code }]; if(window.updateCartBadge) window.updateCartBadge(); window.router.navigateTo('/checkout'); };
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
