// pages/creator.js

// --- CONFIGURATION ---
const CREATOR_PLANS = {
  P100: { code: 'P100', name: 'Starter', priceINR: 100, maxRequests: 20, periodDays: 30 },
  P300: { code: 'P300', name: 'Pro', priceINR: 300, maxRequests: 70, periodDays: 30 },
  P1000: { code: 'P1000', name: 'Elite', priceINR: 1000, maxRequests: null, periodDays: 60 }
};

const TEAMS_DATA = {
  International: ["India", "Australia", "England", "Pakistan", "New Zealand", "South Africa", "West Indies", "Sri Lanka", "Bangladesh", "Afghanistan"],
  Leagues: {
    IPL: ["CSK", "Mumbai Indians", "RCB", "KKR", "SRH", "Rajasthan Royals", "Delhi Capitals", "Punjab Kings", "LSG", "Gujarat Titans"],
    PSL: ["Islamabad United", "Karachi Kings", "Lahore Qalandars", "Multan Sultans", "Peshawar Zalmi", "Quetta Gladiators"]
  },
  Masters: ["India Legends", "World Giants", "Asia Lions"]
};

const BOWLING_ACTIONS = {
  fast: ['Standard', 'Slingy', 'High Arm', 'Shaheen', 'Bumrah', 'Malinga', 'Starc'],
  spin: ['Standard', 'Leg Break', 'Off Break', 'Mystery', 'Rashid', 'Narine', 'Warne']
};

// --- STATE ---
window.creatorSub = null;
window.currentPlayerGame = 'rc25';
window.currentJerseyGame = 'rc25';
window.teamBuilder = { mode: 'new', teamName: '', players: [] };
window.tempCustomFaceBase64 = null;

function resetTeamBuilder() {
  window.teamBuilder = { mode: 'new', teamName: '', players: [] };
}

/* ===========================
   UI COMPONENTS
   =========================== */

function CreatorPage() {
  if (window.location.pathname === '/creator-player') return CreatorPlayerPage();
  if (window.location.pathname === '/creator-team') return CreatorTeamPage();
  if (window.location.pathname === '/creator-jersey') return CreatorJerseyPage();
  if (window.location.pathname === '/creator-history') return CreatorHistoryPage();
  if (window.location.pathname === '/creator-plans') return CreatorPlansPage();
  return CreatorMenuUI();
}

function CreatorMenuUI() {
  if (!window.currentUser) return `<div class="p-10 text-center"><h1 class="text-2xl font-bold">Login Required</h1><button onclick="window.googleLogin()" class="btn mt-4">Login</button></div>`;
  setTimeout(() => { if(window.loadCreatorSubscription) window.loadCreatorSubscription(); }, 200);

  return `
    <div class="max-w-5xl mx-auto animate-fade-in pb-24 px-4 pt-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">Mod Creator</h1>
        <button onclick="window.router.navigateTo('/creator-history')" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-bold text-xs">History</button>
      </div>
      <div id="creator-sub-status" class="mb-6"></div>
      <div class="grid sm:grid-cols-3 gap-6">
        <button class="app-card p-6 text-left hover:scale-[1.02] transition" onclick="window.router.navigateTo('/creator-player')">
           <div class="text-4xl mb-2">👤</div><div class="font-bold text-lg">Custom Player</div><div class="text-xs text-slate-500">Create single player mod</div>
        </button>
        <button class="app-card p-6 text-left hover:scale-[1.02] transition" onclick="window.goToCreatorTeam()">
           <div class="text-4xl mb-2">👥</div><div class="font-bold text-lg">Custom Team</div><div class="text-xs text-slate-500">Build full squads</div>
        </button>
        <button class="app-card p-6 text-left hover:scale-[1.02] transition" onclick="window.goToCreatorJersey()">
           <div class="text-4xl mb-2">👕</div><div class="font-bold text-lg">Custom Jersey</div><div class="text-xs text-slate-500">Upload textures</div>
        </button>
      </div>
    </div>`;
}

// --- HELPER: TEXT GENERATOR (Crucial for Admin/Bot View) ---
function generateSquadSummary(players) {
    return players.map((p, i) => {
        let txt = `${i+1}. ${p.name} (${p.role})\n` +
                  `   Jersey: ${p.jersey} | Face: ${p.face}\n` +
                  `   Bat: ${p.batHand} (${p.batStyle})\n` +
                  `   Stats: Tim-${p.batTiming} Agg-${p.batAggression} Tec-${p.batTechnique}`;
        if(p.role !== 'Batsman' && p.role !== 'Keeper') {
            txt += `\n   Bowl: ${p.bowlHand} ${p.bowlStyle}\n` +
                   `   Action: ${p.bowlAction} | Skill-${p.bowlSkill} Mov-${p.bowlMovement}`;
        }
        return txt;
    }).join('\n\n----------------\n\n');
}

/* ===========================
   CUSTOM TEAM PAGE (Mobile Friendly)
   =========================== */

function CreatorTeamPage() {
  if (!window.currentUser) { setTimeout(() => window.router.navigateTo('/creator'), 50); return ''; }
  if (!window.teamBuilder) resetTeamBuilder();

  // Re-render list helper
  window.renderSquadList = function() {
      const list = document.getElementById('ct-players-list');
      const count = document.getElementById('squad-count');
      if(list && window.teamBuilder) {
          count.innerText = `${window.teamBuilder.players.length}/15`;
          list.innerHTML = window.teamBuilder.players.map((p, i) => 
              `<div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mb-2 shadow-sm border border-slate-200 dark:border-slate-700">
                  <div>
                      <div class="font-bold text-sm">${i+1}. ${p.name} <span class="text-xs text-slate-500 font-normal">(${p.role})</span></div>
                      <div class="text-[10px] text-slate-400">Jer: ${p.jersey} | ${p.face}</div>
                  </div>
                  <button onclick="window.removeTeamPlayer(${i})" class="text-red-500 bg-red-50 p-1.5 rounded"><span class="material-icons text-sm">delete</span></button>
              </div>`
          ).join('') || '<div class="text-center text-slate-400 text-sm py-6">No players added yet.</div>';
      }
  };

  setTimeout(window.renderSquadList, 200);

  return `
    <div class="max-w-3xl mx-auto pb-32 px-4 pt-6">
      <div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-black">Team Builder</h1><button onclick="window.router.navigateTo('/creator')" class="text-xs font-bold bg-slate-200 px-3 py-1 rounded">Back</button></div>
      
      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
         <h3 class="text-xs font-bold uppercase text-slate-400 mb-3">Team Details</h3>
         <div class="grid grid-cols-2 gap-4 mb-4">
            <input id="ct-team-name" type="text" class="form-input w-full h-11 text-sm font-bold" placeholder="Team Name (e.g. Stark XI)">
            <input id="ct-team-short" type="text" maxlength="3" class="form-input w-full h-11 text-sm font-bold uppercase" placeholder="TAG (e.g. STK)">
         </div>
         <div class="grid grid-cols-2 gap-4">
            <div><label class="text-[10px] font-bold uppercase block mb-1">Jersey</label><input id="ct-jersey-file" type="file" accept="image/*" class="text-xs w-full"></div>
            <div><label class="text-[10px] font-bold uppercase block mb-1">Logo</label><input id="ct-logo-file" type="file" accept="image/*" class="text-xs w-full"></div>
         </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-20">
         <div class="flex justify-between items-center mb-4"><h3 class="text-xs font-bold uppercase text-slate-400">Squad List</h3><span id="squad-count" class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">0/15</span></div>
         <div id="ct-players-list" class="mb-4"></div>
         <button onclick="window.openPlayerModal()" class="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-bold text-sm hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"><span class="material-icons">add</span> Add Player</button>
      </div>

      <div class="fixed bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-center z-40">
         <button onclick="window.submitCustomTeam()" class="w-full max-w-3xl bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg text-lg">Submit Team Request</button>
      </div>
    </div>

    <div id="player-modal" class="fixed inset-0 z-50 hidden bg-black/50 backdrop-blur-sm animate-fade-in flex items-end sm:items-center justify-center">
       <div class="bg-white dark:bg-slate-950 w-full sm:max-w-md h-[90vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
             <h3 class="font-black text-lg">Add Player</h3>
             <button onclick="window.closePlayerModal()" class="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><span class="material-icons text-sm">close</span></button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
             <div class="grid grid-cols-2 gap-3">
                <div class="col-span-2"><label class="label-xs">Name</label><input id="tp-name" class="form-input w-full font-bold" placeholder="Player Name"></div>
                <div><label class="label-xs">Role</label><select id="tp-type" class="form-input w-full" onchange="window.updateBowlingOptions('tp')"><option value="Batsman">Batsman</option><option value="Bowler">Bowler</option><option value="All-Rounder">All-Rounder</option><option value="Keeper">Keeper</option></select></div>
                <div><label class="label-xs">Jersey</label><input id="tp-jersey" type="number" class="form-input w-full" placeholder="18"></div>
             </div>

             <div class="grid grid-cols-2 gap-3">
                <div><label class="label-xs">Bat Hand</label><select id="tp-bat-hand" class="form-input w-full"><option value="Right">Right</option><option value="Left">Left</option></select></div>
                <div><label class="label-xs">Bowl Hand</label><select id="tp-bowl-hand" class="form-input w-full"><option value="Right">Right</option><option value="Left">Left</option></select></div>
             </div>

             <div>
                <label class="label-xs">Face ID (1-80) or Custom</label>
                <div class="flex gap-2">
                   <select id="tp-face-select" class="form-input w-2/3" onchange="if(this.value==='custom') document.getElementById('tp-face-custom').classList.remove('hidden'); else document.getElementById('tp-face-custom').classList.add('hidden');">
                      <option value="Random">Random</option>
                      ${Array.from({length:80},(_,i)=>`<option value="Face ${i+1}">Face ${i+1}</option>`).join('')}
                      <option value="custom">Upload Custom Photo</option>
                   </select>
                   <input id="tp-face-custom" type="file" accept="image/*" class="hidden w-full text-xs">
                </div>
             </div>

             <div class="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div class="flex justify-between mb-3"><span class="text-xs font-bold text-blue-600">BATTING</span><select id="tp-bat-style" class="text-[10px] p-1 rounded border"><option>Balanced</option><option>Radical</option><option>Brute</option><option>Defensive</option></select></div>
                <div class="space-y-3">
                   ${slider('tp-timing','Timing','blue')}
                   ${slider('tp-aggression','Aggression','red')}
                   ${slider('tp-technique','Technique','purple')}
                </div>
             </div>

             <div id="tp-bowling-section" class="hidden bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div class="flex justify-between mb-3"><span class="text-xs font-bold text-green-600">BOWLING</span><select id="tp-bowl-style" class="text-[10px] p-1 rounded border" onchange="window.updateBowlingActions('tp')"><option value="Fast">Fast</option><option value="Medium">Medium</option><option value="Spin">Spin</option></select></div>
                <div class="mb-2"><label class="label-xs">Action</label><select id="tp-bowl-action" class="form-input w-full text-xs"></select></div>
                <div class="space-y-3">
                   ${slider('tp-bowl-skill','Accuracy','orange')}
                   ${slider('tp-bowl-move','Movement','green')}
                </div>
             </div>
          </div>

          <div class="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
             <button onclick="window.addTeamPlayer()" class="w-full bg-slate-900 dark:bg-white dark:text-black text-white py-3 rounded-xl font-bold shadow-lg">Add to Squad</button>
          </div>
       </div>
    </div>`;
}

function slider(id, label, color) {
    return `<div class="flex items-center gap-2"><span class="text-[10px] font-bold w-12 uppercase text-slate-400">${label}</span><input id="${id}" type="range" class="flex-1 h-2 bg-slate-200 rounded-lg appearance-none accent-${color}-500" min="1" max="99" value="80" oninput="this.nextElementSibling.innerText=this.value"><span class="text-xs font-bold w-6 text-right">80</span></div>`;
}

// --- LOGIC: ADD PLAYER ---
window.openPlayerModal = function() { document.getElementById('player-modal').classList.remove('hidden'); };
window.closePlayerModal = function() { document.getElementById('player-modal').classList.add('hidden'); };

window.addTeamPlayer = function() {
    const name = document.getElementById('tp-name').value.trim();
    if(!name) { alert("Enter Name"); return; }
    
    const role = document.getElementById('tp-type').value;
    const isBowler = role !== 'Batsman' && role !== 'Keeper';
    
    const faceVal = document.getElementById('tp-face-select').value;
    const customFace = document.getElementById('tp-face-custom').files[0];
    
    // BUILD DATA
    const p = {
        name: name, role: role, 
        jersey: document.getElementById('tp-jersey').value || '0',
        face: faceVal === 'custom' ? 'Custom Upload' : faceVal,
        batHand: document.getElementById('tp-bat-hand').value,
        bowlHand: document.getElementById('tp-bowl-hand').value,
        batStyle: document.getElementById('tp-bat-style').value,
        batTiming: document.getElementById('tp-timing').value,
        batAggression: document.getElementById('tp-aggression').value,
        batTechnique: document.getElementById('tp-technique').value,
        bowlStyle: isBowler ? document.getElementById('tp-bowl-style').value : 'N/A',
        bowlAction: isBowler ? document.getElementById('tp-bowl-action').value : 'N/A',
        bowlSkill: isBowler ? document.getElementById('tp-bowl-skill').value : '0',
        bowlMovement: isBowler ? document.getElementById('tp-bowl-move').value : '0'
    };

    if(customFace) {
        readFileAsBase64(customFace).then(b64 => p.customFaceBase64 = b64);
    }

    window.teamBuilder.players.push(p);
    
    // Clear inputs
    document.getElementById('tp-name').value = '';
    window.closePlayerModal();
    window.renderSquadList();
};

window.removeTeamPlayer = function(i) {
    window.teamBuilder.players.splice(i, 1);
    window.renderSquadList();
};

// --- SUBMIT TEAM (WITH SUMMARY TEXT) ---
window.submitCustomTeam = async function() {
    if(!window.checkCreatorSubForTeam()) return;
    const tName = document.getElementById('ct-team-name').value.trim();
    if(!tName || window.teamBuilder.players.length === 0) { alert("Please fill details and add players."); return; }

    const btn = document.querySelector('button[onclick="window.submitCustomTeam()"]');
    btn.disabled = true; btn.innerText = "Uploading...";

    try {
        const jFile = document.getElementById('ct-jersey-file').files[0];
        const lFile = document.getElementById('ct-logo-file').files[0];
        if(!jFile || !lFile) throw new Error("Please upload Jersey and Logo");

        const jB = await readFileAsBase64(jFile);
        const lB = await readFileAsBase64(lFile);
        
        // GENERATE TEXT SUMMARY FOR ADMIN/BOT
        const summary = generateSquadSummary(window.teamBuilder.players);

        const data = {
            type: 'team',
            userId: window.currentUser.uid,
            email: window.currentUser.email,
            userName: window.currentUser.displayName,
            teamName: tName,
            teamShortName: document.getElementById('ct-team-short').value,
            mode: 'new',
            players: window.teamBuilder.players, // Raw Data
            squadSummary: summary, // Pre-formatted Text for Admin/Bot
            createdAt: new Date().toISOString()
        };

        await db.collection('modRequests').add({ ...data, status: 'pending', timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        await window.incrementCreatorUsage();
        try { await fetch('/api/custom-team', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...data, jerseyBase64: jB, logoBase64: lB}) }); } catch(e){}

        alert("✅ Team Request Sent!");
        window.router.navigateTo('/creator-history');
    } catch(e) { alert("Error: " + e.message); btn.disabled = false; btn.innerText = "Submit Team Request"; }
};

/* =========================================
   CUSTOM PLAYER, JERSEY, PLANS, HISTORY
   ========================================= */
// (Standard implementations kept for completeness)

function CreatorJerseyPage() { if (!window.currentUser) { setTimeout(()=>window.router.navigateTo('/creator'),50); return ''; } return `<div class="max-w-xl mx-auto pt-10 px-4"><h1 class="text-2xl font-bold mb-6">Custom Jersey</h1><div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"><form onsubmit="window.submitCustomJersey(event)" class="space-y-4"><div><label class="label">Team Name</label><input id="cj-team" type="text" class="form-input w-full"></div><div><label class="label">Jersey File</label><input id="cj-file" type="file" accept="image/*" class="text-sm w-full"></div><button class="btn w-full bg-green-600 text-white py-3 rounded-lg">Submit</button></form></div></div>`; }
function CreatorHistoryPage() { if (!window.currentUser) { setTimeout(()=>window.router.navigateTo('/'),50); return ''; } setTimeout(()=>{ const c=document.getElementById('hist-list'); if(c) db.collection('modRequests').where('userId','==',window.currentUser.uid).onSnapshot(s=>{ c.innerHTML = s.docs.map(d=>{const r=d.data(); return `<div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-2 border-l-4 ${r.status==='approved'?'border-green-500':'border-amber-500'}"><b>${r.type.toUpperCase()}: ${r.teamName||r.playerName}</b><div class="text-xs text-slate-500">${r.status} · ${new Date(r.createdAt).toLocaleDateString()}</div></div>`}).join('') || '<div class="p-10 text-center">No history.</div>'; }) },200); return `<div class="max-w-2xl mx-auto pt-10 px-4"><h1 class="text-2xl font-bold mb-6">History</h1><div id="hist-list">Loading...</div></div>`; }
function CreatorPlayerPage() { if(!window.currentUser){ setTimeout(()=>window.router.navigateTo('/creator'),50); return ''; } return `<div class="max-w-2xl mx-auto pt-10 px-4"><h1 class="text-2xl font-bold mb-4">Custom Player (Simple)</h1><p class="mb-4 text-slate-500">For full team, use Team Builder.</p><button onclick="window.router.navigateTo('/creator-team')" class="btn bg-blue-600 text-white px-6 py-3 rounded-lg">Go to Team Builder</button></div>`; }
function CreatorPlansPage() { return `<div class="p-10 text-center">Plans Page (Use Admin to Activate)</div>`; }

window.submitCustomJersey = async function(e){ e.preventDefault(); try{ const f=document.getElementById('cj-file').files[0]; if(!f) throw new Error("File?"); const b64=await readFileAsBase64(f); const d={type:'jersey',userId:window.currentUser.uid,teamName:document.getElementById('cj-team').value,createdAt:new Date().toISOString()}; await db.collection('modRequests').add({...d, status:'pending'}); await fetch('/api/custom-jersey', {method:'POST',body:JSON.stringify({...d, jerseyBase64:b64})}); alert("Sent!"); window.router.navigateTo('/creator-history'); }catch(x){alert(x.message);} };

// Utils
window.checkCreatorSubBeforeRequest = function() { if(!window.creatorSub || window.creatorSub.status!=='active') { alert("Active subscription required."); return false; } return true; };
window.checkCreatorSubForTeam = function() { if(!window.checkCreatorSubBeforeRequest()) return false; if(window.creatorSub.planCode === 'P100') { alert("Upgrade to Pro for Team Builder."); return false; } return true; };
window.loadCreatorSubscription = function() { if(window.currentUser) db.collection('creatorSubs').doc(window.currentUser.uid).onSnapshot(s => { window.creatorSub = s.data(); const el=document.getElementById('creator-sub-status'); if(el && window.creatorSub) el.innerHTML=`<span class="badge bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">${window.creatorSub.planCode} Active</span>`; }); };
window.incrementCreatorUsage = async function() { if(window.currentUser) db.collection('creatorSubs').doc(window.currentUser.uid).update({ usedRequests: firebase.firestore.FieldValue.increment(1) }); };
window.goToCreatorJersey = function() { if(window.checkCreatorSubBeforeRequest()) window.router.navigateTo('/creator-jersey'); };
window.goToCreatorTeam = function() { if(window.checkCreatorSubForTeam()) window.router.navigateTo('/creator-team'); };
