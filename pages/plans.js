// pages/plans.js

// Payment Icons (Inke liye images assets/icons folder me honi chahiye)
// Agar images nahi hain to ye text dikhayega
const ICONS = {
    upi: 'assets/icons/pay_upi.png',     // PhonePe/Paytm logo
    ep: 'assets/icons/pay_easypaisa.png', // EasyPaisa Logo
    bkash: 'assets/icons/pay_bkash.png',  // bKash Logo
    paypal: 'assets/icons/pay_paypal.png' // PayPal Logo
};

window.PlansPage = function() {
    // Check if cart is empty
    if (!window.cart || window.cart.length === 0) {
        return `
        <div class="max-w-md mx-auto text-center py-20">
            <span class="material-icons text-6xl text-slate-300 mb-4">shopping_cart_checkout</span>
            <h2 class="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p class="text-slate-500 mb-6">Go back and select a game plan first.</p>
            <button onclick="window.router.navigateTo('/')" class="btn">Browse Mods</button>
        </div>`;
    }

    const item = window.cart[0]; // Get current item

    // Initialize Payment Logic
    setTimeout(() => window.updateCheckoutPayment('upi'), 100);

    return `
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-center">Checkout</h1>

        <div class="grid md:grid-cols-2 gap-8">
            
            <div class="app-card p-6 rounded-2xl h-fit">
                <h3 class="font-bold text-lg mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Order Summary</h3>
                
                <div class="flex items-center gap-4 mb-4">
                    <img src="${item.image}" class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <div class="font-bold text-lg">${item.gameName}</div>
                        <div class="text-slate-500 text-sm">${item.planName}</div>
                    </div>
                </div>
                
                <div class="flex justify-between items-center text-xl font-bold mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <span>Total</span>
                    <span class="text-blue-600">₹${item.price}</span>
                </div>
            </div>

            <div class="app-card p-6 rounded-2xl">
                <h3 class="font-bold text-lg mb-4">Select Payment Method</h3>
                
                <div class="grid grid-cols-2 gap-3 mb-6">
                    <button id="chk-upi" onclick="window.updateCheckoutPayment('upi')" class="pay-option border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition">
                        <span class="material-icons text-green-500 text-3xl">qr_code_scanner</span>
                        <span class="text-xs font-bold">UPI / QR</span>
                    </button>
                    
                    <button id="chk-ep" onclick="window.updateCheckoutPayment('ep')" class="pay-option border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-green-500 transition">
                        <span class="material-icons text-green-600 text-3xl">account_balance_wallet</span>
                        <span class="text-xs font-bold">EasyPaisa</span>
                    </button>

                    <button id="chk-paypal" onclick="window.updateCheckoutPayment('paypal')" class="pay-option border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-600 transition">
                        <span class="material-icons text-blue-600 text-3xl">public</span>
                        <span class="text-xs font-bold">PayPal</span>
                    </button>

                    <button id="chk-bkash" onclick="window.updateCheckoutPayment('bkash')" class="pay-option border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-pink-500 transition">
                        <span class="material-icons text-pink-500 text-3xl">payments</span>
                        <span class="text-xs font-bold">bKash</span>
                    </button>
                </div>

                <div id="checkout-details" class="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 mb-6 border border-slate-200 dark:border-slate-700 text-center">
                    </div>

                <button onclick="window.confirmOrder()" class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-2">
                    <span class="material-icons">send</span> Confirm & Send Proof
                </button>
                <p class="text-center text-xs text-slate-400 mt-3">You will be redirected to Telegram to verify payment.</p>
            </div>
        </div>
    </div>
    `;
};

// --- CHECKOUT LOGIC ---
window.updateCheckoutPayment = function(method) {
    window.selectedMethod = method;
    const item = window.cart[0];
    const detailsBox = document.getElementById('checkout-details');
    
    // Reset borders
    document.querySelectorAll('.pay-option').forEach(btn => {
        btn.classList.remove('border-blue-600', 'bg-blue-50', 'dark:bg-slate-800');
        btn.classList.add('border-slate-200', 'dark:border-slate-700');
    });
    
    // Highlight Active
    const activeBtn = document.getElementById(`chk-${method}`);
    if(activeBtn) {
        activeBtn.classList.remove('border-slate-200', 'dark:border-slate-700');
        activeBtn.classList.add('border-blue-600', 'bg-blue-50', 'dark:bg-slate-800');
    }

    // Content
    if(method === 'upi') {
        detailsBox.innerHTML = `
            <div class="mb-3 bg-white p-2 inline-block rounded border">
                <img src="assets/img/qrcode.jpg" class="w-32 h-32 object-contain">
            </div>
            <div class="font-mono text-sm font-bold bg-slate-200 dark:bg-slate-800 p-2 rounded select-all">starkmods@upi</div>
            <p class="text-xs text-slate-500 mt-2">Pay ₹${item.price} via Paytm/PhonePe</p>
        `;
    } else if (method === 'ep') {
        const pkrPrice = Math.floor(item.price * 3.3);
        detailsBox.innerHTML = `
            <div class="text-green-600 font-bold mb-2">EasyPaisa / JazzCash</div>
            <div class="font-mono text-xl font-bold bg-slate-200 dark:bg-slate-800 p-2 rounded select-all">0300-1234567</div>
            <p class="text-sm mt-1">Name: Stark Admin</p>
            <p class="text-xs text-slate-500 mt-2 font-bold">Amount: PKR ${pkrPrice}</p>
        `;
    } else if (method === 'paypal') {
        const usdPrice = (item.price / 85).toFixed(2);
        detailsBox.innerHTML = `
            <div class="text-blue-600 font-bold mb-2">PayPal International</div>
            <div class="font-mono text-sm font-bold bg-slate-200 dark:bg-slate-800 p-2 rounded select-all">pay@starkmods.store</div>
            <p class="text-xs text-slate-500 mt-2 font-bold">Amount: $${usdPrice}</p>
        `;
    } else { // bKash
        const takaPrice = Math.floor(item.price * 1.4);
        detailsBox.innerHTML = `
            <div class="text-pink-600 font-bold mb-2">bKash Personal</div>
            <div class="font-mono text-xl font-bold bg-slate-200 dark:bg-slate-800 p-2 rounded select-all">017-12345678</div>
            <p class="text-xs text-slate-500 mt-2 font-bold">Amount: ৳${takaPrice}</p>
        `;
    }
};

window.confirmOrder = function() {
    const item = window.cart[0];
    const method = window.selectedMethod.toUpperCase();
    const telegramUser = "AbnixSH"; 
    const message = `ORDER REQUEST:\nGame: ${item.gameName}\nPlan: ${item.planName}\nPrice: ${item.price}\nMethod: ${method}\n\nI have made the payment. Here is the proof:`;
    window.open(`https://t.me/${telegramUser}?text=${encodeURIComponent(message)}`, '_blank');
};
