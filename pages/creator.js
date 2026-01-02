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

// App link for designing jerseys (CHANGE THIS)
const JERSEY_TESTER_LINK = 'https://your-jersey-tester-link.com';

// globals for subscription & pages
window.creatorSub = null;
window.creatorPlansReason = null;
window.creatorSelectedPlanCode = null;

// Selected game for custom player
window.currentPlayerGame = 'rc25';

// Selected game for custom jersey
window.currentJerseyGame = 'rc25';

// Team builder state
window.teamBuilder = null;
function resetTeamBuilder() {
  window.teamBuilder = {
    mode: 'new',              // 'new' or 'replace'
    teamName: '',
    teamShortName: '',
    replaceTeamName: '',
    jerseyFile: null,
    logoFile: null,
    players: []               // array of player objects
  };
}

/* ------------------------- MAIN PAGES ------------------------- */

function CreatorPage() {
  if (!window.currentUser) {
    return `
      <div class="max-w-4xl mx-auto py-20 text-center animate-fade-in">
        <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="material-icons text-4xl text-blue-600 dark:text-blue-400">build</span>
        </div>
        <h1 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Login Required</h1>
        <p class="text-slate-500 mb-6 text-sm">Login with Google to use the Mod Creator tools.</p>
        <button onclick="window.googleLogin()"
                class="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mx-auto hover:bg-slate-50 transition">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6">
          Login with Google
        </button>
      </div>`;
  }

  setTimeout(() => {
    if (window.loadCreatorSubscription) window.loadCreatorSubscription();
  }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 class="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Mod Creator</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Create custom content for your game. Use <span class="font-semibold">Custom Player</span>, <span class="font-semibold">Custom Jersey</span>,
        or <span class="font-semibold">Custom Team</span>.
      </p>

      <!-- Subscription status -->
      <div id="creator-sub-status"
           class="glass mb-6 text-sm text-slate-700 dark:text-slate-200 p-4">
        Loading subscription...
      </div>

      <!-- MAIN BUTTONS -->
      <div class="grid sm:grid-cols-3 gap-4 mb-4">
        <!-- Player: always accessible (subscription checked on submit) -->
        <button class="creator-feature-player p-5 rounded-2xl border border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-left hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                onclick="window.router && window.router.navigateTo('/creator-player')">
          <div class="flex items-center gap-3">
            <span class="material-icons text-3xl text-blue-600">person</span>
            <div>
              <div class="font-bold text-slate-900 dark:text-white">Custom Player</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Create your own player with custom face &amp; details.</div>
            </div>
          </div>
        </button>

        <!-- Jersey: locked until any active subscription -->
        <button class="creator-feature-jersey p-5 rounded-2xl border border-green-500 bg-green-50 dark:bg-green-900/20 text-left transition"
                onclick="window.goToCreatorJersey()">
          <div class="flex items-center gap-3">
            <span class="material-icons text-3xl text-green-600">checkroom</span>
            <div class="flex-1">
              <div class="font-bold text-slate-900 dark:text-white">Custom Jersey</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Upload textures for any team jersey.</div>
            </div>
            <span class="material-icons text-xs text-slate-400 feature-lock-jersey">lock</span>
          </div>
        </button>

        <!-- Team: locked until Pro / Elite -->
        <button class="creator-feature-team p-5 rounded-2xl border border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-left transition"
                onclick="window.goToCreatorTeam()">
          <div class="flex items-center gap-3">
            <span class="material-icons text-3xl text-purple-600">groups</span>
            <div class="flex-1">
              <div class="font-bold text-slate-900 dark:text-white">Custom Team</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Create or replace a full team with custom squad.</div>
            </div>
            <span class="material-icons text-xs text-slate-400 feature-lock-team">lock</span>
          </div>
        </button>
      </div>

      <button onclick="window.router.navigateTo('/creator-history')"
              class="mb-6 text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg font-bold flex items-center gap-1">
        <span class="material-icons text-xs">history</span> View Request History
      </button>
    </div>
  `;
}

function CreatorPlayerPage() {
  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/creator'), 50);
    return '';
  }

  const g = window.currentPlayerGame || 'rc25';

  setTimeout(() => {
    if (window.loadCreatorSubscription) window.loadCreatorSubscription();
  }, 200);

  const gameBtn = (id, label) => `
    <button onclick="window.setPlayerGame('${id}')"
            class="px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold
                   ${g === id
                     ? 'bg-blue-600 text-white border-blue-600'
                     : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}">
      ${label}
    </button>
  `;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Custom Player</h1>

      <div id="creator-sub-status"
           class="glass mb-4 text-sm text-slate-700 dark:text-slate-200 p-3">
        Loading subscription...
      </div>

      <!-- Game selector -->
      <div class="mb-4 flex flex-wrap gap-2 text-xs sm:text-sm">
        ${gameBtn('rc25', 'RC25')}
        ${gameBtn('rc24', 'RC24')}
        ${gameBtn('rcswipe', 'RC Swipe')}
      </div>

      <button onclick="window.router.navigateTo('/creator-history')"
              class="mb-4 text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg font-bold flex items-center gap-1">
        <span class="material-icons text-xs">history</span> View Request History
      </button>

      <div id="player-form-container">
        ${renderCustomPlayerForm()}
      </div>
    </div>
  `;
}

function CreatorJerseyPage() {
  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/creator'), 50);
    return '';
  }

  setTimeout(() => {
    if (window.loadCreatorSubscription) window.loadCreatorSubscription();
  }, 200);

  const g = window.currentJerseyGame || 'rc25';

  const gameBtn = (id, label) => `
    <button onclick="window.setJerseyGame('${id}')"
            class="px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold
                   ${g === id
                     ? 'bg-blue-600 text-white border-blue-600'
                     : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}">
      ${label}
    </button>
  `;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Custom Jersey</h1>

      <div id="creator-sub-status"
           class="glass mb-4 text-sm text-slate-700 dark:text-slate-200 p-3">
        Loading subscription...
      </div>

      <!-- Game selector -->
      <div class="mb-4 flex flex-wrap gap-2 text-xs sm:text-sm">
        ${gameBtn('rc25', 'RC25')}
        ${gameBtn('rc24', 'RC24')}
        ${gameBtn('rcswipe', 'RC Swipe')}
      </div>

      <div class="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-200">
        <div class="font-semibold mb-1 flex items-center gap-1">
          <span class="material-icons text-sm text-green-600">apps</span>
          <span>Design your jersey with Stark Tester</span>
        </div>
        <p class="mb-2">
          Use our dedicated app to design your jersey texture, then upload the final PNG/JPG file here.
        </p>
        <button onclick="window.open('${JERSEY_TESTER_LINK}', '_blank')"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
          <span class="material-icons text-xs">download</span> Download Stark Jersey Tester
        </button>
      </div>

      <button onclick="window.router.navigateTo('/creator-history')"
              class="mb-4 text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg font-bold flex items-center gap-1">
        <span class="material-icons text-xs">history</span> View Request History
      </button>

      ${renderCustomJerseyForm()}
    </div>
  `;
}

function CreatorTeamPage() {
  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/creator'), 50);
    return '';
  }

  resetTeamBuilder();

  setTimeout(() => {
    if (window.loadCreatorSubscription) window.loadCreatorSubscription();
  }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-24">
      <h1 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Custom Team</h1>

      <div id="creator-sub-status"
           class="glass mb-4 text-sm text-slate-700 dark:text-slate-200 p-3">
        Loading subscription...
      </div>

      <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Custom Team is available only for <span class="font-semibold">Pro</span> and <span class="font-semibold">Elite</span> plans.
        You can add up to <span class="font-semibold">12 players</span> in one squad.
      </p>

      <!-- TEAM INFO -->
      <div class="glass p-5 mb-5">
        <h2 class="text-sm font-bold mb-3 text-slate-900 dark:text-white">Team Info</h2>

        <div class="flex flex-wrap gap-4 mb-3 text-xs">
          <label class="flex items-center gap-2">
            <input type="radio" name="ct-mode" value="new" checked
                   onchange="window.setTeamMode('new')" class="accent-blue-600">
            Create New Team
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="ct-mode" value="replace"
                   onchange="window.setTeamMode('replace')" class="accent-blue-600">
            Replace Existing Team
          </label>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mb-3">
          <div>
            <label class="block text-xs font-semibold mb-1">Team Name</label>
            <input id="ct-team-name" type="text" class="form-input" placeholder="e.g. Stark XI, Custom Warriors">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1">Short Name</label>
            <input id="ct-team-short" type="text" class="form-input" placeholder="e.g. STK, CW">
          </div>
        </div>

        <div class="mb-3">
          <label class="block text-xs font-semibold mb-1">Replacement Team Name (only if replacing)</label>
          <input id="ct-replace-name" type="text" class="form-input" placeholder="e.g. India, RCB" disabled>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold mb-1">Jersey Texture (PNG/JPG)</label>
            <input id="ct-jersey-file" type="file" accept="image/png,image/jpeg" class="text-xs">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1">Team Logo (PNG/JPG)</label>
            <input id="ct-logo-file" type="file" accept="image/png,image/jpeg" class="text-xs">
          </div>
        </div>
      </div>

      <!-- PLAYERS -->
      <div class="glass p-5 mb-5">
        <h2 class="text-sm font-bold mb-3 text-slate-900 dark:text-white">Add Players (max 12)</h2>

        <form onsubmit="window.addTeamPlayer(event)" class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold mb-1">Player Name</label>
            <input id="tp-name" type="text" class="form-input" placeholder="Player name">
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1">Player Type</label>
              <select id="tp-type" class="form-input">
                <option value="">Select type</option>
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="keeper">Wicket Keeper</option>
                <option value="all-rounder">All Rounder</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1">Jersey Number</label>
              <input id="tp-jersey" type="number" min="0" max="999" class="form-input" placeholder="e.g. 7">
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1">Batting Hand</label>
              <select id="tp-bat-hand" class="form-input">
                <option value="">Select</option>
                <option value="right">Right Hand</option>
                <option value="left">Left Hand</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1">Bowling Hand</label>
              <select id="tp-bowl-hand" class="form-input">
                <option value="">Select</option>
                <option value="right">Right Hand</option>
                <option value="left">Left Hand</option>
              </select>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1">Batsman Type</label>
              <select id="tp-bat-type" class="form-input">
                <option value="">Select</option>
                <option value="radical">Radical</option>
                <option value="brute">Brute</option>
                <option value="defensive">Defensive</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1">Bowler Type</label>
              <select id="tp-bowl-type" class="form-input">
                <option value="">Select</option>
                <option value="faster">Faster</option>
                <option value="med-pacer">Medium Pacer</option>
                <option value="fast-med">Fast-Medium</option>
                <option value="off-spinner">Off Spinner</option>
                <option value="leg-spinner">Leg Spinner</option>
                <option value="unorthodox">Unorthodox</option>
              </select>
            </div>
          </div>

          <button type="submit"
                  class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
            <span class="material-icons text-xs">person_add</span> Add Player To Squad
          </button>
        </form>

        <div class="mt-4">
          <h3 class="text-xs font-bold mb-1 text-slate-700 dark:text-slate-200">Current Squad</h3>
          <div id="ct-players-list" class="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <div class="text-slate-400 text-xs">No players added yet.</div>
          </div>
        </div>
      </div>

      <button onclick="window.submitCustomTeam()"
              class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
        Submit Custom Team Request
      </button>
    </div>
  `;
}

/* ------------------ HISTORY & PLANS PAGES ------------------ */

function CreatorHistoryPage() {
  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/'), 50);
    return '';
  }

  setTimeout(() => {
    if (window.loadCreatorHistory) window.loadCreatorHistory();
  }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Mod Creator History</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
        All your custom player, jersey and team requests and their status.
      </p>
      <div id="creator-history" class="space-y-3 text-sm">
        <div class="text-slate-400 text-xs">Loading...</div>
      </div>
    </div>
  `;
}

function CreatorPlansPage() {
  if (!window.currentUser) {
    setTimeout(() => window.router.navigateTo('/'), 50);
    return '';
  }

  const reason = window.creatorPlansReason;
  window.creatorPlansReason = null;

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 class="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Choose Mod Creator Plan</h1>
      ${reason ? `<p class="text-xs text-red-500 mb-2">${reason}</p>` : ''}
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
        After you select a plan, you will be taken to the normal checkout screen to complete payment.
      </p>
      <div class="grid sm:grid-cols-3 gap-4">
        ${renderPlanCard('P100')}
        ${renderPlanCard('P300')}
        ${renderPlanCard('P1000')}
      </div>
    </div>
  `;
}

/* ----------------- TEAM BUILDER HELPERS ----------------- */

window.setTeamMode = function (mode) {
  if (!window.teamBuilder) resetTeamBuilder();
  window.teamBuilder.mode = mode === 'replace' ? 'replace' : 'new';

  const replaceInput = document.getElementById('ct-replace-name');
  if (replaceInput) {
    replaceInput.disabled = window.teamBuilder.mode !== 'replace';
  }
};

window.addTeamPlayer = function (e) {
  e.preventDefault();
  if (!window.teamBuilder) resetTeamBuilder();

  if (window.teamBuilder.players.length >= 12) {
    alert('You can add maximum 12 players in one team.');
    return;
  }

  const name = document.getElementById('tp-name').value.trim();
  const type = document.getElementById('tp-type').value;
  const jersey = document.getElementById('tp-jersey').value.trim();
  const batHand = document.getElementById('tp-bat-hand').value;
  const bowlHand = document.getElementById('tp-bowl-hand').value;
  const batType = document.getElementById('tp-bat-type').value;
  const bowlType = document.getElementById('tp-bowl-type').value;

  if (!name || !type || !jersey || !batHand || !bowlHand || !batType || !bowlType) {
    alert('Fill all player fields before adding to squad.');
    return;
  }

  window.teamBuilder.players.push({
    name,
    playerType: type,
    jerseyNumber: jersey,
    battingHand: batHand,
    bowlingHand: bowlHand,
    batsmanType: batType,
    bowlerType: bowlType
  });

  // Clear player form
  document.getElementById('tp-name').value = '';
  document.getElementById('tp-type').value = '';
  document.getElementById('tp-jersey').value = '';
  document.getElementById('tp-bat-hand').value = '';
  document.getElementById('tp-bowl-hand').value = '';
  document.getElementById('tp-bat-type').value = '';
  document.getElementById('tp-bowl-type').value = '';

  window.renderTeamPlayersList();
};

window.renderTeamPlayersList = function () {
  const list = document.getElementById('ct-players-list');
  if (!list) return;

  const players = (window.teamBuilder && window.teamBuilder.players) || [];

  if (!players.length) {
    list.innerHTML = `<div class="text-slate-400 text-xs">No players added yet.</div>`;
    return;
  }

  let html = '';
  players.forEach((p, i) => {
    html += `
      <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1">
        <div>
          <span class="font-semibold">${i + 1}. ${p.name}</span>
          <span class="text-[11px] text-slate-500"> (${p.playerType}, #${p.jerseyNumber})</span>
        </div>
        <span class="text-[11px] text-slate-400">Bat: ${p.battingHand}, Bowl: ${p.bowlingHand}</span>
      </div>`;
  });

  list.innerHTML = html;
};

/* ---------- FORMS: PLAYER & JERSEY ---------- */

function renderCustomPlayerForm() {
  const game = window.currentPlayerGame || 'rc25';
  const hasFace = (game === 'rc25'); // only RC25 supports face selection / custom face

  let faceOptions = '';
  if (hasFace) {
    faceOptions = '<option value="">Select Face (1–80)</option>';
    for (let i = 1; i <= 80; i++) {
      faceOptions += `<option value="${i}">Face ${i}</option>`;
    }
  }

  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">
        Custom Player · ${game.toUpperCase()}
      </h2>

      <form onsubmit="window.submitCustomPlayer(event)" class="space-y-4 text-sm">
        <div>
          <label class="block font-semibold mb-1">Team Name (where player will be added)</label>
          <input id="cp-team" type="text" class="form-input" placeholder="e.g. India, CSK, Custom Team">
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Player Name</label>
            <input id="cp-name" type="text" class="form-input" placeholder="Your custom player name">
          </div>
          <div>
            <label class="block font-semibold mb-1">Player Type</label>
            <select id="cp-type" class="form-input">
              <option value="">Select type</option>
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="keeper">Wicket Keeper</option>
              <option value="all-rounder">All Rounder</option>
            </select>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Batting Hand</label>
            <select id="cp-bat-hand" class="form-input">
              <option value="">Select</option>
              <option value="right">Right Hand</option>
              <option value="left">Left Hand</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold mb-1">Bowling Hand</label>
            <select id="cp-bowl-hand" class="form-input">
              <option value="">Select</option>
              <option value="right">Right Hand</option>
              <option value="left">Left Hand</option>
            </select>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Batsman Type</label>
            <select id="cp-bat-type" class="form-input">
              <option value="">Select</option>
              <option value="radical">Radical</option>
              <option value="brute">Brute</option>
              <option value="defensive">Defensive</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold mb-1">Bowler Type</label>
            <select id="cp-bowl-type" class="form-input">
              <option value="">Select</option>
              <option value="faster">Faster</option>
              <option value="med-pacer">Medium Pacer</option>
              <option value="fast-med">Fast-Medium</option>
              <option value="off-spinner">Off Spinner</option>
              <option value="leg-spinner">Leg Spinner</option>
              <option value="unorthodox">Unorthodox</option>
            </select>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold mb-1">Jersey Number</label>
            <input id="cp-jersey" type="number" min="0" max="999"
                   class="form-input" placeholder="e.g. 7">
          </div>

          ${hasFace ? `
          <div>
            <label class="block font-semibold mb-1">Face (1–80)</label>
            <select id="cp-face" class="form-input" onchange="window.updateFacePreview()">
              ${faceOptions}
            </select>
          </div>
          ` : ''}
        </div>

        ${hasFace ? `
        <div class="flex items-center gap-4 mt-2">
          <div id="cp-face-preview"
               class="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500">
            No face
          </div>

          <label class="flex items-center gap-2 text-xs sm:text-sm">
            <input type="checkbox" id="cp-use-custom-face" onchange="window.toggleCustomFace()">
            Use custom face texture (PNG/JPG max 500 KB)
          </label>
        </div>

        <div class="mt-2">
          <input type="file" id="cp-custom-file" accept="image/png,image/jpeg"
                 class="text-xs" disabled>
        </div>
        ` : ''}

        <button type="submit"
                class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
          Submit Custom Player Request
        </button>
      </form>
    </div>
  `;
}

function renderCustomJerseyForm() {
  const game = window.currentJerseyGame || 'rc25';

  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">
        Custom Jersey · ${game.toUpperCase()}
      </h2>

      <form onsubmit="window.submitCustomJersey(event)" class="space-y-4 text-sm">
        <div>
          <label class="block font-semibold mb-1">Team Name (jersey to update)</label>
          <input id="cj-team" type="text" class="form-input" placeholder="e.g. India, RCB, CSK">
        </div>

        <div>
          <label class="block font-semibold mb-1">Jersey Texture (PNG/JPG)</label>
          <input id="cj-file" type="file" accept="image/png,image/jpeg" class="text-xs">
          <p class="text-[11px] text-slate-500 mt-1">
            Export the final jersey texture from Stark Tester and upload it here. Max ~1 MB.
          </p>
        </div>

        <button type="submit"
                class="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
          Submit Custom Jersey Request
        </button>
      </form>
    </div>
  `;
}

/* ---------- Face helpers ---------- */

window.updateFacePreview = function () {
  const select = document.getElementById('cp-face');
  const preview = document.getElementById('cp-face-preview');
  const useCustom = document.getElementById('cp-use-custom-face');
  if (!select || !preview || (useCustom && useCustom.checked)) return;

  const v = select.value;
  if (!v) {
    preview.innerHTML = 'No face';
    preview.style.backgroundImage = 'none';
    return;
  }

  const src = `assets/modcreator/faces/face_${v}.png`;
  preview.style.backgroundImage = `url('${src}')`;
  preview.style.backgroundSize = 'cover';
  preview.style.backgroundPosition = 'center';
  preview.innerHTML = '';
};

window.toggleCustomFace = function () {
  const useCustom = document.getElementById('cp-use-custom-face');
  const faceSelect = document.getElementById('cp-face');
  const fileInput = document.getElementById('cp-custom-file');
  const preview = document.getElementById('cp-face-preview');

  if (!useCustom || !faceSelect || !fileInput || !preview) return;

  if (useCustom.checked) {
    faceSelect.disabled = true;
    fileInput.disabled = false;
    preview.style.backgroundImage = 'none';
    preview.innerHTML = 'Custom face';
  } else {
    faceSelect.disabled = false;
    fileInput.disabled = true;
    preview.innerHTML = 'No face';
    preview.style.backgroundImage = 'none';
  }
};

/* ---------- Subscription helpers & button lock visuals ---------- */

function styleFeatureButtonsForSub(sub) {
  const jerseyBtn = document.querySelector('.creator-feature-jersey');
  const teamBtn   = document.querySelector('.creator-feature-team');
  const jLock     = document.querySelector('.feature-lock-jersey');
  const tLock     = document.querySelector('.feature-lock-team');

  if (!jerseyBtn || !teamBtn) return;

  const now = Date.now();
  let active = false;
  let planCode = null;

  if (sub && sub.status === 'active' && sub.expiresAt && sub.expiresAt.toDate) {
    const t = sub.expiresAt.toDate().getTime();
    if (t > now) {
      active = true;
      planCode = sub.planCode;
    }
  }

  // Jersey: any active sub
  if (active) {
    jerseyBtn.style.opacity = '1';
    jerseyBtn.style.cursor = 'pointer';
    if (jLock) jLock.classList.add('hidden');
  } else {
    jerseyBtn.style.opacity = '0.5';
    jerseyBtn.style.cursor = 'not-allowed';
    if (jLock) jLock.classList.remove('hidden');
  }

  // Team: only Pro / Elite
  const teamAllowed = active && (planCode === 'P300' || planCode === 'P1000');
  if (teamAllowed) {
    teamBtn.style.opacity = '1';
    teamBtn.style.cursor = 'pointer';
    if (tLock) tLock.classList.add('hidden');
  } else {
    teamBtn.style.opacity = '0.5';
    teamBtn.style.cursor = 'not-allowed';
    if (tLock) tLock.classList.remove('hidden');
  }
}

window.loadCreatorSubscription = function () {
  if (!window.currentUser || !window.db) return;
  const statusEl = document.getElementById('creator-sub-status');
  if (!statusEl) return;

  db.collection('creatorSubs').doc(window.currentUser.uid)
    .onSnapshot(snap => {
      const sub = snap.exists ? snap.data() : null;
      window.creatorSub = sub;
      statusEl.innerHTML = renderSubStatusHtml(sub);
      styleFeatureButtonsForSub(sub);
    }, err => {
      console.error(err);
      statusEl.innerHTML = `<span class="text-red-500 text-xs">Error loading subscription.</span>`;
    });
};

function renderSubStatusHtml(sub) {
  const now = Date.now();

  if (!sub || !sub.status || sub.status === 'rejected') {
    return `
      <div>
        <div class="font-semibold text-slate-800 dark:text-slate-100 mb-1">No active subscription</div>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          You need an active Mod Creator subscription to submit custom requests.
          Choose a plan when asked.
        </p>
      </div>`;
  }

  const plan = CREATOR_PLANS[sub.planCode] || null;
  const expiresAt = sub.expiresAt && sub.expiresAt.toDate ? sub.expiresAt.toDate() : null;
  const expired = !expiresAt || expiresAt.getTime() < now || sub.status !== 'active';

  if (expired) {
    return `
      <div>
        <div class="font-semibold text-slate-800 dark:text-slate-100 mb-1">Subscription expired</div>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Your last plan has expired. Please choose a new plan when submitting a request.
        </p>
      </div>`;
  }

  const used = sub.usedRequests || 0;
  const max = sub.maxRequests || null;
  const remaining = max ? Math.max(0, max - used) : null;

  const remainingText = max
    ? `${remaining}/${max} requests left`
    : 'Unlimited requests';

  const dateStr = expiresAt.toLocaleDateString();

  return `
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <div class="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1">
          <span>Active plan: ${plan ? plan.name : (sub.planCode || '')}</span>
          <span class="material-icons text-amber-400 text-base">workspace_premium</span>
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400">
          ${remainingText} · Expires on ${dateStr}
        </div>
      </div>
      <div class="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold uppercase">
        ACTIVE
      </div>
    </div>`;
}

// for any request (player/jersey)
window.checkCreatorSubBeforeRequest = function () {
  const sub = window.creatorSub;
  if (!window.currentUser) {
    alert('Please login first.');
    return false;
  }

  const now = Date.now();

  if (!sub || !sub.status || sub.status === 'rejected') {
    window.showCreatorPlans('You need an active Mod Creator subscription to submit requests.');
    return false;
  }

  if (sub.status === 'pending') {
    alert('Your subscription request is still pending. We will approve it after verifying payment.');
    return false;
  }

  const expiresAt = sub.expiresAt && sub.expiresAt.toDate ? sub.expiresAt.toDate() : null;
  const expired = !expiresAt || expiresAt.getTime() < now || sub.status !== 'active';

  if (expired) {
    window.showCreatorPlans('Your subscription has expired. Please choose a new plan.');
    return false;
  }

  const max = sub.maxRequests || null;
  const used = sub.usedRequests || 0;
  if (max && used >= max) {
    window.showCreatorPlans('You have used all requests for this plan.');
    return false;
  }

  return true;
};

// For Custom Team: only Pro or Elite, Starter may upgrade to Pro at ₹200
window.checkCreatorSubForTeam = function () {
  if (!window.checkCreatorSubBeforeRequest()) return false;
  const sub = window.creatorSub;
  if (!sub) {
    alert('Custom Team is only available for Pro or Elite plans.');
    return false;
  }

  // Starter plan: offer upgrade to Pro for ₹200
  if (sub.planCode === 'P100') {
    const confirmUpgrade = confirm(
      'Custom Team is only available for Pro or Elite plans.\n\n' +
      'You are on the Starter plan. Upgrade to Pro for ₹200?'
    );
    if (confirmUpgrade) {
      const plan = CREATOR_PLANS.P300;
      if (!plan) {
        alert('Pro plan not found.');
        return false;
      }

      window.cart = [{
        gameId: 'sub_UP_P300',
        gameName: 'Mod Creator Pro Upgrade',
        planName: 'Upgrade Starter → Pro (Custom Team)',
        price: 200,
        image: 'assets/icons/icon_site.jpg',
        subPlanCode: 'P300',
        subPlanName: plan.name,
        subMaxRequests: plan.maxRequests || null,
        subPeriodDays: plan.periodDays
      }];

      if (window.updateCartBadge) window.updateCartBadge();
      if (window.router) window.router.navigateTo('/checkout');
    }
    return false;
  }

  if (sub.planCode !== 'P300' && sub.planCode !== 'P1000') {
    alert('Custom Team is only available for Pro or Elite plans.');
    return false;
  }

  return true;
};

window.showCreatorPlans = function (reason) {
  window.creatorPlansReason = reason || null;
  if (window.router) {
    window.router.navigateTo('/creator-plans');
  }
};

function renderPlanCard(code) {
  const p = CREATOR_PLANS[code];
  if (!p) return '';

  return `
    <div class="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50 dark:bg-slate-900 flex flex-col justify-between">
      <div>
        <div class="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">${p.name}</div>
        <div class="text-2xl font-black text-blue-600 mb-1">₹${p.priceINR}</div>
        <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-2">${p.description}</div>
      </div>
      <button onclick="window.requestCreatorSub('${code}')"
              class="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold">
        Get ${p.name} Plan
      </button>
    </div>`;
}

window.requestCreatorSub = function (planCode) {
  if (!window.currentUser) {
    alert('Please login first.');
    window.googleLogin();
    return;
  }
  const plan = CREATOR_PLANS[planCode];
  if (!plan) {
    alert('Unknown plan.');
    return;
  }

  window.cart = [{
    gameId: `sub_${planCode}`,
    gameName: 'Mod Creator Subscription',
    planName: `${plan.name} (${plan.description})`,
    price: plan.priceINR,
    image: 'assets/icons/icon_site.jpg',
    subPlanCode: planCode,
    subPlanName: plan.name,
    subMaxRequests: plan.maxRequests || null,
    subPeriodDays: plan.periodDays
  }];

  if (window.updateCartBadge) window.updateCartBadge();
  if (window.router) window.router.navigateTo('/checkout');
};

window.incrementCreatorUsage = async function () {
  if (!window.currentUser) return;
  try {
    await db.collection('creatorSubs')
      .doc(window.currentUser.uid)
      .update({
        usedRequests: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  } catch (e) {
    console.warn('incrementCreatorUsage failed:', e.message);
  }
};

/* ---------- Navigation helpers for locking buttons ---------- */

window.goToCreatorJersey = function () {
  if (!window.currentUser) {
    alert('Please login first.');
    if (window.googleLogin) window.googleLogin();
    return;
  }

  // Any active subscription is fine for Jersey
  if (typeof window.checkCreatorSubBeforeRequest === 'function') {
    if (!window.checkCreatorSubBeforeRequest()) return;
  }

  if (window.router) window.router.navigateTo('/creator-jersey');
};

window.goToCreatorTeam = function () {
  if (!window.currentUser) {
    alert('Please login first.');
    if (window.googleLogin) window.googleLogin();
    return;
  }

  if (typeof window.checkCreatorSubForTeam === 'function') {
    if (!window.checkCreatorSubForTeam()) return;
  }

  if (window.router) window.router.navigateTo('/creator-team');
};

/* ---------- Player & Jersey game switch ---------- */

window.setPlayerGame = function (gameId) {
  window.currentPlayerGame = gameId || 'rc25';
  if (window.router) window.router.handleRoute('/creator-player');
};

window.setJerseyGame = function (gameId) {
  window.currentJerseyGame = gameId || 'rc25';
  if (window.router) window.router.handleRoute('/creator-jersey');
};

/* ---------- SUBMIT HELPERS ---------- */

async function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.submitCustomPlayer = async function (evt) {
  evt.preventDefault();

  if (!window.currentUser) {
    alert('Please login first.');
    window.googleLogin();
    return;
  }

  if (!window.checkCreatorSubBeforeRequest()) {
    return;
  }

  const game = window.currentPlayerGame || 'rc25';
  const hasFace = (game === 'rc25');

  const team = document.getElementById('cp-team').value.trim();
  const name = document.getElementById('cp-name').value.trim();
  const type = document.getElementById('cp-type').value;
  const batHand = document.getElementById('cp-bat-hand').value;
  const bowlHand = document.getElementById('cp-bowl-hand').value;
  const batType = document.getElementById('cp-bat-type').value;
  const bowlType = document.getElementById('cp-bowl-type').value;
  const jersey = document.getElementById('cp-jersey').value.trim();

  let faceId = null;
  let useCustom = false;
  let customFaceBase64 = null;
  let customFaceMime = null;

  if (!team || !name || !type || !batHand || !bowlHand || !batType || !bowlType || !jersey) {
    alert('Please fill all fields.');
    return;
  }

  if (hasFace) {
    const faceSelect = document.getElementById('cp-face');
    const useCustomEl = document.getElementById('cp-use-custom-face');
    const fileInput = document.getElementById('cp-custom-file');

    if (faceSelect && useCustomEl && fileInput) {
      faceId = faceSelect.value;
      useCustom = useCustomEl.checked;

      if (!useCustom && !faceId) {
        alert('Please select a face or enable custom face.');
        return;
      }

      if (useCustom) {
        const file = fileInput.files[0];
        if (!file) {
          alert('Please choose a custom face image.');
          return;
        }
        if (file.size > 500 * 1024) {
          alert('Custom face image must be less than 500 KB.');
          return;
        }
        customFaceMime = file.type || 'image/png';
        customFaceBase64 = await readFileAsBase64(file);
      }
    }
  }

  const submitBtn = evt.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
  }

  const requestData = {
    type: 'player',
    gameId: game,
    userId: window.currentUser.uid,
    email: window.currentUser.email,
    userName: window.currentUser.displayName || '',
    teamName: team,
    playerName: name,
    playerType: type,
    battingHand: batHand,
    bowlingHand: bowlHand,
    batsmanType: batType,
    bowlerType: bowlType,
    jerseyNumber: jersey,
    faceId: hasFace && faceId ? parseInt(faceId, 10) : null,
    useCustomFace: hasFace ? useCustom : false,
    createdAt: new Date().toISOString()
  };

  try {
    await db.collection('modRequests').add({
      ...requestData,
      status: 'pending',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      hasDownload: false,
      downloadUrl: null
    });

    await window.incrementCreatorUsage();

    await fetch('/api/custom-player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestData,
        customFaceBase64,
        customFaceMime
      })
    });

    alert('✅ Custom player request submitted! We will review and send your file after approval.');
    if (window.router) window.router.navigateTo('/creator-history');
  } catch (e) {
    console.error(e);
    alert('Error: ' + e.message);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Custom Player Request';
    }
  }
};

window.submitCustomJersey = async function (evt) {
  evt.preventDefault();

  if (!window.currentUser) {
    alert('Please login first.');
    window.googleLogin();
    return;
  }

  if (!window.checkCreatorSubBeforeRequest()) {
    return;
  }

  const game = window.currentJerseyGame || 'rc25';

  const team = document.getElementById('cj-team').value.trim();
  const fileInput = document.getElementById('cj-file');

  if (!team) {
    alert('Please enter the team name.');
    return;
  }

  const file = fileInput.files[0];
  if (!file) {
    alert('Please upload the jersey texture image.');
    return;
  }
  if (file.size > 1024 * 1024) {
    alert('Jersey texture should be within 1 MB.');
    return;
  }

  const jerseyMime = file.type || 'image/png';
  const jerseyBase64 = await readFileAsBase64(file);

  const submitBtn = evt.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
  }

  const requestData = {
    type: 'jersey',
    gameId: game,
    userId: window.currentUser.uid,
    email: window.currentUser.email,
    userName: window.currentUser.displayName || '',
    teamName: team,
    createdAt: new Date().toISOString()
  };

  try {
    await db.collection('modRequests').add({
      ...requestData,
      status: 'pending',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      hasDownload: false,
      downloadUrl: null
    });

    await window.incrementCreatorUsage();

    await fetch('/api/custom-jersey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestData,
        jerseyBase64,
        jerseyMime
      })
    });

    alert('✅ Custom jersey request submitted! We will review and send your file after approval.');
    if (window.router) window.router.navigateTo('/creator-history');
  } catch (e) {
    console.error(e);
    alert('Error: ' + e.message);
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Custom Jersey Request';
    }
  }
};

window.submitCustomTeam = async function () {
  if (!window.currentUser) {
    alert('Please login first.');
    window.googleLogin();
    return;
  }

  if (!window.checkCreatorSubForTeam()) {
    return;
  }

  if (!window.teamBuilder) resetTeamBuilder();

  const mode = window.teamBuilder.mode || 'new';

  const teamName = document.getElementById('ct-team-name').value.trim();
  const teamShort = document.getElementById('ct-team-short').value.trim();
  const replaceName = document.getElementById('ct-replace-name').value.trim();
  const jerseyFile = document.getElementById('ct-jersey-file').files[0];
  const logoFile = document.getElementById('ct-logo-file').files[0];

  if (!teamName || !teamShort) {
    alert('Please enter team name and short name.');
    return;
  }
  if (mode === 'replace' && !replaceName) {
    alert('Please enter replacement team name.');
    return;
  }
  if (!jerseyFile || !logoFile) {
    alert('Please upload both jersey texture and team logo.');
    return;
  }

  const players = window.teamBuilder.players || [];
  if (players.length === 0) {
    alert('Please add at least one player to the squad.');
    return;
  }
  if (players.length > 12) {
    alert('Maximum 12 players allowed.');
    return;
  }

  const jerseyMime = jerseyFile.type || 'image/png';
  const logoMime = logoFile.type || 'image/png';
  const jerseyBase64 = await readFileAsBase64(jerseyFile);
  const logoBase64 = await readFileAsBase64(logoFile);

  const requestData = {
    type: 'team',
    userId: window.currentUser.uid,
    email: window.currentUser.email,
    userName: window.currentUser.displayName || '',
    mode,
    teamName,
    teamShortName: teamShort,
    replaceTeamName: mode === 'replace' ? replaceName : null,
    players,
    createdAt: new Date().toISOString()
  };

  try {
    await db.collection('modRequests').add({
      ...requestData,
      status: 'pending',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      hasDownload: false,
      downloadUrl: null
    });

    await window.incrementCreatorUsage();

    await fetch('/api/custom-team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestData,
        jerseyBase64,
        jerseyMime,
        logoBase64,
        logoMime
      })
    });

    alert('✅ Custom team request submitted! We will review and send your file after approval.');
    if (window.router) window.router.navigateTo('/creator-history');
  } catch (e) {
    console.error(e);
    alert('Error: ' + e.message);
  }
};

/* ---------- HISTORY LIST ---------- */

window.loadCreatorHistory = function () {
  const container = document.getElementById('creator-history');
  if (!container || !window.db || !window.currentUser) return;

  db.collection('modRequests')
    .where('userId', '==', window.currentUser.uid)
    // .orderBy('timestamp', 'desc')  // avoid index requirement; we will sort client-side
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = `<div class="text-slate-400 text-xs">No Mod Creator requests yet.</div>`;
        return;
      }

      // Collect docs and sort by timestamp DESC on client
      const docs = [];
      snapshot.forEach(doc => docs.push(doc.data()));
      docs.sort((a, b) => {
        const ta = a.timestamp && a.timestamp.toDate ? a.timestamp.toDate().getTime() : 0;
        const tb = b.timestamp && b.timestamp.toDate ? b.timestamp.toDate().getTime() : 0;
        return tb - ta;
      });

      let html = '';
      docs.forEach(r => {
        const type = r.type || 'player';

        let badgeClass = 'bg-yellow-100 text-yellow-700';
        if (r.status === 'approved') badgeClass = 'bg-green-100 text-green-700';
        if (r.status === 'rejected') badgeClass = 'bg-red-100 text-red-700';

        let statusLabel = r.status || 'pending';
        if (statusLabel === 'pending') {
          statusLabel = 'Checking (24–48 hrs)';
        }

        let mainLine = '';
        let detailLine = '';

        if (type === 'jersey') {
          const gameText = r.gameId ? ` · ${r.gameId.toUpperCase()}` : '';
          mainLine = `Custom Jersey <span class="text-xs text-slate-400">(${r.teamName}${gameText})</span>`;
          detailLine = 'Jersey texture update request';
        } else if (type === 'team') {
          const modeText = r.mode === 'replace'
            ? `Replace: ${r.replaceTeamName || '-'}`
            : 'New team';
          mainLine = `Custom Team: ${r.teamName} <span class="text-xs text-slate-400">(${r.teamShortName || ''})</span>`;
          detailLine = `${modeText} · Players: ${(r.players || []).length}`;
        } else {
          const game = r.gameId ? r.gameId.toUpperCase() : 'RC25';
          mainLine = `${r.playerName} <span class="text-xs text-slate-400">(${r.teamName} · ${game})</span>`;
          detailLine = `${r.playerType}, Bat: ${r.battingHand}, Bowl: ${r.bowlingHand} · Jersey #${r.jerseyNumber}`;
        }

        const downloadBtn =
          r.status === 'approved' && r.downloadUrl
            ? `<button onclick="window.open('${r.downloadUrl}','_blank')"
                       class="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                 <span class="material-icons text-xs">download</span> Download
               </button>`
            : '';

        const checkingNote =
          r.status === 'pending'
            ? `<div class="mt-1 text-[11px] text-amber-500">
                 Your request is being checked. It usually takes 24–48 hours before the download is available.
               </div>`
            : '';

        html += `
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 flex justify-between items-start gap-2">
            <div>
              <div class="font-semibold text-slate-900 dark:text-white">${mainLine}</div>
              <div class="text-[11px] text-slate-500">${detailLine}</div>
              ${downloadBtn}
              ${checkingNote}
            </div>
            <span class="badge ${badgeClass} text-[10px] uppercase font-bold">
              ${statusLabel}
            </span>
          </div>`;
      });

      container.innerHTML = html;
    }, err => {
      console.error('loadCreatorHistory error:', err);
      container.innerHTML = `<div class="text-red-500 text-xs">Error loading history.</div>`;
    });
};

/* ---------- REGISTER PAGE FUNCTIONS ---------- */

window.CreatorPage = CreatorPage;
window.CreatorPlayerPage = CreatorPlayerPage;
window.CreatorJerseyPage = CreatorJerseyPage;
window.CreatorTeamPage = CreatorTeamPage;
window.CreatorHistoryPage = CreatorHistoryPage;
window.CreatorPlansPage = CreatorPlansPage;
