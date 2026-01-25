// pages/creator.js

/* =========================================
   1. CONFIGURATION & DATA
   ========================================= */

const ADMIN_CONTACT_LINK = "https://t.me/TheAbhiStark"; // CHANGE THIS to your actual link

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
    IPL: ["CSK", "Mumbai Indians", "RCB", "KKR", "SRH", "RR", "Delhi Capitals", "Punjab Kings", "LSG", "Gujarat Titans"],
    PSL: ["Islamabad United", "Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Quetta Gladiators"]
  },
  Masters: ["India Legends", "World Giants", "Asia Lions"]
};

// --- GLOBAL STATE ---
window.creatorSub = null;
window.currentPlayerGame = 'RC25'; // Default
window.currentJerseyGame = 'RC25';
window.teamBuilder = { mode: 'new', teamName: '', players: [] };
window.tempCustomFaceBase64 = null;

// --- HELPER: FILE READER ---
window.readFileAsBase64 = function(file) {
  return new Promise((resolve, reject) => {
    if(!file) { reject(new Error("No file selected")); return; }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
};

// --- HELPER: TEXT GENERATOR FOR BOT ---
function generateBotSummary(p, index = null) {
    let prefix = index ? `${index}) ` : '';
    let txt = `${prefix}Player: ${p.name} (${p.role})\n` +
              `   Jersey: ${p.jersey}\n` +
              `   Face: ${p.face}\n` +
              `   Hands: ${p.batHand} Bat | ${p.bowlHand} Bowl\n` +
              `   Batting: ${p.batStyle} | T:${p.batTiming} A:${p.batAggression} Tec:${p.batTechnique}`;
    
    if (['Bowler', 'All-Rounder', 'bowler', 'all-rounder'].includes(p.role)) {
        txt += `\n   Bowling: ${p.bowlStyle} | Act:${p.bowlAction}\n` +
               `   Stats: Mov:${p.bowlMovement} Skl:${p.bowlSkill}`;
    }
    return txt;
}

/* =========================================
   2. MAIN ROUTER
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

/* =========================================
   3. MENU UI (Glassmorphism)
   ========================================= */

function CreatorMenuUI() {
  if (!window.currentUser) return `<div class="p-10 text-center animate-fade-in"><div class="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md"><span class="material-icons text-4xl text-blue-500">lock</span></div><h1 class="text-2xl font-black mb-2 text-slate-800 dark:text-white">Login Required</h1><button onclick="window.googleLogin()" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition">Login with Google</button></div>`;
  
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-8">
        <div>
           <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Mod Creator</h1>
           <p class="text-slate-500 font-medium">Create. Customize. Play.</p>
        </div>
        <button onclick="window.router.navigateTo('/creator-history')" class="px-5 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm shadow-sm hover:bg-white dark:hover:bg-slate-700 transition flex items-center gap-2">
           <span class="material-icons text-lg text-blue-600">history</span> History
        </button>
      </div>

      <div id="creator-sub-status" class="mb-8"></div>

      <div class="grid sm:grid-cols-3 gap-6">
        ${renderMenuCard('person', 'Custom Player', 'Create single player mods.', '/creator-player', 'blue')}
        ${renderMenuCard('groups', 'Custom Team', 'Build full squads (Pro).', null, 'purple', 'window.goToCreatorTeam()')}
        ${renderMenuCard('checkroom', 'Custom Jersey', 'Upload textures.', null, 'green', 'window.goToCreatorJersey()')}
      </div>
    </div>`;
}

function renderMenuCard(icon, title, desc, link, color, onClick) {
    const clickAction = link ? `window.router.navigateTo('${link}')` : onClick;
    return `
    <button onclick="${clickAction}" class="relative group overflow-hidden p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left w-full">
        <div class="absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-${color}-500/20 opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <div class="w-14 h-14 bg-${color}-100 dark:bg-${color}-900/30 rounded-2xl flex items-center justify-center mb-4 text-${color}-600 dark:text-${color}-400 shadow-sm relative z-10">
            <span class="material-icons text-3xl">${icon}</span>
        </div>
        <div class="relative z-10">
            <div class="font-black text-xl text-slate-900 dark:text-white mb-1">${title}</div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">${desc}</p>
        </div>
    </button>`;
}

/* =========================================
   4. UI COMPONENTS (Dropdowns & Inputs)
   ========================================= */

function renderTeamSelectorHTML(idPrefix) {
  const categories = Object.keys(TEAMS_DATA);
  let content = categories.map(cat => {
      let items = Array.isArray(TEAMS_DATA[cat]) ? TEAMS_DATA[cat] : []; 
      if(!Array.isArray(TEAMS_DATA[cat])) {
         // Handle nested object (Leagues)
         items = Object.values(TEAMS_DATA[cat]).flat(); 
      }
      return `<div class="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div class="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 text-[10px] font-bold uppercase text-slate-500 sticky top-0">${cat}</div>
                ${items.map(t => `<div onclick="window.selectTeam('${idPrefix}', '${t}')" class="px-4 py-3 text-xs font-medium cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-200">${t}</div>`).join('')}
              </div>`;
  }).join('');

  return `
    <div class="relative group">
      <input id="${idPrefix}-team" type="text" readonly placeholder="Select Team" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-500" onclick="document.getElementById('${idPrefix}-team-dropdown').classList.toggle('hidden')">
      <span class="material-icons absolute right-3 top-3 text-slate-400 pointer-events-none">arrow_drop_down</span>
      <div id="${idPrefix}-team-dropdown" class="hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 mt-2 max-h-60 overflow-y-auto custom-scrollbar animate-fade-in">${content}</div>
    </div>`;
}
window.selectTeam = function(p, t) { document.getElementById(`${p}-team`).value = t; document.getElementById(`${p}-team-dropdown`).classList.add('hidden'); };

function renderFaceSelectorHTML(idPrefix) {
  return `
    <div class="bg-white/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
      <div class="flex gap-2 mb-4 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
         <button type="button" onclick="window.switchFaceTab('${idPrefix}', 'preset')" id="${idPrefix}-btn-preset" class="flex-1 py-2 text-[10px] font-bold rounded-lg bg-white dark:bg-slate-700 text-black dark:text-white shadow-sm transition">Preset</button>
         <button type="button" onclick="window.switchFaceTab('${idPrefix}', 'custom')" id="${idPrefix}-btn-custom" class="flex-1 py-2 text-[10px] font-bold rounded-lg text-slate-500 transition hover:text-slate-700">Custom</button>
      </div>
      
      <div id="${idPrefix}-view-preset">
         <input id="${idPrefix}-face-display" type="text" readonly placeholder="Select Face Below" class="form-input w-full text-xs mb-3 bg-transparent border-b border-slate-300 dark:border-slate-600 font-mono">
         <div class="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
            ${Array.from({length: 80}, (_, i) => i + 1).map(i => `
               <div onclick="window.selectFace('${idPrefix}', ${i})" class="cursor-pointer aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition relative group">
                  <img src="assets/faces/face_${i}.png" class="w-full h-full object-cover bg-slate-300" onerror="this.src='https://placehold.co/50?text=${i}'">
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition">#${i}</div>
               </div>`).join('')}
         </div>
      </div>

      <div id="${idPrefix}-view-custom" class="hidden text-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition group">
         <label class="cursor-pointer text-xs font-bold text-slate-500 group-hover:text-blue-500 flex flex-col items-center gap-2">
            <div class="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center"><span class="material-icons text-xl">cloud_upload</span></div>
            <span>Tap to Upload Photo</span>
            <input id="${idPrefix}-face-file" type="file" accept="image/*" class="hidden" onchange="window.handleCustomFaceUpload('${idPrefix}', this)">
         </label>
         <div id="${idPrefix}-custom-preview" class="text-[10px] text-green-600 mt-2 font-mono font-bold truncate px-2"></div>
      </div>
    </div>`;
}
window.switchFaceTab = function(p, t) { 
    const pre = document.getElementById(`${p}-view-preset`), cus = document.getElementById(`${p}-view-custom`);
    const bP = document.getElementById(`${p}-btn-preset`), bC = document.getElementById(`${p}-btn-custom`);
    if(t === 'preset') { 
        pre.classList.remove('hidden'); cus.classList.add('hidden'); 
        bP.classList.add('bg-white','dark:bg-slate-700','text-black','dark:text-white','shadow-sm'); bP.classList.remove('text-slate-500');
        bC.classList.remove('bg-white','dark:bg-slate-700','text-black','dark:text-white','shadow-sm'); bC.classList.add('text-slate-500');
        document.getElementById(`${p}-face-display`).dataset.isCustom="false"; 
    } else { 
        cus.classList.remove('hidden'); pre.classList.add('hidden'); 
        bC.classList.add('bg-white','dark:bg-slate-700','text-black','dark:text-white','shadow-sm'); bC.classList.remove('text-slate-500');
        bP.classList.remove('bg-white','dark:bg-slate-700','text-black','dark:text-white','shadow-sm'); bP.classList.add('text-slate-500');
        document.getElementById(`${p}-face-display`).dataset.isCustom="true"; 
    } 
};
window.selectFace = function(p, id) { const d = document.getElementById(`${p}-face-display`); d.value = `Face ${id}`; d.dataset.faceId = id; };
window.handleCustomFaceUpload = async function(p, inp) { if(inp.files[0]) { try { const b64 = await window.readFileAsBase64(inp.files[0]); document.getElementById(`${p}-custom-preview`).innerText = "✅ " + inp.files[0].name; document.getElementById(`${p}-face-display`).value = "Custom Upload"; if(p === 'cp') window.tempCustomFaceBase64 = b64; else inp.dataset.tempB64 = b64; } catch(e) { alert(e.message); } } };

window.updateBowlingOptions = function(p) { const r = document.getElementById(`${p}-type`).value; const s = document.getElementById(`${p}-bowling-section`); if(['Bowler','All-Rounder'].includes(r)) { s.classList.remove('hidden'); window.updateBowlingActions(p); } else { s.classList.add('hidden'); } };
window.updateBowlingActions = function(p) { const s = document.getElementById(`${p}-bowl-type`).value; const sel = document.getElementById(`${p}-bowl-action`); const k = s === 'Fast' ? 'fast' : (s === 'Spin' ? 'spin' : 'medium'); sel.innerHTML = (BOWLING_ACTIONS[k]||[]).map(a => `<option value="${a}">${a}</option>`).join(''); };

const numInput = (id, label) => `<div><label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">${label}</label><input id="${id}" type="number" min="0" max="99" class="form-input w-full h-10 text-sm font-bold bg-white dark:bg-slate-900 border-none rounded-xl text-center shadow-sm" placeholder="80"></div>`;

/* =========================================
   5. CUSTOM PLAYER PAGE
   ========================================= */

function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'RC25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `<button onclick="window.setPlayerGame('${id}')" class="px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm border ${g === id ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 border-transparent hover:bg-slate-100'}">${label}</button>`;

  return `
    <div class="max-w-3xl mx-auto pb-24 px-4 pt-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6">
         <h1 class="text-3xl font-black text-slate-900 dark:text-white">Custom Player</h1>
         <button onclick="window.router.navigateTo('/creator')" class="w-10 h-10 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition"><span class="material-icons text-slate-600 dark:text-slate-300">close</span></button>
      </div>

      <div class="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar justify-center">
         ${gameBtn('RC25', 'RC25')} ${gameBtn('RC24', 'RC24')} ${gameBtn('RCSwipe', 'RC Swipe')}
      </div>

      <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/20 dark:border-white/5 shadow-2xl">
        <form onsubmit="window.submitCustomPlayer(event)" class="space-y-6">
          
          <div class="grid sm:grid-cols-2 gap-5">
             <div><label class="label-xs">Select Team</label>${renderTeamSelectorHTML('cp')}</div>
             <div><label class="label-xs">Player Name</label><input id="cp-name" type="text" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold" placeholder="Enter Name"></div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
                <label class="label-xs">Role</label>
                <select id="cp-type" class="form-input w-full h-12 font-bold bg-white dark:bg-slate-900 border-none rounded-xl mb-4" onchange="window.updateBowlingOptions('cp')">
                    <option value="Batsman">Batsman</option><option value="Bowler">Bowler</option><option value="All-Rounder">All-Rounder</option><option value="Keeper">Wicket Keeper</option>
                </select>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="label-xs">Bat Hand</label><select id="cp-bat-hand" class="form-input h-10 text-xs bg-white dark:bg-slate-900 border-none rounded-xl"><option value="Right">Right</option><option value="Left">Left</option></select></div>
                    <div><label class="label-xs">Bowl Hand</label><select id="cp-bowl-hand" class="form-input h-10 text-xs bg-white dark:bg-slate-900 border-none rounded-xl"><option value="Right">Right</option><option value="Left">Left</option></select></div>
                </div>
             </div>
             <div><label class="label-xs">Face Selection</label>${renderFaceSelectorHTML('cp')}</div>
          </div>

          <div class="bg-slate-100/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
             <div class="flex justify-between items-center mb-4">
                <span class="font-black text-blue-600 text-xs uppercase flex items-center gap-1"><span class="material-icons text-sm">sports_cricket</span> Batting</span>
                <select id="cp-bat-type" class="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg font-bold shadow-sm border-none"><option value="Balanced">Balanced</option><option value="Radical">Radical</option><option value="Brute">Brute</option><option value="Defensive">Defensive</option></select>
             </div>
             <div class="grid grid-cols-3 gap-4">${numInput('cp-timing','Timing')}${numInput('cp-aggression','Aggression')}${numInput('cp-technique','Technique')}</div>
          </div>

          <div id="cp-bowling-section" class="hidden bg-slate-100/50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
             <div class="flex justify-between items-center mb-4">
                <span class="font-black text-green-600 text-xs uppercase flex items-center gap-1"><span class="material-icons text-sm">sports_baseball</span> Bowling</span>
                <div class="flex gap-2">
                   <select id="cp-bowl-type" class="text-xs bg-white dark:bg-slate-800 px-2 py-1.5 rounded-lg font-bold shadow-sm" onchange="window.updateBowlingActions('cp')"><option value="Fast">Fast</option><option value="Medium">Medium</option><option value="Spin">Spin</option></select>
                   <select id="cp-bowl-action" class="text-xs bg-white dark:bg-slate-800 px-2 py-1.5 rounded-lg font-bold shadow-sm w-24"></select>
                </div>
             </div>
             <div class="grid grid-cols-2 gap-4">${numInput('cp-bowl-move','Movement')}${numInput('cp-bowl-skill','Accuracy')}</div>
          </div>

          <div><label class="label-xs">Jersey Number</label><input id="cp-jersey" type="number" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold" placeholder="18"></div>
          <button type="submit" class="btn w-full py-4 shadow-xl shadow-blue-500/20 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl transform active:scale-95 transition flex items-center justify-center gap-2">
             <span>SUBMIT REQUEST</span> <span class="material-icons text-sm">send</span>
          </button>
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
  
  const numInputCompact = (id, label) => `<div><label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">${label}</label><input id="${id}" type="number" min="0" max="99" class="form-input w-full h-9 text-xs font-bold bg-white dark:bg-slate-800 border-none rounded-lg text-center" placeholder="80"></div>`;

  return `
    <div class="max-w-4xl mx-auto pb-24 px-4 pt-6 animate-fade-in">
      <div class="flex justify-between items-center mb-6"><h1 class="text-3xl font-black text-slate-900 dark:text-white">Team Builder</h1><button onclick="window.router.navigateTo('/creator')" class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center"><span class="material-icons">arrow_back</span></button></div>
      
      <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-white/5 shadow-xl mb-6">
        <h2 class="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Step 1: Team Details</h2>
        <div class="grid sm:grid-cols-2 gap-5 mb-4"><div><label class="label-xs">Team Name</label><input id="ct-team-name" type="text" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold" placeholder="e.g. Stark XI"></div><div><label class="label-xs">Short Tag</label><input id="ct-team-short" type="text" maxlength="3" class="form-input w-full h-12 bg-white dark:bg-slate-900 border-none rounded-xl font-bold uppercase" placeholder="STK"></div></div>
        <div class="grid sm:grid-cols-2 gap-4"><div><label class="label-xs">Jersey File</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full h-12 pt-3 bg-white dark:bg-slate-900 border-none rounded-xl pl-3"></div><div><label class="label-xs">Logo File</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full h-12 pt-3 bg-white dark:bg-slate-900 border-none rounded-xl pl-3"></div></div>
      </div>

      <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-white/5 shadow-xl mb-8">
        <div class="flex justify-between items-center mb-4"><h2 class="text-xs font-black uppercase text-slate-400 tracking-widest">Step 2: Squad</h2><span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 px-3 py-1 rounded-full font-bold" id="squad-count">0/15</span></div>
        <button onclick="window.openPlayerModal()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 mb-4 flex items-center justify-center gap-2 transition active:scale-95"><span class="material-icons">person_add</span> Add Player</button>
        <div id="ct-players-list" class="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-2"><div class="text-center text-slate-400 text-xs py-6 italic">Squad is empty.</div></div>
      </div>
      <button onclick="window.submitCustomTeam()" class="btn w-full py-4 shadow-xl text-sm font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl transform active:scale-95 transition flex justify-center items-center gap-2"><span class="material-icons">check_circle</span> SUBMIT TEAM REQUEST</button>
    </div>

    <div id="player-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center p-0 sm:p-4 animate-fade-in">
       <div class="absolute inset-0 bg-black/80 backdrop-blur-md" onclick="window.closePlayerModal()"></div>
       <div class="relative bg-slate-50 dark:bg-slate-950 w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col">
          <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-3xl"><h3 class="font-black text-xl text-slate-900 dark:text-white">Add Player</h3><button onclick="window.closePlayerModal()" class="bg-slate-100 dark:bg-slate-800 p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-500 transition"><span class="material-icons">close</span></button></div>
          <div class="p-6 overflow-y-auto custom-scrollbar space-y-6 pb-24">
             <div class="grid grid-cols-2 gap-4"><input id="tp-name" class="form-input w-full font-bold h-12 bg-white dark:bg-slate-800 border-none rounded-xl" placeholder="Player Name"><input id="tp-jersey" type="number" class="form-input w-full h-12 bg-white dark:bg-slate-800 border-none rounded-xl" placeholder="Jersey No."></div>
             <select id="tp-type" class="form-input w-full font-bold h-12 bg-white dark:bg-slate-800 border-none rounded-xl" onchange="window.updateBowlingOptions('tp')"><option value="Batsman">Batsman</option><option value="Bowler">Bowler</option><option value="All-Rounder">All-Rounder</option><option value="Keeper">Wicket Keeper</option></select>
             <div class="grid grid-cols-2 gap-4"><select id="tp-bat-hand" class="form-input h-10 text-xs bg-white dark:bg-slate-800 border-none rounded-xl"><option value="Right">Right Bat</option><option value="Left">Left Bat</option></select><select id="tp-bowl-hand" class="form-input h-10 text-xs bg-white dark:bg-slate-800 border-none rounded-xl"><option value="Right">Right Bowl</option><option value="Left">Left Bowl</option></select></div>
             <div><label class="label-xs">Face ID</label>${renderFaceSelectorHTML('tp')}</div>
             <div class="bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"><div class="flex justify-between mb-4"><span class="font-bold text-blue-600 uppercase text-xs">Batting Skill</span><select id="tp-bat-type" class="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-bold"><option value="Balanced">Balanced</option><option value="Radical">Radical</option><option value="Brute">Brute</option><option value="Defensive">Defensive</option></select></div><div class="grid grid-cols-3 gap-2">${numInputCompact('tp-timing','Timing')}${numInputCompact('tp-aggression','Aggr')}${numInputCompact('tp-technique','Tech')}</div></div>
             <div id="tp-bowling-section" class="hidden bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"><div class="flex justify-between mb-4"><span class="font-bold text-green-600 uppercase text-xs">Bowling Skill</span><div class="flex gap-2"><select id="tp-bowl-type" class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg font-bold" onchange="window.updateBowlingActions('tp')"><option value="Fast">Fast</option><option value="Medium">Med</option><option value="Spin">Spin</option></select><select id="tp-bowl-action" class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg font-bold w-24"></select></div></div><div class="grid grid-cols-2 gap-2">${numInputCompact('tp-bowl-move','Movement')}${numInputCompact('tp-bowl-skill','Skill')}</div></div>
          </div>
          <div class="p-5 border-t border-slate-200 dark:border-slate-800 absolute bottom-0 w-full bg-white dark:bg-slate-900 rounded-b-3xl"><button onclick="window.addTeamPlayer()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition transform active:scale-95">Confirm & Add Player</button></div>
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
        <div class="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl mb-2 border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
           <div><span class="font-bold text-sm text-slate-900 dark:text-white">${i+1}. ${p.name} <span class="text-slate-500 text-xs font-medium uppercase ml-1">(${p.role})</span></span></div>
           <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg hover:bg-red-100 transition"><span class="material-icons text-sm">delete</span></button>
        </div>`).join('');
};
window.removeTeamPlayer = function(i) { window.teamBuilder.players.splice(i, 1); window.renderTeamPlayersList(); };

// --- SUBMIT TEAM ---
window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    const tName = document.getElementById('ct-team-name').value.trim();
    if(!tName || !window.teamBuilder.players.length) { alert("Missing Details"); return; }
    
    try {
        const j = document.getElementById('ct-jersey-file').files[0];
        const l = document.getElementById('ct-logo-file').files[0];
        const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]'); if(btn) btn.disabled = true;
        let jB = null, lB = null;
        if(j) jB = await window.readFileAsBase64(j); if(l) lB = await window.readFileAsBase64(l);
        
        const summary = window.teamBuilder.players.map((p, i) => generateBotSummary(p, i+1)).join('\n\n----------------\n\n');
        
        const data = {
            type: 'team', userId: window.currentUser.uid, email: window.currentUser.email, userName: window.currentUser.displayName,
            teamName: tName, teamShortName: document.getElementById('ct-team-short').value,
            mode: 'new', players: window.teamBuilder.players, 
            playerSummary: summary, // Use `playerSummary` for bot compatibility with your `custom-player.js` logic
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
      const isBowler = ['Bowler', 'All-Rounder'].includes(document.getElementById('cp-type').value);
      const faceDisplay = document.getElementById('cp-face-display');
      
      const teamInput = document.getElementById('cp-team').value;
      if (!teamInput) { alert("Please Select a Team"); return; }

      const p = {
          name: document.getElementById('cp-name').value,
          role: document.getElementById('cp-type').value,
          jersey: document.getElementById('cp-jersey').value || '0',
          face: faceDisplay.dataset.isCustom === "true" ? "Custom" : `Face ${faceDisplay.dataset.faceId || 'Random'}`,
          batHand: document.getElementById('cp-bat-hand').value, 
          bowlHand: document.getElementById('cp-bowl-hand').value,
          batStyle: document.getElementById('cp-bat-type').value, 
          batTiming: document.getElementById('cp-timing').value || '80',
          batAggression: document.getElementById('cp-aggression').value || '80',
          batTechnique: document.getElementById('cp-technique').value || '80',
          bowlStyle: isBowler ? document.getElementById('cp-bowl-type').value : 'N/A',
          bowlAction: isBowler ? document.getElementById('cp-bowl-action').value : 'N/A',
          bowlMovement: isBowler ? document.getElementById('cp-bowl-move').value || '0' : '0',
          bowlSkill: isBowler ? document.getElementById('cp-bowl-skill').value || '0' : '0'
      };

      // Add Email to Summary for Bot
      let summary = `Email: ${window.currentUser.email}\nGame: ${window.currentPlayerGame}\nTeam: ${teamInput}\n\n` + generateBotSummary(p);

      const data = {
        type: 'player', gameId: window.currentPlayerGame, userId: window.currentUser.uid, email: window.currentUser.email,
        userName: window.currentUser.displayName, createdAt: new Date().toISOString(),
        playerName: p.name,
        playerSummary: summary, // This is what the bot prints
        customFaceBase64: faceDisplay.dataset.isCustom === "true" ? window.tempCustomFaceBase64 : null
      };

      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      try { await fetch('/api/custom-player', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }); } catch(err){}
      alert("✅ Request Sent!"); window.router.navigateTo('/creator-history');
  } catch(e) { alert(e.message); }
};

window.setPlayerGame = function(id) { window.currentPlayerGame = id; window.router.handleRoute('/creator-player'); };

window.submitCustomJersey = async function(e){ e.preventDefault(); try{ const f=document.getElementById('cj-file').files[0]; if(!f) throw new Error("File?"); const b64=await window.readFileAsBase64(f); const d={type:'jersey',userId:window.currentUser.uid,teamName:document.getElementById('cj-team').value,createdAt:new Date().toISOString()}; await db.collection('modRequests').add({...d, status:'pending'}); await fetch('/api/custom-jersey', {method:'POST',body:JSON.stringify({...d, jerseyBase64:b64})}); alert("Sent!"); window.router.navigateTo('/creator-history'); }catch(x){alert(x.message);} };

// --- HISTORY PAGE (FIXED) ---
function CreatorHistoryPage() { 
    if (!window.currentUser) { setTimeout(()=>window.router.navigateTo('/'),50); return ''; } 
    if (window.historyUnsubscribe) window.historyUnsubscribe(); 
    setTimeout(()=>{ const c=document.getElementById('creator-history'); if(!c) return; window.historyUnsubscribe = db.collection('modRequests').where('userId','==',window.currentUser.uid).onSnapshot(s=>{ 
        if(s.empty) { c.innerHTML='<div class="text-center py-10 text-slate-400 font-bold">No requests yet. Start creating! 🚀</div>'; return; } 
        const docs = []; s.forEach(d => docs.push(d.data())); docs.sort((a,b)=>(b.timestamp?.toMillis?.()||0)-(a.timestamp?.toMillis?.()||0)); 
        c.innerHTML=docs.map(r=>{
            let showDownload = r.status === 'approved' && r.downloadUrl;
            let statusText = r.status === 'pending' ? 'Pending (Wait < 24h)' : r.status;
            let statusColor = r.status === 'approved' ? 'text-green-600 bg-green-100' : r.status === 'rejected' ? 'text-red-600 bg-red-100' : 'text-amber-600 bg-amber-100';
            let buttons = '';
            
            if(showDownload) buttons += `<a href="${r.downloadUrl}" target="_blank" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-500/30 mt-3 transition transform active:scale-95">Download Mod</a>`;
            if(r.status === 'pending') buttons += `<a href="${ADMIN_CONTACT_LINK}" target="_blank" class="block w-full text-center bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-2.5 rounded-xl mt-3 text-xs hover:bg-slate-200 transition">Help / Contact Admin</a>`;

            return `<div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm mb-4 animate-fade-in">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="font-black text-lg text-slate-900 dark:text-white">${r.type==='team'?r.teamName:r.playerName||r.teamName}</div>
                        <div class="text-xs text-slate-500 font-medium mt-1">${new Date(r.createdAt).toLocaleDateString()} · ${r.gameId || 'RC25'}</div>
                    </div>
                    <div class="text-[10px] uppercase font-bold px-3 py-1.5 rounded-full ${statusColor}">${statusText}</div>
                </div>
                ${buttons}
            </div>`;
        }).join(''); 
    }); },100); 
    return `<div class="max-w-4xl mx-auto pb-24 px-4 pt-6"><h1 class="text-3xl font-black mb-6 text-slate-900 dark:text-white">Request History</h1><div id="creator-history" class="space-y-4"></div></div>`; 
}

function CreatorPlansPage() { if(!window.currentUser) return ''; return `<div class="max-w-5xl mx-auto pb-20 px-4 pt-6"><h1 class="text-3xl font-black text-center mb-10">Choose Plan</h1><div class="grid md:grid-cols-3 gap-6">${['P100','P300','P1000'].map(c=>{const p=CREATOR_PLANS[c]; return `<div class="app-card p-6"><h3 class="text-xl font-black">${p.name}</h3><div class="text-3xl font-black text-blue-600 mt-2 mb-6">₹${p.priceINR}</div><button onclick="window.buyCreatorPlan('${c}')" class="btn w-full py-3 text-sm">Select</button></div>`}).join('')}</div></div>`; }

window.buyCreatorPlan = function(code) { const p = CREATOR_PLANS[code]; window.cart = [{ gameId: `sub_${code}`, gameName: 'Creator Sub', planName: p.name, price: p.priceINR, image: 'assets/icons/icon_site.jpg', subPlanCode: code }]; if(window.updateCartBadge) window.updateCartBadge(); window.router.navigateTo('/checkout'); };
window.checkCreatorSubBeforeRequest = function() { if(!window.creatorSub || window.creatorSub.status !== 'active') { if(confirm("Plan Required.")) window.router.navigateTo('/creator-plans'); return false; } if(window.creatorSub.maxRequests && window.creatorSub.usedRequests >= window.creatorSub.maxRequests) { alert("Limit reached."); return false; } return true; };
window.checkCreatorSubForTeam = function() { if(!window.checkCreatorSubBeforeRequest()) return false; if(window.creatorSub.planCode === 'P100') { if(confirm("Upgrade to Pro?")) window.buyCreatorPlan('P300'); return false; } return true; };
window.loadCreatorSubscription = function() { if(!window.currentUser) return; db.collection('creatorSubs').doc(window.currentUser.uid).onSnapshot(snap => { window.creatorSub = snap.data(); const el = document.getElementById('creator-sub-status'); if(el && window.creatorSub) { el.innerHTML = `<div class="flex items-center gap-2"><span class="material-icons text-green-500">verified</span> <span class="font-bold text-slate-700 dark:text-white">${window.creatorSub.planCode} Plan</span> · ${window.creatorSub.usedRequests}/${window.creatorSub.maxRequests||'∞'} Requests</div>`; const jLock = document.querySelector('#btn-feature-jersey .feature-lock-overlay'); const tLock = document.querySelector('#btn-feature-team .feature-lock-overlay'); if(window.creatorSub.status === 'active') { if(jLock) jLock.classList.add('hidden'); } if(window.creatorSub.planCode !== 'P100') { if(tLock) tLock.classList.add('hidden'); } } }); };
window.incrementCreatorUsage = async function() { if(!window.currentUser) return; db.collection('creatorSubs').doc(window.currentUser.uid).update({ usedRequests: firebase.firestore.FieldValue.increment(1) }); };
window.goToCreatorJersey = function() { if(window.checkCreatorSubBeforeRequest()) window.router.navigateTo('/creator-jersey'); };
window.goToCreatorTeam = function() { if(window.checkCreatorSubForTeam()) window.router.navigateTo('/creator-team'); };

// EXPORTS
window.CreatorPage = CreatorPage;
window.CreatorMenuUI = CreatorMenuUI;
window.CreatorPlayerPage = CreatorPlayerPage;
window.CreatorJerseyPage = CreatorJerseyPage;
window.CreatorTeamPage = CreatorTeamPage;
window.CreatorHistoryPage = CreatorHistoryPage;
window.CreatorPlansPage = CreatorPlansPage;
