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
