function CheckoutPage() {
    // 1. Cart Check
    if (!window.cart || window.cart.length === 0) {
        window.router.navigateTo('/cart');
        return '';
    }
    
    // 2. Login Check (Firebase)
    if (!window.currentUser) {
        return `
        <div class="text-center py-20 animate-fade-in">
            <h2 class="text-2xl font-bold mb-4">Login Required</h2>
            <p class="text-slate-500 mb-6">Please login to secure your order.</p>
            <button onclick="window.googleLogin()" class="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mx-auto hover:bg-slate-50 transition">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-6 h-6"> 
                Login with Google
            </button>
        </div>`;
    }

    const item = window.cart[0];
    // Random Order ID
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    window.currentOrderId = orderId;

    // --- MAGIC: DYNAMIC QR CODE GENERATOR ---
    // UPI Link Format: upi://pay?pa=ADDRESS&pn=NAME&am=AMOUNT&cu=INR
    const myUPI = "starkmods@upi"; // <--- YAHAN APNI UPI ID DALO
    const myName = "StarkModsStore"; // <--- DUKAN KA NAAM
    
    // Ye link QR code banayega jisme Amount fix hoga
    const upiLink = `upi://pay?pa=${myUPI}&pn=${myName}&am=${item.price}&cu=INR`;
    
    // API se QR Image banwana
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

    return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl text-center">
            
            <!-- Amount Display -->
            <div class="mb-6">
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                <h1 class="text-5xl font-black text-blue-600 mb-2">₹${item.price}</h1>
                <span class="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                    ${item.gameName} • ${item.planName}
                </span>
            </div>

            <!-- SMART QR CODE DISPLAY -->
            <div class="relative inline-block group mb-6">
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition"></div>
                <div class="relative bg-white p-4 rounded-2xl border border-slate-100 shadow-inner">
                    <!-- QR Image Load Hogi -->
                    <img src="${qrImageUrl}" class="w-56 h-56 object-contain mx-auto" alt="Scan to Pay">
                    
                    <!-- Overlay Text -->
                    <div class="absolute bottom-2 left-0 w-full text-center">
                        <span class="bg-black/5 text-black text-[10px] px-2 py-0.5 rounded font-bold">Scan to Pay ₹${item.price}</span>
                    </div>
                </div>
            </div>
            
            <p class="text-xs text-green-600 font-bold flex items-center justify-center gap-1 mb-6">
                <span class="material-icons text-sm">bolt</span> Amount will be auto-filled in App
            </p>

            <!-- UPI ID Copy Button -->
            <div class="flex justify-center mb-8">
                <button onclick="navigator.clipboard.writeText('${myUPI}'); alert('UPI ID Copied!');" class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-lg text-sm font-mono hover:bg-slate-200 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700">
                    <span>${myUPI}</span>
                    <span class="material-icons text-xs text-slate-400">content_copy</span>
                </button>
            </div>

            <!-- VERIFICATION INPUT SECTION -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-8 text-left">
                <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Submit Transaction ID / UTR</label>
                <div class="flex flex-col sm:flex-row gap-3">
                    <input type="text" id="trans-id" placeholder="e.g. 3284XXXXXXXX" class="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl p-4 outline-none focus:border-blue-500 transition font-mono tracking-wide">
                    
                    <button onclick="window.saveOrderToDB()" id="verify-btn" class="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 sm:w-auto w-full">
                        <span class="material-icons">check_circle</span> Verify & Submit
                    </button>
                </div>
                <p class="text-xs text-slate-400 mt-2 ml-1">Enter the 12-digit UTR number from your payment app.</p>
            </div>

        </div>
    </div>
    `;
}

// --- FIREBASE SAVE FUNCTION ---
window.saveOrderToDB = async function() {
    const transId = document.getElementById('trans-id').value.trim();
    const btn = document.getElementById('verify-btn');
    
    // 1. Validation
    if(transId.length < 8) {
        alert("⚠️ Please enter a valid 12-digit UTR/Transaction ID.");
        return;
    }

    // 2. Loading State
    btn.disabled = true;
    btn.innerHTML = `<span class="material-icons animate-spin">refresh</span> Verifying...`;

    // 3. Prepare Data
    const orderData = {
        orderId: window.currentOrderId,
        userId: window.currentUser.uid,       // Firebase User ID
        userName: window.currentUser.displayName,
        userEmail: window.currentUser.email,
        userPhoto: window.currentUser.photoURL,
        item: window.cart[0],
        amount: window.cart[0].price,
        transId: transId,
        status: 'pending',                    // Status: pending -> approved
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // 4. Save to Firestore Database
        await db.collection('orders').add(orderData);
        
        // 5. Telegram Alert (Optional)
        const msg = `🆕 NEW ORDER (DB Saved)\nUser: ${orderData.userName}\nPlan: ${orderData.item.gameName}\nAmount: ₹${orderData.amount}\nUTR: ${transId}\nStatus: Pending`;
        // Agar aap chahein to yahan window.open use kar sakte hain admin ko batane ke liye
        // window.open(`https://t.me/AbnixSH?text=${encodeURIComponent(msg)}`, '_blank');

        // 6. Success & Redirect
        alert("✅ Order Placed Successfully! Check 'My Profile' for status.");
        
        // Cart clear karo
        window.cart = [];
        
        // Profile page par le jao
        window.router.navigateTo('/profile'); // Is page ka code bhi chahiye hoga agar nahi hai

    } catch (e) {
        console.error("Firebase Error:", e);
        alert("Error saving order: " + e.message);
        btn.disabled = false;
        btn.innerHTML = "Verify & Submit";
    }
};
