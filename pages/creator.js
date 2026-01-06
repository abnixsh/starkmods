// pages/creator.js

// --- 1. CONFIGURATION & DATA ---

// Team Lists for the Dropdowns
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

// --- 2. GLOBAL STATE ---
window.creatorSub = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.historyUnsubscribe = null;
window.teamBuilder = null;

function resetTeamBuilder() {
  window.teamBuilder = {
    mode: 'new',
    teamName: '',
    teamShortName: '',
    replaceTeamName: '',
    players: [] // Array to hold squad
  };
}

/* =========================================
   3. MAIN DASHBOARD (MENU)
   ========================================= */

function CreatorPage() {
  if (!window.currentUser) {
    return `
      <div class="max-w-4xl mx-auto py-20 text-center animate-fade-in">
        <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="material-icons text-4xl text-blue-600 dark:text-blue-400">build</span>
        </div>
        <h1 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Login Required</h1>
        <p class="text-slate-500 mb-6 text-sm">Login with Google to use the Mod Creator tools.</p>
        <button onclick="window.googleLogin()" class="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-50 transition">
          Login with Google
        </button>
      </div>`;
  }

  // Load Sub Status
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Mod Creator</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Create custom content for your game.</p>
        </div>
        <button onclick="window.router.navigateTo('/creator-history')"
              class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition">
          <span class="material-icons text-sm">history</span> Request History
        </button>
      </div>

      <div id="creator-sub-status" class="glass mb-8 text-sm p-4 min-h-[80px] flex items-center justify-center text-slate-400">
        <div class="animate-pulse">Loading subscription...</div>
      </div>

      <div class="grid sm:grid-cols-3 gap-5">
        <button class="group p-6 rounded-2xl border border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                onclick="window.router && window.router.navigateTo('/creator-player')">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-200 dark:bg-blue-800 rounded-full text-blue-700 dark:text-blue-100"><span class="material-icons text-2xl">person</span></div>
            <div>
              <div class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">Custom Player</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Create player with skills & face.</div>
            </div>
          </div>
        </button>

        <button class="group p-6 rounded-2xl border border-green-500 bg-green-50 dark:bg-green-900/10 text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                onclick="window.goToCreatorJersey()">
          <div class="flex items-center gap-4">
             <div class="p-3 bg-green-200 dark:bg-green-800 rounded-full text-green-700 dark:text-green-100"><span class="material-icons text-2xl">checkroom</span></div>
            <div class="flex-1">
              <div class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">Custom Jersey</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload textures for any team.</div>
            </div>
          </div>
        </button>

        <button class="group p-6 rounded-2xl border border-purple-500 bg-purple-50 dark:bg-purple-900/10 text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                onclick="window.goToCreatorTeam()">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-200 dark:bg-purple-800 rounded-full text-purple-700 dark:text-purple-100"><span class="material-icons text-2xl">groups</span></div>
            <div class="flex-1">
              <div class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">Custom Team</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Build full squad (Pro/Elite).</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  `;
}

/* =========================================
   4. CUSTOM PLAYER PAGE
   ========================================= */

function CreatorPlayerPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  const g = window.currentPlayerGame || 'rc25';
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  const gameBtn = (id, label) => `
    <button onclick="window.setPlayerGame('${id}')" class="px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition ${g === id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'}">
      ${label}
    </button>`;

  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Custom Player</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600">Back</button>
      </div>

      <div class="mb-6 flex flex-wrap gap-2">${gameBtn('rc25', 'RC25')}${gameBtn('rc24', 'RC24')}${gameBtn('rcswipe', 'RC Swipe')}</div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <form onsubmit="window.submitCustomPlayer(event)" class="space-y-5 text-sm">
          
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

          <div class="grid sm:grid-cols-2 gap-5">
              <div><label class="block font-bold mb-1.5">Player Name</label><input id="cp-name" type="text" class="form-input" placeholder="Enter name"></div>
              <div><label class="block font-bold mb-1.5">Jersey Number</label><input id="cp-jersey" type="number" class="form-input" placeholder="e.g. 18"></div>
          </div>

          <div class="grid sm:grid-cols-3 gap-5">
              <div>
                  <label class="block font-bold mb-1.5 text-blue-600">Player Type</label>
                  <select id="cp-type" class="form-input" onchange="window.toggleSkillFields('cp')">
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="keeper">Wicket Keeper</option>
                    <option value="all-rounder">All Rounder</option>
                  </select>
              </div>
              <div><label class="block font-bold mb-1.5">Batting Hand</label><select id="cp-bat-hand" class="form-input"><option value="right">Right Hand</option><option value="left">Left Hand</option></select></div>
              <div><label class="block font-bold mb-1.5">Bowling Hand</label><select id="cp-bowl-hand" class="form-input"><option value="right">Right Hand</option><option value="left">Left Hand</option></select></div>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 class="font-bold text-xs text-slate-500 uppercase mb-3">Attributes & Skills</h3>
              
              <div id="cp-bat-skills" class="grid sm:grid-cols-2 gap-4 mb-4">
                  <div><label class="block font-bold mb-1 text-xs">Bat Style</label><select id="cp-bat-type" class="form-input text-xs"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select></div>
                  <div><label class="block font-bold mb-1 text-xs">Timing (0-100)</label><input id="cp-timing" type="number" min="0" max="100" class="form-input text-xs" placeholder="85"></div>
                  <div class="sm:col-span-2">
                     <div class="flex justify-between mb-1"><label class="block font-bold text-xs">Aggression</label><span class="text-xs text-slate-400">Low &mdash; High</span></div>
                     <input id="cp-aggression" type="range" class="w-full accent-blue-600" min="0" max="100" value="50">
                  </div>
                  <div class="sm:col-span-2">
                     <div class="flex justify-between mb-1"><label class="block font-bold text-xs">Technique</label><span class="text-xs text-slate-400">Poor &mdash; Perfect</span></div>
                     <input id="cp-technique" type="range" class="w-full accent-blue-600" min="0" max="100" value="70">
                  </div>
              </div>

              <div id="cp-bowl-skills" class="hidden grid sm:grid-cols-2 gap-4">
                  <div><label class="block font-bold mb-1 text-xs">Bowl Style</label><select id="cp-bowl-type" class="form-input text-xs"><option value="fast-med">Fast-Medium</option><option value="faster">Fast</option><option value="med-pacer">Medium</option><option value="off-spinner">Off Spin</option><option value="leg-spinner">Leg Spin</option></select></div>
                  <div><label class="block font-bold mb-1 text-xs">Action</label><select id="cp-bowl-action" class="form-input text-xs"><option value="standard">Standard</option><option value="sling">Slingy</option><option value="high-arm">High Arm</option><option value="weird">Unorthodox</option></select></div>
                  <div class="sm:col-span-2">
                     <div class="flex justify-between mb-1"><label class="block font-bold text-xs">Bowling Skill / Accuracy</label><span class="text-xs text-slate-400">Low &mdash; Deadly</span></div>
                     <input id="cp-bowl-skill" type="range" class="w-full accent-red-600" min="0" max="100" value="75">
                  </div>
              </div>
          </div>

          ${window.currentPlayerGame === 'rc25' ? `
          <div class="flex items-center gap-4 border-t pt-4 border-slate-100 dark:border-slate-700">
             <div class="flex-1">
                <label class="block font-bold mb-2">Face Selection (1-80)</label>
                <select id="cp-face" class="form-input w-full"><option value="">Default / Select ID</option>${Array.from({length:80},(_,i)=>`<option value="${i+1}">Face ${i+1}</option>`).join('')}</select>
             </div>
             <div class="flex-1 border-l pl-4 border-slate-200 dark:border-slate-700">
                <label class="flex items-center gap-2 text-xs font-bold mb-2 cursor-pointer">
                   <input type="checkbox" id="cp-use-custom-face" onchange="document.getElementById('cp-custom-file').disabled = !this.checked" class="accent-blue-600"> Use Custom Face
                </label>
                <input type="file" id="cp-custom-file" accept="image/*" class="text-xs w-full" disabled>
             </div>
          </div>` : ''}

          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95">
            Submit Request
          </button>
        </form>
      </div>
    </div>`;
}

/* =========================================
   5. CUSTOM TEAM PAGE (FULL VERSION)
   ========================================= */

function CreatorTeamPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  if (!window.teamBuilder) resetTeamBuilder();
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-24">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Custom Team Builder</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600">Back</button>
      </div>

      <div id="creator-sub-status" class="glass mb-6 text-xs p-3">Loading...</div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6 shadow-sm">
        <h2 class="text-sm font-bold uppercase tracking-wide text-slate-400 mb-4">Step 1: Team Details</h2>
        <div class="grid sm:grid-cols-2 gap-5 mb-4">
           <div><label class="block font-bold text-xs mb-1">Team Name</label><input id="ct-team-name" type="text" class="form-input" placeholder="Stark XI"></div>
           <div><label class="block font-bold text-xs mb-1">Short Name (3 chars)</label><input id="ct-team-short" type="text" maxlength="3" class="form-input uppercase" placeholder="STK"></div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div><label class="block font-bold text-xs mb-1">Jersey Texture</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full"></div>
          <div><label class="block font-bold text-xs mb-1">Team Logo</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full"></div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mb-6 shadow-sm">
        <div class="flex justify-between items-center mb-4">
             <h2 class="text-sm font-bold uppercase tracking-wide text-slate-400">Step 2: Add Squad</h2>
             <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-mono" id="squad-count">0/15 Players</span>
        </div>

        <form onsubmit="window.addTeamPlayer(event)" class="space-y-4 text-sm border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
          <div class="grid sm:grid-cols-3 gap-3">
             <div class="sm:col-span-2"><input id="tp-name" type="text" class="form-input" placeholder="Player Name"></div>
             <div><input id="tp-jersey" type="number" class="form-input" placeholder="Jersey #"></div>
          </div>
          
          <div class="grid sm:grid-cols-3 gap-3">
              <select id="tp-type" class="form-input" onchange="window.toggleSkillFields('tp')">
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All Rounder</option>
                  <option value="keeper">Wicket Keeper</option>
              </select>
              <select id="tp-bat-hand" class="form-input"><option value="right">R Hand Bat</option><option value="left">L Hand Bat</option></select>
              <select id="tp-bowl-hand" class="form-input"><option value="right">R Arm Bowl</option><option value="left">L Arm Bowl</option></select>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-xs">
              
              <div id="tp-bat-skills" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <select id="tp-bat-type" class="form-input text-xs"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option><option value="defensive">Defensive</option></select>
                  <input id="tp-timing" type="number" placeholder="Timing (0-100)" class="form-input text-xs">
                  <div class="col-span-2 flex flex-col justify-center">
                     <label class="text-[10px] text-slate-400 mb-1">Aggression & Technique</label>
                     <div class="flex gap-2">
                        <input id="tp-aggression" type="range" class="w-1/2 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" title="Aggression">
                        <input id="tp-technique" type="range" class="w-1/2 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" title="Technique">
                     </div>
                  </div>
              </div>

              <div id="tp-bowl-skills" class="hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <select id="tp-bowl-type" class="form-input text-xs"><option value="med-pacer">Medium</option><option value="faster">Fast</option><option value="off-spinner">Off Spin</option><option value="leg-spinner">Leg Spin</option></select>
                  <select id="tp-bowl-action" class="form-input text-xs"><option value="standard">Standard</option><option value="sling">Sling</option><option value="high-arm">High Arm</option></select>
                  <div class="col-span-2 flex flex-col justify-center">
                     <label class="text-[10px] text-slate-400 mb-1">Bowling Skill</label>
                     <input id="tp-bowl-skill" type="range" class="w-full h-1 bg-red-200 rounded-lg appearance-none cursor-pointer">
                  </div>
              </div>
          </div>

          <button type="submit" class="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 px-4 py-3 rounded-lg text-xs font-bold flex items-center gap-1 w-full justify-center shadow-sm">
            <span class="material-icons text-sm">add</span> Add Player to Squad
          </button>
        </form>

        <div id="ct-players-list" class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty. Add players above.</div>
        </div>
      </div>

      <button onclick="window.submitCustomTeam()" class="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold shadow-xl text-lg mb-10">
        Submit Team Request
      </button>
    </div>`;
}

/* =========================================
   6. CUSTOM JERSEY PAGE
   ========================================= */

function CreatorJerseyPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  setTimeout(() => { if (window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20">
      <div class="flex items-center justify-between mb-4">
         <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Custom Jersey</h1>
         <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold text-slate-500 hover:text-blue-600">Back</button>
      </div>

      <div id="creator-sub-status" class="glass mb-4 text-xs p-3">Loading...</div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div class="mb-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800 flex items-start gap-3">
            <span class="material-icons text-green-600 mt-0.5">tips_and_updates</span>
            <div class="text-xs text-green-800 dark:text-green-200">
               <span class="font-bold">Tip:</span> Use our <a href="${JERSEY_TESTER_LINK}" target="_blank" class="underline font-bold">Jersey Tester App</a> to design your kit, then export the PNG and upload it here.
            </div>
        </div>
        <form onsubmit="window.submitCustomJersey(event)" class="space-y-4 text-sm">
          <div><label class="block font-bold mb-1">Team Name</label><input id="cj-team" type="text" class="form-input" placeholder="e.g. Mumbai Indians"></div>
          <div><label class="block font-bold mb-1">Jersey Texture (PNG/JPG)</label><input id="cj-file" type="file" accept="image/*" class="text-xs w-full"></div>
          <button type="submit" class="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg">Submit Jersey</button>
        </form>
      </div>
    </div>`;
}

/* =========================================
   7. HISTORY PAGE (FIXED)
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
            let statusClass = r.status === 'approved' ? 'text-green-600 border-green-200 bg-green-50' : r.status === 'rejected' ? 'text-red-600 border-red-200 bg-red-50' : 'text-amber-600 border-amber-200 bg-amber-50';
            let title = r.type === 'team' ? `Team: ${r.teamName}` : r.type === 'jersey' ? `Jersey: ${r.teamName}` : `Player: ${r.playerName}`;
            
            html += `
              <div class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm mb-3">
                 <div class="flex justify-between items-start">
                    <div>
                        <div class="font-bold text-slate-800 dark:text-slate-200">${title}</div>
                        <div class="text-xs text-slate-500">${new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${statusClass}">${r.status}</div>
                 </div>
                 ${r.downloadUrl ? `<a href="${r.downloadUrl}" target="_blank" class="mt-2 block text-center bg-blue-600 text-white text-xs font-bold py-2 rounded">Download Mod</a>` : ''}
              </div>`;
         });
         container.innerHTML = html;
      });
  }, 100);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold">History</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 px-3 py-1 rounded">Back</button></div>
      <div id="creator-history" class="space-y-3"><div class="text-center py-10">Loading...</div></div>
    </div>`;
}

/* =========================================
   8. HELPERS & LOGIC
   ========================================= */

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

// Shows/Hides Batting/Bowling fields based on Player Type
window.toggleSkillFields = function(prefix) {
    const type = document.getElementById(prefix + '-type').value;
    const b = document.getElementById(prefix + '-bat-skills');
    const w = document.getElementById(prefix + '-bowl-skills');
    if(!b || !w) return;

    if(['batsman','keeper','all-rounder'].includes(type)) b.classList.remove('hidden'); else b.classList.add('hidden');
    if(['bowler','all-rounder'].includes(type)) w.classList.remove('hidden'); else w.classList.add('hidden');
};

// Adds a player to the Team Builder Squad array
window.addTeamPlayer = function(e){ 
    e.preventDefault(); 
    if(!window.teamBuilder) resetTeamBuilder();
    if (window.teamBuilder.players.length >= 15) { alert('Squad full (Max 15).'); return; }

    const p = {
        name: document.getElementById('tp-name').value, 
        jerseyNumber: document.getElementById('tp-jersey').value, 
        playerType: document.getElementById('tp-type').value, 
        battingHand: document.getElementById('tp-bat-hand').value, 
        bowlingHand: document.getElementById('tp-bowl-hand').value,
        // Advanced Skills
        batsmanType: document.getElementById('tp-bat-type').value,
        timing: document.getElementById('tp-timing').value,
        aggression: document.getElementById('tp-aggression').value,
        technique: document.getElementById('tp-technique').value,
        bowlerType: document.getElementById('tp-bowl-type').value,
        bowlingAction: document.getElementById('tp-bowl-action').value,
        bowlingSkill: document.getElementById('tp-bowl-skill').value
    };

    if(!p.name) { alert("Enter Player Name"); return; }
    
    window.teamBuilder.players.push(p); 
    
    // Render list
    document.getElementById('ct-players-list').innerHTML = window.teamBuilder.players.map((pl, i) => `
        <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded px-3 py-2 text-xs mb-1">
           <div><span class="font-bold">${i+1}. ${pl.name}</span> <span class="text-slate-500">(${pl.playerType})</span></div>
           <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 font-bold">X</button>
        </div>
    `).join('');
    
    e.target.reset();
    window.toggleSkillFields('tp');
};

window.removeTeamPlayer = function(index) {
    if(window.teamBuilder && window.teamBuilder.players) {
        window.teamBuilder.players.splice(index, 1);
        // Re-render
        const list = document.getElementById('ct-players-list');
        list.innerHTML = window.teamBuilder.players.map((pl, i) => `
            <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded px-3 py-2 text-xs mb-1">
               <div><span class="font-bold">${i+1}. ${pl.name}</span> <span class="text-slate-500">(${pl.playerType})</span></div>
               <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 font-bold">X</button>
            </div>
        `).join('') || '<div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty.</div>';
    }
};

async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* =========================================
   9. SUBMISSION HANDLERS
   ========================================= */

window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;
  const btn = evt.target.querySelector('button[type="submit"]'); 
  btn.disabled = true; btn.innerText = 'Sending...';

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
        
        // Advanced
        batsmanType: document.getElementById('cp-bat-type').value, 
        timing: document.getElementById('cp-timing').value,
        aggression: document.getElementById('cp-aggression').value, 
        technique: document.getElementById('cp-technique').value,
        bowlerType: document.getElementById('cp-bowl-type').value, 
        bowlingAction: document.getElementById('cp-bowl-action').value,
        bowlingSkill: document.getElementById('cp-bowl-skill').value, 
        
        faceId: document.getElementById('cp-face') ? document.getElementById('cp-face').value : null,
        createdAt: new Date().toISOString()
      };

      const faceC = document.getElementById('cp-use-custom-face');
      if (faceC && faceC.checked) {
          const f = document.getElementById('cp-custom-file').files[0];
          if(f) { 
              if(f.size > 500*1024) throw new Error("Face Image too large (Max 500KB)");
              data.customFaceBase64 = await readFileAsBase64(f); 
              data.useCustomFace = true; 
          }
      }

      await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
      await window.incrementCreatorUsage();
      await fetch('/api/custom-player', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });

      alert("✅ Request Sent!");
      window.router.navigateTo('/creator-history');

  } catch(e) { 
      alert(e.message); 
      btn.disabled = false; btn.innerText = 'Submit Request'; 
  }
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

/* =========================================
   10. SUBSCRIPTION CHECKS
   ========================================= */

window.checkCreatorSubBeforeRequest = function() {
    if(!window.creatorSub || window.creatorSub.status !== 'active') { 
        alert("Active subscription required!"); 
        if(window.router) window.router.navigateTo('/creator-plans'); 
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
        if(el && window.creatorSub) el.innerHTML = `<span class="text-green-600 font-bold">Plan: ${window.creatorSub.planCode}</span> · Used: ${window.creatorSub.usedRequests}/${window.creatorSub.maxRequests||'∞'}`;
    });
};

window.incrementCreatorUsage = async function() {
    if(!window.currentUser) return;
    db.collection('creatorSubs').doc(window.currentUser.uid).update({ usedRequests: firebase.firestore.FieldValue.increment(1) });
};

// --- NAVIGATION EXPORTS ---
window.goToCreatorJersey = function() { if(window.checkCreatorSubBeforeRequest()) window.router.navigateTo('/creator-jersey'); };
window.goToCreatorTeam = function() { if(window.checkCreatorSubForTeam()) window.router.navigateTo('/creator-team'); };
window.setPlayerGame = function(id) { window.currentPlayerGame = id; window.router.handleRoute('/creator-player'); };

// --- FINAL EXPORTS ---
window.CreatorPage = CreatorPage;
window.CreatorPlayerPage = CreatorPlayerPage;
window.CreatorJerseyPage = CreatorJerseyPage;
window.CreatorTeamPage = CreatorTeamPage;
window.CreatorHistoryPage = CreatorHistoryPage;
