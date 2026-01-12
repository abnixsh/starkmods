// pages/creator.js

// --- PLAN CONFIG ---
const CREATOR_PLANS = {
  P100: {
    code: 'P100',
    name: 'Starter',
    priceINR: 100,
    maxRequests: 20,
    periodDays: 30,
    description: '20 credits · Custom Player only'
  },
  P300: {
    code: 'P300',
    name: 'Pro',
    priceINR: 300,
    maxRequests: 70,
    periodDays: 30,
    description: '70 credits · All Mod Creator features'
  },
  P1000: {
    code: 'P1000',
    name: 'Elite',
    priceINR: 1000,
    maxRequests: null, // unlimited
    periodDays: 60,
    description: 'Unlimited requests · 60 days'
  }
};

const JERSEY_TESTER_LINK = 'https://www.mediafire.com/'; // Update with your link

// Globals
window.creatorSub = null;
window.creatorPlansReason = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.teamBuilder = null;

function resetTeamBuilder() {
  window.teamBuilder = {
    mode: 'new',
    teamName: '',
    teamShortName: '',
    replaceTeamName: '',
    players: [] 
  };
}

/* =========================================
   1. MAIN DASHBOARD (MENU)
   ========================================= */

function CreatorPage() {
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
        
        <button class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden"
                onclick="window.router && window.router.navigateTo('/creator-player')">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition"></div>
          <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 shadow-sm">
             <span class="material-icons text-3xl">person</span>
          </div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Player</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Create players with custom skills & faces.</p>
        </button>

        <button id="btn-feature-jersey" 
                class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden"
                onclick="window.goToCreatorJersey()">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-green-500/20 rounded-full blur-2xl group-hover:bg-green-500/30 transition"></div>
          <div class="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400 shadow-sm">
             <span class="material-icons text-3xl">checkroom</span>
          </div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Jersey</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Upload textures for any team.</p>
          
          <div class="feature-lock-overlay hidden absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
             <span class="bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span class="material-icons text-xs">lock</span> Locked</span>
          </div>
        </button>

        <button id="btn-feature-team" 
                class="app-card p-6 text-left hover:scale-[1.02] transition group relative overflow-hidden"
                onclick="window.goToCreatorTeam()">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition"></div>
          <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 shadow-sm">
             <span class="material-icons text-3xl">groups</span>
          </div>
          <div class="font-black text-xl text-slate-900 dark:text-white mb-1">Custom Team</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Build full squads (Pro/Elite).</p>

          <div class="feature-lock-overlay hidden absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
             <span class="bg-black/80 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><span class="material-icons text-xs">lock</span> Pro Only</span>
          </div>
        </button>

      </div>
    </div>
  `;
}

/* =========================================
   2. CUSTOM PLAYER PAGE
   ========================================= */

function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'rc25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `
    <button onclick="window.setPlayerGame('${id}')" class="px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${g === id ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}">
      ${label}
    </button>`;

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

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div class="col-span-2 sm:col-span-1">
                  <label class="block text-xs font-bold mb-2 text-blue-600 uppercase">Role</label>
                  <select id="cp-type" class="form-input w-full font-bold">
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="all-rounder">All Rounder</option>
                    <option value="keeper">Wicket Keeper</option>
                  </select>
              </div>
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Bat Hand</label><select id="cp-bat-hand" class="form-input w-full"><option value="right">Right</option><option value="left">Left</option></select></div>
              <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Bowl Hand</label><select id="cp-bowl-hand" class="form-input w-full"><option value="right">Right</option><option value="left">Left</option></select></div>
          </div>

          <div class="bg-slate-50/50 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div class="grid grid-cols-2 gap-4 mb-4">
                  <div><label class="block text-[10px] font-bold mb-1 text-slate-400 uppercase">Bat Style</label><select id="cp-bat-type" class="form-input w-full text-xs"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option></select></div>
                  <div><label class="block text-[10px] font-bold mb-1 text-slate-400 uppercase">Bowl Style</label><select id="cp-bowl-type" class="form-input w-full text-xs"><option value="fast-med">Fast Med</option><option value="faster">Fast</option><option value="off-spinner">Off Spin</option><option value="leg-spinner">Leg Spin</option></select></div>
              </div>
              <div><label class="block text-[10px] font-bold mb-1 text-slate-400 uppercase">Jersey Number</label><input id="cp-jersey" type="number" class="form-input w-full text-xs" placeholder="18"></div>
          </div>

          <button type="submit" class="btn w-full py-4 shadow-lg shadow-blue-500/20 text-sm">Submit Request</button>
        </form>
      </div>
    </div>`;
}

/* =========================================
   3. CUSTOM JERSEY PAGE
   ========================================= */

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
        <div class="mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50 flex items-start gap-3">
            <span class="material-icons text-green-600 mt-0.5">tips_and_updates</span>
            <div class="text-xs text-green-800 dark:text-green-200 leading-relaxed">
               <span class="font-bold">Tip:</span> Use our <a href="${JERSEY_TESTER_LINK}" target="_blank" class="underline font-bold hover:text-green-600">Jersey Tester App</a> to design your kit, then export the PNG and upload it here.
            </div>
        </div>
        <form onsubmit="window.submitCustomJersey(event)" class="space-y-6">
          <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Team Name</label><input id="cj-team" type="text" class="form-input w-full" placeholder="e.g. Mumbai Indians"></div>
          <div><label class="block text-xs font-bold mb-2 text-slate-500 uppercase">Jersey Texture (PNG/JPG)</label><input id="cj-file" type="file" accept="image/*" class="text-xs w-full file:bg-slate-100 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-700"></div>
          <button type="submit" class="btn w-full py-4 shadow-lg shadow-green-500/20 text-sm bg-gradient-to-r from-green-600 to-green-700">Submit Jersey</button>
        </form>
      </div>
    </div>`;
}

/* =========================================
   4. CUSTOM TEAM PAGE (Fixed & Styled)
   ========================================= */

function CreatorTeamPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  if (!window.teamBuilder) resetTeamBuilder();
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">Team Builder</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600 bg-white/50 px-3 py-2 rounded-lg">Back</button>
      </div>

      <div class="app-card p-6 mb-6">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Step 1: Team Details</h2>
        <div class="grid sm:grid-cols-2 gap-5 mb-4">
           <div><label class="block text-xs font-bold mb-2 text-slate-500">Team Name</label><input id="ct-team-name" type="text" class="form-input w-full" placeholder="Stark XI"></div>
           <div><label class="block text-xs font-bold mb-2 text-slate-500">Short Name (3 chars)</label><input id="ct-team-short" type="text" maxlength="3" class="form-input w-full uppercase" placeholder="STK"></div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="block text-xs font-bold mb-2 text-slate-500">Jersey Texture</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full file:bg-slate-100 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-bold"></div>
          <div><label class="block text-xs font-bold mb-2 text-slate-500">Logo Image</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full file:bg-slate-100 file:border-0 file:rounded-lg file:px-3 file:py-1 file:text-xs file:font-bold"></div>
        </div>
      </div>

      <div class="app-card p-6 mb-8">
        <div class="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
             <h2 class="text-sm font-bold uppercase tracking-widest text-slate-400">Step 2: Squad</h2>
             <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 px-2 py-1 rounded font-bold" id="squad-count">0/12</span>
        </div>

        <form onsubmit="window.addTeamPlayer(event)" class="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
             <div class="col-span-2"><input id="tp-name" type="text" class="form-input w-full text-xs" placeholder="Player Name"></div>
             <div><input id="tp-jersey" type="number" class="form-input w-full text-xs" placeholder="No."></div>
             <div>
                <select id="tp-type" class="form-input w-full text-xs">
                  <option value="batsman">Bat</option><option value="bowler">Bowl</option><option value="all-rounder">AR</option><option value="keeper">WK</option>
                </select>
             </div>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <select id="tp-bat-hand" class="form-input w-full text-xs"><option value="right">R Bat</option><option value="left">L Bat</option></select>
              <select id="tp-bowl-hand" class="form-input w-full text-xs"><option value="right">R Bowl</option><option value="left">L Bowl</option></select>
              <select id="tp-bat-type" class="form-input w-full text-xs"><option value="balanced">Balanced</option><option value="brute">Brute</option></select>
              <select id="tp-bowl-type" class="form-input w-full text-xs"><option value="fast-med">Fast</option><option value="off-spinner">Spin</option></select>
          </div>

          <button type="submit" class="mt-3 w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition">
            <span class="material-icons text-xs">add</span> Add to Squad
          </button>
        </form>

        <div id="ct-players-list" class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty. Add players above.</div>
        </div>
      </div>

      <button onclick="window.submitCustomTeam()" class="btn w-full py-4 shadow-xl shadow-purple-500/20 text-sm">
        Submit Team Request
      </button>
    </div>`;
}

/* =========================================
   5. HISTORY PAGE
   ========================================= */

function CreatorHistoryPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/'), 50); return ''; }
  if (window.historyUnsubscribe) window.historyUnsubscribe();
  
  setTimeout(() => {
    const container = document.getElementById('creator-history');
    if(!container) return;
    
    // SAFE QUERY: Removed limit() to fix "index required" error
    window.historyUnsubscribe = db.collection('modRequests')
      .where('userId', '==', window.currentUser.uid)
      .onSnapshot(snap => {
         if(snap.empty) { container.innerHTML = '<div class="text-center py-8 text-slate-400">No requests yet.</div>'; return; }
         
         const docs = [];
         snap.forEach(d => docs.push(d.data()));
         // Sort Client Side
         docs.sort((a,b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));

         let html = '';
         docs.forEach(r => {
            let statusClass = 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
            let statusText = 'Checking (Wait 24h)';
            
            if (r.status === 'approved') {
                statusClass = 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
                statusText = 'Approved';
            } else if (r.status === 'rejected') {
                statusClass = 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
                statusText = 'Rejected';
            }

            let title = r.type === 'team' ? `Team: ${r.teamName}` : r.type === 'jersey' ? `Jersey: ${r.teamName}` : `Player: ${r.playerName}`;
            
            html += `
              <div class="app-card p-4 flex justify-between items-start gap-4">
                 <div>
                    <div class="font-bold text-slate-900 dark:text-white text-sm mb-1">${title}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-2">
                       ${r.gameId ? r.gameId.toUpperCase() : 'RC25'} · ${new Date(r.createdAt).toLocaleDateString()}
                    </div>
                    ${r.downloadUrl ? `<a href="${r.downloadUrl}" target="_blank" class="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Download Mod <span class="material-icons text-[10px]">download</span></a>` : ''}
                 </div>
                 <div class="text-[9px] uppercase font-bold px-2 py-1 rounded border ${statusClass} whitespace-nowrap">
                    ${statusText}
                 </div>
              </div>`;
         });
         container.innerHTML = html;
      });
  }, 100);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-6">
         <h1 class="text-2xl font-black text-slate-900 dark:text-white">History</h1>
         <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600 bg-white/50 px-3 py-2 rounded-lg">Back</button>
      </div>
      <div id="creator-history" class="space-y-4">
         <div class="text-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
      </div>
    </div>`;
}

/* =========================================
   6. LOGIC, FIXES & SUBMISSION
   ========================================= */

// --- TEAM BUILDER LOGIC ---
window.addTeamPlayer = function (e) {
  e.preventDefault();
  if (!window.teamBuilder) resetTeamBuilder();
  if (window.teamBuilder.players.length >= 12) { alert('Squad full (Max 12).'); return; }

  const p = {
      name: document.getElementById('tp-name').value.trim(),
      playerType: document.getElementById('tp-type').value,
      jerseyNumber: document.getElementById('tp-jersey').value,
      battingHand: document.getElementById('tp-bat-hand').value,
      bowlingHand: document.getElementById('tp-bowl-hand').value,
      batsmanType: document.getElementById('tp-bat-type').value,
      bowlerType: document.getElementById('tp-bowl-type').value
  };

  if (!p.name) { alert('Enter Player Name'); return; }

  window.teamBuilder.players.push(p);
  e.target.reset(); 
  window.renderTeamPlayersList();
};

window.renderTeamPlayersList = function () {
  const list = document.getElementById('ct-players-list');
  const countEl = document.getElementById('squad-count');
  const players = window.teamBuilder.players;
  
  if(countEl) countEl.innerText = `${players.length}/12`;

  if (!players.length) {
    list.innerHTML = `<div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty.</div>`;
    return;
  }

  list.innerHTML = players.map((p, i) => `
      <div class="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs">
        <div class="flex items-center gap-2">
           <span class="bg-slate-200 dark:bg-slate-700 w-5 h-5 flex items-center justify-center rounded-full font-mono text-[10px] font-bold">${i+1}</span>
           <div>
              <span class="font-bold text-slate-800 dark:text-slate-200">${p.name}</span>
              <span class="text-[10px] text-slate-500 uppercase ml-1">${p.playerType}</span>
           </div>
        </div>
        <button onclick="window.removeTeamPlayer(${i})" class="text-red-400 hover:text-red-600"><span class="material-icons text-sm">close</span></button>
      </div>`).join('');
};

window.removeTeamPlayer = function(i) {
    window.teamBuilder.players.splice(i, 1);
    window.renderTeamPlayersList();
};

// --- SUBMIT TEAM (FIXED) ---
window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    
    if(!window.teamBuilder || !window.teamBuilder.players) {
        alert("Please add players to the squad.");
        return;
    }
    
    const players = window.teamBuilder.players;
    if(players.length === 0) { 
        alert("Squad is empty! Add at least one player."); 
        return; 
    }

    try {
        const jFile = document.getElementById('ct-jersey-file').files[0];
        const lFile = document.getElementById('ct-logo-file').files[0];
        if(!jFile || !lFile) throw new Error("Please upload Jersey and Logo.");

        const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]');
        if(btn) { btn.disabled = true; btn.innerText = "Uploading..."; }

        const jerseyBase64 = await readFileAsBase64(jFile);
        const logoBase64 = await readFileAsBase64(lFile);

        const data = {
            type: 'team',
            userId: window.currentUser.uid,
            email: window.currentUser.email,
            userName: window.currentUser.displayName,
            teamName: document.getElementById('ct-team-name').value,
            teamShortName: document.getElementById('ct-team-short').value,
            mode: 'new',
            players: players,
            createdAt: new Date().toISOString()
        };

        await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        await window.incrementCreatorUsage();
        
        // Use try/catch for fetch to avoid crash on network error
        try {
            await fetch('/api/custom-team', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ ...data, jerseyBase64, logoBase64 })
            });
        } catch(err) { console.warn("API Error:", err); }

        alert("✅ Request Sent Successfully! It will be completed under 24 hours. Check History for updates.");
        window.router.navigateTo('/creator-history');

    } catch(e) {
        alert("Error: " + (e.message || e));
        const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]');
        if(btn) { btn.disabled = false; btn.innerText = "Submit Team Request"; }
    }
};

// --- SUBMIT PLAYER (FIXED) ---
window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;

  const btn = evt.target.querySelector('button[type="submit"]'); 
  if(btn) { btn.disabled = true; btn.innerText = 'Sending...'; }

  try {
      const data = {
        type: 'player', gameId: window.currentPlayerGame, userId: window.currentUser.uid, email: window.currentUser.email,
        userName: window.currentUser.displayName, teamName: document.getElementById('cp-team').value, 
        playerName: document.getElementById('cp-name').value, playerType: document.getElementById('cp-type').value, 
        battingHand: document.getElementById('cp-bat-hand').value, bowlingHand: document.getElementById('cp-bowl-hand').value, 
        jerseyNumber: document.getElementById('cp-jersey').value,
        batsmanType: document.getElementById('cp-bat-type').value, 
        bowlerType: document.getElementById('cp-bowl-type').value, 
        createdAt: new Date().toISOString()
      };

      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      
      try {
          await fetch('/api/custom-player', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
      } catch(err) { console.warn("API Error:", err); }

      alert("✅ Request Sent Successfully! It will be completed under 24 hours. Check History for updates.");
      window.router.navigateTo('/creator-history');

  } catch(e) { 
      alert("Error: " + (e.message || e)); 
      if(btn) { btn.disabled = false; btn.innerText = 'Submit Request'; }
  }
};

// --- SUBMIT JERSEY (FIXED) ---
window.submitCustomJersey = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  try {
      const file = document.getElementById('cj-file').files[0];
      if(!file) throw new Error("Select a file");
      const base64 = await readFileAsBase64(file);
      
      const data = {
        type: 'jersey', gameId: window.currentJerseyGame, userId: window.currentUser.uid, email: window.currentUser.email,
        userName: window.currentUser.displayName, teamName: document.getElementById('cj-team').value, createdAt: new Date().toISOString()
      };
      
      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      
      try {
          await fetch('/api/custom-jersey', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...data, jerseyBase64: base64}) });
      } catch(err) { console.warn("API Error:", err); }

      alert("✅ Request Sent Successfully! It will be completed under 24 hours. Check History for updates.");
      window.router.navigateTo('/creator-history');
  } catch(e) { alert("Error: " + (e.message || e)); }
};

// --- UTILS ---
async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Subscription Checks (Keep previous logic but ensure it's defined)
window.checkCreatorSubBeforeRequest = function() {
    if(!window.creatorSub || window.creatorSub.status !== 'active') { 
        alert("Active subscription required!"); 
        window.router.navigateTo('/creator-plans'); 
        return false; 
    }
    if(window.creatorSub.maxRequests && window.creatorSub.usedRequests >= window.creatorSub.maxRequests) { 
        alert("Limit reached! Upgrade plan."); 
        return false; 
    }
    return true;
};

window.checkCreatorSubForTeam = function() {
    if(!window.checkCreatorSubBeforeRequest()) return false;
    if(window.creatorSub.planCode === 'P100') { 
        alert("Team Creator is locked for Starter Plan. Upgrade to Pro/Elite."); 
        return false; 
    }
    return true;
};

window.loadCreatorSubscription = function() {
    if(!window.currentUser) return;
    db.collection('creatorSubs').doc(window.currentUser.uid).onSnapshot(snap => {
        window.creatorSub = snap.data();
        const el = document.getElementById('creator-sub-status');
        if(el && window.creatorSub) {
            el.innerHTML = renderSubStatusHtml(window.creatorSub);
            styleFeatureButtonsForSub(window.creatorSub);
        }
    });
};

window.incrementCreatorUsage = async function() {
    if(!window.currentUser) return;
    db.collection('creatorSubs').doc(window.currentUser.uid).update({ usedRequests: firebase.firestore.FieldValue.increment(1) });
};

// Ensure renderSubStatusHtml & styleFeatureButtonsForSub are defined (copy from previous if missing, or use these simple versions):
function renderSubStatusHtml(sub) {
    if(!sub || sub.status !== 'active') return `<span class="text-red-500 font-bold">No Active Plan</span>`;
    return `<div class="flex items-center gap-2"><span class="material-icons text-green-500">verified</span> <span class="font-bold text-slate-700 dark:text-white">${sub.planCode} Plan</span> · ${sub.usedRequests}/${sub.maxRequests||'∞'} Requests</div>`;
}

function styleFeatureButtonsForSub(sub) {
    const isPro = sub && sub.status === 'active' && (sub.planCode === 'P300' || sub.planCode === 'P1000');
    const isActive = sub && sub.status === 'active';
    
    const jLock = document.querySelector('.feature-lock-overlay'); // Jersey lock
    const tLock = document.querySelectorAll('.feature-lock-overlay')[1]; // Team lock (second button)
    
    if(isActive && jLock) jLock.classList.add('hidden');
    if(isPro && tLock) tLock.classList.add('hidden');
}

// --- EXPORTS ---
window.CreatorPage = CreatorPage;
window.CreatorPlayerPage = CreatorPlayerPage;
window.CreatorJerseyPage = CreatorJerseyPage;
window.CreatorTeamPage = CreatorTeamPage;
window.CreatorHistoryPage = CreatorHistoryPage;
