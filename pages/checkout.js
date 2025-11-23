function CheckoutPage() {
    if (!window.cart || window.cart.length === 0) {
        window.router.navigateTo('/cart');
        return '';
    }

    const item = window.cart[0];
    
    // Initialize with UPI
    setTimeout(() => window.updatePaymentMethod('upi'), 50);

    return `
    <div class="max-w-4xl mx-auto animate-fade-in">
        
        <!-- Header -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold">Secure Checkout</h1>
            <p class="text-slate-500 mt-2">Complete your purchase safely.</p>
        </div>

        <div class="grid md:grid-cols-12 gap-8">
            
            <!-- LEFT: Payment Methods (Cols 7) -->
            <div class="md:col-span-7">
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <h3 class="font-bold text-lg mb-4">Select Payment Method</h3>
                    
                    <!-- Tabs -->
                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <button id="pay-upi" onclick="window.updatePaymentMethod('upi')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-blue-500 transition flex flex-col items-center justify-center gap-2">
                            <span class="material-icons text-green-600 text-2xl">qr_code_2</span>
                            <span class="text-xs font-bold">UPI / QR</span>
                        </button>
                        <button id="pay-ep" onclick="window.updatePaymentMethod('ep')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-green-500 transition flex flex-col items-center justify-center gap-2">
                            <span class="material-icons text-green-600 text-2xl">account_balance_wallet</span>
                            <span class="text-xs font-bold">EasyPaisa</span>
                        </button>
                        <button id="pay-paypal" onclick="window.updatePaymentMethod('paypal')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-blue-600 transition flex flex-col items-center justify-center gap-2">
                            <span class="material-icons text-blue-600 text-2xl">public</span>
                            <span class="text-xs font-bold">PayPal</span>
                        </button>
                        <button id="pay-bkash" onclick="window.updatePaymentMethod('bkash')" class="payment-tab border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-pink-500 transition flex flex-col items-center justify-center gap-2">
                            <span class="material-icons text-pink-500 text-2xl">payments</span>
                            <span class="text-xs font-bold">bKash</span>
                        </button>
                    </div>

                    <!-- Dynamic Details Box -->
                    <div id="payment-details" class="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-700 min-h-[200px] flex flex-col items-center justify-center">
                        <!-- JS fills this -->
                    </div>
                </div>
            </div>

            <!-- RIGHT: Summary (Cols 5) -->
            <div class="md:col-span-5">
                <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg sticky top-24">
                    <h3 class="font-bold text-lg mb-4">Order Summary</h3>
                    
                    <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 text-sm">
                        <span class="text-slate-500">Item</span>
                        <span class="font-medium">${item.gameId.toUpperCase()} Mod</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 text-sm">
                        <span class="text-slate-500">Plan</span>
                        <span class="font-medium">${item.name}</span>
                    </div>
                    
                    <div class="flex justify-between py-4 text-xl font-bold">
                        <span>Total</span>
                        <span class="text-blue-600">₹${item.price}</span>
                    </div>

                    <button onclick="window.confirmOrder()" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2">
                        <span class="material-icons">check_circle</span> I Have Paid
                    </button>
                    <p class="text-center text-xs text-slate-400 mt-3">Clicking button will open Telegram to send proof.</p>
                </div>
            </div>

        </div>
    </div>
    `;
}

// Payment Logic
window.updatePaymentMethod = function(method) {
    window.selectedMethod = method;
    const item = window.cart[0];
    const box = document.getElementById('payment-details');
    
    // Visuals
    document.querySelectorAll('.payment-tab').forEach(el => {
        el.classList.remove('border-blue-600', 'bg-blue-50', 'dark:bg-slate-800', 'ring-2');
        el.classList.add('border-slate-200', 'dark:border-slate-700');
    });
    const active = document.getElementById(`pay-${method}`);
    if(active) active.classList.add('border-blue-600', 'bg-blue-50', 'dark:bg-slate-800', 'ring-2');

    // Content
    if(method === 'upi') {
        box.innerHTML = `
            <div class="bg-white p-2 rounded mb-3 shadow-sm"><img src="assets/img/qrcode.jpg" class="w-32 h-32 object-contain"></div>
            <div class="font-mono font-bold bg-slate-200 dark:bg-black/50 px-3 py-1 rounded select-all">starkmods@upi</div>
            <p class="text-xs text-slate-500 mt-2">Scan & Pay ₹${item.price}</p>
        `;
    } else if(method === 'paypal') {
        const usd = (item.price / 85).toFixed(2);
        box.innerHTML = `
            <span class="material-icons text-4xl text-blue-600 mb-2">public</span>
            <h4 class="font-bold">PayPal International</h4>
            <div class="font-mono font-bold bg-slate-200 dark:bg-black/50 px-3 py-1 rounded mt-2 select-all">pay@starkmods.store</div>
            <p class="text-xs text-slate-500 mt-2">Amount to pay: <strong>$${usd}</strong></p>
        `;
    } else if(method === 'ep') {
        const pkr = Math.floor(item.price * 3.3);
        box.innerHTML = `
            <span class="material-icons text-4xl text-green-600 mb-2">account_balance</span>
            <h4 class="font-bold">EasyPaisa / JazzCash</h4>
            <div class="font-mono text-xl font-bold bg-slate-200 dark:bg-black/50 px-3 py-1 rounded mt-2 select-all">0300-1234567</div>
            <p class="text-xs text-slate-500 mt-2">Title: Stark Admin</p>
            <p class="text-sm font-bold mt-1 text-green-600">PKR ${pkr}</p>
        `;
    } else {
        const taka = Math.floor(item.price * 1.4);
        box.innerHTML = `
            <span class="material-icons text-4xl text-pink-600 mb-2">payments</span>
            <h4 class="font-bold">bKash Personal</h4>
            <div class="font-mono text-xl font-bold bg-slate-200 dark:bg-black/50 px-3 py-1 rounded mt-2 select-all">017-12345678</div>
            <p class="text-sm font-bold mt-1 text-pink-600">৳${taka}</p>
        `;
    }
};

window.confirmOrder = function() {
    const item = window.cart[0];
    const method = window.selectedMethod.toUpperCase();
    const msg = `ORDER VERIFICATION:\nProduct: ${item.gameId.toUpperCase()} Mod\nPlan: ${item.name}\nPrice: ${item.price}\nMethod: ${method}\n\nI have completed the payment. Sending proof now.`;
    window.open(`https://t.me/AbnixSH?text=${encodeURIComponent(msg)}`, '_blank');
};