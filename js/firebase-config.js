// 1. Paste Your Firebase Config Here (Firebase Console se milega)
const firebaseConfig = {
    apiKey: "AIzaSyA-90IyGJgLNB_MB80nk_r08LdbEPzYVU4", // <--- REPLACE THIS
    authDomain: "starkmods-f0a41.firebaseapp.com", // <--- REPLACE THIS
    projectId: "starkmods-f0a41", // <--- REPLACE THIS
    storageBucket: "starkmods-f0a41.firebasestorage.app",
    messagingSenderId: "114676638526",
    appId: "1:114676638526:web:332102f93a62376270026f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global User State
window.currentUser = null;
window.isAdmin = false;

// Replace with YOUR GMAIL to verify orders
const ADMIN_EMAIL = "abnixsh@gmail.com"; 

// Auth Listener
auth.onAuthStateChanged(user => {
    if (user) {
        window.currentUser = user;
        window.isAdmin = (user.email === ADMIN_EMAIL);
        updateHeaderUI(user);
        console.log("Logged in as:", user.email);
    } else {
        window.currentUser = null;
        window.isAdmin = false;
        updateHeaderUI(null);
    }
});

// Header Login/Logout UI Update
function updateHeaderUI(user) {
    const nav = document.getElementById('desktop-nav');
    const mobileNav = document.querySelector('#mobile-menu .space-y-2');
    
    // Login Button HTML
    const loginBtn = `<button onclick="window.googleLogin()" class="nav-link text-blue-600 font-bold">Login</button>`;
    // User Profile HTML
    const userProfile = `
        <button onclick="window.router.navigateTo('/profile')" class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 py-1 px-3 rounded-full">
            <img src="${user?.photoURL}" class="w-6 h-6 rounded-full">
            <span class="text-xs font-bold truncate max-w-[80px]">${user?.displayName.split(' ')[0]}</span>
        </button>
    `;

    // Update Logic (Simple replace)
    // Note: Ideally use IDs, but strictly appending for now
    if(user) {
        // Add Profile link if not exists
        if(!document.getElementById('user-profile-btn')) {
            // Custom logic to inject profile button
            const div = document.createElement('div');
            div.id = 'user-profile-btn';
            div.innerHTML = userProfile;
            document.querySelector('.flex.items-center.gap-2').prepend(div);
        }
        // Remove Login btn if exists
        const oldLogin = document.getElementById('login-btn-global');
        if(oldLogin) oldLogin.remove();
    } else {
        if(document.getElementById('user-profile-btn')) document.getElementById('user-profile-btn').remove();
        // Show login
    }
}

// Login Function
window.googleLogin = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => {
        alert("Login Successful!");
        window.location.reload();
    }).catch(e => alert(e.message));
};

window.logout = function() {
    auth.signOut().then(() => window.location.reload());
};
