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

// Expose globally
window.firebase = firebase;
window.auth = auth;
window.db   = db;

// --- 3. GLOBAL AUTH STATE ---
window.currentUser = null;
window.isAdmin = false;
window.isElite = false;

// ADD ALL ADMIN / ELITE EMAILS HERE
const ADMIN_EMAILS = ["theabhistark17@gmail.com"]; // you can add more later
const ELITE_EMAILS = ["theastroabhi18@gmail.com",
                     "ritamsarkar875@gmail.com",
                     "thomasbuju62@gmail.com",
                     "hmishraxd@gmail.com",
                     "g.eswaravardhan@gmail.com"]; 
  // for now same list

// --- 5. LISTENER ---
auth.onAuthStateChanged((user) => {
  console.log("Auth state:", user ? user.email : "none");

  window.currentUser = user || null;
  const email = user?.email || null;

  window.isAdmin = !!email && ADMIN_EMAILS.includes(email);
  window.isElite = !!email && ELITE_EMAILS.includes(email);

  const applyUI = () => updateAuthUI(user);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyUI, { once: true });
  } else {
    applyUI();
  }
});
// --- 4. AUTH UI ---
function updateAuthUI(user) {
  const containers = [
    document.getElementById("auth-container"),
    document.getElementById("mobile-auth-container")
  ];

  containers.forEach((container) => {
    if (!container) return;

    if (user) {
      const firstName = user.displayName
        ? user.displayName.split(" ")[0]
        : "User";

      container.innerHTML = `
        <button onclick="window.router && window.router.navigateTo('/profile')"
          class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 py-1 px-2 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition group">
          <img src="${user.photoURL || '/assets/icons/default_user.png'}"
               class="w-7 h-7 rounded-full border border-white dark:border-slate-600">
          <span class="text-xs font-bold truncate max-w-[90px] text-slate-700 dark:text-slate-200">
            ${firstName}
          </span>
        </button>
      `;
    } else {
      container.innerHTML = `
        <button onclick="window.googleLogin()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2">
          <span class="material-icons text-sm">login</span>
          <span>Login</span>
        </button>
      `;
    }
  });
}


// --- 6. GOOGLE LOGIN ---
window.googleLogin = function () {
  console.log("googleLogin clicked");
  const provider = new firebase.auth.GoogleAuthProvider();

  auth
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      if (!user) return;

      console.log("Login success:", user.email);

      db.collection("users")
        .doc(user.uid)
        .set(
          {
            name: user.displayName || "",
            email: user.email || "",
            photo: user.photoURL || null,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
          },
          { merge: true }
        );
    })
    .catch((error) => {
      console.error("Login Error:", error);
      if (error.code === "auth/configuration-not-found") {
        alert("Enable Google sign-in in Firebase → Authentication → Sign-in method.");
      } else if (error.code === "auth/popup-blocked") {
        alert("Popup blocked. Allow popups for this site and try again.");
      } else if (error.code === "auth/popup-closed-by-user") {
        // ignore
      } else {
        alert("Login Failed: " + error.message);
      }
    });
};

// --- 7. LOGOUT ---
window.logout = function () {
  auth.signOut().then(() => {
    console.log("Logged out");
    if (window.router) {
      window.router.navigateTo("/");
    }
  });
};
