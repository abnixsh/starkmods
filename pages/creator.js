// pages/creator.js

// --- PLAN CONFIG (client side) ---
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

const JERSEY_TESTER_LINK = 'https://your-jersey-tester-link.com'; // CHANGE THIS

// Globals
window.creatorSub = null;
window.creatorPlansReason = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.historyUnsubscribe = null; // To stop listening when leaving page

// Team builder state
window.teamBuilder = null;
function resetTeamBuilder() {
  window.teamBuilder = {
    mode: 'new',
    teamName: '',
    teamShortName: '',
    replaceTeamName: '',
    jerseyFile: null,
    logoFile: null,
    players: [] 
  };
}

/* ------------------------- MAIN PAGE ------------------------- */

function CreatorPage() {
  if (!window.currentUser) {
    return `
      <div class="max-w-4xl mx-auto py-20 text-center animate-fade-in">
        <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="material-icons text-4xl text-blue-600 dark:text-blue-400">build</span>
        </div>
        <h1 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Login Required</h1>
        <p class="text-slate-500 mb-6 text-sm">Login with Google to use the Mod Creator tools.</p>
        <button onclick="window.googleLogin()" class="btn bg-white border border-slate-200 text-slate-700 shadow-lg">
          Login with Google
        </button>
      </div>`;
  }

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
        <button class="creator-feature-player group p-6 rounded-2xl border border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                onclick="window.router && window.router.navigateTo('/creator-player')">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-200 dark:bg-blue-800 rounded-full text-blue-700 dark:text-blue-100"><span class="material-icons text-2xl">person</span></div>
            <div>
              <div class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">Custom Player</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Create player with skills & face.</div>
            </div>
          </div>
        </button>

        <button class="creator-feature-jersey group p-6 rounded-2xl border border-green-500 bg-green-50 dark:bg-green-900/10 text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                onclick="window.goToCreatorJersey()">
          <div class="flex items-center gap-4">
             <div class="p-3 bg-green-200 dark:bg-green-800 rounded-full text-green-700 dark:text-green-100"><span class="material-icons text-2xl">checkroom</span></div>
            <div class="flex-1">
              <div class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300">Custom Jersey</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload textures for any team.</div>
            </div>
            <span class="material-icons text-lg text-slate-400 feature-lock-jersey hidden">lock</span>
          </div>
        </button>

        <button class="creator-feature-team group p-6 rounded-2xl border border-purple-500 bg-purple-50 dark:bg-purple-900/10 text-left transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                onclick="window.goToCreatorTeam()">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-200 dark:bg-purple-800 rounded-full text-purple-700 dark:text-purple-100"><span class="material-icons text-2xl">groups</span></div>
            <div class="flex-1">
              <div class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300">Custom Team</div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">Build full squad (Pro/Elite).</div>
            </div>
            <span class="material-icons text-lg text-slate-400 feature-lock-team hidden">lock</span>
          </div>
        </button>
      </div>
    </div>
  `;
}

/* ------------------------- CUSTOM PLAYER PAGE ------------------------- */

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

      <div id="creator-sub-status" class="glass mb-4 text-xs p-3">Loading sub...</div>

      <div class="mb-6 flex flex-wrap gap-2">${gameBtn('rc25', 'RC25')}${gameBtn('rc24', 'RC24')}${gameBtn('rcswipe', 'RC Swipe')}</div>

      <div id="player-form-container">${renderCustomPlayerForm()}</div>
    </div>`;
}

function renderCustomPlayerForm() {
  const game = window.currentPlayerGame || 'rc25';
  const hasFace = (game === 'rc25'); 
  let faceOptions = '<option value="">Select Face (1–80)</option>';
  if(hasFace) for(let i=1; i<=80; i++) faceOptions += `<option value="${i}">Face ${i}</option>`;

  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <form onsubmit="window.submitCustomPlayer(event)" class="space-y-5 text-sm">
        
        <div class="grid sm:grid-cols-2 gap-5">
            <div>
                <label class="block font-bold mb-1.5">Team Name</label>
                <input id="cp-team" type="text" class="form-input" placeholder="e.g. India, CSK">
            </div>
            <div>
                <label class="block font-bold mb-1.5">Player Name</label>
                <input id="cp-name" type="text" class="form-input" placeholder="Enter name">
            </div>
        </div>

        <div class="grid sm:grid-cols-3 gap-5">
            <div>
                <label class="block font-bold mb-1.5 text-blue-600">Player Type</label>
                <select id="cp-type" class="form-input" onchange="window.toggleSkillFields('cp')">
                  <option value="">Select Type</option>
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="keeper">Wicket Keeper</option>
                  <option value="all-rounder">All Rounder</option>
                </select>
            </div>
            <div>
                <label class="block font-bold mb-1.5">Batting Hand</label>
                <select id="cp-bat-hand" class="form-input">
                  <option value="right">Right Hand</option>
                  <option value="left">Left Hand</option>
                </select>
            </div>
             <div>
                <label class="block font-bold mb-1.5">Bowling Hand</label>
                <select id="cp-bowl-hand" class="form-input">
                  <option value="right">Right Hand</option>
                  <option value="left">Left Hand</option>
                </select>
            </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 class="font-bold text-xs text-slate-500 uppercase mb-3">Attributes & Skills</h3>
            
            <div id="cp-bat-skills" class="hidden grid sm:grid-cols-2 gap-4 mb-4">
                 <div>
                    <label class="block font-bold mb-1 text-xs">Batsman Style</label>
                    <select id="cp-bat-type" class="form-input text-xs">
                      <option value="balanced">Balanced</option>
                      <option value="radical">Radical</option>
                      <option value="brute">Brute</option>
                      <option value="defensive">Defensive</option>
                    </select>
                </div>
                <div><label class="block font-bold mb-1 text-xs">Timing (0-100)</label><input id="cp-timing" type="number" min="0" max="100" class="form-input text-xs" placeholder="85"></div>
                <div><label class="block font-bold mb-1 text-xs">Aggression (0-100)</label><input id="cp-aggression" type="number" min="0" max="100" class="form-input text-xs" placeholder="70"></div>
                <div><label class="block font-bold mb-1 text-xs">Technique (0-100)</label><input id="cp-technique" type="number" min="0" max="100" class="form-input text-xs" placeholder="90"></div>
            </div>

            <div id="cp-bowl-skills" class="hidden grid sm:grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold mb-1 text-xs">Bowler Style</label>
                    <select id="cp-bowl-type" class="form-input text-xs">
                      <option value="fast-med">Fast-Medium</option>
                      <option value="faster">Fast</option>
                      <option value="med-pacer">Medium Pacer</option>
                      <option value="off-spinner">Off Spinner</option>
                      <option value="leg-spinner">Leg Spinner</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold mb-1 text-xs">Bowling Action</label>
                    <select id="cp-bowl-action" class="form-input text-xs">
                       <option value="standard">Standard</option>
                       <option value="sling">Slingy</option>
                       <option value="high-arm">High Arm</option>
                       <option value="weird">Unorthodox</option>
                    </select>
                </div>
                 <div><label class="block font-bold mb-1 text-xs">Bowling Skill (0-100)</label><input id="cp-bowl-skill" type="number" min="0" max="100" class="form-input text-xs" placeholder="80"></div>
            </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-bold mb-1.5">Jersey Number</label>
            <input id="cp-jersey" type="number" class="form-input" placeholder="e.g. 18">
          </div>
          ${hasFace ? `
          <div>
            <label class="block font-bold mb-1.5">Face (RC25 only)</label>
            <select id="cp-face" class="form-input" onchange="window.updateFacePreview()">${faceOptions}</select>
          </div>` : ''}
        </div>

        ${hasFace ? `
        <div class="flex items-center gap-4 border-t pt-4 border-slate-100 dark:border-slate-700">
          <div id="cp-face-preview" class="w-12 h-12 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] text-slate-500">No Img</div>
          <div class="flex-1">
             <label class="flex items-center gap-2 text-xs font-bold mb-2 cursor-pointer">
                <input type="checkbox" id="cp-use-custom-face" onchange="window.toggleCustomFace()" class="accent-blue-600"> Use Custom Face Image
             </label>
             <input type="file" id="cp-custom-file" accept="image/*" class="text-xs w-full" disabled>
          </div>
        </div>` : ''}

        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95">
          Submit Request
        </button>
      </form>
    </div>`;
}

/* ------------------------- CUSTOM TEAM PAGE ------------------------- */

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
        <div class="flex gap-4 text-xs mb-4">
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="ct-mode" value="new" checked onchange="window.setTeamMode('new')" class="accent-purple-600"> Create New</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="ct-mode" value="replace" onchange="window.setTeamMode('replace')" class="accent-purple-600"> Replace Existing</label>
        </div>
        <input id="ct-replace-name" type="text" class="form-input mb-4 hidden" placeholder="Name of team to replace (e.g. Australia)">
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
                  <option value="">Role...</option>
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All Rounder</option>
                  <option value="keeper">Wicket Keeper</option>
              </select>
              <select id="tp-bat-hand" class="form-input"><option value="right">R Hand Bat</option><option value="left">L Hand Bat</option></select>
              <select id="tp-bowl-hand" class="form-input"><option value="right">R Arm Bowl</option><option value="left">L Arm Bowl</option></select>
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-xs">
              <div id="tp-bat-skills" class="hidden grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
                  <select id="tp-bat-type" class="form-input text-xs"><option value="balanced">Balanced</option><option value="radical">Radical</option><option value="brute">Brute</option></select>
                  <input id="tp-timing" type="number" placeholder="Timing" class="form-input text-xs">
                  <input id="tp-aggression" type="number" placeholder="Aggression" class="form-input text-xs">
                  <input id="tp-technique" type="number" placeholder="Technique" class="form-input text-xs">
              </div>
              <div id="tp-bowl-skills" class="hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <select id="tp-bowl-type" class="form-input text-xs"><option value="med-pacer">Medium</option><option value="faster">Fast</option><option value="off-spinner">Off Spin</option><option value="leg-spinner">Leg Spin</option></select>
                  <select id="tp-bowl-action" class="form-input text-xs"><option value="standard">Standard</option><option value="sling">Sling</option><option value="high-arm">High Arm</option></select>
                  <input id="tp-bowl-skill" type="number" placeholder="Skill (0-100)" class="form-input text-xs">
              </div>
          </div>

          <button type="submit" class="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 w-full justify-center">
            <span class="material-icons text-sm">add</span> Add to Squad
          </button>
        </form>

        <div id="ct-players-list" class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty. Add players above.</div>
        </div>
      </div>

      <button onclick="window.submitCustomTeam()" class="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold shadow-xl text-lg">
        Submit Team Request
      </button>
    </div>`;
}

/* ------------------------- JERSEY PAGE ------------------------- */

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

/* ------------------------- HISTORY PAGE ------------------------- */

function CreatorHistoryPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/'), 50); return ''; }
  
  // Clean up listener if exists
  if (window.historyUnsubscribe) { window.historyUnsubscribe(); window.historyUnsubscribe = null; }
  
  setTimeout(() => { if (window.loadCreatorHistory) window.loadCreatorHistory(); }, 100);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Request History</h1>
        <button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 px-3 py-1 rounded">Back</button>
      </div>
      <div id="creator-history" class="space-y-3">
        <div class="text-center py-10"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
      </div>
    </div>`;
}

/* ------------------------- LOGIC & HELPERS ------------------------- */

// Show/Hide Fields based on Player Type
window.toggleSkillFields = function(prefix) {
    const type = document.getElementById(prefix + '-type').value;
    const batSection = document.getElementById(prefix + '-bat-skills');
    const bowlSection = document.getElementById(prefix + '-bowl-skills');

    if (!batSection || !bowlSection) return;

    // Reset visibility
    batSection.classList.add('hidden');
    bowlSection.classList.add('hidden');

    if (type === 'batsman' || type === 'keeper' || type === 'all-rounder') {
        batSection.classList.remove('hidden');
    }
    if (type === 'bowler' || type === 'all-rounder') {
        bowlSection.classList.remove('hidden');
    }
};

window.addTeamPlayer = function (e) {
  e.preventDefault();
  if (!window.teamBuilder) resetTeamBuilder();

  if (window.teamBuilder.players.length >= 15) { alert('Squad full (Max 15).'); return; }

  const p = {
      name: document.getElementById('tp-name').value.trim(),
      playerType: document.getElementById('tp-type').value,
      jerseyNumber: document.getElementById('tp-jersey').value,
      battingHand: document.getElementById('tp-bat-hand').value,
      bowlingHand: document.getElementById('tp-bowl-hand').value,
      // Bat Skills
      batsmanType: document.getElementById('tp-bat-type').value,
      timing: document.getElementById('tp-timing').value,
      aggression: document.getElementById('tp-aggression').value,
      technique: document.getElementById('tp-technique').value,
      // Bowl Skills
      bowlerType: document.getElementById('tp-bowl-type').value,
      bowlingAction: document.getElementById('tp-bowl-action').value,
      bowlingSkill: document.getElementById('tp-bowl-skill').value
  };

  if (!p.name || !p.playerType) { alert('Name and Type are required.'); return; }

  window.teamBuilder.players.push(p);
  e.target.reset(); // clear form
  window.toggleSkillFields('tp'); // reset fields
  window.renderTeamPlayersList();
};

window.renderTeamPlayersList = function () {
  const list = document.getElementById('ct-players-list');
  const countEl = document.getElementById('squad-count');
  if (!list) return;

  const players = (window.teamBuilder && window.teamBuilder.players) || [];
  if (countEl) countEl.innerText = `${players.length}/15 Players`;

  if (!players.length) {
    list.innerHTML = `<div class="text-center text-slate-400 text-xs py-4 italic">Squad is empty.</div>`;
    return;
  }

  let html = '';
  players.forEach((p, i) => {
    html += `
      <div class="flex justify-between items-center bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 shadow-sm">
        <div class="flex items-center gap-3">
           <span class="text-slate-400 font-mono text-xs w-4">${i+1}</span>
           <div>
              <div class="font-bold text-sm text-slate-800 dark:text-slate-200">${p.name} <span class="text-[10px] text-blue-500 font-normal uppercase ml-1">${p.playerType}</span></div>
              <div class="text-[10px] text-slate-500">Jersey: #${p.jerseyNumber}</div>
           </div>
        </div>
        <button onclick="window.removeTeamPlayer(${i})" class="text-red-400 hover:text-red-600"><span class="material-icons text-sm">close</span></button>
      </div>`;
  });
  list.innerHTML = html;
};

window.removeTeamPlayer = function(index) {
    if(window.teamBuilder && window.teamBuilder.players) {
        window.teamBuilder.players.splice(index, 1);
        window.renderTeamPlayersList();
    }
};

window.setTeamMode = function(mode) {
    window.teamBuilder.mode = mode;
    const el = document.getElementById('ct-replace-name');
    if(el) mode === 'replace' ? el.classList.remove('hidden') : el.classList.add('hidden');
};

/* ------------------------- SUBMISSION LOGIC ------------------------- */

async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();
  if (!window.checkCreatorSubBeforeRequest()) return;

  const submitBtn = evt.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true; submitBtn.innerText = 'Sending...';

  try {
      const data = {
        type: 'player',
        gameId: window.currentPlayerGame || 'rc25',
        userId: window.currentUser.uid,
        email: window.currentUser.email,
        userName: window.currentUser.displayName || 'User',
        
        teamName: document.getElementById('cp-team').value,
        playerName: document.getElementById('cp-name').value,
        playerType: document.getElementById('cp-type').value,
        battingHand: document.getElementById('cp-bat-hand').value,
        bowlingHand: document.getElementById('cp-bowl-hand').value,
        jerseyNumber: document.getElementById('cp-jersey').value,
        
        // Extended Attributes
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

      // Handle Custom Face Image
      const faceCheck = document.getElementById('cp-use-custom-face');
      if (faceCheck && faceCheck.checked) {
          const file = document.getElementById('cp-custom-file').files[0];
          if(file) {
              if(file.size > 500*1024) throw new Error("Face image too large (Max 500KB)");
              data.customFaceBase64 = await readFileAsBase64(file);
              data.useCustomFace = true;
          }
      }

      // 1. Save to Firestore
      await db.collection('modRequests').add({
          ...data,
          status: 'pending',
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 2. Increment Usage
      await window.incrementCreatorUsage();

      // 3. Notify Telegram (Cloudflare)
      // Note: We remove base64 from Firestore object usually, but send it to API
      await fetch('/api/custom-player', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      });

      alert("✅ Request Sent Successfully!");
      window.router.navigateTo('/creator-history');

  } catch(e) {
      alert("Error: " + e.message);
      submitBtn.disabled = false; submitBtn.innerText = 'Submit Request';
  }
};

window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    const players = window.teamBuilder.players;
    if(!players || players.length === 0) { alert("Add players first!"); return; }

    try {
        const jFile = document.getElementById('ct-jersey-file').files[0];
        const lFile = document.getElementById('ct-logo-file').files[0];
        
        if(!jFile || !lFile) throw new Error("Please upload Jersey and Logo.");

        const jerseyBase64 = await readFileAsBase64(jFile);
        const logoBase64 = await readFileAsBase64(lFile);

        const data = {
            type: 'team',
            userId: window.currentUser.uid,
            email: window.currentUser.email,
            userName: window.currentUser.displayName,
            teamName: document.getElementById('ct-team-name').value,
            teamShortName: document.getElementById('ct-team-short').value,
            mode: window.teamBuilder.mode,
            replaceTeamName: document.getElementById('ct-replace-name').value,
            players: players,
            createdAt: new Date().toISOString()
        };

        await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        await window.incrementCreatorUsage();
        
        // Send to API with images
        await fetch('/api/custom-team', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ...data, jerseyBase64, logoBase64 })
        });

        alert("✅ Team Request Sent!");
        window.router.navigateTo('/creator-history');

    } catch(e) {
        alert("Error: " + e.message);
    }
};

/* ------------------------- OPTIMIZED HISTORY LOADER ------------------------- */

window.loadCreatorHistory = function () {
  const container = document.getElementById('creator-history');
  if (!container || !window.db || !window.currentUser) return;

  // OPTIMIZATION: Limit to 20 to prevent "Error loading history" on large datasets
  // Using onSnapshot is fine for user's own data if limited.
  
  window.historyUnsubscribe = db.collection('modRequests')
    .where('userId', '==', window.currentUser.uid)
    .limit(20) // Performance Fix
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = `<div class="text-slate-400 text-xs text-center py-6">No history found.</div>`;
        return;
      }

      const docs = [];
      snapshot.forEach(doc => docs.push(doc.data()));
      
      // Robust Client-side Sort (Fixes crash if timestamp is null during write)
      docs.sort((a, b) => {
        const ta = a.timestamp ? (a.timestamp.toMillis ? a.timestamp.toMillis() : Date.now()) : Date.now();
        const tb = b.timestamp ? (b.timestamp.toMillis ? b.timestamp.toMillis() : Date.now()) : Date.now();
        return tb - ta;
      });

      let html = '';
      docs.forEach(r => {
        const type = r.type || 'player';
        let statusColor = r.status === 'approved' ? 'text-green-600 bg-green-50 border-green-200' : 
                          r.status === 'rejected' ? 'text-red-600 bg-red-50 border-red-200' : 
                          'text-amber-600 bg-amber-50 border-amber-200';
        
        let title = type === 'team' ? `Team: ${r.teamName}` : 
                    type === 'jersey' ? `Jersey: ${r.teamName}` : 
                    `Player: ${r.playerName}`;

        let downloadLink = r.downloadUrl ? `<a href="${r.downloadUrl}" target="_blank" class="block mt-2 text-center bg-blue-600 text-white text-xs font-bold py-1.5 rounded hover:bg-blue-700">Download Mod</a>` : '';

        html += `
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm relative overflow-hidden">
             <div class="flex justify-between items-start mb-2">
                <div>
                   <div class="font-bold text-sm text-slate-800 dark:text-slate-200">${title}</div>
                   <div class="text-[10px] text-slate-500 uppercase tracking-wide">${new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColor}">${r.status}</div>
             </div>
             ${downloadLink}
          </div>`;
      });
      container.innerHTML = html;
    }, err => {
      console.error('History Error:', err);
      // Fallback UI so user doesn't just see a broken page
      container.innerHTML = `<div class="text-red-500 text-xs text-center p-4 border border-red-100 rounded bg-red-50">
        Unable to load recent history.<br>Try refreshing.
      </div>`;
    });
};

/* ------------------------- EXPORTS ------------------------- */
window.CreatorPage = CreatorPage;
window.CreatorPlayerPage = CreatorPlayerPage;
window.CreatorJerseyPage = CreatorJerseyPage;
window.CreatorTeamPage = CreatorTeamPage;
window.CreatorHistoryPage = CreatorHistoryPage;

// Re-use logic from previous file for Sub Checks (omitted for brevity but assumed present)
// Ensure window.checkCreatorSubBeforeRequest, window.incrementCreatorUsage, etc. are defined 
// (or copy them from previous version if you deleted them).
// I will add the essential ones here just in case:

window.checkCreatorSubBeforeRequest = function() {
    if(!window.creatorSub || window.creatorSub.status !== 'active') {
        alert("Active subscription required!");
        if(window.router) window.router.navigateTo('/creator-plans');
        return false;
    }
    if(window.creatorSub.maxRequests && window.creatorSub.usedRequests >= window.creatorSub.maxRequests) {
        alert("Plan limit reached!");
        return false;
    }
    return true;
};

window.checkCreatorSubForTeam = function() {
    if(!window.checkCreatorSubBeforeRequest()) return false;
    if(window.creatorSub.planCode === 'P100') {
        alert("Upgrade to Pro or Elite to create teams.");
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
            el.innerHTML = `<span class="text-green-600 font-bold">Plan: ${window.creatorSub.planCode}</span> · Used: ${window.creatorSub.usedRequests}/${window.creatorSub.maxRequests||'∞'}`;
        }
    });
};

window.incrementCreatorUsage = async function() {
    if(!window.currentUser) return;
    db.collection('creatorSubs').doc(window.currentUser.uid).update({
        usedRequests: firebase.firestore.FieldValue.increment(1)
    });
};
