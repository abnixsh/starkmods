// pages/creator.js

// --- 1. TEAM DATA CONFIGURATION ---
const TEAMS_DATA = {
  International: [
    "India", "Australia", "England", "West Indies", "Pakistan", "New Zealand", 
    "Sri Lanka", "South Africa", "Bangladesh", "Afghanistan", "Scotland", 
    "Namibia", "Netherlands", "PNG", "UAE", "USA", "Japan"
  ],
  Masters: [
    "India Legends", "Australia Legends", "England Legends", "Zimbabwe Legends", 
    "Pakistan Legends", "NZ Legends", "West Indies Legends", "South Africa Legends"
  ],
  Leagues: {
    IPL: ["CSK", "Mumbai Indians", "RCB", "KKR", "SRH", "Rajasthan Royals", "Delhi Capitals", "Punjab Kings", "Lucknow Super Giants", "Gujarat Titans"],
    PSL: ["Islamabad United", "Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Quetta Gladiators"],
    BBL: ["Adelaide Strikers", "Brisbane Heat", "Hobart Hurricanes", "Melbourne Renegades", "Melbourne Stars", "Perth Scorchers", "Sydney Sixers", "Sydney Thunder"],
    BPL: ["Comilla Victorians", "Rangpur Riders", "Sylhet Strikers", "Fortune Barishal", "Dhaka Dominators", "Chattogram Challengers", "Khulna Tigers"],
    CPL: ["Barbados Royals", "Guyana Amazon Warriors", "Jamaica Tallawahs", "St Kitts & Nevis Patriots", "Saint Lucia Kings", "Trinbago Knight Riders"],
    SA20: ["Durban's Super Giants", "Joburg Super Kings", "MI Cape Town", "Paarl Royals", "Pretoria Capitals", "Sunrisers Eastern Cape"],
    ILT20: ["Abu Dhabi Knight Riders", "Desert Vipers", "Dubai Capitals", "Gulf Giants", "MI Emirates", "Sharjah Warriors"],
    MLC: ["L.A. Knight Riders", "MI New York", "San Francisco Unicorns", "Seattle Orcas", "Texas Super Kings", "Washington Freedom"],
    TheHundred: ["Birmingham Phoenix", "London Spirit", "Manchester Originals", "Northern Superchargers", "Oval Invincibles", "Southern Brave", "Trent Rockets", "Welsh Fire"]
  }
};

const CREATOR_PLANS = {
  P100: { code: 'P100', name: 'Starter', priceINR: 100, maxRequests: 20 },
  P300: { code: 'P300', name: 'Pro', priceINR: 300, maxRequests: 70 },
  P1000: { code: 'P1000', name: 'Elite', priceINR: 1000, maxRequests: null }
};

const JERSEY_TESTER_LINK = 'https://www.mediafire.com/'; 

// Globals
window.creatorSub = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.historyUnsubscribe = null;
window.teamBuilder = null;

function resetTeamBuilder() {
  window.teamBuilder = {
    mode: 'new', teamName: '', teamShortName: '', replaceTeamName: '', players: []
  };
}

// --- MAIN CREATOR PAGE ---
function CreatorPage() {
  if (!window.currentUser) {
    return `<div class="max-w-4xl mx-auto py-20 text-center animate-fade-in">
        <h1 class="text-2xl font-bold mb-4">Login Required</h1>
        <button onclick="window.googleLogin()" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Login with Google</button>
      </div>`;
  }
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Mod Creator</h1>
        <button onclick="window.router.navigateTo('/creator-history')" class="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <span class="material-icons text-sm">history</span> Request History
        </button>
      </div>

      <div id="creator-sub-status" class="glass mb-8 p-4 text-center text-slate-500 text-sm rounded-xl">Loading subscription...</div>

      <div class="grid sm:grid-cols-3 gap-5">
        <button onclick="window.router.navigateTo('/creator-player')" class="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 text-left hover:shadow-lg transition">
           <div class="text-blue-600 mb-2"><span class="material-icons text-3xl">person</span></div>
           <div class="font-bold text-lg text-slate-900 dark:text-white">Custom Player</div>
           <div class="text-xs text-slate-500">Create players with skills & custom faces.</div>
        </button>

        <button onclick="window.goToCreatorJersey()" class="p-6 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-200 text-left hover:shadow-lg transition">
           <div class="text-green-600 mb-2"><span class="material-icons text-3xl">checkroom</span></div>
           <div class="font-bold text-lg text-slate-900 dark:text-white">Custom Jersey</div>
           <div class="text-xs text-slate-500">Upload textures for any team.</div>
        </button>

        <button onclick="window.goToCreatorTeam()" class="p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 text-left hover:shadow-lg transition">
           <div class="text-purple-600 mb-2"><span class="material-icons text-3xl">groups</span></div>
           <div class="font-bold text-lg text-slate-900 dark:text-white">Custom Team</div>
           <div class="text-xs text-slate-500">Build full squads (Pro/Elite only).</div>
        </button>
      </div>
    </div>`;
}

// --- CUSTOM PLAYER PAGE ---
function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'rc25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `
    <button onclick="window.setPlayerGame('${id}')" class="px-4 py-1.5 rounded-full border text-xs font-bold transition ${g === id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}">
      ${label}
    </button>`;

  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Custom Player</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600">Back</button>
      </div>
      
      <div class="mb-6 flex gap-2">${gameBtn('rc25', 'RC25')}${gameBtn('rc24', 'RC24')}${gameBtn('rcswipe', 'RC Swipe')}</div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <form onsubmit="window.submitCustomPlayer(event)" class="space-y-6 text-sm">
          
          <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
             <h3 class="font-bold text-xs text-blue-600 uppercase mb-3">1. Select Team</h3>
             <div class="grid sm:grid-cols-2 gap-4">
                <div>
                   <label class="block font-bold mb-1 text-xs">Category</label>
                   <select id="team-category" class="form-input" onchange="window.updateTeamOptions()">
                      <option value="">Select Category</option>
                      <option value="International">International</option>
                      <option value="Leagues">Leagues (IPL, PSL...)</option>
                      <option value="Masters">Masters / Legends</option>
                   </select>
                </div>
                
                <div id="league-container" class="hidden">
                   <label class="block font-bold mb-1 text-xs">Select League</label>
                   <select id="team-league" class="form-input" onchange="window.updateTeamOptions()">
                      <option value="">Select League</option>
                      ${Object.keys(TEAMS_DATA.Leagues).map(l => `<option value="${l}">${l}</option>`).join('')}
                   </select>
                </div>

                <div id="team-select-container" class="hidden sm:col-span-2">
                   <label class="block font-bold mb-1 text-xs">Select Team</label>
                   <select id="cp-team-select" class="form-input bg-blue-50 dark:bg-slate-800 border-blue-200">
                      <option value="">-- Choose Team --</option>
                   </select>
                </div>
                
                <div class="sm:col-span-2">
                   <label class="flex items-center gap-2 mt-2 text-xs text-slate-500 cursor-pointer">
                      <input type="checkbox" id="manual-team-check" onchange="document.getElementById('manual-team-input').classList.toggle('hidden')"> 
                      My team is not listed (Type manually)
                   </label>
                   <input id="manual-team-input" type="text" class="form-input mt-2 hidden" placeholder="Type custom team name...">
                </div>
             </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
             <div><label class="block font-bold mb-1">Player Name</label><input id="cp-name" type="text" class="form-input" placeholder="e.g. Virat Kohli"></div>
             <div><label class="block font-bold mb-1">Jersey Number</label><input id="cp-jersey" type="number" class="form-input" placeholder="18"></div>
          </div>

          <div class="grid sm:grid-cols-3 gap-4">
             <div>
                <label class="block font-bold mb-1 text-blue-600">Player Role</label>
                <select id="cp-type" class="form-input" onchange="window.toggleSkillFields('cp')">
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="keeper">Wicket Keeper</option>
                  <option value="all-rounder">All Rounder</option>
                </select>
             </div>
             <div><label class="block font-bold mb-1">Batting Hand</label><select id="cp-bat-hand" class="form-input"><option value="right">Right Hand</option><option value="left">Left Hand</option></select></div>
             <div><label class="block font-bold mb-1">Bowling Hand</label><select id="cp-bowl-hand" class="form-input"><option value="right">Right Arm</option><option value="left">Left Arm</option></select></div>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div id="cp-bat-skills" class="grid sm:grid-cols-2 gap-4 mb-4">
                 <div><label class="block font-bold text-xs">Bat Style</label><select id="cp-bat-type" class="form-input text-xs"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select></div>
                 <div><label class="block font-bold text-xs">Timing (0-100)</label><input id="cp-timing" type="number" class="form-input text-xs" placeholder="85"></div>
                 <div><label class="block font-bold text-xs">Aggression</label><input id="cp-aggression" type="range" class="w-full" min="0" max="100"></div>
                 <div><label class="block font-bold text-xs">Technique</label><input id="cp-technique" type="range" class="w-full" min="0" max="100"></div>
              </div>

              <div id="cp-bowl-skills" class="hidden grid sm:grid-cols-2 gap-4">
                 <div><label class="block font-bold text-xs">Bowl Type</label><select id="cp-bowl-type" class="form-input text-xs"><option value="fast-med">Fast Med</option><option value="faster">Fast</option><option value="off-spinner">Off Spin</option><option value="leg-spinner">Leg Spin</option></select></div>
                 <div><label class="block font-bold text-xs">Action</label><select id="cp-bowl-action" class="form-input text-xs"><option value="standard">Standard</option><option value="sling">Sling</option><option value="high-arm">High Arm</option></select></div>
                 <div class="sm:col-span-2"><label class="block font-bold text-xs">Bowling Accuracy/Skill</label><input id="cp-bowl-skill" type="range" class="w-full" min="0" max="100"></div>
              </div>
          </div>

          ${window.currentPlayerGame === 'rc25' ? `
          <div class="border-t pt-4 border-slate-100 dark:border-slate-700">
             <label class="block font-bold mb-2">Face Selection</label>
             <div class="flex flex-wrap items-center gap-4">
                <select id="cp-face" class="form-input w-40"><option value="">Face ID (1-80)</option>${Array.from({length:80},(_,i)=>`<option value="${i+1}">Face ${i+1}</option>`).join('')}</select>
                <div class="text-xs text-slate-400">OR</div>
                <label class="flex items-center gap-2 text-xs font-bold cursor-pointer">
                   <input type="checkbox" id="cp-use-custom-face" onchange="document.getElementById('cp-custom-file').disabled = !this.checked"> Upload Custom Face
                </label>
             </div>
             <input type="file" id="cp-custom-file" accept="image/*" class="mt-2 text-xs w-full" disabled>
          </div>` : ''}

          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg text-lg">Submit Request</button>
        </form>
      </div>
    </div>`;
}

// --- TEAM CREATOR PAGE ---
function CreatorTeamPage() {
    if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
    if (!window.teamBuilder) resetTeamBuilder();
    
    return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-24">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Custom Team Builder</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500">Back</button>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl p-5 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="grid sm:grid-cols-2 gap-5 mb-4">
           <div><label class="block font-bold text-xs mb-1">Team Name</label><input id="ct-team-name" type="text" class="form-input" placeholder="Stark XI"></div>
           <div><label class="block font-bold text-xs mb-1">Short Name (3 chars)</label><input id="ct-team-short" type="text" maxlength="3" class="form-input uppercase" placeholder="STK"></div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="block font-bold text-xs mb-1">Jersey</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full"></div>
          <div><label class="block font-bold text-xs mb-1">Logo</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full"></div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-xl p-5 mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
         <h2 class="text-sm font-bold uppercase tracking-wide text-slate-400 mb-4">Add Players to Squad</h2>
         <form onsubmit="window.addTeamPlayer(event)" class="space-y-4 text-sm border-b pb-4 mb-4 border-slate-100 dark:border-slate-700">
           <div class="grid sm:grid-cols-2 gap-3">
             <input id="tp-name" type="text" class="form-input" placeholder="Name">
             <input id="tp-jersey" type="number" class="form-input" placeholder="Jersey #">
           </div>
           <div class="grid sm:grid-cols-3 gap-3">
             <select id="tp-type" class="form-input"><option value="batsman">Batsman</option><option value="bowler">Bowler</option><option value="all-rounder">All Rounder</option><option value="keeper">WK</option></select>
             <select id="tp-bat-hand" class="form-input"><option value="right">R Bat</option><option value="left">L Bat</option></select>
             <select id="tp-bowl-hand" class="form-input"><option value="right">R Bowl</option><option value="left">L Bowl</option></select>
           </div>
           <button type="submit" class="w-full bg-blue-100 text-blue-700 font-bold py-2 rounded">Add Player</button>
         </form>
         <div id="ct-players-list" class="space-y-2 max-h-[300px] overflow-y-auto"><div class="text-center text-slate-400 italic">No players added.</div></div>
      </div>
      <button onclick="window.submitCustomTeam()" class="w-full bg-purple-600 text-white py-4 rounded-xl font-bold">Submit Team Request</button>
    </div>`;
}

// --- JERSEY PAGE ---
function CreatorJerseyPage() {
    if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
    return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20">
      <div class="flex items-center justify-between mb-4"><h1 class="text-2xl font-bold">Custom Jersey</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500">Back</button></div>
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <form onsubmit="window.submitCustomJersey(event)" class="space-y-4">
          <div><label class="block font-bold mb-1">Team Name</label><input id="cj-team" type="text" class="form-input" placeholder="e.g. Mumbai Indians"></div>
          <div><label class="block font-bold mb-1">Texture</label><input id="cj-file" type="file" accept="image/*" class="text-xs w-full"></div>
          <button type="submit" class="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Submit</button>
        </form>
      </div>
    </div>`;
}

// --- HISTORY PAGE (FIXED) ---
function CreatorHistoryPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/'), 50); return ''; }
  if (window.historyUnsubscribe) window.historyUnsubscribe();
  
  setTimeout(() => {
    const container = document.getElementById('creator-history');
    if(!container) return;
    window.historyUnsubscribe = db.collection('modRequests')
      .where('userId', '==', window.currentUser.uid)
      .onSnapshot(snap => {
         if(snap.empty) { container.innerHTML = '<div class="text-center py-8 text-slate-400">No requests yet.</div>'; return; }
         const docs = [];
         snap.forEach(d => docs.push(d.data()));
         docs.sort((a,b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
         let html = '';
         docs.forEach(r => {
            let statusClass = r.status === 'approved' ? 'text-green-600 border-green-200 bg-green-50' : r.status === 'rejected' ? 'text-red-600 border-red-200 bg-red-50' : 'text-amber-600 border-amber-200 bg-amber-50';
            html += `<div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm mb-3">
                 <div class="flex justify-between">
                    <div class="font-bold text-slate-800 dark:text-slate-200">${r.playerName || r.teamName} <span class="text-xs font-normal text-slate-500">(${r.type})</span></div>
                    <div class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${statusClass}">${r.status}</div>
                 </div>
                 ${r.downloadUrl ? `<a href="${r.downloadUrl}" target="_blank" class="mt-2 block text-center bg-blue-600 text-white text-xs font-bold py-2 rounded">Download</a>` : ''}
              </div>`;
         });
         container.innerHTML = html;
      });
  }, 100);

  return `<div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">History</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 px-3 py-1 rounded">Back</button></div>
      <div id="creator-history" class="space-y-3"><div class="text-center py-10">Loading...</div></div>
  </div>`;
}

// --- HELPER FUNCTIONS ---
window.updateTeamOptions = function() {
  const category = document.getElementById('team-category').value;
  const leagueSelect = document.getElementById('team-league');
  const leagueContainer = document.getElementById('league-container');
  const teamSelect = document.getElementById('cp-team-select');
  const teamContainer = document.getElementById('team-select-container');
  
  teamSelect.innerHTML = '<option value="">-- Choose Team --</option>';
  leagueContainer.classList.add('hidden');
  teamContainer.classList.add('hidden');

  let teams = [];
  if (category === 'International') { teams = TEAMS_DATA.International; teamContainer.classList.remove('hidden'); }
  else if (category === 'Masters') { teams = TEAMS_DATA.Masters; teamContainer.classList.remove('hidden'); }
  else if (category === 'Leagues') {
    leagueContainer.classList.remove('hidden');
    const l = leagueSelect.value;
    if (l && TEAMS_DATA.Leagues[l]) { teams = TEAMS_DATA.Leagues[l]; teamContainer.classList.remove('hidden'); }
  }
  teams.forEach(t => { const o = document.createElement('option'); o.value = t; o.innerText = t; teamSelect.appendChild(o); });
};

window.toggleSkillFields = function(prefix) {
    const type = document.getElementById(prefix + '-type').value;
    const b = document.getElementById(prefix + '-bat-skills');
    const w = document.getElementById(prefix + '-bowl-skills');
    if(['batsman','keeper','all-rounder'].includes(type)) b.classList.remove('hidden'); else b.classList.add('hidden');
    if(['bowler','all-rounder'].includes(type)) w.classList.remove('hidden'); else w.classList.add('hidden');
};

async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- SUBMISSION LOGIC ---
window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  const btn = evt.target.querySelector('button'); btn.disabled = true; btn.innerText = 'Sending...';

  try {
      const manualTeam = document.getElementById('manual-team-input').value;
      const selectTeam = document.getElementById('cp-team-select').value;
      const finalTeam = (!document.getElementById('manual-team-check').checked && selectTeam) ? selectTeam : manualTeam;
      
      if(!finalTeam) throw new Error("Please select or type a Team Name.");

      const data = {
        type: 'player', gameId: window.currentPlayerGame, userId: window.currentUser.uid, email: window.currentUser.email,
        userName: window.currentUser.displayName, teamName: finalTeam, playerName: document.getElementById('cp-name').value,
        playerType: document.getElementById('cp-type').value, battingHand: document.getElementById('cp-bat-hand').value,
        bowlingHand: document.getElementById('cp-bowl-hand').value, jerseyNumber: document.getElementById('cp-jersey').value,
        batsmanType: document.getElementById('cp-bat-type').value, timing: document.getElementById('cp-timing').value,
        aggression: document.getElementById('cp-aggression').value, technique: document.getElementById('cp-technique').value,
        bowlerType: document.getElementById('cp-bowl-type').value, bowlingAction: document.getElementById('cp-bowl-action').value,
        bowlingSkill: document.getElementById('cp-bowl-skill').value, faceId: document.getElementById('cp-face') ? document.getElementById('cp-face').value : null,
        createdAt: new Date().toISOString()
      };

      const faceC = document.getElementById('cp-use-custom-face');
      if (faceC && faceC.checked) {
          const f = document.getElementById('cp-custom-file').files[0];
          if(f) { data.customFaceBase64 = await readFileAsBase64(f); data.useCustomFace = true; }
      }

      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      await fetch('/api/custom-player', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });

      alert("✅ Request Sent!");
      window.router.navigateTo('/creator-history');
  } catch(e) { alert(e.message); btn.disabled = false; btn.innerText = 'Submit'; }
};

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
      await fetch('/api/custom-jersey', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...data, jerseyBase64: base64}) });
      alert("✅ Sent!"); window.router.navigateTo('/creator-history');
  } catch(e) { alert(e.message); }
};

window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    try {
        const j = document.getElementById('ct-jersey-file').files[0];
        const l = document.getElementById('ct-logo-file').files[0];
        if(!j || !l) throw new Error("Upload Jersey & Logo");
        const data = {
            type: 'team', userId: window.currentUser.uid, email: window.currentUser.email, userName: window.currentUser.displayName,
            teamName: document.getElementById('ct-team-name').value, teamShortName: document.getElementById('ct-team-short').value,
            mode: 'new', players: window.teamBuilder.players, createdAt: new Date().toISOString()
        };
        const jB = await readFileAsBase64(j); const lB = await readFileAsBase64(l);
        await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        await window.incrementCreatorUsage();
        await fetch('/api/custom-team', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ ...data, jerseyBase64: jB, logoBase64: lB }) });
        alert("✅ Team Request Sent!"); window.router.navigateTo('/creator-history');
    } catch(e) { alert(e.message); }
};

// --- SUBSCRIPTION LOGIC ---
window.checkCreatorSubBeforeRequest = function() {
    if(!window.creatorSub || window.creatorSub.status !== 'active') { alert("Active subscription required!"); window.router.navigateTo('/creator-plans'); return false; }
    if(window.creatorSub.maxRequests && window.creatorSub.usedRequests >= window.creatorSub.maxRequests) { alert("Limit reached!"); return false; }
    return true;
};
window.checkCreatorSubForTeam = function() {
    if(!window.checkCreatorSubBeforeRequest()) return false;
    if(window.creatorSub.planCode === 'P100') { alert("Upgrade to Pro/Elite for Teams."); return false; }
    return true;
};
window.loadCreatorSubscription = function() {
    if(!window.currentUser) return;
    db.collection('creatorSubs').doc(window.currentUser.uid).onSnapshot(snap => {
        window.creatorSub = snap.data();
        const el = document.getElementById('creator-sub-status');
        if(el && window.creatorSub) el.innerHTML = `<span class="text-green-600 font-bold">Plan: ${window.creatorSub.planCode}</span> · Used: ${window.creatorSub.usedRequests}/${window.creatorSub.maxRequests||'∞'}`;
    });
};
window.incrementCreatorUsage = async function() {
    if(!window.currentUser) return;
    db.collection('creatorSubs').doc(window.currentUser.uid).update({ usedRequests: firebase.firestore.FieldValue.increment(1) });
};
window.addTeamPlayer = function(e){ e.preventDefault(); 
    const p={name:document.getElementById('tp-name').value, jerseyNumber:document.getElementById('tp-jersey').value, playerType:document.getElementById('tp-type').value, battingHand:document.getElementById('tp-bat-hand').value, bowlingHand:document.getElementById('tp-bowl-hand').value};
    if(!p.name) return; window.teamBuilder.players.push(p); document.getElementById('ct-players-list').innerHTML = window.teamBuilder.players.map(pl=>`<div class="bg-slate-100 p-2 text-xs rounded">${pl.name} (${pl.playerType})</div>`).join(''); e.target.reset();
};
window.goToCreatorJersey = function() { if(window.checkCreatorSubBeforeRequest()) window.router.navigateTo('/creator-jersey'); };
window.goToCreatorTeam = function() { if(window.checkCreatorSubForTeam()) window.router.navigateTo('/creator-team'); };
window.setPlayerGame = function(id) { window.currentPlayerGame = id; window.router.handleRoute('/creator-player'); };

// EXPORTS
window.CreatorPage = CreatorPage;
window.CreatorPlayerPage = CreatorPlayerPage;
window.CreatorJerseyPage = CreatorJerseyPage;
window.CreatorTeamPage = CreatorTeamPage;
window.CreatorHistoryPage = CreatorHistoryPage;
