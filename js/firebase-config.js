// js/firebase-config.js

// --- 1. FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyA-90IyGJgLNB_MB80nk_r08LdbEPzYVU4",
  authDomain: "starkmods-f0a41.firebaseapp.com",
  projectId: "starkmods-f0a41",
  storageBucket: "starkmods-f0a41.firebasestorage.app",
  messagingSenderId: "114676638526",
  appId: "1:114676638526:web:332102f93a62376270026f"
};

// --- 2. INITIALIZE FIREBASE ---
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Services
const auth = firebase.auth();
const db   = firebase.firestore();

// Ensure local persistence for permanent login session across tabs & restarts
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(err => {
  console.warn("Auth persistence notice:", err);
});

// Expose globally
window.firebase = firebase;
window.auth = auth;
window.db   = db;

// ADD ALL ADMIN / ELITE EMAILS HERE
const ADMIN_EMAILS = ["theabhistark17@gmail.com"];
const ELITE_EMAILS = [
  "theastroabhi18@gmail.com",
  "ritamsarkar875@gmail.com",
  "thomasbuju62@gmail.com",
  "hmishraxd@gmail.com",
  "g.eswaravardhan@gmail.com"
];

// --- 3. GLOBAL AUTH STATE WITH LOCAL STORAGE CACHE ---
window.currentUser = null;
window.isAdmin = false;
window.isElite = false;
window.authReady = false;

// Preload cached user to avoid unauthenticated flash or layout jumps
try {
  const cachedUserStr = localStorage.getItem("stark_cached_user");
  if (cachedUserStr) {
    const cached = JSON.parse(cachedUserStr);
    if (cached && cached.uid && cached.email) {
      window.currentUser = cached;
      window.isAdmin = ADMIN_EMAILS.includes(cached.email);
      window.isElite = ELITE_EMAILS.includes(cached.email);
    }
  }
} catch (e) {
  console.warn("Cached user parse error:", e);
}

// --- 4. AUTH UI (Synced Desktop & Mobile) ---
function updateAuthUI(user) {
  const desktopContainer = document.getElementById("auth-container");
  const mobileContainer  = document.getElementById("mobile-auth-container");

  const effectiveUser = user || window.currentUser;

  // Desktop UI
  if (desktopContainer) {
    if (effectiveUser) {
      const firstName = effectiveUser.displayName ? effectiveUser.displayName.split(" ")[0] : "User";
      desktopContainer.innerHTML = `
        <button onclick="window.router && window.router.navigateTo('/profile')"
          class="flex items-center gap-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 py-1.5 px-3 rounded-full border border-black/5 dark:border-white/10 transition-all active:scale-95 group text-xs font-semibold"
          title="My Profile">
          <img src="${effectiveUser.photoURL || '/assets/icons/default_user.png'}"
               class="w-5 h-5 rounded-full object-cover border border-white/50 dark:border-slate-700"
               onerror="this.src='/assets/icons/stark-32.png'">
          <span class="max-w-[85px] truncate text-slate-800 dark:text-slate-200">${firstName}</span>
        </button>
      `;
    } else {
      desktopContainer.innerHTML = `
        <button onclick="window.googleLogin()"
          class="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95">
          <span class="material-icons text-sm">login</span>
          <span>Login</span>
        </button>
      `;
    }
  }

  // Mobile Menu UI
  if (mobileContainer) {
    if (effectiveUser) {
      mobileContainer.innerHTML = `
        <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 mb-2">
          <div class="flex items-center gap-3 overflow-hidden">
            <img src="${effectiveUser.photoURL || '/assets/icons/default_user.png'}"
                 class="w-9 h-9 rounded-full object-cover border border-white dark:border-slate-700 flex-shrink-0"
                 onerror="this.src='/assets/icons/stark-32.png'">
            <div class="overflow-hidden">
              <div class="text-xs font-bold text-slate-800 dark:text-white truncate">${effectiveUser.displayName || 'User'}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${effectiveUser.email}</div>
            </div>
          </div>
          <button onclick="window.logout()" class="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition flex-shrink-0">
            Logout
          </button>
        </div>
      `;
    } else {
      mobileContainer.innerHTML = `
        <button onclick="window.googleLogin()"
          class="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow transition-all flex items-center justify-center gap-2 active:scale-95 mb-2">
          <span class="material-icons text-base">login</span>
          <span>Sign in with Google</span>
        </button>
      `;
    }
  }
}
window.updateAuthUI = updateAuthUI;

// Handle Redirect Login (for mobile or blocked popups)
auth.getRedirectResult().then((result) => {
  if (result && result.user) {
    console.log("Redirect login success:", result.user.email);
    handleUserSession(result.user);
  }
}).catch((err) => {
  console.warn("Redirect auth info:", err.message);
});

function handleUserSession(user) {
  if (!user) return;
  const userData = {
    uid: user.uid,
    name: user.displayName || "",
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || null,
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection("users").doc(user.uid).set(userData, { merge: true }).catch(() => {});
}

// --- 5. AUTH LISTENER ---
auth.onAuthStateChanged((user) => {
  console.log("Auth state verified:", user ? user.email : "none");

  window.currentUser = user || null;
  const email = user?.email || null;

  window.isAdmin = !!email && ADMIN_EMAILS.includes(email);
  window.isElite = !!email && ELITE_EMAILS.includes(email);
  window.authReady = true;

  if (user) {
    try {
      localStorage.setItem("stark_cached_user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
    } catch (e) {}
    handleUserSession(user);
  } else {
    try {
      localStorage.removeItem("stark_cached_user");
    } catch (e) {}
  }

  // Update Admin icon visibility
  if (window.updateAdminIcon) {
    window.updateAdminIcon();
  }

  // Update Header UI
  updateAuthUI(user);

  // If current page is profile or admin, smoothly update content to reflect auth
  const currentPath = location.pathname.replace(/\/$/, '') || '/';
  const authDependentPaths = ['/profile', '/admin', '/admin-orders', '/admin-sub-orders', '/admin-user-orders', '/admin-elite-wallets', '/creator-admin'];
  if (window.router && authDependentPaths.includes(currentPath)) {
    window.router.handleRoute(currentPath);
  }
});

// Initial UI sync
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => updateAuthUI(window.currentUser), { once: true });
} else {
  updateAuthUI(window.currentUser);
}

// --- 6. GOOGLE LOGIN WITH AUTO REDIRECT FALLBACK ---
window.googleLogin = function () {
  console.log("Starting Google login");
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return auth.signInWithPopup(provider);
    })
    .then((result) => {
      const user = result.user;
      if (user) {
        console.log("Login success:", user.email);
        handleUserSession(user);
      }
    })
    .catch((error) => {
      console.warn("Popup sign-in issue, trying redirect fallback:", error.code);
      if (error.code === "auth/popup-blocked" || error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
        // Fallback to seamless redirect on mobile or popup-blocked
        auth.signInWithRedirect(provider).catch((redirErr) => {
          alert("Login error: " + redirErr.message);
        });
      } else if (error.code === "auth/configuration-not-found") {
        alert("Google sign-in is not enabled in Firebase Console.");
      } else {
        alert("Login failed: " + error.message);
      }
    });
};

// --- 7. LOGOUT ---
window.logout = function () {
  try {
    localStorage.removeItem("stark_cached_user");
  } catch (e) {}
  window.currentUser = null;
  window.isAdmin = false;
  window.isElite = false;
  updateAuthUI(null);

  auth.signOut().then(() => {
    console.log("Logged out successfully");
    if (window.updateAdminIcon) window.updateAdminIcon();
    if (window.router) {
      window.router.navigateTo("/");
    }
  });
};
