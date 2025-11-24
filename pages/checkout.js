function CheckoutPage() {
    // Cart check
    if (!window.cart || window.cart.length === 0) {
        window.router.navigateTo('/cart');
        return '';
    }

    const item = window.cart[0];
    
    // Order ID generate karo
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    window.currentOrderId = orderId;

    return `
    <div class="max-w-3xl mx-auto animate-fade-in pb-20" id="checkout-container">
        
        <!-- PROGRESS BAR -->
        <div class="flex justify-between mb-8 relative">
            <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10"></div>
            <div class="step-dot active" id="dot-1"><span class="material-icons text-sm">person</span></div>
            <div class="step-dot" id="dot-2"><span class="material-icons text-sm">payments</span></div>
            <div class="step-dot" id="dot-3"><span class="material-icons text-sm">verified</span></div>
        </div>

        <!-- STEP 1: USER DETAILS -->
        <div id="step-1" class="step-content">
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
                <h2 class="text-2xl font-bold mb-6">1. User Details</h2>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-500 mb-1">Your Name</label>
                        <input type="text" id="user-name" placeholder="e.g. Stark Gamer" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-4 outline-none focus:border-blue-500 transition">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-slate-500 mb-1">Telegram Username / Email</label>
                        <input type="text" id="user-contact" placeholder="e.g. @mytelegram or mymail@gmail.com" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-4 outline-none focus:border-blue-500 transition">
                        <p class="text-xs text-slate-400 mt-1">We will send the Mod Key to this contact.</p>
                    </div>
                </div>

                <button onclick="window.goToStep2()" class="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
                    Next Step <span class="material-icons">arrow_forward</span>
                </button>
            </div>
        </div>

        <!-- STEP 2: PAYMENT METHOD -->
        <div id="step-2" class="step-content hidden">
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
                <h2 class="text-2xl font-bold mb-6">2. Select Payment Method</h2>
                
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <button onclick="window.selectMethod('upi')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-500 transition flex flex-col items-center gap-2">
                        <img src="assets/icons/pay_upi.png" class="h-8 object-contain" onerror="this.style.display='none'">
                        <span class="font-bold text-sm">UPI / QR</span>
                    </button>
                    <button onclick="window.selectMethod('ep')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-green-500 transition flex flex-col items-center gap-2">
                        <img src="assets/icons/pay_easypaisa.png" class="h-8 object-contain" onerror="this.style.display='none'">
                        <span class="font-bold text-sm">EasyPaisa</span>
                    </button>
                    <button onclick="window.selectMethod('binance')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-yellow-500 transition flex flex-col items-center gap-2">
                        <img src="assets/icons/pay_binance.png" class="h-8 object-contain" onerror="this.style.display='none'">
                        <span class="font-bold text-sm">Binance</span>
                    </button>
                    <button onclick="window.selectMethod('paypal')" class="pay-card border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-blue-600 transition flex flex-col items-center gap-2">
                        <img src="assets/icons/pay_paypal.png" class="h-8 object-contain" onerror="this.style.display='none'">
                        <span class="font-bold text-sm">PayPal</span>
                    </button>
                </div>

                <div class="flex gap-4">
                    <button onclick="window.goBackToStep1()" class="flex-1 py-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition">Back</button>
                    <button onclick="window.goToStep3()" id="step2-next" disabled class="flex-1 py-4 bg-slate-400 text-white rounded-xl font-bold transition cursor-not-allowed">Proceed to Pay</button>
                </div>
            </div>
        </div>

        <!-- STEP 3: PAYMENT SCREEN -->
        <div id="step-3" class="step-content hidden">
            <div id="final-step-content" class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-600 p-8 shadow-2xl relative overflow-hidden">
                
                <!-- Header Info -->
                <div class="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
                    <div>
                        <p class="text-xs text-slate-500 font-bold uppercase">Order ID</p>
                        <p class="font-mono font-bold text-lg text-blue-600">#${orderId}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-slate-500 font-bold uppercase">Amount to Pay</p>
                        <p class="font-bold text-2xl">₹${item.price}</p>
                    </div>
                </div>

                <!-- Dynamic Payment Info (QR/Number) -->
                <div id="final-payment-display" class="text-center mb-6">
                    <!-- JS will fill this -->
                </div>

                <!-- Timer -->
                <div class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-xl p-3 mb-6 flex items-center justify-center gap-2 text-red-600">
                    <span class="material-icons text-sm animate-pulse">timer</span>
                    <span class="font-mono font-bold text-lg" id="countdown-timer">05:00</span>
                </div>

                <!-- Transaction Input -->
                <div class="mb-6">
                    <label class="block text-sm font-bold text-slate-500 mb-2">Enter Transaction ID / UTR</label>
                    <input type="text" id="final-trans-id" placeholder="Paste ID here after payment..." class="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-4 font-mono focus:border-green-500 outline-none transition">
                </div>

                <button onclick="window.submitOrder()" id="btn-final-submit" class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-2 transform active:scale-95">
                    <span class="material-icons">check_circle</span> Submit & Verify
                </button>
                
                <p class="text-center text-xs text-slate-400 mt-4">
                    Automated verification takes 1-2 minutes.
                </p>
            </div>
        </div>

    </div>
    
    <style>
        .step-dot { width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; z-index: 10; transition: all 0.3s; }
        .dark .step-dot { background: #1e293b; color: #94a3b8; }
        .step-dot.active { background: #2563eb; color: white; transform: scale(1.1); box-shadow: 0 0 15px rgba(37,99,235,0.5); }
        .pay-card.selected { border-color: #2563eb; background-color: rgba(37,99,235,0.05); }
    </style>
    `;
}

// --- NAVIGATION LOGIC ---

window.goToStep2 = function() {
    const name = document.getElementById('user-name').value.trim();
    const contact = document.getElementById('user-contact').value.trim();

    if (!name || !contact) {
        alert("⚠️ Please enter your Name and Contact details.");
        return;
    }
    
    window.userDetails = { name, contact };
    
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
    document.getElementById('dot-2').classList.add('active');
};

window.goBackToStep1 = function() {
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('dot-2').classList.remove('active');
};

window.selectMethod = function(method) {
    window.selectedMethod = method;
    document.querySelectorAll('.pay-card').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    const btn = document.getElementById('step2-next');
    btn.disabled = false;
    btn.classList.remove('bg-slate-400', 'cursor-not-allowed');
    btn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'shadow-lg');
};

window.goToStep3 = function() {
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
    document.getElementById('dot-3').classList.add('active');
    
    renderFinalPaymentDetails();
    startTimer();
};

// --- PAYMENT DETAILS RENDERER ---
function renderFinalPaymentDetails() {
    const box = document.getElementById('final-payment-display');
    const method = window.selectedMethod;
    const item = window.cart[0];
    
    if(method === 'upi') {
        box.innerHTML = `
            <img src="assets/icons/qrcode.jpg" class="w-40 h-40 mx-auto border-4 border-white rounded-xl shadow-md mb-3" onerror="this.style.display='none'">
            <div class="font-mono font-bold text-xl bg-slate-100 dark:bg-black/30 px-4 py-2 rounded-lg inline-block select-all">starkmods@upi</div>
            <p class="text-sm text-slate-500 mt-2">Scan & Pay <strong class="text-blue-600">₹${item.price}</strong></p>
        `;
    } else if(method === 'ep') {
        const pkr = Math.floor(item.price * 3.3);
        box.innerHTML = `
            <div class="text-green-600 font-bold text-sm uppercase mb-2">EasyPaisa Account</div>
            <div class="font-mono font-bold text-3xl bg-slate-100 dark:bg-black/30 px-6 py-3 rounded-xl inline-block select-all tracking-wider">03001234567</div>
            <p class="text-sm text-slate-500 mt-2">Title: <strong>Stark Admin</strong></p>
            <p class="text-lg font-bold text-green-600 mt-1">Send: PKR ${pkr}</p>
        `;
    } else if(method === 'binance') {
        const usdt = (item.price / 90).toFixed(2);
        box.innerHTML = `
            <div class="text-yellow-500 font-bold text-sm uppercase mb-2">Binance Pay ID</div>
            <div class="font-mono font-bold text-3xl bg-slate-100 dark:bg-black/30 px-6 py-3 rounded-xl inline-block select-all tracking-wider">123456789</div>
            <p class="text-lg font-bold text-yellow-600 mt-2">Send: ${usdt} USDT</p>
        `;
    } else {
        box.innerHTML = `
            <div class="font-bold text-xl bg-slate-100 dark:bg-black/30 px-6 py-3 rounded-xl inline-block select-all">pay@starkmods.store</div>
            <p class="text-sm text-slate-500 mt-2">Copy Details & Pay</p>
        `;
    }
}

function startTimer() {
    let time = 300; // 5 minutes
    const display = document.getElementById('countdown-timer');
    
    const interval = setInterval(() => {
        const m = Math.floor(time / 60);
        const s = time % 60;
        display.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
        
        if(time <= 0) {
            clearInterval(interval);
            display.innerText = "EXPIRED";
            display.classList.add('text-red-600');
        }
        time--;
    }, 1000);
}

// --- SUBMIT LOGIC (Connects to Vercel API) ---
window.submitOrder = async function() {
    const transId = document.getElementById('final-trans-id').value.trim();
    const submitBtn = document.getElementById('btn-final-submit');
    
    if(transId.length < 6) {
        alert("⚠️ Please enter a valid Transaction ID.");
        return;
    }

    // 1. UI Loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-icons animate-spin">refresh</span> Processing...`;

    const orderData = {
        orderId: window.currentOrderId,
        user: window.userDetails,
        cart: window.cart[0],
        payment: { method: window.selectedMethod.toUpperCase() },
        transId: transId
    };

    try {
        // 2. Backend Call
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            // 3. Success UI
            const step3 = document.getElementById('step-3');
            const content = document.getElementById('final-step-content');
            
            content.innerHTML = `
                <div class="text-center py-10">
                    <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <span class="material-icons text-6xl text-green-600">check_circle</span>
                    </div>
                    <h2 class="text-3xl font-bold text-slate-800 dark:text-white mb-4">Order Received!</h2>
                    <p class="text-slate-500 mb-8">
                        We have received your payment details.<br>
                        Your Key has been sent to <b>${window.userDetails.contact}</b>
                    </p>
                    <div class="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl inline-block text-left border border-slate-200 dark:border-slate-700">
                        <p class="text-xs text-slate-400 uppercase font-bold">Order ID</p>
                        <p class="font-mono font-bold text-xl">#${window.currentOrderId}</p>
                    </div>
                    <div class="mt-8 space-y-3">
                        <a href="/" class="block w-full py-3 bg-blue-600 text-white rounded-lg font-bold">Back to Home</a>
                        <a href="https://t.me/AbnixSH" target="_blank" class="block w-full py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold">Contact Support</a>
                    </div>
                </div>
            `;
            
            // Clear Cart
            window.cart = [];
            updateCartBadge();
        } else {
            throw new Error(result.error || 'Server Error');
        }

    } catch (error) {
        alert("❌ Error submitting order. Check internet connection.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="material-icons">check_circle</span> Retry Submit`;
        console.error(error);
    }
};
