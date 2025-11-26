// pages/creator.js

// --- PLAN CONFIG (client side) ---
const CREATOR_PLANS = {
  P100: {
    code: 'P100',
    name: 'Starter',
    priceINR: 100,
    maxRequests: 20,
    periodDays: 30,
    description: '20 requests · 30 days'
  },
  P300: {
    code: 'P300',
    name: 'Pro',
    priceINR: 300,
    maxRequests: 70,
    periodDays: 30,
    description: '70 requests · 30 days'
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

// globals for subscription flow
window.creatorSub = null;
window.creatorPlansReason = null;
window.creatorSelectedPlanCode = null;

/* ---------------- MAIN PAGES ---------------- */

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

  // Load subscription info after render
  setTimeout(() => {
    if (window.loadCreatorSubscription) window.loadCreatorSubscription();
  }, 200);

  return `
    <div class="max-w-4xl mx-auto animate-fade-in pb-20">
      <h1 class="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Mod Creator</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Create custom content for your game. Right now only <span class="font-semibold">Custom Player</span> is available.
      </p>

      <!-- Subscription status -->
      <div id="creator-sub-status" class="mb-6 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
        Loading subscription...
      </div>

      <!-- MAIN BUTTONS -->
      <div class="grid sm:grid-cols-2 gap-4 mb-4">
        <button class="p-5 rounded-2xl border border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-left hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
        onclick="window.router && window.router.navigateTo('/creator-player')">
          <div class="flex items-center gap-3">
            <span class="material-icons text-3xl text-blue-600">person</span>
            <div>
              <div class="font-bold text-slate-900 dark:text-white">Custom Player</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Create your own player with custom face &amp; details.</div>
            </div>
          </div>
        </button>

        <button class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left opacity-60 cursor-not-allowed">
          <div class="flex items-center gap-3">
            <span class="material-icons text-3xl text-slate-400">checkroom</span>
            <div>
              <div class="font-bold text-slate-600 dark:text-slate-300">Custom Jersey</div>
              <div class="text-xs text-slate-400">Coming soon.</div>
            </div>
          </div>
        </button>

        <button class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left opacity-60 cursor-not-allowed">
          <div class="flex items-center gap-3">
            <span class="material-icons text-3xl text-slate-400">groups</span>
            <div>
              <div class="font-bold text-slate-600 dark:text-slate-300">Custom Team</div>
              <div class="text-xs text-slate-400">Coming soon.</div>
            </div>
          </div>
        </button>

        <button class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-left opacity-60 cursor-not-allowed">
          <div class="flex items-center gap-3">
            <span class="material-icons text-3xl text-slate-400">emoji_events</span>
            <div>
              <div class="font-bold text-slate-600 dark:text-slate-300">Custom Tournament</div>
              <div class="text-xs text-slate-400">Coming soon.</div>
            </div>
          </div>
        </button>
      </div>

      <button onclick="window.router.navigateTo('/creator-history')"
              class="mb-6 text-xs sm:text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg font-bold flex items-center gap-1">
        <span class="material-icons text-xs">history</span> View Request History
      </button>

      <!-- SECTION CONTENT -->
      <div id="creator-section">
        <!-- empty until user clicks Custom Player -->
      </div>
    </div>
  `;
}

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
        All your custom player requests and their status.
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

/* ---------------- SECTION RENDERING ---------------- */

window.showCreatorSection = function (section) {
  const container = document.getElementById('creator-section');
  if (!container) return;

  if (section === 'player') {
    container.innerHTML = renderCustomPlayerForm();
  } else {
    container.innerHTML = '';
  }
};

/* ---------------- CUSTOM PLAYER FORM ---------------- */

function renderCustomPlayerForm() {
  let faceOptions = '<option value="">Select Face (1–80)</option>';
  for (let i = 1; i <= 80; i++) {
    faceOptions += `<option value="${i}">Face ${i}</option>`;
  }

  return `
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-white">Custom Player</h2>

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
          <div>
            <label class="block font-semibold mb-1">Face (1–80)</label>
            <select id="cp-face" class="form-input" onchange="window.updateFacePreview()">
              ${faceOptions}
            </select>
          </div>
        </div>

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

        <button type="submit"
                class="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
          Submit Custom Player Request
        </button>
      </form>
    </div>
  `;
}

/* ---------- Face preview helpers ---------- */

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

/* ---------- Subscription helpers ---------- */

window.loadCreatorSubscription = function () {
  if (!window.currentUser || !window.db) return;
  const statusEl = document.getElementById('creator-sub-status');
  if (!statusEl) return;

  db.collection('creatorSubs').doc(window.currentUser.uid)
    .onSnapshot(snap => {
      window.creatorSub = snap.exists ? snap.data() : null;
      statusEl.innerHTML = renderSubStatusHtml(window.creatorSub);
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
          You need an active Mod Creator subscription to submit custom player requests.
          Click <b>Custom Player</b> and choose a plan when asked.
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
          Your last plan has expired. Please choose a new plan when submitting a custom player.
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
        <div class="font-semibold text-slate-800 dark:text-slate-100">
          Active plan: ${plan ? plan.name : (sub.planCode || '')}
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

window.checkCreatorSubBeforeRequest = function () {
  const sub = window.creatorSub;
  if (!window.currentUser) {
    alert('Please login first.');
    return false;
  }

  const now = Date.now();

  if (!sub || !sub.status || sub.status === 'rejected') {
    window.showCreatorPlans('You need an active Mod Creator subscription to submit custom player requests.');
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

window.requestCreatorSub = async function (planCode) {
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

  try {
    // create/update sub doc
    const ref = db.collection('creatorSubs').doc(window.currentUser.uid);
    await ref.set({
      userId: window.currentUser.uid,
      email: window.currentUser.email,
      planCode,
      status: 'pending',
      requestedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      planName: plan.name,
      priceINR: plan.priceINR,
      maxRequests: plan.maxRequests || null,
      usedRequests: 0,
      expiresAt: null
    }, { merge: true });

    // telegram notify
    await fetch('/api/creator-sub', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: window.currentUser.uid,
        email: window.currentUser.email,
        planCode,
        planName: plan.name,
        priceINR: plan.priceINR
      })
    });

    // put subscription in cart and go to checkout
    window.cart = [{
      gameId: `sub_${planCode}`,
      gameName: 'Mod Creator Subscription',
      planName: `${plan.name} (${plan.description})`,
      price: plan.priceINR,
      image: 'assets/icons/icon_site.jpg'
    }];

    if (window.updateCartBadge) window.updateCartBadge();
    if (window.router) window.router.navigateTo('/checkout');

  } catch (e) {
    console.error(e);
    alert('Error: ' + e.message);
  }
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

/* ---------- SUBMIT CUSTOM PLAYER ---------- */

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

  const team = document.getElementById('cp-team').value.trim();
  const name = document.getElementById('cp-name').value.trim();
  const type = document.getElementById('cp-type').value;
  const batHand = document.getElementById('cp-bat-hand').value;
  const bowlHand = document.getElementById('cp-bowl-hand').value;
  const batType = document.getElementById('cp-bat-type').value;
  const bowlType = document.getElementById('cp-bowl-type').value;
  const jersey = document.getElementById('cp-jersey').value.trim();
  const faceId = document.getElementById('cp-face').value;
  const useCustom = document.getElementById('cp-use-custom-face').checked;
  const fileInput = document.getElementById('cp-custom-file');

  if (!team || !name || !type || !batHand || !bowlHand || !batType || !bowlType || !jersey) {
    alert('Please fill all fields.');
    return;
  }

  if (!useCustom && !faceId) {
    alert('Please select a face or enable custom face.');
    return;
  }

  let customFaceBase64 = null;
  let customFaceMime = null;

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

  const submitBtn = evt.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
  }

  const requestData = {
    type: 'player',
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
    faceId: useCustom ? null : (faceId ? parseInt(faceId, 10) : null),
    useCustomFace: useCustom,
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

/* ---------- HISTORY LIST ---------- */

window.loadCreatorHistory = function () {
  const container = document.getElementById('creator-history');
  if (!container || !window.db || !window.currentUser) return;

  db.collection('modRequests')
    .where('userId', '==', window.currentUser.uid)
    .where('type', '==', 'player')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = `<div class="text-slate-400 text-xs">No custom player requests yet.</div>`;
        return;
      }

      let html = '';
      snapshot.forEach(doc => {
        const r = doc.data();
        let badgeClass = 'bg-yellow-100 text-yellow-700';
        if (r.status === 'approved') badgeClass = 'bg-green-100 text-green-700';
        if (r.status === 'rejected') badgeClass = 'bg-red-100 text-red-700';

        const downloadBtn =
          r.status === 'approved' && r.downloadUrl
            ? `<button onclick="window.open('${r.downloadUrl}','_blank')"
                       class="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                 <span class="material-icons text-xs">download</span> Download
               </button>`
            : '';

        html += `
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 flex justify-between items-start gap-2">
            <div>
              <div class="font-semibold text-slate-900 dark:text-white">${r.playerName} <span class="text-xs text-slate-400">(${r.teamName})</span></div>
              <div class="text-[11px] text-slate-500">
                ${r.playerType}, Bat: ${r.battingHand}, Bowl: ${r.bowlingHand} · Jersey #${r.jerseyNumber}
              </div>
              ${downloadBtn}
            </div>
            <span class="badge ${badgeClass} text-[10px] uppercase font-bold">
              ${r.status || 'pending'}
            </span>
          </div>`;
      });

      container.innerHTML = html;
    }, err => {
      console.error(err);
      container.innerHTML = `<div class="text-red-500 text-xs">Error loading history.</div>`;
    });
};

/* ---------- REGISTER PAGE FUNCTIONS ---------- */

window.CreatorPage = CreatorPage;
window.CreatorHistoryPage = CreatorHistoryPage;
window.CreatorPlansPage = CreatorPlansPage;
