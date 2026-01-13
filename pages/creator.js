// pages/creator.js

// --- CONFIGURATION ---
const CREATOR_PLANS = {
  P100: { code: 'P100', name: 'Starter', priceINR: 100, maxRequests: 20, periodDays: 30 },
  P300: { code: 'P300', name: 'Pro', priceINR: 300, maxRequests: 70, periodDays: 30 },
  P1000: { code: 'P1000', name: 'Elite', priceINR: 1000, maxRequests: null, periodDays: 60 }
};

const JERSEY_TESTER_LINK = 'https://www.mediafire.com/'; // Put your actual link here

const BOWLING_ACTIONS = {
  fast: ['Shaheen Afridi', 'Adam Milne', 'Mark Wood', 'Pat Cummins', 'Haris Rauf', 'Mitchell Starc', 'Jasprit Bumrah', 'Jofra Archer', 'Kagiso Rabada', 'Lasith Malinga'],
  medium: ['Arshdeep Singh', 'Hardik Pandya', 'Paul Collingwood', 'Bhuvneshwar Kumar', 'Shane Watson'],
  spin: ['Glenn Maxwell', 'Ravindra Jadeja', 'Axar Patel', 'Keshav Maharaj', 'Maheesh Theekshana', 'Shadab Khan', 'Kuldeep Yadav', 'Ish Sodhi', 'Yuzvendra Chahal', 'Wanindu Hasaranga', 'Shane Warne', 'Adam Zampa']
};

// --- GLOBAL STATE ---
window.creatorSub = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.teamBuilder = null;

function resetTeamBuilder() {
  window.teamBuilder = { 
      mode: 'new', 
      teamName: '', 
      teamShortName: '', 
      players: [] 
  };
}

/* ========================================================================
   1. MAIN ROUTER FUNCTION
   ======================================================================== */
function CreatorPage() {
  const path = window.location.pathname;
  if (path === '/creator-player') return CreatorPlayerPage();
  if (path === '/creator-jersey') return CreatorJerseyPage();
  if (path === '/creator-team')   return CreatorTeamPage();
  if (path === '/creator-history') return CreatorHistoryPage();
  if (path === '/creator-plans')  return CreatorPlansPage();
  return CreatorMenuUI();
}

/* ========================================================================
   2. MAIN MENU UI
   ======================================================================== */
function CreatorMenuUI() {
  if (!window.currentUser) {
    return `
      <div class="max-w-4xl mx-auto py-24 text-center animate-fade-in px-4">
        <div class="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
          <span class="material-icons text-5xl text-blue-600 dark:text-blue-400">build_circle</span>
        </div>
        <h1 class="text-3xl font-black mb-3 text-slate-900 dark:text-white drop-shadow-sm">Login Required</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-8 font-medium">Access premium Mod Creator tools.</p>
        <button onclick="window.googleLogin()" class="btn px-8 py-3 shadow-lg hover:scale-105 transition transform">
          Login with Google
        </button>
      </div>`;
  }

  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Mod Creator</h1>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Design Players, Jerseys & Teams.</p>
        </div>
        <button onclick="window.router.navigateTo('/creator-history')"
              class="px-5 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition shadow-sm flex items-center gap-2 w-fit">
          <span class="material-icons text-sm">history</span> Request History
        </button>
      </div>

      <div id="creator-sub-status" class="app-card p-6 mb-10 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <div class="flex items-center gap-3">
           <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
           <span class="text-sm font-bold text-slate-500">Loading plan...</span>
        </div>
      </div>

      <div class="grid sm:grid-cols-3 gap-6">
        
        <button class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden cursor-pointer" onclick="window.router.navigateTo('/creator-player')">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition"></div>
          <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 shadow-sm"><span class="material-icons text-3xl">person</span></div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Player</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Attributes, Faces, Actions.</p>
        </button>

        <button id="btn-feature-jersey" class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden cursor-pointer" onclick="window.goToCreatorJersey()">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition"></div>
          <div class="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400 shadow-sm"><span class="material-icons text-3xl">checkroom</span></div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Jersey</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Upload textures for any team.</p>
          <div class="feature-lock-overlay hidden absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl cursor-not-allowed">
             <span class="bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span class="material-icons text-xs">lock</span> Locked</span>
          </div>
        </button>

        <button id="btn-feature-team" class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden cursor-pointer" onclick="window.goToCreatorTeam()">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition"></div>
          <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 shadow-sm"><span class="material-icons text-3xl">groups</span></div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Team</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Build full squads (Pro/Elite).</p>
          <div class="feature-lock-overlay hidden absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl cursor-not-allowed">
             <span class="bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span class="material-icons text-xs">lock</span> Pro Only</span>
          </div>
        </button>
      </div>
    </div>
  `;
}

/* ========================================================================
   3. CUSTOM PLAYER PAGE
   ======================================================================== */
function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'rc25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `
    <button onclick="window.setPlayerGame('${id}')" class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${g === id ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}">
      ${label}
    </button>`;

  const slider = (id, label, color) => `
    <div>
      <div class="flex justify-between mb-1">
        <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">${label}</label>
        <span id="val-${id}" class="text-[10px] font-bold text-${color}-500">50</span>
      </div>
      <input id="${id}" type="range" min="1" max="100" value="50" oninput="document.getElementById('val-${id}').innerText = this.value" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${color}-500">
    </div>
  `;

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
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Team Name</label><input id="cp-team" type="text" class="form-input w-full" placeholder="e.g. India"></div>
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Player Name</label><input id="cp-name" type="text" class="form-input w-full" placeholder="Enter Name"></div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="col-span-2">
                  <label class="block text-xs font-bold mb-2 text-blue-600 uppercase">Role</label>
                  <select id="cp-type" class="form-input w-full font-bold" onchange="window.updateBowlingOptions('cp')">
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="all-rounder">All Rounder</option>
                    <option value="keeper">Wicket Keeper</option>
                  </select>
              </div>
              <div class="col-span-2">
                  <label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Face ID / Skin</label>
                  <input id="cp-face" type="text" class="form-input w-full" placeholder="1-80">
              </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Bat Hand</label><select id="cp-bat-hand" class="form-input w-full"><option value="right">Right</option><option value="left">Left</option></select></div>
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Bowl Hand</label><select id="cp-bowl-hand" class="form-input w-full"><option value="right">Right</option><option value="left">Left</option></select></div>
          </div>

          <div class="bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-md">
              <h3 class="text-xs font-black uppercase text-blue-500 mb-4 flex items-center gap-1"><span class="material-icons text-sm">sports_cricket</span> Batting Skill</h3>
              <div class="mb-4"><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Bat Style</label><select id="cp-bat-type" class="form-input w-full text-xs font-bold"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select></div>
              <div class="space-y-4">
                 ${slider('cp-timing', 'Timing (1-100)', 'blue')}
                 ${slider('cp-aggression', 'Aggression (1-100)', 'red')}
                 ${slider('cp-technique', 'Technique (1-100)', 'purple')}
              </div>
          </div>

          <div id="cp-bowling-section" class="hidden bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-md">
              <h3 class="text-xs font-black uppercase text-green-500 mb-4 flex items-center gap-1"><span class="material-icons text-sm">sports_baseball</span> Bowling Skill</h3>
              <div class="grid grid-cols-2 gap-4 mb-4">
                  <div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Bowl Style</label><select id="cp-bowl-type" class="form-input w-full text-xs" onchange="window.updateBowlingActions('cp')"><option value="fast">Fast</option><option value="medium">Medium</option><option value="off-spinner">Off Spin</option><option value="leg-spinner">Leg Spin</option></select></div>
                  <div><label class="block text-[10px] font-bold mb-1 text-slate-500 uppercase">Action</label><select id="cp-bowl-action" class="form-input w-full text-xs font-bold text-slate-700 dark:text-white"></select></div>
              </div>
              <div class="space-y-4">${slider('cp-bowl-move', 'Movement (Swing/Spin)', 'green')}${slider('cp-bowl-skill', 'Accuracy & Skill', 'orange')}</div>
          </div>

          <div><label class="block text-[10px] font-bold mb-1 text-slate-400 uppercase">Jersey Number</label><input id="cp-jersey" type="number" class="form-input w-full text-xs" placeholder="18"></div>
          <button type="submit" class="btn w-full py-4 shadow-lg shadow-blue-500/20 text-sm">Submit Request</button>
        </form>
      </div>
    </div>`;
}

/* ========================================================================
   4. CUSTOM TEAM PAGE (Enhanced Squad Builder)
   ======================================================================== */
function CreatorTeamPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  if (!window.teamBuilder) resetTeamBuilder();
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const sliderCompact = (id, label, color) => `
    <div class="flex items-center gap-2">
       <span class="text-[9px] font-bold w-12 text-slate-500 uppercase">${label}</span>
       <input id="${id}" type="range" min="1" max="100" value="70" class="flex-1 h-1 bg-slate-300 rounded appearance-none cursor-pointer accent-${color}-500" title="${label}">
    </div>`;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Team Builder</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600 bg-white/50 px-3 py-2 rounded-lg">Back</button>
      </div>

      <div class="app-card p-6 mb-6">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Step 1: Team Details</h2>
        <div class="grid sm:grid-cols-2 gap-5 mb-4">
           <div><label class="block text-xs font-bold mb-2 text-slate-500">Team Name</label><input id="ct-team-name" type="text" class="form-input w-full" placeholder="Your Team Name"></div>
           <div><label class="block text-xs font-bold mb-2 text-slate-500">Short Name</label><input id="ct-team-short" type="text" maxlength="3" class="form-input w-full uppercase" placeholder="RCB"></div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="block text-xs font-bold mb-2 text-slate-500">Jersey Texture</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full file:bg-slate-100 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-bold"></div>
          <div><label class="block text-xs font-bold mb-2 text-slate-500">Logo Image</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full file:bg-slate-100 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-bold"></div>
        </div>
      </div>

      <div class="app-card p-6 mb-8">
        <div class="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
             <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400">Step 2: Squad</h2>
             <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 px-2 py-1 rounded font-bold" id="squad-count">0/15</span>
        </div>
        
        <form onsubmit="window.addTeamPlayer(event)" class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
             <div class="col-span-2"><input id="tp-name" type="text" class="form-input w-full text-xs" placeholder="Player Name"></div>
             <div><input id="tp-jersey" type="number" class="form-input w-full text-xs" placeholder="No."></div>
             <div><select id="tp-type" class="form-input w-full text-xs" onchange="window.updateBowlingOptions('tp')"><option value="batsman">Batsman</option><option value="bowler">Bowler</option><option value="all-rounder">All Rounder</option><option value="keeper">Wicket Keeper</option></select></div>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <select id="tp-bat-hand" class="form-input w-full text-xs"><option value="right">Bat Right</option><option value="left">Bat Left</option></select>
              <select id="tp-bowl-hand" class="form-input w-full text-xs"><option value="right">Bowl Right</option><option value="left">Bowl Left</option></select>
              <select id="tp-bat-type" class="form-input w-full text-xs"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select>
              <input id="tp-face" type="text" class="form-input w-full text-xs" placeholder="Face ID">
          </div>

          <div class="grid sm:grid-cols-2 gap-4 mb-3 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
             <div class="space-y-2">
                <div class="text-[9px] font-bold text-blue-500 uppercase mb-1">Batting</div>
                ${sliderCompact('tp-timing', 'Time', 'blue')}
                ${sliderCompact('tp-aggression', 'Aggr', 'red')}
                ${sliderCompact('tp-technique', 'Tech', 'purple')}
             </div>
             <div id="tp-bowling-section" class="hidden space-y-2">
                <div class="text-[9px] font-bold text-green-500 uppercase mb-1">Bowling</div>
                <div class="grid grid-cols-2 gap-2 mb-1">
                    <select id="tp-bowl-type" class="form-input w-full text-[10px] py-1" onchange="window.updateBowlingActions('tp')">
                      <option value="fast">Fast</option><option value="medium">Med</option><option value="off-spinner">Off</option><option value="leg-spinner">Leg</option>
                    </select>
                    <select id="tp-bowl-action" class="form-input w-full text-[10px] py-1"></select>
                </div>
                ${sliderCompact('tp-bowl-move', 'Move', 'green')}
                ${sliderCompact('tp-bowl-skill', 'Skill', 'orange')}
             </div>
          </div>

          <button type="submit" class="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><span class="material-icons text-xs">add</span> Add to Squad</button>
        </form>

        <div id="ct-players-list" class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty.</div>
        </div>
      </div>

      <button onclick="window.submitCustomTeam()" class="btn w-full py-4 shadow-xl shadow-purple-500/20 text-sm">Submit Team Request</button>
    </div>`;
}

/* ========================================================================
   5. CUSTOM JERSEY PAGE
   ======================================================================== */
function CreatorJerseyPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex items-center justify-between mb-6">
         <h1 class="text-2xl font-black text-slate-900 dark:text-white">Custom Jersey</h1>
         <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600 bg-white/50 px-3 py-2 rounded-lg">Back</button>
      </div>
      <div class="app-card p-6 sm:p-8">
        <form onsubmit="window.submitCustomJersey(event)" class="space-y-6">
          <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Team Name</label><input id="cj-team" type="text" class="form-input w-full" placeholder="e.g. Mumbai Indians"></div>
          <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Jersey Texture (PNG/JPG)</label><input id="cj-file" type="file" accept="image/*" class="text-xs w-full file:bg-slate-100 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-700"></div>
          <button type="submit" class="btn w-full py-4 shadow-lg shadow-green-500/20 text-sm bg-gradient-to-r from-green-600 to-green-700">Submit Jersey</button>
        </form>
      </div>
    </div>`;
}

/* ========================================================================
   6. HISTORY & PLANS
   ======================================================================== */
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

/* ========================================================================
   8. HELPERS & LOGIC (FIXED)
   ======================================================================== */

// File Upload Fix
async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    if(!file) { reject(new Error("No file selected")); return; }
    if(file.size > 2 * 1024 * 1024) { reject(new Error("File too large (Max 2MB)")); return; }
    
    const reader = new FileReader();
    reader.onload = () => {
        if(reader.result) resolve(reader.result.split(',')[1]);
        else reject(new Error("File reading result empty"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Bowling Logic
window.updateBowlingOptions = function(prefix) {
    const role = document.getElementById(`${prefix}-type`).value;
    const section = document.getElementById(`${prefix}-bowling-section`);
    if(role === 'bowler' || role === 'all-rounder') {
        section.classList.remove('hidden');
        if(prefix === 'tp') section.classList.add('block');
        window.updateBowlingActions(prefix);
    } else {
        section.classList.add('hidden');
        if(prefix === 'tp') section.classList.remove('block');
    }
};

window.updateBowlingActions = function(prefix) {
    const style = document.getElementById(`${prefix}-bowl-type`).value;
    const select = document.getElementById(`${prefix}-bowl-action`);
    let key = 'medium';
    if(style === 'fast') key = 'fast'; else if(style.includes('spin')) key = 'spin';
    const actions = BOWLING_ACTIONS[key] || [];
    select.innerHTML = actions.map(a => `<option value="${a}">${a}</option>`).join('');
};

// Team Builder
window.addTeamPlayer = function (e) {
  e.preventDefault();
  if (!window.teamBuilder) resetTeamBuilder();
  if (window.teamBuilder.players.length >= 15) { alert('Squad full.'); return; }
  
  const role = document.getElementById('tp-type').value;
  const isBowler = role === 'bowler' || role === 'all-rounder';
  
  const p = {
      name: document.getElementById('tp-name').value.trim(),
      playerType: role,
      faceID: document.getElementById('tp-face').value || 'Random',
      jerseyNumber: document.getElementById('tp-jersey').value,
      battingHand: document.getElementById('tp-bat-hand').value,
      bowlingHand: document.getElementById('tp-bowl-hand').value,
      
      // Sliders & Details
      battingStyle: document.getElementById('tp-bat-type').value,
      battingTiming: document.getElementById('tp-timing').value,
      battingAggression: document.getElementById('tp-aggression').value,
      battingTechnique: document.getElementById('tp-technique').value,
      
      bowlingStyle: isBowler ? document.getElementById('tp-bowl-type').value : 'N/A',
      bowlingAction: isBowler ? document.getElementById('tp-bowl-action').value : 'N/A',
      bowlingMovement: isBowler ? document.getElementById('tp-bowl-move').value : 'N/A',
      bowlingSkill: isBowler ? document.getElementById('tp-bowl-skill').value : 'N/A'
  };
  
  if (!p.name) { alert('Enter Name'); return; }
  window.teamBuilder.players.push(p); e.target.reset(); 
  document.getElementById('tp-bowling-section').classList.add('hidden');
  window.renderTeamPlayersList();
};

window.renderTeamPlayersList = function () {
  const list = document.getElementById('ct-players-list');
  document.getElementById('squad-count').innerText = `${window.teamBuilder.players.length}/15`;
  list.innerHTML = window.teamBuilder.players.map((p, i) => `
      <div class="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs mb-1">
        <div><span class="font-bold">${i+1}. ${p.name}</span> <span class="text-slate-500">(${p.playerType})</span></div>
        <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 font-bold">X</button>
      </div>`).join('') || `<div class="text-center text-slate-400 text-xs py-4">Squad is empty.</div>`;
};
window.removeTeamPlayer = function(i) { window.teamBuilder.players.splice(i, 1); window.renderTeamPlayersList(); };

// --- SUBMIT PLAYER ---
window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  const btn = evt.target.querySelector('button[type="submit"]'); 
  if(btn) { btn.disabled = true; btn.innerText = 'Sending...'; }
  
  try {
      const role = document.getElementById('cp-type').value;
      const isBowler = role === 'bowler' || role === 'all-rounder';
      
      const data = {
        type: 'player', gameId: window.currentPlayerGame, userId: window.currentUser.uid, email: window.currentUser.email,
        userName: window.currentUser.displayName, createdAt: new Date().toISOString(),
        
        teamName: document.getElementById('cp-team').value, 
        playerName: document.getElementById('cp-name').value, 
        playerType: role,
        faceID: document.getElementById('cp-face').value || 'Random',
        jerseyNumber: document.getElementById('cp-jersey').value,
        
        battingHand: document.getElementById('cp-bat-hand').value, 
        battingStyle: document.getElementById('cp-bat-type').value,
        battingTiming: document.getElementById('cp-timing').value,
        battingAggression: document.getElementById('cp-aggression').value,
        battingTechnique: document.getElementById('cp-technique').value,
        
        bowlingHand: document.getElementById('cp-bowl-hand').value,
        bowlingStyle: isBowler ? document.getElementById('cp-bowl-type').value : 'N/A',
        bowlingAction: isBowler ? document.getElementById('cp-bowl-action').value : 'N/A',
        bowlingMovement: isBowler ? document.getElementById('cp-bowl-move').value : 'N/A',
        bowlingSkill: isBowler ? document.getElementById('cp-bowl-skill').value : 'N/A'
      };

      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      
      try { await fetch('/api/custom-player', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }); } catch(err){}

      alert("✅ Request Sent! It will be completed under 24 hours.");
      window.router.navigateTo('/creator-history');

  } catch(e) { alert("Error: " + (e.message || e)); if(btn) btn.disabled = false; }
};

// --- SUBMIT TEAM ---
window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    if(!window.teamBuilder || !window.teamBuilder.players.length) { alert("Squad is empty!"); return; }
    
    try {
        const jFile = document.getElementById('ct-jersey-file').files[0]; 
        const lFile = document.getElementById('ct-logo-file').files[0];
        
        if(!jFile || !lFile) throw new Error("Please upload both Jersey and Logo.");
        
        const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]'); 
        if(btn) btn.disabled = true;
        
        const jB = await readFileAsBase64(jFile); 
        const lB = await readFileAsBase64(lFile);
        
        const data = {
            type: 'team', 
            userId: window.currentUser.uid, 
            email: window.currentUser.email, 
            userName: window.currentUser.displayName,
            teamName: document.getElementById('ct-team-name').value, 
            teamShortName: document.getElementById('ct-team-short').value,
            mode: 'new', 
            players: window.teamBuilder.players, // This array now has full details
            createdAt: new Date().toISOString()
        };
        
        await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        await window.incrementCreatorUsage();
        
        try { 
            await fetch('/api/custom-team', { 
                method: 'POST', 
                headers: {'Content-Type': 'application/json'}, 
                body: JSON.stringify({ ...data, jerseyBase64: jB, logoBase64: lB }) 
            }); 
        } catch(err){ console.warn("API Error", err); }
        
        alert("✅ Request Sent! It will be completed under 24 hours.");
        window.router.navigateTo('/creator-history');
    } catch(e) { alert("Error: " + (e.message || e)); }
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
      alert("✅ Request Sent! It will be completed under 24 hours.");
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
