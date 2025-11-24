// --- 1. FIREBASE CONFIGURATION ---
// Yahan apna code replace karein (Firebase Console > Project Settings > General > Web App)
const firebaseConfig = {
    apiKey: "AIzaSyA-90IyGJgLNB_MB80nk_r08LdbEPzYVU4", // <--- REPLACE THIS
    authDomain: "starkmods-f0a41.firebaseapp.com", // <--- REPLACE THIS
    projectId: "starkmods-f0a41", // <--- REPLACE THIS
    storageBucket: "starkmods-f0a41.firebasestorage.app",
    messagingSenderId: "114676638526",
    appId: "1:114676638526:web:332102f93a62376270026f"
};


// --- 2. INITIALIZE FIREBASE ---
// Check if Firebase is already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

window.auth = auth;
window.db = db;

db.collection('orders')...
window.db.collection('orders')...
// --- 3. GLOBAL VARIABLES ---
window.currentUser = null;
window.isAdmin = false;

// APNA EMAIL YAHAN DALEIN (Admin Power ke liye)
const ADMIN_EMAIL = "theabhistark17@gmail.com"; 

// --- 4. AUTH LISTENER (Login Status Check) ---
auth.onAuthStateChanged(user => {
    if (user) {
        // User Logged In
        window.currentUser = user;
        window.isAdmin = (user.email === ADMIN_EMAIL);
        console.log("Logged in as:", user.email);
        
        // UI Update
        updateAuthUI(user);
    } else {
        // User Logged Out
        window.currentUser = null;
        window.isAdmin = false;
        
        // UI Update
        updateAuthUI(null);
    }
});

// --- 5. UI UPDATER (Header Button) ---
function updateAuthUI(user) {
    // Desktop & Mobile Containers
    const containers = [
        document.getElementById('auth-container'), // Desktop Header
        document.getElementById('mobile-auth-container') // Mobile Menu (Optional)
    ];

    containers.forEach(container => {
        if (!container) return;

        if (user) {
            // SHOW PROFILE PIC & NAME
            // User ka first name nikalna
            const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
            
            container.innerHTML = `
                <button onclick="window.router.navigateTo('/profile')" class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 py-1 px-2 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition group">
                    <img src="${user.photoURL || 'assets/icons/default_user.png'}" class="w-7 h-7 rounded-full border border-white dark:border-slate-600">
                    <span class="text-xs font-bold truncate max-w-[80px] text-slate-700 dark:text-slate-200">${firstName}</span>
                </button>
            `;
        } else {
            // SHOW LOGIN BUTTON
            container.innerHTML = `
                <button onclick="window.googleLogin()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2">
                    <span class="material-icons text-sm">login</span> 
                    <span>Login</span>
                </button>
            `;
        }
    });
}

// --- 6. LOGIN FUNCTION ---
window.googleLogin = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Login Success
            const user = result.user;
            
            // User ko Database mein save karna (First time entry)
            db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Alert hata diya hai, UI apne aap update hoga
        })
        .catch((error) => {
            console.error("Login Error:", error);
            if (error.code === 'auth/configuration-not-found') {
                alert("⚠️ Config Error: Firebase Console me Google Login enable karein.");
            } else if (error.code === 'auth/popup-closed-by-user') {
                // User ne window band kar di, kuch mat karo
            } else {
                alert("Login Failed: " + error.message);
            }
        });
};

// --- 7. LOGOUT FUNCTION ---
window.logout = function() {
    auth.signOut().then(() => {
        window.router.navigateTo('/'); // Home bhej do
        window.location.reload();      // Refresh kar do taaki sab clean ho jaye
    });
};
